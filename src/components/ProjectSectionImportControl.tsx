import { Download } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  listProjectRecords,
  loadProjectRecord,
  type StoredProjectSummary
} from "../storage/indexedDbStorage";
import { useProjectMetaStore } from "../state/projectMetaStore";
import {
  importProjectSection,
  saveCurrentProjectSnapshot,
  type ProjectImportSection
} from "../state/projectWorkspace";
import { Button } from "./ui/Button";

const sectionLabels: Record<ProjectImportSection, string> = {
  operatingSubjects: "운영과목",
  validationRules: "점검 규칙",
  courseSelections: "수강신청",
  externalCourses: "전입/외부 이수"
};

type ProjectSectionImportControlProps = {
  section: ProjectImportSection;
};

export function ProjectSectionImportControl({
  section
}: ProjectSectionImportControlProps) {
  const { activeProjectId } = useProjectMetaStore();
  const [projects, setProjects] = useState<StoredProjectSummary[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [busy, setBusy] = useState(false);
  const sourceProjects = useMemo(
    () => projects.filter((project) => project.id !== activeProjectId),
    [activeProjectId, projects]
  );

  useEffect(() => {
    let alive = true;

    listProjectRecords()
      .then((records) => {
        if (!alive) {
          return;
        }

        setProjects(records);
        const firstSourceProject = records.find(
          (project) => project.id !== activeProjectId
        );
        setSelectedProjectId((current) =>
          current && records.some((project) => project.id === current)
            ? current
            : firstSourceProject?.id ?? ""
        );
      })
      .catch((error) => {
        console.error("프로젝트 목록을 불러오지 못했습니다.", error);
      });

    return () => {
      alive = false;
    };
  }, [activeProjectId]);

  async function handleImportSection() {
    if (!selectedProjectId) {
      return;
    }

    const sourceProject = sourceProjects.find(
      (project) => project.id === selectedProjectId
    );
    const confirmed = window.confirm(
      `${sourceProject?.projectName ?? "선택한 프로젝트"}의 ${sectionLabels[section]} 데이터를 현재 프로젝트의 이 탭에 덮어씁니다. 계속할까요?`
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

      const result = importProjectSection(section, record.data.data);

      await saveCurrentProjectSnapshot();

      if (section === "externalCourses" && result.skippedExternalCourseInputCount > 0) {
        window.alert(
          `현재 프로젝트에 없는 학생의 전입/외부 이수 ${result.skippedExternalCourseInputCount.toLocaleString()}건은 건너뛰었습니다.`
        );
      }
    } catch (error) {
      window.alert(
        error instanceof Error ? error.message : "프로젝트 데이터를 불러오지 못했습니다."
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="section-import-control">
      <label>
        <span>다른 프로젝트에서 불러오기</span>
        <select
          disabled={busy || sourceProjects.length === 0}
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
      </label>
      <Button
        disabled={busy || !selectedProjectId}
        icon={<Download size={16} />}
        onClick={handleImportSection}
        variant="secondary"
      >
        {sectionLabels[section]} 불러오기
      </Button>
    </div>
  );
}
