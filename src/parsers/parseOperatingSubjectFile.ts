import { utils, type WorkBook } from "xlsx";
import { subjectMasterItems } from "../data/subjectMaster";
import { normalizeSubjectName } from "../normalizers/normalizeSubjectName";
import { readWorkbookFromFile } from "./readWorkbook";
import type {
  OperatingSubjectColumnMap,
  OperatingSubjectParseIssue,
  OperatingSubjectParseResult,
  OperatingSubjectPreviewRow
} from "../types/OperatingSubjectParseResult";
import type { Semester, SemesterKey } from "../types/semester";
import type { OperatingSubject, SubjectMasterItem } from "../types/subject";
import { toCreditNumber } from "../utils/number";
import { parseSemesterKey, semesterToKey } from "../utils/semester";

type ParseOperatingSubjectOptions = {
  semesterImportId: string;
  target?: Semester;
  fileName?: string;
  sheetName?: string;
  masterItems?: readonly SubjectMasterItem[];
};

export type OperatingSubjectSemesterDetectionResult =
  | {
      status: "detected";
      semester: Semester;
      reason: "operating-subject-columns" | "operating-subject-semester-columns";
      rowCount: number;
    }
  | {
      status: "failed";
      reason:
        | "no-readable-sheet"
        | "missing-semester-columns"
        | "no-semester-data"
        | "ambiguous-semester-data";
      rowCount?: number;
    };

export type OperatingSubjectSemesterColumnDetection = {
  semester: Semester;
  rowCount: number;
  columnIndex: number;
  columnNumber: number;
};

type HeaderField = keyof OperatingSubjectColumnMap;

const headerAliases: Record<HeaderField, string[]> = {
  grade: ["학년"],
  semester: ["학기"],
  subjectName: ["교과목", "과목명", "교과목명", "과목"],
  credits: ["운영단위", "운영학점", "학점", "이수학점"],
  subjectGroup: ["영역분류", "영역/분류", "교과군", "교과(군)"],
  selectionType: ["선택구분", "과목유형"],
  groupType: ["과목구분"],
  groupLabel: ["그룹구분"],
  enrollmentCount: ["수강인원"]
};

function compactString(value: unknown): string {
  return String(value ?? "").normalize("NFKC").trim().replace(/\s+/g, " ");
}

function normalizeHeader(value: unknown): string {
  return compactString(value).replace(/\s+/g, "").replace(/[()]/g, "");
}

function headerMatches(value: unknown, aliases: readonly string[]): boolean {
  const normalized = normalizeHeader(value);

  return aliases.some((alias) => normalized === normalizeHeader(alias));
}

function findHeaderRow(matrix: unknown[][]): {
  headerRowIndex: number;
  columnMap: OperatingSubjectColumnMap;
} {
  let best:
    | {
        headerRowIndex: number;
        columnMap: Partial<OperatingSubjectColumnMap>;
        score: number;
      }
    | undefined;

  matrix.forEach((row, rowIndex) => {
    const columnMap: Partial<OperatingSubjectColumnMap> = {};

    row.forEach((cell, columnIndex) => {
      for (const [field, aliases] of Object.entries(headerAliases) as [
        HeaderField,
        string[]
      ][]) {
        if (columnMap[field] === undefined && headerMatches(cell, aliases)) {
          columnMap[field] = columnIndex;
        }
      }
    });

    const score =
      (columnMap.subjectName !== undefined ? 4 : 0) +
      (columnMap.credits !== undefined ? 3 : 0) +
      (columnMap.subjectGroup !== undefined ? 2 : 0) +
      (columnMap.grade !== undefined ? 1 : 0) +
      (columnMap.semester !== undefined ? 1 : 0);

    if (!best || score > best.score) {
      best = { headerRowIndex: rowIndex, columnMap, score };
    }
  });

  if (
    !best ||
    best.columnMap.subjectName === undefined ||
    best.columnMap.credits === undefined
  ) {
    throw new Error("운영과목 파일에서 과목명/학점 헤더를 찾지 못했습니다.");
  }

  return {
    headerRowIndex: best.headerRowIndex,
    columnMap: {
      ...best.columnMap,
      subjectName: best.columnMap.subjectName,
      credits: best.columnMap.credits
    }
  };
}

