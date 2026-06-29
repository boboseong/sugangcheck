import type { OperatingSubject } from "./subject";
import type { Semester } from "./semester";

export type OperatingSubjectColumnMap = {
  grade?: number;
  semester?: number;
  subjectName: number;
  credits: number;
  subjectGroup?: number;
  selectionType?: number;
  groupType?: number;
  groupLabel?: number;
  enrollmentCount?: number;
};

export type OperatingSubjectParseIssue = {
  rowNumber: number;
  message: string;
  rawValues: unknown[];
};

export type OperatingSubjectPreviewRow = {
  rowNumber: number;
  subjectName?: string;
  normalizedSubjectName?: string;
  subjectGroup?: string;
  selectionType?: string;
  groupType?: string;
  credits?: number;
  masterMatchStatus?: OperatingSubject["masterMatchStatus"];
  message?: string;
};

export type OperatingSubjectParseResult = {
  semesterImportId: string;
  fileName?: string;
  sheetName: string;
  target?: Semester;
  headerRowNumber: number;
  columnMap: OperatingSubjectColumnMap;
  subjects: OperatingSubject[];
  failedRows: OperatingSubjectParseIssue[];
  previewRows: OperatingSubjectPreviewRow[];
};
