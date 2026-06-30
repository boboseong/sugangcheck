import JSZip from "jszip";
import { read, utils } from "xlsx";
import { describe, expect, it } from "vitest";
import { defaultValidationRuleSettings } from "../data/defaultValidationRules";
import { normalizeSubjectName } from "../normalizers/normalizeSubjectName";
import { createInitialImportStatuses } from "../state/importStatusStore";
import { createEmptyProjectState } from "../state/projectWorkspace";
import type { ParsedCourseSelectionRow } from "../types/courseSelection";
import type { Semester } from "../types/semester";
import { semesterKeys } from "../types/semester";
import type { OperatingSubject } from "../types/subject";
import type { ValidationError } from "../types/validation";
import { parseSemesterKey, semesterToKey } from "../utils/semester";
import {
  createProjectFile,
  createProjectFileBlob
} from "./projectFileExport";
import { readProjectTransferFile } from "./projectTransferPackage";
import {
  createProjectTemplatePackageBlob,
  projectTemplatePackageFileName
} from "./projectTemplatePackage";

const savedAt = "2026-06-30T00:00:00.000Z";

function semesterTargets(): Semester[] {
  return semesterKeys.flatMap((key) => {
    const semester = parseSemesterKey(key);

    return semester ? [semester] : [];
  });
}

function createOperatingSubject(target: Semester): OperatingSubject {
  const subjectName = `테스트과목${target.grade}${target.semester}`;

  return {
    id: `operating-${semesterToKey(target)}`,
    target,
    subjectName,
    normalizedSubjectName: normalizeSubjectName(subjectName),
    subjectGroup: "교양",
    selectionType: "일반선택",
    groupType: "보통교과",
    credits: 2,
    masterMatchStatus: "manual"
  };
}

function createCourseSelectionRow(target: Semester): ParsedCourseSelectionRow {
  const subjectName = `테스트과목${target.grade}${target.semester}`;

  return {
    id: `course-${semesterToKey(target)}`,
    semesterImportId: `courseSelections-${semesterToKey(target)}`,
    studentId: "student-10101-김하나",
    studentNo: "10101",
    studentName: "김하나",
    classNo: "1",
    number: "1",
    gender: "여",
    target,
    subjectName,
    normalizedSubjectName: normalizeSubjectName(subjectName)
  };
}

function createFullProjectFile() {
  const targets = semesterTargets();
  const baseState = createEmptyProjectState("템플릿 점검", savedAt);
  const state = {
    ...baseState,
    updatedAt: savedAt,
    operatingSubjects: targets.map(createOperatingSubject),
    courseSelectionRows: targets.map(createCourseSelectionRow),
    validationRuleSettings: defaultValidationRuleSettings.map((setting) => ({
      ...setting,
      enabled: false,
      criteria:
        setting.id === "minimumCredits"
          ? { minimumTotalCredits: 123 }
          : setting.criteria
    })),
    prerequisiteRules: [],
    detailedConstraintRules: []
  };

  return createProjectFile({
    appVersion: "0.1.4",
    projectName: state.projectName,
    state,
    savedAt
  });
}

