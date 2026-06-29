import { createValidationError } from "./validationEngine";
import { groupByStudent, representativeRecord, sumCredits } from "./validationUtils";
import type { CourseSelectionRecord } from "../types/courseSelection";
import type { ValidationError } from "../types/validation";
import { semesterLabel } from "../utils/semester";
import type { ValidationRuleContext } from "./types";

function semesterKey(record: CourseSelectionRecord): string {
  return `${record.target.grade}-${record.target.semester}`;
}

function mode(values: readonly number[]): number | undefined {
  const counts = new Map<number, number>();
  for (const value of values) {
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return [...counts.entries()].sort((left, right) => right[1] - left[1])[0]?.[0];
}

export function validateCreditDifference({
  records,
  setting
}: ValidationRuleContext): ValidationError[] {
  const maxDifferenceCredits =
    typeof setting.criteria.maxDifferenceCredits === "number"
      ? setting.criteria.maxDifferenceCredits
      : 0;
  const bySemester = new Map<string, CourseSelectionRecord[]>();
  const errors: ValidationError[] = [];

  for (const record of records) {
    const key = semesterKey(record);
    bySemester.set(key, [...(bySemester.get(key) ?? []), record]);
  }

  for (const semesterRecords of bySemester.values()) {
    const studentGroups = [...groupByStudent(semesterRecords).values()];
    const totals = studentGroups.map(sumCredits);
    const commonTotal = mode(totals);

    if (commonTotal === undefined) {
      continue;
    }

    for (const studentRecords of studentGroups) {
      const total = sumCredits(studentRecords);
      const firstRecord = representativeRecord(studentRecords);

      if (firstRecord && Math.abs(total - commonTotal) > maxDifferenceCredits) {
        errors.push(
          createValidationError({
            ruleId: "creditDifference",
            studentId: firstRecord.studentId,
            studentNo: firstRecord.studentNo,
            studentName: firstRecord.studentName,
            message: `${semesterLabel(firstRecord.target)} 최빈 이수학점 ${commonTotal}학점과 ${Math.abs(
              total - commonTotal
            )}학점 차이가 납니다.`,
            relatedRecordIds: studentRecords.map((record) => record.id),
            semester: firstRecord.target
          })
        );
      }
    }
  }

  return errors;
}