function parseGrade(value: unknown): Semester["grade"] | undefined {
  const match = compactString(value).match(/[1-3]/);

  if (!match) {
    return undefined;
  }

  return Number(match[0]) as Semester["grade"];
}

function parseSemesterTerm(value: unknown): Semester["semester"] | undefined {
  const match = compactString(value).match(/[1-2]/);

  if (!match) {
    return undefined;
  }

  return Number(match[0]) as Semester["semester"];
}

function parseSubjectGroup(value: unknown): string {
  const raw = compactString(value);
  const afterDelimiter = raw.includes(">") ? raw.split(">").pop() ?? raw : raw;
  const normalized = afterDelimiter.replace(/[ㆍ⋅]/g, "·");

  if (normalized.includes("사회")) {
    return "사회";
  }

  if (normalized.includes("기술") && normalized.includes("정보")) {
    return "기술·가정/정보";
  }

  return normalized;
}

function createMasterLookup(masterItems: readonly SubjectMasterItem[]) {
  const lookup = new Map<string, SubjectMasterItem[]>();

  for (const item of masterItems) {
    const bucket = lookup.get(item.normalizedSubjectName);

    if (bucket) {
      bucket.push(item);
    } else {
      lookup.set(item.normalizedSubjectName, [item]);
    }
  }

  return lookup;
}

function findMasterItem(
  lookup: Map<string, SubjectMasterItem[]>,
  normalizedSubjectName: string,
  rawSubjectGroup: string
): SubjectMasterItem | undefined {
  const candidates = lookup.get(normalizedSubjectName) ?? [];

  if (candidates.length <= 1) {
    return candidates[0];
  }

  return (
    candidates.find((item) => item.subjectGroup === rawSubjectGroup) ??
    candidates[0]
  );
}

function valueAt(row: unknown[], columnIndex?: number): unknown {
  return columnIndex === undefined ? undefined : row[columnIndex];
}

function findSemesterCreditColumns(
  headerRow: unknown[]
): Map<SemesterKey, number> {
  const columns = new Map<SemesterKey, number>();

  headerRow.forEach((cell, columnIndex) => {
    const semester = parseSemesterKey(compactString(cell));

    if (semester) {
      columns.set(semesterToKey(semester), columnIndex);
    }
  });

  return columns;
}

function findSemesterCreditColumn(
  headerRow: unknown[],
  target: Semester
): number | undefined {
  return findSemesterCreditColumns(headerRow).get(semesterToKey(target));
}

function hasPositiveCredit(value: unknown): boolean {
  const credits = toCreditNumber(value);

  return credits !== undefined && credits > 0;
}

function detectSemesterColumnRows(
  matrix: unknown[][],
  headerRowIndex: number,
  columnMap: OperatingSubjectColumnMap
): OperatingSubjectSemesterColumnDetection[] {
  const headerRow = matrix[headerRowIndex] ?? [];
  const semesterColumns = findSemesterCreditColumns(headerRow);

  return [...semesterColumns.entries()].flatMap(([key, columnIndex]) => {
    const semester = parseSemesterKey(key);

    if (!semester) {
      return [];
    }

    const rowCount = matrix.slice(headerRowIndex + 1).filter((row) => {
      const subjectName = compactString(valueAt(row, columnMap.subjectName));

      return subjectName && hasPositiveCredit(valueAt(row, columnIndex));
    }).length;

    return rowCount > 0
      ? [
          {
            semester,
            rowCount,
            columnIndex,
            columnNumber: columnIndex + 1
          }
        ]
      : [];
  });
}

function buildOperatingSubjectId(
  semesterImportId: string,
  rowNumber: number,
  normalizedSubjectName: string
): string {
  return `${semesterImportId}-row-${rowNumber}-${normalizedSubjectName}`;
}

function semesterKey(semester: Semester): string {
  return `${semester.grade}-${semester.semester}`;
}

