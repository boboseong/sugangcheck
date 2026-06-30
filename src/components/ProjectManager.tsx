import {
  Copy,
  Database,
  Download,
  FilePlus2,
  Pencil,
  RotateCcw,
  Trash2,
  Upload
} from "lucide-react";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import {
  clearAllProjectRecords,
  cloneProjectRecord,
  createProjectRecord,
  listProjectRecords,
  loadProjectRecord,
  setActiveProjectId,
  type StoredProjectSummary
} from "../storage/indexedDbStorage";
import { IconButton } from "./ui/IconButton";
import { Button } from "./ui/Button";
import { appVersion, useProjectMetaStore } from "../state/projectMetaStore";
import {
  applyProjectState,
  collectProjectState,
  createEmptyProjectState,
  saveCurrentProjectSnapshot
} from "../state/projectWorkspace";
import {
  createProjectFile,
  createProjectFileBlob,
  projectFileName
} from "../storage/projectFileExport";
import {
  readProjectTransferFile
} from "../storage/projectTransferPackage";
import {
  createProjectTemplatePackageBlob,
  projectTemplatePackageFileName
} from "../storage/projectTemplatePackage";
import { downloadBlob } from "../utils/downloadBlob";

function projectNameFromPrompt(message: string, defaultValue: string) {
  const value = window.prompt(message, defaultValue);
  const trimmed = value?.trim();

  return trimmed || undefined;
}

