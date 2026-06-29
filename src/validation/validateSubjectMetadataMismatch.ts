import type { OperatingSubject } from "../types/subject";
import type { ValidationError } from "../types/validation";
import { createValidationError } from "./validationEngine";
import type { ValidationRuleContext } from "./types";

export function validateSubjectMetadataMismatch(
  { records }: ValidationRuleContext,
  operatingSubjects: readonly OperatingSubject[]
): ValidationError[] {
  const errors: ValidationError[] = [];

  for (const record of records) {
    const operatingSubject = operatingSubjects.find(
      (subject) =>
        subject.target.grade === record.target.grade &&
        subject.target.semester === record.target.semester &&
        subject.normalizedSubjectName === record.normalizedSubjectName
    );

    if (!operatingSubject) continue;

    const mismatches = [
      operatingSubject.subjectGroup !== record.subjectGroup ? "교과군" : undefined,
      operatingSubject.selectionType !== record.selectionType ? "선택구분" : undefined,
      operatingSubject.groupType &&
      record.groupType &&
      operatingSubject.groupType !== record.groupType
        ? "과목구분"
        : undefined,
      operatingSubject.credits !== record.credits ? "학점" : undefined
    ].filter(Boolean);

    if (mismatches.length > 0) {
      errors.push(
        createValidationError({
          ruleId: "subjectMetadataMismatch",
          studentId: record.studentId,
          studentNo: record.studentNo,
          studentName: record.studentName,
          message: `${record.subjectName} 과목 정보가 운영과목과 다릅니다: ${mismatches.join(", ")}`,
          relatedRecordIds: [record.id]
        })
      );
    }
  }

  return errors;
}
