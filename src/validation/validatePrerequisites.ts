import type { CourseSelectionRecord } from "../types/courseSelection";
import type { PrerequisiteRule, ValidationError } from "../types/validation";
import { createValidationError } from "./validationEngine";
import { groupByStudent } from "./validationUtils";
import type { ValidationRuleContext } from "./types";

function compareRecordSemester(left: CourseSelectionRecord, right: CourseSelectionRecord): number {
  return left.target.grade - right.target.grade || left.target.semester - right.target.semester;
}

export function validatePrerequisites(
  { records }: ValidationRuleContext,
  prerequisiteRules: readonly PrerequisiteRule[]
): ValidationError[] {
  const activeRules = prerequisiteRules.filter((rule) => rule.status === "active");
  const errors: ValidationError[] = [];

  for (const studentRecords of groupByStudent(records).values()) {
    for (const rule of activeRules) {
      const ruleRecords =
        rule.includeExternalInputsOverride === false
          ? studentRecords.filter(
              (record) => record.origin.type === "courseSelectionFile"
            )
          : studentRecords;
      const beforeRecords = ruleRecords.filter(
        (record) => record.normalizedSubjectName === rule.beforeNormalizedSubjectName
      );
      const afterRecords = ruleRecords.filter(
        (record) => record.normalizedSubjectName === rule.afterNormalizedSubjectName
      );

      for (const afterRecord of afterRecords) {
        const satisfied = beforeRecords.some((beforeRecord) => {
          const order = compareRecordSemester(beforeRecord, afterRecord);
          return rule.allowConcurrent ? order <= 0 : order < 0;
        });

        if (!satisfied) {
          errors.push(
            createValidationError({
              ruleId: "prerequisites",
              studentId: afterRecord.studentId,
              studentNo: afterRecord.studentNo,
              studentName: afterRecord.studentName,
              message: `${afterRecord.subjectName} 이수 전 ${rule.beforeSubjectName} 이수가 필요합니다.`,
              relatedRecordIds: [afterRecord.id, ...beforeRecords.map((record) => record.id)]
            })
          );
        }
      }
    }
  }

  return errors;
}
