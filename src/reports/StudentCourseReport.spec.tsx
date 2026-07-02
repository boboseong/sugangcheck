import { render, screen } from "@testing-library/react";
import type { CourseSelectionRecord } from "../types/courseSelection";
import type { Student } from "../types/student";
import { StudentCourseReport } from "./StudentCourseReport";

const student: Student = {
  studentId: "student-1",
  studentNo: "10101",
  name: "김학생",
  currentClassNo: "1",
  currentNumber: "1"
};

const target = { grade: 1, semester: 1 } as const;

function courseRecord(input: {
  id: string;
  subjectName: string;
  choiceGroup: string;
}): CourseSelectionRecord {
  return {
    id: input.id,
    studentId: student.studentId,
    studentNo: student.studentNo,
    studentName: student.name,
    target,
    subjectName: input.subjectName,
    normalizedSubjectName: input.subjectName.replace(/\s+/gu, ""),
    subjectGroup: "과학",
    selectionType: "일반선택",
    groupType: "일반교과",
    choiceGroup: input.choiceGroup,
    credits: 2,
    origin: {
      type: "courseSelectionFile",
      semesterImportId: "courseSelections-1-1",
      parsedRowId: input.id
    }
  };
}

describe("StudentCourseReport", () => {
  it("shows fixed choice group category badges next to subject names", () => {
    render(
      <StudentCourseReport
        errors={[]}
        records={[
          courseRecord({
            id: "record-required",
            subjectName: "한국사",
            choiceGroup: "학교 지정"
          }),
          courseRecord({
            id: "record-other",
            subjectName: "외부 이수",
            choiceGroup: "기타"
          }),
          courseRecord({
            id: "record-choice",
            subjectName: "물리학",
            choiceGroup: "탐구선택A"
          })
        ]}
        student={student}
      />
    );

    expect(screen.getByText("지정")).toBeInTheDocument();
    expect(screen.getByText("기타")).toBeInTheDocument();
    expect(screen.getByText("선택")).toBeInTheDocument();
    expect(screen.queryByText("탐구선택A")).not.toBeInTheDocument();
  });
});
