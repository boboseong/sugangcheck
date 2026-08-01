import { fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import type {
  PendingOperatingSubjectCompletion,
  PendingOperatingSubjectCompletionDecision
} from "../hooks/useCourseSelectionImport";
import type { ParsedCourseSelectionRow } from "../types/courseSelection";
import { semesterKeys } from "../types/semester";
import type { StudentSemesterPresence } from "../types/student";
import { useValidationResultStore } from "../state/validationResultStore";
import { CourseSelectionsPage } from "./CourseSelectionsPage";

const courseSelectionImportMock = vi.hoisted(() => ({
  completePendingOperatingSubjectCompletions: vi.fn(),
  courseSelectionRows: [] as ParsedCourseSelectionRow[],
  pendingOperatingSubjectCompletions: [] as PendingOperatingSubjectCompletion[],
  setPendingOperatingSubjectCompletionDecision: vi.fn(),
  studentSemesterPresence: [] as StudentSemesterPresence[]
}));

vi.mock("../state/projectWorkspace", () => ({
  clearDerivedValidationState: vi.fn()
}));

vi.mock("../hooks/useCourseSelectionImport", () => ({
  useCourseSelectionImport: () => ({
    canCompletePendingOperatingSubjectCompletions: false,
    completePendingOperatingSubjectCompletions:
      courseSelectionImportMock.completePendingOperatingSubjectCompletions,
    courseSelectionRows: courseSelectionImportMock.courseSelectionRows,
    handleClearSemester: vi.fn(),
    handleDownloadTemplate: vi.fn(),
    handleFilesSelected: vi.fn(),
    importStatuses: [],
    pendingOperatingSubjectCompletions:
      courseSelectionImportMock.pendingOperatingSubjectCompletions,
    preview: undefined,
    setPendingOperatingSubjectCompletionDecision:
      courseSelectionImportMock.setPendingOperatingSubjectCompletionDecision,
    studentSemesterPresence: courseSelectionImportMock.studentSemesterPresence
  })
}));

function createPendingCompletion(): PendingOperatingSubjectCompletion {
  return {
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
  };
}

function presenceRow(input: {
  id: string;
  name: string;
  studentNo: string;
}): StudentSemesterPresence {
  return {
    studentId: input.id,
    studentNo: input.studentNo,
    name: input.name,
    semesters: Object.fromEntries(
      semesterKeys.map((key) => [key, key === "1-1" ? "present" : "absent"])
    ) as StudentSemesterPresence["semesters"]
  };
}

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
    courseSelectionImportMock.courseSelectionRows = [];
    courseSelectionImportMock.pendingOperatingSubjectCompletions = [
      createPendingCompletion()
    ];
    courseSelectionImportMock.studentSemesterPresence = [];
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
      "운영과목에는 있지만 수강신청 결과에는 없는 과목이 있습니다."
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

  it("uses 기본 to show all internal reports and switches to the class roster report", () => {
    courseSelectionImportMock.studentSemesterPresence = [
      presenceRow({ id: "student-1", studentNo: "10101", name: "김민호" }),
      presenceRow({ id: "student-2", studentNo: "20101", name: "양진호" }),
      presenceRow({ id: "student-3", studentNo: "1202", name: "이서연" })
    ];

    renderPage();

    expect(screen.getByRole("button", { name: "기본" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
    expect(
      screen.getByRole("heading", { name: "누락 학생 명렬" })
    ).toBeVisible();
    expect(
      screen.getByRole("heading", { name: "학기별 이수 과목 수" })
    ).toBeVisible();
    expect(
      screen.getByRole("heading", { name: "반별 학생 명렬" })
    ).toBeVisible();

    fireEvent.click(screen.getByRole("button", { name: "반별 학생 명렬" }));

    expect(screen.getByRole("button", { name: "반별 학생 명렬" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
    expect(
      screen.queryByRole("heading", { name: "누락 학생 명렬" })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "학기별 이수 과목 수" })
    ).not.toBeInTheDocument();

    const rosterTable = screen.getByRole("table", { name: "반별 학생 명렬" });

    expect(
      within(rosterTable)
        .getAllByRole("columnheader")
        .map((header) => header.textContent)
    ).toEqual(["번호", "1반", "2반"]);
    expect(
      within(rosterTable)
        .getAllByRole("row")
        .slice(1)
        .map((row) =>
          within(row)
            .getAllByRole("cell")
            .map((cell) => cell.textContent)
        )
    ).toEqual([
      ["1", "김민호, 양진호", ""],
      ["2", "", "이서연"]
    ]);
  });
});
