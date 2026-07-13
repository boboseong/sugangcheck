import { create } from "zustand";
import type { OperatingSubject } from "../types/subject";
import type { Semester } from "../types/semester";
import {
  areValidationInputValuesEqual,
  markValidationInputChanged
} from "./validationRevisionStore";

function sameSemester(subject: OperatingSubject, target: Semester): boolean {
  return (
    subject.target.grade === target.grade &&
    subject.target.semester === target.semester
  );
}

export function replaceOperatingSubjectsForSemesterInList(
  currentSubjects: readonly OperatingSubject[],
  target: Semester,
  nextSubjects: readonly OperatingSubject[]
): OperatingSubject[] {
  return [
    ...currentSubjects.filter((subject) => !sameSemester(subject, target)),
    ...nextSubjects
  ];
}

export function updateOperatingSubjectInList(
  currentSubjects: readonly OperatingSubject[],
  updatedSubject: OperatingSubject
): OperatingSubject[] {
  return currentSubjects.map((subject) =>
    subject.id === updatedSubject.id ? updatedSubject : subject
  );
}

export function hasCompletedOperatingSubjectReviewForSemester(
  subjects: readonly OperatingSubject[],
  target: Semester
): boolean {
  const semesterSubjects = subjects.filter((subject) =>
    sameSemester(subject, target)
  );

  return (
    semesterSubjects.length > 0 &&
    semesterSubjects.some((subject) => subject.masterMatchStatus === "manual") &&
    semesterSubjects.every((subject) => subject.masterMatchStatus !== "unmatched")
  );
}

type OperatingSubjectStore = {
  operatingSubjects: OperatingSubject[];
  replaceOperatingSubjectsForSemester: (
    target: Semester,
    subjects: OperatingSubject[]
  ) => void;
  updateOperatingSubject: (subject: OperatingSubject) => void;
  clearOperatingSubjectsForSemester: (target: Semester) => void;
};

export const useOperatingSubjectStore = create<OperatingSubjectStore>((set, get) => ({
  operatingSubjects: [],
  replaceOperatingSubjectsForSemester: (target, subjects) => {
    const currentSubjects = get().operatingSubjects;
    const operatingSubjects = replaceOperatingSubjectsForSemesterInList(
      currentSubjects,
      target,
      subjects
    );

    if (areValidationInputValuesEqual(currentSubjects, operatingSubjects)) {
      return;
    }

    set({ operatingSubjects });
    markValidationInputChanged();
  },
  updateOperatingSubject: (subject) => {
    const currentSubjects = get().operatingSubjects;
    const currentSubject = currentSubjects.find((item) => item.id === subject.id);

    if (!currentSubject || areValidationInputValuesEqual(currentSubject, subject)) {
      return;
    }

    set({
      operatingSubjects: updateOperatingSubjectInList(currentSubjects, subject)
    });
    markValidationInputChanged();
  },
  clearOperatingSubjectsForSemester: (target) => {
    const currentSubjects = get().operatingSubjects;
    const operatingSubjects = currentSubjects.filter(
      (subject) => !sameSemester(subject, target)
    );

    if (operatingSubjects.length === currentSubjects.length) {
      return;
    }

    set({ operatingSubjects });
    markValidationInputChanged();
  }
}));
