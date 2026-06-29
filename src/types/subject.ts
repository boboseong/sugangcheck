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
  semesterImportId?: string;
  sourceRowNumber?: number;
};
