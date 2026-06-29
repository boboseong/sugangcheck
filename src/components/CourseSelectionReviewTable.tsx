import { subjectMasterItems } from "../data/subjectMaster";
import type { ParsedCourseSelectionRow } from "../types/courseSelection";
import type { OperatingSubject } from "../types/subject";
import { semesterLabel } from "../utils/semester";
import { StatusBadge } from "./ui/StatusBadge";

type CourseSelectionReviewTableProps = {
  rows: readonly ParsedCourseSelectionRow[];
  operatingSubjects: readonly OperatingSubject[];
  maxRows?: number;
};

function findOperatingSubject(
  row: ParsedCourseSelectionRow,
  operatingSubjects: readonly OperatingSubject[]
): OperatingSubject | undefined {
  return operatingSubjects.find(
    (subject) =>
      subject.target.grade === row.target.grade &&
      subject.target.semester === row.target.semester &&
      subject.normalizedSubjectName === row.normalizedSubjectName
  );
}

function hasSubjectMaster(row: ParsedCourseSelectionRow): boolean {
  return subjectMasterItems.some(
    (item) => item.normalizedSubjectName === row.normalizedSubjectName
  );
}

export function CourseSelectionReviewTable({
  rows,
  operatingSubjects,
  maxRows = 200
}: CourseSelectionReviewTableProps) {
  if (rows.length === 0) {
    return (
      <div className="empty-panel">
        <p>수강신청 결과 파일을 업로드하면 원천 행이 표시됩니다.</p>
      </div>
    );
  }

  const visibleRows = rows.slice(0, maxRows);

  return (
    <div className="preview-table-wrap">
      <div className="preview-table-meta">
        <strong>원천 행 {rows.length.toLocaleString()}개</strong>
        <span>상위 {visibleRows.length.toLocaleString()}개 표시</span>
      </div>
      <table className="placeholder-table">
        <thead>
          <tr>
            <th>학생</th>
            <th>학기</th>
            <th>과목명</th>
            <th>학점</th>
            <th>참조 상태</th>
            <th>원본 위치</th>
          </tr>
        </thead>
        <tbody>
          {visibleRows.map((row) => {
            const operatingSubject = findOperatingSubject(row, operatingSubjects);
            const hasMaster = hasSubjectMaster(row);
            const credits = row.credits ?? operatingSubject?.credits;
            const referenceStatus = operatingSubject
              ? "운영과목"
              : hasMaster
                ? "마스터"
                : "미등록";

            return (
              <tr key={row.id}>
                <td>
                  {row.studentName}
                  <br />
                  <span className="muted-text">{row.studentNo}</span>
                </td>
                <td>{semesterLabel(row.target)}</td>
                <td>{row.subjectName}</td>
                <td>{credits ?? "-"}</td>
                <td>
                  <StatusBadge
                    tone={
                      referenceStatus === "미등록"
                        ? "error"
                        : credits === undefined
                          ? "warning"
                          : "ready"
                    }
                  >
                    {credits === undefined ? "학점 확인" : referenceStatus}
                  </StatusBadge>
                </td>
                <td>{row.sourceLocation?.cellAddress ?? "-"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
