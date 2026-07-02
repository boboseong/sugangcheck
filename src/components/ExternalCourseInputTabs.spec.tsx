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

    expect(within(tabBar).getByRole("button", { name: "기본" })).toBeInTheDocument();
    expect(
      within(tabBar).getByRole("button", { name: "같은 과목 여러 학생" })
    ).toBeInTheDocument();
    expect(
      within(tabBar).queryByRole("button", { name: "직접 입력" })
    ).not.toBeInTheDocument();
    expect(screen.getByText("김전입 (20101) 과목 입력")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "입력 과목 추가" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "행 추가" })).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "입력 과목 일괄 추가" })
    ).not.toBeInTheDocument();
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

    const subjectInput = screen.getByRole("combobox", { name: "과목명" });

    fireEvent.change(subjectInput, { target: { value: "물" } });
    expect(
      within(screen.getByRole("listbox")).getAllByRole("option")[0]
    ).toHaveTextContent("물리학");
    fireEvent.mouseDown(screen.getByText("물리학").closest("button") as HTMLElement);

    const row = subjectInput.closest(".external-subject-entry");

    expect(subjectInput).toHaveValue("물리학");
    expect(row).toBeDefined();
    expect(within(row as HTMLElement).getByDisplayValue("과학")).toBeInTheDocument();
    expect(within(row as HTMLElement).getByDisplayValue("일반")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "세부 항목 펼치기" }));
    expect(within(row as HTMLElement).getByDisplayValue("보통교과")).toBeInTheDocument();
    expect(within(row as HTMLElement).getByRole("textbox", { name: "출처" })).toHaveValue(
      "전입/외부 이수"
    );
    expect(screen.queryByRole("combobox", { name: "1행 과목명" })).not.toBeInTheDocument();

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
        credits: 3,
        sourceType: "전입/외부 이수"
      })
    ]);
  });

  it("uses an editable default source for same-subject multi-student entry", () => {
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

    fireEvent.click(screen.getByRole("button", { name: "같은 과목 여러 학생" }));

    const sourceInput = screen.getByRole("textbox", { name: "출처" });

    expect(sourceInput).toHaveValue("전입/외부 이수");

    fireEvent.change(sourceInput, { target: { value: "공동교육과정" } });

    expect(sourceInput).toHaveValue("공동교육과정");
  });
});
