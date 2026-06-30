import { utils, write, type WorkBook } from "xlsx";
import type { NonOverlappingSubjectCombination } from "../analytics/nonOverlappingSubjects";
import { semesterLabel } from "../utils/semester";

export const nonOverlappingSubjectsFileName = "미중복선택과목_명렬.xlsx";

const sheetHeader = [
  "번호",
  "학년",
  "학기",
  "학기명",
  "과목 수",
  "총 신청 학생 수",
  "과목명렬",
  "교과군명렬",
  "과목 1",
  "과목 1 신청 학생 수",
  "과목 2",
  "과목 2 신청 학생 수",
  "과목 3",
  "과목 3 신청 학생 수",
  "과목 4",
  "과목 4 신청 학생 수"
];

function subjectNameAt(
  combination: NonOverlappingSubjectCombination,
  index: number
): string {
  return combination.subjects[index]?.subjectName ?? "";
}

function studentCountAt(
  combination: NonOverlappingSubjectCombination,
  index: number
): number | "" {
  return combination.subjects[index]?.studentCount ?? "";
}

function combinationRows(
  combinations: readonly NonOverlappingSubjectCombination[]
): unknown[][] {
  return combinations.map((combination, index) => [
    index + 1,
    combination.target.grade,
    combination.target.semester,
    semesterLabel(combination.target),
    combination.subjectCount,
    combination.totalStudentCount,
    combination.subjectNames.join(", "),
    combination.subjectGroups.join(", "),
    subjectNameAt(combination, 0),
    studentCountAt(combination, 0),
    subjectNameAt(combination, 1),
    studentCountAt(combination, 1),
    subjectNameAt(combination, 2),
    studentCountAt(combination, 2),
    subjectNameAt(combination, 3),
    studentCountAt(combination, 3)
  ]);
}

export function createNonOverlappingSubjectsWorkbook(
  combinations: readonly NonOverlappingSubjectCombination[]
): WorkBook {
  const workbook = utils.book_new();
  const sheet = utils.aoa_to_sheet([
    sheetHeader,
    ...combinationRows(combinations)
  ]);

  sheet["!cols"] = [
    8, 8, 8, 14, 10, 16, 48, 24, 24, 16, 24, 16, 24, 16, 24, 16
  ].map((wch) => ({ wch }));
  utils.book_append_sheet(workbook, sheet, "미중복과목명렬");

  return workbook;
}

export function exportNonOverlappingSubjectsXlsx(
  combinations: readonly NonOverlappingSubjectCombination[]
): Blob {
  const buffer = write(createNonOverlappingSubjectsWorkbook(combinations), {
    bookType: "xlsx",
    type: "array"
  }) as ArrayBuffer;

  return new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  });
}
