import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { normalizeSubjectName } from "../normalizers/normalizeSubjectName";
import { useCourseSelectionRawStore } from "../state/courseSelectionRawStore";
import { useOperatingSubjectStore } from "../state/operatingSubjectStore";
import type { ParsedCourseSelectionRow } from "../types/courseSelection";
import type { OperatingSubject } from "../types/subject";
import { downloadBlob } from "../utils/downloadBlob";
import { SubjectEnrollmentPage } from "./SubjectEnrollmentPage";

vi.mock("../utils/downloadBlob", () => ({
  downloadBlob: vi.fn().mockResolvedValue(true)
}));

const target = { grade: 2, semester: 1 } as const;

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
    target,
    subjectName: input.subjectName,
    normalizedSubjectName: normalizeSubjectName(input.subjectName)
  };
}

function operatingSubject(subjectName: string): OperatingSubject {
  return {
    id: `subject-${subjectName}`,
    target,
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

describe("SubjectEnrollmentPage", () => {
  beforeEach(() => {
    resetStores();
  });

  afterEach(() => {
    resetStores();
    vi.clearAllMocks();
  });

  it("opens a student-list dialog when a subject is clicked", async () => {
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
          subjectName: "물리학"
        }),
        courseSelectionRow({
          id: "row-3",
          studentNo: "20103",
          studentName: "박세나",
          subjectName: "화학"
        })
      ]
    });
    useOperatingSubjectStore.setState({
      operatingSubjects: [operatingSubject("물리학"), operatingSubject("화학")]
    });

    await act(async () => {
      render(
        <MemoryRouter>
          <SubjectEnrollmentPage />
        </MemoryRouter>
      );
    });

    fireEvent.click(screen.getByRole("button", { name: "물리학" }));

    const studentDialog = screen.getByRole("dialog", {
      name: "2학년 1학기 · 물리학"
    });

    expect(within(studentDialog).getByText("20101")).toBeInTheDocument();
    expect(within(studentDialog).getByText("김하나")).toBeInTheDocument();
    expect(within(studentDialog).getByText("20102")).toBeInTheDocument();
    expect(within(studentDialog).getByText("이두리")).toBeInTheDocument();
    expect(
      within(studentDialog).queryByText("박세나")
    ).not.toBeInTheDocument();

    fireEvent.click(
      within(studentDialog).getByRole("button", { name: "학생 명렬 다운로드" })
    );

    expect(downloadBlob).toHaveBeenCalledWith(
      expect.any(Blob),
      "과목별수강생_학생명렬_2학년_1학기_물리학.xlsx"
    );

    fireEvent.click(within(studentDialog).getByRole("button", { name: "닫기" }));

    expect(
      screen.queryByRole("dialog", { name: "2학년 1학기 · 물리학" })
    ).not.toBeInTheDocument();
  });
});
