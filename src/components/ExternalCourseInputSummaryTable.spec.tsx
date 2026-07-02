import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { ExternalCourseInput } from "../types/courseSelection";
import { ExternalCourseInputSummaryTable } from "./ExternalCourseInputSummaryTable";

const input: ExternalCourseInput = {
  id: "external-1",
  studentId: "student-1",
  studentNo: "20101",
  studentName: "김전입",
  target: { grade: 2, semester: 1 },
  subjectName: "물리학",
  normalizedSubjectName: "물리학",
  choiceGroup: "과학 선택",
  groupType: "선택",
  subjectGroup: "과학",
  selectionType: "진로선택",
  credits: 3,
  sourceType: "externalCourse",
  sourceName: "공동교육과정",
  memo: "확인 완료",
  updatedAt: "2026-07-02T00:00:00.000Z"
};

describe("ExternalCourseInputSummaryTable", () => {
  it("shows all saved external course inputs with student identity", () => {
    render(
      <ExternalCourseInputSummaryTable inputs={[input]} onRemoveInput={vi.fn()} />
    );

    expect(screen.getByText("총 1건")).toBeInTheDocument();
    expect(screen.getByText("20101")).toBeInTheDocument();
    expect(screen.getByText("김전입")).toBeInTheDocument();
    expect(screen.getByText("2학년 1학기")).toBeInTheDocument();
    expect(screen.getByText("물리학")).toBeInTheDocument();
    expect(screen.getByText("외부 이수")).toBeInTheDocument();
  });

  it("keeps row deletion available without direct-input wording", () => {
    const onRemoveInput = vi.fn();

    render(
      <ExternalCourseInputSummaryTable
        inputs={[input]}
        onRemoveInput={onRemoveInput}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "입력 행 삭제" }));

    expect(onRemoveInput).toHaveBeenCalledWith("external-1");
    expect(screen.queryByText("직접 입력")).not.toBeInTheDocument();
  });
});
