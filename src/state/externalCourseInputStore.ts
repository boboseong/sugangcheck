import { create } from "zustand";
import { normalizeSubjectName } from "../normalizers/normalizeSubjectName";
import type {
  ExternalCourseInput,
  ExternalCourseInputSourceType
} from "../types/courseSelection";
import type { Semester } from "../types/semester";
import type { Student } from "../types/student";
import { toCreditNumber } from "../utils/number";

export type ExternalCourseInputDraft = {
  target: Semester;
  subjectName: string;
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
    subjectGroup: draft.subjectGroup || undefined,
    selectionType: draft.selectionType || undefined,
    groupType: draft.groupType || undefined,
    credits,
    sourceType: draft.sourceType,
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
  (set) => ({
    externalCourseInputs: [],
    setExternalCourseInputs: (externalCourseInputs) =>
      set({ externalCourseInputs }),
    addExternalCourseInput: (input) =>
      set((state) => ({
        externalCourseInputs: [...state.externalCourseInputs, input]
      })),
    addExternalCourseInputs: (inputs) =>
      set((state) => ({
        externalCourseInputs: [...state.externalCourseInputs, ...inputs]
      })),
    removeExternalCourseInput: (inputId) =>
      set((state) => ({
        externalCourseInputs: state.externalCourseInputs.filter(
          (input) => input.id !== inputId
        )
      })),
    resetExternalCourseInputs: () => set({ externalCourseInputs: [] })
  })
);
