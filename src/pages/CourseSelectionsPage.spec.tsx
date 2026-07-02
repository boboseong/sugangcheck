import { fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import type {
  PendingOperatingSubjectCompletion,
  PendingOperatingSubjectCompletionDecision
} from "../hooks/useCourseSelectionImport";
import { useValidationResultStore } from "../state/validationResultStore";
import { CourseSelectionsPage } from "./CourseSelectionsPage";

const courseSelectionImportMock = vi.hoisted(() => ({
  completePendingOperatingSubjectCompletions: vi.fn(),
  setPendingOperatingSubjectCompletionDecision: vi.fn()
}));

vi.mock("../state/projectWorkspace", () => ({
  clearDerivedValidationState: vi.fn()
}));

vi.mock("../hooks/useCourseSelectionImport", () => ({
  useCourseSelectionImport: () => ({
    canCompletePendingOperatingSubjectCompletions: false,
    completePendingOperatingSubjectCompletions:
      courseSelectionImportMock.completePendingOperatingSubjectCompletions,
    courseSelectionRows: [],
    handleClearSemester: vi.fn(),
    handleDownloadTemplate: vi.fn(),
    handleFilesSelected: vi.fn(),
    importStatuses: [],
    pendingOperatingSubjectCompletions: [
      {
        id: "pending-2-1",
        target: { grade: 2, semester: 1 },
        fileName: "2학년1학기_수강신청결과.xlsx",
        subjects: [
          {
            id: "korean-history",
            target: { grade: 2, semester: 1 },
            subjectName: "한국사",
            normalizedSubjectName: "한국사",
            choiceGroup: "학교 지정",
            credits: 3
          },
          {
            id: "biology",
            target: { grade: 2, semester: 1 },
            subjectName: "생명과학",
            normalizedSubjectName: "생명과학",
            choiceGroup: "학생선택",
            credits: 3,
            decision: "none" as PendingOperatingSubjectCompletionDecision
          }
        ],
        baseRows: [],
        generatedRowsBySubjectId: {},
        baseMessageParts: [],
        baseNeedsReview: false
      } satisfies PendingOperatingSubjectCompletion
    ],
    preview: undefined,
    setPendingOperatingSubjectCompletionDecision:
      courseSelectionImportMock.setPendingOperatingSubjectCompletionDecision,
    studentSemesterPresence: []
  })
}));

function renderPage() {
  return render(
    <MemoryRouter>
      <CourseSelectionsPage />
    </MemoryRouter>
  );
}

describe("CourseSelectionsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useValidationResultStore.setState({
      lastValidationResult: undefined,
      validationErrors: []
    });
  });

  it("shows missing operating subjects in a semester subject O/X table", () => {
    renderPage();

    const dialog = screen.getByRole("alertdialog", {
      name: "누락 운영과목 확인"
    });

    expect(dialog).toHaveTextContent(
      "운영과목에는 있지만, 수강신청결과에는 없는 과목 있습니다."
    );
    expect(within(dialog).getByRole("columnheader", { name: "학기" })).toBeVisible();
    expect(
      within(dialog).getByRole("columnheader", { name: "과목명" })
    ).toBeVisible();
    expect(
      within(dialog).getByRole("columnheader", { name: "모두 이수" })
    ).toBeVisible();
    expect(within(dialog).getAllByText("2-1")).toHaveLength(2);
    expect(within(dialog).getByText("한국사")).toBeVisible();
    expect(within(dialog).getByText("생명과학")).toBeVisible();
    expect(within(dialog).getByRole("button", { name: "완료" })).toBeDisabled();

    fireEvent.click(within(dialog).getAllByRole("button", { name: "O" })[0]!);

    expect(
      courseSelectionImportMock.setPendingOperatingSubjectCompletionDecision
    ).toHaveBeenCalledWith("pending-2-1", "korean-history", "all");
  });
});
