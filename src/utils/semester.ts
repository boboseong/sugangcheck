import type { Semester, SemesterKey } from "../types/semester";
import { semesterKeys } from "../types/semester";

export const semesterOrder = [...semesterKeys];

export function semesterToKey(semester: Semester): SemesterKey {
  return `${semester.grade}-${semester.semester}` as SemesterKey;
}

export function semesterLabel(semester: Semester): string {
  return `${semester.grade}학년 ${semester.semester}학기`;
}

export function parseSemesterKey(value: string): Semester | undefined {
  const match = /^([1-3])-([1-2])$/.exec(value.trim());

  if (!match) {
    return undefined;
  }

  return {
    grade: Number(match[1]) as Semester["grade"],
    semester: Number(match[2]) as Semester["semester"]
  };
}

export function compareSemesters(left: Semester, right: Semester): number {
  return left.grade - right.grade || left.semester - right.semester;
}

export function isSameSemester(left: Semester, right: Semester): boolean {
  return compareSemesters(left, right) === 0;
}

export function isBeforeSemester(left: Semester, right: Semester): boolean {
  return compareSemesters(left, right) < 0;
}

export function isAfterSemester(left: Semester, right: Semester): boolean {
  return compareSemesters(left, right) > 0;
}

export function sortSemesters<T extends Semester>(semesters: readonly T[]): T[] {
  return [...semesters].sort(compareSemesters);
}

export function sortBySemester<T>(
  items: readonly T[],
  getSemester: (item: T) => Semester
): T[] {
  return [...items].sort((left, right) =>
    compareSemesters(getSemester(left), getSemester(right))
  );
}
