import type {
  CourseSelectionRecord,
  ExternalCourseInput,
  ParsedCourseSelectionRow
} from "./courseSelection";
import type { DataPreparationStatus, SemesterImportStatus } from "./importStatus";
import type { Student, StudentSemesterPresence } from "./student";
import type { OperatingSubject, SubjectMasterItem } from "./subject";
import type {
  DetailedConstraintRule,
  PrerequisiteRule,
  ValidationError,
  ValidationRuleSetting
} from "./validation";
import type { ValidationEngineResult } from "../validation/types";

export type AppSchemaVersion = 4;

export type ProjectEnvelope = {
  schemaVersion: AppSchemaVersion;
  appVersion: string;
  savedAt: string;
  projectName: string;
};

export type ProjectState = {
  schemaVersion: AppSchemaVersion;
  projectName: string;
  createdAt: string;
  updatedAt: string;
  importStatuses: SemesterImportStatus[];
  subjectMasterVersion?: string;
  subjectMasterItems?: SubjectMasterItem[];
  students: Student[];
  studentSemesterPresence: StudentSemesterPresence[];
  operatingSubjects: OperatingSubject[];
  courseSelectionRows: ParsedCourseSelectionRow[];
  externalCourseInputs: ExternalCourseInput[];
  validationRuleSettings: ValidationRuleSetting[];
  prerequisiteRules: PrerequisiteRule[];
  detailedConstraintRules: DetailedConstraintRule[];
  validationErrors: ValidationError[];
  courseSelectionRecords?: CourseSelectionRecord[];
  dataPreparationStatus?: DataPreparationStatus;
  lastValidationResult?: ValidationEngineResult;
};

export type ProjectFile = ProjectEnvelope & {
  data: ProjectState;
};
