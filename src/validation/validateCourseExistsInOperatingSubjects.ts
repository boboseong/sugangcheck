import type { OperatingSubject } from "../types/subject";
import type { ValidationError } from "../types/validation";
import { createValidationError } from "./validationEngine";
import type { ValidationRuleContext } from "./types";

export function validateCourseExistsInOperatingSubjects(
  { records }: ValidationRuleContext,
  operatingSubjects: readonly OperatingSubject[]
): ValidationError[] {
  return records.flatMap((record) => {
    const exists = operatingSubjects.some(
      (subject) =>
        subject.target.grade === record.target.grade &&
        subject.target.semester === record.target.semester &&
        subject.normalizedSubjectName === record.normalizedSubjectName
    );

    return exists
      ? []
      : [
          createValidationError({
            ruleId: "courseExistsInOperatingSubjects",
            studentId: record.studentId,
            studentNo: record.studentNo,
            studentName: record.studentName,
            message: `${record.subjectName} 과목이 해당 학기 운영과목에 없습니다.`,
            relatedRecordIds: [record.id]
          })
        ];
  });
}
