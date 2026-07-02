import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createEmptyProjectState } from "../state/projectWorkspace";
import {
  assertProjectNameAvailable,
  createProjectRecord,
  createStoredProjectRecord,
  db,
  DuplicateProjectNameError,
  normalizeProjectNameForComparison,
  type StoredProjectRecord
} from "./indexedDbStorage";

const appVersion = "0.1.7";
const savedAt = "2026-07-02T00:00:00.000Z";

function createStoredRecord(id: string, projectName: string): StoredProjectRecord {
  return createStoredProjectRecord({
    appVersion,
    id,
    projectName,
    savedAt,
    state: createEmptyProjectState(projectName, savedAt)
  });
}

describe("indexedDbStorage project names", () => {
  let records: StoredProjectRecord[];

  beforeEach(() => {
    records = [];
    vi.spyOn(db.projects, "orderBy").mockReturnValue({
      reverse: () => ({
        toArray: async () => records
      })
    } as never);
    vi.spyOn(db.projects, "put").mockImplementation((record) => {
      records = [
        ...records.filter((current) => current.id !== record.id),
        record
      ];

      return Promise.resolve(record.id) as never;
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("normalizes project names for visible duplicate checks", () => {
    expect(normalizeProjectNameForComparison("  Test   프로젝트  ")).toBe(
      "test 프로젝트"
    );
  });

  it("rejects creating a project with an existing visible name", async () => {
    records = [createStoredRecord("existing-project", "2026 입학생")];

    await expect(
      createProjectRecord({
        appVersion,
        projectName: "2026   입학생",
        savedAt,
        state: createEmptyProjectState("2026   입학생", savedAt)
      })
    ).rejects.toThrow(DuplicateProjectNameError);

    expect(records).toHaveLength(1);
  });

  it("allows rename checks to exclude the current project only", async () => {
    records = [createStoredRecord("current-project", "현재 프로젝트")];

    await expect(
      assertProjectNameAvailable("현재 프로젝트", {
        excludingProjectId: "current-project"
      })
    ).resolves.toBeUndefined();

    await expect(
      assertProjectNameAvailable("현재 프로젝트", {
        excludingProjectId: "other-project"
      })
    ).rejects.toThrow(DuplicateProjectNameError);
  });
});
