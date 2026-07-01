import type {
  DataPreparationIssue,
  DataPreparationIssueCode,
  DataPreparationStatus
} from "../types/importStatus";
import { semesterLabel } from "../utils/semester";

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

function issueRunNotice(issue: DataPreparationIssue): string | undefined {
  switch (issue.code) {
    case "missingOperatingSubjects":
    case "missingCourseSelections":
    case "importError":
    case "needsReview":
      return `${issue.message} 해당 학기는 제외됩니다.`;
    case "unregisteredOperatingSubject":
      return `${issue.message} 운영과목 입력값 기준으로 점검하므로 과목 정보 판단에 제한이 있을 수 있습니다.`;
    case "unknownStudentSemester":
      return `${issue.message} 전입/외부 이수 누락 판단이 제한될 수 있습니다.`;
    case "missingCredits":
      return `${issue.message} 해당 행은 점검 레코드에서 제외됩니다.`;
    case "incompleteExternalCourseInput":
      return `${issue.message} 해당 행은 점검 레코드에서 제외됩니다.`;
    case "pendingPrerequisiteCandidate":
      return `${issue.message} 후보 상태 규칙은 적용되지 않습니다.`;
    case "missingValidationRuleSettings":
      return issue.message;
    default:
      return undefined;
  }
}

export function validationRunConfirmationMessage(
  status: DataPreparationStatus
): string | undefined {
  if (!status.canRunFullValidation && status.availablePartialSemesters.length === 0) {
    return undefined;
  }

  const notices = status.issues
    .map(issueRunNotice)
    .filter((message): message is string => Boolean(message));
  const needsPartialNotice = !status.canRunFullValidation;

  if (!needsPartialNotice && notices.length === 0) {
    return undefined;
  }

  const targetLabel = status.canRunFullValidation
    ? "전체 6개 학기"
    : status.availablePartialSemesters.map(semesterLabel).join(", ");
  const lines = [
    needsPartialNotice
      ? "전체 점검 조건을 만족하지 않아 정상 등록된 학기만 기준으로 점검합니다."
      : "일부 입력 자료에 확인이 필요한 항목이 있습니다.",
    "",
    `점검 대상: ${targetLabel}`
  ];

  if (notices.length > 0) {
    lines.push("", "제외/제한:", ...notices.map((notice) => `- ${notice}`));
  }

  if (needsPartialNotice) {
    lines.push(
      "",
      "일부 학기만 기준으로 점검하므로 최소 이수학점, 교과군 필수 이수학점, 한국사, 국수영 제한 등에서 전체 학생에게 오류가 표시될 수 있습니다."
    );
  }

  lines.push("", "계속 진행할까요?");

  return lines.join("\n");
}
