import { subjectMasterItems as defaultSubjectMasterItems } from "../data/subjectMaster";
import type {
  ExternalCourseInput,
  ParsedCourseSelectionRow
} from "../types/courseSelection";
import type { OperatingSubject, SubjectMasterItem, SubjectOverride } from "../types/subject";

export type CreditResolutionSource =
  | "directInput"
  | "subjectOverride"
  | "operatingSubject"
  | "rawCourseSelection"
  | "subjectMaster"
  | "unresolved";

export type ResolvedCredits = {
  credits?: number;
  source: CreditResolutionSource;
  status: "resolved" | "unresolved";
  relatedIds: string[];
};

export type ResolveCreditsInput = {
  source: ParsedCourseSelectionRow | ExternalCourseInput;
  operatingSubjects: readonly OperatingSubject[];
  subjectOverrides: readonly SubjectOverride[];
  subjectMasterItems?: readonly SubjectMasterItem[];
};

function isExternalCourseInput(
  source: ParsedCourseSelectionRow | ExternalCourseInput
): source is ExternalCourseInput {
  return "sourceType" in source;
}

function overrideAppliesToSource(
  override: SubjectOverride,
  source: ParsedCourseSelectionRow | ExternalCourseInput
): boolean {
  const scopeSourceType = override.scope.sourceType ?? "all";

  if (override.normalizedSubjectName !== source.normalizedSubjectName) {
    return false;
  }

  if (
    scopeSourceType !== "all" &&
    scopeSourceType !==
      (isExternalCourseInput(source) ? "externalInput" : "courseSelections")
  ) {
    return false;
  }

  if (override.scope.grade && override.scope.grade !== source.target.grade) {
    return false;
  }

  if (
    override.scope.semester &&
    override.scope.semester !== source.target.semester
  ) {
    return false;
  }

  return true;
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

export function resolveCredits({
  source,
  operatingSubjects,
  subjectOverrides,
  subjectMasterItems = defaultSubjectMasterItems
}: ResolveCreditsInput): ResolvedCredits {
  const directCredits = isExternalCourseInput(source) ? source.credits : undefined;
  const override = subjectOverrides.find((candidate) =>
    overrideAppliesToSource(candidate, source)
  );
  const operatingSubject = findOperatingSubject(source, operatingSubjects);
  const masterItem = subjectMasterItems.find(
    (item) => item.normalizedSubjectName === source.normalizedSubjectName
  );
  const candidates: {
    credits?: number;
    source: CreditResolutionSource;
    relatedId?: string;
  }[] = [
    { credits: directCredits, source: "directInput" },
    { credits: override?.credits, source: "subjectOverride", relatedId: override?.id },
    {
      credits: operatingSubject?.credits,
      source: "operatingSubject",
      relatedId: operatingSubject?.id
    },
    { credits: source.credits, source: "rawCourseSelection" },
    {
      credits: masterItem?.defaultCredits,
      source: "subjectMaster",
      relatedId: masterItem?.id
    }
  ];
  const resolved = candidates.find((candidate) => candidate.credits !== undefined);

  if (!resolved) {
    return { source: "unresolved", status: "unresolved", relatedIds: [] };
  }

  return {
    credits: resolved.credits,
    source: resolved.source,
    status: "resolved",
    relatedIds: resolved.relatedId ? [resolved.relatedId] : []
  };
}