export function detectOperatingSubjectSemesterFromWorkbook(
  workbook: WorkBook,
  sheetName = workbook.SheetNames[0]
): OperatingSubjectSemesterDetectionResult {
  if (!sheetName || !workbook.Sheets[sheetName]) {
    return { status: "failed", reason: "no-readable-sheet" };
  }

  const matrix = utils.sheet_to_json<unknown[]>(workbook.Sheets[sheetName], {
    header: 1,
    blankrows: false,
    defval: ""
  });
  let headerRowIndex: number;
  let columnMap: OperatingSubjectColumnMap;

  try {
    const header = findHeaderRow(matrix);
    headerRowIndex = header.headerRowIndex;
    columnMap = header.columnMap;
  } catch {
    return { status: "failed", reason: "missing-semester-columns" };
  }

  if (columnMap.grade === undefined || columnMap.semester === undefined) {
    const semesterColumns = findSemesterCreditColumns(matrix[headerRowIndex] ?? []);

    if (semesterColumns.size > 0) {
      const detected = detectSemesterColumnRows(matrix, headerRowIndex, columnMap);

      if (detected.length === 0) {
        return { status: "failed", reason: "no-semester-data" };
      }

      if (detected.length > 1) {
        return {
          status: "failed",
          reason: "ambiguous-semester-data",
          rowCount: detected.reduce((total, item) => total + item.rowCount, 0)
        };
      }

      const result = detected[0];

      if (!result) {
        return { status: "failed", reason: "no-semester-data" };
      }

      return {
        status: "detected",
        semester: result.semester,
        reason: "operating-subject-semester-columns",
        rowCount: result.rowCount
      };
    }

    return { status: "failed", reason: "missing-semester-columns" };
  }

  const detected = new Map<string, { semester: Semester; rowCount: number }>();

  matrix.slice(headerRowIndex + 1).forEach((row) => {
    const subjectName = compactString(valueAt(row, columnMap.subjectName));

    if (!subjectName) {
      return;
    }

    const grade = parseGrade(valueAt(row, columnMap.grade));
    const semesterTerm = parseSemesterTerm(valueAt(row, columnMap.semester));

    if (!grade || !semesterTerm) {
      return;
    }

    const semester: Semester = { grade, semester: semesterTerm };
    const key = semesterKey(semester);
    const current = detected.get(key);

    detected.set(key, {
      semester,
      rowCount: (current?.rowCount ?? 0) + 1
    });
  });

  if (detected.size === 0) {
    return { status: "failed", reason: "no-semester-data" };
  }

  if (detected.size > 1) {
    return {
      status: "failed",
      reason: "ambiguous-semester-data",
      rowCount: [...detected.values()].reduce(
        (total, item) => total + item.rowCount,
        0
      )
    };
  }

  const result = [...detected.values()][0];

  if (!result) {
    return { status: "failed", reason: "no-semester-data" };
  }

  return {
    status: "detected",
    semester: result.semester,
    reason: "operating-subject-columns",
    rowCount: result.rowCount
  };
}

export function detectOperatingSubjectSemestersFromWorkbook(
  workbook: WorkBook,
  sheetName = workbook.SheetNames[0]
): OperatingSubjectSemesterColumnDetection[] {
  if (!sheetName || !workbook.Sheets[sheetName]) {
    return [];
  }

  const matrix = utils.sheet_to_json<unknown[]>(workbook.Sheets[sheetName], {
    header: 1,
    blankrows: false,
    defval: ""
  });

  try {
    const { headerRowIndex, columnMap } = findHeaderRow(matrix);

    return detectSemesterColumnRows(matrix, headerRowIndex, columnMap);
  } catch {
    return [];
  }
}

