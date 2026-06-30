import { describe, expect, it } from "vitest";
import { normalizeSubjectName } from "../normalizers/normalizeSubjectName";
import type { ParsedCourseSelectionRow } from "../types/courseSelection";
import type { OperatingSubject } from "../types/subject";
import {
  buildNonOverlappingSubjectCombinations,
  filterNonOverlappingSubjectCombinations
} from "./nonOverlappingSubjects";

function courseRow(input: {
  id: string;
  studentNo: string;
  studentName: string;
  subjectName: string;
  grade?: 1 | 2 | 3;
  semester?: 1 | 2;
}): ParsedCourseSelectionRow {
  const grade = input.grade ?? 2;
  const semester = input.semester ?? 1;

  return {
    id: input.id,
    semesterImportId: `course-${grade}-${semester}`,
    studentId: `${input.studentNo}-${input.studentName}`,
    studentNo: input.studentNo,
    studentName: input.studentName,
    target: { grade, semester },
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

function signature(subjectNames: readonly string[]): string {
  return [...subjectNames].sort((left, right) => left.localeCompare(right, "ko"))
    .join("+");
}

function hasCombination(
  signatures: readonly string[],
  subjectCount: number,
  subjectNames: readonly string[]
): boolean {
  return signatures.includes(`${subjectCount}:${signature(subjectNames)}`);
}

describe("non-overlapping subject combinations", () => {
  it("builds 2 to 4 subject combinations only when student sets are pairwise disjoint", () => {
    const combinations = buildNonOverlappingSubjectCombinations(
      [
        courseRow({
          id: "row-1",
          studentNo: "20101",
          studentName: "김하나",
          subjectName: "물리학"
        }),
        courseRow({
          id: "row-2",
          studentNo: "20102",
          studentName: "이두리",
          subjectName: "물리학"
        }),
        courseRow({
          id: "row-3",
          studentNo: "20103",
          studentName: "박세나",
          subjectName: "화학"
        }),
        courseRow({
          id: "row-4",
          studentNo: "20104",
          studentName: "최네모",
          subjectName: "생명과학"
        }),
        courseRow({
          id: "row-5",
          studentNo: "20105",
          studentName: "정다섯",
          subjectName: "지구과학"
        }),
        courseRow({
          id: "row-6",
          studentNo: "20101",
          studentName: "김하나",
          subjectName: "음악"
        })
      ],
      [
        operatingSubject("물리학"),
        operatingSubject("화학"),
        operatingSubject("생명과학"),
        operatingSubject("지구과학"),
        operatingSubject("음악")
      ]
    );
    const signatures = combinations.map(
      (combination) =>
        `${combination.subjectCount}:${signature(combination.subjectNames)}`
    );

    expect(hasCombination(signatures, 2, ["물리학", "화학"])).toBe(true);
    expect(hasCombination(signatures, 3, ["물리학", "생명과학", "화학"])).toBe(true);
    expect(hasCombination(signatures, 4, ["물리학", "생명과학", "지구과학", "화학"])).toBe(true);
    expect(hasCombination(signatures, 2, ["물리학", "음악"])).toBe(false);
    expect(
      combinations.find(
        (combination) =>
          combination.subjectCount === 4 &&
          signature(combination.subjectNames) ===
            signature(["물리학", "생명과학", "지구과학", "화학"])
      )?.totalStudentCount
    ).toBe(5);
  });

  it("filters combinations by subject count and subject text", () => {
    const combinations = buildNonOverlappingSubjectCombinations(
      [
        courseRow({
          id: "row-1",
          studentNo: "20101",
          studentName: "김하나",
          subjectName: "물리학"
        }),
        courseRow({
          id: "row-2",
          studentNo: "20102",
          studentName: "이두리",
          subjectName: "화학"
        }),
        courseRow({
          id: "row-3",
          studentNo: "20103",
          studentName: "박세나",
          subjectName: "생명과학"
        })
      ],
      [operatingSubject("물리학"), operatingSubject("화학"), operatingSubject("생명과학")]
    );
    const filtered = filterNonOverlappingSubjectCombinations(combinations, {
      subjectCount: 2,
      query: "물리"
    });

    expect(filtered).toHaveLength(2);
    expect(filtered.every((combination) => combination.subjectCount === 2)).toBe(
      true
    );
    expect(
      filtered.every((combination) => combination.subjectNames.includes("물리학"))
    ).toBe(true);
  });
});
