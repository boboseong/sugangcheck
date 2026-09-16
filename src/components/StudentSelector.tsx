import { useId, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Student } from "../types/student";
import { IconButton } from "./ui/IconButton";

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
  const studentSelectId = useId();
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
  const effectiveStudentId = filteredStudents.some(
    (student) => student.studentId === selectedStudentId
  )
    ? selectedStudentId
    : filteredStudents[0]?.studentId;
  const currentIndex = filteredStudents.findIndex(
    (student) => student.studentId === effectiveStudentId
  );
  const previousStudent = currentIndex > 0 ? filteredStudents[currentIndex - 1] : undefined;
  const nextStudent =
    currentIndex >= 0 && currentIndex < filteredStudents.length - 1
      ? filteredStudents[currentIndex + 1]
      : undefined;

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
      <div className="student-selector__field">
        <label htmlFor={studentSelectId}>학생</label>
        <div className="student-selector__nav">
          <IconButton
            disabled={!previousStudent}
            icon={<ChevronLeft size={18} />}
            label="이전 학생"
            onClick={() => (previousStudent ? onSelectStudent(previousStudent.studentId) : undefined)}
          />
          <select
            id={studentSelectId}
            onChange={(event) => onSelectStudent(event.target.value)}
            value={effectiveStudentId ?? ""}
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
          <IconButton
            disabled={!nextStudent}
            icon={<ChevronRight size={18} />}
            label="다음 학생"
            onClick={() => (nextStudent ? onSelectStudent(nextStudent.studentId) : undefined)}
          />
        </div>
      </div>
    </div>
  );
}
