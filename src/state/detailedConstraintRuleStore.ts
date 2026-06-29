import { create } from "zustand";
import { defaultDetailedConstraintRules } from "../data/defaultDetailedConstraintRules";
import type { DetailedConstraintRule } from "../types/validation";
import { normalizeDetailedConstraintRule } from "../validation/detailedConstraintRules";

function cloneDefaultRules(): DetailedConstraintRule[] {
  return structuredClone(defaultDetailedConstraintRules);
}

export function updateDetailedConstraintRuleInList(
  rules: readonly DetailedConstraintRule[],
  nextRule: DetailedConstraintRule
): DetailedConstraintRule[] {
  return rules.map((rule) =>
    rule.id === nextRule.id ? normalizeDetailedConstraintRule(nextRule) : rule
  );
}

type DetailedConstraintRuleStore = {
  detailedConstraintRules: DetailedConstraintRule[];
  setDetailedConstraintRules: (rules: DetailedConstraintRule[]) => void;
  updateDetailedConstraintRule: (rule: DetailedConstraintRule) => void;
  removeDetailedConstraintRule: (ruleId: string) => void;
  restoreDefaultDetailedConstraintRules: () => void;
};

export const useDetailedConstraintRuleStore =
  create<DetailedConstraintRuleStore>((set) => ({
    detailedConstraintRules: cloneDefaultRules(),
    setDetailedConstraintRules: (detailedConstraintRules) =>
      set({
        detailedConstraintRules: detailedConstraintRules.map(
          normalizeDetailedConstraintRule
        )
      }),
    updateDetailedConstraintRule: (rule) =>
      set((state) => ({
        detailedConstraintRules: updateDetailedConstraintRuleInList(
          state.detailedConstraintRules,
          {
            ...rule,
            updatedAt: new Date().toISOString()
          }
        )
      })),
    removeDetailedConstraintRule: (ruleId) =>
      set((state) => ({
        detailedConstraintRules: state.detailedConstraintRules.filter(
          (rule) => rule.id !== ruleId
        )
      })),
    restoreDefaultDetailedConstraintRules: () =>
      set({ detailedConstraintRules: cloneDefaultRules() })
  }));
