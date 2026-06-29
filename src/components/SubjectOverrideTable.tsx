import { Save } from "lucide-react";
import { useMemo, useState } from "react";
import {
  groupTypes,
  selectionTypes,
  subjectGroups
} from "../data/subjectMaster";
import {
  createSubjectOverrideFromOperatingSubject,
  type SubjectOverridePatch
} from "../state/subjectOverrideStore";
import type { OperatingSubject, SubjectOverride } from "../types/subject";
import { toCreditNumber } from "../utils/number";
import { Button } from "./ui/Button";
import { StatusBadge } from "./ui/StatusBadge";

type SubjectOverrideTableProps = {
  unmatchedSubjects: readonly OperatingSubject[];
  overrides: readonly SubjectOverride[];
  onSaveOverride: (override: SubjectOverride) => void;
};

type Draft = {
  groupType: string;
  subjectGroup: string;
  selectionType: string;
  credits: string;
};

function findOverrideForSubject(
  subject: OperatingSubject,
  overrides: readonly SubjectOverride[]
): SubjectOverride | undefined {
  return overrides.find(
    (override) => override.normalizedSubjectName === subject.normalizedSubjectName
  );
}

function createDraft(
  subject: OperatingSubject,
  override?: SubjectOverride
): Draft {
  return {
    groupType: override?.groupType ?? subject.groupType ?? "",
    subjectGroup: override?.subjectGroup ?? subject.subjectGroup,
    selectionType: override?.selectionType ?? subject.selectionType,
    credits: String(override?.credits ?? subject.credits ?? "")
  };
}

function optionList(values: readonly string[], fallback: string): string[] {
  return [...new Set([fallback, ...values].filter(Boolean))];
}

export function SubjectOverrideTable({
  unmatchedSubjects,
  overrides,
  onSaveOverride
}: SubjectOverrideTableProps) {
  const uniqueUnmatchedSubjects = useMemo(() => {
    const seen = new Set<string>();

    return unmatchedSubjects.filter((subject) => {
      if (seen.has(subject.normalizedSubjectName)) {
        return false;
      }

      seen.add(subject.normalizedSubjectName);
      return true;
    });
  }, [unmatchedSubjects]);
  const [drafts, setDrafts] = useState<Record<string, Draft>>({});

  function draftFor(subject: OperatingSubject): Draft {
    return (
      drafts[subject.id] ??
      createDraft(subject, findOverrideForSubject(subject, overrides))
    );
  }

  function updateDraft(
    subject: OperatingSubject,
    field: keyof Draft,
    value: string
  ) {
    setDrafts((current) => ({
      ...current,
      [subject.id]: {
        ...draftFor(subject),
        [field]: value
      }
    }));
  }

  function saveDraft(subject: OperatingSubject) {
    const draft = draftFor(subject);
    const patch: SubjectOverridePatch = {
      groupType: draft.groupType || undefined,
      subjectGroup: draft.subjectGroup || undefined,
      selectionType: draft.selectionType || undefined,
      credits: toCreditNumber(draft.credits)
    };

    onSaveOverride(createSubjectOverrideFromOperatingSubject(subject, patch));
  }

  return (
    <div className="subject-override-layout">
      <div className="preview-table-wrap">
        <table className="placeholder-table">
          <thead>
            <tr>
              <th>과목명</th>
              <th>과목구분</th>
              <th>교과군</th>
              <th>선택구분</th>
              <th>학점</th>
              <th>저장</th>
            </tr>
          </thead>
          <tbody>
            {uniqueUnmatchedSubjects.length === 0 ? (
              <tr>
                <td colSpan={6}>보정이 필요한 미등록 과목이 없습니다.</td>
              </tr>
            ) : (
              uniqueUnmatchedSubjects.map((subject) => {
                const draft = draftFor(subject);

                return (
                  <tr key={subject.id}>
                    <td>{subject.subjectName}</td>
                    <td>
                      <select
                        onChange={(event) =>
                          updateDraft(subject, "groupType", event.target.value)
                        }
                        value={draft.groupType}
                      >
                        <option value="">미확인</option>
                        {optionList(groupTypes, draft.groupType).map((value) => (
                          <option key={value} value={value}>
                            {value}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <select
                        onChange={(event) =>
                          updateDraft(subject, "subjectGroup", event.target.value)
                        }
                        value={draft.subjectGroup}
                      >
                        <option value="">미확인</option>
                        {optionList(subjectGroups, draft.subjectGroup).map((value) => (
                          <option key={value} value={value}>
                            {value}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <select
                        onChange={(event) =>
                          updateDraft(subject, "selectionType", event.target.value)
                        }
                        value={draft.selectionType}
                      >
                        <option value="">미확인</option>
                        {optionList(selectionTypes, draft.selectionType).map(
                          (value) => (
                            <option key={value} value={value}>
                              {value}
                            </option>
                          )
                        )}
                      </select>
                    </td>
                    <td>
                      <input
                        min="0"
                        onChange={(event) =>
                          updateDraft(subject, "credits", event.target.value)
                        }
                        type="number"
                        value={draft.credits}
                      />
                    </td>
                    <td>
                      <Button
                        icon={<Save size={16} />}
                        onClick={() => saveDraft(subject)}
                        variant="secondary"
                      >
                        저장
                      </Button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      <div className="override-summary">
        <h3>저장된 보정값</h3>
        {overrides.length === 0 ? (
          <p>아직 저장된 과목 보정값이 없습니다.</p>
        ) : (
          <ul>
            {overrides.map((override) => (
              <li key={override.id}>
                <span>{override.subjectName}</span>
                <StatusBadge
                  tone={
                    override.conflictStatus === "needsReview" ? "warning" : "ready"
                  }
                >
                  {override.conflictStatus === "needsReview" ? "충돌 확인" : "저장됨"}
                </StatusBadge>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
