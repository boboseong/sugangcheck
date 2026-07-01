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
    validationRuleSettings: [
      {
        id: "duplicateSubjects",
        enabled: true,
        includeExternalInputs: true,
        criteria: {}
      }
    ]
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

  it("asks before running validation with missing upload semesters", () => {
    const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(false);
    const { result } = renderHook(() => useValidationRun());
    let runResult: ReturnType<typeof result.current.runValidation>;

    expect(result.current.canRunValidation).toBe(true);

    act(() => {
      runResult = result.current.runValidation();
    });

    expect(confirmSpy).toHaveBeenCalledWith(
      "2학년 1학기 운영과목이 입력되지 않았습니다. 점검을 진행하시겠습니까?"
    );
    expect(runResult).toBeUndefined();
    expect(useValidationResultStore.getState().lastValidationResult).toBeUndefined();
  });

  it("runs partial validation after the missing upload warning is confirmed", () => {
    vi.spyOn(window, "confirm").mockReturnValue(true);
    const { result } = renderHook(() => useValidationRun());
    let runResult: ReturnType<typeof result.current.runValidation>;

    act(() => {
      runResult = result.current.runValidation();
    });

    expect(runResult?.validationResult).toBeDefined();
    expect(runResult?.validationResult.executedRuleIds).toEqual([
      "duplicateSubjects"
    ]);
    expect(useValidationResultStore.getState().lastValidationResult).toBeDefined();
  });
});
