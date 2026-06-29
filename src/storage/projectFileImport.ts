import type { ProjectFile } from "../types/project";
import { migrateProjectFile } from "./projectMigration";

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function parseProjectFileText(text: string): ProjectFile {
  const parsed: unknown = JSON.parse(text);

  if (!isObject(parsed) || !isObject(parsed.data)) {
    throw new Error("프로젝트 파일 형식이 올바르지 않습니다.");
  }

  return migrateProjectFile(parsed as ProjectFile);
}

export async function readProjectFile(file: File): Promise<ProjectFile> {
  return parseProjectFileText(await file.text());
}
