import type { ValidationError } from "../types/validation";

function csvCell(value: unknown): string {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export function exportValidationErrorsCsv(errors: readonly ValidationError[]): string {
  const header = [
    "type",
    "studentNo",
    "studentName",
    "semester",
    "message",
    "relatedRecordIds",
    "fixHint"
  ];
  const rows = errors.map((error) => [
    error.type,
    error.studentNo,
    error.studentName,
    error.semester
      ? `${error.semester.grade}-${error.semester.semester}`
      : "",
    error.message,
    error.relatedRecordIds.join("|"),
    error.fixHint ?? ""
  ]);

  return [header, ...rows].map((row) => row.map(csvCell).join(",")).join("\n");
}
