import { resolveCredits } from "../normalizers/resolveCredits";
import { resolveSubjectMetadata } from "../normalizers/resolveSubjectMetadata";
import type {
  CourseSelectionRecord,
  ExternalCourseInput,
  ParsedCourseSelectionRow
} from "../types/courseSelection";
import { externalCourseSourceTypeLabel } from "../types/courseSelection";
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

  return externalCourseSourceTypeLabel(source.sourceType);
}

function externalCourseOriginType(
  source: ExternalCourseInput
): "transfer" | "externalCourse" {
  const normalizedSourceType = source.sourceType
    .trim()
    .toLocaleLowerCase()
    .replace(/\s+/g, "");

  return ["전입", "전입보완", "전학", "transfer"].includes(normalizedSourceType)
    ? "transfer"
    : "externalCourse";
}

function isExternalCourseInput(
  source: ParsedCourseSelectionRow | ExternalCourseInput
): source is ExternalCourseInput {
  return "sourceType" in source;
}

function findOperatingSubject(
  source: ParsedCourseSelectionRow | ExternalCourseInput,
  operatingSubjects: readonly OperatingSubject[]
): OperatingSubject | undefined {
  return operatingSubjects.find(
    (subject) =>
      subject.target.grade === source.target.grade &&
      subject.target.semester === source.target.semester &&
      subject.normalizedSubjectName === source.normalizedSubjectName
  );
}

function resolveChoiceGroup(
  source: ParsedCourseSelectionRow | ExternalCourseInput,
  operatingSubjects: readonly OperatingSubject[]
): string | undefined {
  if (isExternalCourseInput(source)) {
    return source.choiceGroup;
  }

  return findOperatingSubject(source, operatingSubjects)?.choiceGroup;
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
    const choiceGroup = resolveChoiceGroup(source, input.operatingSubjects);

    if (
      !metadata.subjectGroup ||
      !metadata.selectionType ||
      credits.credits === undefined
    ) {
      issues.push({
        message: [
          !metadata.subjectGroup || !metadata.selectionType
            ? "과목의 교과군·선택구분 정보를 확인할 수 없습니다."
            : undefined,
          credits.credits === undefined ? "학점을 확인할 수 없습니다." : undefined
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
      choiceGroup,
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
              type: externalCourseOriginType(source),
              externalInputId: source.id
            }
    });
  }

  return { records, issues };
}
