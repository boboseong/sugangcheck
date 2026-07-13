import { AlertTriangle } from "lucide-react";

export const staleValidationResultMessage =
  "입력 자료가 변경되었습니다. 다시 점검해 주세요.";

export function StaleValidationResultNotice() {
  return (
    <div className="stale-validation-result-notice" role="alert">
      <AlertTriangle aria-hidden="true" size={18} />
      <p>{staleValidationResultMessage}</p>
    </div>
  );
}
