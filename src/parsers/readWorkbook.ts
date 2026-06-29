import { read, utils, type WorkBook } from "xlsx";

export const allowedWorkbookExtensions = new Set(["xls", "xlsx", "xlsm"]);

export type WorkbookPreviewColumn = {
  key: string;
  label: string;
};

export type WorkbookPreviewTable = {
  sheetName: string;
  columns: WorkbookPreviewColumn[];
  rows: Record<string, unknown>[];
  totalRows: number;
};

export function getWorkbookFileExtension(fileName: string): string | undefined {
  return fileName.split(".").pop()?.toLowerCase();
}

export function isAllowedWorkbookFile(fileName: string): boolean {
  const extension = getWorkbookFileExtension(fileName);

  return Boolean(extension && allowedWorkbookExtensions.has(extension));
}

export function assertAllowedWorkbookFile(fileName: string): void {
  if (!isAllowedWorkbookFile(fileName)) {
    throw new Error("지원하는 엑셀 파일 형식은 .xls, .xlsx, .xlsm입니다.");
  }
}

export async function readWorkbookFromFile(file: File): Promise<WorkBook> {
  assertAllowedWorkbookFile(file.name);

  const data = await file.arrayBuffer();

  return read(data, {
    type: "array",
    cellDates: true,
    cellStyles: false
  });
}

function cellPreviewValue(value: unknown): unknown {
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }

  return value;
}

function columnLabel(index: number): string {
  let label = "";
  let value = index + 1;

  while (value > 0) {
    const remainder = (value - 1) % 26;
    label = String.fromCharCode(65 + remainder) + label;
    value = Math.floor((value - 1) / 26);
  }

  return label;
}

export function workbookToPreviewTable(
  workbook: WorkBook,
  options: {
    sheetName?: string;
    maxRows?: number;
    maxColumns?: number;
  } = {}
): WorkbookPreviewTable {
  const sheetName = options.sheetName ?? workbook.SheetNames[0];

  if (!sheetName) {
    return { sheetName: "", columns: [], rows: [], totalRows: 0 };
  }

  const sheet = workbook.Sheets[sheetName];

  if (!sheet) {
    return { sheetName, columns: [], rows: [], totalRows: 0 };
  }

  const matrix = utils.sheet_to_json<unknown[]>(sheet, {
    header: 1,
    blankrows: false,
    defval: ""
  });
  const maxRows = options.maxRows ?? 10;
  const maxColumns = options.maxColumns ?? 12;
  const width = Math.min(
    maxColumns,
    Math.max(0, ...matrix.map((row) => row.length))
  );
  const columns: WorkbookPreviewColumn[] = [
    { key: "__rowNumber", label: "행" },
    ...Array.from({ length: width }, (_, index) => ({
      key: `col-${index}`,
      label: columnLabel(index)
    }))
  ];
  const rows = matrix.slice(0, maxRows).map((row, rowIndex) => {
    const previewRow: Record<string, unknown> = { __rowNumber: rowIndex + 1 };

    for (let columnIndex = 0; columnIndex < width; columnIndex += 1) {
      previewRow[`col-${columnIndex}`] = cellPreviewValue(row[columnIndex]);
    }

    return previewRow;
  });

  return {
    sheetName,
    columns,
    rows,
    totalRows: matrix.length
  };
}
