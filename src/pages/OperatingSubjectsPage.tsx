import { Download } from "lucide-react";
import { useState } from "react";
import { FilePreviewTable } from "../components/FilePreviewTable";
import { OperatingSubjectReviewTable } from "../components/OperatingSubjectReviewTable";
import { SemesterUploadSlots } from "../components/SemesterUploadSlots";
import { SubjectOverrideTable } from "../components/SubjectOverrideTable";
import { UploadImportLauncher } from "../components/UploadImportLauncher";
import { Button } from "../components/ui/Button";
import { PageHeader } from "../components/ui/PageHeader";
import {
  detectOperatingSubjectSemesterFromWorkbook,
  detectOperatingSubjectSemestersFromWorkbook,
  parseOperatingSubjectWorkbook,
  type OperatingSubjectSemesterColumnDetection,
  type OperatingSubjectSemesterDetectionResult
} from "../parsers/parseOperatingSubjectFile";
import {
  readWorkbookFromFile,
  workbookToPreviewTable,
  type WorkbookPreviewTable
} from "../parsers/readWorkbook";
import {
  createSemesterImportStatusId,
  useImportStatusStore
} from "../state/importStatusStore";
import {
  hasCompletedSubjectOverridesForSemester,
  useOperatingSubjectStore
} from "../state/operatingSubjectStore";
import { usePrerequisiteRuleStore } from "../state/prerequisiteRuleStore";
import {
  applySubjectOverridesToOperatingSubjects,
  upsertSubjectOverrideInList,
  useSubjectOverrideStore
} from "../state/subjectOverrideStore";
import {
  createOperatingSubjectTemplateWorkbook,
  createXlsxBlob,
  templateFileNames
} from "../templates/xlsxTemplates";
import type { Semester } from "../types/semester";
import type { SubjectOverride } from "../types/subject";
import { assignFilesToSemesters } from "../utils/detectSemesterFromFileName";
import { downloadBlob } from "../utils/downloadBlob";
import { isSameSemester, semesterLabel } from "../utils/semester";

type PreparedOperatingSubjectFile = {
  file: File;
  workbook?: Awaited<ReturnType<typeof readWorkbookFromFile>>;
  preview?: WorkbookPreviewTable;
  semesterDetection?: OperatingSubjectSemesterDetectionResult;
  semesterColumnDetections?: OperatingSubjectSemesterColumnDetection[];
};

function semesterKey(semester: Semester): string {
  return `${semester.grade}-${semester.semester}`;
}

async function prepareOperatingSubjectFile(
  file: File
): Promise<PreparedOperatingSubjectFile> {
  try {
    const workbook = await readWorkbookFromFile(file);

    return {
      file,
      workbook,
      preview: workbookToPreviewTable(workbook),
      semesterDetection: detectOperatingSubjectSemesterFromWorkbook(workbook),
      semesterColumnDetections: detectOperatingSubjectSemestersFromWorkbook(workbook)
    };
  } catch {
    return { file };
  }
}

