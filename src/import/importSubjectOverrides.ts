import type { SubjectOverride } from "../types/subject";

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function importSubjectOverrides(text: string): SubjectOverride[] {
  const parsed: unknown = JSON.parse(text);

  if (!isObject(parsed) || !Array.isArray(parsed.subjectOverrides)) {
    throw new Error("과목 보정값 파일 형식이 올바르지 않습니다.");
  }

  return parsed.subjectOverrides as SubjectOverride[];
}
