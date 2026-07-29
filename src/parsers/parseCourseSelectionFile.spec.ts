import { describe, expect, it } from "vitest";
import { utils } from "@e965/xlsx";
import { parseCourseSelectionWorkbook } from "./parseCourseSelectionFile";

function workbookFrom(rows: unknown[][], sheetName: string) {
  const workbook = utils.book_new();

  utils.book_append_sheet(workbook, utils.aoa_to_sheet(rows), sheetName);

  return workbook;
}

describe("parseCourseSelectionWorkbook", () => {
  it("accepts a row without a name when the student number is present", () => {
    const workbook = workbookFrom(
      [
        ["학번", "이름", "확률과 통계", "미적분"],
        ["20101", "", 1, ""],
        ["20102", "김학생", "", 1]
      ],
      "2-1"
    );

    const result = parseCourseSelectionWorkbook(workbook, {
      semesterImportId: "courseSelection-2-1",
      target: { grade: 2, semester: 1 }
    });

    expect(result.failedRows).toHaveLength(0);
    expect(result.students).toHaveLength(2);
    expect(result.students[0]).toEqual(
      expect.objectContaining({ studentNo: "20101", studentName: "20101" })
    );
    expect(result.students[1]).toEqual(
      expect.objectContaining({ studentNo: "20102", studentName: "김학생" })
    );
    expect(
      result.rows.filter((row) => row.studentNo === "20101")
    ).toEqual([
      expect.objectContaining({
        studentName: "20101",
        subjectName: "확률과 통계"
      })
    ]);
  });

  it("reads a sheet whose only student column is the student number", () => {
    const workbook = workbookFrom(
      [
        ["학번", "확률과 통계"],
        ["20101", 1]
      ],
      "2-1"
    );

    const result = parseCourseSelectionWorkbook(workbook, {
      semesterImportId: "courseSelection-2-1",
      target: { grade: 2, semester: 1 }
    });

    expect(result.failedRows).toHaveLength(0);
    expect(result.students).toEqual([
      expect.objectContaining({ studentNo: "20101", studentName: "20101" })
    ]);
    expect(result.detectedSubjects.map((subject) => subject.subjectName)).toEqual([
      "확률과 통계"
    ]);
  });

  it("still fails a row that has neither a name nor a student number", () => {
    const workbook = workbookFrom(
      [
        ["학번", "이름", "확률과 통계"],
        ["", "", 1]
      ],
      "2-1"
    );

    const result = parseCourseSelectionWorkbook(workbook, {
      semesterImportId: "courseSelection-2-1",
      target: { grade: 2, semester: 1 }
    });

    expect(result.students).toHaveLength(0);
    expect(result.failedRows).toEqual([
      expect.objectContaining({
        rowNumber: 2,
        message: "학생 이름을 찾지 못했습니다. 학번을 찾지 못했습니다."
      })
    ]);
  });

  it("falls back to the student number in the batch registration layout", () => {
    const workbook = workbookFrom(
      [
        ["학기", "1학년", "2학년", "이름", "2-1", "2-2"],
        ["", "", "", "과목", "확률과 통계", "미적분"],
        ["", "", "", "고유번호", "9001", "9002"],
        ["", "", "20101", "", 1, ""]
      ],
      "일괄등록"
    );

    const result = parseCourseSelectionWorkbook(workbook, {
      semesterImportId: "courseSelection-2-1",
      target: { grade: 2, semester: 1 }
    });

    expect(result.failedRows).toHaveLength(0);
    expect(result.students).toEqual([
      expect.objectContaining({ studentNo: "20101", studentName: "20101" })
    ]);
  });
});
