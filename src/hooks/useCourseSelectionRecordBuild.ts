import { useMemo } from "react";
import { useCourseSelectionRawStore } from "../state/courseSelectionRawStore";
import { useExternalCourseInputStore } from "../state/externalCourseInputStore";
import { useOperatingSubjectStore } from "../state/operatingSubjectStore";
import { useSubjectOverrideStore } from "../state/subjectOverrideStore";
import {
  buildCourseSelectionRecords,
  type BuildCourseSelectionRecordsResult
} from "../validation/buildCourseSelectionRecords";

export function useCourseSelectionRecordBuild(): BuildCourseSelectionRecordsResult {
  const { courseSelectionRows } = useCourseSelectionRawStore();
  const { externalCourseInputs } = useExternalCourseInputStore();
  const { operatingSubjects } = useOperatingSubjectStore();
  const { subjectOverrides } = useSubjectOverrideStore();

  return useMemo(
    () =>
      buildCourseSelectionRecords({
        mode: "full",
        courseSelectionRows,
        externalCourseInputs,
        operatingSubjects,
        subjectOverrides
      }),
    [courseSelectionRows, externalCourseInputs, operatingSubjects, subjectOverrides]
  );
}
