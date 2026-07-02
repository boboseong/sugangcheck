import { Check, ChevronDown, ChevronRight, Plus, Users, X } from "lucide-react";
import type { KeyboardEvent, ReactNode } from "react";
import { useEffect, useId, useMemo, useState } from "react";
import {
  groupTypes,
  selectionTypes,
  subjectGroups,
  subjectMasterItems
} from "../data/subjectMaster";
import { normalizeSubjectName } from "../normalizers/normalizeSubjectName";
import {
  createExternalCourseInput,
  validateExternalCourseInputDraft,
  type ExternalCourseInputDraft
} from "../state/externalCourseInputStore";
import type { ExternalCourseInput } from "../types/courseSelection";
import { semesterKeys } from "../types/semester";
import type { Semester } from "../types/semester";
import type { Student, StudentSemesterPresence } from "../types/student";
import type { SubjectMasterItem } from "../types/subject";
import { parseSemesterKey, semesterLabel } from "../utils/semester";
import {
  createEmptyExternalCourseDraft,
  hasExternalCourseDraftValue
} from "./externalCourseInputDraft";
import { Button } from "./ui/Button";
import { IconButton } from "./ui/IconButton";

type ExternalCourseEntryMode = "manySubjects" | "sameSubject";

type ExternalCourseInputTabsProps = {
  students: readonly Student[];
  filteredStudents: readonly Student[];
  studentSemesterPresence: readonly StudentSemesterPresence[];
  studentQuery: string;
  selectedStudent?: Student;
  missingSemesters: readonly Semester[];
  onAddInputs: (inputs: ExternalCourseInput[]) => void;
  onSelectedStudentIdChange: (studentId: string | undefined) => void;
  onStudentQueryChange: (query: string) => void;
};

type CourseDraftFieldsProps = {
  draft: ExternalCourseInputDraft;
  actions?: ReactNode;
  onChange: (patch: Partial<ExternalCourseInputDraft>) => void;
  onSubmit?: () => void;
};

type SubjectMasterAutocompleteProps = {
  hideLabel?: boolean;
  label: string;
  onChange: (value: string) => void;
  onEnter?: () => void;
  onSelect: (item: SubjectMasterItem) => void;
  value: string;
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
  { label: "기본", value: "manySubjects" },
  { label: "같은 과목 여러 학생", value: "sameSubject" }
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

function subjectMasterMetadata(item: SubjectMasterItem) {
  return [item.groupType, item.subjectGroup, item.selectionType]
    .filter(Boolean)
    .join(" · ");
}

function subjectMasterPatch(
  item: SubjectMasterItem
): Partial<ExternalCourseInputDraft> {
  return {
    subjectName: item.subjectName,
    groupType: item.groupType ?? "",
    subjectGroup: item.subjectGroup,
    selectionType: item.selectionType
  };
}

function subjectMasterMatchesQuery(item: SubjectMasterItem, query: string) {
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return false;
  }

  const loweredQuery = trimmedQuery.toLocaleLowerCase();
  const normalizedQuery = normalizeSubjectName(trimmedQuery);

  return (
    item.subjectName.toLocaleLowerCase().includes(loweredQuery) ||
    item.normalizedSubjectName.includes(normalizedQuery)
  );
}

function isEnterReady(event: KeyboardEvent) {
  return event.key === "Enter" && !event.nativeEvent.isComposing;
}

