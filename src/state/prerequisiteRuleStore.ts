import { create } from "zustand";
import { defaultPrerequisiteRules } from "../data/defaultPrerequisiteRules";
import { normalizeSubjectName } from "../normalizers/normalizeSubjectName";
import type { OperatingSubject } from "../types/subject";
import type {
  PrerequisiteRule,
  PrerequisiteRuleStatus
} from "../types/validation";
import {
  generatePrerequisiteCandidates,
  mergePrerequisiteRules
} from "../validation/generatePrerequisiteCandidates";

function cloneDefaultRules(): PrerequisiteRule[] {
  return structuredClone(defaultPrerequisiteRules);
}

export function updatePrerequisiteRuleInList(
  rules: readonly PrerequisiteRule[],
  nextRule: PrerequisiteRule
): PrerequisiteRule[] {
  return rules.map((rule) => (rule.id === nextRule.id ? nextRule : rule));
}

type PrerequisiteRuleStore = {
  prerequisiteRules: PrerequisiteRule[];
  setPrerequisiteRules: (rules: PrerequisiteRule[]) => void;
  generateCandidatesFromOperatingSubjects: (
    subjects: readonly OperatingSubject[]
  ) => void;
  updatePrerequisiteRule: (rule: PrerequisiteRule) => void;
  updatePrerequisiteRuleStatus: (
    ruleId: string,
    status: PrerequisiteRuleStatus
  ) => void;
  removePrerequisiteRule: (ruleId: string) => void;
  restoreDefaultPrerequisiteRules: () => void;
};

export const usePrerequisiteRuleStore = create<PrerequisiteRuleStore>((set) => ({
  prerequisiteRules: cloneDefaultRules(),
  setPrerequisiteRules: (prerequisiteRules) => set({ prerequisiteRules }),
  generateCandidatesFromOperatingSubjects: (subjects) =>
    set((state) => ({
      prerequisiteRules: mergePrerequisiteRules(
        state.prerequisiteRules,
        generatePrerequisiteCandidates(subjects)
      )
    })),
  updatePrerequisiteRule: (rule) =>
    set((state) => ({
      prerequisiteRules: updatePrerequisiteRuleInList(
        state.prerequisiteRules,
        {
          ...rule,
          beforeNormalizedSubjectName: normalizeSubjectName(rule.beforeSubjectName),
          afterNormalizedSubjectName: normalizeSubjectName(rule.afterSubjectName),
          updatedAt: new Date().toISOString()
        }
      )
    })),
  updatePrerequisiteRuleStatus: (ruleId, status) =>
    set((state) => ({
      prerequisiteRules: state.prerequisiteRules.map((rule) =>
        rule.id === ruleId
          ? { ...rule, status, updatedAt: new Date().toISOString() }
          : rule
      )
    })),
  removePrerequisiteRule: (ruleId) =>
    set((state) => ({
      prerequisiteRules: state.prerequisiteRules.filter((rule) => rule.id !== ruleId)
    })),
  restoreDefaultPrerequisiteRules: () =>
    set({ prerequisiteRules: cloneDefaultRules() })
}));
