import { Download, RotateCcw, X } from "lucide-react";
import { useMemo, useState } from "react";
import {
  buildSubjectEnrollmentSummaries,
  filterSubjectEnrollmentSummaries,
  sortSubjectEnrollmentSummaries,
  unresolvedSubjectGroup,
  type SubjectEnrollmentSummary,
  type SubjectEnrollmentSort
} from "../analytics/subjectEnrollment";
import { PageHeader } from "../components/ui/PageHeader";
import { Button } from "../components/ui/Button";
import { IconButton } from "../components/ui/IconButton";
import { StatusBadge } from "../components/ui/StatusBadge";
import {
  exportSubjectEnrollmentStudentListXlsx,
  exportSubjectEnrollmentXlsx,
  subjectEnrollmentFileNames,
  subjectEnrollmentStudentListFileName,
  type SubjectEnrollmentExportMode
} from "../export/exportSubjectEnrollmentXlsx";
import { useCourseSelectionRawStore } from "../state/courseSelectionRawStore";
import { useOperatingSubjectStore } from "../state/operatingSubjectStore";
import type { ParsedCourseSelectionRow } from "../types/courseSelection";
import { semesterKeys, type SemesterKey } from "../types/semester";
import { downloadBlob } from "../utils/downloadBlob";
import { parseSemesterKey, semesterLabel } from "../utils/semester";

type PageFilters = {
  semesterKey: SemesterKey | "all";
  subjectGroup: string | "all";
  query: string;
  minStudentCount: string;
  maxStudentCount: string;
};

const defaultFilters: PageFilters = {
  semesterKey: "all",
  subjectGroup: "all",
  query: "",
  minStudentCount: "",
  maxStudentCount: ""
};

const defaultSort: SubjectEnrollmentSort = {
  key: "semester",
  direction: "asc"
};

function numberFilterValue(value: string): number | undefined {
  const trimmed = value.trim();

  if (!trimmed) {
    return undefined;
  }

  const parsed = Number(trimmed);

  return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined;
}

function metadataTone(
  source: ReturnType<typeof buildSubjectEnrollmentSummaries>[number]["metadataSource"]
): "ready" | "warning" | "error" {
  if (source === "operatingSubject") {
    return "ready";
  }

  return source === "subjectMaster" ? "warning" : "error";
}

function metadataLabel(
  source: ReturnType<typeof buildSubjectEnrollmentSummaries>[number]["metadataSource"]
): string {
  if (source === "operatingSubject") {
    return "운영과목";
  }

  return source === "subjectMaster" ? "마스터" : "미확인";
}

function uniqueStudentCount(
  rows: readonly ParsedCourseSelectionRow[]
): number {
  return new Set(rows.map((row) => row.studentId)).size;
}

function semesterOptionLabel(key: SemesterKey): string {
  const semester = parseSemesterKey(key);

  return semester ? semesterLabel(semester) : key;
}

