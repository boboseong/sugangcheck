import { describe, expect, it } from "vitest";
import { allProjectTransferSections } from "../state/projectTransfer";
import { createEmptyProjectState } from "../state/projectWorkspace";
import { createProjectFile } from "./projectFileExport";
import {
  createProjectTransferPackageBlob,
  readProjectTransferFile
} from "./projectTransferPackage";

const savedAt = "2026-07-10T00:00:00.000Z";

describe("project transfer validation revisions", () => {
  it("preserves a stale revision pair with included validation results", async () => {
    const state = createEmptyProjectState("revision transfer", savedAt);

    state.inputRevision = 5;
    state.resultRevision = 4;
    state.lastValidationResult = {
      errors: [],
      executedRuleIds: [],
      skippedRuleIds: [],
      durationMs: 1
    };
    const projectFile = createProjectFile({
      appVersion: "0.1.10",
      projectName: state.projectName,
      state,
      savedAt
    });
    const blob = await createProjectTransferPackageBlob({
      projectFile,
      selectedSections: allProjectTransferSections,
      includesValidationResults: true
    });
    const result = await readProjectTransferFile(
      new File([blob], "revision.sugangcheck.zip", {
        type: "application/zip"
      })
    );

    expect(result.projectFile.data.inputRevision).toBe(5);
    expect(result.projectFile.data.resultRevision).toBe(4);
    expect(result.projectFile.data.lastValidationResult).toBeDefined();
  });
});
