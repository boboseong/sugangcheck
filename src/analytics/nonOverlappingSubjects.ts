import {
  buildSubjectEnrollmentSummaries,
  type SubjectEnrollmentMetadataSource
} from "./subjectEnrollment";
import type { ParsedCourseSelectionRow } from "../types/courseSelection";
import type { Semester, SemesterKey } from "../types/semester";
import type { OperatingSubject } from "../types/subject";
import { compareSemesters, semesterToKey } from "../utils/semester";

export const nonOverlappingSubjectCounts = [2, 3, 4] as const;

export type NonOverlappingSubjectCount =
  (typeof nonOverlappingSubjectCounts)[number];

export type NonOverlappingSubject = {
  id: string;
  target: Semester;
  semesterKey: SemesterKey;
  subjectName: string;
  normalizedSubjectName: string;
  subjectGroup: string;
  selectionType: string;
  groupType?: string;
  credits?: number;
  studentCount: number;
  metadataSource: SubjectEnrollmentMetadataSource;
};

export type NonOverlappingSubjectCombination = {
  id: string;
  target: Semester;
  semesterKey: SemesterKey;
  subjectCount: NonOverlappingSubjectCount;
  totalStudentCount: number;
  subjects: NonOverlappingSubject[];
  subjectNames: string[];
  subjectGroups: string[];
};

export type NonOverlappingSubjectFilters = {
  semesterKey?: SemesterKey | "all";
  subjectCount?: NonOverlappingSubjectCount | "all";
  query?: string;
};

type SubjectCandidate = NonOverlappingSubject & {
  studentKeys: Set<string>;
};

function compareText(left: string, right: string): number {
  return left.localeCompare(right, "ko", { numeric: true });
}

function subjectKey(target: Semester, normalizedSubjectName: string): string {
  return `${semesterToKey(target)}|${normalizedSubjectName}`;
}

function studentIdentity(row: ParsedCourseSelectionRow): string {
  return row.studentId || `${row.studentNo}|${row.studentName}`;
}

function hasStudentOverlap(
  leftStudentKeys: ReadonlySet<string>,
  rightStudentKeys: ReadonlySet<string>
): boolean {
  const [smaller, larger] =
    leftStudentKeys.size <= rightStudentKeys.size
      ? [leftStudentKeys, rightStudentKeys]
      : [rightStudentKeys, leftStudentKeys];

  for (const studentKey of smaller) {
    if (larger.has(studentKey)) {
      return true;
    }
  }

  return false;
}

function subjectCompare(
  left: NonOverlappingSubject,
  right: NonOverlappingSubject
): number {
  return (
    compareSemesters(left.target, right.target) ||
    compareText(left.subjectGroup, right.subjectGroup) ||
    compareText(left.subjectName, right.subjectName)
  );
}

function combinationCompare(
  left: NonOverlappingSubjectCombination,
  right: NonOverlappingSubjectCombination
): number {
  const subjectNameCompare = left.subjects.reduce((result, leftSubject, index) => {
    if (result !== 0) {
      return result;
    }

    const rightSubject = right.subjects[index];
    return rightSubject
      ? compareText(leftSubject.subjectName, rightSubject.subjectName)
      : 1;
  }, 0);

  return (
    compareSemesters(left.target, right.target) ||
    left.subjectCount - right.subjectCount ||
    subjectNameCompare
  );
}

function uniqueSortedSubjectGroups(
  subjects: readonly NonOverlappingSubject[]
): string[] {
  return [...new Set(subjects.map((subject) => subject.subjectGroup))].sort(
    compareText
  );
}

function createCombination(
  subjects: readonly SubjectCandidate[],
  usedStudentKeys: ReadonlySet<string>
): NonOverlappingSubjectCombination {
  const publicSubjects = subjects.map(({ studentKeys, ...subject }) => subject);
  const subjectNames = publicSubjects.map((subject) => subject.subjectName);

  return {
    id: `${publicSubjects[0]?.semesterKey ?? "semester"}|${subjects.length}|${publicSubjects
      .map((subject) => subject.normalizedSubjectName)
      .join("|")}`,
    target: publicSubjects[0]?.target ?? { grade: 1, semester: 1 },
    semesterKey: publicSubjects[0]?.semesterKey ?? "1-1",
    subjectCount: subjects.length as NonOverlappingSubjectCount,
    totalStudentCount: usedStudentKeys.size,
    subjects: publicSubjects,
    subjectNames,
    subjectGroups: uniqueSortedSubjectGroups(publicSubjects)
  };
}

