import { Download } from "lucide-react";
import { useState } from "react";
import { CourseSelectionReviewTable } from "../components/CourseSelectionReviewTable";
import { FilePreviewTable } from "../components/FilePreviewTable";
import { SemesterUploadSlots } from "../components/SemesterUploadSlots";
import { StudentCourseSummaryTable } from "../components/StudentCourseSummaryTable";
import { StudentPresenceTable } from "../components/StudentPresenceTable";
import { UploadImportLauncher } from "../components/UploadImportLauncher";
import { Button } from "../components/ui/Button";
import { PageHeader } from "../components/ui/PageHeader";
import {
  detectCourseSelectionSemestersFromWorkbook,
  parseCourseSelectionWorkbook,
  type CourseSelectionSemesterDetection
} from "../parsers/parseCourseSelectionFile";
import {
  readWorkbookFromFile,
  workbookToPreviewTable,
  type WorkbookPreviewTable
} from "../parsers/readWorkbook";
import {
  createSemesterImportStatusId,
  useImportStatusStore
} from "../state/importStatusStore";
import { useCourseSelectionRawStore } from "../state/courseSelectionRawStore";
import { useOperatingSubjectStore } from "../state/operatingSubjectStore";
import { useStudentSemesterPresenceStore } from "../state/studentSemesterPresenceStore";
import {
  mergeStudentsFromCourseSelectionRows,
  useStudentStore
} from "../state/studentStore";
import { useSubjectOverrideStore } from "../state/subjectOverrideStore";
import {
  createCourseSelectionTemplateWorkbook,
  createXlsxBlob,
  templateFileNames
} from "../templates/xlsxTemplates";
import type { Semester } from "../types/semester";
import { assignFilesToSemesters } from "../utils/detectSemesterFromFileName";
import { downloadBlob } from "../utils/downloadBlob";
import { semesterLabel } from "../utils/semester";

type PreparedCourseSelectionFile = {
  file: File;
  workbook?: Awaited<ReturnType<typeof readWorkbookFromFile>>;
  preview?: WorkbookPreviewTable;
  semesterDetections?: CourseSelectionSemesterDetection[];
};

function semesterKey(semester: Semester): string {
  return `${semester.grade}-${semester.semester}`;
}

async function prepareCourseSelectionFile(
  file: File
): Promise<PreparedCourseSelectionFile> {
  try {
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

export function CourseSelectionsPage() {
  const { clearSemesterImportStatus, importStatuses, setSemesterImportStatus } =
    useImportStatusStore();
  const {
    clearCourseSelectionRowsForSemester,
    courseSelectionRows,
    replaceCourseSelectionRowsForSemester
  } = useCourseSelectionRawStore();
  const { operatingSubjects } = useOperatingSubjectStore();
  const { subjectOverrides } = useSubjectOverrideStore();
  const { setStudents } = useStudentStore();
  const {
    markSemesterUnknown,
    studentSemesterPresence,
    updateFromCourseSelectionRows
  } = useStudentSemesterPresenceStore();
  const [preview, setPreview] = useState<WorkbookPreviewTable>();

  async function importFileForSemester(
    file: File,
    target: Semester,
    needsReview = false,
    preparedFile?: PreparedCourseSelectionFile,
    sheetName?: string
  ) {
    try {
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
      const nextRows = replaceCourseSelectionRowsForSemester(
        target,
        parseResult.rows
      );
      const nextStudents = mergeStudentsFromCourseSelectionRows([], nextRows);
      const hasReviewItems = needsReview || parseResult.failedRows.length > 0;

      setPreview(nextPreview);
      setStudents(nextStudents);
      updateFromCourseSelectionRows(nextStudents, nextRows, target);
      setSemesterImportStatus({
        target,
        sourceType: "courseSelections",
        status: hasReviewItems ? "needsReview" : "imported",
        fileName: file.name,
        rowCount: parseResult.rows.length,
        message: hasReviewItems
          ? [
              needsReview
                ? `${semesterLabel(target)}로 임시 배치했습니다. 학기 매핑을 확인하세요.`
                : undefined,
              parseResult.failedRows.length > 0
                ? `파싱 실패 ${parseResult.failedRows.length}행`
                : undefined
            ]
              .filter(Boolean)
              .join(" · ")
          : undefined
      });
    } catch (error) {
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
  }

  function handleDownloadTemplate() {
    downloadBlob(
      createXlsxBlob(createCourseSelectionTemplateWorkbook(courseSelectionRows)),
      templateFileNames.courseSelection
    );
  }

  return (
    <section className="page">
      <PageHeader
        title="수강신청 결과 업로드"
        description="수강신청 결과 파일을 학기별로 읽고 학생-과목 원천 행으로 변환합니다. 특정 학기 재업로드는 해당 학기 원천 행만 교체합니다."
      />
      <div className="template-action-bar">
        <UploadImportLauncher
          onFilesSelected={handleFilesSelected}
          section="courseSelections"
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
          onClearSemester={handleClearSemester}
          onFilesSelected={handleFilesSelected}
          showUploadActions={false}
          sourceType="courseSelections"
          statuses={importStatuses}
        />
      </div>
      <div className="section">
        <h2>학생 학기별 존재 여부</h2>
        <StudentPresenceTable rows={studentSemesterPresence} />
      </div>
      <div className="section">
        <h2>학생별 이수 목록 요약</h2>
        <StudentCourseSummaryTable rows={courseSelectionRows} />
      </div>
      <div className="section">
        <h2>수강신청 원천 행 검토</h2>
        <CourseSelectionReviewTable
          operatingSubjects={operatingSubjects}
          rows={courseSelectionRows}
          subjectOverrides={subjectOverrides}
        />
      </div>
      <div className="section">
        <h2>파일 미리보기</h2>
        <FilePreviewTable preview={preview} />
      </div>
    </section>
  );
}
