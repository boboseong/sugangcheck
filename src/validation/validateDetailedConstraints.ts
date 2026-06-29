import type { CourseSelectionRecord } from "../types/courseSelection";
import type {
  DetailedConstraintRule,
  DetailedConstraintSubject,
  ValidationError
} from "../types/validation";
import { semesterLabel, semesterToKey } from "../utils/semester";
import { createValidationError } from "./validationEngine";
import { groupByStudent, representativeRecord } from "./validationUtils";
import type { ValidationRuleContext } from "./types";

function subjectLabel(subject: DetailedConstraintSubject): string {
  return `${semesterLabel(subject.target)} ${subject.subjectName}`;
}

function matchesSubject(
  record: CourseSelectionRecord,
  subject: DetailedConstraintSubject
): boolean {
  return (
    record.target.grade === subject.target.grade &&
    record.target.semester === subject.target.semester &&
    record.normalizedSubjectName === subject.normalizedSubjectName
  );
}

function recordsForRule(
  records: readonly CourseSelectionRecord[],
  rule: DetailedConstraintRule
): CourseSelectionRecord[] {
  if (rule.includeExternalInputsOverride ?? true) {
    return [...records];
  }

  return records.filter((record) => record.origin.type === "courseSelectionFile");
}

function subjectKey(subject: DetailedConstraintSubject): string {
  return `${semesterToKey(subject.target)}|${subject.normalizedSubjectName}`;
}

function uniqueMatchedRecords(input: {
  records: readonly CourseSelectionRecord[];
  subjects: readonly DetailedConstraintSubject[];
}): CourseSelectionRecord[] {
  const firstRecordBySubjectKey = new Map<string, CourseSelectionRecord>();

  input.subjects.forEach((subject) => {
    const matchedRecord = input.records.find((record) =>
      matchesSubject(record, subject)
    );

    if (matchedRecord) {
      firstRecordBySubjectKey.set(subjectKey(subject), matchedRecord);
    }
  });

  return [...firstRecordBySubjectKey.values()];
}

function createDetailedConstraintError(input: {
  rule: DetailedConstraintRule;
  student: CourseSelectionRecord;
  message: string;
  relatedRecordIds: string[];
  relatedSubjectNames: string[];
}): ValidationError {
  const baseError = createValidationError({
    ruleId: "detailedConstraints",
    studentId: input.student.studentId,
    studentNo: input.student.studentNo,
    studentName: input.student.studentName,
    message: input.message,
    relatedRecordIds: input.relatedRecordIds,
    fixHint: "세부 제약 규칙과 해당 학생의 학기별 이수 과목을 확인하세요."
  });

  return {
    ...baseError,
    id: [
      "detailedConstraints",
      input.rule.id,
      input.student.studentId,
      input.relatedRecordIds.join("-") || "no-record"
    ].join("-"),
    relatedSubjectNames: input.relatedSubjectNames
  };
}

function validateLinkedSubjectRule(input: {
  rule: Extract<DetailedConstraintRule, { type: "linkedSubject" }>;
  studentRecords: readonly CourseSelectionRecord[];
}): ValidationError[] {
  const ruleRecords = recordsForRule(input.studentRecords, input.rule);
  const triggerRecords = ruleRecords.filter((record) =>
    matchesSubject(record, input.rule.trigger)
  );

  if (triggerRecords.length === 0) {
    return [];
  }

  const hasRequired = ruleRecords.some((record) =>
    matchesSubject(record, input.rule.required)
  );

  if (hasRequired) {
    return [];
  }

  const student = triggerRecords[0];

  if (!student) {
    return [];
  }

  return [
    createDetailedConstraintError({
      rule: input.rule,
      student,
      message: `${subjectLabel(input.rule.trigger)}를 이수했지만 ${subjectLabel(
        input.rule.required
      )}를 이수하지 않았습니다.`,
      relatedRecordIds: triggerRecords.map((record) => record.id),
      relatedSubjectNames: [
        input.rule.trigger.subjectName,
        input.rule.required.subjectName
      ]
    })
  ];
}

function validateSubjectCountRule(input: {
  rule: Extract<DetailedConstraintRule, { type: "subjectCount" }>;
  studentRecords: readonly CourseSelectionRecord[];
}): ValidationError[] {
  const ruleRecords = recordsForRule(input.studentRecords, input.rule);
  const matchedRecords = uniqueMatchedRecords({
    records: ruleRecords,
    subjects: input.rule.subjects
  });
  const matchedCount = matchedRecords.length;
  const isViolation =
    input.rule.comparison === "atLeast"
      ? matchedCount >= input.rule.count
      : matchedCount <= input.rule.count;
  const student = representativeRecord(input.studentRecords);

  if (!isViolation || !student) {
    return [];
  }

  const comparisonLabel =
    input.rule.comparison === "atLeast" ? "이상" : "이하";

  return [
    createDetailedConstraintError({
      rule: input.rule,
      student,
      message: `${input.rule.name} 조건의 지정 과목을 ${matchedCount}개 선택하여 기준 ${input.rule.count}개 ${comparisonLabel}에 해당합니다.`,
      relatedRecordIds: matchedRecords.map((record) => record.id),
      relatedSubjectNames: input.rule.subjects.map((subject) => subject.subjectName)
    })
  ];
}

export function validateDetailedConstraints(
  { records }: ValidationRuleContext,
  detailedConstraintRules: readonly DetailedConstraintRule[]
): ValidationError[] {
  const activeRules = detailedConstraintRules.filter(
    (rule) => rule.status === "active"
  );
  const errors: ValidationError[] = [];

  for (const studentRecords of groupByStudent(records).values()) {
    for (const rule of activeRules) {
      errors.push(
        ...(rule.type === "linkedSubject"
          ? validateLinkedSubjectRule({ rule, studentRecords })
          : validateSubjectCountRule({ rule, studentRecords }))
      );
    }
  }

  return errors;
}
