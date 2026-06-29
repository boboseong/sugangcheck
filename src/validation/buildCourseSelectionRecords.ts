import { resolveCredits } from "../normalizers/resolveCredits";
import { resolveSubjectMetadata } from "../normalizers/resolveSubjectMetadata";
import type {
  CourseSelectionRecord,
  ExternalCourseInput,
  ParsedCourseSelectionRow
} from "../types/courseSelection";
import type { Semester } from "../types/semester";
import type { OperatingSubject, SubjectOverride } from "../types/subject";

export type ValidationMode = "full" | "partial";

export type CourseSelectionRecordBuildIssue = {
  sourceId: string;
  subjectName: string;
  message: string;
};

export type BuildCourseSelectionRecordsResult = {
  records: CourseSelectionRecord[];
  issues: CourseSelectionRecordBuildIssue[];
};

function semesterAllowed(
  target: Semester,
  mode: ValidationMode,
  availableSemesters?: readonly Semester[]
): boolean {
  if (mode === "full" || !availableSemesters) {
    return true;
  }

  return availableSemesters.some(
    (semester) =>
      semester.grade === target.grade && semester.semester === target.semester
  );
}

function buildRecordId(sourceId: string): string {
  return `record-${sourceId}`;
}

export function buildCourseSelectionRecords(input: {
  mode: ValidationMode;
  availablePartialSemesters?: readonly Semester[];
  courseSelectionRows: readonly ParsedCourseSelectionRow[];
  externalCourseInputs: readonly ExternalCourseInput[];
  operatingSubjects: readonly OperatingSubject[];
  subjectOverrides: readonly SubjectOverride[];
}): BuildCourseSelectionRecordsResult {
  const sources = [
    ...input.courseSelectionRows.filter((row) =>
      semesterAllowed(row.target, input.mode, input.availablePartialSemesters)
    ),
    ...input.externalCourseInputs.filter((row) =>
      semesterAllowed(row.target, input.mode, input.availablePartialSemesters)
    )
  ];
  const records: CourseSelectionRecord[] = [];
  const issues: CourseSelectionRecordBuildIssue[] = [];

  for (const source of sources) {
    const metadata = resolveSubjectMetadata({
      source,
      operatingSubjects: input.operatingSubjects,
      subjectOverrides: input.subjectOverrides
    });
    const credits = resolveCredits({
      source,
      operatingSubjects: input.operatingSubjects,
      subjectOverrides: input.subjectOverrides
    });

    if (
      !metadata.subjectGroup ||
      !metadata.selectionType ||
      credits.credits === undefined
    ) {
      issues.push({
        sourceId: source.id,
        subjectName: source.subjectName,
        message: [
          !metadata.subjectGroup || !metadata.selectionType
            ? "과목 정보가 해석되지 않았습니다."
            : undefined,
          credits.credits === undefined ? "학점이 해석되지 않았습니다." : undefined
        ]
          .filter(Boolean)
          .join(" ")
      });
      continue;
    }

    records.push({
      id: buildRecordId(source.id),
      studentId: source.studentId,
      studentNo: source.studentNo,
      studentName: source.studentName,
      target: source.target,
      subjectName: source.subjectName,
      normalizedSubjectName: source.normalizedSubjectName,
      subjectGroup: metadata.subjectGroup,
      selectionType: metadata.selectionType,
      groupType: metadata.groupType,
      credits: credits.credits,
      origin:
        "semesterImportId" in source
          ? {
              type: "courseSelectionFile",
              semesterImportId: source.semesterImportId,
              parsedRowId: source.id,
              sourceLocation: source.sourceLocation
            }
          : {
              type: source.sourceType,
              externalInputId: source.id
            }
    });
  }

  return { records, issues };
}
