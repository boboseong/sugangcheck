import type { Semester } from "./semester";

export type SourceLocation = {
  fileName?: string;
  sheetName?: string;
  rowNumber?: number;
  columnNumber?: number;
  cellAddress?: string;
  fieldName?: string;
};

export type ParsedCourseSelectionRow = {
  id: string;
  semesterImportId: string;
  studentId: string;
  studentNo: string;
  studentName: string;
  classNo?: string;
  number?: string;
  gender?: string;
  target: Semester;
  subjectName: string;
  normalizedSubjectName: string;
  credits?: number;
  sourceLocation?: SourceLocation;
};

export type CourseSelectionOrigin =
  | {
      type: "courseSelectionFile";
      semesterImportId: string;
      parsedRowId: string;
      sourceLocation?: SourceLocation;
    }
  | {
      type: "transfer";
      externalInputId: string;
    }
  | {
      type: "externalCourse";
      externalInputId: string;
    };

export type CourseSelectionRecord = {
  id: string;
  studentId: string;
  studentNo: string;
  studentName: string;
  target: Semester;
  subjectName: string;
  normalizedSubjectName: string;
  subjectGroup: string;
  selectionType: string;
  groupType?: string;
  choiceGroup?: string;
  credits: number;
  origin: CourseSelectionOrigin;
};

export const defaultExternalCourseChoiceGroup = "기타";
export const defaultExternalCourseSourceType = "전입/외부 이수";

export type ExternalCourseInputSourceType = string;

export function externalCourseSourceTypeLabel(
  value: ExternalCourseInputSourceType | undefined
): string {
  const trimmedValue = value?.trim();

  if (!trimmedValue) {
    return defaultExternalCourseSourceType;
  }

  const normalizedValue = trimmedValue.toLocaleLowerCase().replace(/\s+/g, "");

  if (["전입", "전입보완", "전학", "transfer"].includes(normalizedValue)) {
    return "전입";
  }

  if (
    ["외부", "외부이수", "external", "externalcourse"].includes(normalizedValue)
  ) {
    return "외부 이수";
  }

  return trimmedValue;
}

export type ExternalCourseInput = {
  id: string;
  studentId: string;
  studentNo: string;
  studentName: string;
  target: Semester;
  subjectName: string;
  normalizedSubjectName: string;
  choiceGroup: string;
  subjectGroup?: string;
  selectionType?: string;
  groupType?: string;
  credits?: number;
  sourceType: ExternalCourseInputSourceType;
  sourceName?: string;
  memo?: string;
  updatedAt: string;
};
