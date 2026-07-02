import { render, screen, within } from "@testing-library/react";
import { semesterKeys } from "../types/semester";
import type { StudentSemesterPresence } from "../types/student";
import {
  buildClassStudentRoster,
  ClassStudentRosterTable,
  parseStudentNumberForRoster
} from "./ClassStudentRosterTable";

function presenceRow(input: {
  id: string;
  name: string;
  studentNo: string;
}): StudentSemesterPresence {
  return {
    studentId: input.id,
    studentNo: input.studentNo,
    name: input.name,
    semesters: Object.fromEntries(
      semesterKeys.map((key) => [key, "unknown"])
    ) as StudentSemesterPresence["semesters"]
  };
}

function tableBodyRows(table: HTMLElement) {
  return within(table)
    .getAllByRole("row")
    .slice(1)
    .map((row) =>
      within(row)
        .getAllByRole("cell")
        .map((cell) => cell.textContent)
    );
}

describe("ClassStudentRosterTable", () => {
  it("groups students by class and number from 5-digit and 4-digit student numbers", () => {
    expect(parseStudentNumberForRoster("11201")).toEqual({
      classNo: 12,
      number: 1
    });
    expect(parseStudentNumberForRoster("1203")).toEqual({
      classNo: 2,
      number: 3
    });

    const rows = [
      presenceRow({ id: "student-1", studentNo: "10101", name: "김민호" }),
      presenceRow({ id: "student-2", studentNo: "20101", name: "양진호" }),
      presenceRow({ id: "student-3", studentNo: "1203", name: "이서연" }),
      presenceRow({ id: "student-4", studentNo: "10302", name: "박하늘" }),
      presenceRow({ id: "student-5", studentNo: "10102", name: "최다빈" }),
      presenceRow({ id: "student-6", studentNo: "A0101", name: "제외학생" })
    ];

    expect(buildClassStudentRoster(rows)).toEqual({
      classNumbers: [1, 2, 3],
      rows: [
        {
          number: 1,
          studentsByClassNo: {
            1: ["김민호", "양진호"],
            2: [],
            3: []
          }
        },
        {
          number: 2,
          studentsByClassNo: {
            1: ["최다빈"],
            2: [],
            3: ["박하늘"]
          }
        },
        {
          number: 3,
          studentsByClassNo: {
            1: [],
            2: ["이서연"],
            3: []
          }
        }
      ]
    });

    render(<ClassStudentRosterTable rows={rows} />);

    const table = screen.getByRole("table", { name: "반별 학생 명렬" });

    expect(table).toHaveStyle("--class-student-roster-class-count: 3");
    expect(
      within(table).getAllByRole("columnheader").map((header) => header.textContent)
    ).toEqual(["번호", "1반", "2반", "3반"]);
    expect(tableBodyRows(table)).toEqual([
      ["1", "김민호, 양진호", "", ""],
      ["2", "최다빈", "", "박하늘"],
      ["3", "", "이서연", ""]
    ]);
  });
});
