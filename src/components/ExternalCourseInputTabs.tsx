import { Check, Plus, Trash2, Users, X } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import {
  groupTypes,
  selectionTypes,
  subjectGroups
} from "../data/subjectMaster";
import {
  createExternalCourseInput,
  validateExternalCourseInputDraft,
  type ExternalCourseInputDraft
} from "../state/externalCourseInputStore";
import type { ExternalCourseInput } from "../types/courseSelection";
import { semesterKeys } from "../types/semester";
import type { Semester } from "../types/semester";
import type { Student, StudentSemesterPresence } from "../types/student";
import { parseSemesterKey, semesterLabel } from "../utils/semester";
import {
  createEmptyExternalCourseDraft,
  hasExternalCourseDraftValue
} from "./externalCourseInputDraft";
import { ExternalCourseInputTable } from "./ExternalCourseInputTable";
import { Button } from "./ui/Button";
import { IconButton } from "./ui/IconButton";

type ExternalCourseEntryMode = "single" | "sameSubject" | "manySubjects";

type ExternalCourseInputTabsProps = {
  students: readonly Student[];
  filteredStudents: readonly Student[];
  studentSemesterPresence: readonly StudentSemesterPresence[];
  studentQuery: string;
  selectedStudent?: Student;
  missingSemesters: readonly Semester[];
  inputs: readonly ExternalCourseInput[];
  onAddInput: (input: ExternalCourseInput) => void;
  onAddInputs: (inputs: ExternalCourseInput[]) => void;
  onRemoveInput: (inputId: string) => void;
  onSelectedStudentIdChange: (studentId: string | undefined) => void;
  onStudentQueryChange: (query: string) => void;
};

type CourseDraftFieldsProps = {
  draft: ExternalCourseInputDraft;
  actions?: ReactNode;
  onChange: (patch: Partial<ExternalCourseInputDraft>) => void;
};

type SubjectDraftRow = {
  id: string;
  draft: ExternalCourseInputDraft;
};

type StudentTargetFieldsProps = {
  filteredStudents: readonly Student[];
  missingSemesters: readonly Semester[];
  selectedStudent?: Student;
  studentQuery: string;
  onSelectedStudentIdChange: (studentId: string | undefined) => void;
  onStudentQueryChange: (query: string) => void;
};

const entryModes: Array<{ label: string; value: ExternalCourseEntryMode }> = [
  { label: "직접 입력", value: "single" },
  { label: "같은 과목 여러 학생", value: "sameSubject" },
  { label: "한 학생 여러 과목", value: "manySubjects" }
];

function getPresenceMissingSemesters(
  presence: StudentSemesterPresence | undefined
): Semester[] {
  if (!presence) {
    return [];
  }

  return semesterKeys
    .map((key) => {
      const semester = parseSemesterKey(key);
      return semester && presence.semesters[key] === "absent" ? semester : undefined;
    })
    .filter((semester): semester is Semester => semester !== undefined);
}

function updateTargetFromKey(
  value: string,
  onChange: (patch: Partial<ExternalCourseInputDraft>) => void
) {
  const semester = parseSemesterKey(value);

  if (semester) {
    onChange({ target: semester });
  }
}

function createSubjectDraftRow(
  missingSemesters: readonly Semester[]
): SubjectDraftRow {
  return {
    id: `external-subject-row-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}`,
    draft: createEmptyExternalCourseDraft(missingSemesters)
  };
}

