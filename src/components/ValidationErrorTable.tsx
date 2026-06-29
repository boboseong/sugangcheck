import { ArrowRight } from "lucide-react";
import type { ValidationError } from "../types/validation";
import { validationRuleLabel } from "../utils/validationRuleLabels";

type ValidationErrorTableProps = {
  errors: readonly ValidationError[];
  onOpenStudentReport: (studentId: string) => void;
};

export function ValidationErrorTable({
  errors,
  onOpenStudentReport
}: ValidationErrorTableProps) {
  if (errors.length === 0) {
    return (
      <div className="empty-panel">
        <p>표시할 점검 오류가 없습니다.</p>
      </div>
    );
  }

  return (
    <table className="placeholder-table">
      <thead>
        <tr>
          <th>유형</th>
          <th>학생</th>
          <th>메시지</th>
          <th>이동</th>
        </tr>
      </thead>
      <tbody>
        {errors.map((error) => (
          <tr key={error.id}>
            <td>{validationRuleLabel(error.type)}</td>
            <td>
              {error.studentName}
              <br />
              <span className="muted-text">{error.studentNo}</span>
            </td>
            <td>{error.message}</td>
            <td>
              <button
                className="button button--secondary button--compact"
                onClick={(event) => {
                  event.stopPropagation();
                  onOpenStudentReport(error.studentId);
                }}
                type="button"
              >
                <ArrowRight size={14} />
                <span>이동</span>
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
