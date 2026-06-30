import JSZip from "jszip";
import { read, type WorkBook } from "xlsx";
import { parseCourseSelectionWorkbook } from "../parsers/parseCourseSelectionFile";
import { parseOperatingSubjectWorkbook } from "../parsers/parseOperatingSubjectFile";
import {
  createSemesterImportStatusId,
  createInitialImportStatuses
} from "../state/importStatusStore";
import { createEmptyProjectState } from "../state/projectWorkspace";
import {
  createStudentSemesterPresence,
  updatePresenceForImportedSemester
} from "../state/studentSemesterPresenceStore";
import { mergeStudentsFromCourseSelectionRows } from "../state/studentStore";
import {
  createCourseSelectionTemplateWorkbook,
  createExternalCourseTemplateWorkbook,
  createOperatingSubjectTemplateWorkbook,
  createValidationRulesTemplateWorkbook,
  createXlsxBlob,
  parseExternalCourseTemplateWorkbook,
  parseValidationRulesTemplateWorkbook,
  templateFileNames
} from "../templates/xlsxTemplates";
import type { ExternalCourseInput, ParsedCourseSelectionRow } from "../types/courseSelection";
import type { DataPreparationStatus, SemesterImportStatus } from "../types/importStatus";
import { semesterKeys, type Semester } from "../types/semester";
import type { Student, StudentSemesterPresence } from "../types/student";
import type { OperatingSubject } from "../types/subject";
import type { ProjectFile, ProjectState } from "../types/project";
import { buildCourseSelectionRecords } from "../validation/buildCourseSelectionRecords";
import { checkDataPreparationStatus } from "../validation/checkDataPreparationStatus";
import {
  createDefaultValidationRuleFunctionMap,
  runValidationEngine
} from "../validation/validationEngine";
import { createProjectFile } from "./projectFileExport";
import { parseSemesterKey, semesterLabel, semesterToKey } from "../utils/semester";

export type ProjectTemplatePackageEntryId =
  | "operatingSubject"
  | "courseSelection"
  | "externalCourse"
  | "validationRules";

export type ProjectTemplatePackageManifest = {
  kind: "sugangcheck.templatePackage";
  packageVersion: 1;
  schemaVersion: number;
  appVersion: string;
  savedAt: string;
  projectName: string;
  createdAt?: string;
  templateEntryNames: Record<ProjectTemplatePackageEntryId, string>;
};

export type ProjectTemplatePackageReadResult = {
  projectFile: ProjectFile;
  manifest: ProjectTemplatePackageManifest;
  autoValidationRan: boolean;
  dataPreparationStatus: DataPreparationStatus;
};

const currentProjectTemplateKind = "sugangcheck.templatePackage";
const manifestEntryName = "manifest.json";
const templateDirectoryName = "templates";
const templatePackageEntryNames: Record<ProjectTemplatePackageEntryId, string> = {
  operatingSubject: `${templateDirectoryName}/${templateFileNames.operatingSubject}`,
  courseSelection: `${templateDirectoryName}/${templateFileNames.courseSelection}`,
  externalCourse: `${templateDirectoryName}/${templateFileNames.externalCourse}`,
  validationRules: `${templateDirectoryName}/${templateFileNames.validationRules}`
};