describe("project template package", () => {
  it("exports four human template workbooks without app data sheets or example rows", async () => {
    const projectFile = createProjectFile({
      appVersion: "0.1.4",
      projectName: "빈 프로젝트",
      state: createEmptyProjectState("빈 프로젝트", savedAt),
      savedAt
    });
    const blob = await createProjectTemplatePackageBlob({ projectFile });
    const zip = await JSZip.loadAsync(await blob.arrayBuffer());

    expect(zip.file("manifest.json")).toBeTruthy();
    expect(zip.file("templates/운영과목_템플릿.xlsx")).toBeTruthy();
    expect(zip.file("templates/수강신청결과_템플릿.xlsx")).toBeTruthy();
    expect(zip.file("templates/전입외부이수_템플릿.xlsx")).toBeTruthy();
    expect(zip.file("templates/점검규칙_템플릿.xlsx")).toBeTruthy();

    const externalEntry = zip.file("templates/전입외부이수_템플릿.xlsx");
    expect(externalEntry).toBeTruthy();

    const externalWorkbook = read(await externalEntry!.async("arraybuffer"), {
      type: "array"
    });
    const firstSheet = externalWorkbook.Sheets[externalWorkbook.SheetNames[0] ?? ""];
    if (!firstSheet) {
      throw new Error("전입외부이수 시트를 찾지 못했습니다.");
    }
    const rows = utils.sheet_to_json<unknown[]>(firstSheet, {
      header: 1,
      defval: ""
    });

    expect(externalWorkbook.SheetNames).not.toContain("앱데이터");
    expect(rows.flat()).not.toContain("김하나");
    expect(rows).toHaveLength(1);
  });

  it("imports a complete template package and runs validation automatically", async () => {
    const projectFile = createFullProjectFile();
    const blob = await createProjectTemplatePackageBlob({ projectFile });
    const result = await readProjectTransferFile(
      new File([blob], projectTemplatePackageFileName(projectFile.projectName), {
        type: "application/zip"
      })
    );

    expect(result.importKind).toBe("templatePackage");
    expect(result.autoValidationRan).toBe(true);
    expect(result.projectFile.data.courseSelectionRows).toHaveLength(6);
    expect(result.projectFile.data.operatingSubjects).toHaveLength(6);
    expect(result.projectFile.data.operatingSubjects.every(
      (subject) => subject.masterMatchStatus === "manual"
    )).toBe(true);
    expect(result.projectFile.data.importStatuses.every(
      (status) => status.status === "imported"
    )).toBe(true);
    expect(result.projectFile.data.students).toHaveLength(1);
    expect(Object.values(
      result.projectFile.data.studentSemesterPresence[0]?.semesters ?? {}
    )).toEqual(["present", "present", "present", "present", "present", "present"]);
    expect(result.projectFile.data.lastValidationResult).toBeDefined();
    expect(result.projectFile.data.validationRuleSettings.find(
      (setting) => setting.id === "minimumCredits"
    )?.criteria).toEqual({ minimumTotalCredits: 123 });
  });

  it("imports an incomplete template package without auto validation", async () => {
    const projectFile = createProjectFile({
      appVersion: "0.1.4",
      projectName: "미완성 프로젝트",
      state: createEmptyProjectState("미완성 프로젝트", savedAt),
      savedAt
    });
    const blob = await createProjectTemplatePackageBlob({ projectFile });
    const result = await readProjectTransferFile(
      new File([blob], projectTemplatePackageFileName(projectFile.projectName), {
        type: "application/zip"
      })
    );

    expect(result.importKind).toBe("templatePackage");
    expect(result.autoValidationRan).toBe(false);
    expect(result.projectFile.data.validationErrors).toEqual([]);
    expect(result.projectFile.data.courseSelectionRecords).toEqual([]);
    expect(result.projectFile.data.lastValidationResult).toBeUndefined();
    expect(result.dataPreparationStatus?.issues.map((issue) => issue.code)).toContain(
      "missingOperatingSubjects"
    );
  });

  it("imports raw data json with validation state preserved", async () => {
    const projectFile = createFullProjectFile();
    const validationError: ValidationError = {
      id: "error-1",
      ruleId: "minimumCredits",
      type: "minimumCredits",
      studentId: "student-no:10101",
      studentNo: "10101",
      studentName: "김하나",
      message: "테스트 오류",
      relatedRecordIds: []
    };
    const rawProjectFile = createProjectFile({
      appVersion: "0.1.4",
      projectName: projectFile.projectName,
      state: {
        ...projectFile.data,
        importStatuses: createInitialImportStatuses(),
        validationErrors: [validationError],
        courseSelectionRecords: [
          {
            id: "record-1",
            studentId: "student-no:10101",
            studentNo: "10101",
            studentName: "김하나",
            target: { grade: 1, semester: 1 },
            subjectName: "테스트과목11",
            normalizedSubjectName: "테스트과목11",
            subjectGroup: "교양",
            selectionType: "일반선택",
            credits: 2,
            origin: {
              type: "courseSelectionFile",
              semesterImportId: "courseSelections-1-1",
              parsedRowId: "course-1-1"
            }
          }
        ],
        lastValidationResult: {
          errors: [validationError],
          executedRuleIds: ["minimumCredits"],
          skippedRuleIds: [],
          durationMs: 1
        }
      },
      savedAt
    });
    const result = await readProjectTransferFile(
      new File([createProjectFileBlob(rawProjectFile)], "raw.sugangcheck.json", {
        type: "application/json"
      })
    );

    expect(result.importKind).toBe("rawData");
    expect(result.projectFile.data.validationErrors).toEqual([validationError]);
    expect(result.projectFile.data.courseSelectionRecords).toHaveLength(1);
    expect(result.projectFile.data.lastValidationResult?.errors).toEqual([
      validationError
    ]);
  });
});
