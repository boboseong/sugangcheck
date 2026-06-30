import { useNavigate } from "react-router-dom";
import { DataPreparationDashboard } from "../components/DataPreparationDashboard";
import { PageHeader } from "../components/ui/PageHeader";
import { useValidationRun } from "../hooks/useValidationRun";
import { appVersion } from "../state/projectMetaStore";
import { useValidationResultStore } from "../state/validationResultStore";

export function HomePage() {
  const navigate = useNavigate();
  const {
    canRunValidation,
    dataPreparationStatus,
    runValidation
  } = useValidationRun();
  const { lastValidationResult } = useValidationResultStore();

  function handleRunValidation() {
    if (!canRunValidation) {
      return;
    }

    runValidation();
    navigate("/results");
  }

  return (
    <section className="page">
      <PageHeader
        title="수강신청 오류 점검"
        className="page-header--single-line-description"
        description="인터넷 연결없이 안정적인 사용을 위해 GitHub에서 Windows 실행 파일을 내려받아 사용하세요. 저장소에서는 릴리스 내역과 변경 사항을 확인할 수 있습니다."
        versionLabel={`ver ${appVersion}`}
      />

      <DataPreparationDashboard
        hasValidationResult={Boolean(lastValidationResult)}
        onRunValidation={handleRunValidation}
        status={dataPreparationStatus}
      />
    </section>
  );
}
