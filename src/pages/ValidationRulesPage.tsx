import { Download } from "lucide-react";
import { DetailedConstraintRuleTable } from "../components/DetailedConstraintRuleTable";
import { UploadImportLauncher } from "../components/UploadImportLauncher";
import { ValidationRuleSettingsForm } from "../components/ValidationRuleSettingsForm";
import { PrerequisiteRuleReviewTable } from "../components/PrerequisiteRuleReviewTable";
import { Button } from "../components/ui/Button";
import { PageHeader } from "../components/ui/PageHeader";
import { readWorkbookFromFile } from "../parsers/readWorkbook";
import { useDetailedConstraintRuleStore } from "../state/detailedConstraintRuleStore";
import { useOperatingSubjectStore } from "../state/operatingSubjectStore";
import { usePrerequisiteRuleStore } from "../state/prerequisiteRuleStore";
import { clearDerivedValidationState } from "../state/projectWorkspace";
import { useValidationRuleSettingStore } from "../state/validationRuleSettingStore";
import {
  createValidationRulesTemplateWorkbook,
  createXlsxBlob,
  parseValidationRulesTemplateWorkbook,
  templateFileNames
} from "../templates/xlsxTemplates";
import { downloadBlob } from "../utils/downloadBlob";

export function ValidationRulesPage() {
  const {
    restoreDefaultValidationRuleSettings,
    setValidationRuleSettings,
    updateRuleCriteria,
    updateRuleEnabled,
    updateRuleIncludeExternalInputs,
    validationRuleSettings
  } = useValidationRuleSettingStore();
  const { operatingSubjects } = useOperatingSubjectStore();
  const {
    generateCandidatesFromOperatingSubjects,
    prerequisiteRules,
    removePrerequisiteRule,
    setPrerequisiteRules,
    updatePrerequisiteRule
  } = usePrerequisiteRuleStore();
  const {
    detailedConstraintRules,
    removeDetailedConstraintRule,
    setDetailedConstraintRules,
    updateDetailedConstraintRule
  } = useDetailedConstraintRuleStore();
  const prerequisiteRuleSetting = validationRuleSettings.find(
    (setting) => setting.id === "prerequisites"
  );
  const detailedConstraintRuleSetting = validationRuleSettings.find(
    (setting) => setting.id === "detailedConstraints"
  );
  const prerequisiteValidationEnabled = prerequisiteRuleSetting?.enabled ?? false;
  const detailedConstraintValidationEnabled =
    detailedConstraintRuleSetting?.enabled ?? false;

  async function handleDownloadValidationRulesTemplate() {
    await downloadBlob(
      createXlsxBlob(
        createValidationRulesTemplateWorkbook({
          validationRuleSettings,
          prerequisiteRules,
          detailedConstraintRules
        })
      ),
      templateFileNames.validationRules
    );
  }

  async function handleFilesSelected(files: File[]) {
    const file = files[0];
    if (!file) {
      return;
    }

    const confirmed = window.confirm(
      "검증 규칙 설정, 위계 규칙, 세부 제약 목록을 선택한 템플릿 파일 내용으로 교체합니다. 계속할까요?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const workbook = await readWorkbookFromFile(file);
      const result = parseValidationRulesTemplateWorkbook(
        workbook,
        validationRuleSettings
      );

      setValidationRuleSettings(result.validationRuleSettings);
      setPrerequisiteRules(result.prerequisiteRules);
      setDetailedConstraintRules(result.detailedConstraintRules);
      clearDerivedValidationState();
      window.alert(
        `검증 설정 ${result.validationRuleSettings.length.toLocaleString()}건, 위계 규칙 ${result.prerequisiteRules.length.toLocaleString()}건, 세부 제약 ${result.detailedConstraintRules.length.toLocaleString()}건을 가져왔습니다.`
      );
    } catch (error) {
      window.alert(
        error instanceof Error
          ? error.message
          : "검증 규칙 템플릿을 읽지 못했습니다."
      );
    }
  }

  return (
    <section className="page">
      <PageHeader
        title="검증 규칙 설정"
        description="점검 항목별 사용 여부, 전입/외부 이수 포함 여부, 기본 기준값을 관리합니다."
      />
      <div className="template-action-bar">
        <UploadImportLauncher
          allowMultipleFiles={false}
          fileDescription="템플릿 파일 업로드가 가능합니다."
          onFilesSelected={handleFilesSelected}
          section="validationRules"
        />
        <Button
          icon={<Download size={16} />}
          onClick={handleDownloadValidationRulesTemplate}
          variant="secondary"
        >
          템플릿 다운로드
        </Button>
      </div>
      <ValidationRuleSettingsForm
        onCriteriaChange={updateRuleCriteria}
        onEnabledChange={updateRuleEnabled}
        onIncludeExternalInputsChange={updateRuleIncludeExternalInputs}
        onRestoreDefaults={restoreDefaultValidationRuleSettings}
        settings={validationRuleSettings}
      />
      <div className="section">
        <div className="section-heading-row section-heading-row--with-controls">
          <h2>위계 규칙 검토</h2>
          <div className="section-heading-actions">
            {prerequisiteRuleSetting ? (
              <div className="rule-row__controls">
                <label>
                  <input
                    checked={prerequisiteValidationEnabled}
                    onChange={(event) =>
                      updateRuleEnabled("prerequisites", event.target.checked)
                    }
                    type="checkbox"
                  />
                  <span>사용</span>
                </label>
              </div>
            ) : null}
            <button
              className="button button--secondary"
              disabled={!prerequisiteValidationEnabled}
              onClick={() => generateCandidatesFromOperatingSubjects(operatingSubjects)}
              type="button"
            >
              운영과목에서 후보 생성
            </button>
          </div>
        </div>
        <PrerequisiteRuleReviewTable
          disabled={!prerequisiteValidationEnabled}
          onAddRule={(rule) => setPrerequisiteRules([...prerequisiteRules, rule])}
          onRemoveRule={removePrerequisiteRule}
          onUpdateRule={updatePrerequisiteRule}
          operatingSubjects={operatingSubjects}
          rules={prerequisiteRules}
        />
      </div>
      <div className="section">
        <div className="section-heading-row section-heading-row--with-controls">
          <h2>세부 제약</h2>
          <div className="section-heading-actions">
            {detailedConstraintRuleSetting ? (
              <div className="rule-row__controls">
                <label>
                  <input
                    checked={detailedConstraintValidationEnabled}
                    onChange={(event) =>
                      updateRuleEnabled(
                        "detailedConstraints",
                        event.target.checked
                      )
                    }
                    type="checkbox"
                  />
                  <span>사용</span>
                </label>
              </div>
            ) : null}
          </div>
        </div>
        <DetailedConstraintRuleTable
          disabled={!detailedConstraintValidationEnabled}
          onAddRule={(rule) =>
            setDetailedConstraintRules([...detailedConstraintRules, rule])
          }
          onRemoveRule={removeDetailedConstraintRule}
          onUpdateRule={updateDetailedConstraintRule}
          operatingSubjects={operatingSubjects}
          rules={detailedConstraintRules}
        />
      </div>
    </section>
  );
}
