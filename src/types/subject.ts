import type { Grade, SemesterTerm } from "./semester";

export type SubjectMasterItem = {
  id: string;
  subjectName: string;
  normalizedSubjectName: string;
  subjectGroup: string;
  selectionType: string;
  groupType?: string;
  defaultCredits?: number;
  curriculumYear?: string;
};

export type OperatingSubjectMatchStatus = "matched" | "unmatched" | "manual";

export type OperatingSubject = {
  id: string;
  target: {
    grade: Grade;
    semester: SemesterTerm;
  };
  subjectName: string;
  normalizedSubjectName: string;
  subjectGroup: string;
  selectionType: string;
  groupType?: string;
  credits: number;
  masterMatchStatus: OperatingSubjectMatchStatus;
  overrideId?: string;
  semesterImportId?: string;
  sourceRowNumber?: number;
};

export type SubjectOverrideScope = {
  curriculumYear?: string;
  grade?: Grade;
  semester?: SemesterTerm;
  sourceType?: "operatingSubjects" | "courseSelections" | "externalInput" | "all";
};

export type SubjectOverrideConflictStatus = "none" | "needsReview";

export type SubjectOverride = {
  id: string;
  subjectName: string;
  normalizedSubjectName: string;
  subjectGroup?: string;
  selectionType?: string;
  groupType?: string;
  credits?: number;
  scope: SubjectOverrideScope;
  conflictStatus?: SubjectOverrideConflictStatus;
  updatedAt: string;
  source: "user";
};
