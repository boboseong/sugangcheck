import { beforeEach, describe, expect, it } from "vitest";
import { defaultValidationRuleSettings } from "../data/defaultValidationRules";
import type {
  ExternalCourseInput,
  ParsedCourseSelectionRow
} from "../types/courseSelection";
import type { OperatingSubject } from "../types/subject";
import type {
  DetailedConstraintRule,
  PrerequisiteRule
} from "../types/validation";
import { useCourseSelectionRawStore } from "./courseSelectionRawStore";
import { useDetailedConstraintRuleStore } from "./detailedConstraintRuleStore";
import { useExternalCourseInputStore } from "./externalCourseInputStore";
import { useOperatingSubjectStore } from "./operatingSubjectStore";
import { usePrerequisiteRuleStore } from "./prerequisiteRuleStore";
import { runProjectHydration } from "./projectHydration";
import { useValidationRevisionStore } from "./validationRevisionStore";
import { useValidationRuleSettingStore } from "./validationRuleSettingStore";

const target = { grade: 1, semester: 1 } as const;
const operatingSubject: OperatingSubject = {
  id: "subject-1",
  target,
  subjectName: "공통수학Ⅰ",
  normalizedSubjectName: "공통수학 1",
  subjectGroup: "수학",
  selectionType: "공통",
  groupType: "일반교과",
  credits: 3,
  choiceGroup: "학생필수",
  masterMatchStatus: "matched"
};
const courseSelectionRow: ParsedCourseSelectionRow = {
  id: "row-1",
  semesterImportId: "courseSelections-1-1",
  studentId: "student-1",
  studentNo: "10101",
  studentName: "김학생",
  target,
  subjectName: operatingSubject.subjectName,
  normalizedSubjectName: operatingSubject.normalizedSubjectName
};
const externalCourseInput: ExternalCourseInput = {
  id: "external-1",
  studentId: "student-1",
  studentNo: "10101",
  studentName: "김학생",
  target,
  subjectName: "외부 과목",
  normalizedSubjectName: "외부 과목",
  choiceGroup: "기타",
  credits: 2,
  sourceType: "externalCourse",
  updatedAt: "2026-07-10T00:00:00.000Z"
};
const prerequisiteRule: PrerequisiteRule = {
  id: "prerequisite-1",
  beforeSubjectName: "공통수학Ⅰ",
  beforeNormalizedSubjectName: "공통수학 1",
  afterSubjectName: "공통수학Ⅱ",
  afterNormalizedSubjectName: "공통수학 2",
  status: "active",
  allowConcurrent: false,
  includeExternalInputsOverride: true,
  source: "manual",
  updatedAt: "2026-07-10T00:00:00.000Z"
};
const detailedConstraintRule: DetailedConstraintRule = {
  id: "detail-1",
  type: "linkedSubject",
  name: "수학 연계",
  status: "active",
  includeExternalInputsOverride: true,
  source: "manual",
  trigger: {
    target,
    subjectName: "공통수학Ⅰ",
    normalizedSubjectName: "공통수학 1"
  },
  required: {
    target: { grade: 1, semester: 2 },
    subjectName: "공통수학Ⅱ",
    normalizedSubjectName: "공통수학 2"
  },
  updatedAt: "2026-07-10T00:00:00.000Z"
};

function inputRevision() {
  return useValidationRevisionStore.getState().inputRevision;
}

function resetStores() {
  useValidationRevisionStore.setState({ inputRevision: 0 });
  useOperatingSubjectStore.setState({ operatingSubjects: [operatingSubject] });
  useCourseSelectionRawStore.setState({ courseSelectionRows: [] });
  useExternalCourseInputStore.setState({ externalCourseInputs: [] });
  useValidationRuleSettingStore.setState({
    validationRuleSettings: structuredClone(defaultValidationRuleSettings)
  });
  usePrerequisiteRuleStore.setState({ prerequisiteRules: [] });
  useDetailedConstraintRuleStore.setState({ detailedConstraintRules: [] });
}

