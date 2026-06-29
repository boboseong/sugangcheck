import type { CourseSelectionOrigin } from "./courseSelection";
import type { Semester } from "./semester";

export type ValidationRuleId =
  | "minimumCredits"
  | "creditDifference"
  | "requiredSubjectGroupCredits"
  | "koreanHistoryCredits"
  | "koreanMathEnglishLimit"
  | "duplicateSubjects"
  | "prerequisites"
  | "detailedConstraints"
  | "courseExistsInOperatingSubjects"
  | "subjectMetadataMismatch";

export type ValidationRuleSetting = {
  id: ValidationRuleId;
  enabled: boolean;
  includeExternalInputs: boolean;
  criteria: Record<string, unknown>;
  updatedAt?: string;
};

export type PrerequisiteRuleStatus = "candidate" | "active" | "disabled";

export type PrerequisiteRuleSource = "manual" | "autoCandidate" | "default";

export type PrerequisiteNumberSystem = "roman" | "latinRoman" | "arabic";

export type PrerequisiteRule = {
  id: string;
  beforeSubjectName: string;
  beforeNormalizedSubjectName: string;
  afterSubjectName: string;
  afterNormalizedSubjectName: string;
  status: PrerequisiteRuleStatus;
  allowConcurrent: boolean;
  includeExternalInputsOverride?: boolean;
  source: PrerequisiteRuleSource;
  detectedNumberSystem?: PrerequisiteNumberSystem;
  updatedAt?: string;
};

export type DetailedConstraintRuleStatus = "active" | "disabled";

export type DetailedConstraintRuleSource = "manual" | "template";

export type DetailedConstraintSubject = {
  target: Semester;
  subjectName: string;
  normalizedSubjectName: string;
};

type DetailedConstraintRuleBase = {
  id: string;
  name: string;
  status: DetailedConstraintRuleStatus;
  includeExternalInputsOverride?: boolean;
  source: DetailedConstraintRuleSource;
  updatedAt?: string;
};

export type LinkedSubjectDetailedConstraintRule = DetailedConstraintRuleBase & {
  type: "linkedSubject";
  trigger: DetailedConstraintSubject;
  required: DetailedConstraintSubject;
};

export type SubjectCountComparison = "atLeast" | "atMost";

export type SubjectCountDetailedConstraintRule = DetailedConstraintRuleBase & {
  type: "subjectCount";
  subjects: DetailedConstraintSubject[];
  comparison: SubjectCountComparison;
  count: number;
};

export type DetailedConstraintRule =
  | LinkedSubjectDetailedConstraintRule
  | SubjectCountDetailedConstraintRule;

export type ValidationErrorType = ValidationRuleId;

export type ValidationError = {
  id: string;
  ruleId: ValidationRuleId | "prerequisiteRule";
  type: ValidationErrorType;
  studentId: string;
  studentNo: string;
  studentName: string;
  message: string;
  relatedRecordIds: string[];
  relatedSubjectNames?: string[];
  semester?: Semester;
  relatedOrigins?: CourseSelectionOrigin[];
  fixHint?: string;
};
