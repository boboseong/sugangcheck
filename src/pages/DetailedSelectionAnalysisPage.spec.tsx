import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { normalizeSubjectName } from "../normalizers/normalizeSubjectName";
import { useCourseSelectionRawStore } from "../state/courseSelectionRawStore";
import { useExternalCourseInputStore } from "../state/externalCourseInputStore";
import { useOperatingSubjectStore } from "../state/operatingSubjectStore";
import type { ParsedCourseSelectionRow } from "../types/courseSelection";
import type { OperatingSubject } from "../types/subject";
import { downloadBlob } from "../utils/downloadBlob";
import { DetailedSelectionAnalysisPage } from "./DetailedSelectionAnalysisPage";

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
    studentId: input.studentNo,
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
  useExternalCourseInputStore.setState({ externalCourseInputs: [] });
  useOperatingSubjectStore.setState({ operatingSubjects: [] });
}

describe("DetailedSelectionAnalysisPage", () => {
  beforeEach(() => {
    resetStores();
  });

  afterEach(() => {
    resetStores();
    vi.clearAllMocks();
  });

  it("renders detected students as a target-subject crosstab and downloads xlsx", () => {
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
          studentNo: "20101",
          studentName: "김하나",
          subjectName: "화학"
        }),
        courseSelectionRow({
          id: "row-3",
          studentNo: "20102",
          studentName: "이두리",
          subjectName: "물리학"
        })
      ]
    });
    useOperatingSubjectStore.setState({
      operatingSubjects: [
        operatingSubject("물리학"),
        operatingSubject("화학")
      ]
    });

    render(
      <MemoryRouter>
        <DetailedSelectionAnalysisPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByRole("spinbutton", { name: "기준 개수" }), {
      target: { value: "2" }
    });
    fireEvent.change(screen.getByRole("combobox", { name: "학년" }), {
      target: { value: "2" }
    });
    fireEvent.change(screen.getByRole("combobox", { name: "학기" }), {
      target: { value: "2" }
    });
    fireEvent.change(screen.getByRole("combobox", { name: "과목 1" }), {
      target: { value: "물리학" }
    });
    fireEvent.click(screen.getByRole("button", { name: "과목 추가" }));

    expect(screen.getAllByRole("combobox", { name: "학년" })[1]).toHaveValue("2");
    expect(screen.getAllByRole("combobox", { name: "학기" })[1]).toHaveValue("2");

    fireEvent.change(screen.getAllByRole("combobox", { name: "학기" })[0]!, {
      target: { value: "1" }
    });
    fireEvent.change(screen.getAllByRole("combobox", { name: "학기" })[1]!, {
      target: { value: "1" }
    });
    fireEvent.change(screen.getByRole("combobox", { name: "과목 2" }), {
      target: { value: "화학" }
    });

    expect(screen.getByText("검출 1명")).toBeInTheDocument();
    expect(screen.getByText("20101")).toBeInTheDocument();
    expect(screen.getByText("김하나")).toBeInTheDocument();
    expect(screen.queryByText("이두리")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "엑셀 저장" }));

    expect(downloadBlob).toHaveBeenCalledWith(
      expect.any(Blob),
      "학생선택_세부분석.xlsx"
    );
  });
});
