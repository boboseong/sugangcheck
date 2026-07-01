import { fireEvent, render, screen, within } from "@testing-library/react";
import type { Mock } from "vitest";
import { SemesterUploadSlots } from "./SemesterUploadSlots";
import type { Semester } from "../types/semester";

const confirmationMessage =
  "기존 점검 결과가 삭제됩니다. 계속하시겠습니까?";
const targetLabel = "1학년 1학기 파일 비우기";

function renderSlots(input?: {
  clearResults?: Mock<() => void>;
  shouldConfirm?: boolean;
}) {
  const clearResults = input?.clearResults ?? vi.fn<() => void>();
  const onClearSemester = vi.fn<(target: Semester) => void>();
  const onFilesSelected = vi.fn<
    (files: File[], target?: Semester) => void | Promise<void>
  >();

  render(
    <SemesterUploadSlots
      clearConfirmation={{
        message: confirmationMessage,
        onConfirmedClear: clearResults,
        shouldConfirm: input?.shouldConfirm ?? true
      }}
      onClearSemester={onClearSemester}
      onFilesSelected={onFilesSelected}
      sourceType="operatingSubjects"
      statuses={[]}
    />
  );

  return { clearResults, onClearSemester };
}

describe("SemesterUploadSlots", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("asks before clearing a semester when confirmation is required", () => {
    renderSlots();

    fireEvent.click(screen.getByRole("button", { name: targetLabel }));

    expect(
      screen.getByRole("alertdialog", { name: "삭제 확인" })
    ).toHaveTextContent(confirmationMessage);
  });

  it("does not clear the semester or results when the confirmation is canceled", () => {
    const { clearResults, onClearSemester } = renderSlots();

    fireEvent.click(screen.getByRole("button", { name: targetLabel }));
    fireEvent.click(
      within(screen.getByRole("alertdialog", { name: "삭제 확인" })).getByRole(
        "button",
        { name: "취소" }
      )
    );

    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
    expect(clearResults).not.toHaveBeenCalled();
    expect(onClearSemester).not.toHaveBeenCalled();
  });

  it("clears existing results before clearing the semester after confirmation", () => {
    const { clearResults, onClearSemester } = renderSlots();

    fireEvent.click(screen.getByRole("button", { name: targetLabel }));
    fireEvent.click(
      within(screen.getByRole("alertdialog", { name: "삭제 확인" })).getByRole(
        "button",
        { name: "계속" }
      )
    );

    expect(clearResults).toHaveBeenCalledTimes(1);
    expect(onClearSemester).toHaveBeenCalledWith({ grade: 1, semester: 1 });
    expect(clearResults.mock.invocationCallOrder[0]!).toBeLessThan(
      onClearSemester.mock.invocationCallOrder[0]!
    );
  });

  it("clears the semester immediately when there is no existing validation result", () => {
    const clearResults = vi.fn();
    const { onClearSemester } = renderSlots({
      clearResults,
      shouldConfirm: false
    });

    fireEvent.click(screen.getByRole("button", { name: targetLabel }));

    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
    expect(clearResults).not.toHaveBeenCalled();
    expect(onClearSemester).toHaveBeenCalledWith({ grade: 1, semester: 1 });
  });
});
