import { Download, Plus, RotateCcw, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import {
  buildDetailedSelectionAnalysis,
  type DetailedSelectionAnalysisSubject
} from "../analytics/detailedSelectionAnalysis";
import {
  buildOperatingSubjectPickerOptions,
  OperatingSubjectPicker
} from "../components/OperatingSubjectPicker";
import { Button } from "../components/ui/Button";
import { IconButton } from "../components/ui/IconButton";
import { PageHeader } from "../components/ui/PageHeader";
import { StatusBadge } from "../components/ui/StatusBadge";
import {
  detailedSelectionAnalysisFileName,
  exportDetailedSelectionAnalysisXlsx
} from "../export/exportDetailedSelectionAnalysisXlsx";
import { useCourseSelectionRecordBuild } from "../hooks/useCourseSelectionRecordBuild";
import { normalizeSubjectName } from "../normalizers/normalizeSubjectName";
import { useOperatingSubjectStore } from "../state/operatingSubjectStore";
import type { Semester } from "../types/semester";
import { semesterKeys, type Grade, type SemesterTerm } from "../types/semester";
import type {
  DetailedConstraintSubject,
  SubjectCountComparison
} from "../types/validation";
import { downloadBlob } from "../utils/downloadBlob";
import { semesterToKey } from "../utils/semester";

const gradeOptions = [1, 2, 3] as const;
const semesterOptions = [1, 2] as const;

function emptyAnalysisSubject(target: Semester = { grade: 1, semester: 1 }) {
  return {
    target,
    subjectName: "",
    normalizedSubjectName: ""
  };
}

function normalizeAnalysisSubject(
  subject: DetailedConstraintSubject
): DetailedConstraintSubject {
  return {
    ...subject,
    normalizedSubjectName: normalizeSubjectName(subject.subjectName)
  };
}

function updateAnalysisSubject(
  subject: DetailedConstraintSubject,
  patch: Partial<DetailedConstraintSubject>
): DetailedConstraintSubject {
  return normalizeAnalysisSubject({
    ...subject,
    ...patch
  });
}

function comparisonLabel(comparison: SubjectCountComparison): string {
  return comparison === "atLeast" ? "n개 이상이면 검출" : "n개 이하이면 검출";
}

function selectedLabel(
  row: { selections: { subjectKey: string; selected: boolean }[] },
  subject: DetailedSelectionAnalysisSubject
): string {
  return row.selections.some(
    (selection) => selection.subjectKey === subject.key && selection.selected
  )
    ? "O"
    : "";
}

export function DetailedSelectionAnalysisPage() {
  const { operatingSubjects } = useOperatingSubjectStore();
  const { records, issues } = useCourseSelectionRecordBuild();
  const [comparison, setComparison] =
    useState<SubjectCountComparison>("atLeast");
  const [count, setCount] = useState(1);
  const [subjects, setSubjects] = useState<DetailedConstraintSubject[]>([
    emptyAnalysisSubject()
  ]);
  const subjectOptionsBySemester = useMemo(() => {
    const options = new Map<
      string,
      ReturnType<typeof buildOperatingSubjectPickerOptions>
    >();

    semesterKeys.forEach((key) => {
      const [grade, semester] = key.split("-").map(Number);
      options.set(
        key,
        buildOperatingSubjectPickerOptions(operatingSubjects, {
          target: {
            grade: grade as Grade,
            semester: semester as SemesterTerm
          }
        })
      );
    });

    return options;
  }, [operatingSubjects]);
  const result = useMemo(
    () =>
      buildDetailedSelectionAnalysis({
        comparison,
        count,
        records,
        subjects
      }),
    [comparison, count, records, subjects]
  );
  const canDownload = result.subjects.length > 0 && result.detectedRows.length > 0;

  function resetForm() {
    setComparison("atLeast");
    setCount(1);
    setSubjects([emptyAnalysisSubject()]);
  }

  function updateSubject(index: number, subject: DetailedConstraintSubject) {
    setSubjects((current) =>
      current.map((item, itemIndex) => (itemIndex === index ? subject : item))
    );
  }

  function removeSubject(index: number) {
    setSubjects((current) => {
      const nextSubjects = current.filter((_, itemIndex) => itemIndex !== index);

      return nextSubjects.length > 0 ? nextSubjects : [emptyAnalysisSubject()];
    });
  }

  function addSubject() {
    setSubjects((current) => {
      const lastSubject = current.at(-1);

      return [
        ...current,
        emptyAnalysisSubject(lastSubject?.target ?? { grade: 1, semester: 1 })
      ];
    });
  }

  async function handleDownload() {
    await downloadBlob(
      exportDetailedSelectionAnalysisXlsx(result),
      detailedSelectionAnalysisFileName
    );
  }

  return (
    <section className="page">
      <PageHeader
        title="세부 분석"
        description="대상 과목 선택 개수 조건에 맞는 학생을 크로스탭으로 확인합니다."
      />
      <div className="prep-status-row">
        <span className="status-badge status-badge--empty">
          분석 학생 {result.analyzedStudentCount.toLocaleString()}명
        </span>
        <span className="status-badge status-badge--empty">
          대상 과목 {result.subjects.length.toLocaleString()}개
        </span>
        <span className="status-badge status-badge--empty">
          검출 {result.detectedStudentCount.toLocaleString()}명
        </span>
        {issues.length > 0 ? (
          <span className="status-badge status-badge--warning">
            제외 행 {issues.length.toLocaleString()}건
          </span>
        ) : null}
        <button
          className="button button--secondary button--compact"
          disabled={!canDownload}
          onClick={handleDownload}
          type="button"
        >
          <Download size={16} />
          <span>엑셀 저장</span>
        </button>
      </div>
      <div className="section detail-analysis-layout">
        <div className="detail-analysis-form">
          <div className="detail-analysis-controls">
            <label>
              <span>비교 방식</span>
              <select
                onChange={(event) =>
                  setComparison(event.target.value as SubjectCountComparison)
                }
                value={comparison}
              >
                <option value="atLeast">n개 이상이면 검출</option>
                <option value="atMost">n개 이하이면 검출</option>
              </select>
            </label>
            <label>
              <span>기준 개수</span>
              <input
                min="0"
                onChange={(event) => setCount(Number(event.target.value))}
                type="number"
                value={count}
              />
            </label>
            <Button icon={<RotateCcw size={16} />} onClick={resetForm} variant="secondary">
              초기화
            </Button>
          </div>
          <div className="detail-analysis-subject-list">
            {subjects.map((subject, index) => {
              const subjectOptions =
                subjectOptionsBySemester.get(semesterToKey(subject.target)) ?? [];

              return (
                <div className="detail-analysis-subject-row" key={index}>
                  <label>
                    <span>학년</span>
                    <select
                      onChange={(event) =>
                        updateSubject(
                          index,
                          updateAnalysisSubject(subject, {
                            target: {
                              ...subject.target,
                              grade: Number(event.target.value) as Grade
                            }
                          })
                        )
                      }
                      value={subject.target.grade}
                    >
                      {gradeOptions.map((grade) => (
                        <option key={grade} value={grade}>
                          {grade}학년
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    <span>학기</span>
                    <select
                      onChange={(event) =>
                        updateSubject(
                          index,
                          updateAnalysisSubject(subject, {
                            target: {
                              ...subject.target,
                              semester: Number(event.target.value) as SemesterTerm
                            }
                          })
                        )
                      }
                      value={subject.target.semester}
                    >
                      {semesterOptions.map((semester) => (
                        <option key={semester} value={semester}>
                          {semester}학기
                        </option>
                      ))}
                    </select>
                  </label>
                  <div className="detail-analysis-subject-field">
                    <OperatingSubjectPicker
                      label={`과목 ${index + 1}`}
                      onChange={(subjectName) =>
                        updateSubject(
                          index,
                          updateAnalysisSubject(subject, { subjectName })
                        )
                      }
                      options={subjectOptions}
                      placeholder="해당 학기 운영과목 검색"
                      value={subject.subjectName}
                    />
                  </div>
                  <IconButton
                    icon={<Trash2 size={16} />}
                    label="대상 과목 삭제"
                    onClick={() => removeSubject(index)}
                  />
                </div>
              );
            })}
          </div>
          <div className="detail-analysis-actions">
            <Button
              icon={<Plus size={16} />}
              onClick={addSubject}
              variant="secondary"
            >
              과목 추가
            </Button>
          </div>
        </div>
        {records.length === 0 ? (
          <div className="empty-panel">
            <p>수강신청 결과를 업로드하면 세부 분석 결과가 표시됩니다.</p>
          </div>
        ) : result.subjects.length === 0 ? (
          <div className="empty-panel">
            <p>대상 과목을 입력하면 세부 분석 결과가 표시됩니다.</p>
          </div>
        ) : result.detectedRows.length === 0 ? (
          <div className="empty-panel">
            <p>{comparisonLabel(comparison)} 조건을 만족하는 학생이 없습니다.</p>
          </div>
        ) : (
          <div className="preview-table-wrap detail-analysis-table-wrap">
            <table className="placeholder-table detail-analysis-table">
              <thead>
                <tr>
                  <th>번호</th>
                  <th>학번</th>
                  <th>이름</th>
                  <th>선택 개수</th>
                  {result.subjects.map((subject) => (
                    <th key={subject.key}>{subject.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {result.detectedRows.map((row, index) => (
                  <tr key={row.studentId}>
                    <td>{index + 1}</td>
                    <td>{row.studentNo || "-"}</td>
                    <td>{row.studentName || "-"}</td>
                    <td>
                      <StatusBadge tone="warning">
                        {`${row.selectedCount.toLocaleString()}개`}
                      </StatusBadge>
                    </td>
                    {result.subjects.map((subject) => {
                      const label = selectedLabel(row, subject);

                      return (
                        <td
                          className={
                            label === "O"
                              ? "detail-analysis-table__selected"
                              : undefined
                          }
                          key={subject.key}
                        >
                          {label}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
