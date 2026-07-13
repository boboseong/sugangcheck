import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ValidationError } from "../types/validation";
import type { ValidationEngineResult } from "../validation/types";
import { ValidationResultsPage } from "./ValidationResultsPage";

const validationRunMocks = vi.hoisted(() => ({
  confirmationMessage: "일부 학기만 기준으로 점검합니다.",
  runValidation: vi.fn()
}));
const validationResultMocks = vi.hoisted(() => ({
  lastValidationResult: undefined as ValidationEngineResult | undefined,
  resultRevision: undefined as number | undefined,
  validationErrors: [] as ValidationError[]
}));
const validationRevisionMocks = vi.hoisted(() => ({ inputRevision: 0 }));
const downloadMocks = vi.hoisted(() => ({
  downloadBlob: vi.fn(() => Promise.resolve())
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
  useValidationResultStore: () => validationResultMocks
}));

vi.mock("../state/validationRevisionStore", () => ({
  useValidationRevisionStore: (
    selector: (state: { inputRevision: number }) => unknown
  ) => selector(validationRevisionMocks)
}));

vi.mock("../utils/downloadBlob", () => ({
  downloadBlob: downloadMocks.downloadBlob
}));

const error: ValidationError = {
  id: "error-1",
  ruleId: "minimumCredits",
  type: "minimumCredits",
  studentId: "student-1",
  studentNo: "10101",
  studentName: "김학생",
  message: "최소 학점 오류",
  relatedRecordIds: []
};

function validationResult(): ValidationEngineResult {
  return {
    errors: [error],
    executedRuleIds: ["minimumCredits"],
    skippedRuleIds: [],
    durationMs: 1
  };
}

function renderResults(initialEntry = "/results") {
  render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route path="/results" element={<ValidationResultsPage />} />
      </Routes>
    </MemoryRouter>
  );
}

describe("ValidationResultsPage", () => {
  beforeEach(() => {
    validationResultMocks.lastValidationResult = undefined;
    validationResultMocks.resultRevision = undefined;
    validationResultMocks.validationErrors = [];
    validationRevisionMocks.inputRevision = 0;
    downloadMocks.downloadBlob.mockClear();
    validationRunMocks.runValidation.mockClear();
  });

  it("opens the validation confirmation from dashboard navigation", async () => {
    renderResults("/results?confirmValidation=1");

    expect(await screen.findByRole("alert")).toHaveTextContent(
      validationRunMocks.confirmationMessage
    );
  });

  it("keeps stale errors visible but blocks their export", () => {
    validationResultMocks.lastValidationResult = validationResult();
    validationResultMocks.resultRevision = 1;
    validationResultMocks.validationErrors = [error];
    validationRevisionMocks.inputRevision = 2;

    renderResults();

    expect(screen.getByRole("alert")).toHaveTextContent(
      "입력 자료가 변경되었습니다. 다시 점검해 주세요."
    );
    expect(screen.getByText(error.message)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "오류 명렬 다운로드" })
    ).toBeDisabled();
    expect(downloadMocks.downloadBlob).not.toHaveBeenCalled();
  });

  it("allows export when the result revision matches the current input", async () => {
    validationResultMocks.lastValidationResult = validationResult();
    validationResultMocks.resultRevision = 2;
    validationResultMocks.validationErrors = [error];
    validationRevisionMocks.inputRevision = 2;

    renderResults();

    const downloadButton = screen.getByRole("button", {
      name: "오류 명렬 다운로드"
    });

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(downloadButton).toBeEnabled();
    fireEvent.click(downloadButton);
    await waitFor(() => expect(downloadMocks.downloadBlob).toHaveBeenCalledTimes(1));
  });
});
