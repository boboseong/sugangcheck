import type { ProjectFile, ProjectState } from "../types/project";
import { currentProjectSchemaVersion } from "./projectMigration";

export function createProjectFile(input: {
  appVersion: string;
  projectName: string;
  state: ProjectState;
  savedAt?: string;
}): ProjectFile {
  const savedAt = input.savedAt ?? new Date().toISOString();

  return {
    schemaVersion: currentProjectSchemaVersion,
    appVersion: input.appVersion,
    savedAt,
    projectName: input.projectName,
    data: {
      ...input.state,
      schemaVersion: currentProjectSchemaVersion,
      projectName: input.projectName,
      updatedAt: savedAt
    }
  };
}

export function serializeProjectFile(projectFile: ProjectFile): string {
  return JSON.stringify(projectFile, null, 2);
}

export function projectFileName(projectName: string, savedAt = new Date()): string {
  const safeProjectName = projectName.trim().replace(/[\\/:*?"<>|]/g, "_") || "project";
  const datePart = savedAt.toISOString().slice(0, 10).replace(/-/g, "");

  return `${safeProjectName}_${datePart}.sugangcheck.json`;
}

export function createProjectFileBlob(projectFile: ProjectFile): Blob {
  return new Blob([serializeProjectFile(projectFile)], {
    type: "application/json"
  });
}
