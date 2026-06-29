import { createValidationError } from "./validationEngine";
import { groupByStudent, representativeRecord, sumCredits } from "./validationUtils";
import {
  calculateKoreanMathEnglishLimitCredits,
  resolveKoreanMathEnglishLimitCriteria
} from "../data/defaultCreditCriteria";
import type { ValidationError } from "../types/validation";
import type { ValidationRuleContext } from "./types";

export function validateKoreanMathEnglishLimit({
  records,
  setting
}: ValidationRuleContext): ValidationError[] {
  const criteria = resolveKoreanMathEnglishLimitCriteria(setting.criteria);
  const subjectGroupSet = new Set(criteria.subjectGroups);
  const errors: ValidationError[] = [];

  for (const studentRecords of groupByStudent(records).values()) {
    const totalCredits = sumCredits(studentRecords);
    const limit = calculateKoreanMathEnglishLimitCredits(totalCredits, criteria);
    const targetCredits = studentRecords
      .filter((record) => subjectGroupSet.has(record.subjectGroup))
      .reduce((sum, record) => sum + record.credits, 0);
    const firstRecord = representativeRecord(studentRecords);

    if (firstRecord && targetCredits > limit) {
      errors.push(
        createValidationError({
          ruleId: "koreanMathEnglishLimit",
          studentId: firstRecord.studentId,
          studentNo: firstRecord.studentNo,
          studentName: firstRecord.studentName,
          message: `국어·수학·영어 합산 ${targetCredits}학점이 제한 ${limit}학점을 초과합니다.`,
          relatedRecordIds: studentRecords
            .filter((record) => subjectGroupSet.has(record.subjectGroup))
            .map((record) => record.id)
        })
      );
    }
  }

  return errors;
}
