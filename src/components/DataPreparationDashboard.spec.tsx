import { fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { DataPreparationDashboard } from "./DataPreparationDashboard";
import type {
  DataPreparationIssue,
  DataPreparationStatus,
  ImportStatus
} from "../types/importStatus";

const emptyCounts: Record<ImportStatus, number> = {
  empty: 6,
  imported: 0,
  error: 0,
  needsReview: 0
};

type StatusInput = Partial<
  Pick<
    DataPreparationStatus,
    | "availablePartialSemesters"
    | "canRunFullValidation"
    | "canRunPartialValidation"
    | "checkedAt"
  >
> & {
  operatingSubjectsByStatus?: Record<ImportStatus, number>;
  courseSelectionsByStatus?: Record<ImportStatus, number>;
  issues?: DataPreparationIssue[];
};

function createStatus(input: StatusInput = {}): DataPreparationStatus {
  return {
    checkedAt: input.checkedAt ?? "2026-07-01T00:00:00.000Z",
    canRunFullValidation: input.canRunFullValidation ?? false,
    canRunPartialValidation: input.canRunPartialValidation ?? false,
    availablePartialSemesters: input.availablePartialSemesters ?? [],
    counts: {
      operatingSubjectsByStatus:
        input.operatingSubjectsByStatus ?? emptyCounts,
      courseSelectionsByStatus:
        input.courseSelectionsByStatus ?? emptyCounts,
      unregisteredOperatingSubjectCount: 0,
      unknownStudentSemesterCount: 0,
      absentStudentSemesterCount: 0,
      missingExternalCourseStudentCount: 0,
      missingCreditSubjectCount: 0,
      incompleteExternalCourseInputCount: 0,
      pendingPrerequisiteCandidateCount: 0
    },
    issues: input.issues ?? []
  };
}

function renderDashboard(status: DataPreparationStatus) {
  render(
    <MemoryRouter>
      <DataPreparationDashboard
        hasValidationResult={false}
        onCancelValidationConfirmation={vi.fn()}
        onCourseSelectionFilesSelected={vi.fn()}
        onConfirmValidation={vi.fn()}
        onOperatingSubjectFilesSelected={vi.fn()}
        onRunValidation={vi.fn()}
        showValidationConfirmation={false}
        status={status}
      />
    </MemoryRouter>
  );
}

function card(title: string): HTMLElement {
  const heading = screen.getByRole("heading", { name: title });
  const element = heading.closest("article");

  expect(element).not.toBeNull();
  return element!;
}

describe("DataPreparationDashboard", () => {
  it("opens upload modals on empty upload cards without navigating tabs", () => {
    renderDashboard(createStatus());

    fireEvent.click(
      within(card("운영과목 업로드")).getByRole("button", {
        name: "운영과목 업로드"
      })
    );
    expect(
      screen.getByRole("dialog", { name: "업로드/불러오기" })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/운영과목 관리.*엑셀/s)
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "닫기" }));
    fireEvent.click(
      within(card("수강신청 업로드")).getByRole("button", {
        name: "수강신청 업로드"
      })
    );
    expect(
      screen.getByRole("dialog", { name: "업로드/불러오기" })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/수강신청 결과.*엑셀/s)
    ).toBeInTheDocument();
  });

  it("renames problem upload cards to tab navigation", () => {
    renderDashboard(
      createStatus({
        operatingSubjectsByStatus: {
          empty: 5,
          imported: 0,
          error: 0,
          needsReview: 1
        },
        courseSelectionsByStatus: {
          empty: 5,
          imported: 0,
          error: 1,
          needsReview: 0
        }
      })
    );

    expect(
      within(card("운영과목 업로드")).getByRole("link", {
        name: "해당 탭으로 이동"
      })
    ).toHaveAttribute("href", "/operating-subjects");
    expect(
      within(card("수강신청 업로드")).getByRole("link", {
        name: "해당 탭으로 이동"
      })
    ).toHaveAttribute("href", "/course-selections");
  });
});
