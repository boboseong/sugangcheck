import { normalizeSubjectName } from "../normalizers/normalizeSubjectName";
import type { OperatingSubject } from "../types/subject";
import type {
  PrerequisiteNumberSystem,
  PrerequisiteRule,
  PrerequisiteRuleStatus
} from "../types/validation";

type StagedSubject = {
  subjectName: string;
  normalizedSubjectName: string;
  baseName: string;
  stage: number;
  detectedNumberSystem: PrerequisiteNumberSystem;
};

function detectNumberSystem(subjectName: string): PrerequisiteNumberSystem {
  if (/[ⅠⅡⅢⅣ]/.test(subjectName)) {
    return "roman";
  }

  if (/(^|\s)(I|II|III|IV)$/i.test(subjectName.normalize("NFKC"))) {
    return "latinRoman";
  }

  return "arabic";
}

function parseStagedSubject(subject: OperatingSubject): StagedSubject | undefined {
  const match = subject.normalizedSubjectName.match(/^(.*)\s([1-4])$/);

  if (!match) {
    return undefined;
  }

  const baseName = match[1]?.trim();
  const stage = Number(match[2]);

  if (!baseName || stage < 1) {
    return undefined;
  }

  return {
    subjectName: subject.subjectName,
    normalizedSubjectName: subject.normalizedSubjectName,
    baseName,
    stage,
    detectedNumberSystem: detectNumberSystem(subject.subjectName)
  };
}

function ruleKey(rule: Pick<PrerequisiteRule, "beforeNormalizedSubjectName" | "afterNormalizedSubjectName">): string {
  return `${rule.beforeNormalizedSubjectName}|${rule.afterNormalizedSubjectName}`;
}

function getInitialRuleState(detectedNumberSystem: PrerequisiteNumberSystem): {
  status: PrerequisiteRuleStatus;
  allowConcurrent: boolean;
} {
  if (detectedNumberSystem === "arabic") {
    return {
      status: "disabled",
      allowConcurrent: true
    };
  }

  return {
    status: "active",
    allowConcurrent: false
  };
}

export function generatePrerequisiteCandidates(
  operatingSubjects: readonly OperatingSubject[]
): PrerequisiteRule[] {
  const stagedSubjects = operatingSubjects
    .map(parseStagedSubject)
    .filter((subject): subject is StagedSubject => Boolean(subject));
  const byNormalizedName = new Map(
    stagedSubjects.map((subject) => [subject.normalizedSubjectName, subject])
  );
  const candidates: PrerequisiteRule[] = [];

  for (const subject of stagedSubjects) {
    if (subject.stage <= 1) {
      continue;
    }

    const beforeNormalizedSubjectName = `${subject.baseName} ${subject.stage - 1}`;
    const beforeSubject = byNormalizedName.get(beforeNormalizedSubjectName);

    if (!beforeSubject) {
      continue;
    }

    const initialRuleState = getInitialRuleState(subject.detectedNumberSystem);

    candidates.push({
      id: `auto-prerequisite-${beforeNormalizedSubjectName}-${subject.normalizedSubjectName}`,
      beforeSubjectName: beforeSubject.subjectName,
      beforeNormalizedSubjectName,
      afterSubjectName: subject.subjectName,
      afterNormalizedSubjectName: subject.normalizedSubjectName,
      status: initialRuleState.status,
      allowConcurrent: initialRuleState.allowConcurrent,
      includeExternalInputsOverride: true,
      source: "autoCandidate",
      detectedNumberSystem: subject.detectedNumberSystem
    });
  }

  const seen = new Set<string>();

  return candidates.filter((candidate) => {
    const key = ruleKey(candidate);

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

export function mergePrerequisiteRules(
  existingRules: readonly PrerequisiteRule[],
  nextRules: readonly PrerequisiteRule[]
): PrerequisiteRule[] {
  const existingKeys = new Set(existingRules.map(ruleKey));
  const additions = nextRules.filter((rule) => !existingKeys.has(ruleKey(rule)));

  return [...existingRules, ...additions];
}

export function createManualPrerequisiteRule(input: {
  beforeSubjectName: string;
  afterSubjectName: string;
  allowConcurrent: boolean;
}): PrerequisiteRule {
  const beforeNormalizedSubjectName = normalizeSubjectName(input.beforeSubjectName);
  const afterNormalizedSubjectName = normalizeSubjectName(input.afterSubjectName);

  return {
    id: `manual-prerequisite-${beforeNormalizedSubjectName}-${afterNormalizedSubjectName}-${Date.now()}`,
    beforeSubjectName: input.beforeSubjectName.trim(),
    beforeNormalizedSubjectName,
    afterSubjectName: input.afterSubjectName.trim(),
    afterNormalizedSubjectName,
    status: "active",
    allowConcurrent: input.allowConcurrent,
    includeExternalInputsOverride: true,
    source: "manual",
    updatedAt: new Date().toISOString()
  };
}
