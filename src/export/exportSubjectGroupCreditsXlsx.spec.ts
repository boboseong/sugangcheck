import { utils } from "@e965/xlsx";
import { describe, expect, it } from "vitest";
import type { CourseSelectionRecord } from "../types/courseSelection";
import type { Student } from "../types/student";
import {
  compareStudentsByStudentNo,
  createSubjectGroupCreditsWorkbook,
  subjectGroupCreditsFileName,
  subjectGroupCreditsSheetName
} from "./exportSubjectGroupCreditsXlsx";

function student(studentId: string, studentNo: string, name: string): Student {
  return {
    studentId,
    studentNo,
    name,
    currentClassNo: studentNo.slice(1, 3).replace(/^0/u, ""),
    currentNumber: studentNo.slice(3).replace(/^0/u, "")
  };
}

function record(studentId: string, subjectGroup: string, credits: number): CourseSelectionRecord {
  return {
    id: `${studentId}-${subjectGroup}-${credits}`,
    studentId,
    studentNo: "",
    studentName: "",
    target: { grade: 1, semester: 1 },
    subjectName: subjectGroup,
    normalizedSubjectName: subjectGroup,
    subjectGroup,
    selectionType: "일반선택",
    credits,
    origin: {
      type: "courseSelectionFile",
      semesterImportId: "courseSelections-1-1",
      parsedRowId: "row"
    }
  };
}

describe("subject group credits export", () => {
  it("writes one row per student sorted by student number with numeric credit columns", () => {
    const students = [
      student("s-3", "10203", "박셋"),
      student("s-1", "10101", "김하나"),
      student("s-2", "10102", "이둘")
    ];
    const recordsByStudentId = new Map<string, CourseSelectionRecord[]>([
      ["s-1", [record("s-1", "국어", 4), record("s-1", "수학", 4), record("s-1", "영어", 3)]],
      ["s-3", [record("s-3", "교양", 2), record("s-3", "사회", 3)]]
    ]);
    const workbook = createSubjectGroupCreditsWorkbook(students, recordsByStudentId);
    const rows = utils.sheet_to_json<unknown[]>(
      workbook.Sheets[subjectGroupCreditsSheetName]!,
      { header: 1 }
    );

    expect(subjectGroupCreditsFileName).toBe("학생별_교과군별학점.xlsx");
    expect(workbook.SheetNames).toEqual([subjectGroupCreditsSheetName]);
    expect(rows[0]).toEqual([
      "번호",
      "학번",
      "성명",
      "반",
      "번호(반내)",
      "국어",
      "수학",
      "영어",
      "사회",
      "과학",
      "체육",
      "예술",
      "기술·가정/정보",
      "제2외국어/한문",
      "교양",
      "국수영",
      "국수영 최대",
      "생활교양",
      "총학점"
    ]);
    expect(rows.slice(1).map((row) => row[1])).toEqual(["10101", "10102", "10203"]);
    expect(rows[1]).toEqual([
      1, "10101", "김하나", "1", "1",
      4, 4, 3, 0, 0, 0, 0, 0, 0, 0,
      11, 81, 0, 11
    ]);
    expect(rows[2]).toEqual([
      2, "10102", "이둘", "1", "2",
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 81, 0, 0
    ]);
    expect(rows[3]).toEqual([
      3, "10203", "박셋", "2", "3",
      0, 0, 0, 3, 0, 0, 0, 0, 0, 2,
      0, 81, 2, 5
    ]);
  });

  it("orders by student number then name", () => {
    const sorted = [
      student("b", "10102", "나"),
      student("a", "10102", "가"),
      student("c", "10011", "다")
    ].sort(compareStudentsByStudentNo);

    expect(sorted.map((entry) => entry.studentId)).toEqual(["c", "a", "b"]);
  });
});
