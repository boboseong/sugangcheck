import { subjectMasterVersion } from "../data/subjectMaster";
import { defaultDetailedConstraintRules } from "../data/defaultDetailedConstraintRules";
import { defaultPrerequisiteRules } from "../data/defaultPrerequisiteRules";
import { defaultValidationRuleSettings } from "../data/defaultValidationRules";
import {
  createProjectRecord,
  getActiveProjectId,
  legacyDefaultProjectId,
  listProjectRecords,
  loadProjectRecord,
  saveProjectRecord,
  setActiveProjectId
} from "../storage/indexedDbStorage";
import { createStoredProjectRecord } from "../storage/indexedDbStorage";
import { currentProjectSchemaVersion } from "../storage/projectMigration";
import type { ProjectState } from "../types/project";
import type { ImportSourceType, SemesterImportStatus } from "../types/importStatus";
import type { ParsedCourseSelectionRow } from "../types/courseSelection";
import type { Semester } from "../types/semester";
import type { OperatingSubject } from "../types/subject";
import {
  createEmptySemesterImportStatus,
  createInitialImportStatuses
} from "./importStatusStore";
import {
  replaceCourseSelectionRowsForSemesterInList,
  useCourseSelectionRawStore
} from "./courseSelectionRawStore";
import { useExternalCourseInputStore } from "./externalCourseInputStore";
import { useImportStatusStore } from "./importStatusStore";
import { useNormalizedCourseSelectionStore } from "./normalizedCourseSelectionStore";
import {
  replaceOperatingSubjectsForSemesterInList,
  useOperatingSubjectStore
} from "./operatingSubjectStore";
import { appVersion, defaultProjectName, useProjectMetaStore } from "./projectMetaStore";
import { usePrerequisiteRuleStore } from "./prerequisiteRuleStore";
import {
  createStudentSemesterPresence,
  updatePresenceForImportedSemester,
  useStudentSemesterPresenceStore
} from "./studentSemesterPresenceStore";
import {
  mergeStudentsFromCourseSelectionRows,
  useStudentStore
} from "./studentStore";
import { useDetailedConstraintRuleStore } from "./detailedConstraintRuleStore";
import { useValidationResultStore } from "./validationResultStore";
import { useValidationRuleSettingStore } from "./validationRuleSettingStore";

export type ProjectImportSection =
  | "operatingSubjects"
  | "validationRules"
  | "courseSelections"
  | "externalCourses";

export type SemesterProjectImportSection = Extract<
  ProjectImportSection,
  "operatingSubjects" | "courseSelections"
>;

export type ProjectSectionImportResult = {
  skippedExternalCourseInputCount: number;
};

let hydrationDepth = 0;

export function isProjectHydrating(): boolean {
  return hydrationDepth > 0;
}

export function runProjectHydration<T>(callback: () => T): T {
  hydrationDepth += 1;

  try {
    return callback();
  } finally {
    hydrationDepth -= 1;
  }
}

function clone<T>(value: T): T {
  return structuredClone(value);
}

function replaceImportStatusesForSource(
  currentStatuses: readonly SemesterImportStatus[],
  sourceStatuses: readonly SemesterImportStatus[],
  sourceType: ImportSourceType
): SemesterImportStatus[] {
  return [
    ...currentStatuses.filter((status) => status.sourceType !== sourceType),
    ...sourceStatuses.filter((status) => status.sourceType === sourceType)
  ];
}

function isSameSemester(left: Semester, right: Semester): boolean {
  return left.grade === right.grade && left.semester === right.semester;
}

function replaceImportStatusForTarget(
  currentStatuses: readonly SemesterImportStatus[],
  sourceStatuses: readonly SemesterImportStatus[],
  sourceType: ImportSourceType,
  target: Semester
): SemesterImportStatus[] {
  const sourceStatus =
    sourceStatuses.find(
      (status) =>
        status.sourceType === sourceType && isSameSemester(status.target, target)
    ) ?? createEmptySemesterImportStatus(sourceType, target);
  const nextStatus = clone(sourceStatus);
  const replaced = currentStatuses.map((status) =>
    status.sourceType === sourceType && isSameSemester(status.target, target)
      ? nextStatus
      : status
  );

  return replaced.some(
    (status) =>
      status.sourceType === sourceType && isSameSemester(status.target, target)
  )
    ? replaced
    : [...replaced, nextStatus];
}

