import { create } from "zustand";
import type { ParsedCourseSelectionRow } from "../types/courseSelection";
import type { Semester, SemesterMap, SemesterKey } from "../types/semester";
import { semesterKeys } from "../types/semester";
import type {
  Student,
  StudentSemesterPresence,
  SemesterPresenceValue
} from "../types/student";
import { semesterToKey } from "../utils/semester";

export function createUnknownSemesterMap(): SemesterMap<SemesterPresenceValue> {
  return Object.fromEntries(
    semesterKeys.map((key) => [key, "unknown"])
  ) as SemesterMap<SemesterPresenceValue>;
}

export function createStudentSemesterPresence(
  student: Student
): StudentSemesterPresence {
  return {
    studentId: student.studentId,
    studentNo: student.studentNo,
    name: student.name,
    semesters: createUnknownSemesterMap()
  };
}

export function updatePresenceForImportedSemester(
  currentPresence: readonly StudentSemesterPresence[],
  students: readonly Student[],
  rows: readonly ParsedCourseSelectionRow[],
  target: Semester
): StudentSemesterPresence[] {
  const targetKey = semesterToKey(target) as SemesterKey;
  const presentStudentIds = new Set(
    rows
      .filter(
        (row) =>
          row.target.grade === target.grade &&
          row.target.semester === target.semester
      )
      .map((row) => row.studentId)
  );
  const currentByStudentId = new Map(
    currentPresence.map((presence) => [presence.studentId, presence])
  );

  return students.map((student) => {
    const existing = currentByStudentId.get(student.studentId);
    const semesters = {
      ...(existing?.semesters ?? createUnknownSemesterMap()),
      [targetKey]: presentStudentIds.has(student.studentId) ? "present" : "absent"
    } satisfies SemesterMap<SemesterPresenceValue>;

    return {
      studentId: student.studentId,
      studentNo: student.studentNo,
      name: student.name,
      semesters
    };
  });
}

export function setPresenceForSemesterUnknown(
  currentPresence: readonly StudentSemesterPresence[],
  students: readonly Student[],
  target: Semester
): StudentSemesterPresence[] {
  const targetKey = semesterToKey(target) as SemesterKey;
  const currentByStudentId = new Map(
    currentPresence.map((presence) => [presence.studentId, presence])
  );

  return students.map((student) => {
    const existing = currentByStudentId.get(student.studentId);
    const semesters = {
      ...(existing?.semesters ?? createUnknownSemesterMap()),
      [targetKey]: "unknown"
    } satisfies SemesterMap<SemesterPresenceValue>;

    return {
      studentId: student.studentId,
      studentNo: student.studentNo,
      name: student.name,
      semesters
    };
  });
}

type StudentSemesterPresenceStore = {
  studentSemesterPresence: StudentSemesterPresence[];
  setStudentSemesterPresence: (presence: StudentSemesterPresence[]) => void;
  updateFromCourseSelectionRows: (
    students: Student[],
    rows: ParsedCourseSelectionRow[],
    target: Semester
  ) => void;
  markSemesterUnknown: (students: Student[], target: Semester) => void;
  resetStudentSemesterPresence: () => void;
};

export const useStudentSemesterPresenceStore =
  create<StudentSemesterPresenceStore>((set) => ({
    studentSemesterPresence: [],
    setStudentSemesterPresence: (studentSemesterPresence) =>
      set({ studentSemesterPresence }),
    updateFromCourseSelectionRows: (students, rows, target) =>
      set((state) => ({
        studentSemesterPresence: updatePresenceForImportedSemester(
          state.studentSemesterPresence,
          students,
          rows,
          target
        )
      })),
    markSemesterUnknown: (students, target) =>
      set((state) => ({
        studentSemesterPresence: setPresenceForSemesterUnknown(
          state.studentSemesterPresence,
          students,
          target
        )
      })),
    resetStudentSemesterPresence: () => set({ studentSemesterPresence: [] })
  }));
