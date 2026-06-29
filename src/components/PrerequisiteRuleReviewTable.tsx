import { Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import {
  buildOperatingSubjectPickerOptions,
  OperatingSubjectPicker
} from "./OperatingSubjectPicker";
import {
  createManualPrerequisiteRule
} from "../validation/generatePrerequisiteCandidates";
import type { OperatingSubject } from "../types/subject";
import type { PrerequisiteRule } from "../types/validation";
import { Button } from "./ui/Button";
import { IconButton } from "./ui/IconButton";
import { StatusBadge } from "./ui/StatusBadge";

type PrerequisiteRuleReviewTableProps = {
  disabled?: boolean;
  operatingSubjects: readonly OperatingSubject[];
  rules: readonly PrerequisiteRule[];
  onAddRule: (rule: PrerequisiteRule) => void;
  onUpdateRule: (rule: PrerequisiteRule) => void;
  onRemoveRule: (ruleId: string) => void;
};

export function PrerequisiteRuleReviewTable({
  disabled = false,
  operatingSubjects,
  rules,
  onAddRule,
  onUpdateRule,
  onRemoveRule
}: PrerequisiteRuleReviewTableProps) {
  const [beforeSubjectName, setBeforeSubjectName] = useState("");
  const [afterSubjectName, setAfterSubjectName] = useState("");
  const [allowConcurrent, setAllowConcurrent] = useState(false);
  const subjectOptions = useMemo(
    () => buildOperatingSubjectPickerOptions(operatingSubjects),
    [operatingSubjects]
  );

  function handleAdd() {
    if (disabled || !beforeSubjectName.trim() || !afterSubjectName.trim()) {
      return;
    }

    onAddRule(
      createManualPrerequisiteRule({
        beforeSubjectName,
        afterSubjectName,
        allowConcurrent
      })
    );
    setBeforeSubjectName("");
    setAfterSubjectName("");
    setAllowConcurrent(false);
  }

  return (
    <div
      className={[
        "prerequisite-rule-layout",
        disabled ? "prerequisite-rule-layout--disabled" : ""
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="prerequisite-rule-form">
        <OperatingSubjectPicker
          disabled={disabled}
          label="선이수 과목"
          onChange={setBeforeSubjectName}
          options={subjectOptions}
          placeholder="운영과목 검색"
          value={beforeSubjectName}
        />
        <OperatingSubjectPicker
          disabled={disabled}
          label="후이수 과목"
          onChange={setAfterSubjectName}
          options={subjectOptions}
          placeholder="운영과목 검색"
          value={afterSubjectName}
        />
        <label className="checkbox-label">
          <input
            checked={allowConcurrent}
            disabled={disabled}
            onChange={(event) => setAllowConcurrent(event.target.checked)}
            type="checkbox"
          />
          <span>병행 허용</span>
        </label>
        <Button
          disabled={
            disabled || !beforeSubjectName.trim() || !afterSubjectName.trim()
          }
          icon={<Plus size={16} />}
          onClick={handleAdd}
        >
          규칙 추가
        </Button>
      </div>
      <table className="placeholder-table">
        <thead>
          <tr>
            <th>점검</th>
            <th>선이수</th>
            <th>후이수</th>
            <th>병행</th>
            <th>외부 포함</th>
            <th>출처</th>
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
                <OperatingSubjectPicker
                  disabled={disabled}
                  hideLabel
                  label="선이수"
                  onChange={(subjectName) =>
                    onUpdateRule({ ...rule, beforeSubjectName: subjectName })
                  }
                  options={subjectOptions}
                  value={rule.beforeSubjectName}
                />
              </td>
              <td>
                <OperatingSubjectPicker
                  disabled={disabled}
                  hideLabel
                  label="후이수"
                  onChange={(subjectName) =>
                    onUpdateRule({ ...rule, afterSubjectName: subjectName })
                  }
                  options={subjectOptions}
                  value={rule.afterSubjectName}
                />
              </td>
              <td>
                <label className="checkbox-label checkbox-label--inline">
                  <input
                    checked={rule.allowConcurrent}
                    disabled={disabled}
                    onChange={(event) =>
                      onUpdateRule({ ...rule, allowConcurrent: event.target.checked })
                    }
                    type="checkbox"
                  />
                </label>
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
                </label>
              </td>
              <td>
                <StatusBadge
                  tone={rule.status === "active" ? "ready" : "warning"}
                >
                  {rule.source}
                </StatusBadge>
              </td>
              <td>
                <IconButton
                  disabled={disabled}
                  icon={<Trash2 size={16} />}
                  label="위계 규칙 삭제"
                  onClick={() => onRemoveRule(rule.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
