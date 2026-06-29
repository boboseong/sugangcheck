import { useMemo, useState } from "react";
import type { Student } from "../types/student";

type StudentSelectorProps = {
  students: readonly Student[];
  selectedStudentId?: string;
  onSelectStudent: (studentId: string) => void;
};

export function StudentSelector({
  students,
  selectedStudentId,
  onSelectStudent
}: StudentSelectorProps) {
  const [classFilter, setClassFilter] = useState("all");
  const [query, setQuery] = useState("");
  const classOptions = useMemo(
    () => [...new Set(students.map((student) => student.currentClassNo).filter(Boolean))],
    [students]
  );
  const filteredStudents = students.filter((student) => {
    const classMatches =
      classFilter === "all" || student.currentClassNo === classFilter;
    const queryMatches =
      !query.trim() ||
      student.name.includes(query.trim()) ||
      student.studentNo.includes(query.trim());

    return classMatches && queryMatches;
  });

  return (
    <div className="student-selector">
      <label>
        <span>반</span>
        <select onChange={(event) => setClassFilter(event.target.value)} value={classFilter}>
          <option value="all">전체</option>
          {classOptions.map((classNo) => (
            <option key={classNo} value={classNo}>
              {classNo}반
            </option>
          ))}
        </select>
      </label>
      <label>
        <span>검색</span>
        <input
          onChange={(event) => setQuery(event.target.value)}
          placeholder="이름 또는 학번"
          value={query}
        />
      </label>
      <label>
        <span>학생</span>
        <select
          onChange={(event) => onSelectStudent(event.target.value)}
          value={selectedStudentId ?? filteredStudents[0]?.studentId ?? ""}
        >
          {filteredStudents.length === 0 ? (
            <option value="">학생 없음</option>
          ) : (
            filteredStudents.map((student) => (
              <option key={student.studentId} value={student.studentId}>
                {student.name} ({student.studentNo})
              </option>
            ))
          )}
        </select>
      </label>
    </div>
  );
}
