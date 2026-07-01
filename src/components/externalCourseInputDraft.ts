import type { ExternalCourseInputDraft } from "../state/externalCourseInputStore";
import type { Semester } from "../types/semester";

export function defaultExternalCourseTarget(
  missingSemesters: readonly Semester[]
): Semester {
  return missingSemesters[0] ?? { grade: 1, semester: 1 };
}

export function createEmptyExternalCourseDraft(
  missingSemesters: readonly Semester[]
): ExternalCourseInputDraft {
  return {
    target: defaultExternalCourseTarget(missingSemesters),
    subjectName: "",
    subjectGroup: "",
    selectionType: "",
    groupType: "",
    credits: "",
    sourceType: "transfer",
    sourceName: "",
    memo: ""
  };
}

export function hasExternalCourseDraftValue(
  draft: ExternalCourseInputDraft
): boolean {
  return Boolean(
    draft.subjectName.trim() ||
      String(draft.credits ?? "").trim() ||
      draft.subjectGroup ||
      draft.selectionType ||
      draft.groupType ||
      draft.sourceName?.trim() ||
      draft.memo?.trim()
  );
}
