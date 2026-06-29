import { utils, type WorkBook } from "xlsx";
import { normalizeSubjectName } from "../normalizers/normalizeSubjectName";
import { readWorkbookFromFile } from "./readWorkbook";
import type {
  CourseSelectionColumnMap,
  CourseSelectionDetectedSubject,
  CourseSelectionParseIssue,
  CourseSelectionParseResult,
  CourseSelectionPreviewRow
} from "../types/CourseSelectionParseResult";
import type { ParsedCourseSelectionRow } from "../types/courseSelection";
import type { Semester, SemesterKey } from "../types/semester";
import {
  detectSemesterFromFileName
} from "../utils/detectSemesterFromFileName";
import {
  createGeneratedStudentNo,
  createStudentAuxiliaryKey
} from "../utils/studentKey";
import { parseSemesterKey, semesterToKey } from "../utils/semester";

type ParseCourseSelectionOptions = {
  semesterImportId: string;
  target?: Semester;
  fileName?: string;
  sheetName?: string;
};

type HeaderField = Exclude<keyof CourseSelectionColumnMap, "firstSubjectColumn">;

const headerAliases: Record<HeaderField, string[]> = {
  studentNo: ["학번", "학생번호", "학생 번호"],
  grade: ["학년"],
  classNo: ["반", "학급"],
  number: ["번호", "번"],
  gender: ["성별"],
  name: ["이름", "성명"]
};

export type CourseSelectionSemesterDetection = {
  semester: Semester;
  sheetName?: string;
  subjectCount: number;
  selectedCellCount: number;
  startColumnIndex: number;
  startColumnNumber: number;
  endColumnIndex: number;
  endColumnNumber: number;
};

type CourseSelectionSemesterBlock = {
  semester: Semester;
  key: SemesterKey;
  startColumnIndex: number;
  endColumnIndex: number;
};

type BatchCourseSelectionLayout = {
  labelRowIndex: number;
  subjectRowIndex: number;
  codeRowIndex: number;
  dataStartRowIndex: number;
  columnMap: CourseSelectionColumnMap;
  studentNoColumns: { grade: Semester["grade"]; columnIndex: number }[];
  firstSubjectColumn: number;
  lastSubjectColumn: number;
};

function compactString(value: unknown): string {
  return String(value ?? "").normalize("NFKC").trim().replace(/\s+/g, " ");
}

function normalizeHeader(value: unknown): string {
  return compactString(value).replace(/\s+/g, "");
}

function headerMatches(value: unknown, aliases: readonly string[]): boolean {
  const normalized = normalizeHeader(value);

  return aliases.some((alias) => normalized === normalizeHeader(alias));
}

function matrixWidth(matrix: unknown[][]): number {
  return Math.max(0, ...matrix.map((row) => row.length));
}

function parseSemesterLabel(value: unknown): Semester | undefined {
  return parseSemesterKey(compactString(value));
}

function findBatchSemesterLabelRow(matrix: unknown[][]): number | undefined {
  return matrix.findIndex((row) => {
    const hasSemesterHeader = row.some((cell) => headerMatches(cell, ["학기"]));
    const hasSemesterBlocks = row.some((cell) => parseSemesterLabel(cell));

    return hasSemesterHeader && hasSemesterBlocks;
  });
}

function findBatchSemesterBlocks(
  labelRow: unknown[],
  width: number
): CourseSelectionSemesterBlock[] {
  const starts = labelRow.flatMap((cell, columnIndex) => {
    const semester = parseSemesterLabel(cell);

    return semester
      ? [
          {
            semester,
            key: semesterToKey(semester),
            startColumnIndex: columnIndex
          }
        ]
      : [];
  });

  return starts.map((start, index) => ({
    ...start,
    endColumnIndex:
      (starts[index + 1]?.startColumnIndex ?? width) - 1
  }));
}

