import type { ValidationError } from "../types/validation";
import { validationRuleLabel } from "../utils/validationRuleLabels";

type ValidationErrorDetailPanelProps = {
  error?: ValidationError;
};

export function ValidationErrorDetailPanel({
  error
}: ValidationErrorDetailPanelProps) {
  if (!error) {
    return (
      <div className="empty-panel">
        <p>오류 행을 선택하면 상세 내용이 표시됩니다.</p>
      </div>
    );
  }

  return (
    <aside className="error-detail-panel">
      <div className="error-detail-panel__header">
        <h2>{validationRuleLabel(error.type)}</h2>
      </div>
      <p>{error.message}</p>
      {error.fixHint ? (
        <div>
          <h3>수정 힌트</h3>
          <p>{error.fixHint}</p>
        </div>
      ) : null}
      <div>
        <h3>관련 원천 행</h3>
        <p>{error.relatedRecordIds.join(", ") || "-"}</p>
      </div>
      {error.relatedSubjectNames?.length ? (
        <div>
          <h3>관련 과목</h3>
          <p>{error.relatedSubjectNames.join(", ")}</p>
        </div>
      ) : null}
    </aside>
  );
}
