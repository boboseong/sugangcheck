import { Code, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { latestReleaseUrl, repositoryUrl } from "../app/externalLinks";
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

      <section
        aria-labelledby="dashboard-release-title"
        className="dashboard-release-panel"
      >
        <div>
          <h2 id="dashboard-release-title">로컬 앱 다운로드</h2>
          <p>인터넷 연결없이 안정적인 사용을 위해 GitHub에서 Windows 실행 파일을 내려받아 사용하세요. 저장소에서는 릴리스 내역과 변경 사항을 확인할 수 있습니다</p>
        </div>
        <div className="dashboard-release-panel__actions">
          <a
            className="button"
            href={latestReleaseUrl}
            rel="noreferrer"
            target="_blank"
          >
            <Download size={16} aria-hidden="true" />
            <span>로컬 앱 다운로드</span>
          </a>
          <a
            className="button button--secondary"
            href={repositoryUrl}
            rel="noreferrer"
            target="_blank"
          >
            <Code size={16} aria-hidden="true" />
            <span>GitHub 저장소</span>
          </a>
        </div>
      </section>
    </section>
  );
}
