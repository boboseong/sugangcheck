import { Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { normalizeSubjectName } from "../normalizers/normalizeSubjectName";
import type { Semester } from "../types/semester";
import { semesterKeys, type Grade, type SemesterTerm } from "../types/semester";
import type { OperatingSubject } from "../types/subject";
import type {
  DetailedConstraintRule,
  DetailedConstraintSubject,
  SubjectCountComparison
} from "../types/validation";
import { createDetailedConstraintRuleId } from "../validation/detailedConstraintRules";
import { semesterLabel, semesterToKey } from "../utils/semester";
import {
  buildOperatingSubjectPickerOptions,
  OperatingSubjectPicker
} from "./OperatingSubjectPicker";
import { Button } from "./ui/Button";
import { IconButton } from "./ui/IconButton";
import { StatusBadge } from "./ui/StatusBadge";

type DetailedConstraintRuleTableProps = {
  disabled?: boolean;
  operatingSubjects: readonly OperatingSubject[];
  rules: readonly DetailedConstraintRule[];
  onAddRule: (rule: DetailedConstraintRule) => void;
  onUpdateRule: (rule: DetailedConstraintRule) => void;
  onRemoveRule: (ruleId: string) => void;
};

const gradeOptions = [1, 2, 3] as const;
const semesterOptions = [1, 2] as const;

function emptyConstraintSubject(target: Semester = { grade: 1, semester: 1 }) {
  return {
    target,
    subjectName: "",
    normalizedSubjectName: ""
  };
}

function normalizeConstraintSubject(
  subject: DetailedConstraintSubject
): DetailedConstraintSubject {
  return {
    ...subject,
    normalizedSubjectName: normalizeSubjectName(subject.subjectName)
  };
}

function updateConstraintSubject(
  subject: DetailedConstraintSubject,
  patch: Partial<DetailedConstraintSubject>
): DetailedConstraintSubject {
  return normalizeConstraintSubject({
    ...subject,
    ...patch
  });
}

function subjectLabel(subject: DetailedConstraintSubject): string {
  return `${semesterLabel(subject.target)} ${subject.subjectName}`.trim();
}

function comparisonLabel(comparison: SubjectCountComparison): string {
  return comparison === "atLeast" ? "n개 이상이면 검출" : "n개 이하이면 검출";
}

function ruleTypeLabel(rule: DetailedConstraintRule): string {
  return rule.type === "linkedSubject" ? "연계과목" : "기타제한";
}

export function DetailedConstraintRuleTable({
  disabled = false,
  operatingSubjects,
  rules,
  onAddRule,
  onUpdateRule,
  onRemoveRule
}: DetailedConstraintRuleTableProps) {
  const [draftType, setDraftType] =
    useState<DetailedConstraintRule["type"]>("linkedSubject");
  const [ruleName, setRuleName] = useState("");
  const [includeExternalInputs, setIncludeExternalInputs] = useState(true);
  const [trigger, setTrigger] = useState<DetailedConstraintSubject>(
    emptyConstraintSubject()
  );
  const [required, setRequired] = useState<DetailedConstraintSubject>(
    emptyConstraintSubject({ grade: 1, semester: 2 })
  );
  const [comparison, setComparison] =
    useState<SubjectCountComparison>("atLeast");
  const [count, setCount] = useState(1);
  const [subjects, setSubjects] = useState<DetailedConstraintSubject[]>([
    emptyConstraintSubject()
  ]);
  const subjectOptionsBySemester = useMemo(() => {
    const options = new Map<
      string,
      ReturnType<typeof buildOperatingSubjectPickerOptions>
    >();

    semesterKeys.forEach((key) => {
      const [grade, semester] = key.split("-").map(Number);
      options.set(
        key,
        buildOperatingSubjectPickerOptions(operatingSubjects, {
          target: {
            grade: grade as Grade,
            semester: semester as SemesterTerm
          }
        })
      );
    });

    return options;
  }, [operatingSubjects]);
  const canAddLinkedRule =
    trigger.subjectName.trim() !== "" && required.subjectName.trim() !== "";
  const canAddSubjectCountRule =
    count >= 0 && subjects.some((subject) => subject.subjectName.trim() !== "");
  const canAddRule =
    !disabled &&
    (draftType === "linkedSubject" ? canAddLinkedRule : canAddSubjectCountRule);

  function resetDraft() {
    setRuleName("");
    setIncludeExternalInputs(true);
    setTrigger(emptyConstraintSubject());
    setRequired(emptyConstraintSubject({ grade: 1, semester: 2 }));
    setComparison("atLeast");
    setCount(1);
    setSubjects([emptyConstraintSubject()]);
  }

  function handleAddRule() {
    if (!canAddRule) {
      return;
    }

    const now = new Date().toISOString();

    if (draftType === "linkedSubject") {
      const normalizedTrigger = normalizeConstraintSubject(trigger);
      const normalizedRequired = normalizeConstraintSubject(required);
      const nextName =
        ruleName.trim() ||
        `${subjectLabel(normalizedTrigger)} -> ${subjectLabel(normalizedRequired)}`;

      onAddRule({
        id: createDetailedConstraintRuleId(),
        type: "linkedSubject",
        name: nextName,
        status: "active",
        includeExternalInputsOverride: includeExternalInputs,
        source: "manual",
        trigger: normalizedTrigger,
        required: normalizedRequired,
        updatedAt: now
      });
      resetDraft();
      return;
    }

    const normalizedSubjects = subjects
      .filter((subject) => subject.subjectName.trim() !== "")
      .map(normalizeConstraintSubject);
    const nextName =
      ruleName.trim() ||
      `${normalizedSubjects
        .slice(0, 2)
        .map(subjectLabel)
        .join(", ")} ${count}개`;

    onAddRule({
      id: createDetailedConstraintRuleId(),
      type: "subjectCount",
      name: nextName,
      status: "active",
      includeExternalInputsOverride: includeExternalInputs,
      source: "manual",
      subjects: normalizedSubjects,
      comparison,
      count,
      updatedAt: now
    });
    resetDraft();
  }

  function renderSubjectFields(input: {
    label: string;
    subject: DetailedConstraintSubject;
    onChange: (subject: DetailedConstraintSubject) => void;
  }) {
    const subjectOptions =
      subjectOptionsBySemester.get(semesterToKey(input.subject.target)) ?? [];

    return (
      <div className="detailed-constraint-subject">
        <strong>{input.label}</strong>
        <label>
          <span>학년</span>
          <select
            disabled={disabled}
            onChange={(event) =>
              input.onChange(
                updateConstraintSubject(input.subject, {
                  target: {
                    ...input.subject.target,
                    grade: Number(event.target.value) as Grade
                  }
                })
              )
            }
            value={input.subject.target.grade}
          >
            {gradeOptions.map((grade) => (
              <option key={grade} value={grade}>
                {grade}학년
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>학기</span>
          <select
            disabled={disabled}
            onChange={(event) =>
              input.onChange(
                updateConstraintSubject(input.subject, {
                  target: {
                    ...input.subject.target,
                    semester: Number(event.target.value) as SemesterTerm
                  }
                })
              )
            }
            value={input.subject.target.semester}
          >
            {semesterOptions.map((semester) => (
              <option key={semester} value={semester}>
                {semester}학기
              </option>
            ))}
          </select>
        </label>
        <div className="detailed-constraint-subject__name">
          <OperatingSubjectPicker
            disabled={disabled}
            label="과목명"
            onChange={(subjectName) =>
              input.onChange(
                updateConstraintSubject(input.subject, {
                  subjectName
                })
              )
            }
            options={subjectOptions}
            placeholder="해당 학기 운영과목 검색"
            value={input.subject.subjectName}
          />
        </div>
      </div>
    );
  }

  function renderSubjectCountRows(input: {
    ruleDisabled?: boolean;
    subjects: readonly DetailedConstraintSubject[];
    onChange: (subjects: DetailedConstraintSubject[]) => void;
  }) {
    return (
      <div className="detailed-constraint-subject-list">
        {input.subjects.map((subject, index) => (
          <div className="detailed-constraint-subject-list__row" key={index}>
            {renderSubjectFields({
              label: `과목 ${index + 1}`,
              subject,
              onChange: (nextSubject) =>
                input.onChange(
                  input.subjects.map((item, itemIndex) =>
                    itemIndex === index ? nextSubject : item
                  )
                )
            })}
            <IconButton
              disabled={disabled || input.ruleDisabled}
              icon={<Trash2 size={16} />}
              label="세부 제약 과목 삭제"
              onClick={() =>
                input.onChange(
                  input.subjects.filter((_, itemIndex) => itemIndex !== index)
                )
              }
            />
          </div>
        ))}
        <Button
          disabled={disabled || input.ruleDisabled}
          icon={<Plus size={16} />}
          onClick={() =>
            input.onChange([...input.subjects, emptyConstraintSubject()])
          }
          variant="secondary"
        >
          과목 추가
        </Button>
      </div>
    );
  }

  function renderDraftSpecificFields() {
    if (draftType === "linkedSubject") {
      return (
        <div className="detailed-constraint-field-grid">
          {renderSubjectFields({
            label: "조건 과목",
            subject: trigger,
            onChange: setTrigger
          })}
          {renderSubjectFields({
            label: "필수 과목",
            subject: required,
            onChange: setRequired
          })}
        </div>
      );
    }

    return (
      <div className="detailed-constraint-count-form">
        <label>
          <span>비교 방식</span>
          <select
            disabled={disabled}
            onChange={(event) =>
              setComparison(event.target.value as SubjectCountComparison)
            }
            value={comparison}
          >
            <option value="atLeast">n개 이상이면 검출</option>
            <option value="atMost">n개 이하이면 검출</option>
          </select>
        </label>
        <label>
          <span>기준 개수</span>
          <input
            disabled={disabled}
            min="0"
            onChange={(event) => setCount(Number(event.target.value))}
            type="number"
            value={count}
          />
        </label>
        {renderSubjectCountRows({
          subjects,
          onChange: setSubjects
        })}
      </div>
    );
  }

  function renderRuleDetail(rule: DetailedConstraintRule) {
    if (rule.type === "linkedSubject") {
      return (
        <div className="detailed-constraint-field-grid">
          {renderSubjectFields({
            label: "조건 과목",
            subject: rule.trigger,
            onChange: (triggerSubject) =>
              onUpdateRule({ ...rule, trigger: triggerSubject })
          })}
          {renderSubjectFields({
            label: "필수 과목",
            subject: rule.required,
            onChange: (requiredSubject) =>
              onUpdateRule({ ...rule, required: requiredSubject })
          })}
        </div>
      );
    }

    return (
      <div className="detailed-constraint-count-form">
        <label>
          <span>비교 방식</span>
          <select
            disabled={disabled}
            onChange={(event) =>
              onUpdateRule({
                ...rule,
                comparison: event.target.value as SubjectCountComparison
              })
            }
            value={rule.comparison}
          >
            <option value="atLeast">n개 이상이면 검출</option>
            <option value="atMost">n개 이하이면 검출</option>
          </select>
        </label>
        <label>
          <span>기준 개수</span>
          <input
            disabled={disabled}
            min="0"
            onChange={(event) =>
              onUpdateRule({ ...rule, count: Number(event.target.value) })
            }
            type="number"
            value={rule.count}
          />
        </label>
        {renderSubjectCountRows({
          subjects: rule.subjects,
          onChange: (nextSubjects) =>
            onUpdateRule({ ...rule, subjects: nextSubjects })
        })}
      </div>
    );
  }

  return (
    <div
      className={[
        "detailed-constraint-layout",
        disabled ? "detailed-constraint-layout--disabled" : ""
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="detailed-constraint-form">
        <label>
          <span>유형</span>
          <select
            disabled={disabled}
            onChange={(event) =>
              setDraftType(event.target.value as DetailedConstraintRule["type"])
            }
            value={draftType}
          >
            <option value="linkedSubject">연계과목</option>
            <option value="subjectCount">기타제한</option>
          </select>
        </label>
        <label>
          <span>규칙명</span>
          <input
            disabled={disabled}
            onChange={(event) => setRuleName(event.target.value)}
            value={ruleName}
          />
        </label>
        <label className="checkbox-label">
          <input
            checked={includeExternalInputs}
            disabled={disabled}
            onChange={(event) => setIncludeExternalInputs(event.target.checked)}
            type="checkbox"
          />
          <span>전입/외부 포함</span>
        </label>
        {renderDraftSpecificFields()}
        <Button disabled={!canAddRule} icon={<Plus size={16} />} onClick={handleAddRule}>
          규칙 추가
        </Button>
      </div>
      <table className="placeholder-table detailed-constraint-table">
        <thead>
          <tr>
            <th>점검</th>
            <th>유형</th>
            <th>규칙명</th>
            <th>전입/외부</th>
            <th>세부 조건</th>
            <th>삭제</th>
          </tr>
        </thead>
        <tbody>
          {rules.map((rule) => (
            <tr key={rule.id}>
              <td>
                <label className="checkbox-label checkbox-label--inline">
                  <input
                    checked={rule.status === "active"}
                    disabled={disabled}
                    onChange={(event) =>
                      onUpdateRule({
                        ...rule,
                        status: event.target.checked ? "active" : "disabled"
                      })
                    }
                    type="checkbox"
                  />
                </label>
              </td>
              <td>
                <StatusBadge tone={rule.status === "active" ? "ready" : "empty"}>
                  {ruleTypeLabel(rule)}
                </StatusBadge>
              </td>
              <td>
                <input
                  disabled={disabled}
                  onChange={(event) =>
                    onUpdateRule({ ...rule, name: event.target.value })
                  }
                  value={rule.name}
                />
              </td>
              <td>
                <label className="checkbox-label checkbox-label--inline">
                  <input
                    checked={rule.includeExternalInputsOverride ?? true}
                    disabled={disabled}
                    onChange={(event) =>
                      onUpdateRule({
                        ...rule,
                        includeExternalInputsOverride: event.target.checked
                      })
                    }
                    type="checkbox"
                  />
                  <span>{rule.includeExternalInputsOverride ?? true ? "포함" : "제외"}</span>
                </label>
              </td>
              <td>
                <div className="detailed-constraint-summary">
                  {rule.type === "subjectCount" ? (
                    <p>
                      {comparisonLabel(rule.comparison)} · 기준 {rule.count}개
                    </p>
                  ) : null}
                  {renderRuleDetail(rule)}
                </div>
              </td>
              <td>
                <IconButton
                  disabled={disabled}
                  icon={<Trash2 size={16} />}
                  label="세부 제약 삭제"
                  onClick={() => onRemoveRule(rule.id)}
                />
              </td>
            </tr>
          ))}
          {rules.length === 0 ? (
            <tr>
              <td colSpan={6}>등록된 세부 제약이 없습니다.</td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}
