import type {
  CourseSelectionRecord,
  ExternalCourseInput,
  ParsedCourseSelectionRow
} from "../types/courseSelection";
import type { ProjectFile, ProjectState } from "../types/project";
import type { Student, StudentSemesterPresence } from "../types/student";
import type { ValidationError } from "../types/validation";
import type { ValidationEngineResult } from "../validation/types";
import {
  createGeneratedStudentNo,
  createStudentAuxiliaryKey
} from "../utils/studentKey";

export const currentProjectSchemaVersion = 3;

type MigratableProjectState = Omit<
  ProjectState,
  "schemaVersion" | "detailedConstraintRules"
> & {
  schemaVersion: number;
  detailedConstraintRules?: ProjectState["detailedConstraintRules"];
};

type MigratableProjectFile = Omit<ProjectFile, "schemaVersion" | "data"> & {
  schemaVersion: number;
  data: MigratableProjectState;
};

type Identity = {
  studentId: string;
  studentNo: string;
};

type IdentitySource = {
  studentId?: unknown;
  studentNo?: unknown;
  target?: {
    grade?: unknown;
  };
  grade?: unknown;
  classNo?: unknown;
  number?: unknown;
  currentClassNo?: unknown;
  currentNumber?: unknown;
};

const supportedProjectSchemaVersions = [1, 2, currentProjectSchemaVersion] as const;

function normalizeIdentifier(value: unknown): string {
  return String(value ?? "").normalize("NFKC").trim().replace(/\s+/g, "");
}

function optionalString(value: unknown): string | undefined {
  const normalized = String(value ?? "").normalize("NFKC").trim();

  return normalized ? normalized : undefined;
}

function identifierValue(value: unknown): string | number | null | undefined {
  if (
    typeof value === "string" ||
    typeof value === "number" ||
    value === null ||
    value === undefined
  ) {
    return value;
  }

  return String(value);
}

function generatedStudentNoFrom(source: IdentitySource): string {
  return createGeneratedStudentNo({
    grade: identifierValue(source.target?.grade ?? source.grade),
    classNo: identifierValue(source.classNo ?? source.currentClassNo),
    number: identifierValue(source.number ?? source.currentNumber)
  });
}

function studentNoFromId(studentId: string): string {
  const lastPart = studentId.split(":").at(-1);

  return normalizeIdentifier(lastPart);
}

function studentNoFromSource(source: IdentitySource): string {
  return (
    generatedStudentNoFrom(source) ||
    normalizeIdentifier(source.studentNo) ||
    studentNoFromId(normalizeIdentifier(source.studentId))
  );
}

function identityFromStudentNo(studentNo: string): Identity {
  const normalizedStudentNo = normalizeIdentifier(studentNo);

  return {
    studentId: createStudentAuxiliaryKey({ studentNo: normalizedStudentNo }),
    studentNo: normalizedStudentNo
  };
}

function createIdentityMap(projectState: MigratableProjectState): Map<string, Identity> {
  const identityByOldId = new Map<string, Identity>();

  function add(source: IdentitySource) {
    const oldId = normalizeIdentifier(source.studentId);
    const studentNo = studentNoFromSource(source);

    if (!oldId || !studentNo || identityByOldId.has(oldId)) {
      return;
    }

    identityByOldId.set(oldId, identityFromStudentNo(studentNo));
  }

  projectState.courseSelectionRows?.forEach(add);
  projectState.students?.forEach(add);
  projectState.studentSemesterPresence?.forEach(add);
  projectState.externalCourseInputs?.forEach(add);
  projectState.validationErrors?.forEach(add);
  projectState.courseSelectionRecords?.forEach(add);
  projectState.lastValidationResult?.errors.forEach(add);

  return identityByOldId;
}

function resolveIdentity(
  identityByOldId: Map<string, Identity>,
  source: IdentitySource
): Identity {
  const oldId = normalizeIdentifier(source.studentId);
  const existing = oldId ? identityByOldId.get(oldId) : undefined;

  if (existing) {
    return existing;
  }

  const studentNo = studentNoFromSource(source);
  const identity = identityFromStudentNo(studentNo);

  if (oldId) {
    identityByOldId.set(oldId, identity);
  }

  return identity;
}

