import type { ChangeEvent, ReactNode } from "react";
import { useEffect, useId, useRef, useState } from "react";
import { Download, Upload, X } from "lucide-react";
import {
  listProjectRecords,
  loadProjectRecord,
  type StoredProjectSummary
} from "../storage/indexedDbStorage";
import { useProjectMetaStore } from "../state/projectMetaStore";
import {
  importProjectSection,
  importProjectSectionSemester,
  saveCurrentProjectSnapshot,
  type ProjectImportSection,
  type SemesterProjectImportSection
} from "../state/projectWorkspace";
import type { Semester, SemesterKey } from "../types/semester";
import { semesterKeys } from "../types/semester";
import { parseSemesterKey, semesterLabel } from "../utils/semester";
import { Button } from "./ui/Button";
import { IconButton } from "./ui/IconButton";

type UploadImportLauncherProps = {
  accept?: string;
  allowMultipleFiles?: boolean;
  downloadGuide?: {
    title: string;
    items: string[];
  };
  fileUploadConfirmation?: {
    message: string;
    onConfirmedFileSelection: () => void;
    shouldConfirm: boolean;
  };
  fileDescription?: string;
  fileUploadLabel?: string;
  onFilesSelected: (files: File[], target?: Semester) => void | Promise<void>;
  section: ProjectImportSection;
  showProjectSemesterImport?: boolean;
  showUploadSemesterPicker?: boolean;
  triggerClassName?: string;
  triggerIcon?: ReactNode;
  triggerLabel?: string;
  triggerVariant?: "primary" | "secondary";
};

type FileUploadMode = "auto" | "semester";

const sectionLabels: Record<ProjectImportSection, string> = {
  operatingSubjects: "운영과목",
  validationRules: "점검 규칙",
  courseSelections: "수강신청 결과",
  externalCourses: "전입/외부 이수"
};

function isSemesterProjectImportSection(
  section: ProjectImportSection
): section is SemesterProjectImportSection {
  return section === "operatingSubjects" || section === "courseSelections";
}

function filesFromInput(event: ChangeEvent<HTMLInputElement>): File[] {
  return Array.from(event.target.files ?? []);
}

function selectedSemester(value: SemesterKey) {
  const semester = parseSemesterKey(value);

  if (!semester) {
    throw new Error("학기 값을 읽지 못했습니다.");
  }

  return semester;
}

