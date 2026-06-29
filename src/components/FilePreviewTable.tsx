import type { WorkbookPreviewTable } from "../parsers/readWorkbook";

type FilePreviewTableProps = {
  preview?: WorkbookPreviewTable;
};

function renderCellValue(value: unknown): string {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  if (typeof value === "number") {
    return Number.isInteger(value) ? String(value) : value.toFixed(3);
  }

  return String(value);
}

export function FilePreviewTable({ preview }: FilePreviewTableProps) {
  if (!preview) {
    return (
      <div className="empty-panel">
        <p>선택한 파일의 미리보기가 여기에 표시됩니다.</p>
      </div>
    );
  }

  if (preview.columns.length === 0 || preview.rows.length === 0) {
    return (
      <div className="empty-panel">
        <p>미리볼 행이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="preview-table-wrap">
      <div className="preview-table-meta">
        <strong>{preview.sheetName}</strong>
        <span>
          {preview.rows.length.toLocaleString()} / {preview.totalRows.toLocaleString()}행
        </span>
      </div>
      <table className="placeholder-table preview-table">
        <thead>
          <tr>
            {preview.columns.map((column) => (
              <th key={column.key}>{column.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {preview.rows.map((row) => (
            <tr key={String(row.__rowNumber)}>
              {preview.columns.map((column) => (
                <td key={column.key}>{renderCellValue(row[column.key])}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
