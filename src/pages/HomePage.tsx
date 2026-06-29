import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FileSpreadsheet, Play, ShieldCheck } from "lucide-react";
import { DataPreparationDashboard } from "../components/DataPreparationDashboard";
import { OperatingSubjectRegistrationNotice } from "../components/OperatingSubjectRegistrationNotice";
import { PageHeader } from "../components/ui/PageHeader";
import { StatusBadge } from "../components/ui/StatusBadge";
import { useValidationRun } from "../hooks/useValidationRun";
import { appVersion } from "../state/projectMetaStore";

const steps = [
  {
    title: "운영과목 업로드",
    text: "6개 학기 운영과목 파일을 읽고 과목 마스터 대조를 준비합니다.",
    badge: "준비됨"
  },
  {
    title: "수강신청 결과 업로드",
    text: "넓은 엑셀 표를 학생-과목 원천 행 구조로 변환할 예정입니다.",
    badge: "준비됨"
  },
  {
    title: "점검 및 확인서",
    text: "검증 결과와 학생별 확인서 화면은 이후 단계에서 검증 엔진과 연결됩니다.",
    badge: "후속 단계"
  }
];

export function HomePage() {
  const {
    buildIssues,
    canRunValidation,
    courseSelectionRecords,
    dataPreparationStatus,
    hasOperatingSubjectRegistrationIssue,
    runValidation
  } = useValidationRun();
  const [
    showOperatingSubjectRegistrationNotice,
    setShowOperatingSubjectRegistrationNotice
  ] = useState(false);

  useEffect(() => {
    if (!hasOperatingSubjectRegistrationIssue) {
      setShowOperatingSubjectRegistrationNotice(false);
    }
  }, [hasOperatingSubjectRegistrationIssue]);

  function handleRunValidation() {
    if (hasOperatingSubjectRegistrationIssue) {
      setShowOperatingSubjectRegistrationNotice(true);
      return;
    }

    if (!canRunValidation) {
      return;
    }

    setShowOperatingSubjectRegistrationNotice(false);
    runValidation();
  }

  return (
    <section className="page">
      <PageHeader
        title="수강신청 오류 검증"
        description="학생들의 수강신청 결과를 점검하기 위한 앱입니다. 모든 정보는 오프라인으로 처리되며 서버에 업로드 되는 자료는 없습니다."
        versionLabel={`ver ${appVersion}`}
      />

      <DataPreparationDashboard status={dataPreparationStatus} />

      <section className="section" aria-labelledby="validation-run-title">
        <div className="run-panel">
          <div>
            <h2 id="validation-run-title">점검 실행</h2>
            <p>
              점검 버튼을 누르면 업로드한 수강신청 자료와 전입/외부 이수 입력을
              함께 정리해 검증할 데이터를 준비합니다.
            </p>
          </div>
          <button
            className="button"
            disabled={!canRunValidation && !hasOperatingSubjectRegistrationIssue}
            onClick={handleRunValidation}
            type="button"
          >
            <Play size={18} />
            <span>점검</span>
          </button>
        </div>
        {showOperatingSubjectRegistrationNotice ? (
          <OperatingSubjectRegistrationNotice />
        ) : null}
        <div className="prep-status-row">
          <StatusBadge tone={courseSelectionRecords.length > 0 ? "ready" : "empty"}>
            {`생성 기록 ${courseSelectionRecords.length.toLocaleString()}개`}
          </StatusBadge>
          <StatusBadge tone={buildIssues.length > 0 ? "warning" : "ready"}>
            {`생성 제외 ${buildIssues.length.toLocaleString()}개`}
          </StatusBadge>
        </div>
      </section>

      <div className="dashboard-grid">
        {steps.map((step) => (
          <article className="card" key={step.title}>
            <StatusBadge tone={step.badge === "준비됨" ? "ready" : "warning"}>
              {step.badge}
            </StatusBadge>
            <h2>{step.title}</h2>
            <p>{step.text}</p>
          </article>
        ))}
      </div>

      <section className="section" aria-labelledby="quick-actions-title">
        <h2 id="quick-actions-title">빠른 이동</h2>
        <div className="topbar__actions">
          <Link className="button" to="/operating-subjects">
            <FileSpreadsheet size={18} />
            <span>운영과목으로 이동</span>
          </Link>
          <Link className="button button--secondary" to="/results">
            <Play size={18} />
            <span>검증 결과 화면</span>
          </Link>
          <Link className="button button--secondary" to="/privacy">
            <ShieldCheck size={18} />
            <span>개인정보 원칙</span>
          </Link>
        </div>
      </section>
    </section>
  );
}
