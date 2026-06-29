import Dexie, { type Table } from "dexie";
import type { ProjectFile } from "../types/project";
import { createProjectFile } from "./projectFileExport";
import { migrateProjectFile } from "./projectMigration";

export type StoredProjectRecord = {
  id: string;
  schemaVersion: number;
  appVersion: string;
  projectName: string;
  savedAt: string;
  data: ProjectFile;
};

export type StoredProjectSummary = Omit<StoredProjectRecord, "data">;

export const legacyDefaultProjectId = "default";
const activeProjectStorageKey = "sugangcheck.activeProjectId";
const databaseName = "sugangcheck";

class SugangcheckDatabase extends Dexie {
  projects!: Table<StoredProjectRecord, string>;

  constructor(name: string) {
    super(name);
    this.version(1).stores({
      projects: "id, savedAt, schemaVersion"
    });
  }
}

export const db = new SugangcheckDatabase(databaseName);

function createProjectId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `project-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function getActiveProjectId(): string | undefined {
  if (typeof localStorage === "undefined") {
    return undefined;
  }

  return localStorage.getItem(activeProjectStorageKey) ?? undefined;
}

export function setActiveProjectId(projectId: string) {
  if (typeof localStorage === "undefined") {
    return;
  }

  localStorage.setItem(activeProjectStorageKey, projectId);
}

export function clearActiveProjectId() {
  if (typeof localStorage === "undefined") {
    return;
  }

  localStorage.removeItem(activeProjectStorageKey);
}

export function createStoredProjectRecord(input: {
  appVersion: string;
  projectName: string;
  state: ProjectFile["data"];
  id?: string;
  savedAt?: string;
}): StoredProjectRecord {
  const savedAt = input.savedAt ?? new Date().toISOString();
  const projectFile = createProjectFile({
    appVersion: input.appVersion,
    projectName: input.projectName,
    state: input.state,
    savedAt
  });

  return {
    id: input.id ?? createProjectId(),
    schemaVersion: projectFile.schemaVersion,
    appVersion: projectFile.appVersion,
    projectName: projectFile.projectName,
    savedAt,
    data: projectFile
  };
}

export function cloneStoredProjectRecord(input: {
  source: StoredProjectRecord;
  nextName: string;
  id?: string;
  savedAt?: string;
}): StoredProjectRecord {
  const savedAt = input.savedAt ?? new Date().toISOString();

  return createStoredProjectRecord({
    appVersion: input.source.appVersion,
    projectName: input.nextName,
    id: input.id,
    savedAt,
    state: {
      ...structuredClone(input.source.data.data),
      projectName: input.nextName,
      createdAt: savedAt,
      updatedAt: savedAt
    }
  });
}

export async function listProjectRecords(): Promise<StoredProjectSummary[]> {
  const records = await db.projects.orderBy("savedAt").reverse().toArray();

  return records.map(({ data: _data, ...summary }) => summary);
}

export async function createProjectRecord(input: {
  appVersion: string;
  projectName: string;
  state: ProjectFile["data"];
  id?: string;
  savedAt?: string;
}): Promise<StoredProjectRecord> {
  const record = createStoredProjectRecord(input);

  await saveProjectRecord(record);

  return record;
}

export async function saveProjectRecord(record: StoredProjectRecord) {
  // Store structured project state only. Original Excel file binaries stay out of IndexedDB.
  await db.projects.put(record);
}

function projectFileHasLegacySubjectOverrides(projectFile: ProjectFile): boolean {
  return "subjectOverrides" in (projectFile.data as Record<string, unknown>);
}

export async function loadProjectRecord(id = "default") {
  const record = await db.projects.get(id);

  if (!record) {
    return undefined;
  }

  const migratedProjectFile = migrateProjectFile(record.data);
  const needsSave =
    migratedProjectFile.schemaVersion !== record.data.schemaVersion ||
    projectFileHasLegacySubjectOverrides(record.data);

  if (!needsSave) {
    return record;
  }

  const migratedRecord: StoredProjectRecord = {
    ...record,
    schemaVersion: migratedProjectFile.schemaVersion,
    appVersion: migratedProjectFile.appVersion,
    projectName: migratedProjectFile.projectName,
    savedAt: migratedProjectFile.savedAt,
    data: migratedProjectFile
  };

  await saveProjectRecord(migratedRecord);

  return migratedRecord;
}

export async function cloneProjectRecord(
  sourceId: string,
  nextName: string
): Promise<StoredProjectRecord> {
  const source = await loadProjectRecord(sourceId);

  if (!source) {
    throw new Error("복제할 프로젝트를 찾지 못했습니다.");
  }

  const record = cloneStoredProjectRecord({ source, nextName });

  await saveProjectRecord(record);

  return record;
}

export async function deleteProjectRecord(id = "default") {
  await db.projects.delete(id);
}

export async function clearAllProjectRecords() {
  await db.projects.clear();
  clearActiveProjectId();
}

export const clearProjectRecords = clearAllProjectRecords;