function findMarkerRowIndex(
  matrix: unknown[][],
  fromRowIndex: number,
  beforeColumnIndex: number,
  marker: string
): number | undefined {
  for (
    let rowIndex = fromRowIndex + 1;
    rowIndex < Math.min(matrix.length, fromRowIndex + 6);
    rowIndex += 1
  ) {
    const row = matrix[rowIndex] ?? [];

    if (
      row
        .slice(0, beforeColumnIndex)
        .some((cell) => headerMatches(cell, [marker]))
    ) {
      return rowIndex;
    }
  }

  return undefined;
}

function findBatchCourseSelectionLayout(
  matrix: unknown[][],
  target: Semester
): BatchCourseSelectionLayout | undefined {
  const labelRowIndex = findBatchSemesterLabelRow(matrix);

  if (labelRowIndex === undefined || labelRowIndex < 0) {
    return undefined;
  }

  const labelRow = matrix[labelRowIndex] ?? [];
  const blocks = findBatchSemesterBlocks(labelRow, matrixWidth(matrix));
  const targetBlock = blocks.find((block) => block.key === semesterToKey(target));

  if (!targetBlock) {
    throw new Error(`${target.grade}-${target.semester} 수강신청 블록을 찾지 못했습니다.`);
  }

  const subjectRowIndex = findMarkerRowIndex(
    matrix,
    labelRowIndex,
    targetBlock.startColumnIndex,
    "과목"
  );
  const codeRowIndex = findMarkerRowIndex(
    matrix,
    labelRowIndex,
    targetBlock.startColumnIndex,
    "고유번호"
  );
  const nameColumn = labelRow.findIndex((cell) => headerMatches(cell, ["이름", "성명"]));

  if (subjectRowIndex === undefined || codeRowIndex === undefined || nameColumn < 0) {
    throw new Error("수강신청 일괄등록 파일의 학생/과목 헤더를 찾지 못했습니다.");
  }

  const studentNoColumns = labelRow.flatMap((cell, columnIndex) => {
    if (columnIndex >= nameColumn) {
      return [];
    }

    const match = /^([1-3])학년$/.exec(compactString(cell));

    return match
      ? [
          {
            grade: Number(match[1]) as Semester["grade"],
            columnIndex
          }
        ]
      : [];
  });

  return {
    labelRowIndex,
    subjectRowIndex,
    codeRowIndex,
    dataStartRowIndex: codeRowIndex + 1,
    columnMap: {
      name: nameColumn,
      firstSubjectColumn: targetBlock.startColumnIndex
    },
    studentNoColumns,
    firstSubjectColumn: targetBlock.startColumnIndex,
    lastSubjectColumn: targetBlock.endColumnIndex
  };
}

function findHeaderRow(matrix: unknown[][]): {
  headerRowIndex: number;
  columnMap: CourseSelectionColumnMap;
} {
  let best:
    | {
        headerRowIndex: number;
        columnMap: Partial<CourseSelectionColumnMap>;
        score: number;
      }
    | undefined;

  matrix.forEach((row, rowIndex) => {
    const columnMap: Partial<CourseSelectionColumnMap> = {};

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
      (columnMap.name !== undefined ? 4 : 0) +
      (columnMap.studentNo !== undefined ? 3 : 0) +
      (columnMap.grade !== undefined ? 1 : 0) +
      (columnMap.classNo !== undefined ? 1 : 0) +
      (columnMap.number !== undefined ? 1 : 0);

    if (!best || score > best.score) {
      best = { headerRowIndex: rowIndex, columnMap, score };
    }
  });

  if (!best || best.columnMap.name === undefined) {
    throw new Error("수강신청 결과 파일에서 학생 정보 헤더를 찾지 못했습니다.");
  }

  const firstSubjectColumn = Math.max(
    best.columnMap.name,
    best.columnMap.studentNo ?? 0,
    best.columnMap.grade ?? 0,
    best.columnMap.classNo ?? 0,
    best.columnMap.number ?? 0,
    best.columnMap.gender ?? 0
  ) + 1;

  return {
    headerRowIndex: best.headerRowIndex,
    columnMap: {
      ...best.columnMap,
      name: best.columnMap.name,
      firstSubjectColumn
    }
  };
}

