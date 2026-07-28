import { describe, expect, it } from "vitest";
import type { CourseSelectionRecord } from "../types/courseSelection";
import type { Semester } from "../types/semester";
import { validateRequiredSubjectGroupCredits } from "./validateRequiredSubjectGroupCredits";

function createRecord(input: {
  id: string;
  subjectGroup: string;
  credits: number;
  target?: Semester;
}): CourseSelectionRecord {
  const target = input.target ?? { grade: 1, semester: 1 };

  return {
    id: input.id,
    studentId: "20101",
    studentNo: "20101",
    studentName: "김미달",
    target,
    subjectName: input.id,
    normalizedSubjectName: input.id,
    subjectGroup: input.subjectGroup,
    selectionType: "일반선택",
    groupType: "선택",
    credits: input.credits,
    origin: {
      type: "courseSelectionFile",
      semesterImportId: `courseSelections-${target.grade}-${target.semester}`,
      parsedRowId: input.id
    }
  };
}

function runRule(criteria: Record<string, unknown>) {
  return validateRequiredSubjectGroupCredits({
    mode: "full",
    records: [
      createRecord({ id: "korean", subjectGroup: "국어", credits: 4 }),
      createRecord({ id: "math", subjectGroup: "수학", credits: 4 })
    ],
    setting: {
      id: "requiredSubjectGroupCredits",
      enabled: true,
      includeExternalInputs: false,
      criteria
    }
  });
}

describe("validateRequiredSubjectGroupCredits", () => {
  it("gives each failing subject group its own error id", () => {
    const errors = runRule({
      requiredSubjectGroupCredits: [
        { subjectGroup: "국어", requiredCredits: 10 },
        { subjectGroup: "수학", requiredCredits: 10 }
      ]
    });

    expect(errors).toHaveLength(2);
    expect(errors.map((error) => error.message)).toEqual([
      "국어 이수학점 4학점이 기준 10학점보다 적습니다.",
      "수학 이수학점 4학점이 기준 10학점보다 적습니다."
    ]);
    expect(new Set(errors.map((error) => error.id)).size).toBe(2);
  });

  it("reports nothing when every group meets its requirement", () => {
    const errors = runRule({
      requiredSubjectGroupCredits: [
        { subjectGroup: "국어", requiredCredits: 4 },
        { subjectGroup: "수학", requiredCredits: 4 }
      ]
    });

    expect(errors).toEqual([]);
  });
});