export function ProjectManager() {
  const { activeProjectId, projectName, setProjectName } = useProjectMetaStore();
  const [projects, setProjects] = useState<StoredProjectSummary[]>([]);
  const [busy, setBusy] = useState(false);
  const importFileInputRef = useRef<HTMLInputElement>(null);

  async function refreshProjects() {
    setProjects(await listProjectRecords());
  }

  async function activateProject(projectId: string) {
    const record = await loadProjectRecord(projectId);

    if (!record) {
      window.alert("프로젝트를 찾지 못했습니다.");
      await refreshProjects();
      return;
    }

    setActiveProjectId(record.id);
    applyProjectState(record.data.data, {
      activeProjectId: record.id,
      savedAt: record.savedAt
    });
  }

  async function runProjectAction(action: () => Promise<void>) {
    setBusy(true);

    try {
      await action();
      await refreshProjects();
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "프로젝트 작업에 실패했습니다.");
    } finally {
      setBusy(false);
    }
  }

  function handleDownloadTemplatePackage() {
    void runProjectAction(async () => {
      const savedAt = new Date();
      const savedAtText = savedAt.toISOString();
      const sourceState = collectProjectState(savedAtText);
      const projectFile = createProjectFile({
        appVersion,
        projectName: sourceState.projectName,
        state: sourceState,
        savedAt: savedAtText
      });

      await downloadBlob(
        await createProjectTemplatePackageBlob({ projectFile }),
        projectTemplatePackageFileName(sourceState.projectName, savedAt)
      );
    });
  }

  function handleDownloadRawData() {
    void runProjectAction(async () => {
      const savedAt = new Date();
      const savedAtText = savedAt.toISOString();
      const sourceState = collectProjectState(savedAtText);
      const projectFile = createProjectFile({
        appVersion,
        projectName: sourceState.projectName,
        state: sourceState,
        savedAt: savedAtText
      });

      await downloadBlob(
        createProjectFileBlob(projectFile),
        projectFileName(sourceState.projectName, savedAt)
      );
    });
  }

  function handleOpenImportFilePicker() {
    importFileInputRef.current?.click();
  }

  function handleImportProjectFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];

    event.currentTarget.value = "";

    if (!file) {
      return;
    }

    const confirmed = window.confirm(
      "선택한 파일을 새 프로젝트로 추가하고 현재 프로젝트로 전환합니다. 계속할까요?"
    );

    if (!confirmed) {
      return;
    }

    void runProjectAction(async () => {
      await saveCurrentProjectSnapshot();
      const result = await readProjectTransferFile(file);
      const { projectFile } = result;
      const record = await createProjectRecord({
        appVersion,
        projectName: projectFile.projectName,
        state: projectFile.data
      });

      setActiveProjectId(record.id);
      applyProjectState(record.data.data, {
        activeProjectId: record.id,
        savedAt: record.savedAt
      });

      if (result.importKind === "templatePackage") {
        if (result.autoValidationRan) {
          window.alert(
            `템플릿 데이터를 가져오고 점검을 자동 실행했습니다. 오류 ${projectFile.data.validationErrors.length.toLocaleString()}건이 결과에 반영되었습니다.`
          );
        } else {
          const issues =
            result.dataPreparationStatus?.issues
              .slice(0, 5)
              .map((issue) => `- ${issue.message}`)
              .join("\n") || "- 점검 실행 조건을 만족하지 못했습니다.";

          window.alert(
            `템플릿 데이터를 가져왔지만 자동 점검은 실행하지 못했습니다.\n${issues}`
          );
        }
      }
    });
  }

  useEffect(() => {
    refreshProjects().catch((error) => {
      console.error("프로젝트 목록을 불러오지 못했습니다.", error);
    });
  }, [activeProjectId]);

  function handleSwitchProject(nextProjectId: string) {
    if (!nextProjectId || nextProjectId === activeProjectId) {
      return;
    }

    void runProjectAction(async () => {
      await saveCurrentProjectSnapshot();
      await activateProject(nextProjectId);
    });
  }

  function handleCreateProject() {
    const nextName = projectNameFromPrompt("새 프로젝트 이름", "2025학년도 입학생");

    if (!nextName) {
      return;
    }

    void runProjectAction(async () => {
      await saveCurrentProjectSnapshot();
      const state = createEmptyProjectState(nextName);
      const record = await createProjectRecord({
        appVersion,
        projectName: nextName,
        state
      });

      setActiveProjectId(record.id);
      applyProjectState(record.data.data, {
        activeProjectId: record.id,
        savedAt: record.savedAt
      });
    });
  }

  function handleCloneProject() {
    if (!activeProjectId) {
      return;
    }

    const nextName = projectNameFromPrompt(
      "복제할 새 프로젝트 이름",
      `${projectName} 복사본`
    );

    if (!nextName) {
      return;
    }

    void runProjectAction(async () => {
      await saveCurrentProjectSnapshot();
      const record = await cloneProjectRecord(activeProjectId, nextName);

      setActiveProjectId(record.id);
      applyProjectState(record.data.data, {
        activeProjectId: record.id,
        savedAt: record.savedAt
      });
    });
  }

  function handleRenameProject() {
    const nextName = projectNameFromPrompt("프로젝트 이름 변경", projectName);

    if (!nextName || nextName === projectName) {
      return;
    }

    void runProjectAction(async () => {
      setProjectName(nextName);
      await saveCurrentProjectSnapshot();
    });
  }

  function handleResetCurrentProject() {
    if (!activeProjectId) {
      return;
    }

    const confirmed = window.confirm(
      "현재 프로젝트의 업로드 자료, 입력값, 점검 결과를 초기화합니다. 다른 프로젝트는 유지됩니다. 계속할까요?"
    );

    if (!confirmed) {
      return;
    }

    void runProjectAction(async () => {
      const state = createEmptyProjectState(projectName);

      applyProjectState(state, {
        activeProjectId,
        savedAt: state.updatedAt
      });
      await saveCurrentProjectSnapshot();
    });
  }

  function handleClearAllProjects() {
    const confirmed = window.confirm(
      "브라우저에 저장된 모든 프로젝트를 삭제합니다. 이 작업은 되돌릴 수 없습니다. 계속할까요?"
    );

    if (!confirmed) {
      return;
    }

    void runProjectAction(async () => {
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
    });
  }

  return (
    <div className="project-manager" aria-label="프로젝트 관리">
      <label className="project-manager__select">
        <span className="visually-hidden">현재 프로젝트 선택</span>
        <select
          disabled={busy || projects.length === 0}
          onChange={(event) => handleSwitchProject(event.target.value)}
          value={activeProjectId ?? ""}
        >
          {projects.length === 0 ? (
            <option value="">프로젝트 없음</option>
          ) : (
            projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.projectName}
              </option>
            ))
          )}
        </select>
      </label>
      <input
        ref={importFileInputRef}
        accept=".zip,.sugangcheck.zip,.sugangcheck.json,.json,application/json,application/zip"
        className="visually-hidden"
        onChange={handleImportProjectFile}
        type="file"
      />
      <Button
        disabled={busy || !activeProjectId}
        icon={<Download size={16} />}
        onClick={handleDownloadTemplatePackage}
        variant="secondary"
      >
        점검자료 다운로드
      </Button>
      <IconButton
        disabled={busy}
        icon={<Upload size={18} />}
        label="프로젝트 불러오기"
        onClick={handleOpenImportFilePicker}
      />
      <IconButton
        disabled={busy || !activeProjectId}
        icon={<Database size={18} />}
        label="RawData 다운로드"
        onClick={handleDownloadRawData}
      />
      <IconButton
        disabled={busy}
        icon={<FilePlus2 size={18} />}
        label="새 프로젝트"
        onClick={handleCreateProject}
      />
      <IconButton
        disabled={busy || !activeProjectId}
        icon={<Copy size={18} />}
        label="현재 프로젝트 복제"
        onClick={handleCloneProject}
      />
      <IconButton
        disabled={busy || !activeProjectId}
        icon={<Pencil size={18} />}
        label="프로젝트 이름 변경"
        onClick={handleRenameProject}
      />
      <IconButton
        disabled={busy || !activeProjectId}
        icon={<RotateCcw size={18} />}
        label="현재 프로젝트 초기화"
        onClick={handleResetCurrentProject}
      />
      <IconButton
        disabled={busy}
        icon={<Trash2 size={18} />}
        label="모든 프로젝트 삭제"
        onClick={handleClearAllProjects}
      />
    </div>
  );
}
