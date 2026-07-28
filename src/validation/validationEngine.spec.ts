import { describe, expect, it } from "vitest";
import type { CourseSelectionRecord } from "../types/courseSelection";
import type { ValidationRuleSetting } from "../types/validation";
import { runDefaultValidation } from "./validationEngine";

function createRecord(id: string): CourseSelectionRecord {
  return {
    id,
    studentId: "20101",
    studentNo: "20101",
    studentName: "김점검",
    target: { grade: 1, semester: 1 },
    subjectName: "공통국어1",
    normalizedSubjectName: "공통국어1",
    subjectGroup: "국어",
    selectionType: "공통",
    groupType: "보통교과",
    credits: 4,
    origin: {
      type: "courseSelectionFile",
      semesterImportId: "courseSelections-1-1",
      parsedRowId: id
    }
  };
}

const ruleSettings: ValidationRuleSetting[] = [
  {
    id: "minimumCredits",
    enabled: true,
    includeExternalInputs: false,
    criteria: { minimumTotalCredits: 174 }
  },
  {
    id: "duplicateSubjects",
    enabled: true,
    includeExternalInputs: false,
    criteria: {}
  },
  {
    id: "koreanHistoryCredits",
    enabled: false,
    includeExternalInputs: false,
    criteria: {}
  }
];

describe("runDefaultValidation", () => {
  it("executes every enabled rule instead of silently skipping them", () => {
    const result = runDefaultValidation({
      mode: "full",
      records: [createRecord("row-1")],
      ruleSettings,
      detailedConstraintRules: [],
      operatingSubjects: [],
      prerequisiteRules: []
    });

    // A caller that forgets to build the rule map lands every rule in
    // skippedRuleIds and reports zero errors, which is what made the worker a
    // silent no-op.
    expect(result.executedRuleIds).toEqual(["minimumCredits", "duplicateSubjects"]);
    expect(result.skippedRuleIds).toEqual(["koreanHistoryCredits"]);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it("carries the rule inputs the worker receives over postMessage", () => {
    const input = {
      mode: "full" as const,
      records: [createRecord("row-1")],
      ruleSettings,
      detailedConstraintRules: [],
      operatingSubjects: [],
      prerequisiteRules: []
    };

    // The worker gets a structured clone, so the same input must survive a
    // round trip and produce the same verdict.
    const cloned = structuredClone(input);

    expect(runDefaultValidation(cloned).errors).toEqual(
      runDefaultValidation(input).errors
    );
  });
});
