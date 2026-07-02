import { ChevronDown, ChevronRight, Trash2 } from "lucide-react";
import { Fragment, useState } from "react";
import {
  externalCourseSourceTypeLabel,
  type ExternalCourseInput
} from "../types/courseSelection";
import { semesterLabel } from "../utils/semester";
import { IconButton } from "./ui/IconButton";

type ExternalCourseInputSummaryTableProps = {
  inputs: readonly ExternalCourseInput[];
  onRemoveInput: (inputId: string) => void;
};

export function ExternalCourseInputSummaryTable({
  inputs,
  onRemoveInput
}: ExternalCourseInputSummaryTableProps) {
  const [expandedInputIds, setExpandedInputIds] = useState<Set<string>>(
    () => new Set()
  );

  function toggleInputDetails(inputId: string) {
    setExpandedInputIds((current) => {
      const next = new Set(current);

      if (next.has(inputId)) {
        next.delete(inputId);
      } else {
        next.add(inputId);
      }

      return next;
    });
  }

  return (
    <div className="external-input-summary">
      <p className="external-bulk-meta">총 {inputs.length.toLocaleString()}건</p>
      {inputs.length === 0 ? (
        <div className="empty-panel">
          <p>현재까지 입력된 전입/외부 이수 내용이 없습니다.</p>
        </div>
      ) : (
        <div className="preview-table-wrap external-input-summary-table">
          <table
            aria-label="현재까지 입력된 전입/외부 이수"
            className="placeholder-table external-input-summary-compact-table"
          >
            <thead>
              <tr>
                <th>학번</th>
                <th>이름</th>
                <th>학기</th>
                <th>과목명</th>
                <th>학점</th>
                <th>교과군</th>
                <th>선택구분</th>
                <th>세부</th>
                <th>삭제</th>
              </tr>
            </thead>
            <tbody>
              {inputs.map((input, index) => {
                const isExpanded = expandedInputIds.has(input.id);

                return (
                  <Fragment key={input.id}>
                    <tr>
                      <td>{input.studentNo}</td>
                      <td>{input.studentName}</td>
                      <td>{semesterLabel(input.target)}</td>
                      <td>{input.subjectName}</td>
                      <td>{input.credits ?? "-"}</td>
                      <td>{input.subjectGroup ?? "-"}</td>
                      <td>{input.selectionType ?? "-"}</td>
                      <td>
                        <IconButton
                          icon={
                            isExpanded ? (
                              <ChevronDown size={16} />
                            ) : (
                              <ChevronRight size={16} />
                            )
                          }
                          label={`${index + 1}번째 입력 세부 항목 ${
                            isExpanded ? "접기" : "펼치기"
                          }`}
                          onClick={() => toggleInputDetails(input.id)}
                        />
                      </td>
                      <td>
                        <IconButton
                          icon={<Trash2 size={16} />}
                          label="입력 행 삭제"
                          onClick={() => onRemoveInput(input.id)}
                        />
                      </td>
                    </tr>
                    {isExpanded ? (
                      <tr className="external-input-summary-detail-row">
                        <td colSpan={9}>
                          <div className="external-input-summary-detail-grid">
                            <div className="external-summary-cell">
                              <span>과목구분</span>
                              <strong>{input.groupType ?? "-"}</strong>
                            </div>
                            <div className="external-summary-cell">
                              <span>출처</span>
                              <strong>
                                {externalCourseSourceTypeLabel(input.sourceType)}
                              </strong>
                            </div>
                            <div className="external-summary-cell">
                              <span>선택군</span>
                              <strong>{input.choiceGroup}</strong>
                            </div>
                            <div className="external-summary-cell">
                              <span>기관명</span>
                              <strong>{input.sourceName ?? "-"}</strong>
                            </div>
                            <div className="external-summary-cell external-summary-cell--memo">
                              <span>메모</span>
                              <strong>{input.memo ?? "-"}</strong>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ) : null}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