function groupedBySemester(
  subjects: readonly SubjectCandidate[]
): Map<SemesterKey, SubjectCandidate[]> {
  const groups = new Map<SemesterKey, SubjectCandidate[]>();

  for (const subject of subjects) {
    const group = groups.get(subject.semesterKey) ?? [];

    group.push(subject);
    groups.set(subject.semesterKey, group);
  }

  return groups;
}

function buildStudentKeysBySubject(
  rows: readonly ParsedCourseSelectionRow[]
): Map<string, Set<string>> {
  const studentKeysBySubject = new Map<string, Set<string>>();

  for (const row of rows) {
    const key = subjectKey(row.target, row.normalizedSubjectName);
    const studentKeys = studentKeysBySubject.get(key) ?? new Set<string>();

    studentKeys.add(studentIdentity(row));
    studentKeysBySubject.set(key, studentKeys);
  }

  return studentKeysBySubject;
}

function collectCombinationsForSize(
  subjects: readonly SubjectCandidate[],
  subjectCount: NonOverlappingSubjectCount
): NonOverlappingSubjectCombination[] {
  const combinations: NonOverlappingSubjectCombination[] = [];
  const currentSubjects: SubjectCandidate[] = [];
  const usedStudentKeys = new Set<string>();

  function visit(startIndex: number) {
    if (currentSubjects.length === subjectCount) {
      combinations.push(createCombination(currentSubjects, usedStudentKeys));
      return;
    }

    const remainingSlots = subjectCount - currentSubjects.length;
    const lastStartIndex = subjects.length - remainingSlots;

    for (let index = startIndex; index <= lastStartIndex; index += 1) {
      const subject = subjects[index];

      if (!subject || hasStudentOverlap(usedStudentKeys, subject.studentKeys)) {
        continue;
      }

      currentSubjects.push(subject);
      for (const studentKey of subject.studentKeys) {
        usedStudentKeys.add(studentKey);
      }

      visit(index + 1);

      for (const studentKey of subject.studentKeys) {
        usedStudentKeys.delete(studentKey);
      }
      currentSubjects.pop();
    }
  }

  visit(0);
  return combinations;
}

export function buildNonOverlappingSubjectCombinations(
  rows: readonly ParsedCourseSelectionRow[],
  operatingSubjects: readonly OperatingSubject[]
): NonOverlappingSubjectCombination[] {
  const studentKeysBySubject = buildStudentKeysBySubject(rows);
  const subjects = buildSubjectEnrollmentSummaries(rows, operatingSubjects)
    .map<SubjectCandidate>((summary) => ({
      id: summary.id,
      target: summary.target,
      semesterKey: summary.semesterKey,
      subjectName: summary.subjectName,
      normalizedSubjectName: summary.normalizedSubjectName,
      subjectGroup: summary.subjectGroup,
      selectionType: summary.selectionType,
      groupType: summary.groupType,
      credits: summary.credits,
      studentCount: summary.studentCount,
      metadataSource: summary.metadataSource,
      studentKeys: studentKeysBySubject.get(summary.id) ?? new Set<string>()
    }))
    .filter((subject) => subject.studentKeys.size > 0)
    .sort(subjectCompare);
  const combinations: NonOverlappingSubjectCombination[] = [];

  for (const semesterSubjects of groupedBySemester(subjects).values()) {
    for (const subjectCount of nonOverlappingSubjectCounts) {
      if (semesterSubjects.length < subjectCount) {
        continue;
      }

      combinations.push(
        ...collectCombinationsForSize(semesterSubjects, subjectCount)
      );
    }
  }

  return combinations.sort(combinationCompare);
}

export function filterNonOverlappingSubjectCombinations(
  combinations: readonly NonOverlappingSubjectCombination[],
  filters: NonOverlappingSubjectFilters
): NonOverlappingSubjectCombination[] {
  const query = filters.query?.normalize("NFKC").trim().toLowerCase() ?? "";

  return combinations.filter((combination) => {
    if (
      filters.semesterKey &&
      filters.semesterKey !== "all" &&
      combination.semesterKey !== filters.semesterKey
    ) {
      return false;
    }

    if (
      filters.subjectCount &&
      filters.subjectCount !== "all" &&
      combination.subjectCount !== filters.subjectCount
    ) {
      return false;
    }

    if (!query) {
      return true;
    }

    return combination.subjects
      .flatMap((subject) => [
        subject.subjectName,
        subject.subjectGroup,
        subject.selectionType,
        subject.groupType ?? ""
      ])
      .join(" ")
      .normalize("NFKC")
      .toLowerCase()
      .includes(query);
  });
}
