import { describe, expect, it } from "vitest";
import type { ParsedCourseSelectionRow } from "../types/courseSelection";
import type { OperatingSubject } from "../types/subject";
import { defaultValidationRuleSettings } from "../data/defaultValidationRules";
import {
  getSemesterCreditSubjectCriteria,
  seedSemesterCreditSubjectCriteriaInSettings
} from "./semesterCreditSubjectCriteria";

function createRow(input: {
  id: string;
  studentId: string;
  subjectName: string;
}): ParsedCourseSelectionRow {
  return {
    id: input.id,
    semesterImportId: "courseSelections-1-1",
    studentId: input.studentId,
    studentNo: input.studentId,
    studentName: input.studentId,
    target: { grade: 1, semester: 1 },
    subjectName: input.subjectName,
    normalizedSubjectName: input.subjectName
  };
}

const operatingSubjects: OperatingSubject[] = [
  {
    id: "operating-a",
    target: { grade: 1, semester: 1 },
    subjectName: "국어",
    normalizedSubjectName: "국어",
    subjectGroup: "국어",
    selectionType: "공통",
    groupType: "보통교과",
    credits: 4,
    masterMatchStatus: "manual"
  },
  {
    id: "operating-b",
    target: { grade: 1, semester: 1 },
    subjectName: "수학",
    normalizedSubjectName: "수학",
    subjectGroup: "수학",
    selectionType: "공통",
    groupType: "보통교과",
    credits: 4,
    masterMatchStatus: "manual"
  }
];

describe("seedSemesterCreditSubjectCriteriaInSettings", () => {
  it("fills only default zero semester credit and subject-count values from modes", () => {
    const settings = structuredClone(defaultValidationRuleSettings);
    const creditDifference = settings.find(
      (setting) => setting.id === "creditDifference"
    )!;
    const criteria = getSemesterCreditSubjectCriteria(creditDifference.criteria);

    criteria[0] = {
      ...criteria[0]!,
      allowedCredits: [30],
      allowedSubjectCounts: [0]
    };
    creditDifference.criteria = {
      ...creditDifference.criteria,
      semesterCreditSubjectCriteria: criteria
    };

    const result = seedSemesterCreditSubjectCriteriaInSettings(settings, {
      courseSelectionRows: [
        createRow({ id: "row-1", studentId: "10101", subjectName: "국어" }),
        createRow({ id: "row-2", studentId: "10101", subjectName: "수학" }),
        createRow({ id: "row-3", studentId: "10102", subjectName: "국어" }),
        createRow({ id: "row-4", studentId: "10102", subjectName: "수학" })
      ],
      operatingSubjects
    });
    const nextCreditDifference = result.settings.find(
      (setting) => setting.id === "creditDifference"
    )!;
    const nextCriteria = getSemesterCreditSubjectCriteria(
      nextCreditDifference.criteria
    );

    expect(result.changed).toBe(true);
    expect(nextCriteria[0]).toMatchObject({
      allowedCredits: [30],
      allowedSubjectCounts: [2]
    });
  });
});
