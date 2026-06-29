import type { ParsedCourseSelectionRow } from "../types/courseSelection";
import type { Semester, SemesterKey } from "../types/semester";
import {
  compareSemesters,
  semesterToKey
} from "../utils/semester";

export type CourseSelectionStudentChange = {
  id: string;
  studentId: string;
  studentNo: string;
  studentName: string;
  classNo?: string;
  number?: string;
  target: Semester;
  canceledSubjects: string[];
  appliedSubjects: string[];
};

export type CourseSelectionSubjectChange = {
  id: string;
  target: Semester;
  subjectName: string;
  normalizedSubjectName: string;
  previousCount: number;
  nextCount: number;
  delta: number;
  canceledCount: number;
  appliedCount: number;
};

export type CourseSelectionChangeSummary = {
  changedStudentCount: number;
  changedStudentSemesterCount: number;
  canceledSubjectCount: number;
  appliedSubjectCount: number;
  changedSubjectCount: number;
};

export type CourseSelectionChangeComparison = {
  studentChanges: CourseSelectionStudentChange[];
  subjectChanges: CourseSelectionSubjectChange[];
  summary: CourseSelectionChangeSummary;
};

type StudentSemesterBucket = {
  studentId: string;
  studentNo: string;
  studentName: string;
  classNo?: string;
  number?: string;
  target: Semester;
  subjects: Map<string, string>;
};

type SubjectBucket = {
  target: Semester;
  normalizedSubjectName: string;
  subjectName: string;
  previousStudents: Set<string>;
  nextStudents: Set<string>;
};

function compareText(left: string, right: string): number {
  return left.localeCompare(right, "ko", { numeric: true });
}

function compareSubjectNames(left: string, right: string): number {
  return compareText(left, right);
}

function studentSemesterKey(row: ParsedCourseSelectionRow): string {
  return `${semesterToKey(row.target)}|${row.studentId}`;
}

function subjectSemesterKey(row: ParsedCourseSelectionRow): string {
  return `${semesterToKey(row.target)}|${row.normalizedSubjectName}`;
}

function buildStudentSemesterBuckets(
  rows: readonly ParsedCourseSelectionRow[]
): Map<string, StudentSemesterBucket> {
  const buckets = new Map<string, StudentSemesterBucket>();

  for (const row of rows) {
    const key = studentSemesterKey(row);
    const bucket =
      buckets.get(key) ??
      {
        studentId: row.studentId,
        studentNo: row.studentNo,
        studentName: row.studentName,
        classNo: row.classNo,
        number: row.number,
        target: row.target,
        subjects: new Map<string, string>()
      };

    bucket.subjects.set(row.normalizedSubjectName, row.subjectName);
    buckets.set(key, bucket);
  }

  return buckets;
}

function subjectNamesOnlyIn(
  source: Map<string, string>,
  other: Map<string, string>
): string[] {
  return [...source.entries()]
    .filter(([normalizedSubjectName]) => !other.has(normalizedSubjectName))
    .map(([, subjectName]) => subjectName)
    .sort(compareSubjectNames);
}

function pickStudentBucket(
  previous?: StudentSemesterBucket,
  next?: StudentSemesterBucket
): StudentSemesterBucket {
  return next ?? previous!;
}

function compareStudentChanges(
  previousRows: readonly ParsedCourseSelectionRow[],
  nextRows: readonly ParsedCourseSelectionRow[]
): CourseSelectionStudentChange[] {
  const previousBuckets = buildStudentSemesterBuckets(previousRows);
  const nextBuckets = buildStudentSemesterBuckets(nextRows);
  const keys = new Set([...previousBuckets.keys(), ...nextBuckets.keys()]);
  const changes: CourseSelectionStudentChange[] = [];

  for (const key of keys) {
    const previous = previousBuckets.get(key);
    const next = nextBuckets.get(key);
    const previousSubjects = previous?.subjects ?? new Map<string, string>();
    const nextSubjects = next?.subjects ?? new Map<string, string>();
    const canceledSubjects = subjectNamesOnlyIn(previousSubjects, nextSubjects);
    const appliedSubjects = subjectNamesOnlyIn(nextSubjects, previousSubjects);

    if (canceledSubjects.length === 0 && appliedSubjects.length === 0) {
      continue;
    }

    const bucket = pickStudentBucket(previous, next);
    const semesterKey = semesterToKey(bucket.target);

    changes.push({
      id: `${semesterKey}-${bucket.studentId}`,
      studentId: bucket.studentId,
      studentNo: bucket.studentNo,
      studentName: bucket.studentName,
      classNo: bucket.classNo,
      number: bucket.number,
      target: bucket.target,
      canceledSubjects,
      appliedSubjects
    });
  }

  return changes.sort((left, right) => {
    const semesterOrder = compareSemesters(left.target, right.target);

    if (semesterOrder !== 0) {
      return semesterOrder;
    }

    return (
      compareText(left.studentNo, right.studentNo) ||
      compareText(left.studentName, right.studentName)
    );
  });
}

