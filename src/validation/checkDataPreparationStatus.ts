import { checkSubjectResolutionStatus } from "./checkSubjectResolutionStatus";
import type {
  DataPreparationIssue,
  DataPreparationIssueCode,
  DataPreparationStatus,
  ImportSourceType,
  ImportStatus,
  SemesterImportStatus
} from "../types/importStatus";
import type { ParsedCourseSelectionRow, ExternalCourseInput } from "../types/courseSelection";
import type { StudentSemesterPresence } from "../types/student";
import type { OperatingSubject } from "../types/subject";
import type { PrerequisiteRule, ValidationRuleSetting } from "../types/validation";
import { semesterKeys, type Semester } from "../types/semester";
import { isSameSemester, parseSemesterKey, semesterLabel } from "../utils/semester";
import { unregisteredOperatingSubjectIssueMessage } from "./dataPreparationIssues";

function emptyStatusCounts(): Record<ImportStatus, number> {
  return {
    empty: 0,
    imported: 0,
    error: 0,
    needsReview: 0
  };
}

function countByImportStatus(
  statuses: readonly SemesterImportStatus[],
  sourceType: ImportSourceType
): Record<ImportStatus, number> {
  const counts = emptyStatusCounts();

  for (const status of statuses) {
    if (status.sourceType === sourceType) {
      counts[status.status] += 1;
    }
  }

  return counts;
}

function hasCompletedOperatingSubjectCorrections(
  subjects: readonly OperatingSubject[],
  target: Semester
): boolean {
  const semesterSubjects = subjects.filter((subject) =>
    isSameSemester(subject.target, target)
  );

  return (
    semesterSubjects.length > 0 &&
    semesterSubjects.some((subject) => subject.masterMatchStatus === "manual") &&
    semesterSubjects.every((subject) => subject.masterMatchStatus !== "unmatched")
  );
}

function isOnlyCorrectedUnmatchedSubjectReview(
  status: SemesterImportStatus,
  operatingSubjects: readonly OperatingSubject[]
): boolean {
  if (
    status.sourceType !== "operatingSubjects" ||
    status.status !== "needsReview" ||
    !hasCompletedOperatingSubjectCorrections(operatingSubjects, status.target)
  ) {
    return false;
  }

  const messageParts = status.message?.split(" · ").filter(Boolean) ?? [];

  return (
    messageParts.length > 0 &&
    messageParts.every((message) => message.startsWith("미등록 과목 "))
  );
}

function effectiveImportStatuses(input: {
  importStatuses: readonly SemesterImportStatus[];
  operatingSubjects: readonly OperatingSubject[];
}): SemesterImportStatus[] {
  return input.importStatuses.map((status) =>
    isOnlyCorrectedUnmatchedSubjectReview(status, input.operatingSubjects)
      ? { ...status, status: "imported" }
      : status
  );
}

function issue(
  code: DataPreparationIssueCode,
  message: string,
  blocksFullValidation = true,
  related?: Pick<
    DataPreparationIssue,
    "relatedIds" | "relatedSemester" | "relatedSourceType"
  >
): DataPreparationIssue {
  return {
    id: `${code}-${message}`,
    code,
    blocksFullValidation,
    message,
    ...related
  };
}

const sourceTypeLabels: Record<ImportSourceType, string> = {
  operatingSubjects: "운영과목",
  courseSelections: "수강신청 결과"
};

const missingUploadSubjectLabels: Record<ImportSourceType, string> = {
  operatingSubjects: "운영과목이",
  courseSelections: "수강신청 결과가"
};

function reviewIssueMessage(status: SemesterImportStatus): string {
  const label = `${sourceTypeLabels[status.sourceType]} 탭 ${semesterLabel(status.target)}`;
  const detail = status.message ? `: ${status.message}` : "";

  return `${label} 업로드 확인이 필요합니다${detail}`;
}

function missingUploadIssueMessage(status: SemesterImportStatus): string {
  return `${semesterLabel(status.target)} ${
    missingUploadSubjectLabels[status.sourceType]
  } 입력되지 않았습니다.`;
}

