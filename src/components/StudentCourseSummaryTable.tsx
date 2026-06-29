import { buildStudentCourseSummaries } from "../state/courseSelectionRawStore";
import type { ParsedCourseSelectionRow } from "../types/courseSelection";
import { StatusBadge } from "./ui/StatusBadge";

type StudentCourseSummaryTableProps = {
  rows: readonly ParsedCourseSelectionRow[];
};

export function StudentCourseSummaryTable({
  rows
}: StudentCourseSummaryTableProps) {
  const summaries = buildStudentCourseSummaries(rows);

  if (summaries.length === 0) {
    return (
      <div className="empty-panel">
        <p>학생별 이수 목록 요약이 여기에 표시됩니다.</p>
      </div>
    );
  }

  return (
    <div className="preview-table-wrap">
      <table className="placeholder-table">
        <thead>
          <tr>
            <th>학번</th>
            <th>이름</th>
            <th>신청 과목 수</th>
            <th>확인된 학점</th>
            <th>학점 미확인</th>
          </tr>
        </thead>
        <tbody>
          {summaries.map((summary) => (
            <tr key={summary.studentId}>
              <td>{summary.studentNo}</td>
              <td>{summary.studentName}</td>
              <td>{summary.recordCount}</td>
              <td>{summary.resolvedCredits}</td>
              <td>
                <StatusBadge
                  tone={summary.missingCreditCount > 0 ? "warning" : "ready"}
                >
                  {summary.missingCreditCount > 0
                    ? `${summary.missingCreditCount}개`
                    : "없음"}
                </StatusBadge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
