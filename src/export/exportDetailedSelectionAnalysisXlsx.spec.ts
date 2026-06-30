import { utils } from "xlsx";
import { describe, expect, it } from "vitest";
import { normalizeSubjectName } from "../normalizers/normalizeSubjectName";
import type { CourseSelectionRecord } from "../types/courseSelection";
import type { DetailedConstraintSubject } from "../types/validation";
import { buildDetailedSelectionAnalysis } from "../analytics/detailedSelectionAnalysis";
import {
  createDetailedSelectionAnalysisWorkbook,
  detailedSelectionAnalysisFileName
} from "./exportDetailedSelectionAnalysisXlsx";

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

describe("detailed selection analysis export", () => {
  it("creates crosstab and criteria sheets", () => {
    const result = buildDetailedSelectionAnalysis({
      comparison: "atLeast",
      count: 1,
      records: [
        record({
          id: "row-1",
          studentNo: "20101",
          studentName: "김하나",
          subjectName: "물리학"
        })
      ],
      subjects: [subject("물리학"), subject("화학")]
    });
    const workbook = createDetailedSelectionAnalysisWorkbook(result);
    const crosstabRows = utils.sheet_to_json<unknown[]>(
      workbook.Sheets["크로스탭"]!,
      { header: 1 }
    );
    const criteriaRows = utils.sheet_to_json<unknown[]>(
      workbook.Sheets["분석조건"]!,
      { header: 1 }
    );

    expect(detailedSelectionAnalysisFileName).toBe("학생선택_세부분석.xlsx");
    expect(workbook.SheetNames).toEqual(["크로스탭", "분석조건"]);
    expect(crosstabRows[0]).toEqual([
      "번호",
      "학번",
      "이름",
      "선택 개수",
      "2학년 1학기 물리학",
      "2학년 1학기 화학"
    ]);
    expect(crosstabRows[1]).toEqual([1, "20101", "김하나", 1, "O", ""]);
    expect(criteriaRows).toContainEqual(["비교 방식", "n개 이상이면 검출"]);
    expect(criteriaRows).toContainEqual(["검출 학생 수", 1]);
  });
});