export function parseOperatingSubjectWorkbook(
  workbook: WorkBook,
  options: ParseOperatingSubjectOptions
): OperatingSubjectParseResult {
  const sheetName = options.sheetName ?? workbook.SheetNames[0];

  if (!sheetName || !workbook.Sheets[sheetName]) {
    throw new Error("운영과목 파일에서 읽을 수 있는 시트를 찾지 못했습니다.");
  }

  const matrix = utils.sheet_to_json<unknown[]>(workbook.Sheets[sheetName], {
    header: 1,
    blankrows: false,
    defval: ""
  });
  const { headerRowIndex, columnMap: detectedColumnMap } = findHeaderRow(matrix);
  const semesterCreditColumn = options.target
    ? findSemesterCreditColumn(matrix[headerRowIndex] ?? [], options.target)
    : undefined;
  const usesSemesterCreditColumn = semesterCreditColumn !== undefined;
  const columnMap = usesSemesterCreditColumn
    ? { ...detectedColumnMap, credits: semesterCreditColumn }
    : detectedColumnMap;
  const masterLookup = createMasterLookup(options.masterItems ?? subjectMasterItems);
  const subjects: OperatingSubject[] = [];
  const failedRows: OperatingSubjectParseIssue[] = [];
  const previewRows: OperatingSubjectPreviewRow[] = [];
  let carriedSubjectGroup = "";

  matrix.slice(headerRowIndex + 1).forEach((row, offset) => {
    const rowNumber = headerRowIndex + offset + 2;
    const explicitSubjectGroup = parseSubjectGroup(
      valueAt(row, detectedColumnMap.subjectGroup)
    );

    if (explicitSubjectGroup) {
      carriedSubjectGroup = explicitSubjectGroup;
    }

    const subjectName = compactString(valueAt(row, columnMap.subjectName));
    const credits = toCreditNumber(valueAt(row, columnMap.credits));

    if (
      usesSemesterCreditColumn &&
      (!subjectName || credits === undefined || credits <= 0)
    ) {
      return;
    }

    if (!subjectName) {
      return;
    }

    const normalizedSubjectName = normalizeSubjectName(subjectName);
    const grade = options.target?.grade ?? parseGrade(valueAt(row, columnMap.grade));
    const semester =
      options.target?.semester ?? parseSemesterTerm(valueAt(row, columnMap.semester));
    const rawSubjectGroup =
      parseSubjectGroup(valueAt(row, detectedColumnMap.subjectGroup)) ||
      (usesSemesterCreditColumn ? carriedSubjectGroup : "");
    const masterItem = findMasterItem(
      masterLookup,
      normalizedSubjectName,
      rawSubjectGroup
    );
    const groupType =
      masterItem?.groupType ??
      (usesSemesterCreditColumn
        ? ""
        : compactString(valueAt(row, detectedColumnMap.groupType)));
    const subjectGroup = masterItem?.subjectGroup ?? rawSubjectGroup;
    const selectionType =
      masterItem?.selectionType ??
      compactString(valueAt(row, detectedColumnMap.selectionType));
    const issueMessages: string[] = [];

    if (credits === undefined) {
      issueMessages.push("학점 값을 숫자로 해석하지 못했습니다.");
    }

    if (!grade || !semester) {
      issueMessages.push("학년 또는 학기 값을 찾지 못했습니다.");
    }

    if (!subjectGroup) {
      issueMessages.push("교과군 값을 찾지 못했습니다.");
    }

    if (issueMessages.length > 0 || credits === undefined || !grade || !semester) {
      const message = issueMessages.join(" ");
      failedRows.push({ rowNumber, message, rawValues: row });
      previewRows.push({
        rowNumber,
        subjectName,
        normalizedSubjectName,
        subjectGroup,
        selectionType,
        groupType,
        masterMatchStatus: masterItem ? "matched" : "unmatched",
        message
      });
      return;
    }

    const operatingSubject: OperatingSubject = {
      id: buildOperatingSubjectId(
        options.semesterImportId,
        rowNumber,
        normalizedSubjectName
      ),
      target: { grade, semester },
      subjectName,
      normalizedSubjectName,
      subjectGroup,
      selectionType: selectionType || "미확인",
      groupType: groupType || undefined,
      credits,
      masterMatchStatus: masterItem ? "matched" : "unmatched",
      semesterImportId: options.semesterImportId,
      sourceRowNumber: rowNumber
    };

    subjects.push(operatingSubject);
    previewRows.push({
      rowNumber,
      subjectName,
      normalizedSubjectName,
      subjectGroup,
      selectionType: operatingSubject.selectionType,
      groupType: operatingSubject.groupType,
      credits,
      masterMatchStatus: operatingSubject.masterMatchStatus
    });
  });

  return {
    semesterImportId: options.semesterImportId,
    fileName: options.fileName,
    sheetName,
    target: options.target,
    headerRowNumber: headerRowIndex + 1,
    columnMap,
    subjects,
    failedRows,
    previewRows
  };
}

export async function parseOperatingSubjectFile(
  file: File,
  options: Omit<ParseOperatingSubjectOptions, "fileName">
): Promise<OperatingSubjectParseResult> {
  const workbook = await readWorkbookFromFile(file);

  return parseOperatingSubjectWorkbook(workbook, {
    ...options,
    fileName: file.name
  });
}
