import { Pencil, Save, X } from "lucide-react";
import { useState } from "react";
import {
  groupTypes,
  selectionTypes,
  subjectGroups
} from "../data/subjectMaster";
import { normalizeSubjectName } from "../normalizers/normalizeSubjectName";
import type { Grade, SemesterTerm } from "../types/semester";
import type { OperatingSubject } from "../types/subject";
import { toCreditNumber } from "../utils/number";
import { semesterLabel } from "../utils/semester";
import { Button } from "./ui/Button";
import { StatusBadge } from "./ui/StatusBadge";

type OperatingSubjectReviewTableProps = {
  subjects: readonly OperatingSubject[];
  onUpdateSubject: (subject: OperatingSubject) => void;
};

const statusLabels: Record<OperatingSubject["masterMatchStatus"], string> = {
  matched: "마스터 일치",
  unmatched: "미등록",
  manual: "수동 보정"
};

const grades = [1, 2, 3] as const satisfies readonly Grade[];
const semesterTerms = [1, 2] as const satisfies readonly SemesterTerm[];

type Draft = {
  grade: string;
  semester: string;
  subjectName: string;
  credits: string;
  groupType: string;
  subjectGroup: string;
  selectionType: string;
};

function createDraft(subject: OperatingSubject): Draft {
  return {
    grade: String(subject.target.grade),
    semester: String(subject.target.semester),
    subjectName: subject.subjectName,
    credits: String(subject.credits),
    groupType: subject.groupType ?? "",
    subjectGroup: subject.subjectGroup,
    selectionType: subject.selectionType
  };
}

function optionList(values: readonly string[], fallback: string): string[] {
  return [...new Set([fallback, ...values].filter(Boolean))];
}

function isValidDraft(draft: Draft): boolean {
  return draft.subjectName.trim().length > 0 && toCreditNumber(draft.credits) !== undefined;
}

