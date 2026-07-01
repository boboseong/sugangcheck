import { Download } from "lucide-react";
import { FilePreviewTable } from "../components/FilePreviewTable";
import { OperatingSubjectReviewTable } from "../components/OperatingSubjectReviewTable";
import { SemesterUploadSlots } from "../components/SemesterUploadSlots";
import { UploadImportLauncher } from "../components/UploadImportLauncher";
import { Button } from "../components/ui/Button";
import { PageHeader } from "../components/ui/PageHeader";
import { operatingSubjectDownloadGuide } from "../constants/uploadGuides";
import { useOperatingSubjectImport } from "../hooks/useOperatingSubjectImport";
import { clearDerivedValidationState } from "../state/projectWorkspace";
import { useValidationResultStore } from "../state/validationResultStore";

export function OperatingSubjectsPage() {
  const {
    handleClearSemester,
    handleDownloadTemplate,
    handleFilesSelected,
    importStatuses,
    operatingSubjects,
    preview,
    reviewCompletedSemesters,
    updateOperatingSubject
  } = useOperatingSubjectImport();
  const hasValidationResult = useValidationResultStore(
    (state) => state.lastValidationResult !== undefined
  );

  return (
    <section className="page">
      <PageHeader
        title="운영과목 업로드"
        description="학기별 운영과목 파일을 읽고 대상 학기만 교체합니다. 파일 내부의 학년/학기 값을 우선 확인하고, 알 수 없으면 슬롯별 선택으로 직접 매핑할 수 있습니다."
      />
      <div className="template-action-bar">
        <UploadImportLauncher
          downloadGuide={operatingSubjectDownloadGuide}
          fileUploadConfirmation={{
            message: "기존 점검 결과가 삭제됩니다. 계속하시겠습니까?",
            onConfirmedFileSelection: clearDerivedValidationState,
            shouldConfirm: hasValidationResult
          }}
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
          clearConfirmation={{
            message: "기존 점검 결과가 삭제됩니다. 계속하시겠습니까?",
            onConfirmedClear: clearDerivedValidationState,
            shouldConfirm: hasValidationResult
          }}
          compact
          onClearSemester={handleClearSemester}
          onFilesSelected={handleFilesSelected}
          reviewCompletedSemesters={reviewCompletedSemesters}
          showUploadActions={false}
          sourceType="operatingSubjects"
          statuses={importStatuses}
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
