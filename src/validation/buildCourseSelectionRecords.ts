import { resolveCredits } from "../normalizers/resolveCredits";
import { resolveSubjectMetadata } from "../normalizers/resolveSubjectMetadata";
import type {
  CourseSelectionRecord,
  ExternalCourseInput,
  ParsedCourseSelectionRow
} from "../types/courseSelection";
import type { Semester } from "../types/semester";
import type { OperatingSubject } from "../types/subject";

export type ValidationMode = "full" | "partial";

export type CourseSelectionRecordBuildIssue = {
  sourceId: string;
  sourceLabel: string;
  studentNo: string;
  studentName: string;
  subjectName: string;
  target: Semester;
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

function resolveSourceLabel(
  source: ParsedCourseSelectionRow | ExternalCourseInput
): string {
  if (!("sourceType" in source)) {
    return "수강신청 결과";
  }

  return source.sourceType === "transfer" ? "전입" : "외부 이수";
}

export function buildCourseSelectionRecords(input: {
  mode: ValidationMode;
  availablePartialSemesters?: readonly Semester[];
  courseSelectionRows: readonly ParsedCourseSelectionRow[];
  externalCourseInputs: readonly ExternalCourseInput[];
  operatingSubjects: readonly OperatingSubject[];
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
      operatingSubjects: input.operatingSubjects
    });
    const credits = resolveCredits({
      source,
      operatingSubjects: input.operatingSubjects
    });

    if (
      !metadata.subjectGroup ||
      !metadata.selectionType ||
      credits.credits === undefined
    ) {
      issues.push({
        message: [
          !metadata.subjectGroup || !metadata.selectionType
            ? "과목 정보가 해석되지 않았습니다."
            : undefined,
          credits.credits === undefined ? "학점이 해석되지 않았습니다." : undefined
        ]
          .filter(Boolean)
          .join(" "),
        sourceLabel: resolveSourceLabel(source),
        sourceId: source.id,
        studentName: source.studentName,
        studentNo: source.studentNo,
        subjectName: source.subjectName,
        target: source.target
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
