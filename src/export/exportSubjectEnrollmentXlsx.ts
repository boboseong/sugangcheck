import { utils, write, type WorkBook } from "xlsx";
import type { SubjectEnrollmentSummary } from "../analytics/subjectEnrollment";
import { semesterLabel } from "../utils/semester";

export type SubjectEnrollmentExportMode = "all" | "subjectGroup" | "semester";

export const subjectEnrollmentFileNames: Record<
  SubjectEnrollmentExportMode,
  string
> = {
  all: "과목별수강생_전체자료.xlsx",
  subjectGroup: "과목별수강생_교과군별자료.xlsx",
  semester: "과목별수강생_학기별자료.xlsx"
};

const studentListHeader = [
  "번호",
  "학년",
  "학기",
  "학기명",
  "교과군",
  "과목명",
  "학번",
  "이름"
];

const sheetHeader = [
  "학년",
  "학기",
  "학기명",
  "교과군",
  "선택구분",
  "과목구분",
  "과목명",
  "학점",
  "신청 학생 수",
  "참조",
  "학생 명렬"
];

function metadataSourceLabel(source: SubjectEnrollmentSummary["metadataSource"]): string {
  if (source === "operatingSubject") {
    return "운영과목";
  }

  return source === "subjectMaster" ? "과목 마스터" : "미확인";
}

function safeFileNamePart(value: string): string {
  return (
    value
      .replace(/[\\/:*?"<>|]/g, "_")
      .replace(/\s+/g, "_")
      .slice(0, 48) || "자료"
  );
}

export function subjectEnrollmentStudentListFileName(
  summary: SubjectEnrollmentSummary
): string {
  return [
    "과목별수강생_학생명렬",
    safeFileNamePart(semesterLabel(summary.target)),
    safeFileNamePart(summary.subjectName)
  ].join("_") + ".xlsx";
}

function boundedList(values: readonly string[], maxLength = 30000): string {
  let text = "";

  for (let index = 0; index < values.length; index += 1) {
    const value = values[index] ?? "";
    const nextText = text ? `${text}, ${value}` : value;

    if (nextText.length > maxLength) {
      const remaining = values.length - index;
      return `${text}, 외 ${remaining.toLocaleString()}명`;
    }

    text = nextText;
  }

  return text;
}

function studentListRows(summary: SubjectEnrollmentSummary): unknown[][] {
  return summary.students.map((student, index) => [
    index + 1,
    summary.target.grade,
    summary.target.semester,
    semesterLabel(summary.target),
    summary.subjectGroup,
    summary.subjectName,
    student.studentNo,
    student.studentName
  ]);
}

function summaryRows(summaries: readonly SubjectEnrollmentSummary[]): unknown[][] {
  return summaries.map((summary) => [
    summary.target.grade,
    summary.target.semester,
    semesterLabel(summary.target),
    summary.subjectGroup,
    summary.selectionType,
    summary.groupType ?? "",
    summary.subjectName,
    summary.credits ?? "",
    summary.studentCount,
    metadataSourceLabel(summary.metadataSource),
    boundedList(summary.studentLabels)
  ]);
}

export function createSubjectEnrollmentStudentListWorkbook(
  summary: SubjectEnrollmentSummary
): WorkBook {
  const workbook = utils.book_new();
  const sheet = utils.aoa_to_sheet([
    studentListHeader,
    ...studentListRows(summary)
  ]);

  sheet["!cols"] = [8, 8, 8, 14, 18, 28, 14, 16].map((wch) => ({ wch }));
  utils.book_append_sheet(workbook, sheet, "학생명렬");

  return workbook;
}

function safeSheetName(baseName: string, usedNames: Set<string>): string {
  const normalizedBase =
    baseName.replace(/[\\/?*[\]:]/g, "·").trim().slice(0, 31) || "자료";
  let candidate = normalizedBase;
  let suffix = 2;

  while (usedNames.has(candidate)) {
    const suffixText = ` (${suffix})`;
    candidate = `${normalizedBase.slice(0, 31 - suffixText.length)}${suffixText}`;
    suffix += 1;
  }

  usedNames.add(candidate);
  return candidate;
}

function appendSummarySheet(
  workbook: WorkBook,
  usedSheetNames: Set<string>,
  sheetName: string,
  summaries: readonly SubjectEnrollmentSummary[]
) {
  const sheet = utils.aoa_to_sheet([sheetHeader, ...summaryRows(summaries)]);

  sheet["!cols"] = [8, 8, 14, 18, 14, 16, 28, 8, 12, 14, 48].map(
    (wch) => ({ wch })
  );
  utils.book_append_sheet(workbook, sheet, safeSheetName(sheetName, usedSheetNames));
}

function groupedBy<T>(
  items: readonly T[],
  getKey: (item: T) => string
): [string, T[]][] {
  const groups = new Map<string, T[]>();

  for (const item of items) {
    const key = getKey(item);
    const group = groups.get(key) ?? [];

    group.push(item);
    groups.set(key, group);
  }

  return [...groups.entries()];
}

export function createSubjectEnrollmentWorkbook(
  summaries: readonly SubjectEnrollmentSummary[],
  mode: SubjectEnrollmentExportMode
): WorkBook {
  const workbook = utils.book_new();
  const usedSheetNames = new Set<string>();

  if (mode === "all") {
    appendSummarySheet(workbook, usedSheetNames, "전체자료", summaries);
    return workbook;
  }

  if (mode === "subjectGroup") {
    for (const [subjectGroup, groupSummaries] of groupedBy(
      summaries,
      (summary) => summary.subjectGroup
    )) {
      appendSummarySheet(workbook, usedSheetNames, subjectGroup, groupSummaries);
    }

    return workbook;
  }

  for (const [semester, semesterSummaries] of groupedBy(summaries, (summary) =>
    semesterLabel(summary.target)
  )) {
    appendSummarySheet(workbook, usedSheetNames, semester, semesterSummaries);
  }

  return workbook;
}

export function exportSubjectEnrollmentXlsx(
  summaries: readonly SubjectEnrollmentSummary[],
  mode: SubjectEnrollmentExportMode
): Blob {
  const buffer = write(createSubjectEnrollmentWorkbook(summaries, mode), {
    bookType: "xlsx",
    type: "array"
  }) as ArrayBuffer;

  return new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  });
}

export function exportSubjectEnrollmentStudentListXlsx(
  summary: SubjectEnrollmentSummary
): Blob {
  const buffer = write(createSubjectEnrollmentStudentListWorkbook(summary), {
    bookType: "xlsx",
    type: "array"
  }) as ArrayBuffer;

  return new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  });
}
