import { describe, expect, it } from "vitest";
import { normalizeSubjectName } from "../normalizers/normalizeSubjectName";
import type { CourseSelectionRecord } from "../types/courseSelection";
import type { DetailedConstraintSubject } from "../types/validation";
import { buildDetailedSelectionAnalysis } from "./detailedSelectionAnalysis";

const target = { grade: 2, semester: 1 } as const;

function subject(subjectName: string): DetailedConstraintSubject {
  return {
    target,
    subjectName,
    normalizedSubjectName: normalizeSubjectName(subjectName)
  };
}

function record(input: {
  id: string;
  studentNo: string;
  studentName: string;
  subjectName: string;
}): CourseSelectionRecord {
  return {
    id: input.id,
    studentId: input.studentNo,
    studentNo: input.studentNo,
    studentName: input.studentName,
    target,
    subjectName: input.subjectName,
    normalizedSubjectName: normalizeSubjectName(input.subjectName),
    subjectGroup: "과학",
    selectionType: "진로",
    credits: 2,
    origin: {
      type: "courseSelectionFile",
      semesterImportId: "courseSelections-2-1",
      parsedRowId: input.id
    }
  };
}

describe("detailed selection analysis", () => {
  it("detects students whose selected target-subject count is at least the threshold", () => {
    const result = buildDetailedSelectionAnalysis({
      comparison: "atLeast",
      count: 2,
      records: [
        record({
          id: "row-1",
          studentNo: "20101",
          studentName: "김하나",
          subjectName: "물리학"
        }),
        record({
          id: "row-2",
          studentNo: "20101",
          studentName: "김하나",
          subjectName: "화학"
        }),
        record({
          id: "row-3",
          studentNo: "20102",
          studentName: "이두리",
          subjectName: "물리학"
        })
      ],
      subjects: [subject("물리학"), subject("화학")]
    });

    expect(result.detectedRows).toHaveLength(1);
    expect(result.detectedRows[0]).toMatchObject({
      studentNo: "20101",
      selectedCount: 2
    });
    expect(result.detectedRows[0]?.selections.map((selection) => selection.selected)).toEqual([
      true,
      true
    ]);
  });

  it("includes students with no selected target subject for at-most detection", () => {
    const result = buildDetailedSelectionAnalysis({
      comparison: "atMost",
      count: 0,
      records: [
        record({
          id: "row-1",
          studentNo: "20101",
          studentName: "김하나",
          subjectName: "물리학"
        }),
        record({
          id: "row-2",
          studentNo: "20102",
          studentName: "이두리",
          subjectName: "생명과학"
        })
      ],
      subjects: [subject("물리학"), subject("화학")]
    });

    expect(result.detectedRows).toHaveLength(1);
    expect(result.detectedRows[0]).toMatchObject({
      studentNo: "20102",
      selectedCount: 0
    });
    expect(result.detectedRows[0]?.selections.map((selection) => selection.selected)).toEqual([
      false,
      false
    ]);
  });
});
