import { describe, expect, it } from "vitest";
import {
  createEmptyExternalCourseDraft,
  hasExternalCourseDraftValue
} from "./externalCourseInputDraft";

describe("external course input drafts", () => {
  it("defaults choice group to 기타 without treating an empty draft as filled", () => {
    const draft = createEmptyExternalCourseDraft([{ grade: 2, semester: 1 }]);

    expect(draft).toMatchObject({
      target: { grade: 2, semester: 1 },
      choiceGroup: "기타"
    });
    expect(hasExternalCourseDraftValue(draft)).toBe(false);
  });

  it("treats a non-default choice group as entered draft data", () => {
    const draft = {
      ...createEmptyExternalCourseDraft([]),
      choiceGroup: "보충 선택군"
    };

    expect(hasExternalCourseDraftValue(draft)).toBe(true);
  });
});
