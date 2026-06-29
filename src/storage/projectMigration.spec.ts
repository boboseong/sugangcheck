import { describe, expect, it } from "vitest";
import type { OperatingSubject } from "../types/subject";
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
} satisfies OperatingSubject & { overrideId: string };

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
      masterMatchStatus: "manual"
    });
    expect("overrideId" in (migratedSubject as Record<string, unknown>)).toBe(false);
  });
});
