import { useState } from "react";
import { Download } from "lucide-react";
import { ClassStudentRosterTable } from "../components/ClassStudentRosterTable";
import { FilePreviewTable } from "../components/FilePreviewTable";
import { MissingOperatingSubjectCompletionDialog } from "../components/MissingOperatingSubjectCompletionDialog";
import { SemesterUploadSlots } from "../components/SemesterUploadSlots";
import { StudentCourseSummaryTable } from "../components/StudentCourseSummaryTable";
import { StudentPresenceTable } from "../components/StudentPresenceTable";
import { UploadImportLauncher } from "../components/UploadImportLauncher";
import { Button } from "../components/ui/Button";
import { PageHeader } from "../components/ui/PageHeader";
import { courseSelectionDownloadGuide } from "../constants/uploadGuides";
import { useCourseSelectionImport } from "../hooks/useCourseSelectionImport";
import { useValidationResultStore } from "../state/validationResultStore";

type CourseSelectionInnerTab =
  | "default"
  | "missingStudents"
  | "semesterSubjectCounts"
  | "classRoster";

const innerTabs = [
  { id: "default", label: "기본" },
  { id: "missingStudents", label: "누락 학생 명렬" },
  { id: "semesterSubjectCounts", label: "학기별 이수 과목 수" },
  { id: "classRoster", label: "반별 학생 명렬" }
] as const satisfies readonly {
  id: CourseSelectionInnerTab;
  label: string;
}[];

export function CourseSelectionsPage() {
  const {
    canCompletePendingOperatingSubjectCompletions,
    completePendingOperatingSubjectCompletions,
    courseSelectionRows,
    handleClearSemester,
    handleDownloadTemplate,
    handleFilesSelected,
    importStatuses,
    pendingOperatingSubjectCompletions,
    preview,
    setPendingOperatingSubjectCompletionDecision,
    studentSemesterPresence
  } = useCourseSelectionImport();
  const hasValidationResult = useValidationResultStore(
    (state) =>
      state.lastValidationResult !== undefined || state.validationErrors.length > 0
  );
  const [activeInnerTab, setActiveInnerTab] =
    useState<CourseSelectionInnerTab>("default");
  const shouldShowInnerTab = (tab: CourseSelectionInnerTab) =>
    activeInnerTab === "default" || activeInnerTab === tab;

  return (
    <section className="page">
      <PageHeader
        title="수강신청 결과 업로드"
        description="수강신청 결과 파일을 학기별로 읽고 학생-과목 원천 행으로 변환합니다. 특정 학기 재업로드는 해당 학기 원천 행만 교체합니다."
      />
      <div className="template-action-bar">
        <UploadImportLauncher
          downloadGuide={courseSelectionDownloadGuide}
          fileUploadConfirmation={{
            message:
              "입력 자료가 변경되어 기존 점검 결과가 이전 결과로 표시됩니다. 계속하시겠습니까?",
            shouldConfirm: hasValidationResult
          }}
          onFilesSelected={handleFilesSelected}
          section="courseSelections"
        />
        <Button
          icon={<Download size={16} />}
          onClick={handleDownloadTemplate}
          variant="secondary"
        >
          템플릿 다운로드
        </Button>
      </div>
      <div className="section">
        <SemesterUploadSlots
          clearConfirmation={{
            message:
              "입력 자료가 변경되어 기존 점검 결과가 이전 결과로 표시됩니다. 계속하시겠습니까?",
            shouldConfirm: hasValidationResult
          }}
          compact
          onClearSemester={handleClearSemester}
          onFilesSelected={handleFilesSelected}
          showUploadActions={false}
          sourceType="courseSelections"
          statuses={importStatuses}
        />
      </div>
      <div className="section course-selection-inner-tabs">
        <div className="tool-tab-bar course-selection-tab-bar">
          {innerTabs.map((tab) => (
            <button
              aria-pressed={activeInnerTab === tab.id}
              className={[
                "tool-tab",
                activeInnerTab === tab.id ? "tool-tab--active" : ""
              ]
                .filter(Boolean)
                .join(" ")}
              key={tab.id}
              onClick={() => setActiveInnerTab(tab.id)}
              type="button"
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="course-selection-tab-panels">
          {shouldShowInnerTab("missingStudents") ? (
            <section className="course-selection-tab-panel">
              <h2>누락 학생 명렬</h2>
              <StudentPresenceTable rows={studentSemesterPresence} />
            </section>
          ) : null}
          {shouldShowInnerTab("semesterSubjectCounts") ? (
            <section className="course-selection-tab-panel">
              <h2>학기별 이수 과목 수</h2>
              <StudentCourseSummaryTable rows={courseSelectionRows} />
            </section>
          ) : null}
          {shouldShowInnerTab("classRoster") ? (
            <section className="course-selection-tab-panel">
              <h2>반별 학생 명렬</h2>
              <ClassStudentRosterTable rows={studentSemesterPresence} />
            </section>
          ) : null}
        </div>
      </div>
      <div className="section">
        <h2>파일 미리보기</h2>
        <FilePreviewTable preview={preview} />
      </div>
      {pendingOperatingSubjectCompletions.length > 0 ? (
        <MissingOperatingSubjectCompletionDialog
          canComplete={canCompletePendingOperatingSubjectCompletions}
          completions={pendingOperatingSubjectCompletions}
          onComplete={completePendingOperatingSubjectCompletions}
          onDecisionChange={setPendingOperatingSubjectCompletionDecision}
        />
      ) : null}
    </section>
  );
}
