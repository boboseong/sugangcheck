import { describe, expect, it } from "vitest";
import { missingOperatingSubjectInfoLabel } from "../types/subject";
import type { ParsedCourseSelectionRow } from "../types/courseSelection";
import type { OperatingSubject } from "../types/subject";
import { buildCourseSelectionRecords } from "./buildCourseSelectionRecords";

const target = { grade: 1, semester: 1 } as const;

describe("buildCourseSelectionRecords", () => {
  it("includes unmatched operating subjects with missing classification labels", () => {
    const courseSelectionRows: ParsedCourseSelectionRow[] = [
      {
        id: "course-row-1",
        semesterImportId: "courseSelections-1-1",
        studentId: "student-10101",
        studentNo: "10101",
        studentName: "김학생",
        target,
        subjectName: "새 과목",
        normalizedSubjectName: "새과목"
      }
    ];
    const operatingSubjects: OperatingSubject[] = [
      {
        id: "operating-subject-1",
        target,
        subjectName: "새 과목",
        normalizedSubjectName: "새과목",
        subjectGroup: missingOperatingSubjectInfoLabel,
        selectionType: missingOperatingSubjectInfoLabel,
        groupType: missingOperatingSubjectInfoLabel,
        credits: 2,
        choiceGroup: "학생필수",
        masterMatchStatus: "unmatched"
      }
    ];

    const result = buildCourseSelectionRecords({
      mode: "full",
      courseSelectionRows,
      externalCourseInputs: [],
      operatingSubjects
    });

    expect(result.issues).toHaveLength(0);
    expect(result.records).toHaveLength(1);
    expect(result.records[0]).toEqual(
      expect.objectContaining({
        subjectName: "새 과목",
        subjectGroup: missingOperatingSubjectInfoLabel,
        selectionType: missingOperatingSubjectInfoLabel,
        choiceGroup: "학생필수",
        credits: 2
      })
    );
  });

  it("copies operating subject choice groups into course selection records", () => {
    const result = buildCourseSelectionRecords({
      mode: "full",
      courseSelectionRows: [
        {
          id: "course-row-1",
          semesterImportId: "courseSelections-1-1",
          studentId: "student-10101",
          studentNo: "10101",
          studentName: "김학생",
          target,
          subjectName: "학교 지정 과목",
          normalizedSubjectName: "학교지정과목"
        }
      ],
      externalCourseInputs: [],
      operatingSubjects: [
        {
          id: "operating-subject-1",
          target,
          subjectName: "학교 지정 과목",
          normalizedSubjectName: "학교지정과목",
          subjectGroup: "사회",
          selectionType: "일반선택",
          groupType: "일반교과",
          credits: 3,
          choiceGroup: "학교 지정",
          masterMatchStatus: "matched"
        }
      ]
    });

    expect(result.issues).toHaveLength(0);
    expect(result.records[0]).toEqual(
      expect.objectContaining({
        subjectName: "학교 지정 과목",
        choiceGroup: "학교 지정"
      })
    );
  });

  it("uses external input choice groups for external course records", () => {
    const result = buildCourseSelectionRecords({
      mode: "full",
      courseSelectionRows: [],
      externalCourseInputs: [
        {
          id: "external-input-1",
          studentId: "student-10101",
          studentNo: "10101",
          studentName: "김학생",
          target,
          subjectName: "외부 과목",
          normalizedSubjectName: "외부과목",
          subjectGroup: "교양",
          selectionType: "일반선택",
          groupType: "일반교과",
          credits: 2,
          choiceGroup: "기타",
          sourceType: "externalCourse",
          updatedAt: "2026-07-02T00:00:00.000Z"
        }
      ],
      operatingSubjects: []
    });

    expect(result.issues).toHaveLength(0);
    expect(result.records[0]).toEqual(
      expect.objectContaining({
        subjectName: "외부 과목",
        choiceGroup: "기타"
      })
    );
  });
});
