import type { ValidationRuleSetting } from "../types/validation";
import {
  defaultMinimumTotalCredits,
  koreanHistoryCreditCriteria,
  koreanMathEnglishLimitCriteria,
  requiredSubjectGroupCredits
} from "./defaultCreditCriteria";

export const defaultValidationRuleSettings: ValidationRuleSetting[] = [
  {
    id: "minimumCredits",
    enabled: true,
    includeExternalInputs: true,
    criteria: { minimumTotalCredits: defaultMinimumTotalCredits }
  },
  {
    id: "creditDifference",
    enabled: true,
    includeExternalInputs: false,
    criteria: { compareWithinSameGradeSemester: true }
  },
  {
    id: "requiredSubjectGroupCredits",
    enabled: true,
    includeExternalInputs: true,
    criteria: { requiredSubjectGroupCredits }
  },
  {
    id: "koreanHistoryCredits",
    enabled: true,
    includeExternalInputs: true,
    criteria: koreanHistoryCreditCriteria
  },
  {
    id: "koreanMathEnglishLimit",
    enabled: true,
    includeExternalInputs: true,
    criteria: koreanMathEnglishLimitCriteria
  },
  {
    id: "duplicateSubjects",
    enabled: true,
    includeExternalInputs: true,
    criteria: { compareBy: "normalizedSubjectName" }
  },
  {
    id: "prerequisites",
    enabled: true,
    includeExternalInputs: true,
    criteria: { useActiveRulesOnly: true }
  },
  {
    id: "detailedConstraints",
    enabled: true,
    includeExternalInputs: true,
    criteria: { useActiveRulesOnly: true }
  },
  {
    id: "courseExistsInOperatingSubjects",
    enabled: true,
    includeExternalInputs: false,
    criteria: { compareBy: "normalizedSubjectName" }
  },
  {
    id: "subjectMetadataMismatch",
    enabled: true,
    includeExternalInputs: false,
    criteria: {
      compareFields: ["subjectGroup", "selectionType", "groupType", "credits"]
    }
  }
];
