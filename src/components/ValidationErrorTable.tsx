import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import type { ValidationError } from "../types/validation";
import { validationRuleLabel } from "../utils/validationRuleLabels";

// A full run over six semesters routinely produces four figures of errors, and
// rendering them all at once cost ~400ms on every keystroke in the search box.
export const validationErrorPageSize = 100;

type ValidationErrorTableProps = {
  errors: readonly ValidationError[];
  onOpenStudentReport: (studentId: string) => void;
  onPageChange: (page: number) => void;
  page: number;
};

export function ValidationErrorTable({
  errors,
  onOpenStudentReport,
  onPageChange,
  page
}: ValidationErrorTableProps) {
  if (errors.length === 0) {
    return (
      <div className="empty-panel">
        <p>표시할 점검 오류가 없습니다.</p>
      </div>
    );
  }

  const pageCount = Math.max(1, Math.ceil(errors.length / validationErrorPageSize));
  const currentPage = Math.min(Math.max(page, 0), pageCount - 1);
  const firstIndex = currentPage * validationErrorPageSize;
  const visibleErrors = errors.slice(firstIndex, firstIndex + validationErrorPageSize);

  return (
    <>
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
          {visibleErrors.map((error) => (
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
      {pageCount > 1 ? (
        <div className="table-pagination">
          <button
            className="button button--secondary button--compact"
            disabled={currentPage === 0}
            onClick={() => onPageChange(currentPage - 1)}
            type="button"
          >
            <ChevronLeft size={14} />
            <span>이전</span>
          </button>
          <span className="muted-text">
            {(firstIndex + 1).toLocaleString()}–
            {(firstIndex + visibleErrors.length).toLocaleString()} / 전체{" "}
            {errors.length.toLocaleString()}건 ({currentPage + 1}/{pageCount} 쪽)
          </span>
          <button
            className="button button--secondary button--compact"
            disabled={currentPage >= pageCount - 1}
            onClick={() => onPageChange(currentPage + 1)}
            type="button"
          >
            <span>다음</span>
            <ChevronRight size={14} />
          </button>
        </div>
      ) : null}
    </>
  );
}
