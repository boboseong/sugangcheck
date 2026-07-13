import { create } from "zustand";
import { isProjectHydrating } from "./projectHydration";

type ValidationRevisionStore = {
  inputRevision: number;
  markInputChanged: () => void;
};

export const useValidationRevisionStore = create<ValidationRevisionStore>(
  (set) => ({
    inputRevision: 0,
    markInputChanged: () => {
      if (isProjectHydrating()) {
        return;
      }

      set((state) => ({ inputRevision: state.inputRevision + 1 }));
    }
  })
);

export function markValidationInputChanged() {
  useValidationRevisionStore.getState().markInputChanged();
}

export function areValidationInputValuesEqual(
  left: unknown,
  right: unknown
): boolean {
  if (Object.is(left, right)) {
    return true;
  }

  try {
    return JSON.stringify(left) === JSON.stringify(right);
  } catch {
    return false;
  }
}
