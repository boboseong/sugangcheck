import type { ImportSourceType, SemesterImportStatus } from "../types/importStatus";
import type { ProjectState } from "../types/project";
import { createEmptyProjectState } from "./projectWorkspace";

export const projectTransferSections = [
  {
    id: "operatingSubjects",
    label: "운영과목"
  },
  {
    id: "courseSelections",
    label: "수강신청 결과/학생 목록"
  },
  {
    id: "externalCourses",
    label: "전입/외부 이수"
  },
  {
    id: "validationRules",
    label: "점검 규칙"
  }
] as const;

export type ProjectTransferSection = (typeof projectTransferSections)[number]["id"];

export const allProjectTransferSections: ProjectTransferSection[] =
  projectTransferSections.map((section) => section.id);

export type ProjectTransferOptions = {
  sections: readonly ProjectTransferSection[];
  includeValidationResults?: boolean;
  savedAt?: string;
};

function clone<T>(value: T): T {
  return structuredClone(value);
}

function sameImportStatusTarget(
  left: SemesterImportStatus,
  right: SemesterImportStatus
): boolean {
  return (
    left.sourceType === right.sourceType &&
    left.target.grade === right.target.grade &&
    left.target.semester === right.target.semester
  );
}

function sourceTypesForSections(
  sections: ReadonlySet<ProjectTransferSection>
): Set<ImportSourceType> {
  const sourceTypes = new Set<ImportSourceType>();

  if (sections.has("operatingSubjects")) {
    sourceTypes.add("operatingSubjects");
  }

  if (sections.has("courseSelections")) {
    sourceTypes.add("courseSelections");
  }

  return sourceTypes;
}

function importStatusesForSections(
  sourceStatuses: readonly SemesterImportStatus[],
  emptyStatuses: readonly SemesterImportStatus[],
  sections: ReadonlySet<ProjectTransferSection>
): SemesterImportStatus[] {
  const sourceTypes = sourceTypesForSections(sections);

  return emptyStatuses.map((emptyStatus) => {
    if (!sourceTypes.has(emptyStatus.sourceType)) {
      return clone(emptyStatus);
    }

    return clone(
      sourceStatuses.find((sourceStatus) =>
        sameImportStatusTarget(sourceStatus, emptyStatus)
      ) ?? emptyStatus
    );
  });
}

export function hasAllProjectTransferSections(
  sections: readonly ProjectTransferSection[]
): boolean {
  const sectionSet = new Set(sections);

  return allProjectTransferSections.every((section) => sectionSet.has(section));
}

export function shouldIncludeValidationResultsInTransfer(
  options: ProjectTransferOptions
): boolean {
  return (
    options.includeValidationResults === true &&
    hasAllProjectTransferSections(options.sections)
  );
}

export function createProjectTransferState(
  sourceState: ProjectState,
  options: ProjectTransferOptions
): ProjectState {
  const sectionSet = new Set(options.sections);
  const savedAt = options.savedAt ?? sourceState.updatedAt;
  const emptyState = createEmptyProjectState(sourceState.projectName, sourceState.createdAt);
  const transferState: ProjectState = {
    ...emptyState,
    schemaVersion: sourceState.schemaVersion,
    projectName: sourceState.projectName,
    createdAt: sourceState.createdAt,
    updatedAt: savedAt,
    importStatuses: importStatusesForSections(
      sourceState.importStatuses,
      emptyState.importStatuses,
      sectionSet
    ),
    subjectMasterVersion:
      sourceState.subjectMasterVersion ?? emptyState.subjectMasterVersion,
    subjectMasterItems: sourceState.subjectMasterItems
      ? clone(sourceState.subjectMasterItems)
      : emptyState.subjectMasterItems
  };

  if (sectionSet.has("operatingSubjects")) {
    transferState.operatingSubjects = clone(sourceState.operatingSubjects);
  }

  if (sectionSet.has("courseSelections")) {
    transferState.courseSelectionRows = clone(sourceState.courseSelectionRows);
    transferState.students = clone(sourceState.students);
    transferState.studentSemesterPresence = clone(
      sourceState.studentSemesterPresence
    );
  }

  if (sectionSet.has("externalCourses")) {
    transferState.externalCourseInputs = clone(sourceState.externalCourseInputs);
  }

  if (sectionSet.has("validationRules")) {
    transferState.validationRuleSettings = clone(sourceState.validationRuleSettings);
    transferState.prerequisiteRules = clone(sourceState.prerequisiteRules);
    transferState.detailedConstraintRules = clone(
      sourceState.detailedConstraintRules
    );
  }

  if (shouldIncludeValidationResultsInTransfer(options)) {
    transferState.validationErrors = clone(sourceState.validationErrors);
    transferState.courseSelectionRecords = clone(
      sourceState.courseSelectionRecords ?? []
    );
    transferState.dataPreparationStatus = sourceState.dataPreparationStatus
      ? clone(sourceState.dataPreparationStatus)
      : undefined;
    transferState.lastValidationResult = sourceState.lastValidationResult
      ? clone(sourceState.lastValidationResult)
      : undefined;
  }

  return transferState;
}
