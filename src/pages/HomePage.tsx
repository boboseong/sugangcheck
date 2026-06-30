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
        description="학생들의 수강신청 결과를 점검하기 위한 앱입니다. 모든 정보는 오프라인으로 처리되며 서버에 업로드 되는 자료는 없습니다."
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