describe("validation input revision", () => {
  beforeEach(resetStores);

  it("increments only after a saved operating-subject or course-selection change", () => {
    useOperatingSubjectStore.getState().updateOperatingSubject({
      ...operatingSubject,
      credits: 4
    });
    expect(inputRevision()).toBe(1);

    useOperatingSubjectStore
      .getState()
      .updateOperatingSubject(useOperatingSubjectStore.getState().operatingSubjects[0]!);
    expect(inputRevision()).toBe(1);

    useCourseSelectionRawStore.getState().setCourseSelectionRows([
      courseSelectionRow
    ]);
    expect(inputRevision()).toBe(2);
  });

  it("tracks external-course additions and deletions", () => {
    useExternalCourseInputStore
      .getState()
      .addExternalCourseInputs([externalCourseInput]);
    expect(inputRevision()).toBe(1);

    useExternalCourseInputStore
      .getState()
      .removeExternalCourseInput(externalCourseInput.id);
    expect(inputRevision()).toBe(2);

    useExternalCourseInputStore
      .getState()
      .removeExternalCourseInput(externalCourseInput.id);
    expect(inputRevision()).toBe(2);
  });

  it("tracks basic rule changes but ignores callbacks that keep the same value", () => {
    const initialSetting = useValidationRuleSettingStore
      .getState()
      .validationRuleSettings[0]!;

    useValidationRuleSettingStore
      .getState()
      .updateRuleEnabled(initialSetting.id, !initialSetting.enabled);
    expect(inputRevision()).toBe(1);

    useValidationRuleSettingStore
      .getState()
      .updateRuleEnabled(initialSetting.id, !initialSetting.enabled);
    expect(inputRevision()).toBe(1);

    useValidationRuleSettingStore
      .getState()
      .updateRuleIncludeExternalInputs(
        initialSetting.id,
        !initialSetting.includeExternalInputs
      );
    expect(inputRevision()).toBe(2);

    useValidationRuleSettingStore
      .getState()
      .updateRuleIncludeExternalInputs(
        initialSetting.id,
        !initialSetting.includeExternalInputs
      );
    expect(inputRevision()).toBe(2);

    useValidationRuleSettingStore
      .getState()
      .updateRuleCriteria(initialSetting.id, { minimumCredits: 12 });
    expect(inputRevision()).toBe(3);

    useValidationRuleSettingStore
      .getState()
      .updateRuleCriteria(initialSetting.id, { minimumCredits: 12 });
    expect(inputRevision()).toBe(3);

    useValidationRuleSettingStore
      .getState()
      .restoreDefaultValidationRuleSettings();
    expect(inputRevision()).toBe(4);
  });

  it("tracks prerequisite and detailed-constraint add, edit, and delete actions", () => {
    usePrerequisiteRuleStore.getState().setPrerequisiteRules([prerequisiteRule]);
    expect(inputRevision()).toBe(1);
    usePrerequisiteRuleStore
      .getState()
      .updatePrerequisiteRuleStatus(prerequisiteRule.id, "disabled");
    expect(inputRevision()).toBe(2);
    usePrerequisiteRuleStore.getState().updatePrerequisiteRule({
      ...usePrerequisiteRuleStore.getState().prerequisiteRules[0]!,
      allowConcurrent: true
    });
    expect(inputRevision()).toBe(3);
    usePrerequisiteRuleStore
      .getState()
      .removePrerequisiteRule(prerequisiteRule.id);
    expect(inputRevision()).toBe(4);

    useDetailedConstraintRuleStore
      .getState()
      .setDetailedConstraintRules([detailedConstraintRule]);
    expect(inputRevision()).toBe(5);
    useDetailedConstraintRuleStore.getState().updateDetailedConstraintRule({
      ...detailedConstraintRule,
      name: "수학 연계 수정"
    });
    expect(inputRevision()).toBe(6);
    useDetailedConstraintRuleStore
      .getState()
      .removeDetailedConstraintRule(detailedConstraintRule.id);
    expect(inputRevision()).toBe(7);
  });

  it("tracks generated prerequisite candidates only when new rules are added", () => {
    const nextOperatingSubject: OperatingSubject = {
      ...operatingSubject,
      id: "subject-2",
      target: { grade: 1, semester: 2 },
      subjectName: "공통수학Ⅱ",
      normalizedSubjectName: "공통수학 2"
    };

    usePrerequisiteRuleStore
      .getState()
      .generateCandidatesFromOperatingSubjects([
        operatingSubject,
        nextOperatingSubject
      ]);
    expect(inputRevision()).toBe(1);

    usePrerequisiteRuleStore
      .getState()
      .generateCandidatesFromOperatingSubjects([
        operatingSubject,
        nextOperatingSubject
      ]);
    expect(inputRevision()).toBe(1);
  });

  it("does not increment while hydrating a project", () => {
    runProjectHydration(() => {
      useOperatingSubjectStore.getState().updateOperatingSubject({
        ...operatingSubject,
        credits: 4
      });
      useExternalCourseInputStore
        .getState()
        .addExternalCourseInput(externalCourseInput);
    });

    expect(inputRevision()).toBe(0);
    expect(useOperatingSubjectStore.getState().operatingSubjects[0]?.credits).toBe(4);
    expect(useExternalCourseInputStore.getState().externalCourseInputs).toHaveLength(1);
  });
});
