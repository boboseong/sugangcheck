import { describe, expect, it } from "vitest";
import { utils } from "xlsx";
import { missingOperatingSubjectInfoLabel } from "../types/subject";
import { parseOperatingSubjectWorkbook } from "./parseOperatingSubjectFile";

describe("parseOperatingSubjectWorkbook", () => {
  it("keeps unmatched subjects even when classification fields are not entered", () => {
    const workbook = utils.book_new();
    const sheet = utils.aoa_to_sheet([
      ["교과목", "운영학점"],
      ["새 과목", 2]
    ]);

    utils.book_append_sheet(workbook, sheet, "운영과목");

    const result = parseOperatingSubjectWorkbook(workbook, {
      semesterImportId: "operatingSubjects-1-1",
      target: { grade: 1, semester: 1 },
      masterItems: []
    });

    expect(result.failedRows).toHaveLength(0);
    expect(result.subjects).toHaveLength(1);
    expect(result.subjects[0]).toEqual(
      expect.objectContaining({
        subjectName: "새 과목",
        subjectGroup: missingOperatingSubjectInfoLabel,
        selectionType: missingOperatingSubjectInfoLabel,
        groupType: missingOperatingSubjectInfoLabel,
        masterMatchStatus: "unmatched"
      })
    );
  });
});
