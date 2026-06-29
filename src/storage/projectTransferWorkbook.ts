import { read, utils, write, type WorkBook } from "xlsx";
import type {
  ProjectTransferSection
} from "../state/projectTransfer";
import type { ProjectFile, ProjectState } from "../types/project";

export type ProjectTransferWorkbookId =
  | ProjectTransferSection
  | "validationResults";

export type ProjectTransferWorkbookData = {
  workbookId: ProjectTransferWorkbookId;
  fields: Partial<ProjectState>;
};

const appDataSheetName = "앱데이터";
const excelCellTextLimit = 32767;
const appDataChunkSize = 30000;
const previewTextLimit = 30000;

const workbookLabels: Record<ProjectTransferWorkbookId, string> = {
  operatingSubjects: "운영과목",
  courseSelections: "수강신청",
  externalCourses: "전입외부이수",
  validationRules: "검증규칙",
  validationResults: "검증결과"
};

const fieldLabels: Partial<Record<keyof ProjectState, string>> = {
  importStatuses: "불러오기상태",
  subjectMasterVersion: "과목마스터버전",
  subjectMasterItems: "과목마스터",
  operatingSubjects: "운영과목",
  subjectOverrides: "과목보정",
  students: "학생목록",
  studentSemesterPresence: "학기별존재",
  courseSelectionRows: "수강신청행",
  externalCourseInputs: "전입외부이수",
  validationRuleSettings: "검증규칙설정",
  prerequisiteRules: "위계규칙",
  detailedConstraintRules: "세부제약",
  validationErrors: "검증오류",
  courseSelectionRecords: "정규화수강",
  dataPreparationStatus: "데이터준비상태",
  lastValidationResult: "최근검증결과"
};

const workbookFields: Record<ProjectTransferWorkbookId, readonly (keyof ProjectState)[]> =
  {
    operatingSubjects: [
      "importStatuses",
      "subjectMasterVersion",
      "subjectMasterItems",
      "operatingSubjects",
      "subjectOverrides"
    ],
    courseSelections: [
      "importStatuses",
      "students",
      "studentSemesterPresence",
      "courseSelectionRows"
    ],
    externalCourses: ["externalCourseInputs"],
    validationRules: [
      "validationRuleSettings",
      "prerequisiteRules",
      "detailedConstraintRules"
    ],
    validationResults: [
      "validationErrors",
      "courseSelectionRecords",
      "dataPreparationStatus",
      "lastValidationResult"
    ]
  };

function isImportStatusForWorkbook(
  workbookId: ProjectTransferWorkbookId,
  status: unknown
): boolean {
  if (
    typeof status !== "object" ||
    status === null ||
    !("sourceType" in status)
  ) {
    return false;
  }

  if (workbookId === "operatingSubjects") {
    return status.sourceType === "operatingSubjects";
  }

  if (workbookId === "courseSelections") {
    return status.sourceType === "courseSelections";
  }

  return true;
}

function valueForWorkbookField(
  projectState: ProjectState,
  workbookId: ProjectTransferWorkbookId,
  field: keyof ProjectState
): unknown {
  const value = projectState[field];

  if (field === "importStatuses" && Array.isArray(value)) {
    return value.filter((status) => isImportStatusForWorkbook(workbookId, status));
  }

  return value;
}

function fieldDisplayName(field: keyof ProjectState): string {
  return fieldLabels[field] ?? String(field);
}

function countValue(value: unknown): string {
  if (Array.isArray(value)) {
    return value.length.toLocaleString();
  }

  if (value === undefined) {
    return "0";
  }

  return "1";
}

function truncateExcelText(value: string): string {
  if (value.length <= previewTextLimit) {
    return value;
  }

  return `${value.slice(0, previewTextLimit)}... [미리보기 생략: ${value.length.toLocaleString()}자]`;
}

function splitJsonForExcel(value: unknown): string[] {
  const json = JSON.stringify(value);
  const chunks: string[] = [];

  for (let index = 0; index < json.length; index += appDataChunkSize) {
    chunks.push(json.slice(index, index + appDataChunkSize));
  }

  return chunks.length > 0 ? chunks : [""];
}

function flattenPreviewValue(value: unknown): unknown {
  if (value === undefined || value === null) {
    return "";
  }

  if (typeof value === "object") {
    return truncateExcelText(JSON.stringify(value));
  }

  if (typeof value === "string") {
    return truncateExcelText(value);
  }

  return value;
}

function flattenPreviewRow(row: unknown): Record<string, unknown> {
  if (typeof row !== "object" || row === null) {
    return { value: flattenPreviewValue(row) };
  }

  return Object.fromEntries(
    Object.entries(row).map(([key, value]) => [key, flattenPreviewValue(value)])
  );
}

function addJsonArrayPreviewSheet(
  workbook: WorkBook,
  field: keyof ProjectState,
  value: unknown
) {
  if (!Array.isArray(value)) {
    return;
  }

  const rows =
    value.length > 0
      ? value.map(flattenPreviewRow)
      : [{ 안내: "데이터가 없습니다." }];
  const sheet = utils.json_to_sheet(rows);

  utils.book_append_sheet(workbook, sheet, fieldDisplayName(field).slice(0, 31));
}

