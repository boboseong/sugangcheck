import { utils, write, type WorkBook } from "xlsx";
import type { ValidationError } from "../types/validation";
import { validationRuleLabel } from "../utils/validationRuleLabels";

export const validationErrorListFileName = "검증오류_명렬.xlsx";

function validationErrorRows(errors: readonly ValidationError[]): unknown[][] {
  return errors.map((error, index) => [
    index + 1,
    validationRuleLabel(error.type),
    error.studentNo,
    error.studentName,
    error.semester?.grade ?? "",
    error.semester?.semester ?? "",
    error.message,
    (error.relatedSubjectNames ?? []).join(", "),
    error.relatedRecordIds.join(", "),
    error.fixHint ?? ""
  ]);
}

export function createValidationErrorListWorkbook(
  errors: readonly ValidationError[]
): WorkBook {
  const workbook = utils.book_new();
  const sheet = utils.aoa_to_sheet([
    [
      "번호",
      "유형",
      "학번",
      "학생명",
      "학년",
      "학기",
      "오류 메시지",
      "관련 과목",
      "관련 기록",
      "수정 안내"
    ],
    ...validationErrorRows(errors)
  ]);

  sheet["!cols"] = [8, 24, 14, 16, 8, 8, 48, 28, 28, 40].map((wch) => ({
    wch
  }));
  utils.book_append_sheet(workbook, sheet, "오류명렬");

  return workbook;
}

export function exportValidationErrorsXlsx(
  errors: readonly ValidationError[]
): Blob {
  const buffer = write(createValidationErrorListWorkbook(errors), {
    bookType: "xlsx",
    type: "array"
  }) as ArrayBuffer;

  return new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  });
}
