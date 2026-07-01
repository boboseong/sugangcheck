import { fireEvent, render, screen, within } from "@testing-library/react";
import type { ParsedCourseSelectionRow } from "../types/courseSelection";
import type { Grade, SemesterTerm } from "../types/semester";
import { StudentCourseSummaryTable } from "./StudentCourseSummaryTable";

function courseSelectionRow(input: {
  id: string;
  studentNo: string;
  studentName: string;
  grade: Grade;
  semester: SemesterTerm;
  subjectName: string;
}): ParsedCourseSelectionRow {
  return {
    id: input.id,
    semesterImportId: `courseSelections-${input.grade}-${input.semester}`,
    studentId: `${input.studentNo}-${input.studentName}`,
    studentNo: input.studentNo,
    studentName: input.studentName,
    target: {
      grade: input.grade,
      semester: input.semester
    },
    subjectName: input.subjectName,
    normalizedSubjectName: input.subjectName.replace(/\s/g, "")
  };
}

function bodyRowCells() {
  return bodyRows().map((row) =>
    within(row)
      .getAllByRole("cell")
      .map((cell) => cell.textContent)
  );
}

function bodyRows() {
  return screen.getAllByRole("row").slice(1);
}

describe("StudentCourseSummaryTable", () => {
  it("highlights students with non-modal semester counts and sorts them first by default", () => {
    render(
      <StudentCourseSummaryTable
        rows={[
          courseSelectionRow({
            id: "row-0",
            studentNo: "10100",
            studentName: "정가온",
            grade: 3,
            semester: 2,
            subjectName: "물질과에너지"
          }),
          courseSelectionRow({
            id: "row-1",
            studentNo: "10101",
            studentName: "김하나",
            grade: 1,
            semester: 1,
            subjectName: "물리학"
          }),
          courseSelectionRow({
            id: "row-2",
            studentNo: "10101",
            studentName: "김하나",
            grade: 1,
            semester: 1,
            subjectName: "화학"
          }),
          courseSelectionRow({
            id: "row-3",
            studentNo: "10101",
            studentName: "김하나",
            grade: 2,
            semester: 1,
            subjectName: "생명과학"
          }),
          courseSelectionRow({
            id: "row-4",
            studentNo: "10103",
            studentName: "이두리",
            grade: 3,
            semester: 2,
            subjectName: "지구과학"
          }),
          courseSelectionRow({
            id: "row-5",
            studentNo: "10102",
            studentName: "박세나",
            grade: 2,
            semester: 2,
            subjectName: "융합과학"
          }),
          courseSelectionRow({
            id: "row-6",
            studentNo: "10102",
            studentName: "박세나",
            grade: 3,
            semester: 1,
            subjectName: "과학과제연구"
          }),
          courseSelectionRow({
            id: "row-7",
            studentNo: "10102",
            studentName: "박세나",
            grade: 3,
            semester: 2,
            subjectName: "생활과과학"
          }),
          courseSelectionRow({
            id: "row-8",
            studentNo: "10102",
            studentName: "박세나",
            grade: 1,
            semester: 2,
            subjectName: "과학사"
          })
        ]}
      />
    );

    expect(screen.queryByText("확인된 학점")).not.toBeInTheDocument();
    expect(screen.queryByText("학점 미확인")).not.toBeInTheDocument();
    expect(screen.queryByText("신청 과목 수")).not.toBeInTheDocument();

    expect(
      screen.getAllByRole("columnheader").map((header) => header.textContent)
    ).toEqual([
      "학번",
      "이름",
      "1학년 1학기",
      "1학년 2학기",
      "2학년 1학기",
      "2학년 2학기",
      "3학년 1학기",
      "3학년 2학기",
      "합계"
    ]);

    expect(screen.getByLabelText("정렬")).toHaveValue("attention");
    expect(bodyRowCells()).toEqual([
      ["10101", "김하나", "2", "0", "1", "0", "0", "0", "3"],
      ["10102", "박세나", "0", "1", "0", "1", "1", "1", "4"],
      ["10100", "정가온", "0", "0", "0", "0", "0", "1", "1"],
      ["10103", "이두리", "0", "0", "0", "0", "0", "1", "1"]
    ]);
    expect(bodyRows()[0]).toHaveClass("is-attention");
    expect(bodyRows()[1]).toHaveClass("is-attention");
    expect(bodyRows()[2]).not.toHaveClass("is-attention");
    expect(bodyRows()[3]).not.toHaveClass("is-attention");

    fireEvent.change(screen.getByLabelText("정렬"), {
      target: { value: "studentNo" }
    });

    expect(bodyRowCells()).toEqual([
      ["10100", "정가온", "0", "0", "0", "0", "0", "1", "1"],
      ["10101", "김하나", "2", "0", "1", "0", "0", "0", "3"],
      ["10102", "박세나", "0", "1", "0", "1", "1", "1", "4"],
      ["10103", "이두리", "0", "0", "0", "0", "0", "1", "1"]
    ]);

    fireEvent.change(screen.getByLabelText("정렬"), {
      target: { value: "total" }
    });

    expect(bodyRowCells()).toEqual([
      ["10102", "박세나", "0", "1", "0", "1", "1", "1", "4"],
      ["10101", "김하나", "2", "0", "1", "0", "0", "0", "3"],
      ["10100", "정가온", "0", "0", "0", "0", "0", "1", "1"],
      ["10103", "이두리", "0", "0", "0", "0", "0", "1", "1"]
    ]);
  });
});
