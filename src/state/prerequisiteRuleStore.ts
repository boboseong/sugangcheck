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
import {
  areValidationInputValuesEqual,
  markValidationInputChanged
} from "./validationRevisionStore";

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

export const usePrerequisiteRuleStore = create<PrerequisiteRuleStore>((set, get) => ({
  prerequisiteRules: cloneDefaultRules(),
  setPrerequisiteRules: (prerequisiteRules) => {
    if (areValidationInputValuesEqual(get().prerequisiteRules, prerequisiteRules)) {
      return;
    }

    set({ prerequisiteRules });
    markValidationInputChanged();
  },
  generateCandidatesFromOperatingSubjects: (subjects) => {
    const currentRules = get().prerequisiteRules;
    const prerequisiteRules = mergePrerequisiteRules(
      currentRules,
      generatePrerequisiteCandidates(subjects)
    );

    if (areValidationInputValuesEqual(currentRules, prerequisiteRules)) {
      return;
    }

    set({ prerequisiteRules });
    markValidationInputChanged();
  },
  updatePrerequisiteRule: (rule) => {
    const currentRules = get().prerequisiteRules;
    const currentRule = currentRules.find((item) => item.id === rule.id);

    if (!currentRule) {
      return;
    }

    const normalizedRule = {
      ...rule,
      beforeNormalizedSubjectName: normalizeSubjectName(rule.beforeSubjectName),
      afterNormalizedSubjectName: normalizeSubjectName(rule.afterSubjectName),
      updatedAt: currentRule.updatedAt
    };

    if (areValidationInputValuesEqual(currentRule, normalizedRule)) {
      return;
    }

    set({
      prerequisiteRules: updatePrerequisiteRuleInList(currentRules, {
        ...normalizedRule,
        updatedAt: new Date().toISOString()
      })
    });
    markValidationInputChanged();
  },
  updatePrerequisiteRuleStatus: (ruleId, status) => {
    const currentRule = get().prerequisiteRules.find((rule) => rule.id === ruleId);

    if (!currentRule || currentRule.status === status) {
      return;
    }

    set((state) => ({
      prerequisiteRules: state.prerequisiteRules.map((rule) =>
        rule.id === ruleId
          ? { ...rule, status, updatedAt: new Date().toISOString() }
          : rule
      )
    }));
    markValidationInputChanged();
  },
  removePrerequisiteRule: (ruleId) => {
    const currentRules = get().prerequisiteRules;
    const prerequisiteRules = currentRules.filter((rule) => rule.id !== ruleId);

    if (prerequisiteRules.length === currentRules.length) {
      return;
    }

    set({ prerequisiteRules });
    markValidationInputChanged();
  },
  restoreDefaultPrerequisiteRules: () => {
    const prerequisiteRules = cloneDefaultRules();

    if (areValidationInputValuesEqual(get().prerequisiteRules, prerequisiteRules)) {
      return;
    }

    set({ prerequisiteRules });
    markValidationInputChanged();
  }
}));