function detectTarget(options: ParseCourseSelectionOptions): Semester {
  if (options.target) {
    return options.target;
  }

  if (options.fileName) {
    const detection = detectSemesterFromFileName(options.fileName);

    if (detection.status === "detected") {
      return detection.semester;
    }
  }

  throw new Error("수강신청 결과 파일의 대상 학년·학기를 정하지 못했습니다.");
}

function isSelectedSubjectCell(value: unknown): boolean {
  if (typeof value === "number") {
    return value > 0;
  }

  const normalized = compactString(value).toUpperCase();

  return ["1", "Y", "YES", "O", "○", "TRUE", "선택", "✓"].includes(
    normalized
  );
}

function valueAt(row: unknown[], columnIndex?: number): unknown {
  return columnIndex === undefined ? undefined : row[columnIndex];
}

function createDetectedSubjects(
  matrix: unknown[][],
  headerRowIndex: number,
  columnMap: CourseSelectionColumnMap
): CourseSelectionDetectedSubject[] {
  const headerRow = matrix[headerRowIndex] ?? [];
  const codeRow = headerRowIndex > 0 ? matrix[headerRowIndex - 1] : undefined;
  const subjects: CourseSelectionDetectedSubject[] = [];

  for (
    let columnIndex = columnMap.firstSubjectColumn;
    columnIndex < headerRow.length;
    columnIndex += 1
  ) {
    const subjectName = compactString(headerRow[columnIndex]);

    if (!subjectName) {
      continue;
    }

    subjects.push({
      columnIndex,
      columnNumber: columnIndex + 1,
      subjectName,
      normalizedSubjectName: normalizeSubjectName(subjectName),
      sourceCode: compactString(codeRow?.[columnIndex]) || undefined
    });
  }

  return subjects;
}

function createBatchDetectedSubjects(
  matrix: unknown[][],
  layout: BatchCourseSelectionLayout
): CourseSelectionDetectedSubject[] {
  const subjectRow = matrix[layout.subjectRowIndex] ?? [];
  const codeRow = matrix[layout.codeRowIndex] ?? [];
  const subjects: CourseSelectionDetectedSubject[] = [];

  for (
    let columnIndex = layout.firstSubjectColumn;
    columnIndex <= layout.lastSubjectColumn;
    columnIndex += 1
  ) {
    const subjectName = compactString(subjectRow[columnIndex]);

    if (!subjectName) {
      continue;
    }

    subjects.push({
      columnIndex,
      columnNumber: columnIndex + 1,
      subjectName,
      normalizedSubjectName: normalizeSubjectName(subjectName),
      sourceCode: compactString(codeRow[columnIndex]) || undefined
    });
  }

  return subjects;
}

function parseStudentNoParts(studentNo: string):
  | {
      grade: string;
      classNo: string;
      number: string;
    }
  | undefined {
  const match = /^([1-3])(\d{2})(\d{2})$/.exec(studentNo);

  if (!match) {
    return undefined;
  }

  return {
    grade: match[1] ?? "",
    classNo: String(Number(match[2])),
    number: String(Number(match[3]))
  };
}

function studentNoFromBatchRow(
  row: unknown[],
  studentNoColumns: BatchCourseSelectionLayout["studentNoColumns"]
): { studentNo: string; grade?: string } {
  for (const column of studentNoColumns) {
    const studentNo = compactString(row[column.columnIndex]);

    if (studentNo && studentNo !== "0") {
      return { studentNo, grade: String(column.grade) };
    }
  }

  return { studentNo: "" };
}

function createParsedRowId(
  semesterImportId: string,
  rowNumber: number,
  columnNumber: number
): string {
  return `${semesterImportId}-row-${rowNumber}-col-${columnNumber}`;
}

