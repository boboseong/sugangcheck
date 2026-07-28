import { useState } from "react";
import type { WorkBook } from "xlsx";
import type { CourseSelectionSemesterDetection } from "../parsers/parseCourseSelectionFile";
import type { WorkbookPreviewTable } from "../parsers/readWorkbook";
import {
  createSemesterImportStatusId,
  useImportStatusStore
} from "../state/importStatusStore";
import {
  replaceCourseSelectionRowsForSemesterInList,
  useCourseSelectionRawStore
} from "../state/courseSelectionRawStore";
import { useOperatingSubjectStore } from "../state/operatingSubjectStore";
import { useStudentSemesterPresenceStore } from "../state/studentSemesterPresenceStore";
import {
  mergeStudentsFromCourseSelectionRows,
  useStudentStore
} from "../state/studentStore";
import { useValidationRuleSettingStore } from "../state/validationRuleSettingStore";
import type { ParsedCourseSelectionRow } from "../types/courseSelection";
import type { Semester } from "../types/semester";
import { assignFilesToSemesters } from "../utils/detectSemesterFromFileName";
import { downloadBlob } from "../utils/downloadBlob";
import { isSameSemester, semesterLabel } from "../utils/semester";
import {
  appendGeneratedCourseSelectionRows,
  createGeneratedCourseSelectionRows,
  findMissingOperatingSubjectSelections,
  type MissingOperatingSubjectSelection
} from "../validation/courseSelectionOperatingSubjectCompletion";

type PreparedCourseSelectionFile = {
  file: File;
  workbook?: WorkBook;
  preview?: WorkbookPreviewTable;
  semesterDetections?: CourseSelectionSemesterDetection[];
};

export type PendingOperatingSubjectCompletion = {
  id: string;
  target: Semester;
  fileName: string;
  subjects: PendingOperatingSubjectCompletionSubject[];
  baseRows: ParsedCourseSelectionRow[];
  generatedRowsBySubjectId: Record<string, ParsedCourseSelectionRow[]>;
  baseMessageParts: string[];
  baseNeedsReview: boolean;
};

export type PendingOperatingSubjectCompletionDecision = "all" | "none";

export type PendingOperatingSubjectCompletionSubject =
  MissingOperatingSubjectSelection & {
    decision?: PendingOperatingSubjectCompletionDecision;
  };

function semesterKey(semester: Semester): string {
  return `${semester.grade}-${semester.semester}`;
}

function formatMessage(parts: readonly (string | undefined)[]): string | undefined {
  const message = parts.filter(Boolean).join(" · ");

  return message || undefined;
}

function reviewCompletionMessage(subjectCount: number): string | undefined {
  return subjectCount > 0
    ? `운영과목에는 있지만 수강신청결과에는 없는 과목 ${subjectCount.toLocaleString()}개 확인 필요`
    : undefined;
}

function completionResultMessage(
  subjects: readonly PendingOperatingSubjectCompletionSubject[]
): string | undefined {
  const allCount = subjects.filter((subject) => subject.decision === "all").length;
  const noneCount = subjects.filter((subject) => subject.decision === "none").length;

  return formatMessage([
    allCount > 0 ? `모두 이수 O ${allCount.toLocaleString()}개 반영` : undefined,
    noneCount > 0 ? `모두 이수 X ${noneCount.toLocaleString()}개 미반영` : undefined
  ]);
}

function hasSelectedAllPendingDecisions(
  completions: readonly PendingOperatingSubjectCompletion[]
): boolean {
  return (
    completions.length > 0 &&
    completions.every((completion) =>
      completion.subjects.every((subject) => subject.decision !== undefined)
    )
  );
}

// The workbook parsers pull in xlsx, which dwarfs the rest of the app. They are
// only reachable once a user picks a file, so they load on demand.
function loadWorkbookModules() {
  return Promise.all([
    import("../parsers/parseCourseSelectionFile"),
    import("../parsers/readWorkbook")
  ]);
}

async function prepareCourseSelectionFile(
  file: File
): Promise<PreparedCourseSelectionFile> {
  try {
    const [
      { detectCourseSelectionSemestersFromWorkbook },
      { readWorkbookFromFile, workbookToPreviewTable }
    ] = await loadWorkbookModules();
    const workbook = await readWorkbookFromFile(file);

    return {
      file,
      workbook,
      preview: workbookToPreviewTable(workbook),
      semesterDetections: detectCourseSelectionSemestersFromWorkbook(workbook)
    };
  } catch {
    return { file };
  }
}

function assignmentsFromWorkbookSemesters(
  preparedFiles: readonly PreparedCourseSelectionFile[]
):
  | {
      file: File;
      semester: Semester;
      sheetName?: string;
      preparedFile: PreparedCourseSelectionFile;
    }[]
  | undefined {
  if (preparedFiles.length === 0) {
    return undefined;
  }

  const assignments = preparedFiles.flatMap((preparedFile) =>
    preparedFile.semesterDetections?.length
      ? preparedFile.semesterDetections.map((detection) => ({
          file: preparedFile.file,
          semester: detection.semester,
          sheetName: detection.sheetName,
          preparedFile
        }))
      : [undefined]
  );

  if (assignments.some((assignment) => !assignment)) {
    return undefined;
  }

  const semesters = assignments.map((assignment) =>
    assignment ? semesterKey(assignment.semester) : ""
  );

  if (new Set(semesters).size !== assignments.length) {
    return undefined;
  }

  return assignments.flatMap((assignment) => (assignment ? [assignment] : []));
}

