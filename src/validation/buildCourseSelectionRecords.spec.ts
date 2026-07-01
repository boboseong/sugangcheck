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
        credits: 2
      })
    );
  });
});
