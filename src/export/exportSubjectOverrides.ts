import type { SubjectOverride } from "../types/subject";

export function exportSubjectOverrides(overrides: readonly SubjectOverride[]): string {
  return JSON.stringify(
    {
      schemaVersion: 1,
      exportedAt: new Date().toISOString(),
      subjectOverrides: overrides
    },
    null,
    2
  );
}