export function useCourseSelectionImport() {
  const { clearSemesterImportStatus, importStatuses, setSemesterImportStatus } =
    useImportStatusStore();
  const {
    clearCourseSelectionRowsForSemester,
    courseSelectionRows,
    replaceCourseSelectionRowsForSemester
  } = useCourseSelectionRawStore();
  const { setStudents } = useStudentStore();
  const {
    markSemesterUnknown,
    studentSemesterPresence,
    updateFromCourseSelectionRows
  } = useStudentSemesterPresenceStore();
  const seedCreditDifferenceCriteriaFromInputs = useValidationRuleSettingStore(
    (state) => state.seedCreditDifferenceCriteriaFromInputs
  );
  const [preview, setPreview] = useState<WorkbookPreviewTable>();
  const [pendingOperatingSubjectCompletions, setPendingOperatingSubjectCompletions] =
    useState<PendingOperatingSubjectCompletion[]>([]);

  function refreshDerivedCourseSelectionState(
    nextRows: ParsedCourseSelectionRow[],
    targets: readonly Semester[]
  ) {
    const nextStudents = mergeStudentsFromCourseSelectionRows([], nextRows);

    setStudents(nextStudents);
    for (const target of targets) {
      updateFromCourseSelectionRows(nextStudents, nextRows, target);
    }
    seedCreditDifferenceCriteriaFromInputs({
      courseSelectionRows: nextRows,
      operatingSubjects: useOperatingSubjectStore.getState().operatingSubjects
    });
  }

  async function importFileForSemester(
    file: File,
    target: Semester,
    needsReview = false,
    preparedFile?: PreparedCourseSelectionFile,
    sheetName?: string
  ) {
    try {
      const [
        { parseCourseSelectionWorkbook },
        { readWorkbookFromFile, workbookToPreviewTable }
      ] = await loadWorkbookModules();
      const workbook = preparedFile?.workbook ?? (await readWorkbookFromFile(file));
      const nextPreview = sheetName
        ? workbookToPreviewTable(workbook, { sheetName })
        : preparedFile?.preview ?? workbookToPreviewTable(workbook);
      const parseResult = parseCourseSelectionWorkbook(workbook, {
        semesterImportId: createSemesterImportStatusId("courseSelections", target),
        target,
        fileName: file.name,
        sheetName
      });
      const operatingSubjects = useOperatingSubjectStore.getState().operatingSubjects;
      const missingSubjects = findMissingOperatingSubjectSelections({
        target,
        detectedSubjects: parseResult.detectedSubjects,
        operatingSubjects
      });
      const hasReviewItems = needsReview || parseResult.failedRows.length > 0;
      const baseMessageParts = [
        needsReview
          ? `${semesterLabel(target)}로 임시 배치했습니다. 학기 매핑을 확인하세요.`
          : undefined,
        parseResult.failedRows.length > 0
          ? `파싱 실패 ${parseResult.failedRows.length}행`
          : undefined
      ].filter(Boolean) as string[];

      setPreview(nextPreview);

      if (missingSubjects.length > 0) {
        const generatedRowsBySubjectId: Record<string, ParsedCourseSelectionRow[]> =
          Object.fromEntries(
            missingSubjects.map((subject) => [
              subject.id,
              createGeneratedCourseSelectionRows({
                semesterImportId: parseResult.semesterImportId,
                fileName: parseResult.fileName,
                sheetName: parseResult.sheetName,
                target,
                students: parseResult.students,
                subjects: [subject],
                existingRows: parseResult.rows
              })
            ])
          );
        const pendingCompletion: PendingOperatingSubjectCompletion = {
          id: `${parseResult.semesterImportId}-missing-operating-subjects`,
          target,
          fileName: file.name,
          subjects: missingSubjects.map((subject) => ({ ...subject })),
          baseRows: parseResult.rows,
          generatedRowsBySubjectId,
          baseMessageParts,
          baseNeedsReview: hasReviewItems
        };

        setSemesterImportStatus({
          target,
          sourceType: "courseSelections",
          status: "needsReview",
          fileName: file.name,
          rowCount: parseResult.rows.length,
          message: formatMessage([
            ...baseMessageParts,
            reviewCompletionMessage(missingSubjects.length)
          ])
        });
        setPendingOperatingSubjectCompletions((current) => [
          ...current.filter((completion) => !isSameSemester(completion.target, target)),
          pendingCompletion
        ]);
        return;
      }

      const nextRows = replaceCourseSelectionRowsForSemester(
        target,
        parseResult.rows
      );
      refreshDerivedCourseSelectionState(nextRows, [target]);
      setSemesterImportStatus({
        target,
        sourceType: "courseSelections",
        status: hasReviewItems ? "needsReview" : "imported",
        fileName: file.name,
        rowCount: parseResult.rows.length,
        message: formatMessage(baseMessageParts)
      });
      setPendingOperatingSubjectCompletions((current) =>
        current.filter((completion) => !isSameSemester(completion.target, target))
      );
    } catch (error) {
      setPendingOperatingSubjectCompletions((current) =>
        current.filter((completion) => !isSameSemester(completion.target, target))
      );
      setSemesterImportStatus({
        target,
        sourceType: "courseSelections",
        status: "error",
        fileName: file.name,
        message: error instanceof Error ? error.message : "파일을 읽지 못했습니다."
      });
    }
  }

  async function handleFilesSelected(files: File[], target?: Semester) {
    if (target) {
      const file = files[0];

      if (file) {
        await importFileForSemester(file, target);
      }

      return;
    }

    const assignments = assignFilesToSemesters(files);
    const preparedFiles = await Promise.all(
      files.map((file) => prepareCourseSelectionFile(file))
    );
    const workbookAssignments = assignmentsFromWorkbookSemesters(preparedFiles);

    if (workbookAssignments) {
      for (const assignment of workbookAssignments) {
        await importFileForSemester(
          assignment.file,
          assignment.semester,
          false,
          assignment.preparedFile,
          assignment.sheetName
        );
      }

      return;
    }

    const preparedFileByFile = new Map(
      preparedFiles.map((preparedFile) => [preparedFile.file, preparedFile])
    );

    for (const assignment of assignments) {
      if (assignment.semester) {
        await importFileForSemester(
          assignment.file,
          assignment.semester,
          assignment.status === "needsReview",
          preparedFileByFile.get(assignment.file)
        );
      }
    }
  }

  function handleClearSemester(target: Semester) {
    clearSemesterImportStatus("courseSelections", target);
    const nextRows = clearCourseSelectionRowsForSemester(target);
    const nextStudents = mergeStudentsFromCourseSelectionRows([], nextRows);
    setStudents(nextStudents);
    markSemesterUnknown(nextStudents, target);
    setPendingOperatingSubjectCompletions((current) =>
      current.filter((completion) => !isSameSemester(completion.target, target))
    );
  }

  function setPendingOperatingSubjectCompletionDecision(
    completionId: string,
    subjectId: string,
    decision: PendingOperatingSubjectCompletionDecision
  ) {
    setPendingOperatingSubjectCompletions((current) =>
      current.map((completion) =>
        completion.id === completionId
          ? {
              ...completion,
              subjects: completion.subjects.map((subject) =>
                subject.id === subjectId ? { ...subject, decision } : subject
              )
            }
          : completion
      )
    );
  }

  function completePendingOperatingSubjectCompletions() {
    if (!hasSelectedAllPendingDecisions(pendingOperatingSubjectCompletions)) {
      return;
    }

    let nextRows = useCourseSelectionRawStore.getState().courseSelectionRows;

    for (const completion of pendingOperatingSubjectCompletions) {
      const generatedRows = completion.subjects.flatMap((subject) =>
        subject.decision === "all"
          ? (completion.generatedRowsBySubjectId[subject.id] ?? [])
          : []
      );
      const nextSemesterRows = appendGeneratedCourseSelectionRows(
        completion.baseRows,
        generatedRows
      );

      nextRows = replaceCourseSelectionRowsForSemesterInList(
        nextRows,
        completion.target,
        nextSemesterRows
      );
      setSemesterImportStatus({
        target: completion.target,
        sourceType: "courseSelections",
        status: completion.baseNeedsReview ? "needsReview" : "imported",
        fileName: completion.fileName,
        rowCount: nextSemesterRows.length,
        message: formatMessage([
          ...completion.baseMessageParts,
          completionResultMessage(completion.subjects)
        ])
      });
    }

    useCourseSelectionRawStore.getState().setCourseSelectionRows(nextRows);
    refreshDerivedCourseSelectionState(
      nextRows,
      pendingOperatingSubjectCompletions.map((completion) => completion.target)
    );
    setPendingOperatingSubjectCompletions([]);
  }

  async function handleDownloadTemplate() {
    const { createCourseSelectionTemplateWorkbook, createXlsxBlob, templateFileNames } =
      await import("../templates/xlsxTemplates");

    await downloadBlob(
      createXlsxBlob(createCourseSelectionTemplateWorkbook(courseSelectionRows)),
      templateFileNames.courseSelection
    );
  }

  return {
    courseSelectionRows,
    canCompletePendingOperatingSubjectCompletions:
      hasSelectedAllPendingDecisions(pendingOperatingSubjectCompletions),
    completePendingOperatingSubjectCompletions,
    handleClearSemester,
    handleDownloadTemplate,
    handleFilesSelected,
    importStatuses,
    pendingOperatingSubjectCompletions,
    preview,
    setPendingOperatingSubjectCompletionDecision,
    studentSemesterPresence
  };
}
