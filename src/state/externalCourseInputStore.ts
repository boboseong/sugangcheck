import { create } from "zustand";
import { normalizeSubjectName } from "../normalizers/normalizeSubjectName";
import {
  defaultExternalCourseChoiceGroup,
  defaultExternalCourseSourceType
} from "../types/courseSelection";
import type {
  ExternalCourseInput,
  ExternalCourseInputSourceType
} from "../types/courseSelection";
import type { Semester } from "../types/semester";
import type { Student } from "../types/student";
import { toCreditNumber } from "../utils/number";
import {
  areValidationInputValuesEqual,
  markValidationInputChanged
} from "./validationRevisionStore";

export type ExternalCourseInputDraft = {
  target: Semester;
  subjectName: string;
  choiceGroup?: string;
  subjectGroup?: string;
  selectionType?: string;
  groupType?: string;
  credits?: string | number;
  sourceType: ExternalCourseInputSourceType;
  sourceName?: string;
  memo?: string;
};

export function validateExternalCourseInputDraft(
  draft: ExternalCourseInputDraft
): string[] {
  const errors: string[] = [];

  if (!draft.subjectName.trim()) {
    errors.push("과목명을 입력하세요.");
  }

  if (toCreditNumber(draft.credits) === undefined) {
    errors.push("학점을 숫자로 입력하세요.");
  }

  return errors;
}

export function createExternalCourseInput(
  student: Student,
  draft: ExternalCourseInputDraft
): ExternalCourseInput {
  const credits = toCreditNumber(draft.credits);

  if (credits === undefined) {
    throw new Error("학점을 숫자로 입력하세요.");
  }

  const normalizedSubjectName = normalizeSubjectName(draft.subjectName);
  const uniqueSuffix = `${Date.now()}-${externalCourseInputIdSequence++}`;

  return {
    id: `external-${student.studentId}-${draft.target.grade}-${draft.target.semester}-${normalizedSubjectName}-${uniqueSuffix}`,
    studentId: student.studentId,
    studentNo: student.studentNo,
    studentName: student.name,
    target: draft.target,
    subjectName: draft.subjectName.trim(),
    normalizedSubjectName,
    choiceGroup: draft.choiceGroup?.trim() || defaultExternalCourseChoiceGroup,
    subjectGroup: draft.subjectGroup || undefined,
    selectionType: draft.selectionType || undefined,
    groupType: draft.groupType || undefined,
    credits,
    sourceType: draft.sourceType.trim() || defaultExternalCourseSourceType,
    sourceName: draft.sourceName?.trim() || undefined,
    memo: draft.memo?.trim() || undefined,
    updatedAt: new Date().toISOString()
  };
}

let externalCourseInputIdSequence = 0;

type ExternalCourseInputStore = {
  externalCourseInputs: ExternalCourseInput[];
  setExternalCourseInputs: (inputs: ExternalCourseInput[]) => void;
  addExternalCourseInput: (input: ExternalCourseInput) => void;
  addExternalCourseInputs: (inputs: ExternalCourseInput[]) => void;
  removeExternalCourseInput: (inputId: string) => void;
  resetExternalCourseInputs: () => void;
};

export const useExternalCourseInputStore = create<ExternalCourseInputStore>(
  (set, get) => ({
    externalCourseInputs: [],
    setExternalCourseInputs: (externalCourseInputs) => {
      if (
        areValidationInputValuesEqual(
          get().externalCourseInputs,
          externalCourseInputs
        )
      ) {
        return;
      }

      set({ externalCourseInputs });
      markValidationInputChanged();
    },
    addExternalCourseInput: (input) => {
      set((state) => ({
        externalCourseInputs: [...state.externalCourseInputs, input]
      }));
      markValidationInputChanged();
    },
    addExternalCourseInputs: (inputs) => {
      if (inputs.length === 0) {
        return;
      }

      set((state) => ({
        externalCourseInputs: [...state.externalCourseInputs, ...inputs]
      }));
      markValidationInputChanged();
    },
    removeExternalCourseInput: (inputId) => {
      const currentInputs = get().externalCourseInputs;
      const externalCourseInputs = currentInputs.filter(
        (input) => input.id !== inputId
      );

      if (externalCourseInputs.length === currentInputs.length) {
        return;
      }

      set({ externalCourseInputs });
      markValidationInputChanged();
    },
    resetExternalCourseInputs: () => {
      if (get().externalCourseInputs.length === 0) {
        return;
      }

      set({ externalCourseInputs: [] });
      markValidationInputChanged();
    }
  })
);
