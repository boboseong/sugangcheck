import { act, cleanup, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { DetailedConstraintRule } from "../types/validation";

const projectWorkspaceMocks = vi.hoisted(() => ({
  initializeProjectWorkspace: vi.fn(() => Promise.resolve(undefined))
}));

vi.mock("../state/projectWorkspace", async (importOriginal) => {
  const actual = await importOriginal<
    typeof import("../state/projectWorkspace")
  >();

  return {
    ...actual,
    initializeProjectWorkspace:
      projectWorkspaceMocks.initializeProjectWorkspace
  };
});

import { db } from "../storage/indexedDbStorage";
import { useDetailedConstraintRuleStore } from "../state/detailedConstraintRuleStore";
import { useProjectMetaStore } from "../state/projectMetaStore";
import { runProjectHydration } from "../state/projectWorkspace";
import { ProjectPersistenceProvider } from "./ProjectPersistenceProvider";

const autosaveDelayMs = 450;
const savedAt = "2026-07-10T00:00:00.000Z";

function detailedConstraintRule(name: string): DetailedConstraintRule {
  return {
    id: "detail-1",
    type: "linkedSubject",
    name,
    status: "active",
    includeExternalInputsOverride: true,
    source: "manual",
    trigger: {
      target: { grade: 1, semester: 1 },
      subjectName: "공통국어Ⅰ",
      normalizedSubjectName: "공통국어 1"
    },
    required: {
      target: { grade: 1, semester: 2 },
      subjectName: "공통국어Ⅱ",
      normalizedSubjectName: "공통국어 2"
    },
    updatedAt: savedAt
  };
}

async function renderReadyProvider() {
  render(<ProjectPersistenceProvider />);

  await act(async () => {
    await Promise.resolve();
  });
}

function advanceAutosaveTimer(milliseconds: number) {
  act(() => {
    vi.advanceTimersByTime(milliseconds);
  });
}

function lastStoredDetailedConstraintRules() {
  const calls = vi.mocked(db.projects.put).mock.calls;
  const record = calls.at(-1)?.[0];

  return record?.data.data.detailedConstraintRules;
}

describe("ProjectPersistenceProvider detailed constraint autosave", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(savedAt));
    projectWorkspaceMocks.initializeProjectWorkspace.mockReset();
    projectWorkspaceMocks.initializeProjectWorkspace.mockResolvedValue(undefined);
    useDetailedConstraintRuleStore.setState({ detailedConstraintRules: [] });
    useProjectMetaStore.setState({
      activeProjectId: "project-current",
      createdAt: savedAt,
      projectName: "자동저장 테스트",
      savedAt,
      schemaVersion: 6
    });
    vi.spyOn(db.projects, "put").mockImplementation((record) =>
      Promise.resolve(record.id) as never
    );
  });

  afterEach(() => {
    cleanup();
    useDetailedConstraintRuleStore.setState({ detailedConstraintRules: [] });
    useProjectMetaStore.setState({ activeProjectId: undefined });
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("persists additions and deletions after the 450ms debounce", async () => {
    const rule = detailedConstraintRule("국어 연계 규칙");

    await renderReadyProvider();
    useDetailedConstraintRuleStore
      .getState()
      .setDetailedConstraintRules([rule]);

    advanceAutosaveTimer(autosaveDelayMs - 1);
    expect(db.projects.put).not.toHaveBeenCalled();

    advanceAutosaveTimer(1);
    expect(db.projects.put).toHaveBeenCalledTimes(1);
    expect(lastStoredDetailedConstraintRules()).toEqual([rule]);

    vi.mocked(db.projects.put).mockClear();
    useDetailedConstraintRuleStore
      .getState()
      .removeDetailedConstraintRule(rule.id);
    advanceAutosaveTimer(autosaveDelayMs);

    expect(db.projects.put).toHaveBeenCalledTimes(1);
    expect(lastStoredDetailedConstraintRules()).toEqual([]);
  });

  it("debounces rapid edits and stores only the final rule state", async () => {
    const rule = detailedConstraintRule("수정 전 규칙명");
    useDetailedConstraintRuleStore.setState({
      detailedConstraintRules: [rule]
    });

    await renderReadyProvider();
    useDetailedConstraintRuleStore
      .getState()
      .updateDetailedConstraintRule({ ...rule, name: "첫 번째 수정" });
    advanceAutosaveTimer(300);
    useDetailedConstraintRuleStore.getState().updateDetailedConstraintRule({
      ...rule,
      name: "최종 규칙명"
    });

    advanceAutosaveTimer(autosaveDelayMs - 1);
    expect(db.projects.put).not.toHaveBeenCalled();

    advanceAutosaveTimer(1);
    expect(db.projects.put).toHaveBeenCalledTimes(1);
    expect(lastStoredDetailedConstraintRules()).toMatchObject([
      { id: rule.id, name: "최종 규칙명" }
    ]);
  });

  it("does not autosave detailed constraints while hydrating a project", async () => {
    await renderReadyProvider();

    runProjectHydration(() => {
      useDetailedConstraintRuleStore
        .getState()
        .setDetailedConstraintRules([detailedConstraintRule("불러온 규칙")]);
    });
    advanceAutosaveTimer(autosaveDelayMs);

    expect(db.projects.put).not.toHaveBeenCalled();
  });
});
