import { RotateCcw } from "lucide-react";
import type {
  ValidationRuleId,
  ValidationRuleSetting
} from "../types/validation";
import { semesterToKey } from "../utils/semester";
import { validationRuleLabels } from "../utils/validationRuleLabels";
import {
  formatAllowedValues,
  getSemesterCreditSubjectCriteria,
  parseAllowedValuesText,
  semesterCreditSubjectCriteriaKey
} from "../validation/semesterCreditSubjectCriteria";
import { Button } from "./ui/Button";
import { StatusBadge } from "./ui/StatusBadge";

type ValidationRuleSettingsFormProps = {
  settings: readonly ValidationRuleSetting[];
  onEnabledChange: (ruleId: ValidationRuleId, enabled: boolean) => void;
  onIncludeExternalInputsChange: (
    ruleId: ValidationRuleId,
    includeExternalInputs: boolean
  ) => void;
  onCriteriaChange: (
    ruleId: ValidationRuleId,
    criteriaPatch: Record<string, unknown>
  ) => void;
  onRestoreDefaults: () => void;
};

const compactRuleIds = new Set<ValidationRuleId>([
  "duplicateSubjects",
  "koreanMathEnglishLimit"
]);

const displayRuleIds: ValidationRuleId[] = [
  "duplicateSubjects",
  "subjectMetadataMismatch",
  "koreanMathEnglishLimit",
  "creditDifference",
  "requiredSubjectGroupCredits"
];

const hiddenRuleIds = new Set<ValidationRuleId>([
  "minimumCredits",
  "courseExistsInOperatingSubjects",
  "koreanHistoryCredits",
  "prerequisites",
  "detailedConstraints"
]);

function numberFromCriteria(
  criteria: Record<string, unknown>,
  key: string,
  fallback: number
): number {
  const value = criteria[key];
  return typeof value === "number" ? value : fallback;
}

function criteriaArray(
  criteria: Record<string, unknown>,
  key: string
): Record<string, unknown>[] {
  const value = criteria[key];
  return Array.isArray(value) ? (value as Record<string, unknown>[]) : [];
}

