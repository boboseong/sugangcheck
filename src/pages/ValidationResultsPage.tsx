import { useEffect, useMemo, useState } from "react";
import { Download, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  ErrorFilters,
  filterValidationErrors,
  type ValidationErrorFilters
} from "../components/ErrorFilters";
import { OperatingSubjectRegistrationNotice } from "../components/OperatingSubjectRegistrationNotice";
import { PageHeader } from "../components/ui/PageHeader";
import { ValidationErrorDetailPanel } from "../components/ValidationErrorDetailPanel";
import { ValidationErrorTable } from "../components/ValidationErrorTable";
import {
  exportValidationErrorsXlsx,
  validationErrorListFileName
} from "../export/exportValidationErrorsXlsx";
import {
  createTeacherSharePackage,
  teacherSharePackageFileName
} from "../export/exportTeacherSharePackage";
import { useValidationRun } from "../hooks/useValidationRun";
import { useProjectMetaStore } from "../state/projectMetaStore";
import { useStudentStore } from "../state/studentStore";
import { useValidationResultStore } from "../state/validationResultStore";
import type { ValidationError } from "../types/validation";
import { downloadBlob } from "../utils/downloadBlob";

const defaultFilters: ValidationErrorFilters = {
  ruleId: "all",
  query: ""
};

export function ValidationResultsPage() {
  const navigate = useNavigate();
  const {
    canRunValidation,
    hasOperatingSubjectRegistrationIssue,
    runValidation
  } = useValidationRun();
  const { projectName } = useProjectMetaStore();
  const { students } = useStudentStore();
  const { lastValidationResult, validationErrors } = useValidationResultStore();
  const [filters, setFilters] = useState(defaultFilters);
  const [selectedError, setSelectedError] = useState<ValidationError>();
  const [isCreatingTeacherShare, setIsCreatingTeacherShare] = useState(false);
  const [
    showOperatingSubjectRegistrationNotice,
    setShowOperatingSubjectRegistrationNotice
  ] = useState(false);
  const filteredErrors = useMemo(
    () => filterValidationErrors(validationErrors, filters),
    [filters, validationErrors]
  );

  useEffect(() => {
    if (!hasOperatingSubjectRegistrationIssue) {
      setShowOperatingSubjectRegistrationNotice(false);
    }
  }, [hasOperatingSubjectRegistrationIssue]);

  function handleRunValidation() {
    if (hasOperatingSubjectRegistrationIssue) {
      setShowOperatingSubjectRegistrationNotice(true);
      return;
    }

    if (!canRunValidation) {
      return;
    }

    runValidation();
    setSelectedError(undefined);
    setShowOperatingSubjectRegistrationNotice(false);
  }

  async function handleDownloadErrors() {
    await downloadBlob(
      exportValidationErrorsXlsx(filteredErrors),
      validationErrorListFileName
    );
  }

  async function handleDownloadTeacherShare() {
    if (!canRunValidation || isCreatingTeacherShare) {
      return;
    }

    setIsCreatingTeacherShare(true);

    try {
      const generatedAt = new Date();
      const { buildResult, validationResult } = runValidation();
      const blob = await createTeacherSharePackage({
        projectName,
        generatedAt,
        students,
        courseSelectionRecords: buildResult.records,
        validationErrors: validationResult.errors
      });

      setSelectedError(undefined);
      await downloadBlob(blob, teacherSharePackageFileName(generatedAt));
    } finally {
      setIsCreatingTeacherShare(false);
    }
  }

  return (
    <section className="page">
      <PageHeader
        title="점검 결과"
        description="점검 오류를 유형, 학생 또는 과목 기준으로 확인합니다."
      />
      <div className="prep-status-row">
        <span className="status-badge status-badge--empty">
          전체 {validationErrors.length.toLocaleString()}건
        </span>
        <span className="status-badge status-badge--empty">
          표시 {filteredErrors.length.toLocaleString()}건
        </span>
        <button
          className="button button--compact"
          disabled={!canRunValidation && !hasOperatingSubjectRegistrationIssue}
          onClick={handleRunValidation}
          type="button"
        >
          <Play size={16} />
          <span>점검</span>
        </button>
        <button
          className="button button--secondary button--compact"
          disabled={filteredErrors.length === 0}
          onClick={handleDownloadErrors}
          type="button"
        >
          <Download size={16} />
          <span>오류 명렬 다운로드</span>
        </button>
        <button
          className="button button--secondary button--compact"
          disabled={!canRunValidation || isCreatingTeacherShare}
          onClick={handleDownloadTeacherShare}
          type="button"
        >
          <Download size={16} />
          <span>
            {isCreatingTeacherShare ? "공유 ZIP 생성 중" : "교사용 공유 ZIP"}
          </span>
        </button>
        {lastValidationResult ? (
          <span className="muted-text">
            실행 {lastValidationResult.durationMs.toFixed(1)}ms · 실행 규칙{" "}
            {lastValidationResult.executedRuleIds.length}개
          </span>
        ) : null}
      </div>
      {showOperatingSubjectRegistrationNotice ? (
        <OperatingSubjectRegistrationNotice />
      ) : null}
      <div className="section">
        <ErrorFilters
          errors={validationErrors}
          filters={filters}
          onChange={setFilters}
        />
        <div className="results-layout">
          <ValidationErrorTable
            errors={filteredErrors}
            onOpenStudentReport={(studentId) =>
              navigate(`/student-report?studentId=${encodeURIComponent(studentId)}`)
            }
            onSelectError={setSelectedError}
            selectedErrorId={selectedError?.id}
          />
          <ValidationErrorDetailPanel error={selectedError} />
        </div>
      </div>
    </section>
  );
}
