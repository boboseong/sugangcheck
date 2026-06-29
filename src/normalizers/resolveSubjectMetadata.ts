import { subjectMasterItems as defaultSubjectMasterItems } from "../data/subjectMaster";
import type {
  ExternalCourseInput,
  ParsedCourseSelectionRow
} from "../types/courseSelection";
import type { OperatingSubject, SubjectMasterItem } from "../types/subject";

export type SubjectMetadataSource =
  | "directInput"
  | "operatingSubject"
  | "subjectMaster"
  | "rawCourseSelection"
  | "unresolved";

export type SubjectMetadataResolutionStatus =
  | "resolved"
  | "partial"
  | "unresolved"
  | "conflict";

export type ResolvedSubjectMetadata = {
  subjectName: string;
  normalizedSubjectName: string;
  subjectGroup?: string;
  selectionType?: string;
  groupType?: string;
  source: SubjectMetadataSource;
  status: SubjectMetadataResolutionStatus;
  conflictMessages: string[];
  relatedIds: string[];
};

export type ResolveSubjectMetadataInput = {
  source: ParsedCourseSelectionRow | ExternalCourseInput;
  operatingSubjects: readonly OperatingSubject[];
  subjectMasterItems?: readonly SubjectMasterItem[];
};

function isExternalCourseInput(
  source: ParsedCourseSelectionRow | ExternalCourseInput
): source is ExternalCourseInput {
  return "sourceType" in source;
}

function findOperatingSubject(
  source: ParsedCourseSelectionRow | ExternalCourseInput,
  operatingSubjects: readonly OperatingSubject[]
): OperatingSubject | undefined {
  return operatingSubjects.find(
    (subject) =>
      subject.target.grade === source.target.grade &&
      subject.target.semester === source.target.semester &&
      subject.normalizedSubjectName === source.normalizedSubjectName
  );
}

function findSubjectMasterItem(
  source: ParsedCourseSelectionRow | ExternalCourseInput,
  masterItems: readonly SubjectMasterItem[]
): SubjectMasterItem | undefined {
  return masterItems.find(
    (item) => item.normalizedSubjectName === source.normalizedSubjectName
  );
}

function hasCompleteMetadata(metadata: {
  subjectGroup?: string;
  selectionType?: string;
  groupType?: string;
}): boolean {
  return Boolean(metadata.subjectGroup && metadata.selectionType && metadata.groupType);
}

function conflictMessagesFor(
  operatingSubject: OperatingSubject | undefined,
  masterItem: SubjectMasterItem | undefined
): string[] {
  if (!operatingSubject || !masterItem) {
    return [];
  }

  const conflicts: string[] = [];

  if (operatingSubject.subjectGroup !== masterItem.subjectGroup) {
    conflicts.push("운영과목 교과군과 과목 마스터 교과군이 다릅니다.");
  }

  if (operatingSubject.selectionType !== masterItem.selectionType) {
    conflicts.push("운영과목 선택구분과 과목 마스터 선택구분이 다릅니다.");
  }

  if (
    operatingSubject.groupType &&
    masterItem.groupType &&
    operatingSubject.groupType !== masterItem.groupType
  ) {
    conflicts.push("운영과목 과목구분과 과목 마스터 과목구분이 다릅니다.");
  }

  return conflicts;
}

export function resolveSubjectMetadata({
  source,
  operatingSubjects,
  subjectMasterItems = defaultSubjectMasterItems
}: ResolveSubjectMetadataInput): ResolvedSubjectMetadata {
  const directInput = isExternalCourseInput(source) ? source : undefined;
  const operatingSubject = findOperatingSubject(source, operatingSubjects);
  const masterItem = findSubjectMasterItem(source, subjectMasterItems);
  const conflictMessages = conflictMessagesFor(operatingSubject, masterItem);
  const relatedIds = [operatingSubject?.id, masterItem?.id].filter(Boolean) as string[];
  const resolved = {
    subjectName: source.subjectName,
    normalizedSubjectName: source.normalizedSubjectName,
    subjectGroup:
      directInput?.subjectGroup ??
      operatingSubject?.subjectGroup ??
      masterItem?.subjectGroup,
    selectionType:
      directInput?.selectionType ??
      operatingSubject?.selectionType ??
      masterItem?.selectionType,
    groupType:
      directInput?.groupType ??
      operatingSubject?.groupType ??
      masterItem?.groupType
  };
  const hasDirectMetadata = Boolean(
    directInput?.subjectGroup || directInput?.selectionType || directInput?.groupType
  );
  const sourceName: SubjectMetadataSource = hasDirectMetadata
    ? "directInput"
    : operatingSubject
      ? "operatingSubject"
      : masterItem
        ? "subjectMaster"
        : isExternalCourseInput(source)
          ? "directInput"
          : "rawCourseSelection";
  const complete = hasCompleteMetadata(resolved);
  const status: SubjectMetadataResolutionStatus =
    conflictMessages.length > 0
      ? "conflict"
      : complete
        ? "resolved"
        : resolved.subjectGroup || resolved.selectionType || resolved.groupType
          ? "partial"
          : "unresolved";

  return {
    ...resolved,
    source: status === "unresolved" ? "unresolved" : sourceName,
    status,
    conflictMessages,
    relatedIds
  };
}
