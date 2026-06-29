import type { CourseSelectionRecord } from "../types/courseSelection";
import type {
  ValidationError,
  ValidationRuleId,
  ValidationRuleSetting
} from "../types/validation";
import type { ValidationMode } from "./buildCourseSelectionRecords";

export type ValidationRuleContext = {
  mode: ValidationMode;
  records: CourseSelectionRecord[];
  setting: ValidationRuleSetting;
};

export type ValidationRuleFunction = (
  context: ValidationRuleContext
) => ValidationError[];

export type ValidationRuleFunctionMap = Partial<
  Record<ValidationRuleId, ValidationRuleFunction>
>;

export type ValidationEngineInput = {
  mode: ValidationMode;
  records: CourseSelectionRecord[];
  ruleSettings: ValidationRuleSetting[];
};

export type ValidationEngineResult = {
  errors: ValidationError[];
  executedRuleIds: ValidationRuleId[];
  skippedRuleIds: ValidationRuleId[];
  durationMs: number;
};

export type CreateValidationErrorInput = {
  ruleId: ValidationRuleId;
  type?: ValidationRuleId;
  studentId: string;
  studentNo: string;
  studentName: string;
  message: string;
  relatedRecordIds: string[];
  fixHint?: string;
};
