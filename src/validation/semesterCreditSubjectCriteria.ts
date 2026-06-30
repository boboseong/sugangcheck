import { resolveCredits } from "../normalizers/resolveCredits";
import type { ParsedCourseSelectionRow } from "../types/courseSelection";
import type { Semester, SemesterKey } from "../types/semester";
import { semesterKeys } from "../types/semester";
import type { OperatingSubject } from "../types/subject";
import type { ValidationRuleSetting } from "../types/validation";
import { parseSemesterKey, semesterToKey } from "../utils/semester";

export const semesterCreditSubjectCriteriaKey = "semesterCreditSubjectCriteria";

export type SemesterCreditSubjectCriteria = {
  target: Semester;
  allowedCredits: number[];
  allowedSubjectCounts: number[];
};

type SemesterCreditSubjectMode = {
  credits?: number;
  subjectCount?: number;
};

function numberFromUnknown(value: unknown): number | undefined {
  const parsed = typeof value === "number" ? value : Number(String(value).trim());

  return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined;
}

function uniqueNumbers(values: readonly number[]): number[] {
  return [...new Set(values)].sort((left, right) => left - right);
}

export function normalizeAllowedValues(value: unknown): number[] {
  if (Array.isArray(value)) {
    const values = value
      .map(numberFromUnknown)
      .filter((item): item is number => item !== undefined);

    return values.length > 0 ? uniqueNumbers(values) : [0];
  }

  const valueAsNumber = numberFromUnknown(value);

  return valueAsNumber === undefined ? [0] : [valueAsNumber];
}

export function parseAllowedValuesText(value: string): number[] {
  const values = value
    .split(/[\s,;/]+/)
    .map((part) => part.trim())
    .filter(Boolean)
    .map(numberFromUnknown)
    .filter((item): item is number => item !== undefined);

  return values.length > 0 ? uniqueNumbers(values) : [0];
}

export function formatAllowedValues(values: readonly number[]): string {
  return normalizeAllowedValues(values).join(", ");
}

export function defaultAllowedValues(values: readonly number[]): boolean {
  const normalized = normalizeAllowedValues(values);

  return normalized.length === 1 && normalized[0] === 0;
}

export function activeAllowedValues(values: readonly number[]): number[] {
  return normalizeAllowedValues(values).filter((value) => value > 0);
}

function targetFromCriterion(value: unknown): Semester | undefined {
  if (typeof value !== "object" || value === null || !("target" in value)) {
    return undefined;
  }

  const target = (value as { target?: { grade?: unknown; semester?: unknown } })
    .target;
  const grade = Number(target?.grade);
  const semester = Number(target?.semester);

  if (
    (grade === 1 || grade === 2 || grade === 3) &&
    (semester === 1 || semester === 2)
  ) {
    return { grade, semester };
  }

  return undefined;
}

function criterionForSemester(
  target: Semester,
  value?: unknown
): SemesterCreditSubjectCriteria {
  if (typeof value !== "object" || value === null) {
    return {
      target,
      allowedCredits: [0],
      allowedSubjectCounts: [0]
    };
  }

  const record = value as {
    allowedCredits?: unknown;
    allowedSubjectCounts?: unknown;
  };

  return {
    target,
    allowedCredits: normalizeAllowedValues(record.allowedCredits),
    allowedSubjectCounts: normalizeAllowedValues(record.allowedSubjectCounts)
  };
}

export function createDefaultSemesterCreditSubjectCriteria(): SemesterCreditSubjectCriteria[] {
  return semesterKeys.map((key) => ({
    target: parseSemesterKey(key)!,
    allowedCredits: [0],
    allowedSubjectCounts: [0]
  }));
}

export function getSemesterCreditSubjectCriteria(
  criteria: Record<string, unknown>
): SemesterCreditSubjectCriteria[] {
  const rawCriteria = criteria[semesterCreditSubjectCriteriaKey];
  const rawItems = Array.isArray(rawCriteria) ? rawCriteria : [];
  const rawItemByKey = new Map<SemesterKey, unknown>();

  for (const item of rawItems) {
    const target = targetFromCriterion(item);

    if (target) {
      rawItemByKey.set(semesterToKey(target), item);
    }
  }

  return semesterKeys.map((key) =>
    criterionForSemester(parseSemesterKey(key)!, rawItemByKey.get(key))
  );
}

export function semesterCreditSubjectCriteriaByKey(
  criteria: readonly SemesterCreditSubjectCriteria[]
): Map<SemesterKey, SemesterCreditSubjectCriteria> {
  return new Map(criteria.map((item) => [semesterToKey(item.target), item]));
}

