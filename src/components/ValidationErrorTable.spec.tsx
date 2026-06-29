import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { ValidationError } from "../types/validation";
import { ValidationErrorTable } from "./ValidationErrorTable";

const errors: ValidationError[] = [
  {
    id: "creditDifference-student-1-record-1",
    ruleId: "creditDifference",
    type: "creditDifference",
    studentId: "student-1",
    studentNo: "10101",
    studentName: "홍길동",
    message: "1학년 1학기 최빈 이수학점 31학점과 17학점 차이가 납니다.",
    relatedRecordIds: ["record-1"],
    semester: { grade: 1, semester: 1 }
  }
];

describe("ValidationErrorTable", () => {
  it("does not render a separate semester column", () => {
    render(
      <ValidationErrorTable
        errors={errors}
        onOpenStudentReport={vi.fn()}
      />
    );

    expect(screen.getAllByRole("columnheader").map((header) => header.textContent)).toEqual([
      "유형",
      "학생",
      "메시지",
      "이동"
    ]);
    expect(screen.getByText(errors[0]!.message)).toBeInTheDocument();
  });
});
