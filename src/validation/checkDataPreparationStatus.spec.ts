import { describe, expect, it } from "vitest";
import type { ExternalCourseInput } from "../types/courseSelection";
import type { SemesterImportStatus } from "../types/importStatus";
import type { Semester } from "../types/semester";
import { semesterKeys } from "../types/semester";
import type { StudentSemesterPresence } from "../types/student";
import type { OperatingSubject } from "../types/subject";
import { parseSemesterKey, semesterToKey } from "../utils/semester";
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

function createPresenceWithAbsentSemester(
  studentId: string,
  target: Semester
): StudentSemesterPresence {
  return {
    studentId,
    studentNo: "10101",
    name: "김학생",
    semesters: {
      "1-1": "unknown",
      "1-2": "unknown",
      "2-1": "unknown",
      "2-2": "unknown",
      "3-1": "unknown",
      "3-2": "unknown",
      [semesterToKey(target)]: "absent"
    }
  };
}

function createExternalCourseInput(
  studentId: string,
  target: Semester
): ExternalCourseInput {
  return {
    id: `external-${studentId}`,
    studentId,
    studentNo: "10101",
    studentName: "김학생",
    target,
    subjectName: "생활과 과학",
    normalizedSubjectName: "생활과과학",
    credits: 2,
    sourceType: "transfer",
    updatedAt: "2026-01-01T00:00:00.000Z"
  };
}

function createStatus(input: {
  externalCourseInputs?: ExternalCourseInput[];
  operatingSubjects: OperatingSubject[];
  studentSemesterPresence?: StudentSemesterPresence[];
}) {
  return checkDataPreparationStatus({
    importStatuses: createImportStatuses(),
    studentSemesterPresence: input.studentSemesterPresence ?? [],
    operatingSubjects: input.operatingSubjects,
    courseSelectionRows: [],
    externalCourseInputs: input.externalCourseInputs ?? [],
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
    expect(status.canRunFullValidation).toBe(true);
    expect(status.issues).toContainEqual(
      expect.objectContaining({
        code: "unregisteredOperatingSubject",
        message: expect.stringContaining(unregisteredOperatingSubjectIssueMessage)
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

  it("allows partial validation when only upload semesters are missing", () => {
    const target = { grade: 2, semester: 1 } as const;
    const status = checkDataPreparationStatus({
      importStatuses: createImportStatuses().map((item) =>
        item.target.grade === target.grade && item.target.semester === target.semester
          ? {
              ...item,
              status: "empty"
            }
          : item
      ),
      studentSemesterPresence: [],
      operatingSubjects: [createOperatingSubject(firstSemester(), "matched")],
      courseSelectionRows: [],
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

    expect(status.canRunFullValidation).toBe(false);
    expect(status.canRunPartialValidation).toBe(true);
    expect(status.availablePartialSemesters).not.toContainEqual(target);
    expect(status.issues).toContainEqual(
      expect.objectContaining({
        code: "missingOperatingSubjects",
        message: "2학년 1학기 운영과목이 입력되지 않았습니다.",
        relatedSemester: target,
        relatedSourceType: "operatingSubjects"
      })
    );
    expect(status.issues).toContainEqual(
      expect.objectContaining({
        code: "missingCourseSelections",
        message: "2학년 1학기 수강신청 결과가 입력되지 않았습니다.",
        relatedSemester: target,
        relatedSourceType: "courseSelections"
      })
    );
  });

  it("allows partial validation when another semester has an import error", () => {
    const target = { grade: 2, semester: 1 } as const;
    const status = checkDataPreparationStatus({
      importStatuses: createImportStatuses().map((item) =>
        item.target.grade === target.grade &&
        item.target.semester === target.semester &&
        item.sourceType === "courseSelections"
          ? {
              ...item,
              status: "error",
              message: "파일 형식 오류"
            }
          : item
      ),
      studentSemesterPresence: [],
      operatingSubjects: [createOperatingSubject(firstSemester(), "matched")],
      courseSelectionRows: [],
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

    expect(status.canRunFullValidation).toBe(false);
    expect(status.canRunPartialValidation).toBe(true);
    expect(status.issues).toContainEqual(
      expect.objectContaining({
        code: "importError",
        message: "수강신청 결과 탭 2학년 1학기 업로드 오류가 있습니다: 파일 형식 오류",
        relatedSemester: target,
        relatedSourceType: "courseSelections"
      })
    );
  });

  it("does not run validation without validation rule settings", () => {
    const status = checkDataPreparationStatus({
      importStatuses: createImportStatuses(),
      studentSemesterPresence: [],
      operatingSubjects: [createOperatingSubject(firstSemester(), "matched")],
      courseSelectionRows: [],
      externalCourseInputs: [],
      prerequisiteRules: [],
      validationRuleSettings: []
    });

    expect(status.canRunFullValidation).toBe(false);
    expect(status.canRunPartialValidation).toBe(false);
    expect(status.issues).toContainEqual(
      expect.objectContaining({
        code: "missingValidationRuleSettings"
      })
    );
  });

  it("counts absent students without transfer or external course inputs", () => {
    const target = firstSemester();

    const status = createStatus({
      operatingSubjects: [createOperatingSubject(target, "matched")],
      studentSemesterPresence: [createPresenceWithAbsentSemester("student-1", target)]
    });

    expect(status.counts.missingExternalCourseStudentCount).toBe(1);
  });

  it("does not count absent students that already have transfer or external inputs", () => {
    const target = firstSemester();

    const status = createStatus({
      externalCourseInputs: [createExternalCourseInput("student-1", target)],
      operatingSubjects: [createOperatingSubject(target, "matched")],
      studentSemesterPresence: [createPresenceWithAbsentSemester("student-1", target)]
    });

    expect(status.counts.missingExternalCourseStudentCount).toBe(0);
  });
});
