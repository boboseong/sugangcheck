import { describe, expect, it } from "vitest";
import type { CourseSelectionRecord } from "../types/courseSelection";
import type { Semester } from "../types/semester";
import { validateDuplicateSubjects } from "./validateDuplicateSubjects";

function createRecord(input: {
  id: string;
  target: Semester;
  subjectName?: string;
  studentId?: string;
  studentName?: string;
}): CourseSelectionRecord {
  const subjectName = input.subjectName ?? "물리학";
  const studentId = input.studentId ?? "20101";

  return {
    id: input.id,
    studentId,
    studentNo: studentId,
    studentName: input.studentName ?? "김중복",
    target: input.target,
    subjectName,
    normalizedSubjectName: subjectName,
    subjectGroup: "과학",
    selectionType: "일반선택",
    groupType: "선택",
    credits: 3,
    origin: {
      type: "courseSelectionFile",
      semesterImportId: `courseSelections-${input.target.grade}-${input.target.semester}`,
      parsedRowId: input.id
    }
  };
}

describe("validateDuplicateSubjects", () => {
  it("names the duplicated application semesters in semester order", () => {
    const errors = validateDuplicateSubjects({
      mode: "full",
      records: [
        createRecord({ id: "physics-2-2", target: { grade: 2, semester: 2 } }),
        createRecord({ id: "physics-2-1", target: { grade: 2, semester: 1 } }),
        createRecord({
          id: "chemistry-2-1",
          target: { grade: 2, semester: 1 },
          subjectName: "화학"
        })
      ],
      setting: {
        id: "duplicateSubjects",
        enabled: true,
        includeExternalInputs: false,
        criteria: {}
      }
    });

    expect(errors).toHaveLength(1);
    expect(errors[0]).toEqual(
      expect.objectContaining({
        studentName: "김중복",
        message: "물리학 과목이 2-1, 2-2에 중복 신청되었습니다."
      })
    );
  });
});
