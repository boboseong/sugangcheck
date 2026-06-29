import { normalizeSubjectName } from "../normalizers/normalizeSubjectName";
import type { PrerequisiteRule } from "../types/validation";

type RawPrerequisiteRule = {
  beforeSubjectName: string;
  afterSubjectName: string;
  allowConcurrent: boolean;
};

const rawDefaultPrerequisiteRules: RawPrerequisiteRule[] = [
  { beforeSubjectName: "대수", afterSubjectName: "미적분Ⅰ", allowConcurrent: true },
  { beforeSubjectName: "대수", afterSubjectName: "미적분Ⅱ", allowConcurrent: false },
  {
    beforeSubjectName: "미적분Ⅰ",
    afterSubjectName: "미적분Ⅱ",
    allowConcurrent: true
  },
  { beforeSubjectName: "대수", afterSubjectName: "경제 수학", allowConcurrent: false },
  { beforeSubjectName: "기하", afterSubjectName: "고급 기하", allowConcurrent: false },
  { beforeSubjectName: "대수", afterSubjectName: "고급 대수", allowConcurrent: false },
  {
    beforeSubjectName: "미적분Ⅱ",
    afterSubjectName: "고급 미적분",
    allowConcurrent: false
  },
  {
    beforeSubjectName: "물리학",
    afterSubjectName: "역학과 에너지",
    allowConcurrent: true
  },
  {
    beforeSubjectName: "물리학",
    afterSubjectName: "전자기와 양자",
    allowConcurrent: false
  },
  {
    beforeSubjectName: "화학",
    afterSubjectName: "물질과 에너지",
    allowConcurrent: true
  },
  {
    beforeSubjectName: "화학",
    afterSubjectName: "화학 반응의 세계",
    allowConcurrent: false
  },
  {
    beforeSubjectName: "생명과학",
    afterSubjectName: "세포와 물질대사",
    allowConcurrent: true
  },
  {
    beforeSubjectName: "생명과학",
    afterSubjectName: "생물의 유전",
    allowConcurrent: false
  },
  {
    beforeSubjectName: "지구과학",
    afterSubjectName: "지구시스템과학",
    allowConcurrent: true
  },
  {
    beforeSubjectName: "지구과학",
    afterSubjectName: "행성우주과학",
    allowConcurrent: false
  }
];

export const defaultPrerequisiteRules: PrerequisiteRule[] =
  rawDefaultPrerequisiteRules.map((rule, index) => ({
    id: `default-prerequisite-${index + 1}`,
    beforeSubjectName: rule.beforeSubjectName,
    beforeNormalizedSubjectName: normalizeSubjectName(rule.beforeSubjectName),
    afterSubjectName: rule.afterSubjectName,
    afterNormalizedSubjectName: normalizeSubjectName(rule.afterSubjectName),
    status: "active",
    allowConcurrent: rule.allowConcurrent,
    includeExternalInputsOverride: true,
    source: "default"
  }));
