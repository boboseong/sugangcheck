import { useCourseSelectionRawStore } from "../state/courseSelectionRawStore";
import { useDetailedConstraintRuleStore } from "../state/detailedConstraintRuleStore";
import { useExternalCourseInputStore } from "../state/externalCourseInputStore";
import { useImportStatusStore } from "../state/importStatusStore";
import { useNormalizedCourseSelectionStore } from "../state/normalizedCourseSelectionStore";
import { useOperatingSubjectStore } from "../state/operatingSubjectStore";
import { usePrerequisiteRuleStore } from "../state/prerequisiteRuleStore";
import { useStudentSemesterPresenceStore } from "../state/studentSemesterPresenceStore";
import { useValidationResultStore } from "../state/validationResultStore";
import { useValidationRuleSettingStore } from "../state/validationRuleSettingStore";
import { buildCourseSelectionRecords } from "../validation/buildCourseSelectionRecords";
import { checkDataPreparationStatus } from "../validation/checkDataPreparationStatus";
import { hasUnregisteredOperatingSubjectIssue } from "../validation/dataPreparationIssues";
import {
  createDefaultValidationRuleFunctionMap,
  runValidationEngine
} from "../validation/validationEngine";

export function useValidationRun() {
  const { courseSelectionRows } = useCourseSelectionRawStore();
  const { detailedConstraintRules } = useDetailedConstraintRuleStore();
  const { externalCourseInputs } = useExternalCourseInputStore();
  const { importStatuses } = useImportStatusStore();
  const { operatingSubjects } = useOperatingSubjectStore();
  const { prerequisiteRules } = usePrerequisiteRuleStore();
  const { studentSemesterPresence } = useStudentSemesterPresenceStore();
  const { validationRuleSettings } = useValidationRuleSettingStore();
  const { buildIssues, courseSelectionRecords, setBuildResult } =
    useNormalizedCourseSelectionStore();
  const { setValidationResult } = useValidationResultStore();
  const dataPreparationStatus = checkDataPreparationStatus({
    importStatuses,
    studentSemesterPresence,
    operatingSubjects,
    courseSelectionRows,
    externalCourseInputs,
    prerequisiteRules,
    validationRuleSettings
  });

  function runValidation() {
    const buildResult = buildCourseSelectionRecords({
      mode: "full",
      courseSelectionRows,
      externalCourseInputs,
      operatingSubjects
    });
    const validationResult = runValidationEngine(
      {
        mode: "full",
        records: buildResult.records,
        ruleSettings: validationRuleSettings
      },
      createDefaultValidationRuleFunctionMap({
        detailedConstraintRules,
        operatingSubjects,
        prerequisiteRules
      })
    );

    setBuildResult(buildResult);
    setValidationResult(validationResult);

    return { buildResult, validationResult };
  }

  return {
    buildIssues,
    canRunValidation: dataPreparationStatus.canRunFullValidation,
    courseSelectionRecords,
    dataPreparationStatus,
    hasOperatingSubjectRegistrationIssue:
      hasUnregisteredOperatingSubjectIssue(dataPreparationStatus),
    runValidation
  };
}
