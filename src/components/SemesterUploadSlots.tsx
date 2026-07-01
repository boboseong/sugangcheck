import type { ChangeEvent, DragEvent } from "react";
import { useId, useRef, useState } from "react";
import { FileSpreadsheet, FolderOpen, Trash2, Upload } from "lucide-react";
import { Button } from "./ui/Button";
import { IconButton } from "./ui/IconButton";
import { StatusBadge, type StatusTone } from "./ui/StatusBadge";
import type {
  ImportSourceType,
  ImportStatus,
  SemesterImportStatus
} from "../types/importStatus";
import type { Semester } from "../types/semester";
import { semesterKeys } from "../types/semester";
import { isSameSemester, parseSemesterKey, semesterLabel } from "../utils/semester";

type SemesterUploadSlotsProps = {
  sourceType: ImportSourceType;
  statuses: readonly SemesterImportStatus[];
  accept?: string;
  clearConfirmation?: {
    message: string;
    onConfirmedClear: () => void;
    shouldConfirm: boolean;
  };
  compact?: boolean;
  onFilesSelected: (files: File[], target?: Semester) => void | Promise<void>;
  onClearSemester?: (target: Semester) => void;
  reviewCompletedSemesters?: readonly Semester[];
  showUploadActions?: boolean;
};

const statusLabels: Record<ImportStatus, string> = {
  empty: "미업로드",
  imported: "가져옴",
  error: "오류",
  needsReview: "확인 필요"
};

const statusTones: Record<ImportStatus, StatusTone> = {
  empty: "empty",
  imported: "ready",
  error: "error",
  needsReview: "warning"
};

function statusForTarget(
  statuses: readonly SemesterImportStatus[],
  sourceType: ImportSourceType,
  target: Semester
): SemesterImportStatus {
  return (
    statuses.find(
      (status) =>
        status.sourceType === sourceType &&
        status.target.grade === target.grade &&
        status.target.semester === target.semester
    ) ?? {
      id: `${sourceType}-${target.grade}-${target.semester}`,
      sourceType,
      target,
      status: "empty"
    }
  );
}

function filesFromInput(event: ChangeEvent<HTMLInputElement>): File[] {
  return Array.from(event.target.files ?? []);
}

function statusMessageParts(
  status: SemesterImportStatus,
  reviewCompleted: boolean
): string[] {
  const messageParts =
    status.message
      ?.split(" · ")
      .filter(
        (message) =>
          !(reviewCompleted && message.startsWith("미등록 과목 "))
      ) ?? [];

  if (reviewCompleted) {
    messageParts.push("미등록 과목 검토 완료");
  }

  return messageParts;
}

