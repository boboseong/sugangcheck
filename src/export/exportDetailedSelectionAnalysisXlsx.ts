import { utils, write, type WorkBook } from "xlsx";
import type {
  DetailedSelectionAnalysisResult,
  DetailedSelectionAnalysisRow,
  DetailedSelectionAnalysisSubject
} from "../analytics/detailedSelectionAnalysis";
import type { SubjectCountComparison } from "../types/validation";

export const detailedSelectionAnalysisFileName = "학생선택_세부분석.xlsx";

function comparisonLabel(comparison: SubjectCountComparison): string {
  return comparison === "atLeast" ? "n개 이상이면 검출" : "n개 이하이면 검출";
}

function selectionLabel(
  row: DetailedSelectionAnalysisRow,
  subject: DetailedSelectionAnalysisSubject
): string {
  return row.selections.some(
    (selection) => selection.subjectKey === subject.key && selection.selected
  )
    ? "O"
    : "";
}

function crosstabRows(result: DetailedSelectionAnalysisResult): unknown[][] {
  return result.detectedRows.map((row, index) => [
    index + 1,
    row.studentNo,
    row.studentName,
    row.selectedCount,
    ...result.subjects.map((subject) => selectionLabel(row, subject))
  ]);
}

function criteriaRows(result: DetailedSelectionAnalysisResult): unknown[][] {
  return [
    ["항목", "값"],
    ["비교 방식", comparisonLabel(result.comparison)],
    ["기준 개수", result.count],
    ["분석 학생 수", result.analyzedStudentCount],
    ["검출 학생 수", result.detectedStudentCount],
    [],
    ["대상 과목"],
    ["번호", "학년", "학기", "과목명"],
    ...result.subjects.map((subject, index) => [
      index + 1,
      subject.target.grade,
      subject.target.semester,
      subject.subjectName
    ])
  ];
}

export function createDetailedSelectionAnalysisWorkbook(
  result: DetailedSelectionAnalysisResult
): WorkBook {
  const workbook = utils.book_new();
  const crosstabHeader = [
    "번호",
    "학번",
    "이름",
    "선택 개수",
    ...result.subjects.map((subject) => subject.label)
  ];
  const crosstabSheet = utils.aoa_to_sheet([
    crosstabHeader,
    ...crosstabRows(result)
  ]);
  const criteriaSheet = utils.aoa_to_sheet(criteriaRows(result));

  crosstabSheet["!cols"] = [
    8,
    14,
    16,
    10,
    ...result.subjects.map(() => 22)
  ].map((wch) => ({ wch }));
  criteriaSheet["!cols"] = [14, 18, 10, 10, 28].map((wch) => ({ wch }));

  utils.book_append_sheet(workbook, crosstabSheet, "크로스탭");
  utils.book_append_sheet(workbook, criteriaSheet, "분석조건");

  return workbook;
}

export function exportDetailedSelectionAnalysisXlsx(
  result: DetailedSelectionAnalysisResult
): Blob {
  const buffer = write(createDetailedSelectionAnalysisWorkbook(result), {
    bookType: "xlsx",
    type: "array"
  }) as ArrayBuffer;

  return new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  });
}