function SubjectMasterAutocomplete({
  hideLabel = false,
  label,
  onChange,
  onEnter,
  onSelect,
  value
}: SubjectMasterAutocompleteProps) {
  const listboxId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const filteredItems = useMemo(
    () =>
      subjectMasterItems
        .filter((item) => subjectMasterMatchesQuery(item, value))
        .slice(0, 12),
    [value]
  );
  const activeItem = filteredItems[activeIndex];

  useEffect(() => {
    setActiveIndex(0);
  }, [value]);

  function selectItem(item: SubjectMasterItem) {
    onSelect(item);
    setIsOpen(false);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.nativeEvent.isComposing) {
      return;
    }

    if (event.key === "ArrowDown" && filteredItems.length > 0) {
      event.preventDefault();
      setIsOpen(true);
      setActiveIndex((current) => (current + 1) % filteredItems.length);
      return;
    }

    if (event.key === "ArrowUp" && filteredItems.length > 0) {
      event.preventDefault();
      setIsOpen(true);
      setActiveIndex(
        (current) => (current - 1 + filteredItems.length) % filteredItems.length
      );
      return;
    }

    if (event.key === "Escape") {
      setIsOpen(false);
      return;
    }

    if (event.key === "Enter") {
      if (isOpen && activeItem) {
        event.preventDefault();
        event.stopPropagation();
        selectItem(activeItem);
        return;
      }

      if (onEnter) {
        event.preventDefault();
        event.stopPropagation();
        onEnter();
      }
    }
  }

  return (
    <div className="subject-picker">
      <label>
        <span className={hideLabel ? "subject-picker__label--hidden" : ""}>
          {label}
        </span>
        <input
          aria-activedescendant={
            isOpen && activeItem ? `${listboxId}-${activeItem.id}` : undefined
          }
          aria-controls={listboxId}
          aria-expanded={isOpen}
          autoComplete="off"
          onBlur={() => window.setTimeout(() => setIsOpen(false), 120)}
          onChange={(event) => {
            onChange(event.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(value.trim().length > 0)}
          onKeyDown={handleKeyDown}
          role="combobox"
          value={value}
        />
      </label>
      {isOpen && value.trim() ? (
        <div className="subject-picker__listbox" id={listboxId} role="listbox">
          {filteredItems.length > 0 ? (
            filteredItems.map((item, index) => (
              <button
                aria-selected={index === activeIndex}
                className={[
                  "subject-picker__option",
                  index === activeIndex ? "subject-picker__option--active" : ""
                ]
                  .filter(Boolean)
                  .join(" ")}
                id={`${listboxId}-${item.id}`}
                key={item.id}
                onMouseDown={(event) => {
                  event.preventDefault();
                  selectItem(item);
                }}
                role="option"
                type="button"
              >
                <strong>{item.subjectName}</strong>
                <span>{subjectMasterMetadata(item)}</span>
              </button>
            ))
          ) : (
            <div className="subject-picker__empty">일치하는 마스터 과목이 없습니다.</div>
          )}
        </div>
      ) : null}
    </div>
  );
}

function CourseDraftFields({
  draft,
  actions,
  onChange,
  onSubmit
}: CourseDraftFieldsProps) {
  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!isEnterReady(event) || !onSubmit) {
      return;
    }

    const target = event.target as HTMLElement;

    if (target.closest("button")) {
      return;
    }

    event.preventDefault();
    onSubmit();
  }

  return (
    <div className="external-input-form" onKeyDown={handleKeyDown}>
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
      <SubjectMasterAutocomplete
        label="과목명"
        onChange={(subjectName) => onChange({ subjectName })}
        onEnter={onSubmit}
        onSelect={(item) => onChange(subjectMasterPatch(item))}
        value={draft.subjectName}
      />
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
        <span>출처</span>
        <input
          onChange={(event) => onChange({ sourceType: event.target.value })}
          value={draft.sourceType}
        />
      </label>
      <label>
        <span>선택군</span>
        <input
          onChange={(event) => onChange({ choiceGroup: event.target.value })}
          value={draft.choiceGroup}
        />
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
        onSubmit={handleAddToStudents}
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
  const [draft, setDraft] = useState<ExternalCourseInputDraft>(() =>
    createEmptyExternalCourseDraft(missingSemesters)
  );
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    setDraft(createEmptyExternalCourseDraft(missingSemesters));
    setIsDetailsExpanded(false);
    setErrors([]);
  }, [missingSemesterKey, selectedStudent?.studentId]);

  function updateDraft(patch: Partial<ExternalCourseInputDraft>) {
    setDraft((current) => ({ ...current, ...patch }));
  }

  function handleAddInput() {
    const nextErrors: string[] = [];

    if (!selectedStudent) {
      nextErrors.push("학생을 먼저 선택하세요.");
    }

    if (!hasExternalCourseDraftValue(draft)) {
      nextErrors.push("추가할 과목을 입력하세요.");
    } else {
      validateExternalCourseInputDraft(draft).forEach((error) => {
        nextErrors.push(error);
      });
    }

    if (nextErrors.length > 0 || !selectedStudent) {
      setErrors(nextErrors);
      return;
    }

    onAddInputs([createExternalCourseInput(selectedStudent, draft)]);
    setDraft(createEmptyExternalCourseDraft(missingSemesters));
    setIsDetailsExpanded(false);
    setErrors([]);
  }

  function handleDraftKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!isEnterReady(event)) {
      return;
    }

    const target = event.target as HTMLElement;

    if (target.closest("button")) {
      return;
    }

    event.preventDefault();
    handleAddInput();
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
          {selectedStudent
            ? `${selectedStudent.name} (${selectedStudent.studentNo}) 과목 입력`
            : "학생을 먼저 선택하세요"}
        </p>
        <Button icon={<Plus size={16} />} onClick={handleAddInput}>
          입력 과목 추가
        </Button>
      </div>
      <ErrorList errors={errors} />
      <div className="external-subject-entry-list">
        <div className="external-subject-entry" onKeyDown={handleDraftKeyDown}>
          <div className="external-subject-entry__summary">
            <label>
              <span>학기</span>
              <select
                onChange={(event) =>
                  updateTargetFromKey(event.target.value, updateDraft)
                }
                value={`${draft.target.grade}-${draft.target.semester}`}
              >
                {semesterKeys.map((key) => (
                  <option key={key} value={key}>
                    {key}
                  </option>
                ))}
              </select>
            </label>
            <SubjectMasterAutocomplete
              label="과목명"
              onChange={(subjectName) => updateDraft({ subjectName })}
              onEnter={handleAddInput}
              onSelect={(item) => updateDraft(subjectMasterPatch(item))}
              value={draft.subjectName}
            />
            <label>
              <span>학점</span>
              <input
                min="0"
                onChange={(event) => updateDraft({ credits: event.target.value })}
                type="number"
                value={draft.credits}
              />
            </label>
            <label>
              <span>교과군</span>
              <select
                onChange={(event) => updateDraft({ subjectGroup: event.target.value })}
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
                onChange={(event) => updateDraft({ selectionType: event.target.value })}
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
            <div className="external-subject-entry__actions">
              <IconButton
                icon={
                  isDetailsExpanded ? (
                    <ChevronDown size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  )
                }
                label={`세부 항목 ${isDetailsExpanded ? "접기" : "펼치기"}`}
                onClick={() => setIsDetailsExpanded((current) => !current)}
              />
            </div>
          </div>
          {isDetailsExpanded ? (
            <div className="external-subject-entry__details">
              <label>
                <span>과목구분</span>
                <select
                  onChange={(event) => updateDraft({ groupType: event.target.value })}
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
                <span>출처</span>
                <input
                  onChange={(event) => updateDraft({ sourceType: event.target.value })}
                  value={draft.sourceType}
                />
              </label>
              <label>
                <span>선택군</span>
                <input
                  onChange={(event) => updateDraft({ choiceGroup: event.target.value })}
                  value={draft.choiceGroup}
                />
              </label>
              <label>
                <span>기관명</span>
                <input
                  onChange={(event) => updateDraft({ sourceName: event.target.value })}
                  value={draft.sourceName}
                />
              </label>
              <label>
                <span>메모</span>
                <input
                  onChange={(event) => updateDraft({ memo: event.target.value })}
                  value={draft.memo}
                />
              </label>
            </div>
          ) : null}
        </div>
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
  onAddInputs,
  onSelectedStudentIdChange,
  onStudentQueryChange
}: ExternalCourseInputTabsProps) {
  const [mode, setMode] = useState<ExternalCourseEntryMode>("manySubjects");

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
