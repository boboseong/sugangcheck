import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { ValidationResultsPage } from "./ValidationResultsPage";

const validationRunMocks = vi.hoisted(() => ({
  confirmationMessage: "일부 학기만 기준으로 점검합니다.",
  runValidation: vi.fn()
}));

vi.mock("../hooks/useValidationRun", () => ({
  useValidationRun: () => ({
    buildIssues: [],
    canRunValidation: true,
    confirmationMessage: validationRunMocks.confirmationMessage,
    runValidation: validationRunMocks.runValidation
  })
}));

vi.mock("../state/validationResultStore", () => ({
  useValidationResultStore: () => ({
    lastValidationResult: undefined,
    validationErrors: []
  })
}));

describe("ValidationResultsPage", () => {
  it("opens the validation confirmation from dashboard navigation", async () => {
    render(
      <MemoryRouter initialEntries={["/results?confirmValidation=1"]}>
        <Routes>
          <Route path="/results" element={<ValidationResultsPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByRole("alert")).toHaveTextContent(
      validationRunMocks.confirmationMessage
    );
  });
});
