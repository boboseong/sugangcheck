import type { ExternalCourseInputDraft } from "../state/externalCourseInputStore";
import { defaultExternalCourseChoiceGroup } from "../types/courseSelection";
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
    choiceGroup: defaultExternalCourseChoiceGroup,
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
      (draft.choiceGroup && draft.choiceGroup !== defaultExternalCourseChoiceGroup) ||
      String(draft.credits ?? "").trim() ||
      draft.subjectGroup ||
      draft.selectionType ||
      draft.groupType ||
      draft.sourceName?.trim() ||
      draft.memo?.trim()
  );
}
