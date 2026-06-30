import { Download, UserRoundPlus } from "lucide-react";
import { useMemo, useState } from "react";
import { ExternalCourseInputTable } from "../components/ExternalCourseInputTable";
import { UploadImportLauncher } from "../components/UploadImportLauncher";
import { Button } from "../components/ui/Button";
import { PageHeader } from "../components/ui/PageHeader";
import { readWorkbookFromFile } from "../parsers/readWorkbook";
import { clearDerivedValidationState } from "../state/projectWorkspace";
import { useExternalCourseInputStore } from "../state/externalCourseInputStore";
import {
  createStudentSemesterPresence,
  useStudentSemesterPresenceStore
} from "../state/studentSemesterPresenceStore";
import { useStudentStore } from "../state/studentStore";
import {
  createExternalCourseTemplateWorkbook,
  createXlsxBlob,
  parseExternalCourseTemplateWorkbook,
  templateFileNames
} from "../templates/xlsxTemplates";
import { semesterKeys } from "../types/semester";
import type { Semester } from "../types/semester";
import type { SemesterPresenceValue, StudentSemesterPresence } from "../types/student";
import { downloadBlob } from "../utils/downloadBlob";
import { parseSemesterKey, semesterLabel } from "../utils/semester";

function isSemester(value: Semester | undefined): value is Semester {
  return value !== undefined;
}

function getSemestersWithPresence(
  presence: StudentSemesterPresence,
  value: SemesterPresenceValue
): Semester[] {
  return semesterKeys
    .map((key) => {
      const semester = parseSemesterKey(key);

      return semester && presence.semesters[key] === value ? semester : undefined;
    })
    .filter(isSemester);
}

