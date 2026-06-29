import type { CourseSelectionRecord } from "../types/courseSelection";

export function groupByStudent(
  records: readonly CourseSelectionRecord[]
): Map<string, CourseSelectionRecord[]> {
  const grouped = new Map<string, CourseSelectionRecord[]>();

  for (const record of records) {
    const bucket = grouped.get(record.studentId);
    if (bucket) {
      bucket.push(record);
    } else {
      grouped.set(record.studentId, [record]);
    }
  }

  return grouped;
}

export function sumCredits(records: readonly CourseSelectionRecord[]): number {
  return records.reduce((sum, record) => sum + record.credits, 0);
}

export function representativeRecord(
  records: readonly CourseSelectionRecord[]
): CourseSelectionRecord | undefined {
  return records[0];
}
