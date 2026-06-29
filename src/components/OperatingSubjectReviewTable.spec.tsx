import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { Semester } from "../types/semester";
import type { OperatingSubject } from "../types/subject";
import { OperatingSubjectReviewTable } from "./OperatingSubjectReviewTable";

function createSubject(input: {
  id: string;
  target: Semester;
  subjectName: string;
  masterMatchStatus: OperatingSubject["masterMatchStatus"];
}): OperatingSubject {
  return {
    id: input.id,
    target: input.target,
    subjectName: input.subjectName,
    normalizedSubjectName: input.subjectName.replace(/\s/g, ""),
    subjectGroup: "과학",
    selectionType: "일반선택",
    groupType: "선택",
    credits: 2,
    masterMatchStatus: input.masterMatchStatus
  };
}

const subjects = [
  createSubject({
    id: "matched",
    target: { grade: 1, semester: 1 },
    subjectName: "감마일치",
    masterMatchStatus: "matched"
  }),
  createSubject({
    id: "manual",
    target: { grade: 1, semester: 2 },
    subjectName: "베타수정",
    masterMatchStatus: "manual"
  }),
  createSubject({
    id: "unmatched",
    target: { grade: 2, semester: 1 },
    subjectName: "알파미등록",
    masterMatchStatus: "unmatched"
  })
];

describe("OperatingSubjectReviewTable", () => {
  it("defaults to the all-subject filter", () => {
    render(
      <OperatingSubjectReviewTable
        onUpdateSubject={vi.fn()}
        subjects={subjects}
      />
    );

    expect(screen.getByDisplayValue("전체")).toBeInTheDocument();
    expect(screen.getByText("알파미등록")).toBeInTheDocument();
    expect(screen.getByText("베타수정")).toBeInTheDocument();
    expect(screen.getByText("감마일치")).toBeInTheDocument();
  });

  it("keeps unmatched subjects first when viewing all rows", () => {
    render(
      <OperatingSubjectReviewTable
        onUpdateSubject={vi.fn()}
        subjects={subjects}
      />
    );

    const firstBodyRow = screen.getAllByRole("row").slice(1)[0];

    expect(firstBodyRow).toBeDefined();
    expect(within(firstBodyRow as HTMLElement).getByText("알파미등록")).toBeInTheDocument();
  });

  it("places the edit action in the first table column", () => {
    render(
      <OperatingSubjectReviewTable
        onUpdateSubject={vi.fn()}
        subjects={subjects}
      />
    );

    expect(screen.getAllByRole("columnheader")[0]).toHaveTextContent("수정");
  });
});