function CourseDraftFields({
  draft,
  actions,
  onChange
}: CourseDraftFieldsProps) {
  return (
    <div className="external-input-form">
      <label>
        <span>학기</span>
        <select
          onChange={(event) => updateTargetFromKey(event.target.value, onChange)}
          value={`${draft.target.grade}-${draft.target.semester}`}
        >
          {semesterKeys.map((key) => {
            const semester = parseSemesterKey(key);
            return (
              <option key={key} value={key}>
                {semester ? semesterLabel(semester) : key}
              </option>
            );
          })}
        </select>
      </label>
      <label>
        <span>과목명</span>
        <input
          onChange={(event) => onChange({ subjectName: event.target.value })}
          value={draft.subjectName}
        />
      </label>
      <label>
        <span>과목구분</span>
        <select
          onChange={(event) => onChange({ groupType: event.target.value })}
          value={draft.groupType}
        >
          <option value="">미입력</option>
          {groupTypes.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </label>
      <label>
        <span>교과군</span>
        <select
          onChange={(event) => onChange({ subjectGroup: event.target.value })}
          value={draft.subjectGroup}
        >
          <option value="">미입력</option>
          {subjectGroups.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </label>
      <label>
        <span>선택구분</span>
        <select
          onChange={(event) => onChange({ selectionType: event.target.value })}
          value={draft.selectionType}
        >
          <option value="">미입력</option>
          {selectionTypes.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </label>
      <label>
        <span>학점</span>
        <input
          min="0"
          onChange={(event) => onChange({ credits: event.target.value })}
          type="number"
          value={draft.credits}
        />
      </label>
      <label>
        <span>출처</span>
        <select
          onChange={(event) =>
            onChange({
              sourceType: event.target
                .value as ExternalCourseInputDraft["sourceType"]
            })
          }
          value={draft.sourceType}
        >
          <option value="transfer">전입</option>
          <option value="externalCourse">외부 이수</option>
        </select>
      </label>
      <label>
        <span>기관명</span>
        <input
          onChange={(event) => onChange({ sourceName: event.target.value })}
          value={draft.sourceName}
        />
      </label>
      <label className="external-input-form__wide">
        <span>메모</span>
        <input
          onChange={(event) => onChange({ memo: event.target.value })}
          value={draft.memo}
        />
      </label>
      {actions ? (
        <div className="external-input-form__actions">{actions}</div>
      ) : null}
    </div>
  );
}

function ErrorList({ errors }: { errors: readonly string[] }) {
  if (errors.length === 0) {
    return null;
  }

  return (
    <div className="form-errors">
      {errors.map((error) => (
        <p key={error}>{error}</p>
      ))}
    </div>
  );
}

function StudentTargetFields({
  filteredStudents,
  missingSemesters,
  selectedStudent,
  studentQuery,
  onSelectedStudentIdChange,
  onStudentQueryChange
}: StudentTargetFieldsProps) {
  const studentOptions =
    selectedStudent &&
    !filteredStudents.some(
      (student) => student.studentId === selectedStudent.studentId
    )
      ? [selectedStudent, ...filteredStudents]
      : filteredStudents;

  return (
    <>
      <label>
        <span>대상 학생 검색</span>
        <input
          onChange={(event) => onStudentQueryChange(event.target.value)}
          placeholder="이름 또는 학번"
          value={studentQuery}
        />
      </label>
      <label>
        <span>대상 학생</span>
        <select
          onChange={(event) =>
            onSelectedStudentIdChange(event.target.value || undefined)
          }
          value={selectedStudent?.studentId ?? ""}
        >
          {studentOptions.length === 0 ? (
            <option value="">학생 없음</option>
          ) : (
            studentOptions.map((student) => (
              <option key={student.studentId} value={student.studentId}>
                {student.name} ({student.studentNo})
              </option>
            ))
          )}
        </select>
      </label>
      <div className="external-student-target-summary">
        <span>누락 학기 후보</span>
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
    </>
  );
}

function StudentTargetPanel(props: StudentTargetFieldsProps) {
  return (
    <div className="external-input-form external-student-target-form">
      <StudentTargetFields {...props} />
    </div>
  );
}

function SameSubjectManyStudentsPanel({
  students,
  studentSemesterPresence,
  onAddInputs
}: Pick<
  ExternalCourseInputTabsProps,
  "students" | "studentSemesterPresence" | "onAddInputs"
>) {
  const [draft, setDraft] = useState<ExternalCourseInputDraft>(
    createEmptyExternalCourseDraft([])
  );
  const [errors, setErrors] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [showMissingOnly, setShowMissingOnly] = useState(false);
  const [selectedStudentIds, setSelectedStudentIds] = useState<Set<string>>(
    () => new Set()
  );
  const presenceByStudentId = useMemo(
    () =>
      new Map(
        studentSemesterPresence.map((presence) => [presence.studentId, presence])
      ),
    [studentSemesterPresence]
  );
  const studentRows = useMemo(
    () =>
      students.map((student) => ({
        student,
        missingSemesters: getPresenceMissingSemesters(
          presenceByStudentId.get(student.studentId)
        )
      })),
    [presenceByStudentId, students]
  );
  const filteredStudentRows = useMemo(() => {
    const normalizedQuery = query.trim();

    return studentRows.filter(({ student, missingSemesters }) => {
      const matchesQuery =
        !normalizedQuery ||
        student.name.includes(normalizedQuery) ||
        student.studentNo.includes(normalizedQuery);
      const matchesMissing = !showMissingOnly || missingSemesters.length > 0;

      return matchesQuery && matchesMissing;
    });
  }, [query, showMissingOnly, studentRows]);
  const selectedStudents = useMemo(
    () => students.filter((student) => selectedStudentIds.has(student.studentId)),
    [selectedStudentIds, students]
  );
  const allVisibleSelected =
    filteredStudentRows.length > 0 &&
    filteredStudentRows.every(({ student }) =>
      selectedStudentIds.has(student.studentId)
    );

  function updateDraft(patch: Partial<ExternalCourseInputDraft>) {
    setDraft((current) => ({ ...current, ...patch }));
  }

  function toggleVisibleStudents() {
    setSelectedStudentIds((current) => {
      const next = new Set(current);

      filteredStudentRows.forEach(({ student }) => {
        if (allVisibleSelected) {
          next.delete(student.studentId);
        } else {
          next.add(student.studentId);
        }
      });

      return next;
    });
  }

  function toggleStudent(studentId: string) {
    setSelectedStudentIds((current) => {
      const next = new Set(current);

      if (next.has(studentId)) {
        next.delete(studentId);
      } else {
        next.add(studentId);
      }

      return next;
    });
  }

  function selectMissingStudents() {
    setSelectedStudentIds((current) => {
      const next = new Set(current);

      studentRows.forEach(({ student, missingSemesters }) => {
        if (missingSemesters.length > 0) {
          next.add(student.studentId);
        }
      });

      return next;
    });
  }

  function clearSelection() {
    setSelectedStudentIds(new Set());
  }

  function handleAddToStudents() {
    const nextErrors = validateExternalCourseInputDraft(draft);

    if (selectedStudents.length === 0) {
      nextErrors.unshift("학생을 선택하세요.");
    }

    if (nextErrors.length > 0) {
      setErrors(nextErrors);
      return;
    }

    onAddInputs(
      selectedStudents.map((student) => createExternalCourseInput(student, draft))
    );
    setDraft(createEmptyExternalCourseDraft([]));
    setSelectedStudentIds(new Set());
    setErrors([]);
  }

  return (
    <div className="external-bulk-layout">
      <CourseDraftFields
        actions={
          <Button icon={<Plus size={16} />} onClick={handleAddToStudents}>
            선택 학생에 일괄 추가
          </Button>
        }
        draft={draft}
        onChange={updateDraft}
      />
      <ErrorList errors={errors} />
      <div className="external-bulk-toolbar">
        <label>
          <span>학생 검색</span>
          <input
            onChange={(event) => setQuery(event.target.value)}
            placeholder="이름 또는 학번"
            value={query}
          />
        </label>
        <label className="external-bulk-check">
          <input
            checked={showMissingOnly}
            onChange={(event) => setShowMissingOnly(event.target.checked)}
            type="checkbox"
          />
          <span>누락 학생만</span>
        </label>
        <p className="external-bulk-meta">
          선택 {selectedStudents.length.toLocaleString()}명
        </p>
        <div className="external-bulk-toolbar__actions">
          <Button
            className="button--compact"
            icon={<Users size={15} />}
            onClick={selectMissingStudents}
            variant="secondary"
          >
            누락 학생 선택
          </Button>
          <Button
            className="button--compact"
            icon={<X size={15} />}
            onClick={clearSelection}
            variant="secondary"
          >
            선택 해제
          </Button>
        </div>
      </div>
      <div className="preview-table-wrap external-bulk-table">
        <table className="placeholder-table">
          <thead>
            <tr>
              <th>
                <input
                  aria-label="보이는 학생 전체 선택"
                  checked={allVisibleSelected}
                  className="external-student-checkbox"
                  onChange={toggleVisibleStudents}
                  type="checkbox"
                />
              </th>
              <th>학번</th>
              <th>이름</th>
              <th>누락 학기</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudentRows.length === 0 ? (
              <tr>
                <td colSpan={4}>대상 학생이 없습니다.</td>
              </tr>
            ) : (
              filteredStudentRows.map(({ student, missingSemesters }) => (
                <tr
                  className={
                    selectedStudentIds.has(student.studentId)
                      ? "is-selected"
                      : undefined
                  }
                  key={student.studentId}
                >
                  <td>
                    <input
                      aria-label={`${student.name} 선택`}
                      checked={selectedStudentIds.has(student.studentId)}
                      className="external-student-checkbox"
                      onChange={() => toggleStudent(student.studentId)}
                      type="checkbox"
                    />
                  </td>
                  <td>{student.studentNo}</td>
                  <td>{student.name}</td>
                  <td>
                    {missingSemesters.length === 0 ? (
                      <span className="muted-text">없음</span>
                    ) : (
                      <div className="semester-chip-row">
                        {missingSemesters.map((semester) => (
                          <span
                            className="semester-chip"
                            key={`${student.studentId}-${semesterLabel(semester)}`}
                          >
                            {semesterLabel(semester)}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ManySubjectsOneStudentPanel({
  filteredStudents,
  selectedStudent,
  missingSemesters,
  studentQuery,
  onAddInputs,
  onSelectedStudentIdChange,
  onStudentQueryChange
}: Pick<
  ExternalCourseInputTabsProps,
  | "filteredStudents"
  | "selectedStudent"
  | "missingSemesters"
  | "studentQuery"
  | "onAddInputs"
  | "onSelectedStudentIdChange"
  | "onStudentQueryChange"
>) {
  const missingSemesterKey = useMemo(
    () =>
      missingSemesters
        .map((semester) => `${semester.grade}-${semester.semester}`)
        .join("|"),
    [missingSemesters]
  );
  const [rows, setRows] = useState<SubjectDraftRow[]>(() => [
    createSubjectDraftRow(missingSemesters)
  ]);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    setRows([createSubjectDraftRow(missingSemesters)]);
    setErrors([]);
  }, [missingSemesterKey, selectedStudent?.studentId]);

  function updateRow(
    rowId: string,
    patch: Partial<ExternalCourseInputDraft>
  ) {
    setRows((current) =>
      current.map((row) =>
        row.id === rowId ? { ...row, draft: { ...row.draft, ...patch } } : row
      )
    );
  }

  function addRow() {
    setRows((current) => [...current, createSubjectDraftRow(missingSemesters)]);
  }

  function removeRow(rowId: string) {
    setRows((current) =>
      current.length === 1 ? current : current.filter((row) => row.id !== rowId)
    );
  }

  function handleAddRows() {
    const nextErrors: string[] = [];

    if (!selectedStudent) {
      nextErrors.push("학생을 먼저 선택하세요.");
    }

    const filledRows = rows
      .map((row, index) => ({ index, row }))
      .filter(({ row }) => hasExternalCourseDraftValue(row.draft));

    if (filledRows.length === 0) {
      nextErrors.push("추가할 과목을 입력하세요.");
    }

    filledRows.forEach(({ index, row }) => {
      validateExternalCourseInputDraft(row.draft).forEach((error) => {
        nextErrors.push(`${index + 1}행: ${error}`);
      });
    });

    if (nextErrors.length > 0 || !selectedStudent) {
      setErrors(nextErrors);
      return;
    }

    onAddInputs(
      filledRows.map(({ row }) =>
        createExternalCourseInput(selectedStudent, row.draft)
      )
    );
    setRows([createSubjectDraftRow(missingSemesters)]);
    setErrors([]);
  }

  return (
    <div className="external-bulk-layout">
      <StudentTargetPanel
        filteredStudents={filteredStudents}
        missingSemesters={missingSemesters}
        onSelectedStudentIdChange={onSelectedStudentIdChange}
        onStudentQueryChange={onStudentQueryChange}
        selectedStudent={selectedStudent}
        studentQuery={studentQuery}
      />
      <div className="external-bulk-actions">
        <p className="external-bulk-meta">
          입력 행 {rows.length.toLocaleString()}개
        </p>
        <Button icon={<Plus size={16} />} onClick={addRow} variant="secondary">
          행 추가
        </Button>
        <Button icon={<Plus size={16} />} onClick={handleAddRows}>
          입력 과목 일괄 추가
        </Button>
      </div>
      <ErrorList errors={errors} />
      <div className="preview-table-wrap external-subject-row-table">
        <table className="placeholder-table">
          <thead>
            <tr>
              <th>학기</th>
              <th>과목명</th>
              <th>과목구분</th>
              <th>교과군</th>
              <th>선택구분</th>
              <th>학점</th>
              <th>출처</th>
              <th>기관명</th>
              <th>메모</th>
              <th>삭제</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>
                  <select
                    onChange={(event) =>
                      updateTargetFromKey(event.target.value, (patch) =>
                        updateRow(row.id, patch)
                      )
                    }
                    value={`${row.draft.target.grade}-${row.draft.target.semester}`}
                  >
                    {semesterKeys.map((key) => {
                      const semester = parseSemesterKey(key);
                      return (
                        <option key={key} value={key}>
                          {semester ? semesterLabel(semester) : key}
                        </option>
                      );
                    })}
                  </select>
                </td>
                <td>
                  <input
                    onChange={(event) =>
                      updateRow(row.id, { subjectName: event.target.value })
                    }
                    value={row.draft.subjectName}
                  />
                </td>
                <td>
                  <select
                    onChange={(event) =>
                      updateRow(row.id, { groupType: event.target.value })
                    }
                    value={row.draft.groupType}
                  >
                    <option value="">미입력</option>
                    {groupTypes.map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <select
                    onChange={(event) =>
                      updateRow(row.id, { subjectGroup: event.target.value })
                    }
                    value={row.draft.subjectGroup}
                  >
                    <option value="">미입력</option>
                    {subjectGroups.map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <select
                    onChange={(event) =>
                      updateRow(row.id, { selectionType: event.target.value })
                    }
                    value={row.draft.selectionType}
                  >
                    <option value="">미입력</option>
                    {selectionTypes.map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <input
                    min="0"
                    onChange={(event) =>
                      updateRow(row.id, { credits: event.target.value })
                    }
                    type="number"
                    value={row.draft.credits}
                  />
                </td>
                <td>
                  <select
                    onChange={(event) =>
                      updateRow(row.id, {
                        sourceType: event.target
                          .value as ExternalCourseInputDraft["sourceType"]
                      })
                    }
                    value={row.draft.sourceType}
                  >
                    <option value="transfer">전입</option>
                    <option value="externalCourse">외부 이수</option>
                  </select>
                </td>
                <td>
                  <input
                    onChange={(event) =>
                      updateRow(row.id, { sourceName: event.target.value })
                    }
                    value={row.draft.sourceName}
                  />
                </td>
                <td>
                  <input
                    onChange={(event) =>
                      updateRow(row.id, { memo: event.target.value })
                    }
                    value={row.draft.memo}
                  />
                </td>
                <td>
                  <IconButton
                    disabled={rows.length === 1}
                    icon={<Trash2 size={16} />}
                    label="과목 행 삭제"
                    onClick={() => removeRow(row.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function ExternalCourseInputTabs({
  students,
  filteredStudents,
  studentSemesterPresence,
  studentQuery,
  selectedStudent,
  missingSemesters,
  inputs,
  onAddInput,
  onAddInputs,
  onRemoveInput,
  onSelectedStudentIdChange,
  onStudentQueryChange
}: ExternalCourseInputTabsProps) {
  const [mode, setMode] = useState<ExternalCourseEntryMode>("single");

  return (
    <div className="external-input-tabs">
      <div className="tool-tab-bar" aria-label="전입 외부 이수 입력 방식">
        {entryModes.map((entryMode) => (
          <button
            className={[
              "tool-tab",
              mode === entryMode.value ? "tool-tab--active" : ""
            ]
              .filter(Boolean)
              .join(" ")}
            key={entryMode.value}
            onClick={() => setMode(entryMode.value)}
            type="button"
          >
            {mode === entryMode.value ? <Check size={15} /> : null}
            <span>{entryMode.label}</span>
          </button>
        ))}
      </div>
      <div className="external-input-tab-panel">
        {mode === "single" ? (
          <ExternalCourseInputTable
            formPrefix={
              <StudentTargetFields
                filteredStudents={filteredStudents}
                missingSemesters={missingSemesters}
                onSelectedStudentIdChange={onSelectedStudentIdChange}
                onStudentQueryChange={onStudentQueryChange}
                selectedStudent={selectedStudent}
                studentQuery={studentQuery}
              />
            }
            inputs={inputs}
            missingSemesters={missingSemesters}
            onAddInput={onAddInput}
            onRemoveInput={onRemoveInput}
            selectedStudent={selectedStudent}
          />
        ) : null}
        {mode === "sameSubject" ? (
          <SameSubjectManyStudentsPanel
            onAddInputs={onAddInputs}
            studentSemesterPresence={studentSemesterPresence}
            students={students}
          />
        ) : null}
        {mode === "manySubjects" ? (
          <ManySubjectsOneStudentPanel
            filteredStudents={filteredStudents}
            missingSemesters={missingSemesters}
            onAddInputs={onAddInputs}
            onSelectedStudentIdChange={onSelectedStudentIdChange}
            onStudentQueryChange={onStudentQueryChange}
            selectedStudent={selectedStudent}
            studentQuery={studentQuery}
          />
        ) : null}
      </div>
    </div>
  );
}
