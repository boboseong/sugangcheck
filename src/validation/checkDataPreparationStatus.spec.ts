import { describe, expect, it } from "vitest";
import type { SemesterImportStatus } from "../types/importStatus";
import type { Semester } from "../types/semester";
import { semesterKeys } from "../types/semester";
import type { OperatingSubject, SubjectOverride } from "../types/subject";
import { parseSemesterKey } from "../utils/semester";
import { checkDataPreparationStatus } from "./checkDataPreparationStatus";
import {
  hasUnregisteredOperatingSubjectIssue,
  unregisteredOperatingSubjectIssueMessage
} from "./dataPreparationIssues";

const semesters = semesterKeys
  .map((key) => parseSemesterKey(key))
  .filter(Boolean) as Semester[];

function firstSemester(): Semester {
  const semester = semesters[0];

  if (!semester) {
    throw new Error("테스트 학기 목록을 만들지 못했습니다.");
  }

  return semester;
}

function createImportStatuses(): SemesterImportStatus[] {
  return semesters.flatMap((target) => [
    {
      id: `operating-${target.grade}-${target.semester}`,
      sourceType: "operatingSubjects",
      status: "imported",
      target
    },
    {
      id: `course-${target.grade}-${target.semester}`,
      sourceType: "courseSelections",
      status: "imported",
      target
    }
  ]);
}

function createOperatingSubject(
  target: Semester,
  masterMatchStatus: OperatingSubject["masterMatchStatus"]
): OperatingSubject {
  return {
    id: `subject-${target.grade}-${target.semester}-${masterMatchStatus}`,
    target,
    subjectName: "생활과 과학",
    normalizedSubjectName: "생활과과학",
    subjectGroup: "과학",
    selectionType: "일반선택",
    groupType: "선택",
    credits: 2,
    masterMatchStatus
  };
}

function createStatus(input: {
  operatingSubjects: OperatingSubject[];
  subjectOverrides?: SubjectOverride[];
}) {
  return checkDataPreparationStatus({
    importStatuses: createImportStatuses(),
    studentSemesterPresence: [],
    operatingSubjects: input.operatingSubjects,
    courseSelectionRows: [],
    subjectOverrides: input.subjectOverrides ?? [],
    externalCourseInputs: [],
    prerequisiteRules: [],
    validationRuleSettings: [
      {
        id: "minimumCredits",
        enabled: true,
        includeExternalInputs: true,
        criteria: {}
      }
    ]
  });
}

describe("checkDataPreparationStatus", () => {
  it("adds an operating-subject registration issue for unmatched subjects", () => {
    const target = firstSemester();

    const status = createStatus({
      operatingSubjects: [createOperatingSubject(target, "unmatched")]
    });

    expect(hasUnregisteredOperatingSubjectIssue(status)).toBe(true);
    expect(status.canRunFullValidation).toBe(false);
    expect(status.issues).toContainEqual(
      expect.objectContaining({
        code: "unregisteredOperatingSubject",
        message: unregisteredOperatingSubjectIssueMessage
      })
    );
  });

  it("does not add the issue after operating-subject corrections are complete", () => {
    const target = firstSemester();

    const status = createStatus({
      operatingSubjects: [createOperatingSubject(target, "manual")]
    });

    expect(hasUnregisteredOperatingSubjectIssue(status)).toBe(false);
    expect(status.canRunFullValidation).toBe(true);
  });

  it("describes needs-review upload issues by source tab and semester", () => {
    const target = firstSemester();

    const status = checkDataPreparationStatus({
      importStatuses: [
        ...createImportStatuses().filter(
          (item) =>
            item.sourceType !== "courseSelections" ||
            item.target.grade !== target.grade ||
            item.target.semester !== target.semester
        ),
        {
          id: "course-needs-review",
          sourceType: "courseSelections",
          status: "needsReview",
          target,
          message: "파싱 실패 2행"
        }
      ],
      studentSemesterPresence: [],
      operatingSubjects: [createOperatingSubject(target, "matched")],
      courseSelectionRows: [],
      subjectOverrides: [],
      externalCourseInputs: [],
      prerequisiteRules: [],
      validationRuleSettings: [
        {
          id: "minimumCredits",
          enabled: true,
          includeExternalInputs: true,
          criteria: {}
        }
      ]
    });

    expect(status.issues).toContainEqual(
      expect.objectContaining({
        code: "needsReview",
        message: "수강신청 결과 탭 1학년 1학기 업로드 확인이 필요합니다: 파싱 실패 2행",
        relatedIds: ["course-needs-review"],
        relatedSemester: target,
        relatedSourceType: "courseSelections"
      })
    );
  });
});
