import { create } from "zustand";

export const appVersion = "0.1.3";
export const defaultProjectName = "새 점검 프로젝트";

type ProjectMetaPatch = {
  activeProjectId?: string;
  projectName: string;
  schemaVersion: number;
  createdAt: string;
  savedAt?: string;
};

type ProjectMetaState = {
  activeProjectId?: string;
  appVersion: string;
  createdAt: string;
  projectName: string;
  schemaVersion: number;
  savedAt?: string;
  setActiveProjectId: (activeProjectId: string) => void;
  setProjectName: (projectName: string) => void;
  hydrateProjectMeta: (patch: ProjectMetaPatch) => void;
  markSaved: (savedAt?: string) => void;
};

export const useProjectMetaStore = create<ProjectMetaState>((set) => ({
  appVersion,
  createdAt: new Date().toISOString(),
  projectName: defaultProjectName,
  schemaVersion: 3,
  setActiveProjectId: (activeProjectId) => set({ activeProjectId }),
  setProjectName: (projectName) => set({ projectName }),
  hydrateProjectMeta: (patch) => set(patch),
  markSaved: (savedAt = new Date().toISOString()) => set({ savedAt })
}));
