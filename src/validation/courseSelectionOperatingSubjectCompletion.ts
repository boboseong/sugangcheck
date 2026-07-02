import type {
  CourseSelectionDetectedSubject,
  ParsedCourseSelectionStudent
} from "../types/CourseSelectionParseResult";
import type { ParsedCourseSelectionRow, SourceLocation } from "../types/courseSelection";
import type { Semester } from "../types/semester";
import type { OperatingSubject } from "../types/subject";
import { isSameSemester } from "../utils/semester";

export type MissingOperatingSubjectSelection = Pick<
  OperatingSubject,
  | "id"
  | "choiceGroup"
  | "credits"
  | "normalizedSubjectName"
  | "subjectName"
  | "target"
>;

function completionRowKey(row: {
  normalizedSubjectName: string;
  studentId: string;
  target: Semester;
}): string {
  return [
    row.target.grade,
    row.target.semester,
    row.studentId,
    row.normalizedSubjectName
  ].join("\u0000");
}

function generatedRowId(
  semesterImportId: string,
  subject: MissingOperatingSubjectSelection,
  student: ParsedCourseSelectionStudent
): string {
  return [
    semesterImportId,
    "generated-operating-subject",
    subject.id,
    student.studentId
  ].join("-");
}

function sourceLocationForGeneratedRow(input: {
  fileName?: string;
  sheetName?: string;
  student: ParsedCourseSelectionStudent;
  subject: MissingOperatingSubjectSelection;
}): SourceLocation {
  return {
    fileName: input.fileName,
    sheetName: input.sheetName,
    rowNumber: input.student.sourceRowNumber,
    fieldName: `운영과목 모두 이수 반영: ${input.subject.subjectName}`
  };
}

export function findMissingOperatingSubjectSelections(input: {
  target: Semester;
  detectedSubjects: readonly CourseSelectionDetectedSubject[];
  operatingSubjects: readonly OperatingSubject[];
}): MissingOperatingSubjectSelection[] {
  const detectedNormalizedNames = new Set(
    input.detectedSubjects
      .map((subject) => subject.normalizedSubjectName)
      .filter(Boolean)
  );
  const missingByNormalizedName = new Map<string, MissingOperatingSubjectSelection>();

  for (const subject of input.operatingSubjects) {
    if (
      !isSameSemester(subject.target, input.target) ||
      !subject.normalizedSubjectName ||
      detectedNormalizedNames.has(subject.normalizedSubjectName) ||
      missingByNormalizedName.has(subject.normalizedSubjectName)
    ) {
      continue;
    }

    missingByNormalizedName.set(subject.normalizedSubjectName, {
      id: subject.id,
      choiceGroup: subject.choiceGroup,
      credits: subject.credits,
      normalizedSubjectName: subject.normalizedSubjectName,
      subjectName: subject.subjectName,
      target: subject.target
    });
  }

  return [...missingByNormalizedName.values()];
}

export function createGeneratedCourseSelectionRows(input: {
  semesterImportId: string;
  fileName?: string;
  sheetName?: string;
  target: Semester;
  students: readonly ParsedCourseSelectionStudent[];
  subjects: readonly MissingOperatingSubjectSelection[];
  existingRows?: readonly ParsedCourseSelectionRow[];
}): ParsedCourseSelectionRow[] {
  const existingKeys = new Set(
    (input.existingRows ?? []).map((row) => completionRowKey(row))
  );
  const rows: ParsedCourseSelectionRow[] = [];

  for (const subject of input.subjects) {
    for (const student of input.students) {
      const key = completionRowKey({
        studentId: student.studentId,
        normalizedSubjectName: subject.normalizedSubjectName,
        target: input.target
      });

      if (existingKeys.has(key)) {
        continue;
      }

      existingKeys.add(key);
      rows.push({
        id: generatedRowId(input.semesterImportId, subject, student),
        semesterImportId: input.semesterImportId,
        studentId: student.studentId,
        studentNo: student.studentNo,
        studentName: student.studentName,
        classNo: student.classNo,
        number: student.number,
        gender: student.gender,
        target: input.target,
        subjectName: subject.subjectName,
        normalizedSubjectName: subject.normalizedSubjectName,
        credits: subject.credits,
        sourceLocation: sourceLocationForGeneratedRow({
          fileName: input.fileName,
          sheetName: input.sheetName,
          student,
          subject
        })
      });
    }
  }

  return rows;
}

export function appendGeneratedCourseSelectionRows(
  rows: readonly ParsedCourseSelectionRow[],
  generatedRows: readonly ParsedCourseSelectionRow[]
): ParsedCourseSelectionRow[] {
  const existingKeys = new Set(rows.map((row) => completionRowKey(row)));
  const nextRows = [...rows];

  for (const row of generatedRows) {
    const key = completionRowKey(row);

    if (existingKeys.has(key)) {
      continue;
    }

    existingKeys.add(key);
    nextRows.push(row);
  }

  return nextRows;
}
