import { normalizeSubjectName } from "../normalizers/normalizeSubjectName";
import type {
  DetailedConstraintRule,
  DetailedConstraintSubject
} from "../types/validation";

function normalizeConstraintSubject(
  subject: DetailedConstraintSubject
): DetailedConstraintSubject {
  return {
    ...subject,
    normalizedSubjectName: normalizeSubjectName(subject.subjectName)
  };
}

export function normalizeDetailedConstraintRule(
  rule: DetailedConstraintRule
): DetailedConstraintRule {
  if (rule.type === "linkedSubject") {
    return {
      ...rule,
      trigger: normalizeConstraintSubject(rule.trigger),
      required: normalizeConstraintSubject(rule.required)
    };
  }

  return {
    ...rule,
    subjects: rule.subjects.map(normalizeConstraintSubject)
  };
}

export function createDetailedConstraintRuleId(prefix = "manual-detailed") {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
