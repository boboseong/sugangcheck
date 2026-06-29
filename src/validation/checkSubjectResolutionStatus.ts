import { resolveCredits } from "../normalizers/resolveCredits";
import {
  resolveSubjectMetadata,
  type ResolvedSubjectMetadata
} from "../normalizers/resolveSubjectMetadata";
import type {
  ExternalCourseInput,
  ParsedCourseSelectionRow
} from "../types/courseSelection";
import type { OperatingSubject, SubjectMasterItem, SubjectOverride } from "../types/subject";

export type SubjectResolutionIssue = {
  sourceId: string;
  subjectName: string;
  normalizedSubjectName: string;
  metadataStatus: ResolvedSubjectMetadata["status"];
  creditStatus: "resolved" | "unresolved";
  conflictMessages: string[];
};

export type SubjectResolutionStatus = {
  unresolvedMetadataCount: number;
  missingCreditCount: number;
  conflictCount: number;
  issues: SubjectResolutionIssue[];
};

export function checkSubjectResolutionStatus(input: {
  courseSelectionRows: readonly ParsedCourseSelectionRow[];
  externalCourseInputs: readonly ExternalCourseInput[];
  operatingSubjects: readonly OperatingSubject[];
  subjectOverrides: readonly SubjectOverride[];
  subjectMasterItems?: readonly SubjectMasterItem[];
}): SubjectResolutionStatus {
  const sources = [...input.courseSelectionRows, ...input.externalCourseInputs];
  const issues: SubjectResolutionIssue[] = [];

  for (const source of sources) {
    const metadata = resolveSubjectMetadata({
      source,
      operatingSubjects: input.operatingSubjects,
      subjectOverrides: input.subjectOverrides,
      subjectMasterItems: input.subjectMasterItems
    });
    const credits = resolveCredits({
      source,
      operatingSubjects: input.operatingSubjects,
      subjectOverrides: input.subjectOverrides,
      subjectMasterItems: input.subjectMasterItems
    });

    if (
      metadata.status !== "resolved" ||
      credits.status !== "resolved" ||
      metadata.conflictMessages.length > 0
    ) {
      issues.push({
        sourceId: source.id,
        subjectName: source.subjectName,
        normalizedSubjectName: source.normalizedSubjectName,
        metadataStatus: metadata.status,
        creditStatus: credits.status,
        conflictMessages: metadata.conflictMessages
      });
    }
  }

  return {
    unresolvedMetadataCount: issues.filter(
      (issue) =>
        issue.metadataStatus === "unresolved" || issue.metadataStatus === "partial"
    ).length,
    missingCreditCount: issues.filter(
      (issue) => issue.creditStatus === "unresolved"
    ).length,
    conflictCount: issues.filter((issue) => issue.conflictMessages.length > 0)
      .length,
    issues
  };
}