function mode(values: readonly number[]): number | undefined {
  const counts = new Map<number, number>();

  for (const value of values) {
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }

  return [...counts.entries()].sort(
    (left, right) => right[1] - left[1] || left[0] - right[0]
  )[0]?.[0];
}

export function buildSemesterCreditSubjectModes(input: {
  courseSelectionRows: readonly ParsedCourseSelectionRow[];
  operatingSubjects: readonly OperatingSubject[];
}): Map<SemesterKey, SemesterCreditSubjectMode> {
  const summaries = new Map<
    string,
    {
      credits: number;
      hasUnresolvedCredits: boolean;
      subjectNames: Set<string>;
      target: Semester;
    }
  >();

  for (const row of input.courseSelectionRows) {
    const key = `${semesterToKey(row.target)}:${row.studentId}`;
    const summary =
      summaries.get(key) ??
      {
        credits: 0,
        hasUnresolvedCredits: false,
        subjectNames: new Set<string>(),
        target: row.target
      };
    const credits = resolveCredits({
      source: row,
      operatingSubjects: input.operatingSubjects
    }).credits;

    summary.subjectNames.add(row.normalizedSubjectName);

    if (credits === undefined) {
      summary.hasUnresolvedCredits = true;
    } else {
      summary.credits += credits;
    }

    summaries.set(key, summary);
  }

  const creditValues = new Map<SemesterKey, number[]>();
  const subjectCountValues = new Map<SemesterKey, number[]>();

  for (const summary of summaries.values()) {
    const key = semesterToKey(summary.target);
    const subjectCount = summary.subjectNames.size;

    if (subjectCount === 0) {
      continue;
    }

    subjectCountValues.set(key, [
      ...(subjectCountValues.get(key) ?? []),
      subjectCount
    ]);

    if (!summary.hasUnresolvedCredits) {
      creditValues.set(key, [...(creditValues.get(key) ?? []), summary.credits]);
    }
  }

  return new Map(
    semesterKeys.map((key) => [
      key,
      {
        credits: mode(creditValues.get(key) ?? []),
        subjectCount: mode(subjectCountValues.get(key) ?? [])
      }
    ])
  );
}

export function seedSemesterCreditSubjectCriteria(
  criteria: Record<string, unknown>,
  input: {
    courseSelectionRows: readonly ParsedCourseSelectionRow[];
    operatingSubjects: readonly OperatingSubject[];
  }
): { criteria: Record<string, unknown>; changed: boolean } {
  const modes = buildSemesterCreditSubjectModes(input);
  const currentCriteria = getSemesterCreditSubjectCriteria(criteria);
  let changed = false;

  const nextSemesterCriteria = currentCriteria.map((item) => {
    const key = semesterToKey(item.target);
    const modeValues = modes.get(key);
    const allowedCredits =
      defaultAllowedValues(item.allowedCredits) && modeValues?.credits !== undefined
        ? [modeValues.credits]
        : item.allowedCredits;
    const allowedSubjectCounts =
      defaultAllowedValues(item.allowedSubjectCounts) &&
      modeValues?.subjectCount !== undefined
        ? [modeValues.subjectCount]
        : item.allowedSubjectCounts;

    if (
      allowedCredits.join(",") !== item.allowedCredits.join(",") ||
      allowedSubjectCounts.join(",") !== item.allowedSubjectCounts.join(",")
    ) {
      changed = true;
    }

    return {
      ...item,
      allowedCredits,
      allowedSubjectCounts
    };
  });

  return {
    changed,
    criteria: changed
      ? {
          ...criteria,
          [semesterCreditSubjectCriteriaKey]: nextSemesterCriteria
        }
      : criteria
  };
}

export function seedSemesterCreditSubjectCriteriaInSettings(
  settings: readonly ValidationRuleSetting[],
  input: {
    courseSelectionRows: readonly ParsedCourseSelectionRow[];
    operatingSubjects: readonly OperatingSubject[];
  }
): { settings: ValidationRuleSetting[]; changed: boolean } {
  let changed = false;

  const nextSettings = settings.map((setting) => {
    if (setting.id !== "creditDifference") {
      return setting;
    }

    const result = seedSemesterCreditSubjectCriteria(setting.criteria, input);

    if (!result.changed) {
      return setting;
    }

    changed = true;

    return {
      ...setting,
      criteria: result.criteria,
      updatedAt: new Date().toISOString()
    };
  });

  return { settings: nextSettings, changed };
}
