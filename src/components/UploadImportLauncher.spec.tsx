import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import type { ReactElement } from "react";
import { MemoryRouter } from "react-router-dom";
import type { Mock } from "vitest";
import { UploadImportLauncher } from "./UploadImportLauncher";
import { CourseSelectionsPage } from "../pages/CourseSelectionsPage";
import { OperatingSubjectsPage } from "../pages/OperatingSubjectsPage";
import { useValidationResultStore } from "../state/validationResultStore";
import type { ValidationEngineResult } from "../validation/types";

const projectWorkspaceMocks = vi.hoisted(() => ({
  clearDerivedValidationState: vi.fn(),
  importProjectSection: vi.fn(() => ({ skippedExternalCourseInputCount: 0 })),
  importProjectSectionSemester: vi.fn(() => ({
    skippedExternalCourseInputCount: 0
  })),
  saveCurrentProjectSnapshot: vi.fn(() => Promise.resolve(undefined))
}));

vi.mock("../storage/indexedDbStorage", () => ({
  listProjectRecords: vi.fn(() => Promise.resolve([])),
  loadProjectRecord: vi.fn()
}));

vi.mock("../state/projectWorkspace", () => projectWorkspaceMocks);

const confirmationMessage =
  "기존 점검 결과가 삭제됩니다. 계속하시겠습니까?";

const validationResult: ValidationEngineResult = {
  durationMs: 1,
  errors: [],
  executedRuleIds: [],
  skippedRuleIds: []
};

function resetValidationResultStore() {
  useValidationResultStore.setState({
    lastValidationResult: undefined,
    validationErrors: []
  });
}

function renderLauncher(input?: {
  clearResults?: Mock<() => void>;
  shouldConfirm?: boolean;
}) {
  const onFilesSelected = vi.fn(() => Promise.resolve());
  const clearResults = input?.clearResults ?? vi.fn<() => void>();
  const view = render(
    <UploadImportLauncher
      fileUploadConfirmation={{
        message: confirmationMessage,
        onConfirmedFileSelection: clearResults,
        shouldConfirm: input?.shouldConfirm ?? true
      }}
      onFilesSelected={onFilesSelected}
      section="courseSelections"
    />
  );

  fireEvent.click(screen.getByRole("button", { name: "업로드/불러오기" }));

  return { ...view, clearResults, onFilesSelected };
}

function autoUploadInput(container: HTMLElement): HTMLInputElement {
  const input = container.querySelector(
    'input[type="file"][multiple]'
  ) as HTMLInputElement | null;

  expect(input).not.toBeNull();
  return input!;
}

function renderInRouter(element: ReactElement) {
  return render(<MemoryRouter>{element}</MemoryRouter>);
}

