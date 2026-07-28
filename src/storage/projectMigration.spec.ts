import { describe, expect, it } from "vitest";
import {
  currentProjectSchemaVersion,
  migrateProjectState
} from "./projectMigration";

const legacySubject = {
  id: "subject-legacy",
  target: { grade: 1, semester: 1 },
  subjectName: "생활과 과학",
  normalizedSubjectName: "생활과과학",
  subjectGroup: "과학",
  selectionType: "일반선택",
  groupType: "선택",
  credits: 2,
  masterMatchStatus: "manual",
  overrideId: "override-operating-legacy"
};

describe("migrateProjectState", () => {
  it("drops legacy subject overrides while preserving edited operating subjects", () => {
    const legacyState = {
      schemaVersion: 3,
      projectName: "legacy",
      createdAt: "2026-06-30T00:00:00.000Z",
      updatedAt: "2026-06-30T00:00:00.000Z",
      importStatuses: [],
      subjectMasterVersion: "legacy",
      students: [],
      studentSemesterPresence: [],
      operatingSubjects: [legacySubject],
      courseSelectionRows: [],
      subjectOverrides: [
        {
          id: "override-operating-legacy",
          subjectName: "생활과 과학",
          normalizedSubjectName: "생활과과학",
          updatedAt: "2026-06-30T00:00:00.000Z",
          source: "user"
        }
      ],
      externalCourseInputs: [],
      validationRuleSettings: [],
      prerequisiteRules: [],
      detailedConstraintRules: [],
      validationErrors: [],
      courseSelectionRecords: []
    } as unknown as Parameters<typeof migrateProjectState>[0];

    const migrated = migrateProjectState(legacyState);
    const migratedSubject = migrated.operatingSubjects[0];

    expect(migrated.schemaVersion).toBe(currentProjectSchemaVersion);
    expect("subjectOverrides" in migrated).toBe(false);
    expect(migratedSubject).toBeDefined();
    expect(migratedSubject).toMatchObject({
      id: "subject-legacy",
      subjectGroup: "과학",
      selectionType: "일반선택",
      credits: 2,
      choiceGroup: "학생필수",
      masterMatchStatus: "manual"
    });
    expect("overrideId" in (migratedSubject as Record<string, unknown>)).toBe(false);
  });

  it("fills v4 operating and external course choice group defaults", () => {
    const legacyState = {
      schemaVersion: 4,
      projectName: "v4",
      createdAt: "2026-07-01T00:00:00.000Z",
      updatedAt: "2026-07-01T00:00:00.000Z",
      importStatuses: [],
      subjectMasterVersion: "legacy",
      students: [],
      studentSemesterPresence: [],
      operatingSubjects: [legacySubject],
      courseSelectionRows: [],
      externalCourseInputs: [
        {
          id: "external-legacy",
          studentId: "student-no:10101",
          studentNo: "10101",
          studentName: "김하나",
          target: { grade: 1, semester: 2 },
          subjectName: "외부 과목",
          normalizedSubjectName: "외부 과목",
          sourceType: "externalCourse",
          updatedAt: "2026-07-01T00:00:00.000Z"
        }
      ],
      validationRuleSettings: [],
      prerequisiteRules: [],
      detailedConstraintRules: [],
      validationErrors: [],
      courseSelectionRecords: []
    } as unknown as Parameters<typeof migrateProjectState>[0];

    const migrated = migrateProjectState(legacyState);

    expect(migrated.schemaVersion).toBe(currentProjectSchemaVersion);
    expect(migrated.operatingSubjects[0]?.choiceGroup).toBe("학생필수");
    expect(migrated.externalCourseInputs[0]?.choiceGroup).toBe("기타");
  });

  it("marks a legacy v5 validation result as having unknown provenance", () => {
    const legacyState = {
      schemaVersion: 5,
      projectName: "v5-result",
      createdAt: "2026-07-01T00:00:00.000Z",
      updatedAt: "2026-07-01T00:00:00.000Z",
      importStatuses: [],
      students: [],
      studentSemesterPresence: [],
      operatingSubjects: [],
      courseSelectionRows: [],
      externalCourseInputs: [],
      validationRuleSettings: [],
      prerequisiteRules: [],
      detailedConstraintRules: [],
      validationErrors: [],
      courseSelectionRecords: [],
      lastValidationResult: {
        errors: [],
        executedRuleIds: [],
        skippedRuleIds: [],
        durationMs: 1
      }
    } as unknown as Parameters<typeof migrateProjectState>[0];

    const migrated = migrateProjectState(legacyState);

    expect(migrated.inputRevision).toBe(0);
    expect(migrated.resultRevision).toBeUndefined();
  });

  it("does not invent a result revision for an empty legacy project", () => {
    const legacyState = {
      schemaVersion: 5,
      projectName: "v5-empty",
      createdAt: "2026-07-01T00:00:00.000Z",
      updatedAt: "2026-07-01T00:00:00.000Z",
      importStatuses: [],
      students: [],
      studentSemesterPresence: [],
      operatingSubjects: [],
      courseSelectionRows: [],
      externalCourseInputs: [],
      validationRuleSettings: [],
      prerequisiteRules: [],
      detailedConstraintRules: [],
      validationErrors: [],
      courseSelectionRecords: []
    } as unknown as Parameters<typeof migrateProjectState>[0];

    const migrated = migrateProjectState(legacyState);

    expect(migrated.inputRevision).toBe(0);
    expect(migrated.resultRevision).toBeUndefined();
  });

  it("preserves an existing v6 stale revision pair", () => {
    const currentState = {
      schemaVersion: 6,
      projectName: "v6-stale",
      createdAt: "2026-07-10T00:00:00.000Z",
      updatedAt: "2026-07-10T00:00:00.000Z",
      importStatuses: [],
      students: [],
      studentSemesterPresence: [],
      operatingSubjects: [],
      courseSelectionRows: [],
      externalCourseInputs: [],
      validationRuleSettings: [],
      prerequisiteRules: [],
      detailedConstraintRules: [],
      inputRevision: 2,
      resultRevision: 1,
      validationErrors: [],
      courseSelectionRecords: []
    } as unknown as Parameters<typeof migrateProjectState>[0];

    const migrated = migrateProjectState(currentState);

    expect(migrated.inputRevision).toBe(2);
    expect(migrated.resultRevision).toBe(1);
  });

  it("migrates a truncated project file to empty collections instead of throwing", () => {
    const truncatedState = {
      schemaVersion: currentProjectSchemaVersion
    } as unknown as Parameters<typeof migrateProjectState>[0];

    const migrated = migrateProjectState(truncatedState);

    expect(migrated.operatingSubjects).toEqual([]);
    expect(migrated.students).toEqual([]);
    expect(migrated.studentSemesterPresence).toEqual([]);
    expect(migrated.courseSelectionRows).toEqual([]);
    expect(migrated.externalCourseInputs).toEqual([]);
    expect(migrated.validationErrors).toEqual([]);
    expect(migrated.detailedConstraintRules).toEqual([]);
  });

  it("tolerates a validation result that carries no error list", () => {
    const stateWithoutErrors = {
      schemaVersion: currentProjectSchemaVersion,
      lastValidationResult: {
        executedRuleIds: [],
        skippedRuleIds: [],
        durationMs: 0
      }
    } as unknown as Parameters<typeof migrateProjectState>[0];

    const migrated = migrateProjectState(stateWithoutErrors);

    expect(migrated.lastValidationResult?.errors).toEqual([]);
  });
});
