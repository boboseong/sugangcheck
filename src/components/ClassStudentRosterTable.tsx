import { useMemo, type CSSProperties } from "react";
import type { StudentSemesterPresence } from "../types/student";

type ClassStudentRosterTableProps = {
  rows: readonly StudentSemesterPresence[];
};

type ParsedStudentNumber = {
  classNo: number;
  number: number;
};

type RosterStudent = {
  name: string;
  studentNo: string;
};

export type ClassStudentRosterRow = {
  number: number;
  studentsByClassNo: Record<number, string[]>;
};

export type ClassStudentRoster = {
  classNumbers: number[];
  rows: ClassStudentRosterRow[];
};

type RosterTableStyle = CSSProperties & {
  "--class-student-roster-class-count": number;
};

export function parseStudentNumberForRoster(
  studentNo: string | undefined
): ParsedStudentNumber | undefined {
  const normalizedStudentNo = studentNo?.trim();

  if (!normalizedStudentNo || !/^\d{4,5}$/.test(normalizedStudentNo)) {
    return undefined;
  }

  const classPart =
    normalizedStudentNo.length === 5
      ? normalizedStudentNo.slice(1, 3)
      : normalizedStudentNo.slice(1, 2);
  const numberPart = normalizedStudentNo.slice(-2);
  const classNo = Number.parseInt(classPart, 10);
  const number = Number.parseInt(numberPart, 10);

  if (classNo <= 0 || number <= 0) {
    return undefined;
  }

  return { classNo, number };
}

export function buildClassStudentRoster(
  rows: readonly StudentSemesterPresence[]
): ClassStudentRoster {
  const classNumbers = new Set<number>();
  const studentNumbers = new Set<number>();
  const cells = new Map<number, Map<number, RosterStudent[]>>();

  for (const row of rows) {
    const parsed = parseStudentNumberForRoster(row.studentNo);

    if (!parsed) {
      continue;
    }

    const classCells = cells.get(parsed.number) ?? new Map<number, RosterStudent[]>();
    const students = classCells.get(parsed.classNo) ?? [];

    students.push({
      name: row.name?.trim() || row.studentNo?.trim() || row.studentId,
      studentNo: row.studentNo ?? ""
    });
    classCells.set(parsed.classNo, students);
    cells.set(parsed.number, classCells);
    classNumbers.add(parsed.classNo);
    studentNumbers.add(parsed.number);
  }

  const maxClassNo = Math.max(0, ...classNumbers);
  const maxStudentNumber = Math.max(0, ...studentNumbers);
  const sortedClassNumbers = Array.from(
    { length: maxClassNo },
    (_, index) => index + 1
  );
  const sortedStudentNumbers = Array.from(
    { length: maxStudentNumber },
    (_, index) => index + 1
  );

  return {
    classNumbers: sortedClassNumbers,
    rows: sortedStudentNumbers.map((number) => ({
      number,
      studentsByClassNo: Object.fromEntries(
        sortedClassNumbers.map((classNo) => [
          classNo,
          (cells.get(number)?.get(classNo) ?? [])
            .sort(
              (left, right) =>
                left.studentNo.localeCompare(right.studentNo, "ko", {
                  numeric: true
                }) || left.name.localeCompare(right.name, "ko")
            )
            .map((student) => student.name)
        ])
      )
    }))
  };
}

export function ClassStudentRosterTable({ rows }: ClassStudentRosterTableProps) {
  const roster = useMemo(() => buildClassStudentRoster(rows), [rows]);

  if (rows.length === 0) {
    return (
      <div className="empty-panel">
        <p>수강신청 결과를 업로드하면 반별 학생 명렬이 표시됩니다.</p>
      </div>
    );
  }

  if (roster.rows.length === 0) {
    return (
      <div className="empty-panel">
        <p>학번에서 반을 분류할 수 있는 학생이 없습니다.</p>
      </div>
    );
  }

  const tableStyle: RosterTableStyle = {
    "--class-student-roster-class-count": roster.classNumbers.length
  };

  return (
    <div className="preview-table-wrap class-student-roster-table-wrap">
      <table
        aria-label="반별 학생 명렬"
        className="placeholder-table class-student-roster-table"
        style={tableStyle}
      >
        <thead>
          <tr>
            <th>번호</th>
            {roster.classNumbers.map((classNo) => (
              <th key={classNo}>{classNo}반</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {roster.rows.map((row) => (
            <tr key={row.number}>
              <td>{row.number}</td>
              {roster.classNumbers.map((classNo) => (
                <td key={classNo}>
                  {(row.studentsByClassNo[classNo] ?? []).join(", ")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