describe("UploadImportLauncher", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetValidationResultStore();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    resetValidationResultStore();
  });

  it("asks before either file upload button when confirmation is required", () => {
    const clickSpy = vi
      .spyOn(HTMLInputElement.prototype, "click")
      .mockImplementation(() => undefined);
    renderLauncher();

    fireEvent.click(screen.getByRole("button", { name: "전체 학기 업로드" }));
    expect(clickSpy).not.toHaveBeenCalled();
    expect(
      screen.getByRole("alertdialog", { name: "업로드 확인" })
    ).toHaveTextContent(confirmationMessage);

    fireEvent.click(screen.getByRole("button", { name: "취소" }));
    fireEvent.click(screen.getByRole("button", { name: "선택 학기 업로드" }));
    expect(clickSpy).not.toHaveBeenCalled();
    expect(
      screen.getByRole("alertdialog", { name: "업로드 확인" })
    ).toHaveTextContent(confirmationMessage);
  });

  it("does not clear or upload when the confirmation is canceled", () => {
    const { clearResults, onFilesSelected } = renderLauncher();

    fireEvent.click(screen.getByRole("button", { name: "전체 학기 업로드" }));
    fireEvent.click(screen.getByRole("button", { name: "취소" }));

    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
    expect(clearResults).not.toHaveBeenCalled();
    expect(onFilesSelected).not.toHaveBeenCalled();
  });

  it("does not clear or upload when the confirmed file picker returns no files", () => {
    const clickSpy = vi
      .spyOn(HTMLInputElement.prototype, "click")
      .mockImplementation(() => undefined);
    const { clearResults, container, onFilesSelected } = renderLauncher();

    fireEvent.click(screen.getByRole("button", { name: "전체 학기 업로드" }));
    fireEvent.click(
      within(screen.getByRole("alertdialog", { name: "업로드 확인" })).getByRole(
        "button",
        { name: "계속" }
      )
    );
    fireEvent.change(autoUploadInput(container), { target: { files: [] } });

    expect(clickSpy).toHaveBeenCalledTimes(1);
    expect(clearResults).not.toHaveBeenCalled();
    expect(onFilesSelected).not.toHaveBeenCalled();
  });

  it("clears existing results before uploading after confirmation", async () => {
    vi.spyOn(HTMLInputElement.prototype, "click").mockImplementation(
      () => undefined
    );
    const file = new File(["fixture"], "fixture.xlsx");
    const { clearResults, container, onFilesSelected } = renderLauncher();

    fireEvent.click(screen.getByRole("button", { name: "전체 학기 업로드" }));
    fireEvent.click(
      within(screen.getByRole("alertdialog", { name: "업로드 확인" })).getByRole(
        "button",
        { name: "계속" }
      )
    );
    fireEvent.change(autoUploadInput(container), { target: { files: [file] } });

    await waitFor(() => expect(onFilesSelected).toHaveBeenCalledWith([file]));
    expect(clearResults).toHaveBeenCalledTimes(1);
    expect(clearResults.mock.invocationCallOrder[0]!).toBeLessThan(
      onFilesSelected.mock.invocationCallOrder[0]!
    );
  });

  it("uploads without confirmation when there is no existing validation result", async () => {
    const clickSpy = vi
      .spyOn(HTMLInputElement.prototype, "click")
      .mockImplementation(() => undefined);
    const clearResults = vi.fn();
    const file = new File(["fixture"], "fixture.xlsx");
    const { container, onFilesSelected } = renderLauncher({
      clearResults,
      shouldConfirm: false
    });

    fireEvent.click(screen.getByRole("button", { name: "전체 학기 업로드" }));
    expect(clickSpy).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();

    fireEvent.change(autoUploadInput(container), { target: { files: [file] } });

    await waitFor(() => expect(onFilesSelected).toHaveBeenCalledWith([file]));
    expect(clearResults).not.toHaveBeenCalled();
  });

  it("opens itself from a custom trigger", () => {
    render(
      <UploadImportLauncher
        onFilesSelected={vi.fn()}
        section="courseSelections"
        triggerLabel="수강신청 업로드"
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "수강신청 업로드" }));
    expect(
      screen.getByRole("dialog", { name: "업로드/불러오기" })
    ).toBeInTheDocument();
  });

  it("connects the confirmation to operating-subject and course-selection pages", () => {
    useValidationResultStore.setState({
      lastValidationResult: validationResult,
      validationErrors: []
    });

    const operatingSubjectsView = renderInRouter(<OperatingSubjectsPage />);
    fireEvent.click(screen.getByRole("button", { name: "업로드/불러오기" }));
    fireEvent.click(screen.getByRole("button", { name: "전체 학기 업로드" }));
    expect(screen.getByText(confirmationMessage)).toBeInTheDocument();
    operatingSubjectsView.unmount();

    renderInRouter(<CourseSelectionsPage />);
    fireEvent.click(screen.getByRole("button", { name: "업로드/불러오기" }));
    fireEvent.click(screen.getByRole("button", { name: "전체 학기 업로드" }));
    expect(screen.getByText(confirmationMessage)).toBeInTheDocument();
  });

  it("connects the clear confirmation to operating-subject and course-selection pages", () => {
    useValidationResultStore.setState({
      lastValidationResult: validationResult,
      validationErrors: []
    });

    const operatingSubjectsView = renderInRouter(<OperatingSubjectsPage />);
    fireEvent.click(
      screen.getByRole("button", { name: "1학년 1학기 파일 비우기" })
    );
    expect(screen.getByText(confirmationMessage)).toBeInTheDocument();
    fireEvent.click(
      within(screen.getByRole("alertdialog", { name: "삭제 확인" })).getByRole(
        "button",
        { name: "계속" }
      )
    );
    expect(projectWorkspaceMocks.clearDerivedValidationState).toHaveBeenCalledTimes(
      1
    );
    operatingSubjectsView.unmount();

    vi.clearAllMocks();
    useValidationResultStore.setState({
      lastValidationResult: validationResult,
      validationErrors: []
    });

    renderInRouter(<CourseSelectionsPage />);
    fireEvent.click(
      screen.getByRole("button", { name: "1학년 1학기 파일 비우기" })
    );
    expect(screen.getByText(confirmationMessage)).toBeInTheDocument();
    fireEvent.click(
      within(screen.getByRole("alertdialog", { name: "삭제 확인" })).getByRole(
        "button",
        { name: "계속" }
      )
    );
    expect(projectWorkspaceMocks.clearDerivedValidationState).toHaveBeenCalledTimes(
      1
    );
  });
});
