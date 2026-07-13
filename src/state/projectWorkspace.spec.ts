import { afterEach, describe, expect, it } from "vitest";
import type { OperatingSubject } from "../types/subject";
import type { ValidationEngineResult } from "../validation/types";
import { useNormalizedCourseSelectionStore } from "./normalizedCourseSelectionStore";
import { useOperatingSubjectStore } from "./operatingSubjectStore";
import {
  applyProjectState,
  collectProjectState,
  createEmptyProjectState,
  importProjectSection
} from "./projectWorkspace";
import { useValidationResultStore } from "./validationResultStore";
import { useValidationRevisionStore } from "./validationRevisionStore";

const savedAt = "2026-07-10T00:00:00.000Z";
const validationResult: ValidationEngineResult = {
  errors: [],
  executedRuleIds: [],
  skippedRuleIds: [],
  durationMs: 1
};
const operatingSubject: OperatingSubject = {
  id: "subject-1",
  target: { grade: 1, semester: 1 },
  subjectName: "공통국어Ⅰ",
  normalizedSubjectName: "공통국어 1",
  subjectGroup: "국어",
  selectionType: "공통",
  groupType: "일반교과",
  credits: 4,
  choiceGroup: "학생필수",
  masterMatchStatus: "matched"
};

afterEach(() => {
  applyProjectState(createEmptyProjectState("정리", savedAt));
});

describe("project workspace validation revisions", () => {
  it("hydrates and collects matching revision metadata without incrementing it", () => {
    const state = createEmptyProjectState("revision", savedAt);

    state.inputRevision = 7;
    state.resultRevision = 7;
    state.lastValidationResult = validationResult;
    state.operatingSubjects = [operatingSubject];

    applyProjectState(state);

    expect(useValidationRevisionStore.getState().inputRevision).toBe(7);
    expect(useValidationResultStore.getState().resultRevision).toBe(7);
    expect(useNormalizedCourseSelectionStore.getState().recordsRevision).toBe(7);
    expect(collectProjectState(savedAt)).toMatchObject({
      inputRevision: 7,
      resultRevision: 7,
      lastValidationResult: validationResult
    });
  });

  it("keeps the previous result and makes it stale after a direct edit", () => {
    const state = createEmptyProjectState("revision", savedAt);

    state.inputRevision = 3;
    state.resultRevision = 3;
    state.lastValidationResult = validationResult;
    state.operatingSubjects = [operatingSubject];
    applyProjectState(state);

    useOperatingSubjectStore.getState().updateOperatingSubject({
      ...operatingSubject,
      credits: 3
    });

    expect(useValidationRevisionStore.getState().inputRevision).toBe(4);
    expect(useValidationResultStore.getState()).toMatchObject({
      lastValidationResult: validationResult,
      resultRevision: 3
    });
  });

  it("increments once after a hydration-batched project section import", () => {
    const currentState = createEmptyProjectState("current", savedAt);
    const sourceState = createEmptyProjectState("source", savedAt);

    currentState.inputRevision = 5;
    currentState.resultRevision = 5;
    currentState.lastValidationResult = validationResult;
    sourceState.validationRuleSettings = sourceState.validationRuleSettings.map(
      (setting, index) =>
        index === 0 ? { ...setting, enabled: !setting.enabled } : setting
    );
    applyProjectState(currentState);

    importProjectSection("validationRules", sourceState);

    expect(useValidationRevisionStore.getState().inputRevision).toBe(6);
    expect(useValidationResultStore.getState()).toMatchObject({
      lastValidationResult: validationResult,
      resultRevision: 5
    });
  });
});
