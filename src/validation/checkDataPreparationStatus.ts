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
import type { OperatingSubject, SubjectOverride } from "../types/subject";
import type { PrerequisiteRule, ValidationRuleSetting } from "../types/validation";
import { semesterKeys, type Semester } from "../types/semester";
import { isSameSemester, parseSemesterKey } from "../utils/semester";

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
  blocksFullValidation = true
): DataPreparationIssue {
  return {
    id: `${code}-${message}`,
    code,
    blocksFullValidation,
    message
  };
}

export function checkDataPreparationStatus(input: {
  importStatuses: readonly SemesterImportStatus[];
  studentSemesterPresence: readonly StudentSemesterPresence[];
  operatingSubjects: readonly OperatingSubject[];
  courseSelectionRows: readonly ParsedCourseSelectionRow[];
  subjectOverrides: readonly SubjectOverride[];
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
  const incompleteSubjectOverrideCount = input.subjectOverrides.filter(
    (override) => !override.subjectGroup || !override.selectionType
  ).length;
  const subjectOverrideConflictCount = input.subjectOverrides.filter(
    (override) => override.conflictStatus === "needsReview"
  ).length;
  const resolutionStatus = checkSubjectResolutionStatus({
    courseSelectionRows: input.courseSelectionRows,
    externalCourseInputs: input.externalCourseInputs,
    operatingSubjects: input.operatingSubjects,
    subjectOverrides: input.subjectOverrides
  });
  const incompleteExternalCourseInputCount = input.externalCourseInputs.filter(
    (externalInput) => !externalInput.subjectName || externalInput.credits === undefined
  ).length;
  const pendingPrerequisiteCandidateCount = input.prerequisiteRules.filter(
    (rule) => rule.status === "candidate"
  ).length;
  const issues: DataPreparationIssue[] = [];

  if (operatingSubjectsByStatus.empty > 0) {
    issues.push(issue("missingOperatingSubjects", "운영과목 6개 학기가 모두 업로드되지 않았습니다."));
  }

  if (courseSelectionsByStatus.empty > 0) {
    issues.push(issue("missingCourseSelections", "수강신청 결과 6개 학기가 모두 업로드되지 않았습니다."));
  }

  if (operatingSubjectsByStatus.error + courseSelectionsByStatus.error > 0) {
    issues.push(issue("importError", "업로드 오류 상태인 학기가 있습니다."));
  }

  if (operatingSubjectsByStatus.needsReview + courseSelectionsByStatus.needsReview > 0) {
    issues.push(issue("needsReview", "검토가 필요한 업로드 학기가 있습니다."));
  }

  if (unknownStudentSemesterCount > 0) {
    issues.push(
      issue("unknownStudentSemester", "학생 학기별 존재 여부에 미확인 값이 남아 있습니다.")
    );
  }

  if (incompleteSubjectOverrideCount > 0) {
    issues.push(issue("unresolvedSubjectOverride", "완료되지 않은 과목 보정값이 있습니다."));
  }

  if (subjectOverrideConflictCount > 0) {
    issues.push(issue("subjectOverrideConflict", "충돌 확인이 필요한 과목 보정값이 있습니다."));
  }

  if (resolutionStatus.missingCreditCount > 0) {
    issues.push(issue("missingCredits", "학점이 해석되지 않은 과목이 있습니다."));
  }

  if (incompleteExternalCourseInputCount > 0) {
    issues.push(
      issue("incompleteExternalCourseInput", "필수값이 비어 있는 전입/외부 이수 입력 행이 있습니다.")
    );
  }

  if (pendingPrerequisiteCandidateCount > 0) {
    issues.push(
      issue(
        "pendingPrerequisiteCandidate",
        "점검 여부가 정해지지 않은 위계 규칙이 남아 있습니다.",
        false
      )
    );
  }

  if (input.validationRuleSettings.length === 0) {
    issues.push(issue("missingValidationRuleSettings", "검증 규칙 설정을 읽을 수 없습니다."));
  }

  const availablePartialSemesters = importStatuses
    .filter(
      (status) =>
        status.sourceType === "courseSelections" && status.status === "imported"
    )
    .map((status) => status.target);
  const hasImportErrors =
    operatingSubjectsByStatus.error + courseSelectionsByStatus.error > 0;
  const hasBlockingIssues = issues.some((item) => item.blocksFullValidation);
  const canRunFullValidation =
    semesterKeys.every((key) => {
      const semester = parseSemesterKey(key);
      return (
        semester &&
        importStatuses.some(
          (status) =>
            status.sourceType === "operatingSubjects" &&
            status.status === "imported" &&
            status.target.grade === semester.grade &&
            status.target.semester === semester.semester
        ) &&
        importStatuses.some(
          (status) =>
            status.sourceType === "courseSelections" &&
            status.status === "imported" &&
            status.target.grade === semester.grade &&
            status.target.semester === semester.semester
        )
      );
    }) && !hasBlockingIssues;
  const canRunPartialValidation =
    availablePartialSemesters.length > 0 && !hasImportErrors;

  return {
    checkedAt: new Date().toISOString(),
    canRunFullValidation,
    canRunPartialValidation,
    availablePartialSemesters,
    counts: {
      operatingSubjectsByStatus,
      courseSelectionsByStatus,
      unknownStudentSemesterCount,
      absentStudentSemesterCount,
      incompleteSubjectOverrideCount,
      subjectOverrideConflictCount,
      missingCreditSubjectCount: resolutionStatus.missingCreditCount,
      incompleteExternalCourseInputCount,
      pendingPrerequisiteCandidateCount
    },
    issues
  };
}