function rebuildPresenceFromCourseSelections(
  rows: readonly ParsedCourseSelectionRow[],
  statuses: readonly SemesterImportStatus[]
) {
  const students = mergeStudentsFromCourseSelectionRows([], rows);
  const importedStatuses = statuses.filter(
    (status) =>
      status.sourceType === "courseSelections" &&
      (status.status === "imported" || status.status === "needsReview")
  );
  let presence = students.map(createStudentSemesterPresence);

  for (const status of importedStatuses) {
    presence = updatePresenceForImportedSemester(
      presence,
      students,
      rows,
      status.target
    );
  }

  return { presence, students };
}

export function createEmptyProjectState(
  projectName = defaultProjectName,
  now = new Date().toISOString()
): ProjectState {
  return {
    schemaVersion: currentProjectSchemaVersion,
    projectName,
    createdAt: now,
    updatedAt: now,
    importStatuses: createInitialImportStatuses(),
    subjectMasterVersion,
    students: [],
    studentSemesterPresence: [],
    operatingSubjects: [],
    courseSelectionRows: [],
    externalCourseInputs: [],
    validationRuleSettings: clone(defaultValidationRuleSettings),
    prerequisiteRules: clone(defaultPrerequisiteRules),
    detailedConstraintRules: clone(defaultDetailedConstraintRules),
    validationErrors: [],
    courseSelectionRecords: []
  };
}

export function collectProjectState(now = new Date().toISOString()): ProjectState {
  const projectMeta = useProjectMetaStore.getState();
  const validationResultState = useValidationResultStore.getState();

  return {
    schemaVersion: currentProjectSchemaVersion,
    projectName: projectMeta.projectName,
    createdAt: projectMeta.createdAt,
    updatedAt: now,
    importStatuses: clone(useImportStatusStore.getState().importStatuses),
    subjectMasterVersion,
    students: clone(useStudentStore.getState().students),
    studentSemesterPresence: clone(
      useStudentSemesterPresenceStore.getState().studentSemesterPresence
    ),
    operatingSubjects: clone(useOperatingSubjectStore.getState().operatingSubjects),
    courseSelectionRows: clone(
      useCourseSelectionRawStore.getState().courseSelectionRows
    ),
    externalCourseInputs: clone(
      useExternalCourseInputStore.getState().externalCourseInputs
    ),
    validationRuleSettings: clone(
      useValidationRuleSettingStore.getState().validationRuleSettings
    ),
    prerequisiteRules: clone(usePrerequisiteRuleStore.getState().prerequisiteRules),
    detailedConstraintRules: clone(
      useDetailedConstraintRuleStore.getState().detailedConstraintRules
    ),
    validationErrors: clone(validationResultState.validationErrors),
    courseSelectionRecords: clone(
      useNormalizedCourseSelectionStore.getState().courseSelectionRecords
    ),
    lastValidationResult: validationResultState.lastValidationResult
      ? clone(validationResultState.lastValidationResult)
      : undefined
  };
}

export function clearDerivedValidationState() {
  useNormalizedCourseSelectionStore.getState().clearCourseSelectionRecords();
  useValidationResultStore.getState().clearValidationResult();
}

function seedCreditDifferenceCriteriaFromCurrentInputs() {
  useValidationRuleSettingStore
    .getState()
    .seedCreditDifferenceCriteriaFromInputs({
      courseSelectionRows: useCourseSelectionRawStore.getState().courseSelectionRows,
      operatingSubjects: useOperatingSubjectStore.getState().operatingSubjects
    });
}