function importErrorIssueMessage(status: SemesterImportStatus): string {
  const label = `${sourceTypeLabels[status.sourceType]} 탭 ${semesterLabel(status.target)}`;
  const detail = status.message ? `: ${status.message}` : "";

  return `${label} 업로드 오류가 있습니다${detail}`;
}

function hasImportedStatus(
  statuses: readonly SemesterImportStatus[],
  sourceType: ImportSourceType,
  target: Semester
): boolean {
  return statuses.some(
    (status) =>
      status.sourceType === sourceType &&
      status.status === "imported" &&
      isSameSemester(status.target, target)
  );
}

function countMissingExternalCourseStudents(input: {
  externalCourseInputs: readonly ExternalCourseInput[];
  studentSemesterPresence: readonly StudentSemesterPresence[];
}): number {
  const studentIdsWithExternalInputs = new Set(
    input.externalCourseInputs.map((externalInput) => externalInput.studentId)
  );

  return input.studentSemesterPresence.filter(
    (presence) =>
      Object.values(presence.semesters).some((value) => value === "absent") &&
      !studentIdsWithExternalInputs.has(presence.studentId)
  ).length;
}

export function checkDataPreparationStatus(input: {
  importStatuses: readonly SemesterImportStatus[];
  studentSemesterPresence: readonly StudentSemesterPresence[];
  operatingSubjects: readonly OperatingSubject[];
  courseSelectionRows: readonly ParsedCourseSelectionRow[];
  externalCourseInputs: readonly ExternalCourseInput[];
  prerequisiteRules: readonly PrerequisiteRule[];
  validationRuleSettings: readonly ValidationRuleSetting[];
}): DataPreparationStatus {
  const importStatuses = effectiveImportStatuses({
    importStatuses: input.importStatuses,
    operatingSubjects: input.operatingSubjects
  });
  const operatingSubjectsByStatus = countByImportStatus(
    importStatuses,
    "operatingSubjects"
  );
  const courseSelectionsByStatus = countByImportStatus(
    importStatuses,
    "courseSelections"
  );
  const unknownStudentSemesterCount = input.studentSemesterPresence.reduce(
    (sum, presence) =>
      sum +
      Object.values(presence.semesters).filter((value) => value === "unknown")
        .length,
    0
  );
  const absentStudentSemesterCount = input.studentSemesterPresence.reduce(
    (sum, presence) =>
      sum +
      Object.values(presence.semesters).filter((value) => value === "absent")
        .length,
    0
  );
  const unregisteredOperatingSubjectCount = input.operatingSubjects.filter(
    (subject) => subject.masterMatchStatus === "unmatched"
  ).length;
  const hasUnregisteredOperatingSubjectInfo =
    unregisteredOperatingSubjectCount > 0;
  const resolutionStatus = checkSubjectResolutionStatus({
    courseSelectionRows: input.courseSelectionRows,
    externalCourseInputs: input.externalCourseInputs,
    operatingSubjects: input.operatingSubjects
  });
  const incompleteExternalCourseInputCount = input.externalCourseInputs.filter(
    (externalInput) => !externalInput.subjectName || externalInput.credits === undefined
  ).length;
  const missingExternalCourseStudentCount = countMissingExternalCourseStudents({
    externalCourseInputs: input.externalCourseInputs,
    studentSemesterPresence: input.studentSemesterPresence
  });
  const pendingPrerequisiteCandidateCount = input.prerequisiteRules.filter(
    (rule) => rule.status === "candidate"
  ).length;
  const issues: DataPreparationIssue[] = [];

  importStatuses
    .filter(
      (status) =>
        status.sourceType === "operatingSubjects" && status.status === "empty"
    )
    .forEach((status) => {
      issues.push(
        issue("missingOperatingSubjects", missingUploadIssueMessage(status), true, {
          relatedIds: [status.id],
          relatedSemester: status.target,
          relatedSourceType: status.sourceType
        })
      );
    });

  if (hasUnregisteredOperatingSubjectInfo) {
    issues.push(
      issue(
        "unregisteredOperatingSubject",
        `${unregisteredOperatingSubjectIssueMessage} ${unregisteredOperatingSubjectCount.toLocaleString()}개 과목을 확인하세요.`,
        false
      )
    );
  }

  importStatuses
    .filter(
      (status) =>
        status.sourceType === "courseSelections" && status.status === "empty"
    )
    .forEach((status) => {
      issues.push(
        issue("missingCourseSelections", missingUploadIssueMessage(status), true, {
          relatedIds: [status.id],
          relatedSemester: status.target,
          relatedSourceType: status.sourceType
        })
      );
    });

  importStatuses
    .filter((status) => status.status === "error")
    .forEach((status) => {
      issues.push(
        issue("importError", importErrorIssueMessage(status), true, {
          relatedIds: [status.id],
          relatedSemester: status.target,
          relatedSourceType: status.sourceType
        })
      );
    });

  importStatuses
    .filter((status) => status.status === "needsReview")
    .forEach((status) => {
      issues.push(
        issue("needsReview", reviewIssueMessage(status), true, {
          relatedIds: [status.id],
          relatedSemester: status.target,
          relatedSourceType: status.sourceType
        })
      );
    });

  if (unknownStudentSemesterCount > 0) {
    issues.push(
      issue(
        "unknownStudentSemester",
        `학생 학기별 존재 여부에 미확인 값 ${unknownStudentSemesterCount.toLocaleString()}건이 남아 있습니다.`,
        false
      )
    );
  }

  if (resolutionStatus.missingCreditCount > 0) {
    issues.push(
      issue(
        "missingCredits",
        `학점이 해석되지 않은 과목 ${resolutionStatus.missingCreditCount.toLocaleString()}건이 있습니다.`,
        false
      )
    );
  }

  if (incompleteExternalCourseInputCount > 0) {
    issues.push(
      issue(
        "incompleteExternalCourseInput",
        `필수값이 비어 있는 전입/외부 이수 입력 행 ${incompleteExternalCourseInputCount.toLocaleString()}건이 있습니다.`,
        false
      )
    );
  }

  if (pendingPrerequisiteCandidateCount > 0) {
    issues.push(
      issue(
        "pendingPrerequisiteCandidate",
        `점검 여부가 정해지지 않은 위계 규칙 ${pendingPrerequisiteCandidateCount.toLocaleString()}건이 남아 있습니다.`,
        false
      )
    );
  }

  if (input.validationRuleSettings.length === 0) {
    issues.push(issue("missingValidationRuleSettings", "점검 규칙 설정을 읽을 수 없습니다."));
  }

  const availablePartialSemesters = semesterKeys
    .map((key) => parseSemesterKey(key))
    .filter((semester): semester is Semester => Boolean(semester))
    .filter(
      (semester) =>
        hasImportedStatus(importStatuses, "operatingSubjects", semester) &&
        hasImportedStatus(importStatuses, "courseSelections", semester)
    );
  const hasFatalIssues = issues.some(
    (item) => item.code === "missingValidationRuleSettings"
  );
  const canRunFullValidation =
    semesterKeys.every((key) => {
      const semester = parseSemesterKey(key);
      return (
        semester &&
        hasImportedStatus(importStatuses, "operatingSubjects", semester) &&
        hasImportedStatus(importStatuses, "courseSelections", semester)
      );
    }) && !hasFatalIssues;
  const canRunPartialValidation =
    availablePartialSemesters.length > 0 && !hasFatalIssues;

  return {
    checkedAt: new Date().toISOString(),
    canRunFullValidation,
    canRunPartialValidation,
    availablePartialSemesters,
    counts: {
      operatingSubjectsByStatus,
      courseSelectionsByStatus,
      unregisteredOperatingSubjectCount,
      unknownStudentSemesterCount,
      absentStudentSemesterCount,
      missingExternalCourseStudentCount,
      missingCreditSubjectCount: resolutionStatus.missingCreditCount,
      incompleteExternalCourseInputCount,
      pendingPrerequisiteCandidateCount
    },
    issues
  };
}
