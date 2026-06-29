import { BarChart3, GitCompareArrows, Upload } from "lucide-react";
import { useMemo, useState, type ChangeEvent } from "react";
import { PageHeader } from "../components/ui/PageHeader";
import {
  detectCourseSelectionSemestersFromWorkbook,
  parseCourseSelectionWorkbook,
  type CourseSelectionSemesterDetection
} from "../parsers/parseCourseSelectionFile";
import { readWorkbookFromFile } from "../parsers/readWorkbook";
import {
  compareCourseSelectionChanges,
  type CourseSelectionChangeComparison
} from "../tools/courseSelectionChangeTracker";
import type { ParsedCourseSelectionRow } from "../types/courseSelection";
import type { Semester } from "../types/semester";
import { semesterLabel, semesterToKey } from "../utils/semester";

type ComparisonSide = "previous" | "next";
type ResultTab = "studentChanges" | "subjectChanges";

type PreparedComparisonFile = {
  fileName: string;
  rows: ParsedCourseSelectionRow[];
  rowCount: number;
  failedRowCount: number;
  semesterCount: number;
};

type ComparisonResult = {
  previous: PreparedComparisonFile;
  next: PreparedComparisonFile;
  comparison: CourseSelectionChangeComparison;
};

const resultTabs: { id: ResultTab; label: string }[] = [
  { id: "studentChanges", label: "학생별 변경" },
  { id: "subjectChanges", label: "과목별 인원 변동" }
];

