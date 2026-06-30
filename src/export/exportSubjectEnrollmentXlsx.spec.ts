import { utils } from "xlsx";
import { describe, expect, it } from "vitest";
import { normalizeSubjectName } from "../normalizers/normalizeSubjectName";
import type { ParsedCourseSelectionRow } from "../types/courseSelection";
import type { OperatingSubject } from "../types/subject";
import { buildSubjectEnrollmentSummaries } from "../analytics/subjectEnrollment";
import {
  createSubjectEnrollmentStudentListWorkbook,
  createSubjectEnrollmentWorkbook,
  subjectEnrollmentStudentListFileName
} from "./exportSubjectEnrollmentXlsx";

function courseRow(id: string, studentNo: string): ParsedCourseSelectionRow {
  return {
    id,
    semesterImportId: "course-2-1",
    studentId: studentNo,
    studentNo,
    studentName: `학생${studentNo}`,
    target: { grade: 2, semester: 1 },
    subjectName: "정보",
    normalizedSubjectName: normalizeSubjectName("정보")
  };
}

const operatingSubject: OperatingSubject = {
  id: "subject-info",
  target: { grade: 2, semester: 1 },
  subjectName: "정보",
  normalizedSubjectName: normalizeSubjectName("정보"),
  subjectGroup: "기술·가정/정보",
  selectionType: "일반",
  groupType: "보통교과",
  credits: 2,
  masterMatchStatus: "matched"
};

describe("subject enrollment export", () => {
  it("creates subject-group sheets with safe names", () => {
    const summaries = buildSubjectEnrollmentSummaries(
      [courseRow("row-1", "20101"), courseRow("row-2", "20102")],
      [operatingSubject]
    );
    const workbook = createSubjectEnrollmentWorkbook(summaries, "subjectGroup");
    const sheetName = workbook.SheetNames[0] ?? "";
    const rows = utils.sheet_to_json<unknown[]>(workbook.Sheets[sheetName]!, {
      header: 1
    });

    expect(sheetName).toBe("기술·가정·정보");
    expect(rows[0]).toContain("신청 학생 수");
    expect(rows[0]).not.toContain("원천 행 수");
    expect(rows[0]).not.toContain("중복 행 수");
    expect(rows[1]).toContain(2);
    expect(rows[1]).toContain("운영과목");
  });

  it("creates one sheet for all data", () => {
    const summaries = buildSubjectEnrollmentSummaries(
      [courseRow("row-1", "20101")],
      [operatingSubject]
    );
    const workbook = createSubjectEnrollmentWorkbook(summaries, "all");

    expect(workbook.SheetNames).toEqual(["전체자료"]);
  });

  it("creates a workbook and file name for one subject's student list", () => {
    const summary = buildSubjectEnrollmentSummaries(
      [courseRow("row-1", "20101"), courseRow("row-2", "20102")],
      [operatingSubject]
    )[0]!;
    const workbook = createSubjectEnrollmentStudentListWorkbook(summary);
    const rows = utils.sheet_to_json<unknown[]>(
      workbook.Sheets["학생명렬"]!,
      {
        header: 1
      }
    );

    expect(subjectEnrollmentStudentListFileName(summary)).toBe(
      "과목별수강생_학생명렬_2학년_1학기_정보.xlsx"
    );
    expect(rows[0]).toEqual([
      "번호",
      "학년",
      "학기",
      "학기명",
      "교과군",
      "과목명",
      "학번",
      "이름"
    ]);
    expect(rows[1]).toContain("20101");
    expect(rows[2]).toContain("20102");
  });
});
