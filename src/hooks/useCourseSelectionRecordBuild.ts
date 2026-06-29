import { useMemo } from "react";
import { useCourseSelectionRawStore } from "../state/courseSelectionRawStore";
import { useExternalCourseInputStore } from "../state/externalCourseInputStore";
import { useOperatingSubjectStore } from "../state/operatingSubjectStore";
import {
  buildCourseSelectionRecords,
  type BuildCourseSelectionRecordsResult
} from "../validation/buildCourseSelectionRecords";

export function useCourseSelectionRecordBuild(): BuildCourseSelectionRecordsResult {
  const { courseSelectionRows } = useCourseSelectionRawStore();
  const { externalCourseInputs } = useExternalCourseInputStore();
  const { operatingSubjects } = useOperatingSubjectStore();

  return useMemo(
    () =>
      buildCourseSelectionRecords({
        mode: "full",
        courseSelectionRows,
        externalCourseInputs,
        operatingSubjects
      }),
    [courseSelectionRows, externalCourseInputs, operatingSubjects]
  );
}