export function SubjectEnrollmentPage() {
  const { courseSelectionRows } = useCourseSelectionRawStore();
  const { operatingSubjects } = useOperatingSubjectStore();
  const [filters, setFilters] = useState<PageFilters>(defaultFilters);
  const [sort, setSort] = useState<SubjectEnrollmentSort>(defaultSort);
  const [selectedSummaryId, setSelectedSummaryId] = useState<string>();
  const summaries = useMemo(
    () => buildSubjectEnrollmentSummaries(courseSelectionRows, operatingSubjects),
    [courseSelectionRows, operatingSubjects]
  );
  const subjectGroups = useMemo(
    () =>
      [...new Set(summaries.map((summary) => summary.subjectGroup))].sort((left, right) =>
        left.localeCompare(right, "ko", { numeric: true })
      ),
    [summaries]
  );
  const visibleSummaries = useMemo(
    () =>
      sortSubjectEnrollmentSummaries(
        filterSubjectEnrollmentSummaries(summaries, {
          semesterKey: filters.semesterKey,
          subjectGroup: filters.subjectGroup,
          query: filters.query,
          minStudentCount: numberFilterValue(filters.minStudentCount),
          maxStudentCount: numberFilterValue(filters.maxStudentCount)
        }),
        sort
      ),
    [filters, sort, summaries]
  );
  const hasActiveFilters =
    filters.semesterKey !== defaultFilters.semesterKey ||
    filters.subjectGroup !== defaultFilters.subjectGroup ||
    filters.query !== defaultFilters.query ||
    filters.minStudentCount !== defaultFilters.minStudentCount ||
    filters.maxStudentCount !== defaultFilters.maxStudentCount;
  const unresolvedCount = summaries.filter(
    (summary) => summary.subjectGroup === unresolvedSubjectGroup
  ).length;
  const selectedSummary = visibleSummaries.find(
    (summary) => summary.id === selectedSummaryId
  );

  async function handleDownload(mode: SubjectEnrollmentExportMode) {
    await downloadBlob(
      exportSubjectEnrollmentXlsx(visibleSummaries, mode),
      subjectEnrollmentFileNames[mode]
    );
  }

  async function handleDownloadSelectedStudents(summary: SubjectEnrollmentSummary) {
    await downloadBlob(
      exportSubjectEnrollmentStudentListXlsx(summary),
      subjectEnrollmentStudentListFileName(summary)
    );
  }

  return (
    <section className="page">
      <PageHeader
        title="과목별 수강생"
        description="학기와 과목별 수강신청 인원을 집계하고 교과군, 학기, 인원수 기준으로 확인합니다."
      />
      <div className="prep-status-row">
        <span className="status-badge status-badge--empty">
          과목 {summaries.length.toLocaleString()}개
        </span>
        <span className="status-badge status-badge--empty">
          신청 학생 {uniqueStudentCount(courseSelectionRows).toLocaleString()}명
        </span>
        <span className="status-badge status-badge--empty">
          표시 {visibleSummaries.length.toLocaleString()}개
        </span>
        {unresolvedCount > 0 ? (
          <span className="status-badge status-badge--warning">
            미확인 {unresolvedCount.toLocaleString()}개
          </span>
        ) : null}
        <button
          className="button button--secondary button--compact"
          disabled={visibleSummaries.length === 0}
          onClick={() => handleDownload("all")}
          type="button"
        >
          <Download size={16} />
          <span>전체 자료</span>
        </button>
        <button
          className="button button--secondary button--compact"
          disabled={visibleSummaries.length === 0}
          onClick={() => handleDownload("subjectGroup")}
          type="button"
        >
          <Download size={16} />
          <span>교과군별 자료</span>
        </button>
        <button
          className="button button--secondary button--compact"
          disabled={visibleSummaries.length === 0}
          onClick={() => handleDownload("semester")}
          type="button"
        >
          <Download size={16} />
          <span>학기별 자료</span>
        </button>
      </div>
      <div className="section">
        <div className="subject-enrollment-controls">
          <label>
            <span>학기</span>
            <select
              value={filters.semesterKey}
              onChange={(event) =>
                setFilters((current) => ({
                  ...current,
                  semesterKey: event.target.value as SemesterKey | "all"
                }))
              }
            >
              <option value="all">전체</option>
              {semesterKeys.map((key) => (
                <option key={key} value={key}>
                  {semesterOptionLabel(key)}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>교과군</span>
            <select
              value={filters.subjectGroup}
              onChange={(event) =>
                setFilters((current) => ({
                  ...current,
                  subjectGroup: event.target.value
                }))
              }
            >
              <option value="all">전체</option>
              {subjectGroups.map((subjectGroup) => (
                <option key={subjectGroup} value={subjectGroup}>
                  {subjectGroup}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>과목 검색</span>
            <input
              value={filters.query}
              onChange={(event) =>
                setFilters((current) => ({
                  ...current,
                  query: event.target.value
                }))
              }
            />
          </label>
          <label>
            <span>최소 인원</span>
            <input
              inputMode="numeric"
              min="0"
              type="number"
              value={filters.minStudentCount}
              onChange={(event) =>
                setFilters((current) => ({
                  ...current,
                  minStudentCount: event.target.value
                }))
              }
            />
          </label>
          <label>
            <span>최대 인원</span>
            <input
              inputMode="numeric"
              min="0"
              type="number"
              value={filters.maxStudentCount}
              onChange={(event) =>
                setFilters((current) => ({
                  ...current,
                  maxStudentCount: event.target.value
                }))
              }
            />
          </label>
          <label>
            <span>정렬</span>
            <select
              value={sort.key}
              onChange={(event) =>
                setSort((current) => ({
                  ...current,
                  key: event.target.value as SubjectEnrollmentSort["key"]
                }))
              }
            >
              <option value="semester">학기</option>
              <option value="subjectGroup">교과군</option>
              <option value="studentCount">인원수</option>
              <option value="subjectName">과목명</option>
            </select>
          </label>
          <label>
            <span>방향</span>
            <select
              value={sort.direction}
              onChange={(event) =>
                setSort((current) => ({
                  ...current,
                  direction: event.target.value as SubjectEnrollmentSort["direction"]
                }))
              }
            >
              <option value="asc">오름차순</option>
              <option value="desc">내림차순</option>
            </select>
          </label>
          <button
            className="button button--secondary"
            disabled={!hasActiveFilters && sort.key === defaultSort.key && sort.direction === defaultSort.direction}
            onClick={() => {
              setFilters(defaultFilters);
              setSort(defaultSort);
              setSelectedSummaryId(undefined);
            }}
            type="button"
          >
            <RotateCcw size={16} />
            <span>초기화</span>
          </button>
        </div>
        {summaries.length === 0 ? (
          <div className="empty-panel">
            <p>수강신청 결과를 업로드하면 과목별 수강생 집계가 표시됩니다.</p>
          </div>
        ) : visibleSummaries.length === 0 ? (
          <div className="empty-panel">
            <p>조건에 맞는 과목이 없습니다.</p>
          </div>
        ) : (
          <div className="preview-table-wrap subject-enrollment-table-wrap">
            <table className="placeholder-table subject-enrollment-table">
              <thead>
                <tr>
                  <th>학기</th>
                  <th>교과군</th>
                  <th>과목명</th>
                  <th>선택구분</th>
                  <th>과목구분</th>
                  <th>학점</th>
                  <th>신청 학생 수</th>
                  <th>참조</th>
                </tr>
              </thead>
              <tbody>
                {visibleSummaries.map((summary) => (
                  <tr
                    className={
                      summary.id === selectedSummary?.id ? "is-selected" : undefined
                    }
                    key={summary.id}
                  >
                    <td>{semesterLabel(summary.target)}</td>
                    <td>{summary.subjectGroup}</td>
                    <td>
                      <button
                        aria-pressed={summary.id === selectedSummary?.id}
                        className="subject-enrollment-table__subject-button"
                        onClick={() => setSelectedSummaryId(summary.id)}
                        type="button"
                      >
                        {summary.subjectName}
                      </button>
                    </td>
                    <td>{summary.selectionType}</td>
                    <td>{summary.groupType ?? "-"}</td>
                    <td>{summary.credits ?? "-"}</td>
                    <td>
                      <strong>{summary.studentCount.toLocaleString()}명</strong>
                    </td>
                    <td>
                      <StatusBadge tone={metadataTone(summary.metadataSource)}>
                        {metadataLabel(summary.metadataSource)}
                      </StatusBadge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {selectedSummary ? (
        <SubjectEnrollmentStudentDialog
          onClose={() => setSelectedSummaryId(undefined)}
          onDownload={() => handleDownloadSelectedStudents(selectedSummary)}
          summary={selectedSummary}
        />
      ) : null}
    </section>
  );
}

function SubjectEnrollmentStudentDialog({
  onClose,
  onDownload,
  summary
}: {
  onClose: () => void;
  onDownload: () => void;
  summary: SubjectEnrollmentSummary;
}) {
  return (
    <div className="subject-enrollment-modal" role="presentation">
      <div
        aria-labelledby="subject-enrollment-student-dialog-title"
        aria-modal="true"
        className="subject-enrollment-dialog"
        role="dialog"
      >
        <div className="subject-enrollment-dialog__header">
          <div>
            <h2 id="subject-enrollment-student-dialog-title">
              {semesterLabel(summary.target)} · {summary.subjectName}
            </h2>
            <p>
              {summary.subjectGroup} · {summary.selectionType} ·{" "}
              {summary.studentCount.toLocaleString()}명
            </p>
          </div>
          <IconButton icon={<X size={16} />} label="닫기" onClick={onClose} />
        </div>
        <div className="subject-enrollment-dialog__actions">
          <Button
            icon={<Download size={16} />}
            onClick={onDownload}
            variant="secondary"
          >
            학생 명렬 다운로드
          </Button>
        </div>
        <div className="subject-enrollment-dialog__table-wrap">
          <table className="placeholder-table subject-enrollment-student-table">
            <thead>
              <tr>
                <th>번호</th>
                <th>학번</th>
                <th>이름</th>
              </tr>
            </thead>
            <tbody>
              {summary.students.map((student, index) => (
                <tr key={`${student.studentNo}-${student.studentName}-${index}`}>
                  <td>{index + 1}</td>
                  <td>{student.studentNo || "-"}</td>
                  <td>{student.studentName || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
