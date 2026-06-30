import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { HomePage } from "./HomePage";

describe("HomePage", () => {
  it("shows GitHub and latest release links on the dashboard", () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    expect(screen.getByText(/GitHub에서 Windows 실행 파일/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "로컬 앱 다운로드" })).toHaveAttribute(
      "href",
      "https://github.com/boboseong/sugangcheck/releases/latest"
    );
    expect(screen.getByRole("link", { name: "GitHub 저장소" })).toHaveAttribute(
      "href",
      "https://github.com/boboseong/sugangcheck"
    );
  });
});
