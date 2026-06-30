import { createValidationError } from "./validationEngine";
import { groupByStudent } from "./validationUtils";
import type { CourseSelectionRecord } from "../types/courseSelection";
import type { ValidationError } from "../types/validation";
import { semesterToKey, sortBySemester } from "../utils/semester";
import type { ValidationRuleContext } from "./types";

function duplicateSemesterLabel(records: readonly CourseSelectionRecord[]): string {
  return [
    ...new Set(
      sortBySemester(records, (record) => record.target).map((record) =>
        semesterToKey(record.target)
      )
    )
  ].join(", ");
}

export function validateDuplicateSubjects({
  records
}: ValidationRuleContext): ValidationError[] {
  const errors: ValidationError[] = [];

  for (const studentRecords of groupByStudent(records).values()) {
    const bySubject = new Map<string, typeof studentRecords>();

    for (const record of studentRecords) {
      bySubject.set(record.normalizedSubjectName, [
        ...(bySubject.get(record.normalizedSubjectName) ?? []),
        record
      ]);
    }

    for (const duplicateRecords of bySubject.values()) {
      if (duplicateRecords.length <= 1) continue;
      const firstRecord = duplicateRecords[0];
      if (!firstRecord) continue;
      errors.push(
        createValidationError({
          ruleId: "duplicateSubjects",
          studentId: firstRecord.studentId,
          studentNo: firstRecord.studentNo,
          studentName: firstRecord.studentName,
          message: `${firstRecord.subjectName} 과목이 ${duplicateSemesterLabel(
            duplicateRecords
          )}에 중복 신청되었습니다.`,
          relatedRecordIds: duplicateRecords.map((record) => record.id)
        })
      );
    }
  }

  return errors;
}