export function ExternalCoursesPage() {
  const {
    externalCourseInputs,
    addExternalCourseInput,
    removeExternalCourseInput,
    setExternalCourseInputs
  } = useExternalCourseInputStore();
  const { setStudentSemesterPresence, studentSemesterPresence } =
    useStudentSemesterPresenceStore();
  const { setStudents, students } = useStudentStore();
  const [query, setQuery] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState<string>();
  const studentById = useMemo(
    () => new Map(students.map((student) => [student.studentId, student])),
    [students]
  );
  const studentsWithExternalInputs = useMemo(
    () => new Set(externalCourseInputs.map((input) => input.studentId)),
    [externalCourseInputs]
  );
  const missingStudentCandidates = useMemo(
    () =>
      studentSemesterPresence
        .map((presence) => {
          const student = studentById.get(presence.studentId);
          const missingSemesters = getSemestersWithPresence(presence, "absent");

          return {
            studentId: presence.studentId,
            studentNo: student?.studentNo ?? presence.studentNo,
            name: student?.name ?? presence.name,
            missingSemesters
          };
        })
        .filter(
          (candidate) =>
            candidate.missingSemesters.length > 0 &&
            !studentsWithExternalInputs.has(candidate.studentId)
        ),
    [studentById, studentSemesterPresence, studentsWithExternalInputs]
  );
  const missingStudentIds = useMemo(
    () => new Set(missingStudentCandidates.map((candidate) => candidate.studentId)),
    [missingStudentCandidates]
  );
  const filteredStudents = useMemo(() => {
    const normalizedQuery = query.trim();

    if (!normalizedQuery) {
      return students;
    }

    return students.filter(
      (student) =>
        student.name.includes(normalizedQuery) ||
        student.studentNo.includes(normalizedQuery)
    );
  }, [query, students]);
  const selectedStudent =
    filteredStudents.find((student) => student.studentId === selectedStudentId) ??
    filteredStudents.find((student) => missingStudentIds.has(student.studentId)) ??
    filteredStudents[0];
  const selectedPresence = studentSemesterPresence.find(
    (presence) => presence.studentId === selectedStudent?.studentId
  );
  const missingSemesters = selectedPresence
    ? semesterKeys
        .map((key) => {
          const semester = parseSemesterKey(key);
          return semester && selectedPresence.semesters[key] !== "present"
            ? semester
            : undefined;
        })
        .filter(isSemester)
    : [];
  const selectedInputs = externalCourseInputs.filter(
    (input) => input.studentId === selectedStudent?.studentId
  );

  async function handleDownloadTemplate() {
    await downloadBlob(
      createXlsxBlob(
        createExternalCourseTemplateWorkbook({
          inputs: externalCourseInputs,
          students
        })
      ),
      templateFileNames.externalCourse
    );
  }

  async function handleFilesSelected(files: File[]) {
    const file = files[0];
    if (!file) {
      return;
    }

    const confirmed = window.confirm(
      "전입/외부 이수 직접 입력을 선택한 템플릿 파일 내용으로 교체합니다. 계속할까요?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const workbook = await readWorkbookFromFile(file);
      const result = parseExternalCourseTemplateWorkbook(workbook, students);
      const presenceByStudentId = new Map(
        studentSemesterPresence.map((presence) => [presence.studentId, presence])
      );

      setStudents(result.students);
      setStudentSemesterPresence(
        result.students.map(
          (student) =>
            presenceByStudentId.get(student.studentId) ??
            createStudentSemesterPresence(student)
        )
      );
      setExternalCourseInputs(result.inputs);
      clearDerivedValidationState();
      setSelectedStudentId(result.inputs[0]?.studentId);
      window.alert(
        `전입/외부 이수 ${result.inputs.length.toLocaleString()}건을 가져왔습니다. 새 학생 ${result.createdStudents.length.toLocaleString()}명을 추가했습니다.`
      );
    } catch (error) {
      window.alert(
        error instanceof Error ? error.message : "전입/외부 이수 템플릿을 읽지 못했습니다."
      );
    }
  }

  return (
    <section className="page">
      <PageHeader
        title="전입생 및 외부 이수 입력"
        description="수강신청 파일에 없는 학기나 외부 교육과정 이수 과목을 학생별로 직접 입력합니다."
      />
      <div className="template-action-bar">
        <UploadImportLauncher
          allowMultipleFiles={false}
          fileDescription="템플릿 파일 업로드가 가능합니다."
          onFilesSelected={handleFilesSelected}
          section="externalCourses"
        />
        <Button
          icon={<Download size={16} />}
          onClick={handleDownloadTemplate}
          variant="secondary"
        >
          템플릿 다운로드
        </Button>
      </div>
      <div className="section">
        <h2>누락 학생 후보</h2>
        {missingStudentCandidates.length === 0 ? (
          <div className="empty-panel">
            <p>전입/외부 입력이 필요한 누락 학생이 없습니다.</p>
          </div>
        ) : (
          <div className="preview-table-wrap">
            <table className="placeholder-table">
              <thead>
                <tr>
                  <th>학번</th>
                  <th>이름</th>
                  <th>누락 학기</th>
                  <th>입력</th>
                </tr>
              </thead>
              <tbody>
                {missingStudentCandidates.map((candidate) => (
                  <tr
                    className={
                      candidate.studentId === selectedStudent?.studentId
                        ? "is-selected"
                        : undefined
                    }
                    key={candidate.studentId}
                  >
                    <td>{candidate.studentNo ?? "-"}</td>
                    <td>{candidate.name ?? "-"}</td>
                    <td>
                      <div className="semester-chip-row">
                        {candidate.missingSemesters.map((semester) => (
                          <span
                            className="semester-chip"
                            key={semesterLabel(semester)}
                          >
                            {semesterLabel(semester)}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td>
                      <Button
                        className="button--compact"
                        icon={<UserRoundPlus size={15} />}
                        onClick={() => {
                          setQuery("");
                          setSelectedStudentId(candidate.studentId);
                        }}
                        variant="secondary"
                      >
                        선택
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <div className="section">
        <div className="student-search-panel">
          <label>
            <span>학생 검색</span>
            <input
              onChange={(event) => setQuery(event.target.value)}
              placeholder="이름 또는 학번"
              value={query}
            />
          </label>
          <label>
            <span>학생 선택</span>
            <select
              onChange={(event) => setSelectedStudentId(event.target.value)}
              value={selectedStudent?.studentId ?? ""}
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
      </div>
      <div className="section">
        <h2>누락 학기 후보</h2>
        <div className="semester-chip-row">
          {missingSemesters.length === 0 ? (
            <span className="muted-text">누락 또는 미확인 학기가 없습니다.</span>
          ) : (
            missingSemesters.map((semester) => (
              <span className="semester-chip" key={semesterLabel(semester)}>
                {semesterLabel(semester)}
              </span>
            ))
          )}
        </div>
      </div>
      <div className="section">
        <h2>직접 입력</h2>
        <ExternalCourseInputTable
          inputs={selectedInputs}
          missingSemesters={missingSemesters}
          onAddInput={addExternalCourseInput}
          onRemoveInput={removeExternalCourseInput}
          selectedStudent={selectedStudent}
        />
      </div>
    </section>
  );
}
