import { describe, expect, it } from "vitest";
import type { CourseSelectionRecord } from "../types/courseSelection";
import { createDefaultSemesterCreditSubjectCriteria } from "./semesterCreditSubjectCriteria";
import { validateCreditDifference } from "./validateCreditDifference";

function createRecord(input: {
  credits: number;
  id: string;
  studentId: string;
  studentName: string;
  subjectName?: string;
}): CourseSelectionRecord {
  const subjectName = input.subjectName ?? "물리학";

  return {
    id: input.id,
    studentId: input.studentId,
    studentNo: input.studentId,
    studentName: input.studentName,
    target: { grade: 1, semester: 1 },
    subjectName,
    normalizedSubjectName: subjectName,
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

  it("checks configured semester credit and subject-count allowed values", () => {
    const semesterCriteria = createDefaultSemesterCreditSubjectCriteria();

    semesterCriteria[0] = {
      ...semesterCriteria[0]!,
      allowedCredits: [30, 31],
      allowedSubjectCounts: [2]
    };

    const errors = validateCreditDifference({
      mode: "full",
      records: [
        createRecord({
          id: "record-pass-a",
          studentId: "10101",
          studentName: "김통과",
          subjectName: "국어",
          credits: 15
        }),
        createRecord({
          id: "record-pass-b",
          studentId: "10101",
          studentName: "김통과",
          subjectName: "수학",
          credits: 16
        }),
        createRecord({
          id: "record-fail",
          studentId: "10102",
          studentName: "이확인",
          subjectName: "국어",
          credits: 15
        })
      ],
      setting: {
        id: "creditDifference",
        enabled: true,
        includeExternalInputs: false,
        criteria: { semesterCreditSubjectCriteria: semesterCriteria }
      }
    });

    expect(errors).toHaveLength(2);
    expect(errors.map((error) => error.message)).toEqual([
      "1학년 1학기 이수학점 15학점이 허용값 30학점, 31학점과 맞지 않습니다.",
      "1학년 1학기 과목 수 1개가 허용값 2개와 맞지 않습니다."
    ]);
  });
});