export function ValidationRuleSettingsForm({
  settings,
  onEnabledChange,
  onIncludeExternalInputsChange,
  onCriteriaChange,
  onRestoreDefaults
}: ValidationRuleSettingsFormProps) {
  function renderStatusBadge(setting: ValidationRuleSetting) {
    return (
      <StatusBadge tone={setting.enabled ? "ready" : "empty"}>
        {setting.enabled ? "사용" : "꺼짐"}
      </StatusBadge>
    );
  }

  function renderRuleControls(setting: ValidationRuleSetting) {
    return (
      <div className="rule-row__controls">
        <label>
          <input
            checked={setting.enabled}
            onChange={(event) =>
              onEnabledChange(setting.id, event.target.checked)
            }
            type="checkbox"
          />
          <span>사용</span>
        </label>
        <label>
          <input
            checked={setting.includeExternalInputs}
            onChange={(event) =>
              onIncludeExternalInputsChange(
                setting.id,
                event.target.checked
              )
            }
            type="checkbox"
          />
          <span>전입/외부 포함</span>
        </label>
      </div>
    );
  }

  function renderMinimumCreditsCriteria(setting: ValidationRuleSetting) {
    return (
      <label>
        <span>최소 이수학점</span>
        <input
          min="0"
          onChange={(event) =>
            onCriteriaChange(setting.id, {
              minimumTotalCredits: Number(event.target.value)
            })
          }
          type="number"
          value={numberFromCriteria(
            setting.criteria,
            "minimumTotalCredits",
            174
          )}
        />
      </label>
    );
  }

  function renderRequiredCreditsGroup(
    minimumCreditsSetting: ValidationRuleSetting,
    subjectGroupSetting: ValidationRuleSetting,
    koreanHistorySetting: ValidationRuleSetting
  ) {
    const groupEnabled =
      minimumCreditsSetting.enabled &&
      subjectGroupSetting.enabled &&
      koreanHistorySetting.enabled;
    const includeExternalInputs =
      minimumCreditsSetting.includeExternalInputs &&
      subjectGroupSetting.includeExternalInputs &&
      koreanHistorySetting.includeExternalInputs;

    return (
      <section className="rule-row" key="required-credits-group">
        <div className="rule-row__header">
          <div>
            <h2>필수 이수학점</h2>
            <StatusBadge tone={groupEnabled ? "ready" : "empty"}>
              {groupEnabled ? "사용" : "꺼짐"}
            </StatusBadge>
          </div>
          <div className="rule-row__controls">
            <label>
              <input
                checked={groupEnabled}
                onChange={(event) => {
                  onEnabledChange(minimumCreditsSetting.id, event.target.checked);
                  onEnabledChange(subjectGroupSetting.id, event.target.checked);
                  onEnabledChange(koreanHistorySetting.id, event.target.checked);
                }}
                type="checkbox"
              />
              <span>사용</span>
            </label>
            <label>
              <input
                checked={includeExternalInputs}
                onChange={(event) => {
                  onIncludeExternalInputsChange(
                    minimumCreditsSetting.id,
                    event.target.checked
                  );
                  onIncludeExternalInputsChange(
                    subjectGroupSetting.id,
                    event.target.checked
                  );
                  onIncludeExternalInputsChange(
                    koreanHistorySetting.id,
                    event.target.checked
                  );
                }}
                type="checkbox"
              />
              <span>전입/외부 포함</span>
            </label>
          </div>
        </div>
        <div className="rule-row__criteria rule-row__criteria--centered rule-row__criteria--required-credits">
          {renderMinimumCreditsCriteria(minimumCreditsSetting)}
          {criteriaArray(
            subjectGroupSetting.criteria,
            "requiredSubjectGroupCredits"
          ).map((criteria, index, allCriteria) => (
            <label key={String(criteria.subjectGroup ?? index)}>
              <span>{String(criteria.subjectGroup ?? "교과군")}</span>
              <input
                min="0"
                onChange={(event) => {
                  const nextCriteria = allCriteria.map((item, itemIndex) =>
                    itemIndex === index
                      ? {
                          ...item,
                          requiredCredits: Number(event.target.value)
                        }
                      : item
                  );
                  onCriteriaChange(subjectGroupSetting.id, {
                    requiredSubjectGroupCredits: nextCriteria
                  });
                }}
                type="number"
                value={Number(criteria.requiredCredits ?? 0)}
              />
            </label>
          ))}
          <label>
            <span>한국사</span>
            <input
              min="0"
              onChange={(event) =>
                onCriteriaChange(koreanHistorySetting.id, {
                  requiredCredits: Number(event.target.value)
                })
              }
              type="number"
              value={numberFromCriteria(
                koreanHistorySetting.criteria,
                "requiredCredits",
                6
              )}
            />
          </label>
        </div>
      </section>
    );
  }

  function renderCreditDifferenceCriteria(setting: ValidationRuleSetting) {
    const semesterCriteria = getSemesterCreditSubjectCriteria(setting.criteria);

    function updateSemesterCriteria(
      targetKey: string,
      patch: {
        allowedCredits?: number[];
        allowedSubjectCounts?: number[];
      }
    ) {
      onCriteriaChange(setting.id, {
        [semesterCreditSubjectCriteriaKey]: semesterCriteria.map((criteria) =>
          semesterToKey(criteria.target) === targetKey
            ? {
                ...criteria,
                ...patch
              }
            : criteria
        )
      });
    }

    return (
      <section className="rule-row" key={setting.id}>
        <div className="rule-row__header">
          <div>
            <h2>{validationRuleLabels[setting.id]}</h2>
            {renderStatusBadge(setting)}
            <p className="rule-row__description">
              여러 허용값은 쉼표로 입력할 수 있습니다.
            </p>
          </div>
          {renderRuleControls(setting)}
        </div>
        <div className="rule-row__criteria-table-wrap">
          <table className="rule-row__criteria-table rule-row__criteria-table--matrix">
            <thead>
              <tr>
                <th>학기</th>
                {semesterCriteria.map((criteria) => {
                  const targetKey = semesterToKey(criteria.target);

                  return <th key={targetKey}>{targetKey}</th>;
                })}
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">학점 허용값</th>
                {semesterCriteria.map((criteria) => {
                  const targetKey = semesterToKey(criteria.target);

                  return (
                    <td key={targetKey}>
                      <input
                        defaultValue={formatAllowedValues(criteria.allowedCredits)}
                        inputMode="numeric"
                        key={`${targetKey}-credits-${formatAllowedValues(
                          criteria.allowedCredits
                        )}`}
                        onBlur={(event) =>
                          updateSemesterCriteria(targetKey, {
                            allowedCredits: parseAllowedValuesText(
                              event.target.value
                            )
                          })
                        }
                        type="text"
                      />
                    </td>
                  );
                })}
              </tr>
              <tr>
                <th scope="row">과목 수 허용값</th>
                {semesterCriteria.map((criteria) => {
                  const targetKey = semesterToKey(criteria.target);

                  return (
                    <td key={targetKey}>
                      <input
                        defaultValue={formatAllowedValues(
                          criteria.allowedSubjectCounts
                        )}
                        inputMode="numeric"
                        key={`${targetKey}-subjects-${formatAllowedValues(
                          criteria.allowedSubjectCounts
                        )}`}
                        onBlur={(event) =>
                          updateSemesterCriteria(targetKey, {
                            allowedSubjectCounts: parseAllowedValuesText(
                              event.target.value
                            )
                          })
                        }
                        type="text"
                      />
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    );
  }

  function renderSubjectInfoGroup(
    courseExistsSetting: ValidationRuleSetting,
    metadataMismatchSetting: ValidationRuleSetting
  ) {
    const groupEnabled =
      courseExistsSetting.enabled && metadataMismatchSetting.enabled;
    const includeExternalInputs =
      courseExistsSetting.includeExternalInputs &&
      metadataMismatchSetting.includeExternalInputs;

    return (
      <section className="rule-row rule-row--compact" key="subject-info-group">
        <div className="rule-row__compact-main">
          <h2>과목정보 불일치</h2>
          <StatusBadge tone={groupEnabled ? "ready" : "empty"}>
            {groupEnabled ? "사용" : "꺼짐"}
          </StatusBadge>
        </div>
        <div className="rule-row__controls">
          <label>
            <input
              checked={groupEnabled}
              onChange={(event) => {
                onEnabledChange(courseExistsSetting.id, event.target.checked);
                onEnabledChange(metadataMismatchSetting.id, event.target.checked);
              }}
              type="checkbox"
            />
            <span>사용</span>
          </label>
          <label>
            <input
              checked={includeExternalInputs}
              onChange={(event) => {
                onIncludeExternalInputsChange(
                  courseExistsSetting.id,
                  event.target.checked
                );
                onIncludeExternalInputsChange(
                  metadataMismatchSetting.id,
                  event.target.checked
                );
              }}
              type="checkbox"
            />
            <span>전입/외부 포함</span>
          </label>
        </div>
      </section>
    );
  }

  const settingById = new Map(settings.map((setting) => [setting.id, setting]));

  return (
    <div className="rule-settings">
      <div className="rule-settings__toolbar">
        <Button
          icon={<RotateCcw size={16} />}
          onClick={onRestoreDefaults}
          variant="secondary"
        >
          기본값 복원
        </Button>
      </div>
      {displayRuleIds.map((ruleId) => {
        const setting = settingById.get(ruleId);

        if (!setting || hiddenRuleIds.has(setting.id)) {
          return null;
        }

        if (setting.id === "subjectMetadataMismatch") {
          const courseExistsSetting = settingById.get("courseExistsInOperatingSubjects");

          if (courseExistsSetting) {
            return renderSubjectInfoGroup(courseExistsSetting, setting);
          }
        }

        if (setting.id === "requiredSubjectGroupCredits") {
          const minimumCreditsSetting = settingById.get("minimumCredits");
          const koreanHistorySetting = settingById.get("koreanHistoryCredits");

          if (minimumCreditsSetting && koreanHistorySetting) {
            return renderRequiredCreditsGroup(
              minimumCreditsSetting,
              setting,
              koreanHistorySetting
            );
          }
        }

        if (setting.id === "creditDifference") {
          return renderCreditDifferenceCriteria(setting);
        }

        if (compactRuleIds.has(setting.id)) {
          return (
            <section className="rule-row rule-row--compact" key={setting.id}>
              <div className="rule-row__compact-main">
                <h2>{validationRuleLabels[setting.id]}</h2>
                {renderStatusBadge(setting)}
              </div>
              {renderRuleControls(setting)}
            </section>
          );
        }

        return (
          <section className="rule-row" key={setting.id}>
            <div className="rule-row__header">
              <div>
                <h2>{validationRuleLabels[setting.id]}</h2>
                {renderStatusBadge(setting)}
              </div>
              {renderRuleControls(setting)}
            </div>
          </section>
        );
      })}
    </div>
  );
}