function parseBatchCourseSelectionWorkbook(
  matrix: unknown[][],
  sheetName: string,
  target: Semester,
  layout: BatchCourseSelectionLayout,
  options: ParseCourseSelectionOptions
): CourseSelectionParseResult {
  const detectedSubjects = createBatchDetectedSubjects(matrix, layout);
  const rows: ParsedCourseSelectionRow[] = [];
  const failedRows: CourseSelectionParseIssue[] = [];
  const previewRows: CourseSelectionPreviewRow[] = [];

  matrix.slice(layout.dataStartRowIndex).forEach((row, offset) => {
    const rowNumber = layout.dataStartRowIndex + offset + 1;
    const sourceStudentNo = studentNoFromBatchRow(row, layout.studentNoColumns);
    const studentName = compactString(valueAt(row, layout.columnMap.name));
    const studentNoParts = parseStudentNoParts(sourceStudentNo.studentNo);
    const classNo = studentNoParts?.classNo ?? "";
    const number = studentNoParts?.number ?? "";
    const studentNo = sourceStudentNo.studentNo;
    const studentId =
      createStudentAuxiliaryKey({
        grade: studentNoParts?.grade ?? sourceStudentNo.grade,
        studentNo: sourceStudentNo.studentNo,
        name: studentName,
        classNo,
        number
      }) || `student-row-${rowNumber}`;
    const issueMessages: string[] = [];

    if (!studentName) {
      issueMessages.push("학생 이름을 찾지 못했습니다.");
    }

    if (!studentNo) {
      issueMessages.push("학번을 찾지 못했습니다.");
    }

    if (issueMessages.length > 0) {
      const message = issueMessages.join(" ");
      failedRows.push({ rowNumber, message, rawValues: row });
      previewRows.push({
        rowNumber,
        studentKey: studentId,
        studentName,
        classNo,
        number,
        message
      });
      return;
    }

    let selectedSubjectCount = 0;

    for (const subject of detectedSubjects) {
      if (!isSelectedSubjectCell(row[subject.columnIndex])) {
        continue;
      }

      selectedSubjectCount += 1;
      rows.push({
        id: createParsedRowId(
          options.semesterImportId,
          rowNumber,
          subject.columnNumber
        ),
        semesterImportId: options.semesterImportId,
        studentId,
        studentNo,
        studentName,
        classNo: classNo || undefined,
        number: number || undefined,
        target,
        subjectName: subject.subjectName,
        normalizedSubjectName: subject.normalizedSubjectName,
        sourceLocation: {
          fileName: options.fileName,
          sheetName,
          rowNumber,
          columnNumber: subject.columnNumber,
          cellAddress: utils.encode_cell({
            r: rowNumber - 1,
            c: subject.columnIndex
          }),
          fieldName: subject.subjectName
        }
      });
    }

    previewRows.push({
      rowNumber,
      studentKey: studentId,
      studentName,
      classNo,
      number,
      selectedSubjectCount
    });
  });

  return {
    semesterImportId: options.semesterImportId,
    fileName: options.fileName,
    sheetName,
    target,
    headerRowNumber: layout.labelRowIndex + 1,
    columnMap: layout.columnMap,
    detectedSubjects,
    rows,
    failedRows,
    previewRows
  };
}

