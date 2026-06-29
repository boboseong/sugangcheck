import type {
  DataPreparationIssueCode,
  DataPreparationStatus
} from "../types/importStatus";

export const unregisteredOperatingSubjectIssueMessage =
  "운영과목 미등록 정보가 있습니다.";

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
