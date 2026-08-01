import {
  Copy,
  Database,
  Download,
  FilePlus2,
  Pencil,
  RotateCcw,
  Settings2,
  Trash2,
  Upload,
  X
} from "lucide-react";
import { useEffect, useId, useRef, useState, type ChangeEvent } from "react";
import {
  assertProjectNameAvailable,
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
// projectTransferPackage and projectTemplatePackage pull in xlsx and jszip.
// ProjectManager renders inside AppLayout on every route, so these are loaded
// on demand from the handlers that need them rather than at module scope.
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
  const [menuOpen, setMenuOpen] = useState(false);
  const importFileInputRef = useRef<HTMLInputElement>(null);
  const menuId = useId();

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
      window.alert(error instanceof Error ? error.message : "프로젝트 처리 중 문제가 발생했습니다. 페이지를 새로고침한 뒤 다시 시도해 주세요.");
    } finally {
      setBusy(false);
    }
  }

  function handleDownloadTemplatePackage() {
    void runProjectAction(async () => {
      const { createProjectTemplatePackageBlob, projectTemplatePackageFileName } =
        await import("../storage/projectTemplatePackage");
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
      const { readProjectTransferFile } = await import(
        "../storage/projectTransferPackage"
      );
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
              .join("\n") || "- 점검을 실행하려면 운영과목과 수강신청 결과를 먼저 업로드해 주세요.";

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

  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen]);

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
    if (!activeProjectId) {
      return;
    }

    const nextName = projectNameFromPrompt("프로젝트 이름 변경", projectName);

    if (!nextName || nextName === projectName) {
      return;
    }

    void runProjectAction(async () => {
      await assertProjectNameAvailable(nextName, {
        excludingProjectId: activeProjectId
      });

      const previousName = projectName;
      setProjectName(nextName);

      try {
        await saveCurrentProjectSnapshot();
      } catch (error) {
        setProjectName(previousName);
        throw error;
      }
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

  // The topbar used to carry these as seven unlabelled 38px icons, which wrapped
  // onto three rows below ~1120px and put "초기화"/"전체 삭제" a slip away from
  // the routine actions. They live behind one labelled menu now.
  const projectMenuActions = [
    {
      label: "새 프로젝트",
      hint: "빈 프로젝트를 만들고 전환합니다.",
      icon: <FilePlus2 size={18} aria-hidden="true" />,
      disabled: busy,
      run: handleCreateProject
    },
    {
      label: "현재 프로젝트 복제",
      hint: "지금 자료를 그대로 복사해 새 이름으로 저장합니다.",
      icon: <Copy size={18} aria-hidden="true" />,
      disabled: busy || !activeProjectId,
      run: handleCloneProject
    },
    {
      label: "프로젝트 이름 변경",
      hint: `현재 이름: ${projectName}`,
      icon: <Pencil size={18} aria-hidden="true" />,
      disabled: busy || !activeProjectId,
      run: handleRenameProject
    },
    {
      label: "프로젝트 불러오기",
      hint: "저장해 둔 프로젝트 파일을 엽니다.",
      icon: <Upload size={18} aria-hidden="true" />,
      disabled: busy,
      run: handleOpenImportFilePicker
    },
    {
      label: "원본 데이터 다운로드",
      hint: "원천 자료를 엑셀로 내려받습니다.",
      icon: <Database size={18} aria-hidden="true" />,
      disabled: busy || !activeProjectId,
      run: handleDownloadRawData
    }
  ];
  const destructiveMenuActions = [
    {
      label: "현재 프로젝트 초기화",
      hint: "이 프로젝트의 업로드 자료와 점검 결과를 모두 지웁니다.",
      icon: <RotateCcw size={18} aria-hidden="true" />,
      disabled: busy || !activeProjectId,
      run: handleResetCurrentProject
    },
    {
      label: "모든 프로젝트 삭제",
      hint: "저장된 프로젝트를 전부 지웁니다.",
      icon: <Trash2 size={18} aria-hidden="true" />,
      disabled: busy,
      run: handleClearAllProjects
    }
  ];

  function runMenuAction(action: () => void) {
    setMenuOpen(false);
    action();
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
        aria-expanded={menuOpen}
        aria-haspopup="dialog"
        disabled={busy}
        icon={<Settings2 size={18} />}
        label="프로젝트 관리"
        onClick={() => setMenuOpen(true)}
      />
      {menuOpen ? (
        <div className="import-launcher-modal" role="presentation">
          <div
            aria-labelledby={`${menuId}-title`}
            aria-modal="true"
            className="import-launcher-dialog project-menu-dialog"
            role="dialog"
          >
            <div className="import-launcher-dialog__header">
              <h2 id={`${menuId}-title`}>프로젝트 관리</h2>
              <IconButton
                icon={<X size={16} />}
                label="닫기"
                onClick={() => setMenuOpen(false)}
              />
            </div>
            <div className="project-menu-group">
              {projectMenuActions.map((action) => (
                <button
                  className="project-menu-item"
                  disabled={action.disabled}
                  key={action.label}
                  onClick={() => runMenuAction(action.run)}
                  type="button"
                >
                  {action.icon}
                  <span>
                    <strong>{action.label}</strong>
                    <span className="project-menu-item__hint">{action.hint}</span>
                  </span>
                </button>
              ))}
            </div>
            <div className="project-menu-group project-menu-group--danger">
              <p className="project-menu-group__title">되돌릴 수 없는 작업</p>
              {destructiveMenuActions.map((action) => (
                <button
                  className="project-menu-item project-menu-item--danger"
                  disabled={action.disabled}
                  key={action.label}
                  onClick={() => runMenuAction(action.run)}
                  type="button"
                >
                  {action.icon}
                  <span>
                    <strong>{action.label}</strong>
                    <span className="project-menu-item__hint">{action.hint}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