function safeProjectName(projectName: string): string {
  return projectName.trim().replace(/[\\/:*?"<>|]/g, "_") || "project";
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function isProjectTemplatePackageManifest(
  value: unknown
): value is ProjectTemplatePackageManifest {
  return (
    isObject(value) &&
    value.kind === currentProjectTemplateKind &&
    value.packageVersion === 1 &&
    typeof value.schemaVersion === "number" &&
    typeof value.appVersion === "string" &&
    typeof value.savedAt === "string" &&
    typeof value.projectName === "string" &&
    isObject(value.templateEntryNames)
  );
}

export function projectTemplatePackageFileName(
  projectName: string,
  savedAt = new Date()
): string {
  const datePart = savedAt.toISOString().slice(0, 10).replace(/-/g, "");

  return `${safeProjectName(projectName)}_${datePart}_템플릿.zip`;
}

async function workbookBuffer(workbook: WorkBook): Promise<ArrayBuffer> {
  return createXlsxBlob(workbook).arrayBuffer();
}

export async function createProjectTemplatePackageBlob(input: {
  projectFile: ProjectFile;
}): Promise<Blob> {
  const zip = new JSZip();
  const state = input.projectFile.data;
  const manifest: ProjectTemplatePackageManifest = {
    kind: currentProjectTemplateKind,
    packageVersion: 1,
    schemaVersion: input.projectFile.schemaVersion,
    appVersion: input.projectFile.appVersion,
    savedAt: input.projectFile.savedAt,
    projectName: input.projectFile.projectName,
    createdAt: state.createdAt,
    templateEntryNames: templatePackageEntryNames
  };

  zip.file(
    templatePackageEntryNames.operatingSubject,
    await workbookBuffer(
      createOperatingSubjectTemplateWorkbook(state.operatingSubjects, {
        includeExamples: false
      })
    )
  );
  zip.file(
    templatePackageEntryNames.courseSelection,
    await workbookBuffer(
      createCourseSelectionTemplateWorkbook(state.courseSelectionRows, {
        includeExamples: false
      })
    )
  );
  zip.file(
    templatePackageEntryNames.externalCourse,
    await workbookBuffer(
      createExternalCourseTemplateWorkbook(
        {
          inputs: state.externalCourseInputs,
          students: state.students
        },
        { includeExamples: false }
      )
    )
  );
  zip.file(
    templatePackageEntryNames.validationRules,
    await workbookBuffer(
      createValidationRulesTemplateWorkbook(
        {
          validationRuleSettings: state.validationRuleSettings,
          prerequisiteRules: state.prerequisiteRules,
          detailedConstraintRules: state.detailedConstraintRules
        },
        { includeExamples: false }
      )
    )
  );
  zip.file(manifestEntryName, JSON.stringify(manifest, null, 2));

  return zip.generateAsync({
    type: "blob",
    compression: "DEFLATE",
    compressionOptions: {
      level: 6
    }
  });
}

async function readWorkbookEntry(input: {
  zip: JSZip;
  manifest: ProjectTemplatePackageManifest;
  entryId: ProjectTemplatePackageEntryId;
}): Promise<WorkBook> {
  const entryName =
    input.manifest.templateEntryNames[input.entryId] ??
    templatePackageEntryNames[input.entryId];
  const entry = input.zip.file(entryName);

  if (!entry) {
    throw new Error(`${entryName} 파일을 찾지 못했습니다.`);
  }

  return read(await entry.async("arraybuffer"), {
    type: "array",
    cellDates: true
  });
}

function semesterRowCount<T extends { target: Semester }>(
  rows: readonly T[],
  target: Semester
): number {
  return rows.filter(
    (row) =>
      row.target.grade === target.grade &&
      row.target.semester === target.semester
  ).length;
}

function createImportedStatus(input: {
  sourceType: SemesterImportStatus["sourceType"];
  target: Semester;
  rowCount: number;
  fileName: string;
  savedAt: string;
  needsReview?: boolean;
  message?: string;
}): SemesterImportStatus {
  if (input.rowCount === 0 && !input.needsReview) {
    return {
      id: createSemesterImportStatusId(input.sourceType, input.target),
      target: input.target,
      sourceType: input.sourceType,
      status: "empty"
    };
  }

  return {
    id: createSemesterImportStatusId(input.sourceType, input.target),
    target: input.target,
    sourceType: input.sourceType,
    status: input.needsReview ? "needsReview" : "imported",
    fileName: input.fileName,
    importedAt: input.savedAt,
    rowCount: input.rowCount,
    message: input.message
  };
}

function createImportStatuses(input: {
  operatingSubjects: readonly OperatingSubject[];
  courseSelectionRows: readonly ParsedCourseSelectionRow[];
  courseSelectionReviewSemesters: ReadonlySet<string>;
  savedAt: string;
}): SemesterImportStatus[] {
  return createInitialImportStatuses().map((status) => {
    const target = status.target;
    const targetKey = semesterToKey(target);

    if (status.sourceType === "operatingSubjects") {
      return createImportedStatus({
        sourceType: "operatingSubjects",
        target,
        rowCount: semesterRowCount(input.operatingSubjects, target),
        fileName: templateFileNames.operatingSubject,
        savedAt: input.savedAt
      });
    }

    return createImportedStatus({
      sourceType: "courseSelections",
      target,
      rowCount: semesterRowCount(input.courseSelectionRows, target),
      fileName: templateFileNames.courseSelection,
      savedAt: input.savedAt,
      needsReview: input.courseSelectionReviewSemesters.has(targetKey),
      message: input.courseSelectionReviewSemesters.has(targetKey)
        ? "템플릿 행 일부를 읽지 못했습니다."
        : undefined
    });
  });
}

function normalizeTemplateOperatingSubject(subject: OperatingSubject): OperatingSubject {
  if (subject.masterMatchStatus !== "unmatched") {
    return subject;
  }

  return subject.subjectGroup && subject.selectionType
    ? {
        ...subject,
        masterMatchStatus: "manual"
      }
    : subject;
}

function assertNoFailedOperatingRows(failedRows: readonly { rowNumber: number; message: string }[]) {
  if (failedRows.length === 0) {
    return;
  }

  const preview = failedRows
    .slice(0, 5)
    .map((row) => `${row.rowNumber}행: ${row.message}`)
    .join("\n");
  const suffix =
    failedRows.length > 5
      ? `\n외 ${failedRows.length - 5}건의 오류가 더 있습니다.`
      : "";

  throw new Error(`운영과목 템플릿을 가져오지 못했습니다.\n${preview}${suffix}`);
}

function rebuildPresenceFromCourseSelections(input: {
  students: readonly Student[];
  rows: readonly ParsedCourseSelectionRow[];
  importStatuses: readonly SemesterImportStatus[];
}): StudentSemesterPresence[] {
  let presence = input.students.map(createStudentSemesterPresence);

  input.importStatuses
    .filter(
      (status) =>
        status.sourceType === "courseSelections" &&
        (status.status === "imported" || status.status === "needsReview")
    )
    .forEach((status) => {
      presence = updatePresenceForImportedSemester(
        presence,
        input.students,
        input.rows,
        status.target
      );
    });

  return presence;
}

function parseCourseSelectionTemplates(input: {
  workbook: WorkBook;
  savedAt: string;
}): {
  rows: ParsedCourseSelectionRow[];
  reviewSemesters: Set<string>;
} {
  const rows: ParsedCourseSelectionRow[] = [];
  const reviewSemesters = new Set<string>();

  semesterKeys.forEach((key) => {
    const target = parseSemesterKey(key);

    if (!target) {
      return;
    }

    const sheetName = semesterLabel(target);
    const parseResult = parseCourseSelectionWorkbook(input.workbook, {
      semesterImportId: createSemesterImportStatusId("courseSelections", target),
      target,
      fileName: templateFileNames.courseSelection,
      sheetName
    });

    rows.push(...parseResult.rows);

    if (parseResult.failedRows.length > 0) {
      reviewSemesters.add(key);
    }
  });

  return { rows, reviewSemesters };
}

function runAutomaticValidation(projectState: ProjectState): {
  projectState: ProjectState;
  dataPreparationStatus: DataPreparationStatus;
  autoValidationRan: boolean;
} {
  const dataPreparationStatus = checkDataPreparationStatus({
    importStatuses: projectState.importStatuses,
    studentSemesterPresence: projectState.studentSemesterPresence,
    operatingSubjects: projectState.operatingSubjects,
    courseSelectionRows: projectState.courseSelectionRows,
    externalCourseInputs: projectState.externalCourseInputs,
    prerequisiteRules: projectState.prerequisiteRules,
    validationRuleSettings: projectState.validationRuleSettings
  });

  if (!dataPreparationStatus.canRunFullValidation) {
    return {
      projectState: {
        ...projectState,
        dataPreparationStatus,
        courseSelectionRecords: [],
        validationErrors: [],
        lastValidationResult: undefined
      },
      dataPreparationStatus,
      autoValidationRan: false
    };
  }

  const buildResult = buildCourseSelectionRecords({
    mode: "full",
    courseSelectionRows: projectState.courseSelectionRows,
    externalCourseInputs: projectState.externalCourseInputs,
    operatingSubjects: projectState.operatingSubjects
  });
  const validationResult = runValidationEngine(
    {
      mode: "full",
      records: buildResult.records,
      ruleSettings: projectState.validationRuleSettings
    },
    createDefaultValidationRuleFunctionMap({
      detailedConstraintRules: projectState.detailedConstraintRules,
      operatingSubjects: projectState.operatingSubjects,
      prerequisiteRules: projectState.prerequisiteRules
    })
  );

  return {
    projectState: {
      ...projectState,
      dataPreparationStatus,
      courseSelectionRecords: buildResult.records,
      validationErrors: validationResult.errors,
      lastValidationResult: validationResult
    },
    dataPreparationStatus,
    autoValidationRan: true
  };
}

export async function readProjectTemplatePackage(input: {
  zip: JSZip;
  manifest: ProjectTemplatePackageManifest;
}): Promise<ProjectTemplatePackageReadResult> {
  const [
    operatingWorkbook,
    courseSelectionWorkbook,
    externalCourseWorkbook,
    validationRulesWorkbook
  ] = await Promise.all([
    readWorkbookEntry({
      zip: input.zip,
      manifest: input.manifest,
      entryId: "operatingSubject"
    }),
    readWorkbookEntry({
      zip: input.zip,
      manifest: input.manifest,
      entryId: "courseSelection"
    }),
    readWorkbookEntry({
      zip: input.zip,
      manifest: input.manifest,
      entryId: "externalCourse"
    }),
    readWorkbookEntry({
      zip: input.zip,
      manifest: input.manifest,
      entryId: "validationRules"
    })
  ]);
  const emptyState = createEmptyProjectState(
    input.manifest.projectName,
    input.manifest.createdAt ?? input.manifest.savedAt
  );
  const operatingParseResult = parseOperatingSubjectWorkbook(operatingWorkbook, {
    semesterImportId: "template-operatingSubjects",
    fileName: templateFileNames.operatingSubject
  });

  assertNoFailedOperatingRows(operatingParseResult.failedRows);

  const operatingSubjects = operatingParseResult.subjects.map(
    normalizeTemplateOperatingSubject
  );
  const courseSelectionResult = parseCourseSelectionTemplates({
    workbook: courseSelectionWorkbook,
    savedAt: input.manifest.savedAt
  });
  const importStatuses = createImportStatuses({
    operatingSubjects,
    courseSelectionRows: courseSelectionResult.rows,
    courseSelectionReviewSemesters: courseSelectionResult.reviewSemesters,
    savedAt: input.manifest.savedAt
  });
  let students = mergeStudentsFromCourseSelectionRows(
    [],
    courseSelectionResult.rows
  );
  let studentSemesterPresence = rebuildPresenceFromCourseSelections({
    students,
    rows: courseSelectionResult.rows,
    importStatuses
  });
  const externalCourseResult = parseExternalCourseTemplateWorkbook(
    externalCourseWorkbook,
    students,
    { allowEmpty: true }
  );

  students = externalCourseResult.students;
  const presenceByStudentId = new Map(
    studentSemesterPresence.map((presence) => [presence.studentId, presence])
  );
  studentSemesterPresence = students.map(
    (student) =>
      presenceByStudentId.get(student.studentId) ??
      createStudentSemesterPresence(student)
  );

  const validationRulesResult = parseValidationRulesTemplateWorkbook(
    validationRulesWorkbook,
    emptyState.validationRuleSettings,
    { allowEmpty: true }
  );
  const templateState: ProjectState = {
    ...emptyState,
    schemaVersion: input.manifest.schemaVersion as ProjectState["schemaVersion"],
    updatedAt: input.manifest.savedAt,
    importStatuses,
    students,
    studentSemesterPresence,
    operatingSubjects,
    courseSelectionRows: courseSelectionResult.rows,
    externalCourseInputs: externalCourseResult.inputs as ExternalCourseInput[],
    validationRuleSettings: validationRulesResult.validationRuleSettings,
    prerequisiteRules: validationRulesResult.prerequisiteRules,
    detailedConstraintRules: validationRulesResult.detailedConstraintRules,
    validationErrors: [],
    courseSelectionRecords: []
  };
  const validation = runAutomaticValidation(templateState);
  const projectFile = createProjectFile({
    appVersion: input.manifest.appVersion,
    projectName: input.manifest.projectName,
    state: validation.projectState,
    savedAt: input.manifest.savedAt
  });

  return {
    projectFile,
    manifest: input.manifest,
    autoValidationRan: validation.autoValidationRan,
    dataPreparationStatus: validation.dataPreparationStatus
  };
}