export function SemesterUploadSlots({
  sourceType,
  statuses,
  accept = ".xls,.xlsx,.xlsm",
  clearConfirmation,
  compact = false,
  onFilesSelected,
  onClearSemester,
  reviewCompletedSemesters = [],
  showUploadActions = true
}: SemesterUploadSlotsProps) {
  const id = useId();
  const batchInputRef = useRef<HTMLInputElement>(null);
  const [draggingKey, setDraggingKey] = useState<string>();
  const [pendingClearTarget, setPendingClearTarget] = useState<
    Semester | undefined
  >(undefined);
  const shouldConfirmClear = clearConfirmation?.shouldConfirm ?? false;

  const handleInputChange =
    (target?: Semester) => async (event: ChangeEvent<HTMLInputElement>) => {
      const files = filesFromInput(event);
      event.target.value = "";

      if (files.length > 0) {
        await onFilesSelected(files, target);
      }
    };

  const handleDrop =
    (target: Semester) => async (event: DragEvent<HTMLDivElement>) => {
      if (!showUploadActions) {
        return;
      }

      event.preventDefault();
      setDraggingKey(undefined);

      const files = Array.from(event.dataTransfer.files ?? []);

      if (files.length > 0) {
        await onFilesSelected(files, target);
      }
    };

  function requestClearSemester(target: Semester) {
    if (!onClearSemester) {
      return;
    }

    if (shouldConfirmClear) {
      setPendingClearTarget(target);
      return;
    }

    onClearSemester(target);
  }

  function continueConfirmedClear() {
    if (!pendingClearTarget || !onClearSemester) {
      return;
    }

    clearConfirmation?.onConfirmedClear();
    onClearSemester(pendingClearTarget);
    setPendingClearTarget(undefined);
  }

  function cancelConfirmedClear() {
    setPendingClearTarget(undefined);
  }

  return (
    <div className={compact ? "upload-slots upload-slots--compact" : "upload-slots"}>
      {showUploadActions ? (
        <div className="upload-slots__toolbar">
          <Button
            icon={<FolderOpen size={17} />}
            onClick={() => batchInputRef.current?.click()}
            variant="secondary"
          >
            6개 파일 일괄 선택
          </Button>
          <input
            ref={batchInputRef}
            accept={accept}
            className="visually-hidden"
            multiple
            onChange={handleInputChange()}
            type="file"
          />
        </div>
      ) : null}
      <div className="upload-slot-grid">
        {semesterKeys.map((key) => {
          const target = parseSemesterKey(key);

          if (!target) {
            return null;
          }

          const status = statusForTarget(statuses, sourceType, target);
          const reviewCompleted = reviewCompletedSemesters.some((semester) =>
            isSameSemester(semester, target)
          );
          const showReviewCompleted =
            reviewCompleted && status.status !== "error";
          const messageParts = statusMessageParts(status, showReviewCompleted);
          const hasOutstandingReview =
            showReviewCompleted &&
            status.status === "needsReview" &&
            messageParts.some((message) => message !== "미등록 과목 검토 완료");
          const message = messageParts.join(" · ") || undefined;
          const statusLabel = showReviewCompleted && !hasOutstandingReview
            ? "검토 완료"
            : statusLabels[status.status];
          const statusTone = showReviewCompleted && !hasOutstandingReview
            ? "ready"
            : statusTones[status.status];
          const inputId = `${id}-${sourceType}-${key}`;
          const isDragging = draggingKey === key;
          const isClearConfirmationOpen =
            pendingClearTarget !== undefined &&
            isSameSemester(pendingClearTarget, target);

          return (
            <div
              className={[
                "upload-slot",
                isDragging ? "upload-slot--dragging" : ""
              ]
                .filter(Boolean)
                .join(" ")}
              key={key}
              onDragLeave={
                showUploadActions ? () => setDraggingKey(undefined) : undefined
              }
              onDragOver={
                showUploadActions
                  ? (event) => {
                      event.preventDefault();
                      setDraggingKey(key);
                    }
                  : undefined
              }
              onDrop={showUploadActions ? handleDrop(target) : undefined}
            >
              <div className="upload-slot__heading">
                <FileSpreadsheet size={18} aria-hidden="true" />
                <strong>{semesterLabel(target)}</strong>
                <StatusBadge tone={statusTone}>{statusLabel}</StatusBadge>
              </div>
              <p className="upload-slot__file">{status.fileName ?? "파일 없음"}</p>
              {message ? (
                <p className="upload-slot__message">{message}</p>
              ) : null}
              {showUploadActions || onClearSemester ? (
                <div className="upload-slot__actions">
                  {showUploadActions ? (
                    <>
                      <label className="button button--secondary" htmlFor={inputId}>
                        <Upload size={16} aria-hidden="true" />
                        <span>선택</span>
                      </label>
                      <input
                        accept={accept}
                        className="visually-hidden"
                        id={inputId}
                        onChange={handleInputChange(target)}
                        type="file"
                      />
                    </>
                  ) : null}
                  {onClearSemester ? (
                    <IconButton
                      icon={<Trash2 size={16} />}
                      label={`${semesterLabel(target)} 파일 비우기`}
                      onClick={() => requestClearSemester(target)}
                    />
                  ) : null}
                </div>
              ) : null}
              {isClearConfirmationOpen ? (
                <div
                  aria-label="삭제 확인"
                  className="upload-slot__confirm"
                  role="alertdialog"
                >
                  <p>{clearConfirmation?.message}</p>
                  <div className="upload-slot__confirm-actions">
                    <Button onClick={continueConfirmedClear}>계속</Button>
                    <Button onClick={cancelConfirmedClear} variant="secondary">
                      취소
                    </Button>
                  </div>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
