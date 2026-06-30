import { useState } from "react";
import type { CourseSelectionRecord } from "../types/courseSelection";
import { semesterKeys } from "../types/semester";
import type { Student } from "../types/student";
import type { ValidationError } from "../types/validation";
import { parseSemesterKey, semesterLabel } from "../utils/semester";
import { StatusBadge } from "../components/ui/StatusBadge";
import { calculateKoreanMathEnglishLimitCredits } from "../data/defaultCreditCriteria";

type StudentCourseReportProps = {
  student?: Student;
  records: readonly CourseSelectionRecord[];
  errors: readonly ValidationError[];
};

type SemesterRecordSummary = {
  key: string;
  label: string;
  gradeLabel: string;
  semesterLabel: string;
  records: CourseSelectionRecord[];
  credits: number;
};

const subjectGroupCreditColumns = [
  "국어",
  "수학",
  "영어",
  "사회",
  "과학",
  "체육",
  "예술",
  "기술·가정/정보",
  "제2외국어/한문",
  "교양"
];

const koreanMathEnglishSubjectGroups = ["국어", "수학", "영어"];

const lifeLiberalSubjectGroups = [
  "기술·가정/정보",
  "제2외국어/한문",
  "교양"
];

function subjectGroupCredits(records: readonly CourseSelectionRecord[]): [string, number][] {
  const totals = new Map<string, number>();

  for (const record of records) {
    totals.set(record.subjectGroup, (totals.get(record.subjectGroup) ?? 0) + record.credits);
  }

  return subjectGroupCreditColumns.map((subjectGroup) => [
    subjectGroup,
    totals.get(subjectGroup) ?? 0
  ]);
}

function subjectGroupSortIndex(subjectGroup: string): number {
  const index = subjectGroupCreditColumns.indexOf(subjectGroup);

  return index === -1 ? Number.MAX_SAFE_INTEGER : index;
}

function sortRecordsBySubjectGroupOrder(
  records: readonly CourseSelectionRecord[]
): CourseSelectionRecord[] {
  return records
    .map((record, index) => ({ record, index }))
    .sort((left, right) => {
      const subjectGroupCompare =
        subjectGroupSortIndex(left.record.subjectGroup) -
        subjectGroupSortIndex(right.record.subjectGroup);

      return subjectGroupCompare === 0
        ? left.index - right.index
        : subjectGroupCompare;
    })
    .map(({ record }) => record);
}

function buildSemesterRecordSummaries(
  records: readonly CourseSelectionRecord[]
): SemesterRecordSummary[] {
  const summaries: SemesterRecordSummary[] = [];

  for (const key of semesterKeys) {
    const semester = parseSemesterKey(key);

    if (!semester) {
      continue;
    }

    const semesterRecords = sortRecordsBySubjectGroupOrder(
      records.filter(
        (record) =>
          record.target.grade === semester.grade &&
          record.target.semester === semester.semester
      )
    );

    summaries.push({
      key,
      label: semesterLabel(semester),
      gradeLabel: `${semester.grade}학년`,
      semesterLabel: `${semester.semester}학기`,
      records: semesterRecords,
      credits: semesterRecords.reduce((sum, record) => sum + record.credits, 0)
    });
  }

  return summaries;
}

function compactErrorMessage(error: ValidationError): string {
  return error.semester ? `${semesterLabel(error.semester)}: ${error.message}` : error.message;
}

function compactGroupType(groupType?: string): string | undefined {
  if (!groupType) {
    return undefined;
  }

  return groupType.replace(/교과$/u, "");
}

function formatSubjectGroupDetail(record: CourseSelectionRecord): string {
  return [record.subjectGroup, record.selectionType, compactGroupType(record.groupType)]
    .filter((part): part is string => Boolean(part))
    .join(" · ");
}

