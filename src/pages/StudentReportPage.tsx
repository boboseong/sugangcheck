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
import type { CourseSelectionRecord } from "../types/courseSelection";
import type { Student } from "../types/student";
import type { ValidationError } from "../types/validation";

const emptyCourseSelectionRecords: readonly CourseSelectionRecord[] = [];
const emptyValidationErrors: readonly ValidationError[] = [];
const allStudentPrintConfirmMessage =
  "오랜 시간이 소요됩니다. 반별 출력을 권장합니다.";

function groupByStudentId<T extends { studentId: string }>(items: readonly T[]): Map<string, T[]> {
  const groupedItems = new Map<string, T[]>();

  for (const item of items) {
    const existingItems = groupedItems.get(item.studentId);

    if (existingItems) {
      existingItems.push(item);
    } else {
      groupedItems.set(item.studentId, [item]);
    }
  }

  return groupedItems;
}

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
  const [allPrintConfirmOpen, setAllPrintConfirmOpen] = useState(false);
  const [selectedPrintClassNo, setSelectedPrintClassNo] = useState("");
  const studentIndexById = useMemo(
    () => new Map(students.map((student, index) => [student.studentId, index])),
    [students]
  );
  const recordsByStudentId = useMemo(
    () => groupByStudentId(courseSelectionRecords),
    [courseSelectionRecords]
  );
  const errorsByStudentId = useMemo(
    () => groupByStudentId(validationErrors),
    [validationErrors]
  );
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

    const selectedStudentIndex = studentIndexById.get(selectedStudent.studentId) ?? -1;

    return (
      errorStudents.find(
        (student) =>
          (studentIndexById.get(student.studentId) ?? -1) > selectedStudentIndex
      ) ?? errorStudents[0]
    );
  }, [errorStudents, selectedStudent, studentIndexById]);
  const reportStudents = useMemo(() => {
    if (!reportStudentIds) {
      return selectedStudent ? [selectedStudent] : [];
    }

    const reportStudentIdSet = new Set(reportStudentIds);

    return students.filter((student) => reportStudentIdSet.has(student.studentId));
  }, [reportStudentIds, selectedStudent, students]);
  const selectedClassStudents = useMemo(
    () => students.filter((student) => student.currentClassNo === selectedPrintClassNo),
    [selectedPrintClassNo, students]
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

    const handleAfterPrint = () => {
      setReportStudentIds(undefined);
    };
    const timeoutId = window.setTimeout(() => {
      printStudentReport();
    }, 0);

    window.addEventListener("afterprint", handleAfterPrint);

    return () => {
      window.clearTimeout(timeoutId);
      window.removeEventListener("afterprint", handleAfterPrint);
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
    setAllPrintConfirmOpen(false);
    setClassPrintOpen(true);
  }

  function printSelectedClass() {
    printStudents(selectedClassStudents);
    setClassPrintOpen(false);
  }

  function printAllStudents() {
    setClassPrintOpen(false);
    setAllPrintConfirmOpen(true);
  }

  function confirmAllStudentPrint() {
    printStudents(students);
    setAllPrintConfirmOpen(false);
  }

  return (
    <section className="page student-report-page">
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
          onClick={printAllStudents}
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
      {allPrintConfirmOpen ? (
        <div
          aria-labelledby="all-print-confirm-title"
          className="all-print-confirm-panel"
          role="dialog"
        >
          <div>
            <h2 id="all-print-confirm-title">전체 학생 출력</h2>
            <p>{allStudentPrintConfirmMessage}</p>
            <strong>{students.length}명</strong>
          </div>
          <div className="all-print-confirm-panel__actions">
            <Button
              disabled={students.length === 0}
              icon={<Printer size={18} />}
              onClick={confirmAllStudentPrint}
            >
              전체 출력
            </Button>
            <Button onClick={() => setAllPrintConfirmOpen(false)} variant="secondary">
              취소
            </Button>
          </div>
        </div>
      ) : null}
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
              errors={errorsByStudentId.get(student.studentId) ?? emptyValidationErrors}
              key={student.studentId}
              records={recordsByStudentId.get(student.studentId) ?? emptyCourseSelectionRecords}
              student={student}
            />
          ))
        )}
      </div>
    </section>
  );
}
