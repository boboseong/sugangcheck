import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { Student } from "../types/student";
import { ExternalCourseInputTabs } from "./ExternalCourseInputTabs";

const student: Student = {
  studentId: "student-1",
  studentNo: "20101",
  name: "김전입"
};

describe("ExternalCourseInputTabs", () => {
  it("removes the direct input tab and starts from one-student multi-subject entry", () => {
    render(
      <ExternalCourseInputTabs
        filteredStudents={[student]}
        missingSemesters={[{ grade: 2, semester: 1 }]}
        onAddInputs={vi.fn()}
        onSelectedStudentIdChange={vi.fn()}
        onStudentQueryChange={vi.fn()}
        selectedStudent={student}
        studentQuery=""
        studentSemesterPresence={[]}
        students={[student]}
      />
    );

    const tabBar = screen.getByLabelText("전입 외부 이수 입력 방식");

    expect(
      within(tabBar).getByRole("button", { name: "한 학생 여러 과목" })
    ).toBeInTheDocument();
    expect(
      within(tabBar).getByRole("button", { name: "같은 과목 여러 학생" })
    ).toBeInTheDocument();
    expect(
      within(tabBar).queryByRole("button", { name: "직접 입력" })
    ).not.toBeInTheDocument();
    expect(screen.getByText("입력 행 1개")).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "2-1" })).toBeInTheDocument();
    expect(
      screen.queryByRole("option", { name: "2학년 1학기" })
    ).not.toBeInTheDocument();
  });

  it("fills subject metadata from the master list and adds the row with Enter", () => {
    const onAddInputs = vi.fn();

    render(
      <ExternalCourseInputTabs
        filteredStudents={[student]}
        missingSemesters={[{ grade: 2, semester: 1 }]}
        onAddInputs={onAddInputs}
        onSelectedStudentIdChange={vi.fn()}
        onStudentQueryChange={vi.fn()}
        selectedStudent={student}
        studentQuery=""
        studentSemesterPresence={[]}
        students={[student]}
      />
    );

    const subjectInput = screen.getByRole("combobox", { name: "1행 과목명" });

    fireEvent.change(subjectInput, { target: { value: "물" } });
    expect(
      within(screen.getByRole("listbox")).getAllByRole("option")[0]
    ).toHaveTextContent("물리학");
    fireEvent.mouseDown(screen.getByText("물리학").closest("button") as HTMLElement);

    const row = subjectInput.closest("tr");

    expect(subjectInput).toHaveValue("물리학");
    expect(row).toBeDefined();
    expect(within(row as HTMLElement).getByDisplayValue("보통교과")).toBeInTheDocument();
    expect(within(row as HTMLElement).getByDisplayValue("과학")).toBeInTheDocument();
    expect(within(row as HTMLElement).getByDisplayValue("일반")).toBeInTheDocument();

    const creditsInput = within(row as HTMLElement).getByRole("spinbutton");

    fireEvent.change(creditsInput, { target: { value: "3" } });
    fireEvent.keyDown(creditsInput, { key: "Enter" });

    expect(onAddInputs).toHaveBeenCalledWith([
      expect.objectContaining({
        studentId: "student-1",
        subjectName: "물리학",
        groupType: "보통교과",
        subjectGroup: "과학",
        selectionType: "일반",
        credits: 3
      })
    ]);
  });
});
