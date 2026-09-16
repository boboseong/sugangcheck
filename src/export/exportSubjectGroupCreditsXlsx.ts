import { utils, write, type WorkBook } from "@e965/xlsx";
import {
  subjectGroupCreditColumns,
  summarizeSubjectGroupCredits
} from "../analytics/subjectGroupCreditSummary";
import type { CourseSelectionRecord } from "../types/courseSelection";
import type { Student } from "../types/student";

export const subjectGroupCreditsFileName = "학생별_교과군별학점.xlsx";
export const subjectGroupCreditsSheetName = "교과군별학점";

const emptyRecords: readonly CourseSelectionRecord[] = [];

export function compareStudentsByStudentNo(left: Student, right: Student): number {
  const studentNoCompare = left.studentNo.localeCompare(right.studentNo, "ko", {
    numeric: true
  });

  return studentNoCompare === 0
    ? left.name.localeCompare(right.name, "ko", { numeric: true })
    : studentNoCompare;
}

export function subjectGroupCreditsHeader(): string[] {
  return [
    "번호",
    "학번",
    "성명",
    "반",
    "번호(반내)",
    ...subjectGroupCreditColumns,
    "국수영",
    "국수영 최대",
    "생활교양",
    "총학점"
  ];
}

function subjectGroupCreditRows(
  students: readonly Student[],
  recordsByStudentId: ReadonlyMap<string, readonly CourseSelectionRecord[]>
): unknown[][] {
  return [...students].sort(compareStudentsByStudentNo).map((student, index) => {
    const summary = summarizeSubjectGroupCredits(
      recordsByStudentId.get(student.studentId) ?? emptyRecords
    );

    return [
      index + 1,
      student.studentNo,
      student.name,
      student.currentClassNo ?? "",
      student.currentNumber ?? "",
      ...summary.groupCredits.map(([, credits]) => credits),
      summary.kmeCredits,
      summary.kmeLimitCredits,
      summary.lifeLiberalCredits,
      summary.totalCredits
    ];
  });
}

export function createSubjectGroupCreditsWorkbook(
  students: readonly Student[],
  recordsByStudentId: ReadonlyMap<string, readonly CourseSelectionRecord[]>
): WorkBook {
  const workbook = utils.book_new();
  const sheet = utils.aoa_to_sheet([
    subjectGroupCreditsHeader(),
    ...subjectGroupCreditRows(students, recordsByStudentId)
  ]);

  sheet["!cols"] = [
    6,
    10,
    12,
    6,
    10,
    ...subjectGroupCreditColumns.map((subjectGroup) => Math.max(7, subjectGroup.length + 2)),
    8,
    11,
    9,
    8
  ].map((wch) => ({ wch }));
  utils.book_append_sheet(workbook, sheet, subjectGroupCreditsSheetName);

  return workbook;
}

export function exportSubjectGroupCreditsXlsx(
  students: readonly Student[],
  recordsByStudentId: ReadonlyMap<string, readonly CourseSelectionRecord[]>
): Blob {
  const buffer = write(createSubjectGroupCreditsWorkbook(students, recordsByStudentId), {
    bookType: "xlsx",
    type: "array"
  }) as ArrayBuffer;

  return new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  });
}
