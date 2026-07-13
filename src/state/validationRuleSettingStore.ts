import { create } from "zustand";
import { defaultValidationRuleSettings } from "../data/defaultValidationRules";
import type { ParsedCourseSelectionRow } from "../types/courseSelection";
import type { OperatingSubject } from "../types/subject";
import type {
  ValidationRuleId,
  ValidationRuleSetting
} from "../types/validation";
import { seedSemesterCreditSubjectCriteriaInSettings } from "../validation/semesterCreditSubjectCriteria";
import {
  areValidationInputValuesEqual,
  markValidationInputChanged
} from "./validationRevisionStore";

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
  seedCreditDifferenceCriteriaFromInputs: (input: {
    courseSelectionRows: readonly ParsedCourseSelectionRow[];
    operatingSubjects: readonly OperatingSubject[];
  }) => void;
  restoreDefaultValidationRuleSettings: () => void;
};

export const useValidationRuleSettingStore =
  create<ValidationRuleSettingStore>((set, get) => ({
    validationRuleSettings: cloneDefaultSettings(),
    setValidationRuleSettings: (validationRuleSettings) => {
      if (
        areValidationInputValuesEqual(
          get().validationRuleSettings,
          validationRuleSettings
        )
      ) {
        return;
      }

      set({ validationRuleSettings });
      markValidationInputChanged();
    },
    updateRuleEnabled: (ruleId, enabled) => {
      const currentSetting = get().validationRuleSettings.find(
        (setting) => setting.id === ruleId
      );

      if (!currentSetting || currentSetting.enabled === enabled) {
        return;
      }

      set((state) => ({
        validationRuleSettings: updateValidationRuleSettingInList(
          state.validationRuleSettings,
          ruleId,
          { enabled }
        )
      }));
      markValidationInputChanged();
    },
    updateRuleIncludeExternalInputs: (ruleId, includeExternalInputs) => {
      const currentSetting = get().validationRuleSettings.find(
        (setting) => setting.id === ruleId
      );

      if (
        !currentSetting ||
        currentSetting.includeExternalInputs === includeExternalInputs
      ) {
        return;
      }

      set((state) => ({
        validationRuleSettings: updateValidationRuleSettingInList(
          state.validationRuleSettings,
          ruleId,
          { includeExternalInputs }
        )
      }));
      markValidationInputChanged();
    },
    updateRuleCriteria: (ruleId, criteriaPatch) => {
      const currentSetting = get().validationRuleSettings.find(
        (setting) => setting.id === ruleId
      );
      const hasChangedCriteria =
        currentSetting !== undefined &&
        Object.entries(criteriaPatch).some(
          ([key, value]) =>
            !areValidationInputValuesEqual(currentSetting.criteria[key], value)
        );

      if (!hasChangedCriteria) {
        return;
      }

      set((state) => ({
        validationRuleSettings: updateValidationRuleCriteriaInList(
          state.validationRuleSettings,
          ruleId,
          criteriaPatch
        )
      }));
      markValidationInputChanged();
    },
    seedCreditDifferenceCriteriaFromInputs: (input) => {
      const result = seedSemesterCreditSubjectCriteriaInSettings(
        get().validationRuleSettings,
        input
      );

      if (!result.changed) {
        return;
      }

      set({ validationRuleSettings: result.settings });
      markValidationInputChanged();
    },
    restoreDefaultValidationRuleSettings: () => {
      const validationRuleSettings = cloneDefaultSettings();

      if (
        areValidationInputValuesEqual(
          get().validationRuleSettings,
          validationRuleSettings
        )
      ) {
        return;
      }

      set({ validationRuleSettings });
      markValidationInputChanged();
    }
  }));
