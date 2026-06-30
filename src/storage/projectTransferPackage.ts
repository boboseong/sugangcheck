import JSZip from "jszip";
import {
  allProjectTransferSections,
  type ProjectTransferSection
} from "../state/projectTransfer";
import { createEmptyProjectState } from "../state/projectWorkspace";
import type { ImportSourceType, SemesterImportStatus } from "../types/importStatus";
import type { ProjectFile, ProjectState } from "../types/project";
import { parseProjectFileText, readProjectFile } from "./projectFileImport";
import { migrateProjectFile } from "./projectMigration";
import {
  isProjectTemplatePackageManifest,
  readProjectTemplatePackage,
  type ProjectTemplatePackageManifest
} from "./projectTemplatePackage";
import {
  createProjectTransferWorkbookBuffer,
  parseProjectTransferWorkbook,
  projectTransferWorkbookFileName,
  type ProjectTransferWorkbookId
} from "./projectTransferWorkbook";

export type ProjectTransferPackageManifest = {
  kind: "sugangcheck.projectTransfer";
  packageVersion: 1;
  schemaVersion: number;
  appVersion: string;
  savedAt: string;
  projectName: string;
  createdAt?: string;
  projectEntryName?: string;
  sectionEntryNames?: Partial<Record<ProjectTransferWorkbookId, string>>;
  selectedSections: ProjectTransferSection[];
  includesValidationResults: boolean;
};

export type ProjectTransferPackageReadResult = {
  projectFile: ProjectFile;
  manifest?: ProjectTransferPackageManifest | ProjectTemplatePackageManifest;
  importKind: "rawData" | "templatePackage" | "projectTransfer";
  autoValidationRan?: boolean;
  dataPreparationStatus?: ProjectState["dataPreparationStatus"];
};

const manifestEntryName = "manifest.json";
const currentProjectEntryName = "project.sugangcheck.json";
const sectionDirectoryName = "sections";
const currentProjectTransferKind = "sugangcheck.projectTransfer";

