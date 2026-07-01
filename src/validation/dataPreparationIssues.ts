import type {
  DataPreparationIssue,
  DataPreparationIssueCode,
  DataPreparationStatus
} from "../types/importStatus";

export const unregisteredOperatingSubjectIssueMessage =
  "운영과목 미등록 정보가 있습니다.";

export function isMissingUploadIssue(
  issue: Pick<DataPreparationIssue, "code">
): boolean {
  return (
    issue.code === "missingOperatingSubjects" ||
    issue.code === "missingCourseSelections"
  );
}

export function hasDataPreparationIssueCode(
  status: DataPreparationStatus,
  code: DataPreparationIssueCode
): boolean {
  return status.issues.some((issue) => issue.code === code);
}

export function hasUnregisteredOperatingSubjectIssue(
  status: DataPreparationStatus
): boolean {
  return hasDataPreparationIssueCode(status, "unregisteredOperatingSubject");
}

export function missingUploadConfirmationMessage(
  status: DataPreparationStatus
): string | undefined {
  const missingUploadIssues = status.issues.filter(isMissingUploadIssue);

  if (missingUploadIssues.length === 0) {
    return undefined;
  }

  if (missingUploadIssues.length === 1) {
    return `${missingUploadIssues[0]?.message} 점검을 진행하시겠습니까?`;
  }

  return `${missingUploadIssues
    .map((issue) => `- ${issue.message}`)
    .join("\n")}\n점검을 진행하시겠습니까?`;
}
