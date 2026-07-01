import {
  FileSpreadsheet,
  ListChecks,
  Play,
  Upload,
  UserRoundPlus
} from "lucide-react";
import { Link } from "react-router-dom";
import type {
  DataPreparationIssueCode,
  DataPreparationStatus,
  ImportStatus
} from "../types/importStatus";
import { StatusBadge, type StatusTone } from "./ui/StatusBadge";
import { ValidationRunConfirmationDropdown } from "./ValidationRunConfirmationDropdown";

type DataPreparationDashboardProps = {
  confirmationMessage?: string;
  hasValidationResult: boolean;
  onCancelValidationConfirmation: () => void;
  onConfirmValidation: () => void;
  onRunValidation: () => void;
  showValidationConfirmation: boolean;
  status: DataPreparationStatus;
};

const semesterCount = 6;

type ImportStatusCounts = Record<ImportStatus, number>;

function hasIssue(
  status: DataPreparationStatus,
  code: DataPreparationIssueCode
): boolean {
  return status.issues.some((issue) => issue.code === code);
}

function importBadge(counts: ImportStatusCounts): {
  label: string;
  tone: StatusTone;
} {
  if (counts.error > 0) {
    return { label: "오류", tone: "error" };
  }

  if (counts.needsReview > 0) {
    return { label: "확인 필요", tone: "warning" };
  }

  if (counts.imported === semesterCount) {
    return { label: "완료", tone: "ready" };
  }

  return { label: "대기", tone: counts.imported > 0 ? "warning" : "empty" };
}

function importDetail(
  counts: ImportStatusCounts,
  completeText: string,
  pendingText: string
): string {
  if (counts.error > 0) {
    return `오류 ${counts.error.toLocaleString()}학기`;
  }

  if (counts.needsReview > 0) {
    return `검토 필요 ${counts.needsReview.toLocaleString()}학기`;
  }

  if (counts.imported === semesterCount) {
    return completeText;
  }

  return pendingText;
}

