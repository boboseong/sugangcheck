import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { Student } from "../types/student";
import { ExternalCourseInputTabs } from "./ExternalCourseInputTabs";

const student: Student = {
  studentId: "student-1",
  studentNo: "20101",
  name: "김전입"
};

const secondStudent: Student = {
  studentId: "student-2",
  studentNo: "20202",
  name: "이외부"
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
    expect(
      screen.getByText("연속 입력 대상: 김전입 (20101) · 2-1")
    ).toBeInTheDocument();
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
    const onSelectedStudentIdChange = vi.fn();

    render(
      <ExternalCourseInputTabs
        filteredStudents={[student]}
        missingSemesters={[{ grade: 2, semester: 1 }]}
        onAddInputs={onAddInputs}
        onSelectedStudentIdChange={onSelectedStudentIdChange}
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
    const sourceInput = within(row as HTMLElement).getByRole("textbox", { name: "출처" });
    const choiceGroupInput = within(row as HTMLElement).getByRole("textbox", {
      name: "선택군"
    });
    const sourceNameInput = within(row as HTMLElement).getByRole("textbox", {
      name: "기관명"
    });
    const memoInput = within(row as HTMLElement).getByRole("textbox", { name: "메모" });

    expect(sourceInput).toHaveValue("전입/외부 이수");
    fireEvent.change(sourceInput, { target: { value: "공동교육과정" } });
    fireEvent.change(choiceGroupInput, { target: { value: "선택군A" } });
    fireEvent.change(sourceNameInput, { target: { value: "외부기관" } });
    fireEvent.change(memoInput, { target: { value: "확인 필요" } });
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
        sourceType: "공동교육과정",
        choiceGroup: "선택군A",
        sourceName: "외부기관",
        memo: "확인 필요"
      })
    ]);
    expect(onSelectedStudentIdChange).toHaveBeenCalledWith("student-1");
    expect(within(row as HTMLElement).getByRole("combobox", { name: "학기" })).toHaveValue(
      "2-1"
    );
    expect(subjectInput).toHaveValue("");
    expect(creditsInput).toHaveValue(null);
    expect(subjectInput).toHaveFocus();
    expect(within(row as HTMLElement).getByRole("combobox", { name: "교과군" })).toHaveValue(
      ""
    );
    expect(
      within(row as HTMLElement).getByRole("combobox", { name: "선택구분" })
    ).toHaveValue("");

    fireEvent.click(screen.getByRole("button", { name: "세부 항목 펼치기" }));
    expect(
      within(row as HTMLElement).getByRole("combobox", { name: "과목구분" })
    ).toHaveValue("");
    expect(within(row as HTMLElement).getByRole("textbox", { name: "출처" })).toHaveValue(
      "전입/외부 이수"
    );
    expect(within(row as HTMLElement).getByRole("textbox", { name: "선택군" })).toHaveValue(
      "기타"
    );
    expect(within(row as HTMLElement).getByRole("textbox", { name: "기관명" })).toHaveValue(
      ""
    );
    expect(within(row as HTMLElement).getByRole("textbox", { name: "메모" })).toHaveValue("");

    fireEvent.change(subjectInput, { target: { value: "화학" } });
    fireEvent.change(creditsInput, { target: { value: "3" } });
    fireEvent.keyDown(creditsInput, { key: "Enter" });

    expect(onAddInputs).toHaveBeenCalledTimes(2);
    expect(onAddInputs).toHaveBeenLastCalledWith([
      expect.objectContaining({
        studentId: "student-1",
        target: { grade: 2, semester: 1 },
        subjectName: "화학",
        credits: 3
      })
    ]);
  });

  it("resets the draft to the first missing semester when the selected student changes", () => {
    const { rerender } = render(
      <ExternalCourseInputTabs
        filteredStudents={[student, secondStudent]}
        missingSemesters={[{ grade: 2, semester: 1 }]}
        onAddInputs={vi.fn()}
        onSelectedStudentIdChange={vi.fn()}
        onStudentQueryChange={vi.fn()}
        selectedStudent={student}
        studentQuery=""
        studentSemesterPresence={[]}
        students={[student, secondStudent]}
      />
    );

    const semesterSelect = screen.getByRole("combobox", { name: "학기" });
    const subjectInput = screen.getByRole("combobox", { name: "과목명" });

    fireEvent.change(semesterSelect, { target: { value: "3-2" } });
    fireEvent.change(subjectInput, { target: { value: "물리학" } });

    rerender(
      <ExternalCourseInputTabs
        filteredStudents={[student, secondStudent]}
        missingSemesters={[{ grade: 1, semester: 2 }]}
        onAddInputs={vi.fn()}
        onSelectedStudentIdChange={vi.fn()}
        onStudentQueryChange={vi.fn()}
        selectedStudent={secondStudent}
        studentQuery=""
        studentSemesterPresence={[]}
        students={[student, secondStudent]}
      />
    );

    expect(
      screen.getByText("연속 입력 대상: 이외부 (20202) · 1-2")
    ).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: "학기" })).toHaveValue("1-2");
    expect(screen.getByRole("combobox", { name: "과목명" })).toHaveValue("");
  });

  it("keeps the current draft and focus when Enter submission fails validation", () => {
    const onAddInputs = vi.fn();
    const onSelectedStudentIdChange = vi.fn();

    render(
      <ExternalCourseInputTabs
        filteredStudents={[student]}
        missingSemesters={[{ grade: 2, semester: 1 }]}
        onAddInputs={onAddInputs}
        onSelectedStudentIdChange={onSelectedStudentIdChange}
        onStudentQueryChange={vi.fn()}
        selectedStudent={student}
        studentQuery=""
        studentSemesterPresence={[]}
        students={[student]}
      />
    );

    const subjectInput = screen.getByRole("combobox", { name: "과목명" });

    fireEvent.change(subjectInput, { target: { value: "직접 입력 과목" } });
    subjectInput.focus();
    fireEvent.keyDown(subjectInput, { key: "Enter" });

    expect(screen.getByText("학점을 숫자로 입력하세요.")).toBeInTheDocument();
    expect(subjectInput).toHaveValue("직접 입력 과목");
    expect(subjectInput).toHaveFocus();
    expect(onAddInputs).not.toHaveBeenCalled();
    expect(onSelectedStudentIdChange).not.toHaveBeenCalled();
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
