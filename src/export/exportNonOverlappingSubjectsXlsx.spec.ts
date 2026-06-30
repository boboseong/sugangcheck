import { utils } from "xlsx";
import { describe, expect, it } from "vitest";
import { normalizeSubjectName } from "../normalizers/normalizeSubjectName";
import type { ParsedCourseSelectionRow } from "../types/courseSelection";
import type { OperatingSubject } from "../types/subject";
import { buildNonOverlappingSubjectCombinations } from "../analytics/nonOverlappingSubjects";
import {
  createNonOverlappingSubjectsWorkbook,
  nonOverlappingSubjectsFileName
} from "./exportNonOverlappingSubjectsXlsx";

function courseRow(id: string, studentNo: string, subjectName: string): ParsedCourseSelectionRow {
  return {
    id,
    semesterImportId: "course-2-1",
    studentId: studentNo,
    studentNo,
    studentName: `학생${studentNo}`,
    target: { grade: 2, semester: 1 },
    subjectName,
    normalizedSubjectName: normalizeSubjectName(subjectName)
  };
}

function operatingSubject(subjectName: string): OperatingSubject {
  return {
    id: `subject-${subjectName}`,
    target: { grade: 2, semester: 1 },
    subjectName,
    normalizedSubjectName: normalizeSubjectName(subjectName),
    subjectGroup: "과학",
    selectionType: "진로",
    groupType: "보통교과",
    credits: 2,
    masterMatchStatus: "matched"
  };
}

describe("non-overlapping subject export", () => {
  it("creates a workbook with subject combination rows", () => {
    const combinations = buildNonOverlappingSubjectCombinations(
      [courseRow("row-1", "20101", "물리학"), courseRow("row-2", "20102", "화학")],
      [operatingSubject("물리학"), operatingSubject("화학")]
    );
    const workbook = createNonOverlappingSubjectsWorkbook(combinations);
    const rows = utils.sheet_to_json<unknown[]>(
      workbook.Sheets["미중복과목명렬"]!,
      { header: 1 }
    );

    expect(nonOverlappingSubjectsFileName).toBe("미중복선택과목_명렬.xlsx");
    expect(workbook.SheetNames).toEqual(["미중복과목명렬"]);
    expect(rows[0]).toEqual([
      "번호",
      "학년",
      "학기",
      "학기명",
      "과목 수",
      "총 신청 학생 수",
      "과목명렬",
      "교과군명렬",
      "과목 1",
      "과목 1 신청 학생 수",
      "과목 2",
      "과목 2 신청 학생 수",
      "과목 3",
      "과목 3 신청 학생 수",
      "과목 4",
      "과목 4 신청 학생 수"
    ]);
    expect(rows[1]).toContain(2);
    expect(rows[1]).toContain("물리학, 화학");
    expect(rows[1]).toContain("과학");
  });
});
