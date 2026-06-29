import type { ParsedCourseSelectionRow } from "./courseSelection";
import type { Semester } from "./semester";

export type CourseSelectionColumnMap = {
  studentNo?: number;
  grade?: number;
  classNo?: number;
  number?: number;
  gender?: number;
  name: number;
  firstSubjectColumn: number;
};

export type CourseSelectionDetectedSubject = {
  columnIndex: number;
  columnNumber: number;
  subjectName: string;
  normalizedSubjectName: string;
  sourceCode?: string;
};

export type CourseSelectionParseIssue = {
  rowNumber: number;
  message: string;
  rawValues: unknown[];
};

export type CourseSelectionPreviewRow = {
  rowNumber: number;
  studentKey?: string;
  studentName?: string;
  classNo?: string;
  number?: string;
  selectedSubjectCount?: number;
  message?: string;
};

export type CourseSelectionParseResult = {
  semesterImportId: string;
  fileName?: string;
  sheetName: string;
  target: Semester;
  headerRowNumber: number;
  columnMap: CourseSelectionColumnMap;
  detectedSubjects: CourseSelectionDetectedSubject[];
  rows: ParsedCourseSelectionRow[];
  failedRows: CourseSelectionParseIssue[];
  previewRows: CourseSelectionPreviewRow[];
};
