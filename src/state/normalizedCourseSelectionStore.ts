import { create } from "zustand";
import type { CourseSelectionRecord } from "../types/courseSelection";
import type {
  BuildCourseSelectionRecordsResult
} from "../validation/buildCourseSelectionRecords";

type NormalizedCourseSelectionStore = {
  courseSelectionRecords: CourseSelectionRecord[];
  buildIssues: BuildCourseSelectionRecordsResult["issues"];
  recordsRevision?: number;
  setBuildResult: (
    result: BuildCourseSelectionRecordsResult,
    revision: number
  ) => void;
  clearCourseSelectionRecords: () => void;
};

export const useNormalizedCourseSelectionStore =
  create<NormalizedCourseSelectionStore>((set) => ({
    courseSelectionRecords: [],
    buildIssues: [],
    setBuildResult: (result, recordsRevision) =>
      set({
        courseSelectionRecords: result.records,
        buildIssues: result.issues,
        recordsRevision
      }),
    clearCourseSelectionRecords: () =>
      set({
        courseSelectionRecords: [],
        buildIssues: [],
        recordsRevision: undefined
      })
  }));
