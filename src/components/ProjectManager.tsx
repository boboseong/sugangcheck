import {
  Copy,
  Download,
  FilePlus2,
  Pencil,
  RotateCcw,
  Trash2,
  Upload,
  X
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
  allProjectTransferSections,
  createProjectTransferState,
  hasAllProjectTransferSections,
  projectTransferSections,
  shouldIncludeValidationResultsInTransfer,
  type ProjectTransferSection
} from "../state/projectTransfer";
import { createProjectFile } from "../storage/projectFileExport";
import {
  createProjectTransferPackageBlob,
  projectTransferPackageFileName,
  readProjectTransferFile
} from "../storage/projectTransferPackage";
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
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [selectedExportSections, setSelectedExportSections] = useState<
    ProjectTransferSection[]
  >([...allProjectTransferSections]);
  const [includeValidationResults, setIncludeValidationResults] = useState(true);
  const importFileInputRef = useRef<HTMLInputElement>(null);
  const allExportSectionsSelected = hasAllProjectTransferSections(
    selectedExportSections
  );

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

  function setExportSections(nextSections: ProjectTransferSection[]) {
    setSelectedExportSections(nextSections);
    setIncludeValidationResults(hasAllProjectTransferSections(nextSections));
  }

  function handleToggleExportSection(
    section: ProjectTransferSection,
    checked: boolean
  ) {
    const nextSections = checked
      ? [...new Set([...selectedExportSections, section])]
      : selectedExportSections.filter((selectedSection) => selectedSection !== section);

    setExportSections(nextSections);
  }

  function handleToggleAllExportSections(checked: boolean) {
    setExportSections(checked ? [...allProjectTransferSections] : []);
  }

  function handleOpenExportDialog() {
    setExportSections([...allProjectTransferSections]);
    setExportDialogOpen(true);
  }

  function handleExportProject() {
    if (selectedExportSections.length === 0) {
      window.alert("내보낼 항목을 하나 이상 선택해 주세요.");
      return;
    }

    void runProjectAction(async () => {
      const savedAt = new Date();
      const savedAtText = savedAt.toISOString();
      const sourceState = collectProjectState(savedAtText);
      const includesValidationResults = shouldIncludeValidationResultsInTransfer({
        sections: selectedExportSections,
        includeValidationResults,
        savedAt: savedAtText
      });
      const transferState = createProjectTransferState(sourceState, {
        sections: selectedExportSections,
        includeValidationResults,
        savedAt: savedAtText
      });
      const projectFile = createProjectFile({
        appVersion,
        projectName: sourceState.projectName,
        state: transferState,
        savedAt: savedAtText
      });
      const blob = await createProjectTransferPackageBlob({
        projectFile,
        selectedSections: selectedExportSections,
        includesValidationResults
      });

      downloadBlob(
        blob,
        projectTransferPackageFileName(sourceState.projectName, savedAt)
      );
      setExportDialogOpen(false);
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
      const { projectFile } = await readProjectTransferFile(file);
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
      "현재 프로젝트의 업로드 자료, 입력값, 검증 결과를 초기화합니다. 다른 프로젝트는 유지됩니다. 계속할까요?"
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
        accept=".sugangcheck.zip,.zip,.sugangcheck.json,.json,application/json,application/zip"
        className="visually-hidden"
        onChange={handleImportProjectFile}
        type="file"
      />
      <IconButton
        disabled={busy || !activeProjectId}
        icon={<Download size={18} />}
        label="프로젝트 내보내기"
        onClick={handleOpenExportDialog}
      />
      <IconButton
        disabled={busy}
        icon={<Upload size={18} />}
        label="프로젝트 불러오기"
        onClick={handleOpenImportFilePicker}
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
      {exportDialogOpen ? (
        <div className="project-transfer-modal" role="presentation">
          <div
            aria-labelledby="project-transfer-title"
            aria-modal="true"
            className="project-transfer-dialog"
            role="dialog"
          >
            <div className="project-transfer-dialog__header">
              <h2 id="project-transfer-title">프로젝트 내보내기</h2>
              <IconButton
                disabled={busy}
                icon={<X size={18} />}
                label="내보내기 창 닫기"
                onClick={() => setExportDialogOpen(false)}
              />
            </div>
            <p className="project-transfer-dialog__warning">
              선택한 항목에는 학생 이름, 학번 등 개인정보가 포함될 수 있습니다.
            </p>
            <fieldset className="project-transfer-dialog__fieldset">
              <legend>내보낼 항목</legend>
              <label className="project-transfer-option project-transfer-option--all">
                <input
                  checked={allExportSectionsSelected}
                  disabled={busy}
                  onChange={(event) =>
                    handleToggleAllExportSections(event.target.checked)
                  }
                  type="checkbox"
                />
                <span>전체 데이터</span>
              </label>
              <div className="project-transfer-dialog__options">
                {projectTransferSections.map((section) => (
                  <label className="project-transfer-option" key={section.id}>
                    <input
                      checked={selectedExportSections.includes(section.id)}
                      disabled={busy}
                      onChange={(event) =>
                        handleToggleExportSection(section.id, event.target.checked)
                      }
                      type="checkbox"
                    />
                    <span>{section.label}</span>
                  </label>
                ))}
              </div>
              <label
                className={[
                  "project-transfer-option",
                  !allExportSectionsSelected ? "project-transfer-option--disabled" : ""
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <input
                  checked={allExportSectionsSelected && includeValidationResults}
                  disabled={busy || !allExportSectionsSelected}
                  onChange={(event) =>
                    setIncludeValidationResults(event.target.checked)
                  }
                  type="checkbox"
                />
                <span>검증 결과</span>
              </label>
              <p className="project-transfer-dialog__note">
                선택한 항목은 각각 xlsx 파일로 변환되어 zip 안에 저장됩니다.
                검증 결과는 전체 데이터를 내보낼 때에만 포함됩니다.
              </p>
            </fieldset>
            <div className="project-transfer-dialog__actions">
              <Button
                disabled={busy}
                onClick={() => setExportDialogOpen(false)}
                variant="secondary"
              >
                취소
              </Button>
              <Button
                disabled={busy || selectedExportSections.length === 0}
                icon={<Download size={16} />}
                onClick={handleExportProject}
              >
                xlsx zip 내보내기
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
