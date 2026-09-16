import { calculateKoreanMathEnglishLimitCredits } from "../data/defaultCreditCriteria";
import type { CourseSelectionRecord } from "../types/courseSelection";

export const subjectGroupCreditColumns: readonly string[] = [
  "국어",
  "수학",
  "영어",
  "사회",
  "과학",
  "체육",
  "예술",
  "기술·가정/정보",
  "제2외국어/한문",
  "교양"
];

export const koreanMathEnglishSubjectGroups: readonly string[] = ["국어", "수학", "영어"];

export const lifeLiberalSubjectGroups: readonly string[] = [
  "기술·가정/정보",
  "제2외국어/한문",
  "교양"
];

export type SubjectGroupCreditSummary = {
  groupCredits: [string, number][];
  totalCredits: number;
  kmeCredits: number;
  kmeLimitCredits: number;
  lifeLiberalCredits: number;
  subjectCount: number;
};

function sumCredits(
  records: readonly CourseSelectionRecord[],
  subjectGroups?: readonly string[]
): number {
  return records
    .filter((record) => !subjectGroups || subjectGroups.includes(record.subjectGroup))
    .reduce((sum, record) => sum + record.credits, 0);
}

export function summarizeSubjectGroupCredits(
  records: readonly CourseSelectionRecord[]
): SubjectGroupCreditSummary {
  const totals = new Map<string, number>();

  for (const record of records) {
    totals.set(record.subjectGroup, (totals.get(record.subjectGroup) ?? 0) + record.credits);
  }

  const totalCredits = sumCredits(records);

  return {
    groupCredits: subjectGroupCreditColumns.map((subjectGroup) => [
      subjectGroup,
      totals.get(subjectGroup) ?? 0
    ]),
    totalCredits,
    kmeCredits: sumCredits(records, koreanMathEnglishSubjectGroups),
    kmeLimitCredits: calculateKoreanMathEnglishLimitCredits(totalCredits),
    lifeLiberalCredits: sumCredits(records, lifeLiberalSubjectGroups),
    subjectCount: records.length
  };
}

export function formatCreditLimit(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}