function assignmentsFromWorkbookSemesters(
  preparedFiles: readonly PreparedOperatingSubjectFile[]
):
  | {
      file: File;
      semester: Semester;
      preparedFile: PreparedOperatingSubjectFile;
    }[]
  | undefined {
  if (preparedFiles.length === 0) {
    return undefined;
  }

  const assignments = preparedFiles.flatMap((preparedFile) => {
    if (preparedFile.semesterColumnDetections?.length) {
      return preparedFile.semesterColumnDetections.map((detection) => ({
        file: preparedFile.file,
        semester: detection.semester,
        preparedFile
      }));
    }

    const detection = preparedFile.semesterDetection;

    return detection?.status === "detected"
      ? [
          {
            file: preparedFile.file,
            semester: detection.semester,
            preparedFile
          }
        ]
      : [undefined];
  });

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

export function OperatingSubjectsPage() {
  const { clearSemesterImportStatus, importStatuses, setSemesterImportStatus } =
    useImportStatusStore();
  const {
    clearOperatingSubjectsForSemester,
    operatingSubjects,
    replaceOperatingSubjectsForSemester,
    updateOperatingSubject
  } = useOperatingSubjectStore();
  const generateCandidatesFromOperatingSubjects = usePrerequisiteRuleStore(
    (state) => state.generateCandidatesFromOperatingSubjects
  );
  const { setSubjectOverrides, subjectOverrides } = useSubjectOverrideStore();
  const [preview, setPreview] = useState<WorkbookPreviewTable>();

  async function importFileForSemester(
    file: File,
    target: Semester,
    needsReview = false,
    preparedFile?: PreparedOperatingSubjectFile
  ) {
    try {
      const workbook = preparedFile?.workbook ?? (await readWorkbookFromFile(file));
      const nextPreview = preparedFile?.preview ?? workbookToPreviewTable(workbook);
      const detectedSemester =
        preparedFile?.semesterDetection?.status === "detected"
          ? preparedFile.semesterDetection.semester
          : undefined;
      const hasTargetMismatch =
        detectedSemester !== undefined && !isSameSemester(detectedSemester, target);
      const parseResult = parseOperatingSubjectWorkbook(workbook, {
        semesterImportId: createSemesterImportStatusId("operatingSubjects", target),
        target,
        fileName: file.name
      });
      const subjectsWithOverrides = applySubjectOverridesToOperatingSubjects(
        parseResult.subjects,
        subjectOverrides
      );
      const unmatchedCount = subjectsWithOverrides.filter(
        (subject) => subject.masterMatchStatus === "unmatched"
      ).length;
      const hasReviewItems =
        needsReview ||
        hasTargetMismatch ||
        parseResult.failedRows.length > 0 ||
        unmatchedCount > 0;

      setPreview(nextPreview);
      replaceOperatingSubjectsForSemester(target, subjectsWithOverrides);
      generateCandidatesFromOperatingSubjects(
        useOperatingSubjectStore.getState().operatingSubjects
      );
      setSemesterImportStatus({
        target,
        sourceType: "operatingSubjects",
        status: hasReviewItems ? "needsReview" : "imported",
        fileName: file.name,
        rowCount: subjectsWithOverrides.length,
        message: hasReviewItems
          ? [
              needsReview
                ? `${semesterLabel(target)}로 임시 배치했습니다. 학기 매핑을 확인하세요.`
                : undefined,
              hasTargetMismatch && detectedSemester
                ? `파일 내부 학기는 ${semesterLabel(detectedSemester)}입니다. ${semesterLabel(target)} 슬롯으로 가져왔으니 확인하세요.`
                : undefined,
              parseResult.failedRows.length > 0
                ? `파싱 실패 ${parseResult.failedRows.length}행`
                : undefined,
              unmatchedCount > 0 ? `미등록 과목 ${unmatchedCount}개` : undefined
            ]
              .filter(Boolean)
              .join(" · ")
          : undefined
      });
    } catch (error) {
      setSemesterImportStatus({
        target,
        sourceType: "operatingSubjects",
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
      files.map((file) => prepareOperatingSubjectFile(file))
    );
    const workbookAssignments = assignmentsFromWorkbookSemesters(preparedFiles);

    if (workbookAssignments) {
      for (const assignment of workbookAssignments) {
        await importFileForSemester(
          assignment.file,
          assignment.semester,
          false,
          assignment.preparedFile
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

  function handleSaveOverride(override: SubjectOverride) {
    const nextOverrides = upsertSubjectOverrideInList(subjectOverrides, override);
    setSubjectOverrides(nextOverrides);
    useOperatingSubjectStore.getState().applySubjectOverrides(nextOverrides);
  }

  function handleClearSemester(target: Semester) {
    clearSemesterImportStatus("operatingSubjects", target);
    clearOperatingSubjectsForSemester(target);
  }

  function handleDownloadTemplate() {
    downloadBlob(
      createXlsxBlob(createOperatingSubjectTemplateWorkbook(operatingSubjects)),
      templateFileNames.operatingSubject
    );
  }

  const unmatchedSubjects = operatingSubjects.filter(
    (subject) => subject.masterMatchStatus === "unmatched"
  );
  const correctionCompletedSemesters = importStatuses
    .filter(
      (status) =>
        status.sourceType === "operatingSubjects" &&
        hasCompletedSubjectOverridesForSemester(operatingSubjects, status.target)
    )
    .map((status) => status.target);

  return (
    <section className="page">
      <PageHeader
        title="운영과목 업로드"
        description="학기별 운영과목 파일을 읽고 대상 학기만 교체합니다. 파일 내부의 학년/학기 값을 우선 확인하고, 알 수 없으면 슬롯별 선택으로 직접 매핑할 수 있습니다."
      />
      <div className="template-action-bar">
        <UploadImportLauncher
          onFilesSelected={handleFilesSelected}
          section="operatingSubjects"
        />
        <Button
          icon={<Download size={16} />}
          onClick={handleDownloadTemplate}
          variant="secondary"
        >
          템플릿 다운로드
        </Button>
      </div>
      <div className="section">
        <SemesterUploadSlots
          compact
          correctionCompletedSemesters={correctionCompletedSemesters}
          onClearSemester={handleClearSemester}
          onFilesSelected={handleFilesSelected}
          showUploadActions={false}
          sourceType="operatingSubjects"
          statuses={importStatuses}
        />
      </div>
      <div className="section">
        <h2>미등록 과목 보정</h2>
        <SubjectOverrideTable
          onSaveOverride={handleSaveOverride}
          overrides={subjectOverrides}
          unmatchedSubjects={unmatchedSubjects}
        />
      </div>
      <div className="section">
        <h2>운영과목 검토</h2>
        <OperatingSubjectReviewTable
          onUpdateSubject={updateOperatingSubject}
          subjects={operatingSubjects}
        />
      </div>
      <div className="section">
        <h2>파일 미리보기</h2>
        <FilePreviewTable preview={preview} />
      </div>
    </section>
  );
}
