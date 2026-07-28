import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { utils, write } from "@e965/xlsx";
import { useCourseSelectionRawStore } from "../state/courseSelectionRawStore";
import {
  createInitialImportStatuses,
  getSemesterImportStatus,
  useImportStatusStore
} from "../state/importStatusStore";
import { useOperatingSubjectStore } from "../state/operatingSubjectStore";
import { useStudentSemesterPresenceStore } from "../state/studentSemesterPresenceStore";
import { useStudentStore } from "../state/studentStore";
import type { Semester } from "../types/semester";
import type { OperatingSubject } from "../types/subject";
import { useCourseSelectionImport } from "./useCourseSelectionImport";

const target = { grade: 2, semester: 1 } satisfies Semester;

function operatingSubject(input: {
  id: string;
  subjectName: string;
  normalizedSubjectName: string;
  choiceGroup: string;
}): OperatingSubject {
  return {
    ...input,
    target,
    subjectGroup: "과학",
    selectionType: "진로",
    groupType: "보통교과",
    credits: 3,
    masterMatchStatus: "matched"
  };
}

function courseSelectionFile(): File {
  const workbook = utils.book_new();
  const sheet = utils.aoa_to_sheet([
    ["학번", "이름", "물리학"],
    [20101, "김학생", 1],
    [20102, "이학생", 1]
  ]);

  utils.book_append_sheet(workbook, sheet, "2-1");
  const data = write(workbook, { bookType: "xlsx", type: "array" });

  return new File([data], "2학년1학기_수강신청결과.xlsx", {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  });
}

function resetStores() {
  useCourseSelectionRawStore.setState({ courseSelectionRows: [] });
  useImportStatusStore.setState({ importStatuses: createInitialImportStatuses() });
  useOperatingSubjectStore.setState({ operatingSubjects: [] });
  useStudentStore.setState({ students: [] });
  useStudentSemesterPresenceStore.setState({ studentSemesterPresence: [] });
}

function courseSelectionStatus() {
  return getSemesterImportStatus(
    useImportStatusStore.getState().importStatuses,
    "courseSelections",
    target
  );
}

describe("useCourseSelectionImport", () => {
  afterEach(() => {
    resetStores();
  });

  it("holds uploads with missing operating subjects until every O/X decision is selected", async () => {
    resetStores();
    useOperatingSubjectStore.setState({
      operatingSubjects: [
        operatingSubject({
          id: "physics",
          subjectName: "물리학",
          normalizedSubjectName: "물리학",
          choiceGroup: "학생선택"
        }),
        operatingSubject({
          id: "korean-history",
          subjectName: "한국사",
          normalizedSubjectName: "한국사",
          choiceGroup: "학교 지정"
        }),
        operatingSubject({
          id: "biology",
          subjectName: "생명과학",
          normalizedSubjectName: "생명과학",
          choiceGroup: "학생선택"
        })
      ]
    });
    const { result } = renderHook(() => useCourseSelectionImport());

    await act(async () => {
      await result.current.handleFilesSelected([courseSelectionFile()], target);
    });

    expect(useCourseSelectionRawStore.getState().courseSelectionRows).toEqual([]);
    expect(result.current.pendingOperatingSubjectCompletions).toHaveLength(1);
    expect(
      result.current.pendingOperatingSubjectCompletions[0]?.subjects.map(
        ({ choiceGroup, decision, subjectName }) => ({
          choiceGroup,
          decision,
          subjectName
        })
      )
    ).toEqual([
      { subjectName: "한국사", choiceGroup: "학교 지정", decision: undefined },
      { subjectName: "생명과학", choiceGroup: "학생선택", decision: undefined }
    ]);
    expect(result.current.canCompletePendingOperatingSubjectCompletions).toBe(false);
    expect(courseSelectionStatus()).toMatchObject({
      status: "needsReview",
      rowCount: 2,
      message:
        "운영과목에는 있지만 수강신청결과에는 없는 과목 2개 확인 필요"
    });

    act(() => {
      result.current.completePendingOperatingSubjectCompletions();
    });

    expect(useCourseSelectionRawStore.getState().courseSelectionRows).toEqual([]);

    const completion = result.current.pendingOperatingSubjectCompletions[0]!;

    act(() => {
      result.current.setPendingOperatingSubjectCompletionDecision(
        completion.id,
        "korean-history",
        "all"
      );
    });
    expect(result.current.canCompletePendingOperatingSubjectCompletions).toBe(false);
    act(() => {
      result.current.setPendingOperatingSubjectCompletionDecision(
        completion.id,
        "biology",
        "none"
      );
    });
    expect(result.current.canCompletePendingOperatingSubjectCompletions).toBe(true);

    act(() => {
      result.current.completePendingOperatingSubjectCompletions();
    });

    expect(
      useCourseSelectionRawStore
        .getState()
        .courseSelectionRows.map((row) => row.subjectName)
    ).toEqual(["물리학", "물리학", "한국사", "한국사"]);
    expect(result.current.pendingOperatingSubjectCompletions).toEqual([]);
    expect(courseSelectionStatus()).toMatchObject({
      status: "imported",
      rowCount: 4,
      message: "모두 이수 O 1개 반영 · 모두 이수 X 1개 미반영"
    });
  });

  it("uploads base rows after choosing X for every missing subject", async () => {
    resetStores();
    useOperatingSubjectStore.setState({
      operatingSubjects: [
        operatingSubject({
          id: "biology",
          subjectName: "생명과학",
          normalizedSubjectName: "생명과학",
          choiceGroup: "학생선택"
        })
      ]
    });
    const { result } = renderHook(() => useCourseSelectionImport());

    await act(async () => {
      await result.current.handleFilesSelected([courseSelectionFile()], target);
    });
    act(() => {
      result.current.setPendingOperatingSubjectCompletionDecision(
        result.current.pendingOperatingSubjectCompletions[0]!.id,
        "biology",
        "none"
      );
    });
    act(() => {
      result.current.completePendingOperatingSubjectCompletions();
    });

    expect(
      useCourseSelectionRawStore
        .getState()
        .courseSelectionRows.map((row) => row.subjectName)
    ).toEqual(["물리학", "물리학"]);
    expect(result.current.pendingOperatingSubjectCompletions).toEqual([]);
    expect(courseSelectionStatus()).toMatchObject({
      status: "imported",
      rowCount: 2,
      message: "모두 이수 X 1개 미반영"
    });
  });
});