function formatCreditLimit(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

function padSemesterRecords(
  records: readonly CourseSelectionRecord[],
  length: number
): (CourseSelectionRecord | undefined)[] {
  return [
    ...records,
    ...Array.from({ length: Math.max(0, length - records.length) }, () => undefined)
  ];
}

function subjectGroupMatchesCreditColumn(
  subjectGroup: string,
  activeCreditColumn?: string
): boolean {
  if (!activeCreditColumn) {
    return false;
  }

  if (activeCreditColumn === "국수영") {
    return koreanMathEnglishSubjectGroups.includes(subjectGroup);
  }

  if (activeCreditColumn === "생활교양") {
    return lifeLiberalSubjectGroups.includes(subjectGroup);
  }

  return subjectGroup === activeCreditColumn;
}

export function StudentCourseReport({
  student,
  records,
  errors
}: StudentCourseReportProps) {
  const [activeCreditColumn, setActiveCreditColumn] = useState<string | undefined>();

  if (!student) {
    return (
      <div className="empty-panel">
        <p>학생을 선택하면 확인서가 표시됩니다.</p>
      </div>
    );
  }

  const studentRecords = records;
  const studentErrors = errors;
  const semesterSummaries = buildSemesterRecordSummaries(studentRecords);
  const maxSemesterRecordCount = Math.max(
    1,
    ...semesterSummaries.map((summary) => summary.records.length)
  );
  const groupedCredits = subjectGroupCredits(studentRecords);
  const totalCredits = studentRecords.reduce((sum, record) => sum + record.credits, 0);
  const kmeCredits = studentRecords
    .filter((record) => koreanMathEnglishSubjectGroups.includes(record.subjectGroup))
    .reduce((sum, record) => sum + record.credits, 0);
  const kmeLimitCredits = calculateKoreanMathEnglishLimitCredits(totalCredits);
  const formattedKmeLimitCredits = formatCreditLimit(kmeLimitCredits);
  const lifeLiberalCredits = studentRecords
    .filter((record) => lifeLiberalSubjectGroups.includes(record.subjectGroup))
    .reduce((sum, record) => sum + record.credits, 0);
  const totalSubjectCount = studentRecords.length;
  const highlightedCellClassName = "student-report-matrix-table__cell--highlighted";
  const isRecordHighlighted = (record: CourseSelectionRecord) =>
    subjectGroupMatchesCreditColumn(record.subjectGroup, activeCreditColumn);
  const toggleCreditColumn = (creditColumn: string) =>
    setActiveCreditColumn((current) =>
      current === creditColumn ? undefined : creditColumn
    );

  return (
    <article className="student-report student-report--compact">
      <header className="student-report__header">
        <div>
          <h2>{student.name} - 수강신청 확인서</h2>
          <p>
            {student.studentNo} · {student.currentClassNo ?? "-"}반{" "}
            {student.currentNumber ?? "-"}번
          </p>
        </div>
        <div className="student-report__summary-strip">
          <span>
            과목수 <strong>{totalSubjectCount}</strong>
          </span>
          <span>
            이수학점 <strong>{totalCredits}</strong>
          </span>
          <span>
            국수영 <strong>{`${kmeCredits} / ${formattedKmeLimitCredits}`}</strong>
          </span>
          <StatusBadge tone={studentErrors.length > 0 ? "warning" : "ready"}>
            {`오류 ${studentErrors.length}건`}
          </StatusBadge>
        </div>
      </header>

      <section className="student-report__section">
        <h3>학기별 신청 과목</h3>
        <div className="student-report-semester-grid">
          {semesterSummaries.map((summary) => (
            <section className="student-report-semester" key={summary.key}>
              <div className="student-report-semester__heading">
                <h4>{summary.label}</h4>
                <span>
                  {summary.records.length}과목 · {summary.credits}학점
                </span>
              </div>
              <table className="student-report-matrix-table">
                <colgroup>
                  {Array.from({ length: maxSemesterRecordCount + 1 }, (_, index) => (
                    <col key={index} />
                  ))}
                </colgroup>
                <tbody>
                  <tr>
                    <th>과목명</th>
                    {padSemesterRecords(summary.records, maxSemesterRecordCount).map(
                      (record, index) =>
                        record ? (
                          <td
                            className={
                              isRecordHighlighted(record) ? highlightedCellClassName : undefined
                            }
                            key={`${record.id}-name`}
                          >
                          <strong>{record.subjectName}</strong>
                          </td>
                        ) : (
                          <td
                            className={summary.records.length === 0 ? "muted-text" : undefined}
                            key={`${summary.key}-empty-name-${index}`}
                          >
                            {summary.records.length === 0 && index === 0 ? "과목 없음" : ""}
                          </td>
                        )
                    )}
                  </tr>
                  <tr>
                    <th>교과군</th>
                    {padSemesterRecords(summary.records, maxSemesterRecordCount).map(
                      (record, index) =>
                        record ? (
                          <td
                            className={
                              isRecordHighlighted(record) ? highlightedCellClassName : undefined
                            }
                            key={`${record.id}-group`}
                          >
                            {formatSubjectGroupDetail(record)}
                          </td>
                        ) : (
                          <td key={`${summary.key}-empty-group-${index}`}>
                            {summary.records.length === 0 && index === 0 ? "-" : ""}
                          </td>
                        )
                    )}
                  </tr>
                  <tr>
                    <th>학점</th>
                    {padSemesterRecords(summary.records, maxSemesterRecordCount).map(
                      (record, index) =>
                        record ? (
                          <td
                            className={
                              isRecordHighlighted(record) ? highlightedCellClassName : undefined
                            }
                            key={`${record.id}-credits`}
                          >
                            {record.credits}
                          </td>
                        ) : (
                          <td key={`${summary.key}-empty-credits-${index}`}>
                            {summary.records.length === 0 && index === 0 ? "0" : ""}
                          </td>
                        )
                    )}
                  </tr>
                </tbody>
              </table>
            </section>
          ))}
        </div>
        <div className="student-report-total-row">
          <span>합계</span>
          <strong>{totalSubjectCount}과목</strong>
          <strong>{totalCredits}학점</strong>
        </div>
      </section>

      <section className="student-report__section">
        <h3>교과군별 학점</h3>
        <table className="student-report-credit-table">
          <colgroup>
            {Array.from({ length: groupedCredits.length + 3 }, (_, index) => (
              <col key={index} />
            ))}
          </colgroup>
          <thead>
            <tr>
              {groupedCredits.map(([subjectGroup]) => (
                <th key={subjectGroup}>
                  <button
                    aria-pressed={activeCreditColumn === subjectGroup}
                    className="student-report-credit-table__group-button"
                    onClick={() => toggleCreditColumn(subjectGroup)}
                    type="button"
                  >
                    {subjectGroup}
                  </button>
                </th>
              ))}
              <th>
                <button
                  aria-pressed={activeCreditColumn === "국수영"}
                  className="student-report-credit-table__group-button"
                  onClick={() => toggleCreditColumn("국수영")}
                  type="button"
                >
                  국수영
                </button>
              </th>
              <th>
                <button
                  aria-pressed={activeCreditColumn === "생활교양"}
                  className="student-report-credit-table__group-button"
                  onClick={() => toggleCreditColumn("생활교양")}
                  type="button"
                >
                  생활교양
                </button>
              </th>
              <th>총학점</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              {groupedCredits.map(([subjectGroup, credits]) => (
                <td key={subjectGroup}>{credits}</td>
              ))}
              <td>{`${kmeCredits}/${formattedKmeLimitCredits}(최대)`}</td>
              <td>{lifeLiberalCredits}</td>
              <td>{totalCredits}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="student-report__section student-report__notes">
        <h3>비고</h3>
        {studentErrors.length === 0 ? (
          <p className="muted-text">표시할 오류가 없습니다.</p>
        ) : (
          <ul className="report-error-list">
            {studentErrors.map((error) => (
              <li key={error.id}>{compactErrorMessage(error)}</li>
            ))}
          </ul>
        )}
      </section>
    </article>
  );
}
