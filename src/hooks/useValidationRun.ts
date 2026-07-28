import { useMemo, useRef, useState } from "react";
import { useCourseSelectionRawStore } from "../state/courseSelectionRawStore";
import { useDetailedConstraintRuleStore } from "../state/detailedConstraintRuleStore";
import { useExternalCourseInputStore } from "../state/externalCourseInputStore";
import { useImportStatusStore } from "../state/importStatusStore";
import { useNormalizedCourseSelectionStore } from "../state/normalizedCourseSelectionStore";
import { useOperatingSubjectStore } from "../state/operatingSubjectStore";
import { usePrerequisiteRuleStore } from "../state/prerequisiteRuleStore";
import { useStudentSemesterPresenceStore } from "../state/studentSemesterPresenceStore";
import { useValidationResultStore } from "../state/validationResultStore";
import { useValidationRevisionStore } from "../state/validationRevisionStore";
import { useValidationRuleSettingStore } from "../state/validationRuleSettingStore";
import { buildCourseSelectionRecords } from "../validation/buildCourseSelectionRecords";
import { checkDataPreparationStatus } from "../validation/checkDataPreparationStatus";
import { validationRunConfirmationMessage } from "../validation/dataPreparationIssues";
import { runValidationInWorker } from "../workers/runValidationInWorker";

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
  const [isValidating, setIsValidating] = useState(false);
  const runningRef = useRef(false);
  // This walks every course selection row against the operating subjects, so it
  // is kept off the render path and recomputed only when its inputs change.
  const dataPreparationStatus = useMemo(
    () =>
      checkDataPreparationStatus({
        importStatuses,
        studentSemesterPresence,
        operatingSubjects,
        courseSelectionRows,
        externalCourseInputs,
        prerequisiteRules,
        validationRuleSettings
      }),
    [
      importStatuses,
      studentSemesterPresence,
      operatingSubjects,
      courseSelectionRows,
      externalCourseInputs,
      prerequisiteRules,
      validationRuleSettings
    ]
  );
  const canRunValidation =
    dataPreparationStatus.canRunFullValidation ||
    dataPreparationStatus.canRunPartialValidation;
  const confirmationMessage = validationRunConfirmationMessage(dataPreparationStatus);

  async function runValidation() {
    // The run is asynchronous now, so a second click while one is in flight
    // would post a duplicate job and race on the stored result.
    if (!canRunValidation || runningRef.current) {
      return undefined;
    }

    runningRef.current = true;
    setIsValidating(true);

    try {
      const mode = dataPreparationStatus.canRunFullValidation ? "full" : "partial";
      // Captured before the await: if inputs change mid-run the stored revision
      // no longer matches and the result is correctly shown as stale.
      const inputRevision = useValidationRevisionStore.getState().inputRevision;
      const buildResult = buildCourseSelectionRecords({
        mode,
        availablePartialSemesters:
          mode === "partial"
            ? dataPreparationStatus.availablePartialSemesters
            : undefined,
        courseSelectionRows,
        externalCourseInputs,
        operatingSubjects
      });
      const validationResult = await runValidationInWorker({
        mode,
        records: buildResult.records,
        ruleSettings: validationRuleSettings,
        detailedConstraintRules,
        operatingSubjects,
        prerequisiteRules
      });

      setBuildResult(buildResult, inputRevision);
      setValidationResult(validationResult, inputRevision);

      return { buildResult, validationResult };
    } finally {
      runningRef.current = false;
      setIsValidating(false);
    }
  }

  return {
    buildIssues,
    canRunValidation,
    confirmationMessage,
    courseSelectionRecords,
    dataPreparationStatus,
    isValidating,
    runValidation
  };
}