export function DataPreparationDashboard({
  confirmationMessage,
  hasValidationResult,
  onCancelValidationConfirmation,
  onConfirmValidation,
  onRunValidation,
  showValidationConfirmation,
  status
}: DataPreparationDashboardProps) {
  const operatingSubjectBadge = importBadge(
    status.counts.operatingSubjectsByStatus
  );
  const courseSelectionBadge = importBadge(status.counts.courseSelectionsByStatus);
  const hasAnyCourseSelectionUpload =
    status.counts.courseSelectionsByStatus.imported +
      status.counts.courseSelectionsByStatus.needsReview >
    0;
  const externalCourseNeedsInput =
    status.counts.missingExternalCourseStudentCount > 0;
  const externalCourseHasIncompleteInputs =
    status.counts.incompleteExternalCourseInputCount > 0;
  const externalCourseBadge = externalCourseHasIncompleteInputs
    ? ({ label: "확인 필요", tone: "warning" } satisfies {
        label: string;
        tone: StatusTone;
      })
    : externalCourseNeedsInput
      ? ({ label: "입력 필요", tone: "warning" } satisfies {
          label: string;
          tone: StatusTone;
        })
      : hasAnyCourseSelectionUpload
        ? ({ label: "대상 없음", tone: "ready" } satisfies {
            label: string;
            tone: StatusTone;
          })
        : ({ label: "대기", tone: "empty" } satisfies {
            label: string;
            tone: StatusTone;
          });
  const externalCourseValue = externalCourseHasIncompleteInputs
    ? `${status.counts.incompleteExternalCourseInputCount.toLocaleString()}건 확인`
    : externalCourseNeedsInput
      ? `${status.counts.missingExternalCourseStudentCount.toLocaleString()}명 입력`
      : hasAnyCourseSelectionUpload
        ? "추가 입력 없음"
        : "수강신청 이후 확인";
  const externalCourseDetail = externalCourseHasIncompleteInputs
    ? "필수값이 비어 있는 행이 있습니다."
    : externalCourseNeedsInput
      ? "학기 입력이 누락된 학생이 있습니다. 전입/외부 이수에서 입력해주세요."
      : hasAnyCourseSelectionUpload
        ? "입력이 필요한 누락 학생이 없습니다."
        : "수강신청 업로드 후 표시됩니다.";
  const validationBadge = hasValidationResult
    ? ({ label: "완료", tone: "ready" } satisfies {
        label: string;
        tone: StatusTone;
      })
    : status.canRunFullValidation
      ? ({ label: "준비됨", tone: "ready" } satisfies {
          label: string;
          tone: StatusTone;
        })
      : status.canRunPartialValidation
        ? ({ label: "확인 필요", tone: "warning" } satisfies {
            label: string;
            tone: StatusTone;
          })
        : ({ label: "대기", tone: "empty" } satisfies {
            label: string;
            tone: StatusTone;
          });
  const canRunValidation =
    status.canRunFullValidation || status.canRunPartialValidation;
  const operatingSubjectDetail = hasIssue(status, "unregisteredOperatingSubject")
    ? `과목 정보 확인이 필요한 과목이 ${status.counts.unregisteredOperatingSubjectCount.toLocaleString()}개 있습니다.`
    : importDetail(
        status.counts.operatingSubjectsByStatus,
        "운영과목 업로드 완료",
        "6개 학기 업로드 필요"
      );

  return (
    <div className="workflow-card-grid">
      <article className="workflow-card">
        <div className="workflow-card__header">
          <FileSpreadsheet size={22} aria-hidden="true" />
          <StatusBadge tone={operatingSubjectBadge.tone}>
            {operatingSubjectBadge.label}
          </StatusBadge>
        </div>
        <h2>운영과목 업로드</h2>
        <p className="workflow-card__value">
          {`${status.counts.operatingSubjectsByStatus.imported}/${semesterCount} 학기`}
        </p>
        <p className="workflow-card__detail">{operatingSubjectDetail}</p>
        <Link
          className="button button--secondary button--compact workflow-card__action"
          to="/operating-subjects"
        >
          <FileSpreadsheet size={15} />
          <span>운영과목 업로드</span>
        </Link>
      </article>

      <article className="workflow-card">
        <div className="workflow-card__header">
          <Upload size={22} aria-hidden="true" />
          <StatusBadge tone={courseSelectionBadge.tone}>
            {courseSelectionBadge.label}
          </StatusBadge>
        </div>
        <h2>수강신청 업로드</h2>
        <p className="workflow-card__value">
          {`${status.counts.courseSelectionsByStatus.imported}/${semesterCount} 학기`}
        </p>
        <p className="workflow-card__detail">
          {importDetail(
            status.counts.courseSelectionsByStatus,
            "수강신청 업로드 완료",
            "6개 학기 업로드 필요"
          )}
        </p>
        <Link
          className="button button--secondary button--compact workflow-card__action"
          to="/course-selections"
        >
          <Upload size={15} />
          <span>수강신청 업로드</span>
        </Link>
      </article>

      <article className="workflow-card">
        <div className="workflow-card__header">
          <UserRoundPlus size={22} aria-hidden="true" />
          <StatusBadge tone={externalCourseBadge.tone}>
            {externalCourseBadge.label}
          </StatusBadge>
        </div>
        <h2>전입/외부 이수 입력</h2>
        <p className="workflow-card__value">{externalCourseValue}</p>
        <p className="workflow-card__detail">{externalCourseDetail}</p>
        <Link
          className="button button--secondary button--compact workflow-card__action"
          to="/external-courses"
        >
          <UserRoundPlus size={15} />
          <span>전입/외부</span>
        </Link>
      </article>

      <article className="workflow-card">
        <div className="workflow-card__header">
          <ListChecks size={22} aria-hidden="true" />
          <StatusBadge tone={validationBadge.tone}>
            {validationBadge.label}
          </StatusBadge>
        </div>
        <h2>점검</h2>
        <p className="workflow-card__value">
          {hasValidationResult
            ? "점검 완료"
            : status.canRunFullValidation
              ? "점검 가능"
              : status.canRunPartialValidation
                ? "확인 후 점검 가능"
              : "대기 중"}
        </p>
        <div className="workflow-card__validation-action">
          {hasValidationResult ? (
            <Link className="button button--compact" to="/results">
              <ListChecks size={15} />
              <span>점검 결과 화면</span>
            </Link>
          ) : canRunValidation ? (
            <button
              className="button button--compact"
              onClick={onRunValidation}
              type="button"
            >
              <Play size={15} />
              <span>점검</span>
            </button>
          ) : (
            <div className="workflow-card__blocked" role="status">
              사전 작업이 완료되지 않았습니다.
            </div>
          )}
          {showValidationConfirmation && confirmationMessage ? (
            <ValidationRunConfirmationDropdown
              message={confirmationMessage}
              onCancel={onCancelValidationConfirmation}
              onConfirm={onConfirmValidation}
            />
          ) : null}
        </div>
      </article>
    </div>
  );
}
