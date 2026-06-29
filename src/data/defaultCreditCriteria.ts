import { normalizeSubjectName } from "../normalizers/normalizeSubjectName";

export type RequiredSubjectGroupCreditCriteria = {
  subjectGroup: string;
  requiredCredits: number;
  equivalentSubjectGroups?: string[];
  note?: string;
};

export type KoreanHistoryCreditCriteria = {
  requiredCredits: number;
  subjectNames: string[];
  normalizedSubjectNames: string[];
};

export type KoreanMathEnglishLimitCriteria = {
  subjectGroups: string[];
  baselineTotalCredits: number;
  baselineLimitCredits: number;
  excessCreditRatioLimit: number;
  note: string;
};

export const minimumTotalCreditOptions = Array.from(
  { length: 27 },
  (_, index) => 174 + index
);

export const defaultMinimumTotalCredits = 174;

export const requiredSubjectGroupCredits: RequiredSubjectGroupCreditCriteria[] = [
  { subjectGroup: "국어", requiredCredits: 8 },
  { subjectGroup: "수학", requiredCredits: 8 },
  { subjectGroup: "영어", requiredCredits: 8 },
  {
    subjectGroup: "사회",
    requiredCredits: 14,
    note: "한국사1, 한국사2 6학점을 포함한다."
  },
  { subjectGroup: "과학", requiredCredits: 10 },
  { subjectGroup: "체육", requiredCredits: 10 },
  { subjectGroup: "예술", requiredCredits: 10 },
  {
    subjectGroup: "기술·가정 등",
    requiredCredits: 16,
    equivalentSubjectGroups: ["기술·가정/정보", "제2외국어/한문", "교양"]
  }
];

export const koreanHistoryCreditCriteria: KoreanHistoryCreditCriteria = {
  requiredCredits: 6,
  subjectNames: ["한국사1", "한국사2"],
  normalizedSubjectNames: ["한국사1", "한국사2"].map(normalizeSubjectName)
};

export const koreanMathEnglishLimitCriteria: KoreanMathEnglishLimitCriteria = {
  subjectGroups: ["국어", "수학", "영어"],
  baselineTotalCredits: 174,
  baselineLimitCredits: 81,
  excessCreditRatioLimit: 0.5,
  note:
    "총 교과 이수학점 174학점까지는 국어·수학·영어 합산 81학점 초과 여부를 보고, 174학점을 초과하면 초과 이수학점의 50%를 넘지 않도록 계산한다."
};

export function resolveKoreanMathEnglishLimitCriteria(
  criteria?: Record<string, unknown>
): KoreanMathEnglishLimitCriteria {
  return {
    subjectGroups: Array.isArray(criteria?.subjectGroups)
      ? (criteria.subjectGroups as string[])
      : koreanMathEnglishLimitCriteria.subjectGroups,
    baselineTotalCredits:
      typeof criteria?.baselineTotalCredits === "number"
        ? criteria.baselineTotalCredits
        : koreanMathEnglishLimitCriteria.baselineTotalCredits,
    baselineLimitCredits:
      typeof criteria?.baselineLimitCredits === "number"
        ? criteria.baselineLimitCredits
        : koreanMathEnglishLimitCriteria.baselineLimitCredits,
    excessCreditRatioLimit:
      typeof criteria?.excessCreditRatioLimit === "number"
        ? criteria.excessCreditRatioLimit
        : koreanMathEnglishLimitCriteria.excessCreditRatioLimit,
    note:
      typeof criteria?.note === "string"
        ? criteria.note
        : koreanMathEnglishLimitCriteria.note
  };
}

export function calculateKoreanMathEnglishLimitCredits(
  totalCredits: number,
  criteria: KoreanMathEnglishLimitCriteria = koreanMathEnglishLimitCriteria
): number {
  return (
    criteria.baselineLimitCredits +
    Math.max(0, totalCredits - criteria.baselineTotalCredits) *
      criteria.excessCreditRatioLimit
  );
}

export const defaultCreditCriteria = {
  minimumTotalCreditOptions,
  defaultMinimumTotalCredits,
  requiredSubjectGroupCredits,
  koreanHistoryCreditCriteria,
  koreanMathEnglishLimitCriteria
} as const;
