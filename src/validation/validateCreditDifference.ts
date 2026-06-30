import { createValidationError } from "./validationEngine";
import { groupByStudent, representativeRecord, sumCredits } from "./validationUtils";
import type { CourseSelectionRecord } from "../types/courseSelection";
import type { SemesterKey } from "../types/semester";
import type { ValidationError } from "../types/validation";
import { semesterLabel } from "../utils/semester";
import {
  activeAllowedValues,
  getSemesterCreditSubjectCriteria,
  semesterCreditSubjectCriteriaByKey,
  semesterCreditSubjectCriteriaKey
} from "./semesterCreditSubjectCriteria";
import type { ValidationRuleContext } from "./types";

function semesterKey(record: CourseSelectionRecord): SemesterKey {
  return `${record.target.grade}-${record.target.semester}` as SemesterKey;
}

function mode(values: readonly number[]): number | undefined {
  const counts = new Map<number, number>();
  for (const value of values) {
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return [...counts.entries()].sort(
    (left, right) => right[1] - left[1] || left[0] - right[0]
  )[0]?.[0];
}

function subjectCount(records: readonly CourseSelectionRecord[]): number {
  return new Set(records.map((record) => record.normalizedSubjectName)).size;
}

function allowedValueLabel(values: readonly number[], unit: string): string {
  return values.map((value) => `${value}${unit}`).join(", ");
}

export function validateCreditDifference({
  records,
  setting
}: ValidationRuleContext): ValidationError[] {
  const maxDifferenceCredits =
    typeof setting.criteria.maxDifferenceCredits === "number"
      ? setting.criteria.maxDifferenceCredits
      : 0;
  const usesSemesterCriteria = Array.isArray(
    setting.criteria[semesterCreditSubjectCriteriaKey]
  );
  const semesterCriteriaByKey = semesterCreditSubjectCriteriaByKey(
    getSemesterCreditSubjectCriteria(setting.criteria)
  );
  const bySemester = new Map<string, CourseSelectionRecord[]>();
  const errors: ValidationError[] = [];

  for (const record of records) {
    const key = semesterKey(record);
    bySemester.set(key, [...(bySemester.get(key) ?? []), record]);
  }

  for (const semesterRecords of bySemester.values()) {
    const studentGroups = [...groupByStudent(semesterRecords).values()];
    const totals = studentGroups.map(sumCredits);
    const subjectCounts = studentGroups.map(subjectCount);
    const commonTotal = mode(totals);
    const commonSubjectCount = mode(subjectCounts);

    if (commonTotal === undefined) {
      continue;
    }

    const firstSemesterRecord = representativeRecord(semesterRecords);
    const criteria = firstSemesterRecord
      ? semesterCriteriaByKey.get(semesterKey(firstSemesterRecord))
      : undefined;
    const configuredCredits = activeAllowedValues(criteria?.allowedCredits ?? []);
    const configuredSubjectCounts = activeAllowedValues(
      criteria?.allowedSubjectCounts ?? []
    );
    const allowedCredits =
      configuredCredits.length > 0 ? configuredCredits : undefined;
    const allowedSubjectCounts =
      configuredSubjectCounts.length > 0
        ? configuredSubjectCounts
        : usesSemesterCriteria && commonSubjectCount !== undefined
          ? [commonSubjectCount]
          : undefined;

    for (const studentRecords of studentGroups) {
      const total = sumCredits(studentRecords);
      const currentSubjectCount = subjectCount(studentRecords);
      const firstRecord = representativeRecord(studentRecords);

      if (!firstRecord) {
        continue;
      }

      if (allowedCredits) {
        if (!allowedCredits.includes(total)) {
          errors.push(
            createValidationError({
              ruleId: "creditDifference",
              instanceId: "credits",
              studentId: firstRecord.studentId,
              studentNo: firstRecord.studentNo,
              studentName: firstRecord.studentName,
              message: `${semesterLabel(firstRecord.target)} 이수학점 ${total}학점이 허용값 ${allowedValueLabel(
                allowedCredits,
                "학점"
              )}과 맞지 않습니다.`,
              relatedRecordIds: studentRecords.map((record) => record.id),
              semester: firstRecord.target
            })
          );
        }
      } else if (Math.abs(total - commonTotal) > maxDifferenceCredits) {
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

      if (
        allowedSubjectCounts &&
        !allowedSubjectCounts.includes(currentSubjectCount)
      ) {
        errors.push(
          createValidationError({
            ruleId: "creditDifference",
            instanceId: "subjects",
            studentId: firstRecord.studentId,
            studentNo: firstRecord.studentNo,
            studentName: firstRecord.studentName,
            message: `${semesterLabel(firstRecord.target)} 과목 수 ${currentSubjectCount}개가 허용값 ${allowedValueLabel(
              allowedSubjectCounts,
              "개"
            )}와 맞지 않습니다.`,
            relatedRecordIds: studentRecords.map((record) => record.id),
            semester: firstRecord.target
          })
        );
      }
    }
  }

  return errors;
}
