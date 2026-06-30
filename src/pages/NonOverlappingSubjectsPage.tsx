import { Download, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";
import {
  buildNonOverlappingSubjectCombinations,
  filterNonOverlappingSubjectCombinations,
  nonOverlappingSubjectCounts,
  type NonOverlappingSubjectCombination,
  type NonOverlappingSubjectCount
} from "../analytics/nonOverlappingSubjects";
import { PageHeader } from "../components/ui/PageHeader";
import {
  exportNonOverlappingSubjectsXlsx,
  nonOverlappingSubjectsFileName
} from "../export/exportNonOverlappingSubjectsXlsx";
import { useCourseSelectionRawStore } from "../state/courseSelectionRawStore";
import { useOperatingSubjectStore } from "../state/operatingSubjectStore";
import type { ParsedCourseSelectionRow } from "../types/courseSelection";
import { semesterKeys, type SemesterKey } from "../types/semester";
import { downloadBlob } from "../utils/downloadBlob";
import { parseSemesterKey, semesterLabel } from "../utils/semester";

type PageFilters = {
  semesterKey: SemesterKey | "all";
  subjectCount: NonOverlappingSubjectCount | "all";
  query: string;
};

const defaultFilters: PageFilters = {
  semesterKey: "all",
  subjectCount: "all",
  query: ""
};

function uniqueStudentCount(
  rows: readonly ParsedCourseSelectionRow[]
): number {
  return new Set(
    rows.map((row) => row.studentId || `${row.studentNo}|${row.studentName}`)
  ).size;
}

function semesterOptionLabel(key: SemesterKey): string {
  const semester = parseSemesterKey(key);

  return semester ? semesterLabel(semester) : key;
}

function subjectCountFilterValue(value: string): NonOverlappingSubjectCount | "all" {
  if (value === "2" || value === "3" || value === "4") {
    return Number(value) as NonOverlappingSubjectCount;
  }

  return "all";
}

function subjectListLabel(combination: NonOverlappingSubjectCombination): string {
  return combination.subjectNames.join(" · ");
}

function subjectCountLabel(combination: NonOverlappingSubjectCombination): string {
  return combination.subjects
    .map((subject) => `${subject.subjectName} ${subject.studentCount.toLocaleString()}명`)
    .join(" · ");
}

export function NonOverlappingSubjectsPage() {
  const { courseSelectionRows } = useCourseSelectionRawStore();
  const { operatingSubjects } = useOperatingSubjectStore();
  const [filters, setFilters] = useState<PageFilters>(defaultFilters);
  const combinations = useMemo(
    () =>
      buildNonOverlappingSubjectCombinations(
        courseSelectionRows,
        operatingSubjects
      ),
    [courseSelectionRows, operatingSubjects]
  );
  const visibleCombinations = useMemo(
    () => filterNonOverlappingSubjectCombinations(combinations, filters),
    [combinations, filters]
  );
  const hasActiveFilters =
    filters.semesterKey !== defaultFilters.semesterKey ||
    filters.subjectCount !== defaultFilters.subjectCount ||
    filters.query !== defaultFilters.query;

  async function handleDownload() {
    await downloadBlob(
      exportNonOverlappingSubjectsXlsx(visibleCombinations),
      nonOverlappingSubjectsFileName
    );
  }

  return (
    <section className="page">
      <PageHeader
        title="미중복 선택 과목"
        description="동시에 선택한 학생이 하나도 없는 과목들의 명렬입니다."
      />
      <div className="prep-status-row">
        <span className="status-badge status-badge--empty">
          신청 학생 {uniqueStudentCount(courseSelectionRows).toLocaleString()}명
        </span>
        <span className="status-badge status-badge--empty">
          조합 {combinations.length.toLocaleString()}개
        </span>
        <span className="status-badge status-badge--empty">
          표시 {visibleCombinations.length.toLocaleString()}개
        </span>
        <button
          className="button button--secondary button--compact"
          disabled={visibleCombinations.length === 0}
          onClick={handleDownload}
          type="button"
        >
          <Download size={16} />
          <span>엑셀 저장</span>
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
            <span>과목 수</span>
            <select
              value={filters.subjectCount}
              onChange={(event) =>
                setFilters((current) => ({
                  ...current,
                  subjectCount: subjectCountFilterValue(event.target.value)
                }))
              }
            >
              <option value="all">전체</option>
              {nonOverlappingSubjectCounts.map((count) => (
                <option key={count} value={count}>
                  {count}개
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
          <button
            className="button button--secondary"
            disabled={!hasActiveFilters}
            onClick={() => setFilters(defaultFilters)}
            type="button"
          >
            <RotateCcw size={16} />
            <span>초기화</span>
          </button>
        </div>
        {courseSelectionRows.length === 0 ? (
          <div className="empty-panel">
            <p>수강신청 결과를 업로드하면 미중복 선택 과목 조합이 표시됩니다.</p>
          </div>
        ) : combinations.length === 0 ? (
          <div className="empty-panel">
            <p>선택 학생이 서로 겹치지 않는 2~4개 과목 조합이 없습니다.</p>
          </div>
        ) : visibleCombinations.length === 0 ? (
          <div className="empty-panel">
            <p>조건에 맞는 미중복 선택 과목 조합이 없습니다.</p>
          </div>
        ) : (
          <div className="preview-table-wrap non-overlapping-subject-table-wrap">
            <table className="placeholder-table non-overlapping-subject-table">
              <thead>
                <tr>
                  <th>학기</th>
                  <th>과목 수</th>
                  <th>과목명렬</th>
                  <th>교과군</th>
                  <th>과목별 신청 학생 수</th>
                  <th>총 신청 학생 수</th>
                </tr>
              </thead>
              <tbody>
                {visibleCombinations.map((combination) => (
                  <tr key={combination.id}>
                    <td>{semesterLabel(combination.target)}</td>
                    <td>{combination.subjectCount}개</td>
                    <td>
                      <div className="non-overlapping-subject-list">
                        {combination.subjects.map((subject) => (
                          <span
                            className="non-overlapping-subject-chip"
                            key={subject.id}
                          >
                            {subject.subjectName}
                          </span>
                        ))}
                      </div>
                      <span className="visually-hidden">
                        {subjectListLabel(combination)}
                      </span>
                    </td>
                    <td>{combination.subjectGroups.join(", ")}</td>
                    <td>{subjectCountLabel(combination)}</td>
                    <td>
                      <strong>
                        {combination.totalStudentCount.toLocaleString()}명
                      </strong>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
