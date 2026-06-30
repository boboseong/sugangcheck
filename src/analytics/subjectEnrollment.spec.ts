import { describe, expect, it } from "vitest";
import { normalizeSubjectName } from "../normalizers/normalizeSubjectName";
import type { ParsedCourseSelectionRow } from "../types/courseSelection";
import type { OperatingSubject } from "../types/subject";
import {
  buildSubjectEnrollmentSummaries,
  filterSubjectEnrollmentSummaries,
  sortSubjectEnrollmentSummaries
} from "./subjectEnrollment";

function courseRow(input: {
  id: string;
  studentNo: string;
  studentName: string;
  subjectName: string;
  grade: 1 | 2 | 3;
  semester: 1 | 2;
}): ParsedCourseSelectionRow {
  return {
    id: input.id,
    semesterImportId: `course-${input.grade}-${input.semester}`,
    studentId: `${input.studentNo}-${input.studentName}`,
    studentNo: input.studentNo,
    studentName: input.studentName,
    target: { grade: input.grade, semester: input.semester },
    subjectName: input.subjectName,
    normalizedSubjectName: normalizeSubjectName(input.subjectName)
  };
}

function operatingSubject(input: {
  subjectName: string;
  subjectGroup: string;
  grade: 1 | 2 | 3;
  semester: 1 | 2;
  credits?: number;
}): OperatingSubject {
  return {
    id: `subject-${input.grade}-${input.semester}-${input.subjectName}`,
    target: { grade: input.grade, semester: input.semester },
    subjectName: input.subjectName,
    normalizedSubjectName: normalizeSubjectName(input.subjectName),
    subjectGroup: input.subjectGroup,
    selectionType: "진로",
    groupType: "보통교과",
    credits: input.credits ?? 2,
    masterMatchStatus: "matched"
  };
}

describe("subject enrollment summaries", () => {
  it("counts unique students by semester and subject", () => {
    const rows = [
      courseRow({
        id: "row-1",
        studentNo: "20101",
        studentName: "김하나",
        subjectName: "물리학",
        grade: 2,
        semester: 1
      }),
      courseRow({
        id: "row-2",
        studentNo: "20101",
        studentName: "김하나",
        subjectName: "물리학",
        grade: 2,
        semester: 1
      }),
      courseRow({
        id: "row-3",
        studentNo: "20102",
        studentName: "이두리",
        subjectName: "물리학",
        grade: 2,
        semester: 1
      }),
      courseRow({
        id: "row-4",
        studentNo: "10101",
        studentName: "박세나",
        subjectName: "문학",
        grade: 1,
        semester: 1
      })
    ];
    const summaries = buildSubjectEnrollmentSummaries(rows, [
      operatingSubject({
        subjectName: "물리학",
        subjectGroup: "과학",
        grade: 2,
        semester: 1
      })
    ]);
    const physics = summaries.find((summary) => summary.subjectName === "물리학");
    const literature = summaries.find((summary) => summary.subjectName === "문학");

    expect(physics).toMatchObject({
      semesterKey: "2-1",
      subjectGroup: "과학",
      studentCount: 2,
      rawRowCount: 3,
      duplicateRowCount: 1,
      metadataSource: "operatingSubject"
    });
    expect(physics?.studentLabels).toEqual(["20101 김하나", "20102 이두리"]);
    expect(literature).toMatchObject({
      semesterKey: "1-1",
      subjectGroup: "국어",
      studentCount: 1,
      metadataSource: "subjectMaster"
    });
  });

  it("filters and sorts by group, semester, and student count", () => {
    const summaries = buildSubjectEnrollmentSummaries(
      [
        courseRow({
          id: "row-1",
          studentNo: "20101",
          studentName: "김하나",
          subjectName: "물리학",
          grade: 2,
          semester: 1
        }),
        courseRow({
          id: "row-2",
          studentNo: "20102",
          studentName: "이두리",
          subjectName: "물리학",
          grade: 2,
          semester: 1
        }),
        courseRow({
          id: "row-3",
          studentNo: "20201",
          studentName: "박세나",
          subjectName: "화학",
          grade: 2,
          semester: 2
        })
      ],
      [
        operatingSubject({
          subjectName: "물리학",
          subjectGroup: "과학",
          grade: 2,
          semester: 1
        }),
        operatingSubject({
          subjectName: "화학",
          subjectGroup: "과학",
          grade: 2,
          semester: 2
        })
      ]
    );
    const filtered = filterSubjectEnrollmentSummaries(summaries, {
      semesterKey: "2-1",
      subjectGroup: "과학",
      minStudentCount: 2
    });
    const sorted = sortSubjectEnrollmentSummaries(summaries, {
      key: "studentCount",
      direction: "desc"
    });

    expect(filtered.map((summary) => summary.subjectName)).toEqual(["물리학"]);
    expect(sorted.map((summary) => summary.subjectName)).toEqual(["물리학", "화학"]);
  });
});
