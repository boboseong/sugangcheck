import { create } from "zustand";
import type { OperatingSubject, SubjectOverride } from "../types/subject";

export type SubjectOverridePatch = {
  groupType?: string;
  subjectGroup?: string;
  selectionType?: string;
  credits?: number;
};

function scopeKey(override: SubjectOverride): string {
  const { scope } = override;

  return [
    scope.sourceType ?? "all",
    scope.curriculumYear ?? "",
    scope.grade ?? "",
    scope.semester ?? ""
  ].join("|");
}

function overrideMetadataKey(override: SubjectOverride): string {
  return [
    override.groupType ?? "",
    override.subjectGroup ?? "",
    override.selectionType ?? "",
    override.credits ?? ""
  ].join("|");
}

function overrideAppliesToOperatingSubject(
  override: SubjectOverride,
  subject: OperatingSubject
): boolean {
  const { scope } = override;

  if (override.normalizedSubjectName !== subject.normalizedSubjectName) {
    return false;
  }

  if (
    scope.sourceType &&
    scope.sourceType !== "all" &&
    scope.sourceType !== "operatingSubjects"
  ) {
    return false;
  }

  if (scope.grade && scope.grade !== subject.target.grade) {
    return false;
  }

  if (scope.semester && scope.semester !== subject.target.semester) {
    return false;
  }

  return true;
}

export function createSubjectOverrideFromOperatingSubject(
  subject: OperatingSubject,
  patch: SubjectOverridePatch
): SubjectOverride {
  return {
    id: `override-operating-${subject.normalizedSubjectName}`,
    subjectName: subject.subjectName,
    normalizedSubjectName: subject.normalizedSubjectName,
    groupType: patch.groupType,
    subjectGroup: patch.subjectGroup,
    selectionType: patch.selectionType,
    credits: patch.credits,
    scope: { sourceType: "all" },
    conflictStatus: "none",
    updatedAt: new Date().toISOString(),
    source: "user"
  };
}

export function markSubjectOverrideConflicts(
  overrides: readonly SubjectOverride[]
): SubjectOverride[] {
  const buckets = new Map<string, SubjectOverride[]>();

  for (const override of overrides) {
    const key = `${override.normalizedSubjectName}|${scopeKey(override)}`;
    const bucket = buckets.get(key);

    if (bucket) {
      bucket.push(override);
    } else {
      buckets.set(key, [override]);
    }
  }

  const conflictIds = new Set<string>();

  for (const bucket of buckets.values()) {
    const metadataKeys = new Set(bucket.map(overrideMetadataKey));

    if (metadataKeys.size > 1) {
      bucket.forEach((override) => conflictIds.add(override.id));
    }
  }

  return overrides.map((override) => ({
    ...override,
    conflictStatus: conflictIds.has(override.id) ? "needsReview" : "none"
  }));
}

export function upsertSubjectOverrideInList(
  overrides: readonly SubjectOverride[],
  nextOverride: SubjectOverride
): SubjectOverride[] {
  const replaced = overrides.some((override) => override.id === nextOverride.id);
  const nextOverrides = replaced
    ? overrides.map((override) =>
        override.id === nextOverride.id ? nextOverride : override
      )
    : [...overrides, nextOverride];

  return markSubjectOverrideConflicts(nextOverrides);
}

export function applySubjectOverridesToOperatingSubjects(
  subjects: readonly OperatingSubject[],
  overrides: readonly SubjectOverride[]
): OperatingSubject[] {
  return subjects.map((subject) => {
    const applicableOverrides = overrides.filter((override) =>
      overrideAppliesToOperatingSubject(override, subject)
    );
    const selectedOverride = applicableOverrides.at(-1);

    if (!selectedOverride) {
      return subject;
    }

    return {
      ...subject,
      subjectGroup: selectedOverride.subjectGroup ?? subject.subjectGroup,
      selectionType: selectedOverride.selectionType ?? subject.selectionType,
      groupType: selectedOverride.groupType ?? subject.groupType,
      credits: selectedOverride.credits ?? subject.credits,
      masterMatchStatus: "manual",
      overrideId: selectedOverride.id
    };
  });
}

type SubjectOverrideStore = {
  subjectOverrides: SubjectOverride[];
  setSubjectOverrides: (overrides: SubjectOverride[]) => void;
  upsertSubjectOverride: (override: SubjectOverride) => void;
  removeSubjectOverride: (overrideId: string) => void;
};

export const useSubjectOverrideStore = create<SubjectOverrideStore>((set) => ({
  subjectOverrides: [],
  setSubjectOverrides: (subjectOverrides) => set({ subjectOverrides }),
  upsertSubjectOverride: (override) =>
    set((state) => ({
      subjectOverrides: upsertSubjectOverrideInList(
        state.subjectOverrides,
        override
      )
    })),
  removeSubjectOverride: (overrideId) =>
    set((state) => ({
      subjectOverrides: markSubjectOverrideConflicts(
        state.subjectOverrides.filter((override) => override.id !== overrideId)
      )
    }))
}));