function migrateStudent(
  identityByOldId: Map<string, Identity>,
  student: Student
): Student {
  const identity = resolveIdentity(identityByOldId, student);

  return {
    studentId: identity.studentId,
    studentNo: identity.studentNo,
    name: student.name,
    currentClassNo: optionalString(student.currentClassNo),
    currentNumber: optionalString(student.currentNumber),
    gender: optionalString(student.gender)
  };
}

function migrateStudentPresence(
  identityByOldId: Map<string, Identity>,
  presence: StudentSemesterPresence
): StudentSemesterPresence {
  const identity = resolveIdentity(identityByOldId, presence);

  return {
    studentId: identity.studentId,
    studentNo: identity.studentNo,
    name: optionalString(presence.name),
    semesters: presence.semesters
  };
}

function migrateParsedRow(
  identityByOldId: Map<string, Identity>,
  row: ParsedCourseSelectionRow
): ParsedCourseSelectionRow {
  const identity = resolveIdentity(identityByOldId, row);

  return {
    id: row.id,
    semesterImportId: row.semesterImportId,
    studentId: identity.studentId,
    studentNo: identity.studentNo,
    studentName: row.studentName,
    classNo: optionalString(row.classNo),
    number: optionalString(row.number),
    gender: optionalString(row.gender),
    target: row.target,
    subjectName: row.subjectName,
    normalizedSubjectName: row.normalizedSubjectName,
    credits: row.credits,
    sourceLocation: row.sourceLocation
  };
}

function migrateExternalInput(
  identityByOldId: Map<string, Identity>,
  input: ExternalCourseInput
): ExternalCourseInput {
  const identity = resolveIdentity(identityByOldId, input);

  return {
    ...input,
    studentId: identity.studentId,
    studentNo: identity.studentNo
  };
}

function migrateCourseSelectionRecord(
  identityByOldId: Map<string, Identity>,
  record: CourseSelectionRecord
): CourseSelectionRecord {
  const identity = resolveIdentity(identityByOldId, record);

  return {
    ...record,
    studentId: identity.studentId,
    studentNo: identity.studentNo
  };
}

function migrateValidationError(
  identityByOldId: Map<string, Identity>,
  error: ValidationError
): ValidationError {
  const identity = resolveIdentity(identityByOldId, error);

  return {
    ...error,
    studentId: identity.studentId,
    studentNo: identity.studentNo
  };
}

function migrateValidationResult(
  identityByOldId: Map<string, Identity>,
  result: ValidationEngineResult | undefined
): ValidationEngineResult | undefined {
  if (!result) {
    return undefined;
  }

  return {
    ...result,
    errors: result.errors.map((error) =>
      migrateValidationError(identityByOldId, error)
    )
  };
}

export function migrateProjectState(
  projectState: MigratableProjectState
): ProjectState {
  if (
    !supportedProjectSchemaVersions.includes(
      projectState.schemaVersion as 1 | 2 | 3
    )
  ) {
    throw new Error(
      `지원하지 않는 프로젝트 스키마 버전입니다: ${projectState.schemaVersion}`
    );
  }

  const identityByOldId = createIdentityMap(projectState);

  return {
    ...projectState,
    schemaVersion: currentProjectSchemaVersion,
    detailedConstraintRules: projectState.detailedConstraintRules ?? [],
    students: projectState.students.map((student) =>
      migrateStudent(identityByOldId, student)
    ),
    studentSemesterPresence: projectState.studentSemesterPresence.map((presence) =>
      migrateStudentPresence(identityByOldId, presence)
    ),
    courseSelectionRows: projectState.courseSelectionRows.map((row) =>
      migrateParsedRow(identityByOldId, row)
    ),
    externalCourseInputs: projectState.externalCourseInputs.map((input) =>
      migrateExternalInput(identityByOldId, input)
    ),
    validationErrors: projectState.validationErrors.map((error) =>
      migrateValidationError(identityByOldId, error)
    ),
    courseSelectionRecords: projectState.courseSelectionRecords?.map((record) =>
      migrateCourseSelectionRecord(identityByOldId, record)
    ),
    lastValidationResult: migrateValidationResult(
      identityByOldId,
      projectState.lastValidationResult
    )
  };
}

export function migrateProjectFile(projectFile: MigratableProjectFile): ProjectFile {
  const migratedState = migrateProjectState(projectFile.data);

  return {
    ...projectFile,
    schemaVersion: currentProjectSchemaVersion,
    data: migratedState
  };
}
