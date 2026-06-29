import { normalizeSubjectName } from "../normalizers/normalizeSubjectName";
import { createValidationError } from "./validationEngine";
import { groupByStudent, representativeRecord } from "./validationUtils";
import type { ValidationError } from "../types/validation";
import type { ValidationRuleContext } from "./types";

export function validateKoreanHistoryCredits({
  records,
  setting
}: ValidationRuleContext): ValidationError[] {
  const requiredCredits =
    typeof setting.criteria.requiredCredits === "number"
      ? setting.criteria.requiredCredits
      : 6;
  const subjectNames = Array.isArray(setting.criteria.normalizedSubjectNames)
    ? (setting.criteria.normalizedSubjectNames as string[])
    : ["한국사1", "한국사2"].map(normalizeSubjectName);
  const subjectSet = new Set(subjectNames);
  const errors: ValidationError[] = [];

  for (const studentRecords of groupByStudent(records).values()) {
    const firstRecord = representativeRecord(studentRecords);
    const historyRecords = studentRecords.filter((record) =>
      subjectSet.has(record.normalizedSubjectName)
    );
    const credits = historyRecords.reduce((sum, record) => sum + record.credits, 0);

    if (firstRecord && credits < requiredCredits) {
      errors.push(
        createValidationError({
          ruleId: "koreanHistoryCredits",
          studentId: firstRecord.studentId,
          studentNo: firstRecord.studentNo,
          studentName: firstRecord.studentName,
          message: `한국사 이수학점 ${credits}학점이 기준 ${requiredCredits}학점보다 적습니다.`,
          relatedRecordIds: historyRecords.map((record) => record.id)
        })
      );
    }
  }

  return errors;
}
