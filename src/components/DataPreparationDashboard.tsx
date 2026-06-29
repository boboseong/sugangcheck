import { FileSpreadsheet } from "lucide-react";
import { Link } from "react-router-dom";
import type { DataPreparationStatus, ImportSourceType } from "../types/importStatus";
import { unregisteredOperatingSubjectIssueMessage } from "../validation/dataPreparationIssues";
import { StatusBadge } from "./ui/StatusBadge";

type DataPreparationDashboardProps = {
  status: DataPreparationStatus;
};

const sourceTypeActions: Record<
  ImportSourceType,
  { label: string; to: string }
> = {
  operatingSubjects: {
    label: "운영과목 이동",
    to: "/operating-subjects"
  },
  courseSelections: {
    label: "수강신청 결과 이동",
    to: "/course-selections"
  }
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

  function renderIssueLink(issueItem: DataPreparationStatus["issues"][number]) {
    const action =
      issueItem.code === "unregisteredOperatingSubject"
        ? sourceTypeActions.operatingSubjects
        : issueItem.relatedSourceType
          ? sourceTypeActions[issueItem.relatedSourceType]
          : undefined;

    if (!action) {
      return null;
    }

    return (
      <Link className="button button--secondary button--compact" to={action.to}>
        <FileSpreadsheet size={15} />
        <span>{action.label}</span>
      </Link>
    );
  }

  function renderIssueContent(issueItem: DataPreparationStatus["issues"][number]) {
    if (issueItem.code === "unregisteredOperatingSubject") {
      return (
        <div className="issue-action-cell">
          <span>{unregisteredOperatingSubjectIssueMessage}</span>
          {renderIssueLink(issueItem)}
        </div>
      );
    }

    const issueLink = renderIssueLink(issueItem);

    return issueLink ? (
      <div className="issue-action-cell">
        <span>{issueItem.message}</span>
        {issueLink}
      </div>
    ) : (
      issueItem.message
    );
  }

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
                <td>{renderIssueContent(issueItem)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
