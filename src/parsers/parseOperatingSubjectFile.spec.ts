import { describe, expect, it } from "vitest";
import { utils } from "@e965/xlsx";
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
        choiceGroup: "학생필수",
        masterMatchStatus: "unmatched"
      })
    );
  });

  it("keeps app-template choice group separate from group type", () => {
    const workbook = utils.book_new();
    const sheet = utils.aoa_to_sheet([
      [
        "학년",
        "학기",
        "교과목",
        "선택군",
        "운영학점",
        "교과(군)",
        "선택구분",
        "과목구분"
      ],
      [2, 1, "물리학", "학생선택B", 3, "과학", "진로", "보통교과"]
    ]);

    utils.book_append_sheet(workbook, sheet, "운영과목");

    const result = parseOperatingSubjectWorkbook(workbook, {
      semesterImportId: "operatingSubjects-2-1",
      target: { grade: 2, semester: 1 },
      masterItems: []
    });

    expect(result.failedRows).toHaveLength(0);
    expect(result.subjects[0]).toMatchObject({
      subjectName: "물리학",
      choiceGroup: "학생선택B",
      groupType: "보통교과"
    });
  });
});