function safeProjectName(projectName: string): string {
  return projectName.trim().replace(/[\\/:*?"<>|]/g, "_") || "project";
}

function parseManifest(text: string): ProjectTransferPackageManifest | undefined {
  const parsed: unknown = JSON.parse(text);

  if (
    typeof parsed !== "object" ||
    parsed === null ||
    !("kind" in parsed) ||
    parsed.kind !== currentProjectTransferKind
  ) {
    return undefined;
  }

  return parsed as ProjectTransferPackageManifest;
}

export function projectTransferPackageFileName(
  projectName: string,
  savedAt = new Date()
): string {
  const datePart = savedAt.toISOString().slice(0, 10).replace(/-/g, "");

  return `${safeProjectName(projectName)}_${datePart}.sugangcheck.zip`;
}

export async function createProjectTransferPackageBlob(input: {
  projectFile: ProjectFile;
  selectedSections: readonly ProjectTransferSection[];
  includesValidationResults: boolean;
}): Promise<Blob> {
  const zip = new JSZip();
  const manifest: ProjectTransferPackageManifest = {
    kind: currentProjectTransferKind,
    packageVersion: 1,
    schemaVersion: input.projectFile.schemaVersion,
    appVersion: input.projectFile.appVersion,
    savedAt: input.projectFile.savedAt,
    projectName: input.projectFile.projectName,
    createdAt: input.projectFile.data.createdAt,
    sectionEntryNames: {},
    selectedSections: [...input.selectedSections],
    includesValidationResults: input.includesValidationResults
  };
  const workbookIds: ProjectTransferWorkbookId[] = [
    ...input.selectedSections,
    ...(input.includesValidationResults ? (["validationResults"] as const) : [])
  ];

  await Promise.all(
    workbookIds.map(async (workbookId) => {
      const entryName = `${sectionDirectoryName}/${projectTransferWorkbookFileName(workbookId)}`;

      manifest.sectionEntryNames = {
        ...manifest.sectionEntryNames,
        [workbookId]: entryName
      };
      zip.file(
        entryName,
        createProjectTransferWorkbookBuffer({
          projectFile: input.projectFile,
          workbookId
        })
      );
    })
  );

  zip.file(manifestEntryName, JSON.stringify(manifest, null, 2));

  return zip.generateAsync({
    type: "blob",
    compression: "DEFLATE",
    compressionOptions: {
      level: 6
    }
  });
}

function replaceImportStatusesForSource(
  currentStatuses: readonly SemesterImportStatus[],
  sourceStatuses: readonly SemesterImportStatus[],
  sourceType: ImportSourceType
): SemesterImportStatus[] {
  return [
    ...currentStatuses.filter((status) => status.sourceType !== sourceType),
    ...sourceStatuses.filter((status) => status.sourceType === sourceType)
  ];
}

function isSemesterImportStatus(value: unknown): value is SemesterImportStatus {
  return (
    typeof value === "object" &&
    value !== null &&
    "sourceType" in value &&
    "status" in value &&
    "target" in value
  );
}

function mergeProjectStateFields(
  targetState: ProjectState,
  fields: Partial<ProjectState>
) {
  Object.entries(fields).forEach(([field, value]) => {
    if (field === "importStatuses" && Array.isArray(value)) {
      const importStatuses = value.filter(isSemesterImportStatus);
      const sourceTypes = new Set(
        importStatuses.map((status) => status.sourceType).filter(Boolean)
      );

      targetState.importStatuses = [...sourceTypes].reduce(
        (statuses, sourceType) =>
          replaceImportStatusesForSource(statuses, importStatuses, sourceType),
        targetState.importStatuses
      );
      return;
    }

    (targetState as Record<string, unknown>)[field] = value;
  });
}

async function readModernXlsxPackage(input: {
  zip: JSZip;
  manifest: ProjectTransferPackageManifest;
}): Promise<ProjectFile> {
  const selectedWorkbookIds: ProjectTransferWorkbookId[] = [
    ...input.manifest.selectedSections.filter((section) =>
      allProjectTransferSections.includes(section)
    ),
    ...(input.manifest.includesValidationResults
      ? (["validationResults"] as const)
      : [])
  ];
  const projectState = createEmptyProjectState(
    input.manifest.projectName,
    input.manifest.createdAt ?? input.manifest.savedAt
  );

  (projectState as { schemaVersion: number }).schemaVersion =
    input.manifest.schemaVersion;
  projectState.updatedAt = input.manifest.savedAt;

  await Promise.all(
    selectedWorkbookIds.map(async (workbookId) => {
      const entryName =
        input.manifest.sectionEntryNames?.[workbookId] ??
        `${sectionDirectoryName}/${projectTransferWorkbookFileName(workbookId)}`;
      const entry = input.zip.file(entryName);

      if (!entry) {
        throw new Error(`${projectTransferWorkbookFileName(workbookId)} 파일을 찾지 못했습니다.`);
      }

      const workbookData = parseProjectTransferWorkbook(
        await entry.async("arraybuffer"),
        workbookId
      );

      mergeProjectStateFields(projectState, workbookData.fields);
    })
  );

  return migrateProjectFile({
    schemaVersion: input.manifest.schemaVersion,
    appVersion: input.manifest.appVersion,
    savedAt: input.manifest.savedAt,
    projectName: input.manifest.projectName,
    data: projectState
  });
}

export async function readProjectTransferFile(
  file: File
): Promise<ProjectTransferPackageReadResult> {
  const lowerName = file.name.toLowerCase();

  if (lowerName.endsWith(".json")) {
    return {
      projectFile: await readProjectFile(file),
      importKind: "rawData"
    };
  }

  const zip = await JSZip.loadAsync(await file.arrayBuffer());
  const manifestEntry = zip.file(manifestEntryName);
  const rawManifest = manifestEntry
    ? (JSON.parse(await manifestEntry.async("text")) as unknown)
    : undefined;

  if (isProjectTemplatePackageManifest(rawManifest)) {
    const result = await readProjectTemplatePackage({
      zip,
      manifest: rawManifest
    });

    return {
      projectFile: result.projectFile,
      manifest: result.manifest,
      importKind: "templatePackage",
      autoValidationRan: result.autoValidationRan,
      dataPreparationStatus: result.dataPreparationStatus
    };
  }

  const manifest = rawManifest ? parseManifest(JSON.stringify(rawManifest)) : undefined;

  if (manifest?.sectionEntryNames) {
    return {
      projectFile: await readModernXlsxPackage({ zip, manifest }),
      manifest,
      importKind: "projectTransfer"
    };
  }

  const projectEntry =
    zip.file(manifest?.projectEntryName ?? currentProjectEntryName) ??
    zip
      .filter((relativePath, entry) => {
        const lowerPath = relativePath.toLowerCase();

        return !entry.dir && lowerPath.endsWith(".sugangcheck.json");
      })
      .at(0);

  if (!projectEntry) {
    throw new Error("프로젝트 zip 안에서 sugangcheck 프로젝트 데이터를 찾지 못했습니다.");
  }

  return {
    projectFile: parseProjectFileText(await projectEntry.async("text")),
    manifest,
    importKind: "projectTransfer"
  };
}
