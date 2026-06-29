import { createValidationError } from "./validationEngine";
import { groupByStudent, representativeRecord } from "./validationUtils";
import type { ValidationError } from "../types/validation";
import type { ValidationRuleContext } from "./types";

type RequiredGroupCriteria = {
  subjectGroup: string;
  requiredCredits: number;
  equivalentSubjectGroups?: string[];
};

function requiredCriteria(criteria: Record<string, unknown>): RequiredGroupCriteria[] {
  const value = criteria.requiredSubjectGroupCredits;
  return Array.isArray(value) ? (value as RequiredGroupCriteria[]) : [];
}

export function validateRequiredSubjectGroupCredits({
  records,
  setting
}: ValidationRuleContext): ValidationError[] {
  const errors: ValidationError[] = [];

  for (const studentRecords of groupByStudent(records).values()) {
    const firstRecord = representativeRecord(studentRecords);
    if (!firstRecord) continue;

    for (const criteria of requiredCriteria(setting.criteria)) {
      const groups = new Set([
        criteria.subjectGroup,
        ...(criteria.equivalentSubjectGroups ?? [])
      ]);
      const credits = studentRecords
        .filter((record) => groups.has(record.subjectGroup))
        .reduce((sum, record) => sum + record.credits, 0);

      if (credits < criteria.requiredCredits) {
        errors.push(
          createValidationError({
            ruleId: "requiredSubjectGroupCredits",
            studentId: firstRecord.studentId,
            studentNo: firstRecord.studentNo,
            studentName: firstRecord.studentName,
            message: `${criteria.subjectGroup} 이수학점 ${credits}학점이 기준 ${criteria.requiredCredits}학점보다 적습니다.`,
            relatedRecordIds: studentRecords.map((record) => record.id)
          })
        );
      }
    }
  }

  return errors;
}
