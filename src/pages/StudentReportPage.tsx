import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, ArrowRight, Printer, School, Users } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { StudentSelector } from "../components/StudentSelector";
import { Button } from "../components/ui/Button";
import { PageHeader } from "../components/ui/PageHeader";
import { useCourseSelectionRecordBuild } from "../hooks/useCourseSelectionRecordBuild";
import { StudentCourseReport } from "../reports/StudentCourseReport";
import { printStudentReport } from "../reports/printStudentReport";
import { useStudentStore } from "../state/studentStore";
import { useValidationResultStore } from "../state/validationResultStore";
import type { Student } from "../types/student";

export function StudentReportPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { records: courseSelectionRecords } = useCourseSelectionRecordBuild();
  const { students } = useStudentStore();
  const { validationErrors } = useValidationResultStore();
  const studentIdFromUrl = searchParams.get("studentId") ?? undefined;
  const [selectedStudentId, setSelectedStudentId] = useState<string | undefined>(
    studentIdFromUrl
  );
  const [reportStudentIds, setReportStudentIds] = useState<string[] | undefined>();
  const [printRequestCount, setPrintRequestCount] = useState(0);
  const [classPrintOpen, setClassPrintOpen] = useState(false);
  const [selectedPrintClassNo, setSelectedPrintClassNo] = useState("");
  const selectedStudent =
    students.find((student) => student.studentId === selectedStudentId) ?? students[0];
  const classOptions = useMemo(
    () =>
      [...new Set(students.map((student) => student.currentClassNo).filter(Boolean))]
        .map(String)
        .sort((left, right) => left.localeCompare(right, "ko", { numeric: true })),
    [students]
  );
  const errorStudentIds = useMemo(
    () => new Set(validationErrors.map((error) => error.studentId)),
    [validationErrors]
  );
  const errorStudents = useMemo(
    () => students.filter((student) => errorStudentIds.has(student.studentId)),
    [errorStudentIds, students]
  );
  const nextErrorStudent = useMemo(() => {
    if (errorStudents.length === 0) {
      return undefined;
    }

    if (!selectedStudent) {
      return errorStudents[0];
    }

    const selectedStudentIndex = students.findIndex(
      (student) => student.studentId === selectedStudent.studentId
    );

    return (
      errorStudents.find(
        (student) =>
          students.findIndex((candidate) => candidate.studentId === student.studentId) >
          selectedStudentIndex
      ) ?? errorStudents[0]
    );
  }, [errorStudents, selectedStudent, students]);
  const reportStudents = reportStudentIds
    ? students.filter((student) => reportStudentIds.includes(student.studentId))
    : selectedStudent
      ? [selectedStudent]
      : [];
  const selectedClassStudents = students.filter(
    (student) => student.currentClassNo === selectedPrintClassNo
  );

  useEffect(() => {
    setSelectedStudentId(studentIdFromUrl);
  }, [studentIdFromUrl]);

  useEffect(() => {
    if (!selectedPrintClassNo && classOptions[0]) {
      setSelectedPrintClassNo(classOptions[0]);
    }
  }, [classOptions, selectedPrintClassNo]);

  useEffect(() => {
    if (printRequestCount === 0) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      printStudentReport();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [printRequestCount]);

  function handleSelectStudent(studentId: string) {
    setSelectedStudentId(studentId);
    setSearchParams(studentId ? { studentId } : {});
    setReportStudentIds(undefined);
  }

  function printStudents(targetStudents: readonly Student[]) {
    if (targetStudents.length === 0) {
      return;
    }

    setReportStudentIds(targetStudents.map((student) => student.studentId));
    setPrintRequestCount((count) => count + 1);
  }

  function selectNextErrorStudent() {
    if (!nextErrorStudent) {
      return;
    }

    handleSelectStudent(nextErrorStudent.studentId);
  }

  function openClassPrintPanel() {
    setSelectedPrintClassNo(
      selectedStudent?.currentClassNo && classOptions.includes(selectedStudent.currentClassNo)
        ? selectedStudent.currentClassNo
        : classOptions[0] ?? ""
    );
    setClassPrintOpen(true);
  }

  function printSelectedClass() {
    printStudents(selectedClassStudents);
    setClassPrintOpen(false);
  }

  return (
    <section className="page">
      <PageHeader
        title="학생별 확인서"
        description="학생 1명의 6개 학기 수강 계획, 교과군별 학점 요약, 오류 내용을 확인서 형태로 확인합니다."
      />
      <div className="section">
        <StudentSelector
          onSelectStudent={handleSelectStudent}
          selectedStudentId={selectedStudent?.studentId}
          students={students}
        />
      </div>
      <div className="report-actions">
        <Button
          className="report-actions__next-error"
          disabled={!nextErrorStudent}
          icon={<ArrowRight size={18} />}
          onClick={selectNextErrorStudent}
          variant="secondary"
        >
          다음 오류 학생
        </Button>
        <Button
          disabled={!selectedStudent}
          icon={<Printer size={18} />}
          onClick={() => (selectedStudent ? printStudents([selectedStudent]) : undefined)}
        >
          선택 학생 출력
        </Button>
        <Button
          disabled={students.length === 0}
          icon={<Users size={18} />}
          onClick={() => printStudents(students)}
          variant="secondary"
        >
          전체 학생 출력
        </Button>
        <Button
          disabled={classOptions.length === 0}
          icon={<School size={18} />}
          onClick={openClassPrintPanel}
          variant="secondary"
        >
          반별 학생 출력
        </Button>
        <Button
          disabled={errorStudents.length === 0}
          icon={<AlertTriangle size={18} />}
          onClick={() => printStudents(errorStudents)}
          variant="secondary"
        >
          오류 학생 출력
        </Button>
      </div>
      {classPrintOpen ? (
        <div className="class-print-panel">
          <label>
            <span>출력할 반</span>
            <select
              aria-label="출력할 반"
              onChange={(event) => setSelectedPrintClassNo(event.target.value)}
              value={selectedPrintClassNo}
            >
              {classOptions.map((classNo) => (
                <option key={classNo} value={classNo}>
                  {classNo}반
                </option>
              ))}
            </select>
          </label>
          <strong>{selectedClassStudents.length}명</strong>
          <div className="class-print-panel__actions">
            <Button
              disabled={selectedClassStudents.length === 0}
              icon={<Printer size={18} />}
              onClick={printSelectedClass}
            >
              출력
            </Button>
            <Button onClick={() => setClassPrintOpen(false)} variant="secondary">
              취소
            </Button>
          </div>
        </div>
      ) : null}
      <div className="section student-report-stack">
        {reportStudents.length === 0 ? (
          <StudentCourseReport errors={validationErrors} records={courseSelectionRecords} />
        ) : (
          reportStudents.map((student) => (
            <StudentCourseReport
              errors={validationErrors}
              key={student.studentId}
              records={courseSelectionRecords}
              student={student}
            />
          ))
        )}
      </div>
    </section>
  );
}