function uniqueDetections(
  detections: readonly CourseSelectionSemesterDetection[]
): CourseSelectionSemesterDetection[] {
  const seen = new Set<string>();

  return detections.filter((detection) => {
    const key = `${semesterToKey(detection.semester)}|${detection.sheetName ?? ""}`;

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

function uniqueSemesterCount(rows: readonly ParsedCourseSelectionRow[]): number {
  return new Set(rows.map((row) => semesterToKey(row.target))).size;
}

async function parseComparisonFile(
  file: File,
  side: ComparisonSide
): Promise<PreparedComparisonFile> {
  const workbook = await readWorkbookFromFile(file);
  const detections = uniqueDetections(
    detectCourseSelectionSemestersFromWorkbook(workbook)
  );
  const results =
    detections.length > 0
      ? detections.map((detection) =>
          parseCourseSelectionWorkbook(workbook, {
            semesterImportId: `compare-${side}-${semesterToKey(
              detection.semester
            )}`,
            target: detection.semester,
            fileName: file.name,
            sheetName: detection.sheetName
          })
        )
      : [
          parseCourseSelectionWorkbook(workbook, {
            semesterImportId: `compare-${side}`,
            fileName: file.name
          })
        ];
  const rows = results.flatMap((result) => result.rows);
  const failedRowCount = results.reduce(
    (total, result) => total + result.failedRows.length,
    0
  );

  return {
    fileName: file.name,
    rows,
    rowCount: rows.length,
    failedRowCount,
    semesterCount: uniqueSemesterCount(rows)
  };
}

function subjectList(subjects: readonly string[], tone: "canceled" | "applied") {
  if (subjects.length === 0) {
    return <span className="muted-text">없음</span>;
  }

  return (
    <div className="change-subject-list">
      {subjects.map((subject) => (
        <span
          className={`change-subject-chip change-subject-chip--${tone}`}
          key={subject}
        >
          {subject}
        </span>
      ))}
    </div>
  );
}

function signedNumber(value: number): string {
  return value > 0 ? `+${value}` : String(value);
}

function sortSemestersFromRows(rows: readonly ParsedCourseSelectionRow[]): Semester[] {
  const semesterByKey = new Map<string, Semester>();

  rows.forEach((row) => {
    semesterByKey.set(semesterToKey(row.target), row.target);
  });

  return [...semesterByKey.values()].sort(
    (left, right) => left.grade - right.grade || left.semester - right.semester
  );
}

function FileUploadCard({
  file,
  inputId,
  label,
  onFileSelected,
  prepared
}: {
  file?: File;
  inputId: string;
  label: string;
  onFileSelected: (file: File | undefined) => void;
  prepared?: PreparedComparisonFile;
}) {
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    onFileSelected(event.target.files?.[0]);
    event.target.value = "";
  }

  return (
    <div className="change-file-card">
      <div className="change-file-card__header">
        <strong>{label}</strong>
        <label className="button button--secondary button--compact" htmlFor={inputId}>
          <Upload size={15} aria-hidden="true" />
          <span>파일 선택</span>
        </label>
        <input
          accept=".xls,.xlsx,.xlsm"
          className="visually-hidden"
          id={inputId}
          onChange={handleChange}
          type="file"
        />
      </div>
      <p className="change-file-card__name">
        {file?.name ?? "선택한 파일 없음"}
      </p>
      {prepared ? (
        <p className="muted-text">
          {prepared.semesterCount.toLocaleString()}개 학기 · 원천 행{" "}
          {prepared.rowCount.toLocaleString()}개
          {prepared.failedRowCount > 0
            ? ` · 읽지 못한 행 ${prepared.failedRowCount.toLocaleString()}개`
            : ""}
        </p>
      ) : (
        <p className="muted-text">비교 실행 후 읽은 행 수가 표시됩니다.</p>
      )}
    </div>
  );
}

function StudentChangesTable({
  comparison
}: {
  comparison: CourseSelectionChangeComparison;
}) {
  if (comparison.studentChanges.length === 0) {
    return (
      <div className="empty-panel">
        <p>두 파일의 수강신청 과목 차이가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="change-table-wrap">
      <table className="placeholder-table change-result-table">
        <thead>
          <tr>
            <th>학기</th>
            <th>학생</th>
            <th>취소한 과목</th>
            <th>신청한 과목</th>
          </tr>
        </thead>
        <tbody>
          {comparison.studentChanges.map((change) => (
            <tr key={change.id}>
              <td>{semesterLabel(change.target)}</td>
              <td>
                {change.studentName}
                <br />
                <span className="muted-text">{change.studentNo}</span>
              </td>
              <td>{subjectList(change.canceledSubjects, "canceled")}</td>
              <td>{subjectList(change.appliedSubjects, "applied")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SubjectChangesTable({
  comparison
}: {
  comparison: CourseSelectionChangeComparison;
}) {
  if (comparison.subjectChanges.length === 0) {
    return (
      <div className="empty-panel">
        <p>과목별 인원 변동이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="change-table-wrap">
      <table className="placeholder-table change-result-table">
        <thead>
          <tr>
            <th>학기</th>
            <th>과목</th>
            <th>기준 인원</th>
            <th>비교 인원</th>
            <th>증감</th>
            <th>신청</th>
            <th>취소</th>
          </tr>
        </thead>
        <tbody>
          {comparison.subjectChanges.map((change) => (
            <tr key={change.id}>
              <td>{semesterLabel(change.target)}</td>
              <td>{change.subjectName}</td>
              <td>{change.previousCount.toLocaleString()}</td>
              <td>{change.nextCount.toLocaleString()}</td>
              <td>
                <strong
                  className={
                    change.delta > 0
                      ? "change-delta change-delta--positive"
                      : change.delta < 0
                        ? "change-delta change-delta--negative"
                        : "change-delta"
                  }
                >
                  {signedNumber(change.delta)}
                </strong>
              </td>
              <td>{change.appliedCount.toLocaleString()}</td>
              <td>{change.canceledCount.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function MiscToolsPage() {
  const [previousFile, setPreviousFile] = useState<File>();
  const [nextFile, setNextFile] = useState<File>();
  const [activeTab, setActiveTab] = useState<ResultTab>("studentChanges");
  const [comparisonResult, setComparisonResult] = useState<ComparisonResult>();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [isComparing, setIsComparing] = useState(false);
  const comparisonSemesters = useMemo(() => {
    if (!comparisonResult) {
      return [];
    }

    return sortSemestersFromRows([
      ...comparisonResult.previous.rows,
      ...comparisonResult.next.rows
    ]);
  }, [comparisonResult]);

  function handlePreviousFileSelected(file: File | undefined) {
    setPreviousFile(file);
    setComparisonResult(undefined);
    setErrorMessage(undefined);
  }

  function handleNextFileSelected(file: File | undefined) {
    setNextFile(file);
    setComparisonResult(undefined);
    setErrorMessage(undefined);
  }

  async function handleCompare() {
    if (!previousFile || !nextFile) {
      setErrorMessage("기준 파일과 비교 파일을 모두 선택하세요.");
      return;
    }

    setIsComparing(true);
    setErrorMessage(undefined);

    try {
      const [previous, next] = await Promise.all([
        parseComparisonFile(previousFile, "previous"),
        parseComparisonFile(nextFile, "next")
      ]);

      setComparisonResult({
        previous,
        next,
        comparison: compareCourseSelectionChanges(previous.rows, next.rows)
      });
      setActiveTab("studentChanges");
    } catch (error) {
      setComparisonResult(undefined);
      setErrorMessage(
        error instanceof Error ? error.message : "두 파일을 비교하지 못했습니다."
      );
    } finally {
      setIsComparing(false);
    }
  }

  return (
    <section className="page">
      <PageHeader
        title="기타 도구"
        description="점검 본 작업과 별도로 필요한 보조 작업을 실행합니다. 수강신청 변경 추적은 두 결과 파일을 비교해 학기별 취소 과목과 신청 과목을 확인합니다."
      />
      <div className="tool-tab-bar" aria-label="기타 도구 목록">
        <button className="tool-tab tool-tab--active" type="button">
          <GitCompareArrows size={16} />
          <span>수강신청 변경 추적</span>
        </button>
      </div>
      <div className="change-file-grid">
        <FileUploadCard
          file={previousFile}
          inputId="course-change-previous-file"
          label="기준 파일"
          onFileSelected={handlePreviousFileSelected}
          prepared={comparisonResult?.previous}
        />
        <FileUploadCard
          file={nextFile}
          inputId="course-change-next-file"
          label="비교 파일"
          onFileSelected={handleNextFileSelected}
          prepared={comparisonResult?.next}
        />
        <div className="change-compare-actions">
          <button
            className="button"
            disabled={isComparing}
            onClick={handleCompare}
            type="button"
          >
            <GitCompareArrows size={16} />
            <span>{isComparing ? "비교 중" : "비교 실행"}</span>
          </button>
        </div>
      </div>
      {errorMessage ? (
        <div className="change-message change-message--error" role="alert">
          {errorMessage}
        </div>
      ) : null}
      {comparisonResult ? (
        <>
          <div className="metric-row change-summary-row">
            <div className="metric">
              <p className="metric__label">변경 학생</p>
              <p className="metric__value">
                {comparisonResult.comparison.summary.changedStudentCount.toLocaleString()}명
              </p>
            </div>
            <div className="metric">
              <p className="metric__label">학생·학기 변경</p>
              <p className="metric__value">
                {comparisonResult.comparison.summary.changedStudentSemesterCount.toLocaleString()}건
              </p>
            </div>
            <div className="metric">
              <p className="metric__label">취소한 과목</p>
              <p className="metric__value">
                {comparisonResult.comparison.summary.canceledSubjectCount.toLocaleString()}건
              </p>
            </div>
            <div className="metric">
              <p className="metric__label">신청한 과목</p>
              <p className="metric__value">
                {comparisonResult.comparison.summary.appliedSubjectCount.toLocaleString()}건
              </p>
            </div>
          </div>
          <div className="prep-status-row">
            <span className="status-badge status-badge--empty">
              비교 학기{" "}
              {comparisonSemesters.map((semester) => semesterLabel(semester)).join(", ")}
            </span>
            <span className="status-badge status-badge--empty">
              변동 과목{" "}
              {comparisonResult.comparison.summary.changedSubjectCount.toLocaleString()}개
            </span>
          </div>
          <div className="section">
            <div className="change-result-tabs" role="tablist">
              {resultTabs.map((tab) => (
                <button
                  aria-selected={activeTab === tab.id}
                  className={
                    activeTab === tab.id
                      ? "change-result-tab change-result-tab--active"
                      : "change-result-tab"
                  }
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  role="tab"
                  type="button"
                >
                  {tab.id === "subjectChanges" ? (
                    <BarChart3 size={16} />
                  ) : (
                    <GitCompareArrows size={16} />
                  )}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
            <div className="preview-table-wrap">
              <div className="preview-table-meta">
                <strong>
                  {activeTab === "studentChanges"
                    ? "학기별 취소/신청 과목"
                    : "과목별 인원 변동"}
                </strong>
                <span>
                  {activeTab === "studentChanges"
                    ? `${comparisonResult.comparison.studentChanges.length.toLocaleString()}행`
                    : `${comparisonResult.comparison.subjectChanges.length.toLocaleString()}과목`}
                </span>
              </div>
              {activeTab === "studentChanges" ? (
                <StudentChangesTable comparison={comparisonResult.comparison} />
              ) : (
                <SubjectChangesTable comparison={comparisonResult.comparison} />
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="empty-panel change-empty-panel">
          <p>두 수강신청 결과 파일을 선택하고 비교를 실행하면 결과가 표시됩니다.</p>
        </div>
      )}
    </section>
  );
}
