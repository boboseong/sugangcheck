import type { Semester } from "./semester";

export type ImportStatus = "empty" | "imported" | "error" | "needsReview";

export type ImportSourceType = "operatingSubjects" | "courseSelections";

export type SemesterImportStatus = {
  id: string;
  target: Semester;
  sourceType: ImportSourceType;
  status: ImportStatus;
  fileName?: string;
  importedAt?: string;
  rowCount?: number;
  message?: string;
};

export type DataPreparationIssueCode =
  | "missingOperatingSubjects"
  | "missingCourseSelections"
  | "importError"
  | "needsReview"
  | "unknownStudentSemester"
  | "unresolvedSubjectOverride"
  | "subjectOverrideConflict"
  | "missingCredits"
  | "incompleteExternalCourseInput"
  | "pendingPrerequisiteCandidate"
  | "missingValidationRuleSettings";

export type DataPreparationIssue = {
  id: string;
  code: DataPreparationIssueCode;
  blocksFullValidation: boolean;
  message: string;
  relatedSemester?: Semester;
  relatedIds?: string[];
};

export type DataPreparationCounts = {
  operatingSubjectsByStatus: Record<ImportStatus, number>;
  courseSelectionsByStatus: Record<ImportStatus, number>;
  unknownStudentSemesterCount: number;
  absentStudentSemesterCount: number;
  incompleteSubjectOverrideCount: number;
  subjectOverrideConflictCount: number;
  missingCreditSubjectCount: number;
  incompleteExternalCourseInputCount: number;
  pendingPrerequisiteCandidateCount: number;
};

export type DataPreparationStatus = {
  checkedAt: string;
  canRunFullValidation: boolean;
  canRunPartialValidation: boolean;
  availablePartialSemesters: Semester[];
  counts: DataPreparationCounts;
  issues: DataPreparationIssue[];
};
