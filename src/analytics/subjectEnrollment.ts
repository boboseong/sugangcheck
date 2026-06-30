import { subjectMasterItems } from "../data/subjectMaster";
import type { ParsedCourseSelectionRow } from "../types/courseSelection";
import type { Semester, SemesterKey } from "../types/semester";
import type { OperatingSubject, SubjectMasterItem } from "../types/subject";
import { compareSemesters, semesterToKey } from "../utils/semester";

export const unresolvedSubjectGroup = "미확인";

export type SubjectEnrollmentMetadataSource =
  | "operatingSubject"
  | "subjectMaster"
  | "unresolved";

export type SubjectEnrollmentStudent = {
  studentNo: string;
  studentName: string;
};

export type SubjectEnrollmentSummary = {
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
  rawRowCount: number;
  duplicateRowCount: number;
  students: SubjectEnrollmentStudent[];
  studentLabels: string[];
  metadataSource: SubjectEnrollmentMetadataSource;
};

export type SubjectEnrollmentFilters = {
  semesterKey?: SemesterKey | "all";
  subjectGroup?: string | "all";
  query?: string;
  minStudentCount?: number;
  maxStudentCount?: number;
};

export type SubjectEnrollmentSortKey =
  | "semester"
  | "subjectGroup"
  | "subjectName"
  | "studentCount";

export type SubjectEnrollmentSortDirection = "asc" | "desc";

export type SubjectEnrollmentSort = {
  key: SubjectEnrollmentSortKey;
  direction: SubjectEnrollmentSortDirection;
};

const subjectGroupOrder = [
  "국어",
  "수학",
  "영어",
  "사회",
  "과학",
  "체육",
  "예술",
  "기술·가정/정보",
  "제2외국어/한문",
  "교양"
];

type StudentSummary = SubjectEnrollmentStudent;

type SubjectEnrollmentBucket = {
  target: Semester;
  normalizedSubjectName: string;
  rows: ParsedCourseSelectionRow[];
  subjectNames: Map<string, number>;
  students: Map<string, StudentSummary>;
};

function subjectGroupSortIndex(subjectGroup: string): number {
  const index = subjectGroupOrder.indexOf(subjectGroup);

  return index === -1 ? Number.MAX_SAFE_INTEGER : index;
}

function compareText(left: string, right: string): number {
  return left.localeCompare(right, "ko", { numeric: true });
}

function subjectKey(target: Semester, normalizedSubjectName: string): string {
  return `${semesterToKey(target)}|${normalizedSubjectName}`;
}

function mostFrequentSubjectName(subjectNames: Map<string, number>): string {
  return [...subjectNames.entries()].sort(
    ([leftName, leftCount], [rightName, rightCount]) =>
      rightCount - leftCount || compareText(leftName, rightName)
  )[0]?.[0] ?? "";
}

function firstResolvedCredit(rows: readonly ParsedCourseSelectionRow[]): number | undefined {
  return rows.find((row) => row.credits !== undefined)?.credits;
}

function studentIdentity(row: ParsedCourseSelectionRow): string {
  return row.studentId || `${row.studentNo}|${row.studentName}`;
}

function studentLabel(student: StudentSummary): string {
  return [student.studentNo, student.studentName].filter(Boolean).join(" ");
}

function sortStudents(
  students: Iterable<StudentSummary>
): SubjectEnrollmentStudent[] {
  return [...students]
    .sort(
      (left, right) =>
        compareText(left.studentNo, right.studentNo) ||
        compareText(left.studentName, right.studentName)
    );
}

function sortStudentLabels(students: readonly SubjectEnrollmentStudent[]): string[] {
  return students.map(studentLabel);
}

function findSubjectMasterItem(
  normalizedSubjectName: string
): SubjectMasterItem | undefined {
  return subjectMasterItems.find(
    (item) => item.normalizedSubjectName === normalizedSubjectName
  );
}

function defaultSummaryCompare(
  left: SubjectEnrollmentSummary,
  right: SubjectEnrollmentSummary
): number {
  return (
    compareSemesters(left.target, right.target) ||
    subjectGroupSortIndex(left.subjectGroup) -
      subjectGroupSortIndex(right.subjectGroup) ||
    compareText(left.subjectGroup, right.subjectGroup) ||
    compareText(left.subjectName, right.subjectName)
  );
}