function buildSubjectBuckets(
  previousRows: readonly ParsedCourseSelectionRow[],
  nextRows: readonly ParsedCourseSelectionRow[]
): Map<string, SubjectBucket> {
  const buckets = new Map<string, SubjectBucket>();

  function add(row: ParsedCourseSelectionRow, side: "previous" | "next") {
    const key = subjectSemesterKey(row);
    const bucket =
      buckets.get(key) ??
      {
        target: row.target,
        normalizedSubjectName: row.normalizedSubjectName,
        subjectName: row.subjectName,
        previousStudents: new Set<string>(),
        nextStudents: new Set<string>()
      };

    if (side === "previous") {
      bucket.previousStudents.add(row.studentId);
    } else {
      bucket.nextStudents.add(row.studentId);
      bucket.subjectName = row.subjectName;
    }

    buckets.set(key, bucket);
  }

  previousRows.forEach((row) => add(row, "previous"));
  nextRows.forEach((row) => add(row, "next"));

  return buckets;
}

function countOnlyIn(source: Set<string>, other: Set<string>): number {
  let count = 0;

  source.forEach((studentId) => {
    if (!other.has(studentId)) {
      count += 1;
    }
  });

  return count;
}

function compareSubjectChanges(
  previousRows: readonly ParsedCourseSelectionRow[],
  nextRows: readonly ParsedCourseSelectionRow[]
): CourseSelectionSubjectChange[] {
  return [...buildSubjectBuckets(previousRows, nextRows).values()]
    .map((bucket) => {
      const previousCount = bucket.previousStudents.size;
      const nextCount = bucket.nextStudents.size;
      const canceledCount = countOnlyIn(
        bucket.previousStudents,
        bucket.nextStudents
      );
      const appliedCount = countOnlyIn(bucket.nextStudents, bucket.previousStudents);
      const targetKey: SemesterKey = semesterToKey(bucket.target);

      return {
        id: `${targetKey}-${bucket.normalizedSubjectName}`,
        target: bucket.target,
        subjectName: bucket.subjectName,
        normalizedSubjectName: bucket.normalizedSubjectName,
        previousCount,
        nextCount,
        delta: nextCount - previousCount,
        canceledCount,
        appliedCount
      };
    })
    .filter(
      (change) =>
        change.delta !== 0 ||
        change.canceledCount > 0 ||
        change.appliedCount > 0
    )
    .sort((left, right) => {
      const semesterOrder = compareSemesters(left.target, right.target);

      if (semesterOrder !== 0) {
        return semesterOrder;
      }

      const totalChangeOrder =
        right.canceledCount +
        right.appliedCount -
        (left.canceledCount + left.appliedCount);

      if (totalChangeOrder !== 0) {
        return totalChangeOrder;
      }

      return compareSubjectNames(left.subjectName, right.subjectName);
    });
}

export function compareCourseSelectionChanges(
  previousRows: readonly ParsedCourseSelectionRow[],
  nextRows: readonly ParsedCourseSelectionRow[]
): CourseSelectionChangeComparison {
  const studentChanges = compareStudentChanges(previousRows, nextRows);
  const subjectChanges = compareSubjectChanges(previousRows, nextRows);
  const changedStudentIds = new Set(
    studentChanges.map((change) => change.studentId)
  );
  const summary: CourseSelectionChangeSummary = {
    changedStudentCount: changedStudentIds.size,
    changedStudentSemesterCount: studentChanges.length,
    canceledSubjectCount: studentChanges.reduce(
      (total, change) => total + change.canceledSubjects.length,
      0
    ),
    appliedSubjectCount: studentChanges.reduce(
      (total, change) => total + change.appliedSubjects.length,
      0
    ),
    changedSubjectCount: subjectChanges.length
  };

  return {
    studentChanges,
    subjectChanges,
    summary
  };
}
