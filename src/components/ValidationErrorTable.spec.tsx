import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { ValidationError } from "../types/validation";
import {
  ValidationErrorTable,
  validationErrorPageSize
} from "./ValidationErrorTable";

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

function manyErrors(count: number): ValidationError[] {
  return Array.from({ length: count }, (_, index) => ({
    ...errors[0]!,
    id: `error-${index}`,
    studentNo: String(10000 + index),
    message: `점검 오류 ${index}`
  }));
}

describe("ValidationErrorTable", () => {
  it("does not render a separate semester column", () => {
    render(
      <ValidationErrorTable
        errors={errors}
        onOpenStudentReport={vi.fn()}
        onPageChange={vi.fn()}
        page={0}
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

  it("renders only one page of errors at a time", () => {
    render(
      <ValidationErrorTable
        errors={manyErrors(validationErrorPageSize + 1)}
        onOpenStudentReport={vi.fn()}
        onPageChange={vi.fn()}
        page={0}
      />
    );

    expect(screen.getAllByRole("row")).toHaveLength(validationErrorPageSize + 1);
    expect(screen.getByText("점검 오류 0")).toBeInTheDocument();
    expect(screen.queryByText(`점검 오류 ${validationErrorPageSize}`)).toBeNull();
  });

  it("shows the remaining errors on the next page", () => {
    render(
      <ValidationErrorTable
        errors={manyErrors(validationErrorPageSize + 1)}
        onOpenStudentReport={vi.fn()}
        onPageChange={vi.fn()}
        page={1}
      />
    );

    expect(screen.getByText(`점검 오류 ${validationErrorPageSize}`)).toBeInTheDocument();
    expect(screen.queryByText("점검 오류 0")).toBeNull();
  });

  it("asks for the next page when 다음 is pressed", () => {
    const onPageChange = vi.fn();

    render(
      <ValidationErrorTable
        errors={manyErrors(validationErrorPageSize + 1)}
        onOpenStudentReport={vi.fn()}
        onPageChange={onPageChange}
        page={0}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "다음" }));

    expect(onPageChange).toHaveBeenCalledWith(1);
  });

  it("hides the pagination controls when everything fits on one page", () => {
    render(
      <ValidationErrorTable
        errors={errors}
        onOpenStudentReport={vi.fn()}
        onPageChange={vi.fn()}
        page={0}
      />
    );

    expect(screen.queryByRole("button", { name: "다음" })).toBeNull();
  });
});
