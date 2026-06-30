import type { ValidationRuleId } from "../types/validation";

export const validationRuleLabels: Record<ValidationRuleId, string> = {
  minimumCredits: "최소 이수학점 미달",
  creditDifference: "학기별 이수학점/과목 수",
  requiredSubjectGroupCredits: "교과군별 필수 이수학점",
  koreanHistoryCredits: "한국사 필수 이수학점",
  koreanMathEnglishLimit: "국어·수학·영어 합산 제한",
  duplicateSubjects: "동일 과목 중복 신청",
  prerequisites: "과목 위계 위반",
  detailedConstraints: "세부 제약 위반",
  courseExistsInOperatingSubjects: "운영과목 미존재",
  subjectMetadataMismatch: "과목정보 불일치"
};

export function validationRuleLabel(ruleId: ValidationRuleId): string {
  return validationRuleLabels[ruleId];
}