function addObjectPreviewSheet(
  workbook: WorkBook,
  field: keyof ProjectState,
  value: unknown
) {
  if (
    value === undefined ||
    value === null ||
    Array.isArray(value) ||
    typeof value !== "object"
  ) {
    return;
  }

  const rows = Object.entries(value).map(([key, entryValue]) => ({
    key,
    value: flattenPreviewValue(entryValue)
  }));

  utils.book_append_sheet(
    workbook,
    utils.json_to_sheet(rows),
    fieldDisplayName(field).slice(0, 31)
  );
}

export function projectTransferWorkbookFileName(
  workbookId: ProjectTransferWorkbookId
): string {
  return `${workbookLabels[workbookId]}.xlsx`;
}

function createAppDataRows(input: {
  projectFile: ProjectFile;
  workbookId: ProjectTransferWorkbookId;
}) {
  return workbookFields[input.workbookId].flatMap((field) => {
    const value = valueForWorkbookField(
      input.projectFile.data,
      input.workbookId,
      field
    );

    if (value === undefined) {
      return [
        {
          field,
          label: fieldDisplayName(field),
          count: countValue(value),
          isUndefined: "true",
          chunkIndex: 0,
          chunkCount: 1,
          jsonChunk: ""
        }
      ];
    }

    const chunks = splitJsonForExcel(value);

    return chunks.map((chunk, index) => {
      if (chunk.length > excelCellTextLimit) {
        throw new Error("xlsx 셀 텍스트 제한을 초과했습니다.");
      }

      return {
        field,
        label: fieldDisplayName(field),
        count: countValue(value),
        isUndefined: "false",
        chunkIndex: index,
        chunkCount: chunks.length,
        jsonChunk: chunk
      };
    });
  });
}

export function createProjectTransferWorkbook(input: {
  projectFile: ProjectFile;
  workbookId: ProjectTransferWorkbookId;
}): WorkBook {
  const workbook = utils.book_new();
  const fields = workbookFields[input.workbookId];
  const summaryRows = [
    ["항목", workbookLabels[input.workbookId]],
    ["프로젝트", input.projectFile.projectName],
    ["저장일", input.projectFile.savedAt],
    ["앱 버전", input.projectFile.appVersion],
    ["스키마 버전", input.projectFile.schemaVersion]
  ];

  utils.book_append_sheet(workbook, utils.aoa_to_sheet(summaryRows), "요약");

  utils.book_append_sheet(
    workbook,
    utils.json_to_sheet(createAppDataRows(input)),
    appDataSheetName
  );

  fields.forEach((field) => {
    const value = valueForWorkbookField(
      input.projectFile.data,
      input.workbookId,
      field
    );

    addJsonArrayPreviewSheet(workbook, field, value);
    addObjectPreviewSheet(workbook, field, value);
  });

  return workbook;
}

export function createProjectTransferWorkbookBuffer(input: {
  projectFile: ProjectFile;
  workbookId: ProjectTransferWorkbookId;
}): ArrayBuffer {
  return write(createProjectTransferWorkbook(input), {
    bookType: "xlsx",
    type: "array"
  }) as ArrayBuffer;
}

export function parseProjectTransferWorkbook(
  buffer: ArrayBuffer,
  workbookId: ProjectTransferWorkbookId
): ProjectTransferWorkbookData {
  const workbook = read(buffer, { type: "array", cellDates: true });
  const appDataSheet = workbook.Sheets[appDataSheetName];

  if (!appDataSheet) {
    throw new Error(`${workbookLabels[workbookId]} 파일에 앱데이터 시트가 없습니다.`);
  }

  const rows = utils.sheet_to_json<Record<string, unknown>>(appDataSheet, {
    defval: ""
  });
  const fields: Partial<ProjectState> = {};
  const rowsByField = new Map<keyof ProjectState, Record<string, unknown>[]>();

  rows.forEach((row) => {
    const field = String(row.field ?? "") as keyof ProjectState;

    if (!field || !workbookFields[workbookId].includes(field)) {
      return;
    }

    rowsByField.set(field, [...(rowsByField.get(field) ?? []), row]);
  });

  rowsByField.forEach((fieldRows, field) => {
    try {
      const sortedRows = [...fieldRows].sort(
        (left, right) =>
          Number(left.chunkIndex || 0) - Number(right.chunkIndex || 0)
      );
      const parsedValue =
        sortedRows.some((row) => String(row.isUndefined ?? "") === "true")
          ? undefined
          : JSON.parse(
              sortedRows
                .map((row) =>
                  "jsonChunk" in row ? String(row.jsonChunk ?? "") : String(row.json ?? "")
                )
                .join("")
            );

      fields[field] = parsedValue;
    } catch {
      throw new Error(`${workbookLabels[workbookId]} 파일의 ${field} 값을 읽지 못했습니다.`);
    }
  });

  return { workbookId, fields };
}
