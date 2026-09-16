import { describe, expect, it } from "vitest";
import type { CourseSelectionRecord } from "../types/courseSelection";
import {
  formatCreditLimit,
  subjectGroupCreditColumns,
  summarizeSubjectGroupCredits
} from "./subjectGroupCreditSummary";

function record(subjectGroup: string, credits: number): CourseSelectionRecord {
  return {
    id: `${subjectGroup}-${credits}-${Math.random()}`,
    studentId: "student-1",
    studentNo: "10101",
    studentName: "김학생",
    target: { grade: 1, semester: 1 },
    subjectName: subjectGroup,
    normalizedSubjectName: subjectGroup,
    subjectGroup,
    selectionType: "일반선택",
    credits,
    origin: {
      type: "courseSelectionFile",
      semesterImportId: "courseSelections-1-1",
      parsedRowId: "row-1"
    }
  };
}

describe("summarizeSubjectGroupCredits", () => {
  it("sums credits per subject group in the fixed column order", () => {
    const summary = summarizeSubjectGroupCredits([
      record("수학", 4),
      record("국어", 4),
      record("국어", 3),
      record("교양", 2),
      record("제2외국어/한문", 3)
    ]);

    expect(summary.groupCredits.map(([subjectGroup]) => subjectGroup)).toEqual(
      subjectGroupCreditColumns
    );
    expect(Object.fromEntries(summary.groupCredits)).toMatchObject({
      국어: 7,
      수학: 4,
      영어: 0,
      교양: 2,
      "제2외국어/한문": 3
    });
    expect(summary.totalCredits).toBe(16);
    expect(summary.kmeCredits).toBe(11);
    expect(summary.lifeLiberalCredits).toBe(5);
    expect(summary.subjectCount).toBe(5);
  });

  it("computes the korean/math/english limit from total credits", () => {
    expect(summarizeSubjectGroupCredits([record("사회", 174)]).kmeLimitCredits).toBe(81);
    expect(summarizeSubjectGroupCredits([record("사회", 180)]).kmeLimitCredits).toBe(84);
    expect(summarizeSubjectGroupCredits([]).kmeLimitCredits).toBe(81);
  });
});

describe("formatCreditLimit", () => {
  it("prints integers plainly and fractions with one decimal", () => {
    expect(formatCreditLimit(81)).toBe("81");
    expect(formatCreditLimit(81.5)).toBe("81.5");
  });
});
