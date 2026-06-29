import { create } from "zustand";
import type { ParsedCourseSelectionRow } from "../types/courseSelection";
import type { Semester } from "../types/semester";

function sameSemester(row: ParsedCourseSelectionRow, target: Semester): boolean {
  return (
    row.target.grade === target.grade &&
    row.target.semester === target.semester
  );
}

export function replaceCourseSelectionRowsForSemesterInList(
  currentRows: readonly ParsedCourseSelectionRow[],
  target: Semester,
  nextRows: readonly ParsedCourseSelectionRow[]
): ParsedCourseSelectionRow[] {
  return [
    ...currentRows.filter((row) => !sameSemester(row, target)),
    ...nextRows
  ];
}

export type StudentCourseSummary = {
  studentId: string;
  studentNo: string;
  studentName: string;
  recordCount: number;
  resolvedCredits: number;
  missingCreditCount: number;
};

export function buildStudentCourseSummaries(
  rows: readonly ParsedCourseSelectionRow[]
): StudentCourseSummary[] {
  const summaries = new Map<string, StudentCourseSummary>();

  for (const row of rows) {
    const summary =
      summaries.get(row.studentId) ??
      {
        studentId: row.studentId,
        studentNo: row.studentNo,
        studentName: row.studentName,
        recordCount: 0,
        resolvedCredits: 0,
        missingCreditCount: 0
      };

    summary.recordCount += 1;

    if (row.credits === undefined) {
      summary.missingCreditCount += 1;
    } else {
      summary.resolvedCredits += row.credits;
    }

    summaries.set(row.studentId, summary);
  }

  return [...summaries.values()].sort((left, right) =>
    left.studentName.localeCompare(right.studentName, "ko")
  );
}

type CourseSelectionRawStore = {
  courseSelectionRows: ParsedCourseSelectionRow[];
  setCourseSelectionRows: (rows: ParsedCourseSelectionRow[]) => void;
  replaceCourseSelectionRowsForSemester: (
    target: Semester,
    rows: ParsedCourseSelectionRow[]
  ) => ParsedCourseSelectionRow[];
  clearCourseSelectionRowsForSemester: (target: Semester) => ParsedCourseSelectionRow[];
  resetCourseSelectionRows: () => void;
};

export const useCourseSelectionRawStore = create<CourseSelectionRawStore>(
  (set, get) => ({
    courseSelectionRows: [],
    setCourseSelectionRows: (courseSelectionRows) => set({ courseSelectionRows }),
    replaceCourseSelectionRowsForSemester: (target, rows) => {
      const courseSelectionRows = replaceCourseSelectionRowsForSemesterInList(
        get().courseSelectionRows,
        target,
        rows
      );
      set({ courseSelectionRows });
      return courseSelectionRows;
    },
    clearCourseSelectionRowsForSemester: (target) => {
      const courseSelectionRows = get().courseSelectionRows.filter(
        (row) => !sameSemester(row, target)
      );
      set({ courseSelectionRows });
      return courseSelectionRows;
    },
    resetCourseSelectionRows: () => set({ courseSelectionRows: [] })
  })
);
