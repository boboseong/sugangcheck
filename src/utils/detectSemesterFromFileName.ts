import type { Semester } from "../types/semester";
import { semesterKeys } from "../types/semester";
import { parseSemesterKey } from "./semester";

export type SemesterDetectionResult =
  | {
      status: "detected";
      semester: Semester;
      reason: "korean-grade-semester" | "numeric-grade-semester";
    }
  | {
      status: "failed";
      reason: "no-semester-pattern" | "ambiguous-pattern";
    };

export type FileSemesterAssignment = {
  file: File;
  semester?: Semester;
  status: "detected" | "needsReview";
  reason: SemesterDetectionResult["reason"] | "ordered-fallback";
};

function toSearchableFileName(fileName: string): string {
  return fileName.normalize("NFKC").replace(/\s+/g, "");
}

export function detectSemesterFromFileName(fileName: string): SemesterDetectionResult {
  const searchableFileName = toSearchableFileName(fileName);
  const matches: Semester[] = [];

  for (const match of searchableFileName.matchAll(/([1-3])학년([1-2])학기/g)) {
    matches.push({
      grade: Number(match[1]) as Semester["grade"],
      semester: Number(match[2]) as Semester["semester"]
    });
  }

  if (matches.length === 1) {
    const semester = matches[0];

    if (!semester) {
      return { status: "failed", reason: "ambiguous-pattern" };
    }

    return {
      status: "detected",
      semester,
      reason: "korean-grade-semester"
    };
  }

  if (matches.length > 1) {
    return { status: "failed", reason: "ambiguous-pattern" };
  }

  const numericMatches = [...searchableFileName.matchAll(/(?:^|[^0-9])([1-3])[-_]([1-2])(?:[^0-9]|$)/g)];

  if (numericMatches.length === 1) {
    const match = numericMatches[0];

    if (!match) {
      return { status: "failed", reason: "ambiguous-pattern" };
    }

    return {
      status: "detected",
      semester: {
        grade: Number(match[1]) as Semester["grade"],
        semester: Number(match[2]) as Semester["semester"]
      },
      reason: "numeric-grade-semester"
    };
  }

  if (numericMatches.length > 1) {
    return { status: "failed", reason: "ambiguous-pattern" };
  }

  return { status: "failed", reason: "no-semester-pattern" };
}

export function assignFilesToSemesters(files: readonly File[]): FileSemesterAssignment[] {
  const detectedAssignments = files.map((file) => ({
    file,
    detection: detectSemesterFromFileName(file.name)
  }));
  const detectedSemesters = detectedAssignments
    .map(({ detection }) =>
      detection.status === "detected"
        ? `${detection.semester.grade}-${detection.semester.semester}`
        : undefined
    )
    .filter(Boolean);
  const uniqueDetectedSemesters = new Set(detectedSemesters);
  const allDetected =
    detectedAssignments.length > 0 &&
    detectedAssignments.every(({ detection }) => detection.status === "detected") &&
    uniqueDetectedSemesters.size === detectedAssignments.length;

  if (allDetected) {
    return detectedAssignments.map(({ file, detection }) => ({
      file,
      semester: detection.status === "detected" ? detection.semester : undefined,
      status: "detected",
      reason: detection.reason
    }));
  }

  if (files.length === semesterKeys.length) {
    return [...files].flatMap((file, index) => {
      const key = semesterKeys[index];
      const semester = key ? parseSemesterKey(key) : undefined;

      return [
        {
          file,
          semester,
          status: "needsReview" as const,
          reason: "ordered-fallback" as const
        }
      ];
    });
  }

  return detectedAssignments.map(({ file, detection }) => ({
    file,
    semester: detection.status === "detected" ? detection.semester : undefined,
    status: detection.status === "detected" ? "detected" : "needsReview",
    reason: detection.reason
  }));
}
