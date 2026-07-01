import { act, renderHook } from "@testing-library/react";
import { useCourseSelectionRawStore } from "../state/courseSelectionRawStore";
import { useDetailedConstraintRuleStore } from "../state/detailedConstraintRuleStore";
import { useExternalCourseInputStore } from "../state/externalCourseInputStore";
import {
  createInitialImportStatuses,
  useImportStatusStore
} from "../state/importStatusStore";
import { useNormalizedCourseSelectionStore } from "../state/normalizedCourseSelectionStore";
import { useOperatingSubjectStore } from "../state/operatingSubjectStore";
import { usePrerequisiteRuleStore } from "../state/prerequisiteRuleStore";
import { useStudentSemesterPresenceStore } from "../state/studentSemesterPresenceStore";
import { useValidationResultStore } from "../state/validationResultStore";
import { useValidationRuleSettingStore } from "../state/validationRuleSettingStore";
import { defaultValidationRuleSettings } from "../data/defaultValidationRules";
import type { ParsedCourseSelectionRow } from "../types/courseSelection";
import type { Semester } from "../types/semester";
import type { OperatingSubject } from "../types/subject";
import { useValidationRun } from "./useValidationRun";

const completeTarget = { grade: 1, semester: 1 } as const;
const missingTarget = { grade: 2, semester: 1 } as const;

const courseSelectionRow: ParsedCourseSelectionRow = {
  id: "course-row-1",
  semesterImportId: "courseSelections-1-1",
  studentId: "student-10101",
  studentNo: "10101",
  studentName: "김학생",
  target: completeTarget,
  subjectName: "창의탐구",
  normalizedSubjectName: "창의탐구"
};

const operatingSubject: OperatingSubject = {
  id: "operating-subject-1",
  target: completeTarget,
  subjectName: "창의탐구",
  normalizedSubjectName: "창의탐구",
  subjectGroup: "국어",
  selectionType: "일반선택",
  groupType: "일반교과",
  credits: 2,
  masterMatchStatus: "matched"
};

function sameSemester(left: Semester, right: Semester): boolean {
  return left.grade === right.grade && left.semester === right.semester;
}

function resetStores() {
  useCourseSelectionRawStore.setState({ courseSelectionRows: [] });
  useDetailedConstraintRuleStore.setState({ detailedConstraintRules: [] });
  useExternalCourseInputStore.setState({ externalCourseInputs: [] });
  useImportStatusStore.setState({ importStatuses: createInitialImportStatuses() });
  useNormalizedCourseSelectionStore.setState({
    buildIssues: [],
    courseSelectionRecords: []
  });
  useOperatingSubjectStore.setState({ operatingSubjects: [] });
  usePrerequisiteRuleStore.setState({ prerequisiteRules: [] });
  useStudentSemesterPresenceStore.setState({ studentSemesterPresence: [] });
  useValidationResultStore.setState({
    lastValidationResult: undefined,
    validationErrors: []
  });
  useValidationRuleSettingStore.setState({
    validationRuleSettings: structuredClone(defaultValidationRuleSettings)
  });
}

function seedPartialProject() {
  useCourseSelectionRawStore.setState({ courseSelectionRows: [courseSelectionRow] });
  useOperatingSubjectStore.setState({ operatingSubjects: [operatingSubject] });
  useImportStatusStore.setState({
    importStatuses: createInitialImportStatuses().map((status) =>
      status.sourceType === "operatingSubjects" &&
      sameSemester(status.target, missingTarget)
        ? status
        : {
            ...status,
            status: "imported",
            fileName: "fixture.xlsx",
            importedAt: "2026-01-01T00:00:00.000Z",
            rowCount: 1
          }
    )
  });
}

describe("useValidationRun", () => {
  beforeEach(() => {
    resetStores();
    seedPartialProject();
  });

  afterEach(() => {
    resetStores();
    vi.restoreAllMocks();
  });

  it("exposes an in-app confirmation message for partial validation", () => {
    const { result } = renderHook(() => useValidationRun());

    expect(result.current.canRunValidation).toBe(true);
    expect(result.current.confirmationMessage).toEqual(
      expect.stringContaining(
        "2학년 1학기 운영과목이 입력되지 않았습니다. 해당 학기는 제외됩니다."
      )
    );
    expect(result.current.confirmationMessage).toEqual(
      expect.stringContaining(
        "전체 학생에게 오류가 표시될 수 있습니다."
      )
    );
    expect(useValidationResultStore.getState().lastValidationResult).toBeUndefined();
  });

  it("runs partial validation after the in-app confirmation is accepted", () => {
    const confirmSpy = vi.spyOn(window, "confirm");
    const { result } = renderHook(() => useValidationRun());
    let runResult: ReturnType<typeof result.current.runValidation>;

    act(() => {
      runResult = result.current.runValidation();
    });

    expect(runResult?.validationResult).toBeDefined();
    expect(confirmSpy).not.toHaveBeenCalled();
    expect(runResult?.validationResult.executedRuleIds).toEqual([
      "minimumCredits",
      "creditDifference",
      "requiredSubjectGroupCredits",
      "koreanHistoryCredits",
      "koreanMathEnglishLimit",
      "duplicateSubjects",
      "prerequisites",
      "detailedConstraints",
      "courseExistsInOperatingSubjects",
      "subjectMetadataMismatch"
    ]);
    expect(useValidationResultStore.getState().lastValidationResult).toBeDefined();
  });
});
