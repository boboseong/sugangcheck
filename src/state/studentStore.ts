import { create } from "zustand";
import type { ParsedCourseSelectionRow } from "../types/courseSelection";
import type { Student } from "../types/student";

export type PotentialDuplicateStudentName = {
  name: string;
  students: Student[];
};

export function studentFromCourseSelectionRow(
  row: ParsedCourseSelectionRow
): Student {
  return {
    studentId: row.studentId,
    studentNo: row.studentNo,
    name: row.studentName,
    currentClassNo: row.classNo,
    currentNumber: row.number,
    gender: row.gender
  };
}

export function mergeStudentsFromCourseSelectionRows(
  currentStudents: readonly Student[],
  rows: readonly ParsedCourseSelectionRow[]
): Student[] {
  const byId = new Map<string, Student>();

  for (const student of currentStudents) {
    byId.set(student.studentId, student);
  }

  for (const row of rows) {
    const existing = byId.get(row.studentId);

    byId.set(row.studentId, {
      ...existing,
      ...studentFromCourseSelectionRow(row)
    });
  }

  return [...byId.values()].sort((left, right) => {
    const classCompare = (left.currentClassNo ?? "").localeCompare(
      right.currentClassNo ?? "",
      "ko",
      { numeric: true }
    );

    if (classCompare !== 0) {
      return classCompare;
    }

    const numberCompare = (left.currentNumber ?? "").localeCompare(
      right.currentNumber ?? "",
      "ko",
      { numeric: true }
    );

    if (numberCompare !== 0) {
      return numberCompare;
    }

    return left.name.localeCompare(right.name, "ko");
  });
}

export function findPotentialDuplicateStudentNames(
  students: readonly Student[]
): PotentialDuplicateStudentName[] {
  const byName = new Map<string, Student[]>();

  for (const student of students) {
    const bucket = byName.get(student.name);

    if (bucket) {
      bucket.push(student);
    } else {
      byName.set(student.name, [student]);
    }
  }

  return [...byName.entries()]
    .filter(([, namedStudents]) => namedStudents.length > 1)
    .map(([name, namedStudents]) => ({ name, students: namedStudents }));
}

type StudentStore = {
  students: Student[];
  setStudents: (students: Student[]) => void;
  mergeCourseSelectionRows: (rows: ParsedCourseSelectionRow[]) => Student[];
  resetStudents: () => void;
};

export const useStudentStore = create<StudentStore>((set, get) => ({
  students: [],
  setStudents: (students) => set({ students }),
  mergeCourseSelectionRows: (rows) => {
    const students = mergeStudentsFromCourseSelectionRows(get().students, rows);
    set({ students });
    return students;
  },
  resetStudents: () => set({ students: [] })
}));
