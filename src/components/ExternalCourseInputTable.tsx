import { Plus, Trash2 } from "lucide-react";
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
import type { Semester } from "../types/semester";
import type { Student } from "../types/student";
import { semesterKeys } from "../types/semester";
import { parseSemesterKey, semesterLabel } from "../utils/semester";
import { createEmptyExternalCourseDraft } from "./externalCourseInputDraft";
import { Button } from "./ui/Button";
import { IconButton } from "./ui/IconButton";
import { StatusBadge } from "./ui/StatusBadge";

type ExternalCourseInputTableProps = {
  selectedStudent?: Student;
  missingSemesters: readonly Semester[];
  inputs: readonly ExternalCourseInput[];
  onAddInput: (input: ExternalCourseInput) => void;
  onRemoveInput: (inputId: string) => void;
  formPrefix?: ReactNode;
};

export function ExternalCourseInputTable({
  selectedStudent,
  missingSemesters,
  inputs,
  onAddInput,
  onRemoveInput,
  formPrefix
}: ExternalCourseInputTableProps) {
  const missingSemesterKey = useMemo(
    () =>
      missingSemesters
        .map((semester) => `${semester.grade}-${semester.semester}`)
        .join("|"),
    [missingSemesters]
  );
  const [draft, setDraft] = useState<ExternalCourseInputDraft>(
    createEmptyExternalCourseDraft(missingSemesters)
  );
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    setDraft(createEmptyExternalCourseDraft(missingSemesters));
    setErrors([]);
  }, [missingSemesterKey, selectedStudent?.studentId]);

  function updateDraft(patch: Partial<ExternalCourseInputDraft>) {
    setDraft((current) => ({ ...current, ...patch }));
  }

  function handleAdd() {
    if (!selectedStudent) {
      setErrors(["학생을 먼저 선택하세요."]);
      return;
    }

    const nextErrors = validateExternalCourseInputDraft(draft);

    if (nextErrors.length > 0) {
      setErrors(nextErrors);
      return;
    }

    onAddInput(createExternalCourseInput(selectedStudent, draft));
    setDraft(createEmptyExternalCourseDraft(missingSemesters));
    setErrors([]);
  }

  return (
    <div className="external-input-layout">
      <div className="external-input-form">
        {formPrefix}
        {formPrefix ? <div className="external-input-form__divider" /> : null}
        <label>
          <span>학기</span>
          <select
            onChange={(event) => {
              const semester = parseSemesterKey(event.target.value);
              if (semester) {
                updateDraft({ target: semester });
              }
            }}
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
            onChange={(event) => updateDraft({ subjectName: event.target.value })}
            value={draft.subjectName}
          />
        </label>
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
          <span>출처</span>
          <select
            onChange={(event) =>
              updateDraft({
                sourceType: event.target.value as ExternalCourseInputDraft["sourceType"]
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
            onChange={(event) => updateDraft({ sourceName: event.target.value })}
            value={draft.sourceName}
          />
        </label>
        <label className="external-input-form__wide">
          <span>메모</span>
          <input
            onChange={(event) => updateDraft({ memo: event.target.value })}
            value={draft.memo}
          />
        </label>
        <div className="external-input-form__actions">
          <Button icon={<Plus size={16} />} onClick={handleAdd}>
            행 추가
          </Button>
        </div>
      </div>
      {errors.length > 0 ? (
        <div className="form-errors">
          {errors.map((error) => (
            <p key={error}>{error}</p>
          ))}
        </div>
      ) : null}
      <table className="placeholder-table">
        <thead>
          <tr>
            <th>학기</th>
            <th>과목명</th>
            <th>교과군</th>
            <th>선택구분</th>
            <th>학점</th>
            <th>출처</th>
            <th>삭제</th>
          </tr>
        </thead>
        <tbody>
          {inputs.length === 0 ? (
            <tr>
              <td colSpan={7}>저장된 직접 입력 행이 없습니다.</td>
            </tr>
          ) : (
            inputs.map((input) => (
              <tr key={input.id}>
                <td>{semesterLabel(input.target)}</td>
                <td>{input.subjectName}</td>
                <td>{input.subjectGroup ?? "-"}</td>
                <td>{input.selectionType ?? "-"}</td>
                <td>{input.credits ?? "-"}</td>
                <td>
                  <StatusBadge tone="ready">
                    {input.sourceType === "transfer" ? "전입" : "외부"}
                  </StatusBadge>
                </td>
                <td>
                  <IconButton
                    icon={<Trash2 size={16} />}
                    label="직접 입력 행 삭제"
                    onClick={() => onRemoveInput(input.id)}
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
