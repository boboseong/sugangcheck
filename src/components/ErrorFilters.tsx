import type { ValidationError, ValidationErrorType } from "../types/validation";
import { validationRuleLabel } from "../utils/validationRuleLabels";

export type ValidationErrorFilters = {
  ruleId: "all" | ValidationErrorType;
  query: string;
};

type ErrorFiltersProps = {
  errors: readonly ValidationError[];
  filters: ValidationErrorFilters;
  onChange: (filters: ValidationErrorFilters) => void;
};

export function filterValidationErrors(
  errors: readonly ValidationError[],
  filters: ValidationErrorFilters
): ValidationError[] {
  const query = filters.query.trim();

  return errors.filter((error) => {
    if (filters.ruleId !== "all" && error.type !== filters.ruleId) {
      return false;
    }

    if (!query) {
      return true;
    }

    return [error.studentName, error.studentNo, error.message, ...(error.relatedSubjectNames ?? [])]
      .join(" ")
      .includes(query);
  });
}

export function ErrorFilters({ errors, filters, onChange }: ErrorFiltersProps) {
  const ruleIds = [...new Set(errors.map((error) => error.type))];

  return (
    <div className="table-toolbar error-filter-bar">
      <label>
        <span>유형</span>
        <select
          onChange={(event) =>
            onChange({
              ...filters,
              ruleId: event.target.value as ValidationErrorFilters["ruleId"]
            })
          }
          value={filters.ruleId}
        >
          <option value="all">전체</option>
          {ruleIds.map((ruleId) => (
            <option key={ruleId} value={ruleId}>
              {validationRuleLabel(ruleId)}
            </option>
          ))}
        </select>
      </label>
      <label>
        <span>검색</span>
        <input
          onChange={(event) => onChange({ ...filters, query: event.target.value })}
          placeholder="학생, 과목, 메시지"
          value={filters.query}
        />
      </label>
    </div>
  );
}