export function UploadImportLauncher({
  accept = ".xls,.xlsx,.xlsm",
  allowMultipleFiles = true,
  downloadGuide,
  fileUploadConfirmation,
  fileDescription = "전체 학기 업로드에는 (신)수강신청, (구)수강신청, 템플릿 파일 업로드가 가능합니다.",
  fileUploadLabel,
  onFilesSelected,
  section,
  showProjectSemesterImport = isSemesterProjectImportSection(section),
  showUploadSemesterPicker = isSemesterProjectImportSection(section),
  triggerClassName,
  triggerIcon,
  triggerLabel = "업로드/불러오기",
  triggerVariant = "secondary"
}: UploadImportLauncherProps) {
  const id = useId();
  const autoFileInputRef = useRef<HTMLInputElement>(null);
  const confirmedFileUploadModeRef = useRef<FileUploadMode | undefined>(
    undefined
  );
  const semesterFileInputRef = useRef<HTMLInputElement>(null);
  const { activeProjectId } = useProjectMetaStore();
  const [busy, setBusy] = useState(false);
  const [open, setOpen] = useState(false);
  const [pendingFileUploadMode, setPendingFileUploadMode] =
    useState<FileUploadMode | undefined>(undefined);
  const [projects, setProjects] = useState<StoredProjectSummary[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [selectedProjectSemesterKey, setSelectedProjectSemesterKey] =
    useState<SemesterKey>("1-1");
  const [selectedUploadSemesterKey, setSelectedUploadSemesterKey] =
    useState<SemesterKey>("1-1");
  const sourceProjects = projects.filter((project) => project.id !== activeProjectId);
  const selectedProject = sourceProjects.find(
    (project) => project.id === selectedProjectId
  );
  const autoUploadLabel =
    fileUploadLabel ?? (showUploadSemesterPicker ? "전체 학기 업로드" : "템플릿 파일 업로드");
  const allProjectImportLabel = showProjectSemesterImport
    ? "전체 학기 불러오기"
    : "전체 불러오기";
  const shouldConfirmFileUpload =
    fileUploadConfirmation?.shouldConfirm ?? false;

  useEffect(() => {
    if (!open) {
      setPendingFileUploadMode(undefined);
      confirmedFileUploadModeRef.current = undefined;
      return;
    }

    let alive = true;

    listProjectRecords()
      .then((records) => {
        if (!alive) {
          return;
        }

        setProjects(records);
        setSelectedProjectId((current) => {
          if (
            current &&
            records.some(
              (project) => project.id === current && project.id !== activeProjectId
            )
          ) {
            return current;
          }

          return records.find((project) => project.id !== activeProjectId)?.id ?? "";
        });
      })
      .catch((error) => {
        console.error("프로젝트 목록을 불러오지 못했습니다.", error);
      });

    return () => {
      alive = false;
    };
  }, [activeProjectId, open]);

  function openFilePicker(mode: FileUploadMode) {
    if (mode === "auto") {
      autoFileInputRef.current?.click();
      return;
    }

    semesterFileInputRef.current?.click();
  }

  function requestFileUpload(mode: FileUploadMode) {
    if (shouldConfirmFileUpload) {
      setPendingFileUploadMode(mode);
      return;
    }

    setPendingFileUploadMode(undefined);
    openFilePicker(mode);
  }

  function continueConfirmedFileUpload() {
    if (!pendingFileUploadMode) {
      return;
    }

    confirmedFileUploadModeRef.current = pendingFileUploadMode;
    setPendingFileUploadMode(undefined);
    openFilePicker(pendingFileUploadMode);
  }

  function cancelConfirmedFileUpload() {
    confirmedFileUploadModeRef.current = undefined;
    setPendingFileUploadMode(undefined);
  }

  function clearAfterConfirmedFileSelection(mode: FileUploadMode) {
    const shouldClear =
      confirmedFileUploadModeRef.current === mode && shouldConfirmFileUpload;

    confirmedFileUploadModeRef.current = undefined;

    if (shouldClear) {
      fileUploadConfirmation?.onConfirmedFileSelection();
    }
  }

  async function handleAutoFileChange(event: ChangeEvent<HTMLInputElement>) {
    const files = filesFromInput(event);
    event.target.value = "";

    if (files.length === 0) {
      if (confirmedFileUploadModeRef.current === "auto") {
        confirmedFileUploadModeRef.current = undefined;
      }
      return;
    }

    clearAfterConfirmedFileSelection("auto");
    await onFilesSelected(files);
    setOpen(false);
  }

  async function handleSemesterFileChange(event: ChangeEvent<HTMLInputElement>) {
    const files = filesFromInput(event);
    event.target.value = "";

    if (files.length === 0) {
      if (confirmedFileUploadModeRef.current === "semester") {
        confirmedFileUploadModeRef.current = undefined;
      }
      return;
    }

    const file = files[0];

    if (!file) {
      return;
    }

    clearAfterConfirmedFileSelection("semester");
    await onFilesSelected([file], selectedSemester(selectedUploadSemesterKey));
    setOpen(false);
  }

  async function handleProjectImport(mode: "all" | "semester") {
    if (!selectedProjectId) {
      return;
    }

    const target =
      mode === "semester" ? selectedSemester(selectedProjectSemesterKey) : undefined;
    const targetLabel = target ? ` ${semesterLabel(target)}` : " 전체";
    const confirmed = window.confirm(
      `${selectedProject?.projectName ?? "선택한 프로젝트"}의 ${sectionLabels[section]}${targetLabel} 데이터를 현재 프로젝트에 덮어씁니다. 계속할까요?`
    );

    if (!confirmed) {
      return;
    }

    setBusy(true);

    try {
      const record = await loadProjectRecord(selectedProjectId);

      if (!record) {
        window.alert("불러올 프로젝트를 찾지 못했습니다.");
        return;
      }

      if (target) {
        if (!isSemesterProjectImportSection(section)) {
          window.alert("이 입력 항목은 학기별 프로젝트 불러오기를 지원하지 않습니다.");
          return;
        }

        importProjectSectionSemester(section, record.data.data, target);
      } else {
        const result = importProjectSection(section, record.data.data);

        if (
          section === "externalCourses" &&
          result.skippedExternalCourseInputCount > 0
        ) {
          window.alert(
            `현재 프로젝트에 없는 학생의 전입/외부 이수 ${result.skippedExternalCourseInputCount.toLocaleString()}건은 건너뛰었습니다.`
          );
        }
      }

      await saveCurrentProjectSnapshot();
      setOpen(false);
    } catch (error) {
      window.alert(
        error instanceof Error ? error.message : "프로젝트 데이터를 불러오지 못했습니다."
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <Button
        className={triggerClassName}
        icon={triggerIcon ?? <Upload size={16} />}
        onClick={() => setOpen(true)}
        variant={triggerVariant}
      >
        {triggerLabel}
      </Button>
      {open ? (
        <div className="import-launcher-modal" role="presentation">
          <div
            aria-labelledby={`${id}-title`}
            aria-modal="true"
            className="import-launcher-dialog"
            role="dialog"
          >
            <div className="import-launcher-dialog__header">
              <h2 id={`${id}-title`}>업로드/불러오기</h2>
              <IconButton
                disabled={busy}
                icon={<X size={16} />}
                label="닫기"
                onClick={() => setOpen(false)}
              />
            </div>

            <div className="import-launcher-panels">
              <section className="import-launcher-group">
                <h3>파일 업로드</h3>
                <p className="import-launcher-group__description">
                  {fileDescription}
                </p>
                {downloadGuide ? (
                  <div className="import-launcher-guide">
                    <p>{downloadGuide.title}</p>
                    <ul>
                      {downloadGuide.items.map((item) => (
                        <li key={item}>▶ {item}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                <div className="import-launcher-row">
                  <Button
                    icon={<Upload size={16} />}
                    onClick={() => requestFileUpload("auto")}
                    variant="secondary"
                  >
                    {autoUploadLabel}
                  </Button>
                  <input
                    ref={autoFileInputRef}
                    accept={accept}
                    className="visually-hidden"
                    multiple={allowMultipleFiles}
                    onChange={handleAutoFileChange}
                    type="file"
                  />
                </div>
                {showUploadSemesterPicker ? (
                  <div className="import-launcher-row">
                    <label htmlFor={`${id}-upload-semester`}>선택 학기</label>
                    <select
                      id={`${id}-upload-semester`}
                      onChange={(event) =>
                        setSelectedUploadSemesterKey(event.target.value as SemesterKey)
                      }
                      value={selectedUploadSemesterKey}
                    >
                      {semesterKeys.map((key) => {
                        const semester = selectedSemester(key);

                        return (
                          <option key={key} value={key}>
                            {semesterLabel(semester)}
                          </option>
                        );
                      })}
                    </select>
                    <Button
                      icon={<Upload size={16} />}
                      onClick={() => requestFileUpload("semester")}
                      variant="secondary"
                    >
                      선택 학기 업로드
                    </Button>
                    <input
                      ref={semesterFileInputRef}
                      accept={accept}
                      className="visually-hidden"
                      onChange={handleSemesterFileChange}
                      type="file"
                    />
                  </div>
                ) : null}
                {pendingFileUploadMode ? (
                  <div
                    aria-label="업로드 확인"
                    className="import-launcher-confirm"
                    role="alertdialog"
                  >
                    <p>{fileUploadConfirmation?.message}</p>
                    <div className="import-launcher-confirm__actions">
                      <Button onClick={continueConfirmedFileUpload}>계속</Button>
                      <Button
                        onClick={cancelConfirmedFileUpload}
                        variant="secondary"
                      >
                        취소
                      </Button>
                    </div>
                  </div>
                ) : null}
              </section>

              <section className="import-launcher-group">
                <h3>프로젝트 불러오기</h3>
                <div className="import-launcher-row import-launcher-row--project">
                  <label htmlFor={`${id}-project`}>프로젝트</label>
                  <select
                    disabled={busy || sourceProjects.length === 0}
                    id={`${id}-project`}
                    onChange={(event) => setSelectedProjectId(event.target.value)}
                    value={selectedProjectId}
                  >
                    {sourceProjects.length === 0 ? (
                      <option value="">다른 프로젝트 없음</option>
                    ) : (
                      sourceProjects.map((project) => (
                        <option key={project.id} value={project.id}>
                          {project.projectName}
                        </option>
                      ))
                    )}
                  </select>
                  <Button
                    disabled={busy || !selectedProjectId}
                    icon={<Download size={16} />}
                    onClick={() => handleProjectImport("all")}
                    variant="secondary"
                  >
                    {allProjectImportLabel}
                  </Button>
                </div>
                {showProjectSemesterImport ? (
                  <div className="import-launcher-row">
                    <label htmlFor={`${id}-project-semester`}>선택 학기</label>
                    <select
                      disabled={busy || sourceProjects.length === 0}
                      id={`${id}-project-semester`}
                      onChange={(event) =>
                        setSelectedProjectSemesterKey(event.target.value as SemesterKey)
                      }
                      value={selectedProjectSemesterKey}
                    >
                      {semesterKeys.map((key) => {
                        const semester = selectedSemester(key);

                        return (
                          <option key={key} value={key}>
                            {semesterLabel(semester)}
                          </option>
                        );
                      })}
                    </select>
                    <Button
                      disabled={busy || !selectedProjectId}
                      icon={<Download size={16} />}
                      onClick={() => handleProjectImport("semester")}
                      variant="secondary"
                    >
                      선택 학기 불러오기
                    </Button>
                  </div>
                ) : null}
              </section>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
