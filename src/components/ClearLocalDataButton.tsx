import { RotateCcw, Trash2 } from "lucide-react";
import {
  clearAllProjectRecords,
  createProjectRecord,
  setActiveProjectId
} from "../storage/indexedDbStorage";
import { appVersion, useProjectMetaStore } from "../state/projectMetaStore";
import {
  applyProjectState,
  createEmptyProjectState,
  saveCurrentProjectSnapshot
} from "../state/projectWorkspace";
import { Button } from "./ui/Button";

export function ClearLocalDataButton() {
  const { activeProjectId, projectName } = useProjectMetaStore();

  async function handleResetCurrentProject() {
    if (!activeProjectId) {
      return;
    }

    const confirmed = window.confirm(
      "현재 프로젝트의 작업 데이터와 화면 상태를 초기화합니다. 다른 프로젝트는 유지됩니다. 계속할까요?"
    );

    if (!confirmed) {
      return;
    }

    const state = createEmptyProjectState(projectName);

    applyProjectState(state, {
      activeProjectId,
      savedAt: state.updatedAt
    });
    await saveCurrentProjectSnapshot();
  }

  async function handleClearAllProjects() {
    const confirmed = window.confirm(
      "브라우저에 저장된 모든 프로젝트를 삭제합니다. 이 작업은 되돌릴 수 없습니다. 계속할까요?"
    );

    if (!confirmed) {
      return;
    }

    await clearAllProjectRecords();

    const state = createEmptyProjectState();
    const record = await createProjectRecord({
      appVersion,
      projectName: state.projectName,
      state
    });

    setActiveProjectId(record.id);
    applyProjectState(record.data.data, {
      activeProjectId: record.id,
      savedAt: record.savedAt
    });
  }

  return (
    <div className="danger-action-row">
      <Button
        disabled={!activeProjectId}
        icon={<RotateCcw size={16} />}
        onClick={handleResetCurrentProject}
        variant="secondary"
      >
        현재 프로젝트 초기화
      </Button>
      <Button
        icon={<Trash2 size={16} />}
        onClick={handleClearAllProjects}
        variant="secondary"
      >
        모든 프로젝트 삭제
      </Button>
    </div>
  );
}
