import { create } from "zustand";
import type { ValidationError } from "../types/validation";
import type { ValidationEngineResult } from "../validation/types";

type ValidationResultStore = {
  validationErrors: ValidationError[];
  lastValidationResult?: ValidationEngineResult;
  resultRevision?: number;
  setValidationResult: (result: ValidationEngineResult, revision: number) => void;
  clearValidationResult: () => void;
};

export const useValidationResultStore = create<ValidationResultStore>((set) => ({
  validationErrors: [],
  setValidationResult: (result, resultRevision) =>
    set({
      validationErrors: result.errors,
      lastValidationResult: result,
      resultRevision
    }),
  clearValidationResult: () =>
    set({
      validationErrors: [],
      lastValidationResult: undefined,
      resultRevision: undefined
    })
}));
