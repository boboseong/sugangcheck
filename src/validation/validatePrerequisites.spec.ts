import { describe, expect, it } from "vitest";
import type { CourseSelectionRecord } from "../types/courseSelection";
import type { PrerequisiteRule } from "../types/validation";
import type { Semester } from "../types/semester";
import { validatePrerequisites } from "./validatePrerequisites";

function createRecord(input: {
  id: string;
  subjectName: string;
  target: Semester;
}): CourseSelectionRecord {
  return {
    id: input.id,
    studentId: "20101",
    studentNo: "20101",
    studentName: "김선수",
    target: input.target,
    subjectName: input.subjectName,
    normalizedSubjectName: input.subjectName,
    subjectGroup: "수학",
    selectionType: "일반선택",
    groupType: "선택",
    credits: 4,
    origin: {
      type: "courseSelectionFile",
      semesterImportId: `courseSelections-${input.target.grade}-${input.target.semester}`,
      parsedRowId: input.id
    }
  };
}

function createRule(input: {
  id: string;
  beforeSubjectName: string;
  afterSubjectName: string;
}): PrerequisiteRule {
  return {
    id: input.id,
    beforeSubjectName: input.beforeSubjectName,
    beforeNormalizedSubjectName: input.beforeSubjectName,
    afterSubjectName: input.afterSubjectName,
    afterNormalizedSubjectName: input.afterSubjectName,
    status: "active",
    allowConcurrent: false,
    source: "default"
  };
}

const setting = {
  id: "prerequisites",
  enabled: true,
  includeExternalInputs: false,
  criteria: {}
} as const;

describe("validatePrerequisites", () => {
  it("gives each unsatisfied rule its own error id for the same course", () => {
    const errors = validatePrerequisites(
      {
        mode: "full",
        records: [
          createRecord({
            id: "calculus-2",
            subjectName: "미적분Ⅱ",
            target: { grade: 3, semester: 1 }
          })
        ],
        setting: { ...setting }
      },
      [
        createRule({
          id: "algebra-to-calculus-2",
          beforeSubjectName: "대수",
          afterSubjectName: "미적분Ⅱ"
        }),
        createRule({
          id: "calculus-1-to-calculus-2",
          beforeSubjectName: "미적분Ⅰ",
          afterSubjectName: "미적분Ⅱ"
        })
      ]
    );

    expect(errors).toHaveLength(2);
    expect(errors.map((error) => error.message)).toEqual([
      "미적분Ⅱ 이수 전 대수 이수가 필요합니다.",
      "미적분Ⅱ 이수 전 미적분Ⅰ 이수가 필요합니다."
    ]);
    expect(new Set(errors.map((error) => error.id)).size).toBe(2);
  });

  it("reports nothing when the prerequisite was taken in an earlier semester", () => {
    const errors = validatePrerequisites(
      {
        mode: "full",
        records: [
          createRecord({
            id: "algebra",
            subjectName: "대수",
            target: { grade: 2, semester: 1 }
          }),
          createRecord({
            id: "calculus-2",
            subjectName: "미적분Ⅱ",
            target: { grade: 3, semester: 1 }
          })
        ],
        setting: { ...setting }
      },
      [
        createRule({
          id: "algebra-to-calculus-2",
          beforeSubjectName: "대수",
          afterSubjectName: "미적분Ⅱ"
        })
      ]
    );

    expect(errors).toEqual([]);
  });
});
