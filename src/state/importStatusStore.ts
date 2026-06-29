import { create } from "zustand";
import type {
  ImportSourceType,
  ImportStatus,
  SemesterImportStatus
} from "../types/importStatus";
import type { Semester } from "../types/semester";
import { semesterKeys } from "../types/semester";
import { parseSemesterKey, semesterToKey } from "../utils/semester";

export function createSemesterImportStatusId(
  sourceType: ImportSourceType,
  target: Semester
): string {
  return `${sourceType}-${semesterToKey(target)}`;
}

export function createEmptySemesterImportStatus(
  sourceType: ImportSourceType,
  target: Semester
): SemesterImportStatus {
  return {
    id: createSemesterImportStatusId(sourceType, target),
    sourceType,
    target,
    status: "empty"
  };
}

export function createInitialImportStatuses(): SemesterImportStatus[] {
  return semesterKeys.flatMap((key) => {
    const target = parseSemesterKey(key);

    if (!target) {
      return [];
    }

    return [
      createEmptySemesterImportStatus("operatingSubjects", target),
      createEmptySemesterImportStatus("courseSelections", target)
    ];
  });
}

export function getSemesterImportStatus(
  statuses: readonly SemesterImportStatus[],
  sourceType: ImportSourceType,
  target: Semester
): SemesterImportStatus | undefined {
  return statuses.find(
    (status) =>
      status.sourceType === sourceType &&
      status.target.grade === target.grade &&
      status.target.semester === target.semester
  );
}

export function upsertSemesterImportStatus(
  statuses: readonly SemesterImportStatus[],
  nextStatus: SemesterImportStatus
): SemesterImportStatus[] {
  const replaced = statuses.map((status) =>
    status.sourceType === nextStatus.sourceType &&
    status.target.grade === nextStatus.target.grade &&
    status.target.semester === nextStatus.target.semester
      ? nextStatus
      : status
  );

  if (replaced.some((status) => status.id === nextStatus.id)) {
    return replaced;
  }

  return [...replaced, nextStatus];
}

export function clearSemesterImportStatus(
  statuses: readonly SemesterImportStatus[],
  sourceType: ImportSourceType,
  target: Semester
): SemesterImportStatus[] {
  return upsertSemesterImportStatus(
    statuses,
    createEmptySemesterImportStatus(sourceType, target)
  );
}

export type ImportStatusPatch = {
  target: Semester;
  sourceType: ImportSourceType;
  status: ImportStatus;
  fileName?: string;
  rowCount?: number;
  message?: string;
};

type ImportStatusStore = {
  importStatuses: SemesterImportStatus[];
  setSemesterImportStatus: (patch: ImportStatusPatch) => void;
  clearSemesterImportStatus: (
    sourceType: ImportSourceType,
    target: Semester
  ) => void;
  resetImportStatuses: () => void;
};

export const useImportStatusStore = create<ImportStatusStore>((set) => ({
  importStatuses: createInitialImportStatuses(),
  setSemesterImportStatus: (patch) =>
    set((state) => {
      const nextStatus: SemesterImportStatus = {
        id: createSemesterImportStatusId(patch.sourceType, patch.target),
        target: patch.target,
        sourceType: patch.sourceType,
        status: patch.status,
        fileName: patch.fileName,
        importedAt: new Date().toISOString(),
        rowCount: patch.rowCount,
        message: patch.message
      };

      return {
        importStatuses: upsertSemesterImportStatus(
          state.importStatuses,
          nextStatus
        )
      };
    }),
  clearSemesterImportStatus: (sourceType, target) =>
    set((state) => ({
      importStatuses: clearSemesterImportStatus(
        state.importStatuses,
        sourceType,
        target
      )
    })),
  resetImportStatuses: () => set({ importStatuses: createInitialImportStatuses() })
}));
