import {
  type PendingOperatingSubjectCompletion,
  type PendingOperatingSubjectCompletionDecision
} from "../hooks/useCourseSelectionImport";
import { semesterToKey } from "../utils/semester";
import { Button } from "./ui/Button";

type MissingOperatingSubjectCompletionDialogProps = {
  canComplete: boolean;
  completions: PendingOperatingSubjectCompletion[];
  onComplete: () => void;
  onDecisionChange: (
    completionId: string,
    subjectId: string,
    decision: PendingOperatingSubjectCompletionDecision
  ) => void;
};

export function MissingOperatingSubjectCompletionDialog({
  canComplete,
  completions,
  onComplete,
  onDecisionChange
}: MissingOperatingSubjectCompletionDialogProps) {
  const rows = completions.flatMap((completion) =>
    completion.subjects.map((subject) => ({
      completionId: completion.id,
      subject,
      target: completion.target
    }))
  );

  return (
    <div className="subject-enrollment-modal" role="presentation">
      <div
        aria-labelledby="missing-operating-subject-dialog-title"
        aria-modal="true"
        className="subject-enrollment-dialog missing-operating-subject-dialog"
        role="alertdialog"
      >
        <div className="subject-enrollment-dialog__header">
          <div>
            <h2 id="missing-operating-subject-dialog-title">
              누락 운영과목 확인
            </h2>
          </div>
        </div>
        <div className="missing-operating-subject-dialog__body">
          <p>운영과목에는 있지만, 수강신청결과에는 없는 과목 있습니다.</p>
          <table className="placeholder-table missing-operating-subject-table">
            <thead>
              <tr>
                <th>학기</th>
                <th>과목명</th>
                <th>모두 이수</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={`${row.completionId}-${row.subject.id}`}>
                  <td>{semesterToKey(row.target)}</td>
                  <td>{row.subject.subjectName}</td>
                  <td>
                    <div className="missing-operating-subject-choice">
                      <button
                        aria-pressed={row.subject.decision === "all"}
                        className={
                          row.subject.decision === "all" ? "is-selected" : undefined
                        }
                        onClick={() =>
                          onDecisionChange(row.completionId, row.subject.id, "all")
                        }
                        type="button"
                      >
                        O
                      </button>
                      <button
                        aria-pressed={row.subject.decision === "none"}
                        className={
                          row.subject.decision === "none" ? "is-selected" : undefined
                        }
                        onClick={() =>
                          onDecisionChange(row.completionId, row.subject.id, "none")
                        }
                        type="button"
                      >
                        X
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="subject-enrollment-dialog__actions">
          <Button disabled={!canComplete} onClick={onComplete}>
            완료
          </Button>
        </div>
      </div>
    </div>
  );
}
