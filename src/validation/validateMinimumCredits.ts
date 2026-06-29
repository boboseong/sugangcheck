import { createValidationError } from "./validationEngine";
import { groupByStudent, representativeRecord, sumCredits } from "./validationUtils";
import type { ValidationRuleContext } from "./types";
import type { ValidationError } from "../types/validation";

export function validateMinimumCredits({
  records,
  setting
}: ValidationRuleContext): ValidationError[] {
  const minimumTotalCredits =
    typeof setting.criteria.minimumTotalCredits === "number"
      ? setting.criteria.minimumTotalCredits
      : 174;
  const errors: ValidationError[] = [];

  for (const studentRecords of groupByStudent(records).values()) {
    const totalCredits = sumCredits(studentRecords);
    const firstRecord = representativeRecord(studentRecords);

    if (firstRecord && totalCredits < minimumTotalCredits) {
      errors.push(
        createValidationError({
          ruleId: "minimumCredits",
          studentId: firstRecord.studentId,
          studentNo: firstRecord.studentNo,
          studentName: firstRecord.studentName,
          message: `총 이수학점 ${totalCredits}학점이 최소 기준 ${minimumTotalCredits}학점보다 적습니다.`,
          relatedRecordIds: studentRecords.map((record) => record.id),
          fixHint: "누락 학기 또는 전입/외부 이수 입력을 확인하세요."
        })
      );
    }
  }

  return errors;
}
