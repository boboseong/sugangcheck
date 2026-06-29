import { create } from "zustand";
import type { ValidationError } from "../types/validation";
import type { ValidationEngineResult } from "../validation/types";

type ValidationResultStore = {
  validationErrors: ValidationError[];
  lastValidationResult?: ValidationEngineResult;
  setValidationResult: (result: ValidationEngineResult) => void;
  clearValidationResult: () => void;
};

export const useValidationResultStore = create<ValidationResultStore>((set) => ({
  validationErrors: [],
  setValidationResult: (result) =>
    set({
      validationErrors: result.errors,
      lastValidationResult: result
    }),
  clearValidationResult: () =>
    set({ validationErrors: [], lastValidationResult: undefined })
}));
