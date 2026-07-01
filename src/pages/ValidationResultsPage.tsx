import { useMemo, useState } from "react";
import { Download, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  ErrorFilters,
  filterValidationErrors,
  type ValidationErrorFilters
} from "../components/ErrorFilters";
import { PageHeader } from "../components/ui/PageHeader";
import { ValidationErrorTable } from "../components/ValidationErrorTable";
import { ValidationRunConfirmationDropdown } from "../components/ValidationRunConfirmationDropdown";
import {
  exportValidationErrorsXlsx,
  validationErrorListFileName
} from "../export/exportValidationErrorsXlsx";
import { useValidationRun } from "../hooks/useValidationRun";
import { useValidationResultStore } from "../state/validationResultStore";
import { downloadBlob } from "../utils/downloadBlob";
import { semesterLabel } from "../utils/semester";

const defaultFilters: ValidationErrorFilters = {
  ruleId: "all",
  query: ""
};

export function ValidationResultsPage() {
  const navigate = useNavigate();
  const {
    buildIssues,
    canRunValidation,
    confirmationMessage,
    runValidation
  } = useValidationRun();
  const { lastValidationResult, validationErrors } = useValidationResultStore();
  const [filters, setFilters] = useState(defaultFilters);
  const [showValidationConfirmation, setShowValidationConfirmation] =
    useState(false);
  const filteredErrors = useMemo(
    () => filterValidationErrors(validationErrors, filters),
    [filters, validationErrors]
  );

  function runFromResults() {
    runValidation();
    setShowValidationConfirmation(false);
  }

  function handleRunValidation() {
    if (!canRunValidation) {
      return;
    }

    if (confirmationMessage) {
      setShowValidationConfirmation(true);
      return;
    }

    runFromResults();
  }

  async function handleDownloadErrors() {
    await downloadBlob(
      exportValidationErrorsXlsx(filteredErrors),
      validationErrorListFileName
    );
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
        {buildIssues.length > 0 ? (
          <span className="status-badge status-badge--warning">
            점검 제외 자료 {buildIssues.length.toLocaleString()}건
          </span>
        ) : null}
        <button
          className="button button--compact"
          disabled={!canRunValidation}
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
        {lastValidationResult ? (
          <span className="muted-text">
            실행 {lastValidationResult.durationMs.toFixed(1)}ms · 실행 규칙{" "}
            {lastValidationResult.executedRuleIds.length}개
          </span>
        ) : null}
      </div>
      {showValidationConfirmation && confirmationMessage ? (
        <ValidationRunConfirmationDropdown
          message={confirmationMessage}
          onCancel={() => setShowValidationConfirmation(false)}
          onConfirm={runFromResults}
        />
      ) : null}
      {buildIssues.length > 0 ? (
        <div className="section">
          <div className="section-heading-row">
            <h2>점검 제외 자료</h2>
            <span className="muted-text">
              입력자료 문제로 점검 레코드에 포함되지 않은 행입니다.
            </span>
          </div>
          <table className="placeholder-table">
            <thead>
              <tr>
                <th>학기</th>
                <th>학생</th>
                <th>과목</th>
                <th>출처</th>
                <th>제외 사유</th>
              </tr>
            </thead>
            <tbody>
              {buildIssues.map((issue) => (
                <tr key={issue.sourceId}>
                  <td>{semesterLabel(issue.target)}</td>
                  <td>
                    {issue.studentNo} {issue.studentName}
                  </td>
                  <td>{issue.subjectName}</td>
                  <td>{issue.sourceLabel}</td>
                  <td>{issue.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
      <div className="section">
        <ErrorFilters
          errors={validationErrors}
          filters={filters}
          onChange={setFilters}
        />
        <ValidationErrorTable
          errors={filteredErrors}
          onOpenStudentReport={(studentId) =>
            navigate(`/student-report?studentId=${encodeURIComponent(studentId)}`)
          }
        />
      </div>
    </section>
  );
}
