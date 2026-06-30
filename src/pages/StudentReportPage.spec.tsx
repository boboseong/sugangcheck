import { act, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { useCourseSelectionRawStore } from "../state/courseSelectionRawStore";
import { useExternalCourseInputStore } from "../state/externalCourseInputStore";
import { useNormalizedCourseSelectionStore } from "../state/normalizedCourseSelectionStore";
import { useOperatingSubjectStore } from "../state/operatingSubjectStore";
import { useStudentStore } from "../state/studentStore";
import { useValidationResultStore } from "../state/validationResultStore";
import type { ParsedCourseSelectionRow } from "../types/courseSelection";
import type { OperatingSubject } from "../types/subject";
import type { ValidationError } from "../types/validation";
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
const nextErrorStudent = {
  ...student,
  studentId: "student-2",
  studentNo: "10102",
  name: "이오류",
  currentNumber: "2"
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

function validationErrorFor(targetStudent: typeof student): ValidationError {
  return {
    id: `error-${targetStudent.studentId}`,
    ruleId: "minimumCredits",
    type: "minimumCredits",
    studentId: targetStudent.studentId,
    studentNo: targetStudent.studentNo,
    studentName: targetStudent.name,
    message: `${targetStudent.name} 오류`,
    relatedRecordIds: []
  };
}

function resetStores() {
  useCourseSelectionRawStore.setState({ courseSelectionRows: [] });
  useExternalCourseInputStore.setState({ externalCourseInputs: [] });
  useNormalizedCourseSelectionStore.setState({
    buildIssues: [],
    courseSelectionRecords: []
  });
  useOperatingSubjectStore.setState({ operatingSubjects: [] });
  useStudentStore.setState({ students: [] });
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
    vi.restoreAllMocks();
  });

  it("reflects operating subject changes made after course selection records were built", async () => {
    const initialBuildResult = buildCourseSelectionRecords({
      mode: "full",
      courseSelectionRows: [courseSelectionRow],
      externalCourseInputs: [],
      operatingSubjects: [initialOperatingSubject]
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

  it("selects the next student with validation errors from the report action row", async () => {
    useStudentStore.setState({ students: [student, nextErrorStudent] });
    useValidationResultStore.setState({
      validationErrors: [validationErrorFor(student), validationErrorFor(nextErrorStudent)]
    });

    await act(async () => {
      render(
        <MemoryRouter>
          <StudentReportPage />
        </MemoryRouter>
      );
    });

    expect(
      screen.getByRole("heading", { name: "김학생 - 수강신청 확인서" })
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "다음 오류 학생" }));

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: "이오류 - 수강신청 확인서" })
      ).toBeInTheDocument();
    });
    expect(screen.getByRole("combobox", { name: "학생" })).toHaveValue(
      nextErrorStudent.studentId
    );
  });

  it("clears bulk print reports after the print dialog closes", async () => {
    const printSpy = vi.spyOn(window, "print").mockImplementation(() => undefined);
    const anotherStudent = {
      ...student,
      studentId: "student-3",
      studentNo: "10103",
      name: "박전체",
      currentNumber: "3"
    };

    useStudentStore.setState({ students: [student, anotherStudent] });

    await act(async () => {
      render(
        <MemoryRouter>
          <StudentReportPage />
        </MemoryRouter>
      );
    });

    fireEvent.click(screen.getByRole("button", { name: "전체 학생 출력" }));

    const confirmDialog = screen.getByRole("dialog", { name: "전체 학생 출력" });

    expect(
      within(confirmDialog).getByText("오랜 시간이 소요됩니다. 반별 출력을 권장합니다.")
    ).toBeInTheDocument();
    fireEvent.click(within(confirmDialog).getByRole("button", { name: "전체 출력" }));
    expect(
      screen.getByRole("heading", { name: "김학생 - 수강신청 확인서" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "박전체 - 수강신청 확인서" })
    ).toBeInTheDocument();
    await waitFor(() => expect(printSpy).toHaveBeenCalledTimes(1));

    window.dispatchEvent(new Event("afterprint"));

    await waitFor(() => {
      expect(
        screen.queryByRole("heading", { name: "박전체 - 수강신청 확인서" })
      ).not.toBeInTheDocument();
    });
    expect(
      screen.getByRole("heading", { name: "김학생 - 수강신청 확인서" })
    ).toBeInTheDocument();
  });

  it("does not start all-student printing when the confirmation is canceled", async () => {
    const printSpy = vi.spyOn(window, "print").mockImplementation(() => undefined);
    const anotherStudent = {
      ...student,
      studentId: "student-3",
      studentNo: "10103",
      name: "박전체",
      currentNumber: "3"
    };

    useStudentStore.setState({ students: [student, anotherStudent] });

    await act(async () => {
      render(
        <MemoryRouter>
          <StudentReportPage />
        </MemoryRouter>
      );
    });

    fireEvent.click(screen.getByRole("button", { name: "전체 학생 출력" }));

    const confirmDialog = screen.getByRole("dialog", { name: "전체 학생 출력" });

    expect(
      within(confirmDialog).getByText("오랜 시간이 소요됩니다. 반별 출력을 권장합니다.")
    ).toBeInTheDocument();
    fireEvent.click(within(confirmDialog).getByRole("button", { name: "취소" }));
    expect(printSpy).not.toHaveBeenCalled();
    expect(screen.queryByRole("dialog", { name: "전체 학생 출력" })).not.toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "김학생 - 수강신청 확인서" })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "박전체 - 수강신청 확인서" })
    ).not.toBeInTheDocument();
  });
});
