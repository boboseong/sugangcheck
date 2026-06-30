import { utils } from "xlsx";
import { describe, expect, it } from "vitest";
import { defaultValidationRuleSettings } from "../data/defaultValidationRules";
import { getSemesterCreditSubjectCriteria } from "../validation/semesterCreditSubjectCriteria";
import {
  createValidationRulesTemplateWorkbook,
  parseValidationRulesTemplateWorkbook
} from "./xlsxTemplates";

describe("validation rules template workbook", () => {
  it("round-trips semester credit and subject-count allowed values", () => {
    const workbook = createValidationRulesTemplateWorkbook({
      validationRuleSettings: structuredClone(defaultValidationRuleSettings),
      prerequisiteRules: [],
      detailedConstraintRules: []
    });
    const settingsSheet = workbook.Sheets["점검설정"]!;
    const rows = utils.sheet_to_json<unknown[]>(settingsSheet, {
      header: 1,
      defval: ""
    });
    const header = rows[0]!;
    const creditRowIndex = rows.findIndex((row) => row[0] === "creditDifference");
    const creditColumnIndex = header.indexOf("1학년 1학기 학점 허용값");
    const subjectColumnIndex = header.indexOf("1학년 1학기 과목 수 허용값");

    rows[creditRowIndex]![creditColumnIndex] = "30, 31";
    rows[creditRowIndex]![subjectColumnIndex] = "8, 9";
    workbook.Sheets["점검설정"] = utils.aoa_to_sheet(rows);

    const parsed = parseValidationRulesTemplateWorkbook(
      workbook,
      defaultValidationRuleSettings
    );
    const creditDifference = parsed.validationRuleSettings.find(
      (setting) => setting.id === "creditDifference"
    )!;
    const criteria = getSemesterCreditSubjectCriteria(creditDifference.criteria);

    expect(criteria[0]).toMatchObject({
      allowedCredits: [30, 31],
      allowedSubjectCounts: [8, 9]
    });
  });
});
