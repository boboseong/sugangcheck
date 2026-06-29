import { useMemo, useState } from "react";
import type { SemesterPresenceValue, StudentSemesterPresence } from "../types/student";
import { semesterKeys } from "../types/semester";
import { parseSemesterKey, semesterLabel } from "../utils/semester";
import { StatusBadge, type StatusTone } from "./ui/StatusBadge";

type PresenceFilter = "all" | "absent" | "unknown";

type StudentPresenceTableProps = {
  rows: readonly StudentSemesterPresence[];
};

const presenceLabels: Record<SemesterPresenceValue, string> = {
  unknown: "미확인",
  present: "있음",
  absent: "없음"
};

const presenceTones: Record<SemesterPresenceValue, StatusTone> = {
  unknown: "warning",
  present: "ready",
  absent: "empty"
};

function hasPresenceValue(
  row: StudentSemesterPresence,
  value: SemesterPresenceValue
): boolean {
  return Object.values(row.semesters).includes(value);
}

export function StudentPresenceTable({ rows }: StudentPresenceTableProps) {
  const [filter, setFilter] = useState<PresenceFilter>("absent");
  const filteredRows = useMemo(() => {
    if (filter === "all") {
      return rows;
    }

    return rows.filter((row) => hasPresenceValue(row, filter));
  }, [filter, rows]);

  if (rows.length === 0) {
    return (
      <div className="empty-panel">
        <p>수강신청 결과를 업로드하면 학생별 학기 존재 여부가 표시됩니다.</p>
      </div>
    );
  }

  return (
    <div className="preview-table-wrap">
      <div className="table-toolbar">
        <label>
          <span>필터</span>
          <select
            onChange={(event) => setFilter(event.target.value as PresenceFilter)}
            value={filter}
          >
            <option value="all">전체</option>
            <option value="absent">누락 학생</option>
            <option value="unknown">미업로드 학기 있음</option>
          </select>
        </label>
      </div>
      <table className="placeholder-table">
        <thead>
          <tr>
            <th>학번</th>
            <th>이름</th>
            {semesterKeys.map((key) => {
              const semester = parseSemesterKey(key);

              return <th key={key}>{semester ? semesterLabel(semester) : key}</th>;
            })}
          </tr>
        </thead>
        <tbody>
          {filteredRows.map((row) => (
            <tr key={row.studentId}>
              <td>{row.studentNo ?? "-"}</td>
              <td>{row.name ?? "-"}</td>
              {semesterKeys.map((key) => {
                const value = row.semesters[key];

                return (
                  <td key={key}>
                    <StatusBadge tone={presenceTones[value]}>
                      {presenceLabels[value]}
                    </StatusBadge>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
