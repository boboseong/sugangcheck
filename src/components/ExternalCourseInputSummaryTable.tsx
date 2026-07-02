import { Trash2 } from "lucide-react";
import type { ExternalCourseInput } from "../types/courseSelection";
import { semesterLabel } from "../utils/semester";
import { IconButton } from "./ui/IconButton";
import { StatusBadge } from "./ui/StatusBadge";

type ExternalCourseInputSummaryTableProps = {
  inputs: readonly ExternalCourseInput[];
  onRemoveInput: (inputId: string) => void;
};

function sourceTypeLabel(input: ExternalCourseInput) {
  return input.sourceType === "transfer" ? "전입" : "외부 이수";
}

export function ExternalCourseInputSummaryTable({
  inputs,
  onRemoveInput
}: ExternalCourseInputSummaryTableProps) {
  return (
    <div className="external-input-summary">
      <p className="external-bulk-meta">총 {inputs.length.toLocaleString()}건</p>
      <div className="preview-table-wrap external-input-summary-table">
        <table className="placeholder-table">
          <thead>
            <tr>
              <th>학번</th>
              <th>이름</th>
              <th>학기</th>
              <th>과목명</th>
              <th>학점</th>
              <th>과목구분</th>
              <th>교과군</th>
              <th>선택구분</th>
              <th>출처</th>
              <th>선택군</th>
              <th>기관명</th>
              <th>메모</th>
              <th>삭제</th>
            </tr>
          </thead>
          <tbody>
            {inputs.length === 0 ? (
              <tr>
                <td colSpan={13}>현재까지 입력된 전입/외부 이수 내용이 없습니다.</td>
              </tr>
            ) : (
              inputs.map((input) => (
                <tr key={input.id}>
                  <td>{input.studentNo}</td>
                  <td>{input.studentName}</td>
                  <td>{semesterLabel(input.target)}</td>
                  <td>{input.subjectName}</td>
                  <td>{input.credits ?? "-"}</td>
                  <td>{input.groupType ?? "-"}</td>
                  <td>{input.subjectGroup ?? "-"}</td>
                  <td>{input.selectionType ?? "-"}</td>
                  <td>
                    <StatusBadge tone="ready">{sourceTypeLabel(input)}</StatusBadge>
                  </td>
                  <td>{input.choiceGroup}</td>
                  <td>{input.sourceName ?? "-"}</td>
                  <td>{input.memo ?? "-"}</td>
                  <td>
                    <IconButton
                      icon={<Trash2 size={16} />}
                      label="입력 행 삭제"
                      onClick={() => onRemoveInput(input.id)}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
