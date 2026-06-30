import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { normalizeSubjectName } from "../normalizers/normalizeSubjectName";
import { useCourseSelectionRawStore } from "../state/courseSelectionRawStore";
import { useOperatingSubjectStore } from "../state/operatingSubjectStore";
import type { ParsedCourseSelectionRow } from "../types/courseSelection";
import type { OperatingSubject } from "../types/subject";
import { downloadBlob } from "../utils/downloadBlob";
import { NonOverlappingSubjectsPage } from "./NonOverlappingSubjectsPage";

vi.mock("../utils/downloadBlob", () => ({
  downloadBlob: vi.fn().mockResolvedValue(true)
}));

function courseSelectionRow(input: {
  id: string;
  studentNo: string;
  studentName: string;
  subjectName: string;
}): ParsedCourseSelectionRow {
  return {
    id: input.id,
    semesterImportId: "courseSelections-2-1",
    studentId: `${input.studentNo}-${input.studentName}`,
    studentNo: input.studentNo,
    studentName: input.studentName,
    target: { grade: 2, semester: 1 },
    subjectName: input.subjectName,
    normalizedSubjectName: normalizeSubjectName(input.subjectName)
  };
}

function operatingSubject(subjectName: string): OperatingSubject {
  return {
    id: `subject-${subjectName}`,
    target: { grade: 2, semester: 1 },
    subjectName,
    normalizedSubjectName: normalizeSubjectName(subjectName),
    subjectGroup: "과학",
    selectionType: "진로",
    groupType: "보통교과",
    credits: 2,
    masterMatchStatus: "matched"
  };
}

function resetStores() {
  useCourseSelectionRawStore.setState({ courseSelectionRows: [] });
  useOperatingSubjectStore.setState({ operatingSubjects: [] });
}

describe("NonOverlappingSubjectsPage", () => {
  beforeEach(() => {
    resetStores();
  });

  afterEach(() => {
    resetStores();
    vi.clearAllMocks();
  });

  it("shows non-overlapping combinations and exports the visible result", async () => {
    useCourseSelectionRawStore.setState({
      courseSelectionRows: [
        courseSelectionRow({
          id: "row-1",
          studentNo: "20101",
          studentName: "김하나",
          subjectName: "물리학"
        }),
        courseSelectionRow({
          id: "row-2",
          studentNo: "20102",
          studentName: "이두리",
          subjectName: "화학"
        }),
        courseSelectionRow({
          id: "row-3",
          studentNo: "20103",
          studentName: "박세나",
          subjectName: "생명과학"
        })
      ]
    });
    useOperatingSubjectStore.setState({
      operatingSubjects: [
        operatingSubject("물리학"),
        operatingSubject("화학"),
        operatingSubject("생명과학")
      ]
    });

    await act(async () => {
      render(
        <MemoryRouter>
          <NonOverlappingSubjectsPage />
        </MemoryRouter>
      );
    });

    expect(
      screen.getByText("동시에 선택한 학생이 하나도 없는 과목들의 명렬입니다.")
    ).toBeInTheDocument();
    expect(screen.getAllByText("2개").length).toBeGreaterThan(0);
    expect(screen.getAllByText("3개").length).toBeGreaterThan(0);

    const rows = screen.getAllByRole("row");
    const firstResultRow = rows[1]!;

    expect(within(firstResultRow).getByText("2학년 1학기")).toBeInTheDocument();
    expect(within(firstResultRow).getByText("과학")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "엑셀 저장" }));

    expect(downloadBlob).toHaveBeenCalledWith(
      expect.any(Blob),
      "미중복선택과목_명렬.xlsx"
    );
  });
});
