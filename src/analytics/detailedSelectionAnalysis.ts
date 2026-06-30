import { normalizeSubjectName } from "../normalizers/normalizeSubjectName";
import type { CourseSelectionRecord } from "../types/courseSelection";
import type { DetailedConstraintSubject, SubjectCountComparison } from "../types/validation";
import { semesterLabel, semesterToKey } from "../utils/semester";
import { groupByStudent, representativeRecord } from "../validation/validationUtils";

export type DetailedSelectionAnalysisSubject = DetailedConstraintSubject & {
  key: string;
  label: string;
};

export type DetailedSelectionAnalysisSelection = {
  subjectKey: string;
  selected: boolean;
};

export type DetailedSelectionAnalysisRow = {
  studentId: string;
  studentNo: string;
  studentName: string;
  selectedCount: number;
  isDetected: boolean;
  selections: DetailedSelectionAnalysisSelection[];
};

export type DetailedSelectionAnalysisResult = {
  comparison: SubjectCountComparison;
  count: number;
  subjects: DetailedSelectionAnalysisSubject[];
  rows: DetailedSelectionAnalysisRow[];
  detectedRows: DetailedSelectionAnalysisRow[];
  analyzedStudentCount: number;
  detectedStudentCount: number;
};

export type BuildDetailedSelectionAnalysisInput = {
  comparison: SubjectCountComparison;
  count: number;
  records: readonly CourseSelectionRecord[];
  subjects: readonly DetailedConstraintSubject[];
};

function compareText(left: string, right: string): number {
  return left.localeCompare(right, "ko", { numeric: true });
}

function subjectKey(subject: DetailedConstraintSubject): string {
  return `${semesterToKey(subject.target)}|${subject.normalizedSubjectName}`;
}

function subjectLabel(subject: DetailedConstraintSubject): string {
  return `${semesterLabel(subject.target)} ${subject.subjectName}`;
}

function matchesSubject(
  record: CourseSelectionRecord,
  subject: DetailedConstraintSubject
): boolean {
  return (
    record.target.grade === subject.target.grade &&
    record.target.semester === subject.target.semester &&
    record.normalizedSubjectName === subject.normalizedSubjectName
  );
}

function isDetected(
  selectedCount: number,
  comparison: SubjectCountComparison,
  count: number
): boolean {
  return comparison === "atLeast"
    ? selectedCount >= count
    : selectedCount <= count;
}

export function normalizeDetailedSelectionAnalysisSubjects(
  subjects: readonly DetailedConstraintSubject[]
): DetailedSelectionAnalysisSubject[] {
  const seenKeys = new Set<string>();
  const normalizedSubjects: DetailedSelectionAnalysisSubject[] = [];

  for (const subject of subjects) {
    const subjectName = subject.subjectName.trim();
    const normalizedSubjectName =
      subject.normalizedSubjectName || normalizeSubjectName(subjectName);

    if (!subjectName || !normalizedSubjectName) {
      continue;
    }

    const normalizedSubject = {
      ...subject,
      subjectName,
      normalizedSubjectName
    };
    const key = subjectKey(normalizedSubject);

    if (seenKeys.has(key)) {
      continue;
    }

    seenKeys.add(key);
    normalizedSubjects.push({
      ...normalizedSubject,
      key,
      label: subjectLabel(normalizedSubject)
    });
  }

  return normalizedSubjects;
}

export function buildDetailedSelectionAnalysis({
  comparison,
  count,
  records,
  subjects
}: BuildDetailedSelectionAnalysisInput): DetailedSelectionAnalysisResult {
  const normalizedCount = Math.max(0, Math.floor(count));
  const normalizedSubjects = normalizeDetailedSelectionAnalysisSubjects(subjects);
  const rows = [...groupByStudent(records).entries()]
    .map(([, studentRecords]) => {
      const representative = representativeRecord(studentRecords);
      const selections = normalizedSubjects.map((subject) => ({
        subjectKey: subject.key,
        selected: studentRecords.some((record) => matchesSubject(record, subject))
      }));
      const selectedCount = selections.filter((selection) => selection.selected).length;

      return representative
        ? {
            studentId: representative.studentId,
            studentNo: representative.studentNo,
            studentName: representative.studentName,
            selectedCount,
            isDetected: isDetected(selectedCount, comparison, normalizedCount),
            selections
          }
        : undefined;
    })
    .filter((row): row is DetailedSelectionAnalysisRow => Boolean(row))
    .sort(
      (left, right) =>
        compareText(left.studentNo, right.studentNo) ||
        compareText(left.studentName, right.studentName) ||
        compareText(left.studentId, right.studentId)
    );
  const detectedRows = rows.filter((row) => row.isDetected);

  return {
    comparison,
    count: normalizedCount,
    subjects: normalizedSubjects,
    rows,
    detectedRows,
    analyzedStudentCount: rows.length,
    detectedStudentCount: detectedRows.length
  };
}
