type ValidationRunConfirmationDropdownProps = {
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
};

export function ValidationRunConfirmationDropdown({
  message,
  onCancel,
  onConfirm
}: ValidationRunConfirmationDropdownProps) {
  return (
    <div className="validation-run-notice validation-run-notice--dropdown" role="alert">
      <p className="validation-run-notice__message">{message}</p>
      <div className="validation-run-notice__actions">
        <button className="button button--compact" onClick={onConfirm} type="button">
          계속 점검
        </button>
        <button
          className="button button--secondary button--compact"
          onClick={onCancel}
          type="button"
        >
          닫기
        </button>
      </div>
    </div>
  );
}
