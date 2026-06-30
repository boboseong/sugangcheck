import type { CourseSelectionRecord } from "../types/courseSelection";
import type {
  DetailedConstraintRule,
  PrerequisiteRule,
  ValidationError,
  ValidationRuleId,
  ValidationRuleSetting
} from "../types/validation";
import type {
  CreateValidationErrorInput,
  ValidationEngineInput,
  ValidationEngineResult,
  ValidationRuleFunctionMap
} from "./types";
import type { OperatingSubject } from "../types/subject";
import { validateCourseExistsInOperatingSubjects } from "./validateCourseExistsInOperatingSubjects";
import { validateCreditDifference } from "./validateCreditDifference";
import { validateDetailedConstraints } from "./validateDetailedConstraints";
import { validateDuplicateSubjects } from "./validateDuplicateSubjects";
import { validateKoreanHistoryCredits } from "./validateKoreanHistoryCredits";
import { validateKoreanMathEnglishLimit } from "./validateKoreanMathEnglishLimit";
import { validateMinimumCredits } from "./validateMinimumCredits";
import { validatePrerequisites } from "./validatePrerequisites";
import { validateRequiredSubjectGroupCredits } from "./validateRequiredSubjectGroupCredits";
import { validateSubjectMetadataMismatch } from "./validateSubjectMetadataMismatch";

const partialModeSkippedRules = new Set<ValidationRuleId>([
  "minimumCredits",
  "requiredSubjectGroupCredits",
  "koreanHistoryCredits",
  "koreanMathEnglishLimit",
  "detailedConstraints"
]);

function recordsForSetting(
  records: readonly CourseSelectionRecord[],
  setting: ValidationRuleSetting
): CourseSelectionRecord[] {
  if (setting.id === "prerequisites" || setting.id === "detailedConstraints") {
    return [...records];
  }

  if (setting.includeExternalInputs) {
    return [...records];
  }

  return records.filter((record) => record.origin.type === "courseSelectionFile");
}

export function createValidationError({
  ruleId,
  instanceId,
  type = ruleId,
  studentId,
  studentNo,
  studentName,
  message,
  relatedRecordIds,
  semester,
  fixHint
}: CreateValidationErrorInput): ValidationError {
  return {
    id: [ruleId, instanceId, studentId, relatedRecordIds.join("-")]
      .filter(Boolean)
      .join("-"),
    ruleId,
    type,
    studentId,
    studentNo,
    studentName,
    message,
    relatedRecordIds,
    semester,
    fixHint
  };
}

export function runValidationEngine(
  input: ValidationEngineInput,
  validators: ValidationRuleFunctionMap = {}
): ValidationEngineResult {
  const startedAt = performance.now();
  const errors: ValidationError[] = [];
  const executedRuleIds: ValidationRuleId[] = [];
  const skippedRuleIds: ValidationRuleId[] = [];

  for (const setting of input.ruleSettings) {
    const validator = validators[setting.id];

    if (
      !setting.enabled ||
      !validator ||
      (input.mode === "partial" && partialModeSkippedRules.has(setting.id))
    ) {
      skippedRuleIds.push(setting.id);
      continue;
    }

    const ruleErrors = validator({
      mode: input.mode,
      records: recordsForSetting(input.records, setting),
      setting
    });

    errors.push(...ruleErrors);
    executedRuleIds.push(setting.id);
  }

  return {
    errors,
    executedRuleIds,
    skippedRuleIds,
    durationMs: performance.now() - startedAt
  };
}

export function createDefaultValidationRuleFunctionMap(input: {
  detailedConstraintRules: readonly DetailedConstraintRule[];
  operatingSubjects: readonly OperatingSubject[];
  prerequisiteRules: readonly PrerequisiteRule[];
}): ValidationRuleFunctionMap {
  return {
    minimumCredits: validateMinimumCredits,
    creditDifference: validateCreditDifference,
    requiredSubjectGroupCredits: validateRequiredSubjectGroupCredits,
    koreanHistoryCredits: validateKoreanHistoryCredits,
    koreanMathEnglishLimit: validateKoreanMathEnglishLimit,
    duplicateSubjects: validateDuplicateSubjects,
    prerequisites: (context) =>
      validatePrerequisites(context, input.prerequisiteRules),
    detailedConstraints: (context) =>
      validateDetailedConstraints(context, input.detailedConstraintRules),
    courseExistsInOperatingSubjects: (context) =>
      validateCourseExistsInOperatingSubjects(context, input.operatingSubjects),
    subjectMetadataMismatch: (context) =>
      validateSubjectMetadataMismatch(context, input.operatingSubjects)
  };
}
