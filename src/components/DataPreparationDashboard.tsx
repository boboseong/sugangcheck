import type { DataPreparationStatus } from "../types/importStatus";
import { StatusBadge } from "./ui/StatusBadge";

type DataPreparationDashboardProps = {
  status: DataPreparationStatus;
};

export function DataPreparationDashboard({ status }: DataPreparationDashboardProps) {
  const metrics = [
    {
      label: "운영과목 업로드",
      value: `${status.counts.operatingSubjectsByStatus.imported}/6`
    },
    {
      label: "수강신청 업로드",
      value: `${status.counts.courseSelectionsByStatus.imported}/6`
    },
    {
      label: "미확인 학기",
      value: String(status.counts.unknownStudentSemesterCount)
    },
    {
      label: "학점 미해결",
      value: String(status.counts.missingCreditSubjectCount)
    }
  ];

  return (
    <div className="data-prep-dashboard">
      <div className="metric-row">
        {metrics.map((metric) => (
          <div className="metric" key={metric.label}>
            <p className="metric__label">{metric.label}</p>
            <p className="metric__value">{metric.value}</p>
          </div>
        ))}
      </div>
      <div className="prep-status-row">
        <StatusBadge tone={status.canRunFullValidation ? "ready" : "warning"}>
          {status.canRunFullValidation ? "점검 가능" : "점검 대기"}
        </StatusBadge>
      </div>
      <table className="placeholder-table">
        <thead>
          <tr>
            <th>상태</th>
            <th>내용</th>
          </tr>
        </thead>
        <tbody>
          {status.issues.length === 0 ? (
            <tr>
              <td>
                <StatusBadge tone="ready">준비됨</StatusBadge>
              </td>
              <td>검증 실행을 막는 준비 문제가 없습니다.</td>
            </tr>
          ) : (
            status.issues.map((issueItem) => (
              <tr key={issueItem.id}>
                <td>
                  <StatusBadge tone="warning">확인 필요</StatusBadge>
                </td>
                <td>{issueItem.message}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
