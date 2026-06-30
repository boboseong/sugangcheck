import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { StudentSelectionAnalysisPage } from "./StudentSelectionAnalysisPage";

describe("StudentSelectionAnalysisPage", () => {
  it("links to the student-selection analysis pages", () => {
    render(
      <MemoryRouter>
        <StudentSelectionAnalysisPage />
      </MemoryRouter>
    );

    expect(screen.getByRole("link", { name: "과목별 수강생" })).toHaveAttribute(
      "href",
      "/subject-enrollment"
    );
    expect(screen.getByRole("link", { name: "미중복 선택 과목" })).toHaveAttribute(
      "href",
      "/non-overlapping-subjects"
    );
    expect(screen.getByRole("link", { name: "세부 분석" })).toHaveAttribute(
      "href",
      "/detailed-selection-analysis"
    );
  });
});
