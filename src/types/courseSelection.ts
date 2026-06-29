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
  credits: number;
  origin: CourseSelectionOrigin;
};

export type ExternalCourseInputSourceType = "transfer" | "externalCourse";

export type ExternalCourseInput = {
  id: string;
  studentId: string;
  studentNo: string;
  studentName: string;
  target: Semester;
  subjectName: string;
  normalizedSubjectName: string;
  subjectGroup?: string;
  selectionType?: string;
  groupType?: string;
  credits?: number;
  sourceType: ExternalCourseInputSourceType;
  sourceName?: string;
  memo?: string;
  updatedAt: string;
};