export function applyProjectState(
  projectState: ProjectState,
  options: { activeProjectId?: string; savedAt?: string } = {}
) {
  runProjectHydration(() => {
    useProjectMetaStore.getState().hydrateProjectMeta({
      activeProjectId: options.activeProjectId,
      projectName: projectState.projectName,
      schemaVersion: projectState.schemaVersion,
      createdAt: projectState.createdAt,
      savedAt: options.savedAt ?? projectState.updatedAt
    });
    useImportStatusStore.setState({
      importStatuses: clone(projectState.importStatuses)
    });
    useOperatingSubjectStore.setState({
      operatingSubjects: clone(projectState.operatingSubjects)
    });
    useCourseSelectionRawStore.setState({
      courseSelectionRows: clone(projectState.courseSelectionRows)
    });
    useStudentStore.setState({ students: clone(projectState.students) });
    useStudentSemesterPresenceStore.setState({
      studentSemesterPresence: clone(projectState.studentSemesterPresence)
    });
    useExternalCourseInputStore.setState({
      externalCourseInputs: clone(projectState.externalCourseInputs)
    });
    useValidationRuleSettingStore.setState({
      validationRuleSettings: clone(projectState.validationRuleSettings)
    });
    usePrerequisiteRuleStore.setState({
      prerequisiteRules: clone(projectState.prerequisiteRules)
    });
    useDetailedConstraintRuleStore.setState({
      detailedConstraintRules: clone(projectState.detailedConstraintRules)
    });
    useNormalizedCourseSelectionStore.setState({
      courseSelectionRecords: clone(projectState.courseSelectionRecords ?? []),
      buildIssues: []
    });
    useValidationResultStore.setState({
      validationErrors: clone(projectState.validationErrors),
      lastValidationResult: projectState.lastValidationResult
        ? clone(projectState.lastValidationResult)
        : undefined
    });
    seedCreditDifferenceCriteriaFromCurrentInputs();
  });
}

export function importProjectSection(
  section: ProjectImportSection,
  sourceState: ProjectState
): ProjectSectionImportResult {
  const result: ProjectSectionImportResult = {
    skippedExternalCourseInputCount: 0
  };

  runProjectHydration(() => {
    if (section === "operatingSubjects") {
      useOperatingSubjectStore.setState({
        operatingSubjects: clone(sourceState.operatingSubjects)
      });
      usePrerequisiteRuleStore
        .getState()
        .generateCandidatesFromOperatingSubjects(sourceState.operatingSubjects);
      useImportStatusStore.setState((current) => ({
        importStatuses: replaceImportStatusesForSource(
          current.importStatuses,
          sourceState.importStatuses,
          "operatingSubjects"
        )
      }));
      seedCreditDifferenceCriteriaFromCurrentInputs();
    }

    if (section === "validationRules") {
      useValidationRuleSettingStore.setState({
        validationRuleSettings: clone(sourceState.validationRuleSettings)
      });
      usePrerequisiteRuleStore.setState({
        prerequisiteRules: clone(sourceState.prerequisiteRules)
      });
      useDetailedConstraintRuleStore.setState({
        detailedConstraintRules: clone(sourceState.detailedConstraintRules)
      });
      seedCreditDifferenceCriteriaFromCurrentInputs();
    }

    if (section === "courseSelections") {
      useCourseSelectionRawStore.setState({
        courseSelectionRows: clone(sourceState.courseSelectionRows)
      });
      useStudentStore.setState({ students: clone(sourceState.students) });
      useStudentSemesterPresenceStore.setState({
        studentSemesterPresence: clone(sourceState.studentSemesterPresence)
      });
      useImportStatusStore.setState((current) => ({
        importStatuses: replaceImportStatusesForSource(
          current.importStatuses,
          sourceState.importStatuses,
          "courseSelections"
        )
      }));
      seedCreditDifferenceCriteriaFromCurrentInputs();
    }

    if (section === "externalCourses") {
      const currentStudentIds = new Set(
        useStudentStore.getState().students.map((student) => student.studentId)
      );
      const nextInputs = sourceState.externalCourseInputs.filter((input) =>
        currentStudentIds.has(input.studentId)
      );

      result.skippedExternalCourseInputCount =
        sourceState.externalCourseInputs.length - nextInputs.length;

      useExternalCourseInputStore.setState({
        externalCourseInputs: clone(nextInputs)
      });
    }

    clearDerivedValidationState();
  });

  return result;
}

