import { describe, expect, it } from "vitest";
import type { CourseSelectionRecord } from "../types/courseSelection";
import { validateCreditDifference } from "./validateCreditDifference";

function createRecord(input: {
  credits: number;
  id: string;
  studentId: string;
  studentName: string;
}): CourseSelectionRecord {
  return {
    id: input.id,
    studentId: input.studentId,
    studentNo: input.studentId,
    studentName: input.studentName,
    target: { grade: 1, semester: 1 },
    subjectName: "물리학",
    normalizedSubjectName: "물리학",
    subjectGroup: "과학",
    selectionType: "일반선택",
    groupType: "선택",
    credits: input.credits,
    origin: {
      type: "courseSelectionFile",
      semesterImportId: "courseSelections-1-1",
      parsedRowId: input.id
    }
  };
}

describe("validateCreditDifference", () => {
  it("names the exact semester in credit-difference messages", () => {
    const errors = validateCreditDifference({
      mode: "full",
      records: [
        createRecord({
          id: "record-common-1",
          studentId: "10101",
          studentName: "김기준",
          credits: 31
        }),
        createRecord({
          id: "record-common-2",
          studentId: "10102",
          studentName: "이기준",
          credits: 31
        }),
        createRecord({
          id: "record-target",
          studentId: "10103",
          studentName: "박차이",
          credits: 14
        })
      ],
      setting: {
        id: "creditDifference",
        enabled: true,
        includeExternalInputs: true,
        criteria: { maxDifferenceCredits: 0 }
      }
    });

    expect(errors).toHaveLength(1);
    expect(errors[0]).toEqual(
      expect.objectContaining({
        studentName: "박차이",
        semester: { grade: 1, semester: 1 },
        message: "1학년 1학기 최빈 이수학점 31학점과 17학점 차이가 납니다."
      })
    );
  });
});
