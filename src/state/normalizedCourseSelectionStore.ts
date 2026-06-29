import { create } from "zustand";
import type { CourseSelectionRecord } from "../types/courseSelection";
import type {
  BuildCourseSelectionRecordsResult
} from "../validation/buildCourseSelectionRecords";

type NormalizedCourseSelectionStore = {
  courseSelectionRecords: CourseSelectionRecord[];
  buildIssues: BuildCourseSelectionRecordsResult["issues"];
  setBuildResult: (result: BuildCourseSelectionRecordsResult) => void;
  clearCourseSelectionRecords: () => void;
};

export const useNormalizedCourseSelectionStore =
  create<NormalizedCourseSelectionStore>((set) => ({
    courseSelectionRecords: [],
    buildIssues: [],
    setBuildResult: (result) =>
      set({
        courseSelectionRecords: result.records,
        buildIssues: result.issues
      }),
    clearCourseSelectionRecords: () =>
      set({ courseSelectionRecords: [], buildIssues: [] })
  }));
