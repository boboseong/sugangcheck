import { create } from "zustand";
import type { OperatingSubject, SubjectOverride } from "../types/subject";
import type { Semester } from "../types/semester";
import { applySubjectOverridesToOperatingSubjects } from "./subjectOverrideStore";

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

export function buildIntegratedOperatingSubjects(
  subjects: readonly OperatingSubject[],
  overrides: readonly SubjectOverride[]
): OperatingSubject[] {
  return applySubjectOverridesToOperatingSubjects(subjects, overrides);
}

export function hasCompletedSubjectOverridesForSemester(
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
  applySubjectOverrides: (overrides: SubjectOverride[]) => void;
  clearOperatingSubjectsForSemester: (target: Semester) => void;
};

export const useOperatingSubjectStore = create<OperatingSubjectStore>((set) => ({
  operatingSubjects: [],
  replaceOperatingSubjectsForSemester: (target, subjects) =>
    set((state) => ({
      operatingSubjects: replaceOperatingSubjectsForSemesterInList(
        state.operatingSubjects,
        target,
        subjects
      )
    })),
  updateOperatingSubject: (subject) =>
    set((state) => ({
      operatingSubjects: updateOperatingSubjectInList(
        state.operatingSubjects,
        subject
      )
    })),
  applySubjectOverrides: (overrides) =>
    set((state) => ({
      operatingSubjects: applySubjectOverridesToOperatingSubjects(
        state.operatingSubjects,
        overrides
      )
    })),
  clearOperatingSubjectsForSemester: (target) =>
    set((state) => ({
      operatingSubjects: state.operatingSubjects.filter(
        (subject) => !sameSemester(subject, target)
      )
    }))
}));
