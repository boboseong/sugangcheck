import { create } from "zustand";
import type { ParsedCourseSelectionRow } from "../types/courseSelection";
import type { Semester, SemesterKey } from "../types/semester";
import { semesterToKey } from "../utils/semester";
import {
  areValidationInputValuesEqual,
  markValidationInputChanged
} from "./validationRevisionStore";

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
  semesterCounts: Partial<Record<SemesterKey, number>>;
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
        semesterCounts: {}
      };
    const semesterKey = semesterToKey(row.target);

    summary.semesterCounts[semesterKey] =
      (summary.semesterCounts[semesterKey] ?? 0) + 1;

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
    setCourseSelectionRows: (courseSelectionRows) => {
      if (
        areValidationInputValuesEqual(
          get().courseSelectionRows,
          courseSelectionRows
        )
      ) {
        return;
      }

      set({ courseSelectionRows });
      markValidationInputChanged();
    },
    replaceCourseSelectionRowsForSemester: (target, rows) => {
      const courseSelectionRows = replaceCourseSelectionRowsForSemesterInList(
        get().courseSelectionRows,
        target,
        rows
      );
      if (
        !areValidationInputValuesEqual(get().courseSelectionRows, courseSelectionRows)
      ) {
        set({ courseSelectionRows });
        markValidationInputChanged();
      }
      return courseSelectionRows;
    },
    clearCourseSelectionRowsForSemester: (target) => {
      const courseSelectionRows = get().courseSelectionRows.filter(
        (row) => !sameSemester(row, target)
      );
      if (courseSelectionRows.length !== get().courseSelectionRows.length) {
        set({ courseSelectionRows });
        markValidationInputChanged();
      }
      return courseSelectionRows;
    },
    resetCourseSelectionRows: () => {
      if (get().courseSelectionRows.length === 0) {
        return;
      }

      set({ courseSelectionRows: [] });
      markValidationInputChanged();
    }
  })
);