export function OperatingSubjectReviewTable({
  onUpdateSubject,
  subjects
}: OperatingSubjectReviewTableProps) {
  const [editingSubjectId, setEditingSubjectId] = useState<string>();
  const [drafts, setDrafts] = useState<Record<string, Draft>>({});

  function draftFor(subject: OperatingSubject): Draft {
    return drafts[subject.id] ?? createDraft(subject);
  }

  function startEditing(subject: OperatingSubject) {
    setEditingSubjectId(subject.id);
    setDrafts((current) => ({
      ...current,
      [subject.id]: createDraft(subject)
    }));
  }

  function updateDraft(
    subject: OperatingSubject,
    field: keyof Draft,
    value: string
  ) {
    setDrafts((current) => ({
      ...current,
      [subject.id]: {
        ...draftFor(subject),
        [field]: value
      }
    }));
  }

  function clearDraft(subjectId: string) {
    setDrafts((current) => {
      const next = { ...current };
      delete next[subjectId];
      return next;
    });
  }

  function cancelEditing(subject: OperatingSubject) {
    clearDraft(subject.id);
    setEditingSubjectId(undefined);
  }

  function saveDraft(subject: OperatingSubject) {
    const draft = draftFor(subject);
    const credits = toCreditNumber(draft.credits);
    const subjectName = draft.subjectName.trim();

    if (!subjectName || credits === undefined) {
      return;
    }

    onUpdateSubject({
      ...subject,
      target: {
        grade: Number(draft.grade) as Grade,
        semester: Number(draft.semester) as SemesterTerm
      },
      subjectName,
      normalizedSubjectName: normalizeSubjectName(subjectName),
      subjectGroup: draft.subjectGroup.trim() || "미확인",
      selectionType: draft.selectionType.trim() || "미확인",
      groupType: draft.groupType.trim() || undefined,
      credits,
      masterMatchStatus: "manual",
      overrideId: undefined
    });
    clearDraft(subject.id);
    setEditingSubjectId(undefined);
  }

  if (subjects.length === 0) {
    return (
      <div className="empty-panel">
        <p>운영과목 파일을 업로드하면 파싱 결과가 표시됩니다.</p>
      </div>
    );
  }

  return (
    <div className="preview-table-wrap operating-subject-review">
      <table className="placeholder-table">
        <thead>
          <tr>
            <th>학기</th>
            <th>과목명</th>
            <th>학점</th>
            <th>과목구분</th>
            <th>교과군</th>
            <th>선택구분</th>
            <th>상태</th>
            <th>수정</th>
          </tr>
        </thead>
        <tbody>
          {subjects.map((subject) => {
            const isEditing = editingSubjectId === subject.id;
            const draft = draftFor(subject);
            const saveDisabled = !isValidDraft(draft);

            return (
              <tr key={subject.id}>
                <td>
                  {isEditing ? (
                    <div className="operating-subject-semester-controls">
                      <select
                        aria-label={`${subject.subjectName} 학년`}
                        onChange={(event) =>
                          updateDraft(subject, "grade", event.target.value)
                        }
                        value={draft.grade}
                      >
                        {grades.map((grade) => (
                          <option key={grade} value={grade}>
                            {grade}학년
                          </option>
                        ))}
                      </select>
                      <select
                        aria-label={`${subject.subjectName} 학기`}
                        onChange={(event) =>
                          updateDraft(subject, "semester", event.target.value)
                        }
                        value={draft.semester}
                      >
                        {semesterTerms.map((semester) => (
                          <option key={semester} value={semester}>
                            {semester}학기
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    semesterLabel(subject.target)
                  )}
                </td>
                <td>
                  {isEditing ? (
                    <input
                      aria-label={`${subject.subjectName} 과목명`}
                      className="operating-subject-name-input"
                      onChange={(event) =>
                        updateDraft(subject, "subjectName", event.target.value)
                      }
                      value={draft.subjectName}
                    />
                  ) : (
                    subject.subjectName
                  )}
                </td>
                <td>
                  {isEditing ? (
                    <input
                      aria-label={`${subject.subjectName} 학점`}
                      min="0"
                      onChange={(event) =>
                        updateDraft(subject, "credits", event.target.value)
                      }
                      step="0.5"
                      type="number"
                      value={draft.credits}
                    />
                  ) : (
                    subject.credits
                  )}
                </td>
                <td>
                  {isEditing ? (
                    <select
                      aria-label={`${subject.subjectName} 과목구분`}
                      onChange={(event) =>
                        updateDraft(subject, "groupType", event.target.value)
                      }
                      value={draft.groupType}
                    >
                      <option value="">미확인</option>
                      {optionList(groupTypes, draft.groupType).map((value) => (
                        <option key={value} value={value}>
                          {value}
                        </option>
                      ))}
                    </select>
                  ) : (
                    (subject.groupType ?? "-")
                  )}
                </td>
                <td>
                  {isEditing ? (
                    <select
                      aria-label={`${subject.subjectName} 교과군`}
                      onChange={(event) =>
                        updateDraft(subject, "subjectGroup", event.target.value)
                      }
                      value={draft.subjectGroup}
                    >
                      <option value="">미확인</option>
                      {optionList(subjectGroups, draft.subjectGroup).map((value) => (
                        <option key={value} value={value}>
                          {value}
                        </option>
                      ))}
                    </select>
                  ) : (
                    subject.subjectGroup
                  )}
                </td>
                <td>
                  {isEditing ? (
                    <select
                      aria-label={`${subject.subjectName} 선택구분`}
                      onChange={(event) =>
                        updateDraft(subject, "selectionType", event.target.value)
                      }
                      value={draft.selectionType}
                    >
                      <option value="">미확인</option>
                      {optionList(selectionTypes, draft.selectionType).map((value) => (
                        <option key={value} value={value}>
                          {value}
                        </option>
                      ))}
                    </select>
                  ) : (
                    subject.selectionType
                  )}
                </td>
                <td>
                  <StatusBadge
                    tone={
                      subject.masterMatchStatus === "matched"
                        ? "ready"
                        : subject.masterMatchStatus === "manual"
                          ? "warning"
                          : "error"
                    }
                  >
                    {statusLabels[subject.masterMatchStatus]}
                  </StatusBadge>
                </td>
                <td>
                  {isEditing ? (
                    <div className="operating-subject-actions">
                      <Button
                        className="button--compact"
                        disabled={saveDisabled}
                        icon={<Save size={15} />}
                        onClick={() => saveDraft(subject)}
                      >
                        저장
                      </Button>
                      <Button
                        className="button--compact"
                        icon={<X size={15} />}
                        onClick={() => cancelEditing(subject)}
                        variant="secondary"
                      >
                        취소
                      </Button>
                    </div>
                  ) : (
                    <Button
                      className="button--compact"
                      icon={<Pencil size={15} />}
                      onClick={() => startEditing(subject)}
                      variant="secondary"
                    >
                      수정
                    </Button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
