import { create } from "zustand";
import { defaultValidationRuleSettings } from "../data/defaultValidationRules";
import type {
  ValidationRuleId,
  ValidationRuleSetting
} from "../types/validation";

function cloneDefaultSettings(): ValidationRuleSetting[] {
  return structuredClone(defaultValidationRuleSettings);
}

export function updateValidationRuleSettingInList(
  settings: readonly ValidationRuleSetting[],
  ruleId: ValidationRuleId,
  patch: Partial<Omit<ValidationRuleSetting, "id">>
): ValidationRuleSetting[] {
  return settings.map((setting) =>
    setting.id === ruleId
      ? {
          ...setting,
          ...patch,
          updatedAt: new Date().toISOString()
        }
      : setting
  );
}

export function updateValidationRuleCriteriaInList(
  settings: readonly ValidationRuleSetting[],
  ruleId: ValidationRuleId,
  criteriaPatch: Record<string, unknown>
): ValidationRuleSetting[] {
  return settings.map((setting) =>
    setting.id === ruleId
      ? {
          ...setting,
          criteria: {
            ...setting.criteria,
            ...criteriaPatch
          },
          updatedAt: new Date().toISOString()
        }
      : setting
  );
}

type ValidationRuleSettingStore = {
  validationRuleSettings: ValidationRuleSetting[];
  setValidationRuleSettings: (settings: ValidationRuleSetting[]) => void;
  updateRuleEnabled: (ruleId: ValidationRuleId, enabled: boolean) => void;
  updateRuleIncludeExternalInputs: (
    ruleId: ValidationRuleId,
    includeExternalInputs: boolean
  ) => void;
  updateRuleCriteria: (
    ruleId: ValidationRuleId,
    criteriaPatch: Record<string, unknown>
  ) => void;
  restoreDefaultValidationRuleSettings: () => void;
};

export const useValidationRuleSettingStore =
  create<ValidationRuleSettingStore>((set) => ({
    validationRuleSettings: cloneDefaultSettings(),
    setValidationRuleSettings: (validationRuleSettings) =>
      set({ validationRuleSettings }),
    updateRuleEnabled: (ruleId, enabled) =>
      set((state) => ({
        validationRuleSettings: updateValidationRuleSettingInList(
          state.validationRuleSettings,
          ruleId,
          { enabled }
        )
      })),
    updateRuleIncludeExternalInputs: (ruleId, includeExternalInputs) =>
      set((state) => ({
        validationRuleSettings: updateValidationRuleSettingInList(
          state.validationRuleSettings,
          ruleId,
          { includeExternalInputs }
        )
      })),
    updateRuleCriteria: (ruleId, criteriaPatch) =>
      set((state) => ({
        validationRuleSettings: updateValidationRuleCriteriaInList(
          state.validationRuleSettings,
          ruleId,
          criteriaPatch
        )
      })),
    restoreDefaultValidationRuleSettings: () =>
      set({ validationRuleSettings: cloneDefaultSettings() })
  }));