function detectBatchCourseSelectionSemestersFromSheet(
  workbook: WorkBook,
  sheetName: string
): CourseSelectionSemesterDetection[] {
  if (!workbook.Sheets[sheetName]) {
    return [];
  }

  const matrix = utils.sheet_to_json<unknown[]>(workbook.Sheets[sheetName], {
    header: 1,
    blankrows: false,
    defval: ""
  });
  const labelRowIndex = findBatchSemesterLabelRow(matrix);

  if (labelRowIndex === undefined || labelRowIndex < 0) {
    return [];
  }

  const labelRow = matrix[labelRowIndex] ?? [];
  const blocks = findBatchSemesterBlocks(labelRow, matrixWidth(matrix));
  const firstBlock = blocks[0];

  if (!firstBlock) {
    return [];
  }

  const subjectRowIndex = findMarkerRowIndex(
    matrix,
    labelRowIndex,
    firstBlock.startColumnIndex,
    "과목"
  );

  if (subjectRowIndex === undefined) {
    return [];
  }

  return blocks.flatMap((block) => {
    const subjectCount = (matrix[subjectRowIndex] ?? [])
      .slice(block.startColumnIndex, block.endColumnIndex + 1)
      .filter((cell) => compactString(cell)).length;

    if (subjectCount === 0) {
      return [];
    }

    const selectedCellCount = matrix.slice(subjectRowIndex + 2).reduce(
      (total, row) =>
        total +
        row
          .slice(block.startColumnIndex, block.endColumnIndex + 1)
          .filter(isSelectedSubjectCell).length,
      0
    );

    return [
      {
        semester: block.semester,
        sheetName,
        subjectCount,
        selectedCellCount,
        startColumnIndex: block.startColumnIndex,
        startColumnNumber: block.startColumnIndex + 1,
        endColumnIndex: block.endColumnIndex,
        endColumnNumber: block.endColumnIndex + 1
      }
    ];
  });
}

function detectCourseSelectionSemesterSheet(
  workbook: WorkBook,
  sheetName: string
): CourseSelectionSemesterDetection[] {
  const sheet = workbook.Sheets[sheetName];
  const detection = detectSemesterFromFileName(sheetName);

  if (!sheet || detection.status !== "detected") {
    return [];
  }

  const matrix = utils.sheet_to_json<unknown[]>(sheet, {
    header: 1,
    blankrows: false,
    defval: ""
  });

  try {
    const { headerRowIndex, columnMap } = findHeaderRow(matrix);
    const detectedSubjects = createDetectedSubjects(
      matrix,
      headerRowIndex,
      columnMap
    );
    const firstSubject = detectedSubjects[0];
    const lastSubject = detectedSubjects[detectedSubjects.length - 1];

    if (!firstSubject || !lastSubject) {
      return [];
    }

    const selectedCellCount = matrix
      .slice(headerRowIndex + 1)
      .reduce(
        (total, row) =>
          total +
          detectedSubjects.filter((subject) =>
            isSelectedSubjectCell(row[subject.columnIndex])
          ).length,
        0
      );

    return [
      {
        semester: detection.semester,
        sheetName,
        subjectCount: detectedSubjects.length,
        selectedCellCount,
        startColumnIndex: firstSubject.columnIndex,
        startColumnNumber: firstSubject.columnNumber,
        endColumnIndex: lastSubject.columnIndex,
        endColumnNumber: lastSubject.columnNumber
      }
    ];
  } catch {
    return [];
  }
}

export function detectCourseSelectionSemestersFromWorkbook(
  workbook: WorkBook,
  sheetName?: string
): CourseSelectionSemesterDetection[] {
  const targetSheetName = sheetName ?? workbook.SheetNames[0];

  if (!targetSheetName) {
    return [];
  }

  const batchDetections = detectBatchCourseSelectionSemestersFromSheet(
    workbook,
    targetSheetName
  );

  if (batchDetections.length > 0) {
    return batchDetections;
  }

  if (sheetName) {
    return detectCourseSelectionSemesterSheet(workbook, targetSheetName);
  }

  return workbook.SheetNames.flatMap((name) =>
    detectCourseSelectionSemesterSheet(workbook, name)
  );
}

