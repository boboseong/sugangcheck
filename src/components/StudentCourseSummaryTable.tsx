import { useMemo, useState } from "react";
import { buildStudentCourseSummaries } from "../state/courseSelectionRawStore";
import type { StudentCourseSummary } from "../state/courseSelectionRawStore";
import type { ParsedCourseSelectionRow } from "../types/courseSelection";
import { semesterKeys } from "../types/semester";
import { parseSemesterKey, semesterLabel } from "../utils/semester";

type StudentCourseSummaryTableProps = {
  rows: readonly ParsedCourseSelectionRow[];
};

type StudentCourseSummarySort = "attention" | "studentNo" | "total";

const semesterColumns = semesterKeys.map((key) => {
  const semester = parseSemesterKey(key);

  return {
    key,
    label: semester ? semesterLabel(semester) : key
  };
});

function totalSubjectCount(summary: StudentCourseSummary): number {
  return semesterKeys.reduce(
    (total, key) => total + (summary.semesterCounts[key] ?? 0),
    0
  );
}

function buildSemesterModeCounts(summaries: readonly StudentCourseSummary[]) {
  const modes = new Map<string, Set<number>>();

  for (const key of semesterKeys) {
    const frequencies = new Map<number, number>();

    for (const summary of summaries) {
      const count = summary.semesterCounts[key] ?? 0;

      frequencies.set(count, (frequencies.get(count) ?? 0) + 1);
    }

    const maxFrequency = Math.max(...frequencies.values());
    const modeCounts = [...frequencies.entries()]
      .filter(([, frequency]) => frequency === maxFrequency)
      .map(([count]) => count);

    modes.set(key, new Set(modeCounts));
  }

  return modes;
}

function hasAttentionCount(
  summary: StudentCourseSummary,
  semesterModeCounts: ReadonlyMap<string, ReadonlySet<number>>
) {
  return semesterKeys.some((key) => {
    const modeCounts = semesterModeCounts.get(key);

    return modeCounts ? !modeCounts.has(summary.semesterCounts[key] ?? 0) : false;
  });
}

function compareByStudentNo(left: StudentCourseSummary, right: StudentCourseSummary) {
  return (
    left.studentNo.localeCompare(right.studentNo, "ko", { numeric: true }) ||
    left.studentName.localeCompare(right.studentName, "ko")
  );
}

export function StudentCourseSummaryTable({
  rows
}: StudentCourseSummaryTableProps) {
  const summaries = useMemo(() => buildStudentCourseSummaries(rows), [rows]);
  const [sort, setSort] = useState<StudentCourseSummarySort>("attention");
  const semesterModeCounts = useMemo(
    () => buildSemesterModeCounts(summaries),
    [summaries]
  );
  const visibleSummaries = useMemo(
    () =>
      [...summaries].sort((left, right) => {
        if (sort === "attention") {
          const leftHasAttention = hasAttentionCount(left, semesterModeCounts);
          const rightHasAttention = hasAttentionCount(right, semesterModeCounts);

          if (leftHasAttention !== rightHasAttention) {
            return leftHasAttention ? -1 : 1;
          }

          return compareByStudentNo(left, right);
        }

        if (sort === "total") {
          return (
            totalSubjectCount(right) -
              totalSubjectCount(left) ||
            compareByStudentNo(left, right)
          );
        }

        return compareByStudentNo(left, right);
      }),
    [semesterModeCounts, sort, summaries]
  );

  if (summaries.length === 0) {
    return (
      <div className="empty-panel">
        <p>학기별 이수 과목 수가 여기에 표시됩니다.</p>
      </div>
    );
  }

  return (
    <div className="preview-table-wrap">
      <div className="table-toolbar">
        <label>
          <span>정렬</span>
          <select
            onChange={(event) =>
              setSort(event.target.value as StudentCourseSummarySort)
            }
            value={sort}
          >
            <option value="attention">유의 학생 순</option>
            <option value="studentNo">학번순</option>
            <option value="total">합계순</option>
          </select>
        </label>
      </div>
      <table className="placeholder-table">
        <thead>
          <tr>
            <th>학번</th>
            <th>이름</th>
            {semesterColumns.map((column) => (
              <th key={column.key}>{column.label}</th>
            ))}
            <th>합계</th>
          </tr>
        </thead>
        <tbody>
          {visibleSummaries.map((summary) => {
            const hasAttention = hasAttentionCount(summary, semesterModeCounts);

            return (
              <tr
                className={hasAttention ? "is-attention" : undefined}
                key={summary.studentId}
              >
                <td>{summary.studentNo}</td>
                <td>{summary.studentName}</td>
                {semesterColumns.map((column) => (
                  <td key={column.key}>{summary.semesterCounts[column.key] ?? 0}</td>
                ))}
                <td>{totalSubjectCount(summary)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
