import { create } from "zustand";
import { defaultDetailedConstraintRules } from "../data/defaultDetailedConstraintRules";
import type { DetailedConstraintRule } from "../types/validation";
import { normalizeDetailedConstraintRule } from "../validation/detailedConstraintRules";
import {
  areValidationInputValuesEqual,
  markValidationInputChanged
} from "./validationRevisionStore";

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
  create<DetailedConstraintRuleStore>((set, get) => ({
    detailedConstraintRules: cloneDefaultRules(),
    setDetailedConstraintRules: (rules) => {
      const detailedConstraintRules = rules.map(normalizeDetailedConstraintRule);

      if (
        areValidationInputValuesEqual(
          get().detailedConstraintRules,
          detailedConstraintRules
        )
      ) {
        return;
      }

      set({ detailedConstraintRules });
      markValidationInputChanged();
    },
    updateDetailedConstraintRule: (rule) => {
      const currentRules = get().detailedConstraintRules;
      const currentRule = currentRules.find((item) => item.id === rule.id);

      if (!currentRule) {
        return;
      }

      const normalizedRule = normalizeDetailedConstraintRule({
        ...rule,
        updatedAt: currentRule.updatedAt
      });

      if (areValidationInputValuesEqual(currentRule, normalizedRule)) {
        return;
      }

      set({
        detailedConstraintRules: updateDetailedConstraintRuleInList(currentRules, {
          ...normalizedRule,
          updatedAt: new Date().toISOString()
        })
      });
      markValidationInputChanged();
    },
    removeDetailedConstraintRule: (ruleId) => {
      const currentRules = get().detailedConstraintRules;
      const detailedConstraintRules = currentRules.filter(
        (rule) => rule.id !== ruleId
      );

      if (detailedConstraintRules.length === currentRules.length) {
        return;
      }

      set({ detailedConstraintRules });
      markValidationInputChanged();
    },
    restoreDefaultDetailedConstraintRules: () => {
      const detailedConstraintRules = cloneDefaultRules();

      if (
        areValidationInputValuesEqual(
          get().detailedConstraintRules,
          detailedConstraintRules
        )
      ) {
        return;
      }

      set({ detailedConstraintRules });
      markValidationInputChanged();
    }
  }));