export function parseCourseSelectionWorkbook(
  workbook: WorkBook,
  options: ParseCourseSelectionOptions
): CourseSelectionParseResult {
  const sheetName = options.sheetName ?? workbook.SheetNames[0];

  if (!sheetName || !workbook.Sheets[sheetName]) {
    throw new Error("수강신청 결과 파일에서 읽을 수 있는 시트를 찾지 못했습니다.");
  }

  const target = detectTarget(options);
  const matrix = utils.sheet_to_json<unknown[]>(workbook.Sheets[sheetName], {
    header: 1,
    blankrows: false,
    defval: ""
  });
  const batchLayout = findBatchCourseSelectionLayout(matrix, target);

  if (batchLayout) {
    return parseBatchCourseSelectionWorkbook(
      matrix,
      sheetName,
      target,
      batchLayout,
      options
    );
  }

  const { headerRowIndex, columnMap } = findHeaderRow(matrix);
  const detectedSubjects = createDetectedSubjects(matrix, headerRowIndex, columnMap);
  const rows: ParsedCourseSelectionRow[] = [];
  const failedRows: CourseSelectionParseIssue[] = [];
  const previewRows: CourseSelectionPreviewRow[] = [];

  matrix.slice(headerRowIndex + 1).forEach((row, offset) => {
    const rowNumber = headerRowIndex + offset + 2;
    const sourceStudentNo = compactString(valueAt(row, columnMap.studentNo));
    const studentName = compactString(valueAt(row, columnMap.name));
    const studentNoParts = parseStudentNoParts(sourceStudentNo);
    const grade =
      compactString(valueAt(row, columnMap.grade)) ||
      studentNoParts?.grade ||
      target.grade;
    const classNo =
      compactString(valueAt(row, columnMap.classNo)) ||
      studentNoParts?.classNo ||
      "";
    const number =
      compactString(valueAt(row, columnMap.number)) ||
      studentNoParts?.number ||
      "";
    const gender = compactString(valueAt(row, columnMap.gender));
    const generatedStudentNo = createGeneratedStudentNo({
      grade,
      classNo,
      number
    });
    const studentNo = generatedStudentNo || sourceStudentNo;
    const studentId =
      createStudentAuxiliaryKey({
        grade,
        studentNo: sourceStudentNo,
        name: studentName,
        classNo,
        number
      }) || `student-row-${rowNumber}`;
    const issueMessages: string[] = [];

    if (!studentName) {
      issueMessages.push("학생 이름을 찾지 못했습니다.");
    }

    if (!studentNo) {
      issueMessages.push("학번을 찾지 못했습니다.");
    }

    if (issueMessages.length > 0) {
      const message = issueMessages.join(" ");
      failedRows.push({ rowNumber, message, rawValues: row });
      previewRows.push({
        rowNumber,
        studentKey: studentId,
        studentName,
        classNo,
        number,
        message
      });
      return;
    }

    let selectedSubjectCount = 0;

    for (const subject of detectedSubjects) {
      if (!isSelectedSubjectCell(row[subject.columnIndex])) {
        continue;
      }

      selectedSubjectCount += 1;
      rows.push({
        id: createParsedRowId(
          options.semesterImportId,
          rowNumber,
          subject.columnNumber
        ),
        semesterImportId: options.semesterImportId,
        studentId,
        studentNo,
        studentName,
        classNo: classNo || undefined,
        number: number || undefined,
        gender: gender || undefined,
        target,
        subjectName: subject.subjectName,
        normalizedSubjectName: subject.normalizedSubjectName,
        sourceLocation: {
          fileName: options.fileName,
          sheetName,
          rowNumber,
          columnNumber: subject.columnNumber,
          cellAddress: utils.encode_cell({
            r: rowNumber - 1,
            c: subject.columnIndex
          }),
          fieldName: subject.subjectName
        }
      });
    }

    previewRows.push({
      rowNumber,
      studentKey: studentId,
      studentName,
      classNo,
      number,
      selectedSubjectCount
    });
  });

  return {
    semesterImportId: options.semesterImportId,
    fileName: options.fileName,
    sheetName,
    target,
    headerRowNumber: headerRowIndex + 1,
    columnMap,
    detectedSubjects,
    rows,
    failedRows,
    previewRows
  };
}

export async function parseCourseSelectionFile(
  file: File,
  options: Omit<ParseCourseSelectionOptions, "fileName">
): Promise<CourseSelectionParseResult> {
  const workbook = await readWorkbookFromFile(file);

  return parseCourseSelectionWorkbook(workbook, {
    ...options,
    fileName: file.name
  });
}
