import { act, render, screen, waitFor, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { useCourseSelectionRawStore } from "../state/courseSelectionRawStore";
import { useExternalCourseInputStore } from "../state/externalCourseInputStore";
import { useNormalizedCourseSelectionStore } from "../state/normalizedCourseSelectionStore";
import { useOperatingSubjectStore } from "../state/operatingSubjectStore";
import { useStudentStore } from "../state/studentStore";
import { useSubjectOverrideStore } from "../state/subjectOverrideStore";
import { useValidationResultStore } from "../state/validationResultStore";
import type { ParsedCourseSelectionRow } from "../types/courseSelection";
import type { OperatingSubject } from "../types/subject";
import { buildCourseSelectionRecords } from "../validation/buildCourseSelectionRecords";
import { StudentReportPage } from "./StudentReportPage";

const target = { grade: 1, semester: 1 } as const;
const student = {
  studentId: "student-1",
  studentNo: "10101",
  name: "김학생",
  currentClassNo: "1",
  currentNumber: "1"
};
const courseSelectionRow: ParsedCourseSelectionRow = {
  id: "row-1",
  semesterImportId: "courseSelections-1-1",
  studentId: student.studentId,
  studentNo: student.studentNo,
  studentName: student.name,
  classNo: student.currentClassNo,
  number: student.currentNumber,
  target,
  subjectName: "창의탐구",
  normalizedSubjectName: "창의탐구"
};
const initialOperatingSubject: OperatingSubject = {
  id: "operating-subject-1",
  target,
  subjectName: "창의탐구",
  normalizedSubjectName: "창의탐구",
  subjectGroup: "국어",
  selectionType: "일반선택",
  groupType: "일반교과",
  credits: 2,
  masterMatchStatus: "matched"
};
const changedOperatingSubject: OperatingSubject = {
  ...initialOperatingSubject,
  subjectGroup: "과학",
  selectionType: "진로선택",
  credits: 3
};

function resetStores() {
  useCourseSelectionRawStore.setState({ courseSelectionRows: [] });
  useExternalCourseInputStore.setState({ externalCourseInputs: [] });
  useNormalizedCourseSelectionStore.setState({
    buildIssues: [],
    courseSelectionRecords: []
  });
  useOperatingSubjectStore.setState({ operatingSubjects: [] });
  useStudentStore.setState({ students: [] });
  useSubjectOverrideStore.setState({ subjectOverrides: [] });
  useValidationResultStore.setState({
    lastValidationResult: undefined,
    validationErrors: []
  });
}

describe("StudentReportPage", () => {
  beforeEach(() => {
    resetStores();
  });

  afterEach(() => {
    resetStores();
  });

  it("reflects operating subject changes made after course selection records were built", async () => {
    const initialBuildResult = buildCourseSelectionRecords({
      mode: "full",
      courseSelectionRows: [courseSelectionRow],
      externalCourseInputs: [],
      operatingSubjects: [initialOperatingSubject],
      subjectOverrides: []
    });

    useCourseSelectionRawStore.setState({
      courseSelectionRows: [courseSelectionRow]
    });
    useExternalCourseInputStore.setState({ externalCourseInputs: [] });
    useNormalizedCourseSelectionStore.setState({
      buildIssues: initialBuildResult.issues,
      courseSelectionRecords: initialBuildResult.records
    });
    useOperatingSubjectStore.setState({
      operatingSubjects: [initialOperatingSubject]
    });
    useStudentStore.setState({ students: [student] });
    useSubjectOverrideStore.setState({ subjectOverrides: [] });

    await act(async () => {
      render(
        <MemoryRouter>
          <StudentReportPage />
        </MemoryRouter>
      );
    });

    const initialSemesterTable = screen
      .getByText("국어 · 일반선택 · 일반")
      .closest("table");

    expect(initialSemesterTable).not.toBeNull();
    expect(within(initialSemesterTable!).getByText("2")).toBeInTheDocument();

    act(() => {
      useOperatingSubjectStore.setState({
        operatingSubjects: [changedOperatingSubject]
      });
    });

    await waitFor(() => {
      expect(screen.getByText("과학 · 진로선택 · 일반")).toBeInTheDocument();
    });
    const changedSemesterTable = screen
      .getByText("과학 · 진로선택 · 일반")
      .closest("table");

    expect(changedSemesterTable).not.toBeNull();
    expect(within(changedSemesterTable!).getByText("3")).toBeInTheDocument();
    expect(screen.queryByText("국어 · 일반선택 · 일반")).not.toBeInTheDocument();
  });
});