export function buildSubjectEnrollmentSummaries(
  rows: readonly ParsedCourseSelectionRow[],
  operatingSubjects: readonly OperatingSubject[]
): SubjectEnrollmentSummary[] {
  const operatingSubjectsByKey = new Map(
    operatingSubjects.map((subject) => [
      subjectKey(subject.target, subject.normalizedSubjectName),
      subject
    ])
  );
  const buckets = new Map<string, SubjectEnrollmentBucket>();

  for (const row of rows) {
    const key = subjectKey(row.target, row.normalizedSubjectName);
    const bucket =
      buckets.get(key) ??
      {
        target: row.target,
        normalizedSubjectName: row.normalizedSubjectName,
        rows: [],
        subjectNames: new Map<string, number>(),
        students: new Map<string, StudentSummary>()
      };

    bucket.rows.push(row);
    bucket.subjectNames.set(
      row.subjectName,
      (bucket.subjectNames.get(row.subjectName) ?? 0) + 1
    );
    bucket.students.set(studentIdentity(row), {
      studentNo: row.studentNo,
      studentName: row.studentName
    });
    buckets.set(key, bucket);
  }

  return [...buckets.entries()]
    .map(([key, bucket]) => {
      const operatingSubject = operatingSubjectsByKey.get(key);
      const masterItem = findSubjectMasterItem(bucket.normalizedSubjectName);
      const metadataSource: SubjectEnrollmentMetadataSource = operatingSubject
        ? "operatingSubject"
        : masterItem
          ? "subjectMaster"
          : "unresolved";
      const subjectName =
        operatingSubject?.subjectName ??
        masterItem?.subjectName ??
        mostFrequentSubjectName(bucket.subjectNames);
      const studentCount = bucket.students.size;
      const students = sortStudents(bucket.students.values());

      return {
        id: key,
        target: bucket.target,
        semesterKey: semesterToKey(bucket.target),
        subjectName,
        normalizedSubjectName: bucket.normalizedSubjectName,
        subjectGroup:
          operatingSubject?.subjectGroup ??
          masterItem?.subjectGroup ??
          unresolvedSubjectGroup,
        selectionType:
          operatingSubject?.selectionType ?? masterItem?.selectionType ?? "미확인",
        groupType: operatingSubject?.groupType ?? masterItem?.groupType,
        credits:
          operatingSubject?.credits ??
          firstResolvedCredit(bucket.rows) ??
          masterItem?.defaultCredits,
        studentCount,
        rawRowCount: bucket.rows.length,
        duplicateRowCount: bucket.rows.length - studentCount,
        students,
        studentLabels: sortStudentLabels(students),
        metadataSource
      };
    })
    .sort(defaultSummaryCompare);
}

export function filterSubjectEnrollmentSummaries(
  summaries: readonly SubjectEnrollmentSummary[],
  filters: SubjectEnrollmentFilters
): SubjectEnrollmentSummary[] {
  const query = filters.query?.normalize("NFKC").trim().toLowerCase() ?? "";

  return summaries.filter((summary) => {
    if (
      filters.semesterKey &&
      filters.semesterKey !== "all" &&
      summary.semesterKey !== filters.semesterKey
    ) {
      return false;
    }

    if (
      filters.subjectGroup &&
      filters.subjectGroup !== "all" &&
      summary.subjectGroup !== filters.subjectGroup
    ) {
      return false;
    }

    if (
      filters.minStudentCount !== undefined &&
      summary.studentCount < filters.minStudentCount
    ) {
      return false;
    }

    if (
      filters.maxStudentCount !== undefined &&
      summary.studentCount > filters.maxStudentCount
    ) {
      return false;
    }

    if (!query) {
      return true;
    }

    return [
      summary.subjectName,
      summary.subjectGroup,
      summary.selectionType,
      summary.groupType ?? ""
    ]
      .join(" ")
      .normalize("NFKC")
      .toLowerCase()
      .includes(query);
  });
}

function compareBySortKey(
  left: SubjectEnrollmentSummary,
  right: SubjectEnrollmentSummary,
  key: SubjectEnrollmentSortKey
): number {
  if (key === "semester") {
    return compareSemesters(left.target, right.target);
  }

  if (key === "subjectGroup") {
    return (
      subjectGroupSortIndex(left.subjectGroup) -
        subjectGroupSortIndex(right.subjectGroup) ||
      compareText(left.subjectGroup, right.subjectGroup)
    );
  }

  if (key === "studentCount") {
    return left.studentCount - right.studentCount;
  }

  return compareText(left.subjectName, right.subjectName);
}

export function sortSubjectEnrollmentSummaries(
  summaries: readonly SubjectEnrollmentSummary[],
  sort: SubjectEnrollmentSort
): SubjectEnrollmentSummary[] {
  const directionMultiplier = sort.direction === "asc" ? 1 : -1;

  return [...summaries].sort((left, right) => {
    const primary =
      compareBySortKey(left, right, sort.key) * directionMultiplier;

    return primary || defaultSummaryCompare(left, right);
  });
}