export function importProjectSectionSemester(
  section: SemesterProjectImportSection,
  sourceState: ProjectState,
  target: Semester
): ProjectSectionImportResult {
  const result: ProjectSectionImportResult = {
    skippedExternalCourseInputCount: 0
  };

  runProjectHydration(() => {
    if (section === "operatingSubjects") {
      const sourceSemesterSubjects = sourceState.operatingSubjects.filter((subject) =>
        isSameSemester(subject.target, target)
      );
      const nextSubjects = replaceOperatingSubjectsForSemesterInList(
        useOperatingSubjectStore.getState().operatingSubjects,
        target,
        clone(sourceSemesterSubjects)
      );

      useOperatingSubjectStore.setState({
        operatingSubjects: nextSubjects
      });
      usePrerequisiteRuleStore
        .getState()
        .generateCandidatesFromOperatingSubjects(nextSubjects);
      useImportStatusStore.setState((current) => ({
        importStatuses: replaceImportStatusForTarget(
          current.importStatuses,
          sourceState.importStatuses,
          "operatingSubjects",
          target
        )
      }));
      seedCreditDifferenceCriteriaFromCurrentInputs();
    }

    if (section === "courseSelections") {
      const sourceSemesterRows = sourceState.courseSelectionRows.filter((row) =>
        isSameSemester(row.target, target)
      );
      const nextRows = replaceCourseSelectionRowsForSemesterInList(
        useCourseSelectionRawStore.getState().courseSelectionRows,
        target,
        clone(sourceSemesterRows)
      );
      const nextStatuses = replaceImportStatusForTarget(
        useImportStatusStore.getState().importStatuses,
        sourceState.importStatuses,
        "courseSelections",
        target
      );
      const { presence, students } = rebuildPresenceFromCourseSelections(
        nextRows,
        nextStatuses
      );

      useCourseSelectionRawStore.setState({
        courseSelectionRows: nextRows
      });
      useStudentStore.setState({ students });
      useStudentSemesterPresenceStore.setState({
        studentSemesterPresence: presence
      });
      useImportStatusStore.setState({
        importStatuses: nextStatuses
      });
      seedCreditDifferenceCriteriaFromCurrentInputs();
    }

    clearDerivedValidationState();
  });

  return result;
}

export async function saveCurrentProjectSnapshot() {
  const projectMeta = useProjectMetaStore.getState();

  if (!projectMeta.activeProjectId) {
    return undefined;
  }

  const savedAt = new Date().toISOString();
  const state = collectProjectState(savedAt);
  const record = createStoredProjectRecord({
    appVersion,
    projectName: state.projectName,
    id: projectMeta.activeProjectId,
    savedAt,
    state
  });

  await saveProjectRecord(record);
  useProjectMetaStore.getState().markSaved(savedAt);

  return record;
}

export async function initializeProjectWorkspace() {
  const summaries = await listProjectRecords();
  let activeProjectId = getActiveProjectId();

  if (summaries.length === 0) {
    const state = createEmptyProjectState();
    const record = await createProjectRecord({
      appVersion,
      projectName: state.projectName,
      state
    });

    setActiveProjectId(record.id);
    applyProjectState(record.data.data, {
      activeProjectId: record.id,
      savedAt: record.savedAt
    });

    return record;
  }

  const activeSummary = summaries.find((summary) => summary.id === activeProjectId);
  activeProjectId =
    activeSummary?.id ??
    summaries.find((summary) => summary.id === legacyDefaultProjectId)?.id ??
    summaries[0]?.id;

  if (!activeProjectId) {
    throw new Error("프로젝트를 불러오지 못했습니다.");
  }

  const record = await loadProjectRecord(activeProjectId);

  if (!record) {
    throw new Error("선택한 프로젝트를 찾지 못했습니다.");
  }

  setActiveProjectId(record.id);
  applyProjectState(record.data.data, {
    activeProjectId: record.id,
    savedAt: record.savedAt
  });

  return record;
}
