import { Download } from "lucide-react";
import { FilePreviewTable } from "../components/FilePreviewTable";
import { SemesterUploadSlots } from "../components/SemesterUploadSlots";
import { StudentCourseSummaryTable } from "../components/StudentCourseSummaryTable";
import { StudentPresenceTable } from "../components/StudentPresenceTable";
import { UploadImportLauncher } from "../components/UploadImportLauncher";
import { Button } from "../components/ui/Button";
import { PageHeader } from "../components/ui/PageHeader";
import { courseSelectionDownloadGuide } from "../constants/uploadGuides";
import { useCourseSelectionImport } from "../hooks/useCourseSelectionImport";
import { clearDerivedValidationState } from "../state/projectWorkspace";
import { useValidationResultStore } from "../state/validationResultStore";

export function CourseSelectionsPage() {
  const {
    courseSelectionRows,
    handleClearSemester,
    handleDownloadTemplate,
    handleFilesSelected,
    importStatuses,
    preview,
    studentSemesterPresence
  } = useCourseSelectionImport();
  const hasValidationResult = useValidationResultStore(
    (state) => state.lastValidationResult !== undefined
  );

  return (
    <section className="page">
      <PageHeader
        title="수강신청 결과 업로드"
        description="수강신청 결과 파일을 학기별로 읽고 학생-과목 원천 행으로 변환합니다. 특정 학기 재업로드는 해당 학기 원천 행만 교체합니다."
      />
      <div className="template-action-bar">
        <UploadImportLauncher
          downloadGuide={courseSelectionDownloadGuide}
          fileUploadConfirmation={{
            message: "기존 점검 결과가 삭제됩니다. 계속하시겠습니까?",
            onConfirmedFileSelection: clearDerivedValidationState,
            shouldConfirm: hasValidationResult
          }}
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
          clearConfirmation={{
            message: "기존 점검 결과가 삭제됩니다. 계속하시겠습니까?",
            onConfirmedClear: clearDerivedValidationState,
            shouldConfirm: hasValidationResult
          }}
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
        <h2>학기별 이수 과목 수</h2>
        <StudentCourseSummaryTable rows={courseSelectionRows} />
      </div>
      <div className="section">
        <h2>파일 미리보기</h2>
        <FilePreviewTable preview={preview} />
      </div>
    </section>
  );
}
