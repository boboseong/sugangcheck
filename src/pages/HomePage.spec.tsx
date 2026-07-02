import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { HomePage } from "./HomePage";
import type { DataPreparationStatus } from "../types/importStatus";
import type { ValidationEngineResult } from "../validation/types";

const completeStatus: DataPreparationStatus = {
  checkedAt: "2026-07-01T00:00:00.000Z",
  canRunFullValidation: true,
  canRunPartialValidation: true,
  availablePartialSemesters: [],
  counts: {
    operatingSubjectsByStatus: {
      empty: 0,
      imported: 6,
      error: 0,
      needsReview: 0
    },
    courseSelectionsByStatus: {
      empty: 0,
      imported: 6,
      error: 0,
      needsReview: 0
    },
    unregisteredOperatingSubjectCount: 0,
    unknownStudentSemesterCount: 0,
    absentStudentSemesterCount: 0,
    missingExternalCourseStudentCount: 0,
    missingCreditSubjectCount: 0,
    incompleteExternalCourseInputCount: 0,
    pendingPrerequisiteCandidateCount: 0
  },
  issues: []
};

const validationRunMocks = vi.hoisted(() => ({
  confirmationMessage: undefined as string | undefined,
  runValidation: vi.fn()
}));

const courseSelectionImportMocks = vi.hoisted(() => ({
  canCompletePendingOperatingSubjectCompletions: false,
  completePendingOperatingSubjectCompletions: vi.fn(),
  handleFilesSelected: vi.fn(),
  pendingOperatingSubjectCompletions: [] as unknown[],
  setPendingOperatingSubjectCompletionDecision: vi.fn()
}));

vi.mock("../hooks/useCourseSelectionImport", () => ({
  useCourseSelectionImport: () => ({
    canCompletePendingOperatingSubjectCompletions:
      courseSelectionImportMocks.canCompletePendingOperatingSubjectCompletions,
    completePendingOperatingSubjectCompletions:
      courseSelectionImportMocks.completePendingOperatingSubjectCompletions,
    handleFilesSelected: courseSelectionImportMocks.handleFilesSelected,
    pendingOperatingSubjectCompletions:
      courseSelectionImportMocks.pendingOperatingSubjectCompletions,
    setPendingOperatingSubjectCompletionDecision:
      courseSelectionImportMocks.setPendingOperatingSubjectCompletionDecision
  })
}));

vi.mock("../hooks/useOperatingSubjectImport", () => ({
  useOperatingSubjectImport: () => ({ handleFilesSelected: vi.fn() })
}));

vi.mock("../hooks/useValidationRun", () => ({
  useValidationRun: () => ({
    buildIssues: [],
    canRunValidation: true,
    confirmationMessage: validationRunMocks.confirmationMessage,
    dataPreparationStatus: completeStatus,
    runValidation: validationRunMocks.runValidation
  })
}));

vi.mock("../state/validationResultStore", () => ({
  useValidationResultStore: () => ({ lastValidationResult: undefined })
}));

function validationResult(): ValidationEngineResult {
  return {
    durationMs: 1,
    errors: [],
    executedRuleIds: [],
    skippedRuleIds: []
  };
}

function RouteLocation() {
  const location = useLocation();

  return <div>{`${location.pathname}${location.search}`}</div>;
}

function renderHomeWithRoutes() {
  render(
    <MemoryRouter initialEntries={["/"]}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/results" element={<RouteLocation />} />
      </Routes>
    </MemoryRouter>
  );
}

describe("HomePage", () => {
  beforeEach(() => {
    courseSelectionImportMocks.canCompletePendingOperatingSubjectCompletions = false;
    courseSelectionImportMocks.completePendingOperatingSubjectCompletions.mockClear();
    courseSelectionImportMocks.handleFilesSelected.mockClear();
    courseSelectionImportMocks.pendingOperatingSubjectCompletions = [];
    courseSelectionImportMocks.setPendingOperatingSubjectCompletionDecision.mockClear();
    validationRunMocks.confirmationMessage = undefined;
    validationRunMocks.runValidation.mockReturnValue({
      buildResult: { records: [], issues: [] },
      validationResult: validationResult()
    });
  });

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

  it("moves to the results tab with confirmation when validation needs guidance", () => {
    validationRunMocks.confirmationMessage = "일부 학기만 기준으로 점검합니다.";
    renderHomeWithRoutes();

    fireEvent.click(screen.getByRole("button", { name: "점검" }));

    expect(screen.getByText("/results?confirmValidation=1")).toBeInTheDocument();
    expect(validationRunMocks.runValidation).not.toHaveBeenCalled();
  });

  it("runs validation immediately when no guidance is needed", () => {
    renderHomeWithRoutes();

    fireEvent.click(screen.getByRole("button", { name: "점검" }));

    expect(screen.getByText("/results")).toBeInTheDocument();
    expect(validationRunMocks.runValidation).toHaveBeenCalledTimes(1);
  });

  it("shows the missing operating-subject O/X dialog on the dashboard upload flow", () => {
    courseSelectionImportMocks.pendingOperatingSubjectCompletions = [
      {
        id: "pending-1-1",
        target: { grade: 1, semester: 1 },
        fileName: "2025년1학년1학기_수강신청결과_20250910.xls",
        subjects: [
          {
            id: "common-korean",
            target: { grade: 1, semester: 1 },
            subjectName: "공통국어1",
            normalizedSubjectName: "공통국어 1",
            choiceGroup: "학교지정",
            credits: 4
          }
        ],
        baseRows: [],
        generatedRowsBySubjectId: {},
        baseMessageParts: [],
        baseNeedsReview: false
      }
    ];

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    const dialog = screen.getByRole("alertdialog", {
      name: "누락 운영과목 확인"
    });

    expect(dialog).toHaveTextContent("공통국어1");
    expect(dialog).toHaveTextContent("1-1");

    fireEvent.click(screen.getByRole("button", { name: "O" }));

    expect(
      courseSelectionImportMocks.setPendingOperatingSubjectCompletionDecision
    ).toHaveBeenCalledWith("pending-1-1", "common-korean", "all");
  });
});
