import { utils, write, type WorkBook } from "xlsx";
import { normalizeSubjectName } from "../normalizers/normalizeSubjectName";
import type {
  ExternalCourseInput,
  ExternalCourseInputSourceType,
  ParsedCourseSelectionRow
} from "../types/courseSelection";
import type { Semester, SemesterTerm } from "../types/semester";
import type { Student } from "../types/student";
import type { OperatingSubject } from "../types/subject";
import type {
  DetailedConstraintRule,
  DetailedConstraintSubject,
  PrerequisiteRule,
  SubjectCountComparison,
  ValidationRuleId,
  ValidationRuleSetting
} from "../types/validation";
import { toCreditNumber } from "../utils/number";
import {
  createClassNumberNameKey,
  createGeneratedStudentNo,
  createStudentAuxiliaryKey
} from "../utils/studentKey";
import { semesterLabel } from "../utils/semester";
import { validationRuleLabels } from "../utils/validationRuleLabels";

export const templateFileNames = {
  operatingSubject: "운영과목_템플릿.xlsx",
  courseSelection: "수강신청결과_템플릿.xlsx",
  externalCourse: "전입외부이수_템플릿.xlsx",
  validationRules: "점검규칙_템플릿.xlsx",
  prerequisiteRule: "위계설정_템플릿.xlsx",
  detailedConstraintRule: "세부제약_템플릿.xlsx"
} as const;

export type ExternalCourseTemplateParseResult = {
  inputs: ExternalCourseInput[];
  students: Student[];
  createdStudents: Student[];
};

export type PrerequisiteRuleTemplateParseResult = {
  rules: PrerequisiteRule[];
};

export type DetailedConstraintRuleTemplateParseResult = {
  rules: DetailedConstraintRule[];
};

export type ValidationRulesTemplateParseResult = {
  validationRuleSettings: ValidationRuleSetting[];
  prerequisiteRules: PrerequisiteRule[];
  detailedConstraintRules: DetailedConstraintRule[];
};

type ParseIssue = {
  rowNumber: number;
  message: string;
};

type HeaderAliases = Record<string, readonly string[]>;

const externalCourseHeaderAliases: HeaderAliases = {
  studentNo: ["학번", "학생번호", "학생 번호"],
  grade: ["학년"],
  semester: ["학기"],
  classNo: ["반", "학급"],
  number: ["번호", "번"],
  studentName: ["이름", "성명", "학생명"],
  subjectName: ["과목명", "교과목", "교과목명", "과목"],
  subjectGroup: ["교과군", "교과(군)", "영역분류", "영역/분류"],
  selectionType: ["선택구분", "과목유형"],
  groupType: ["과목구분"],
  credits: ["학점", "이수학점", "운영학점"],
  sourceType: ["출처", "구분", "이수구분"],
  sourceName: ["기관명", "학교명", "출처기관"],
  memo: ["메모", "비고"]
};

const prerequisiteRuleHeaderAliases: HeaderAliases = {
  enabled: ["점검 여부", "점검", "사용", "사용 여부"],
  beforeSubjectName: ["선이수 과목", "선이수", "이전 과목"],
  afterSubjectName: ["후이수 과목", "후이수", "다음 과목"],
  allowConcurrent: ["병행 허용", "병행", "동시이수 허용"],
  includeExternalInputs: ["전입/외부 포함", "외부 포함", "전입외부 포함"]
};

const detailedConstraintHeaderAliases: HeaderAliases = {
  enabled: ["점검 여부", "점검", "사용", "사용 여부"],
  type: ["유형", "규칙 유형", "제약 유형"],
  name: ["규칙명", "이름", "제약명"],
  triggerGrade: ["조건 학년", "A 학년", "조건과목 학년"],
  triggerSemester: ["조건 학기", "A 학기", "조건과목 학기"],
  triggerSubjectName: ["조건 과목", "A 과목", "조건과목"],
  requiredGrade: ["필수 학년", "B 학년", "필수과목 학년"],
  requiredSemester: ["필수 학기", "B 학기", "필수과목 학기"],
  requiredSubjectName: ["필수 과목", "B 과목", "필수과목"],
  comparison: ["비교 방식", "비교", "기준 방식"],
  count: ["기준 개수", "n", "개수", "기준"],
  includeExternalInputs: ["전입/외부 포함", "외부 포함", "전입외부 포함"]
};

const detailedConstraintSubjectHeaderAliases: HeaderAliases = {
  name: ["규칙명", "이름", "제약명"],
  grade: ["학년"],
  semester: ["학기"],
  subjectName: ["과목명", "과목", "교과목"]
};

const validationRuleSettingHeaderAliases: HeaderAliases = {
  ruleId: ["검사 ID", "규칙 ID", "ID"],
  label: ["검사명", "검사", "규칙명", "점검 항목"],
  enabled: ["사용 여부", "점검 여부", "사용", "점검"],
  includeExternalInputs: ["전입/외부 포함", "외부 포함", "전입외부 포함"]
};

function compactString(value: unknown): string {
  return String(value ?? "").normalize("NFKC").trim().replace(/\s+/g, " ");
}

function normalizeHeader(value: unknown): string {
  return compactString(value).replace(/\s+/g, "").replace(/[()]/g, "");
}

function normalizedKey(value: unknown): string {
  return compactString(value).toLowerCase();
}

function headerMatches(value: unknown, aliases: readonly string[]): boolean {
  const normalized = normalizeHeader(value);

  return aliases.some((alias) => normalized === normalizeHeader(alias));
}

function workbookFromSheet(sheetName: string, rows: unknown[][], widths: number[]) {
  const workbook = utils.book_new();
  const sheet = utils.aoa_to_sheet(rows);

  sheet["!cols"] = widths.map((wch) => ({ wch }));
  utils.book_append_sheet(workbook, sheet, sheetName);

  return workbook;
}

function firstSheetMatrix(workbook: WorkBook, context: string): unknown[][] {
  const sheetName = workbook.SheetNames[0];
  const sheet = sheetName ? workbook.Sheets[sheetName] : undefined;

  if (!sheet) {
    throw new Error(`${context} 템플릿에서 읽을 수 있는 시트를 찾지 못했습니다.`);
  }

  return utils.sheet_to_json<unknown[]>(sheet, {
    header: 1,
    blankrows: false,
    defval: ""
  });
}

function sheetMatrixByName(
  workbook: WorkBook,
  sheetName: string,
  context: string
): unknown[][] {
  const sheet = workbook.Sheets[sheetName];

  if (!sheet) {
    throw new Error(`${context} 템플릿에서 ${sheetName} 시트를 찾지 못했습니다.`);
  }

  return utils.sheet_to_json<unknown[]>(sheet, {
    header: 1,
    blankrows: false,
    defval: ""
  });
}

function findHeaderRow(
  matrix: unknown[][],
  aliases: HeaderAliases,
  requiredFields: readonly string[],
  context: string
): {
  headerRowIndex: number;
  columnMap: Record<string, number | undefined>;
} {
  let best:
    | {
        headerRowIndex: number;
        columnMap: Record<string, number | undefined>;
        score: number;
      }
    | undefined;

  matrix.forEach((row, rowIndex) => {
    const columnMap: Record<string, number | undefined> = {};

    row.forEach((cell, columnIndex) => {
      for (const [field, fieldAliases] of Object.entries(aliases)) {
        if (
          columnMap[field] === undefined &&
          headerMatches(cell, fieldAliases)
        ) {
          columnMap[field] = columnIndex;
        }
      }
    });

    const score = Object.keys(columnMap).length;

    if (!best || score > best.score) {
      best = { headerRowIndex: rowIndex, columnMap, score };
    }
  });

  const missingFields = requiredFields.filter(
    (field) => best?.columnMap[field] === undefined
  );

  if (!best || missingFields.length > 0) {
    throw new Error(
      `${context} 템플릿에서 필수 헤더를 찾지 못했습니다: ${missingFields.join(", ")}`
    );
  }

  return best;
}

function valueAt(row: unknown[], columnIndex?: number): unknown {
  return columnIndex === undefined ? undefined : row[columnIndex];
}

function rowHasContent(row: unknown[]): boolean {
  return row.some((cell) => compactString(cell) !== "");
}

function parseGrade(value: unknown): Semester["grade"] | undefined {
  const match = compactString(value).match(/[1-3]/);

  return match ? (Number(match[0]) as Semester["grade"]) : undefined;
}

function parseSemesterTerm(value: unknown): SemesterTerm | undefined {
  const match = compactString(value).match(/[1-2]/);

  return match ? (Number(match[0]) as SemesterTerm) : undefined;
}

function parseRequiredBoolean(
  value: unknown,
  label: string,
  issues: ParseIssue[],
  rowNumber: number
): boolean | undefined {
  const normalized = compactString(value).toLowerCase().replace(/\s+/g, "");

  if (!normalized) {
    issues.push({ rowNumber, message: `${label} 값을 입력하세요.` });
    return undefined;
  }

  if (
    ["1", "y", "yes", "true", "o", "○", "ㅇ", "예", "네", "사용", "점검", "포함", "허용", "active"].includes(
      normalized
    )
  ) {
    return true;
  }

  if (
    ["0", "n", "no", "false", "x", "아니오", "아니요", "미사용", "사용안함", "제외", "불허", "disabled"].includes(
      normalized
    )
  ) {
    return false;
  }

  issues.push({
    rowNumber,
    message: `${label} 값을 참/거짓으로 해석하지 못했습니다.`
  });
  return undefined;
}

function parseExternalCourseSourceType(
  value: unknown
): ExternalCourseInputSourceType | undefined {
  const normalized = compactString(value).toLowerCase().replace(/\s+/g, "");

  if (["전입", "전입보완", "전학", "transfer"].includes(normalized)) {
    return "transfer";
  }

  if (
    ["외부", "외부이수", "external", "externalcourse"].includes(normalized)
  ) {
    return "externalCourse";
  }

  return undefined;
}

function parseDetailedConstraintType(
  value: unknown
): DetailedConstraintRule["type"] | undefined {
  const normalized = compactString(value).toLowerCase().replace(/\s+/g, "");

  if (["연계과목", "연계", "linkedsubject", "linked"].includes(normalized)) {
    return "linkedSubject";
  }

  if (["기타제한", "기타", "선택수", "subjectcount", "count"].includes(normalized)) {
    return "subjectCount";
  }

  return undefined;
}

function parseSubjectCountComparison(
  value: unknown
): SubjectCountComparison | undefined {
  const normalized = compactString(value).toLowerCase().replace(/\s+/g, "");

  if (
    [
      "n개이상",
      "n개이상이면검출",
      "이상",
      "atleast",
      ">=",
      "greaterthanorequal"
    ].includes(normalized)
  ) {
    return "atLeast";
  }

  if (
    [
      "n개이하",
      "n개이하이면검출",
      "이하",
      "atmost",
      "<=",
      "lessthanorequal"
    ].includes(normalized)
  ) {
    return "atMost";
  }

  return undefined;
}

function comparisonLabel(value: SubjectCountComparison): string {
  return value === "atLeast" ? "n개 이상이면 검출" : "n개 이하이면 검출";
}

function parseNonNegativeInteger(value: unknown): number | undefined {
  const raw = compactString(value);

  if (!raw) {
    return undefined;
  }

  const parsed = Number(raw);

  if (!Number.isInteger(parsed) || parsed < 0) {
    return undefined;
  }

  return parsed;
}

function summarizeIssues(context: string, issues: readonly ParseIssue[]): never {
  const preview = issues
    .slice(0, 5)
    .map((issue) => `${issue.rowNumber}행: ${issue.message}`)
    .join("\n");
  const suffix =
    issues.length > 5 ? `\n외 ${issues.length - 5}건의 오류가 더 있습니다.` : "";

  throw new Error(`${context} 템플릿을 가져오지 못했습니다.\n${preview}${suffix}`);
}

function studentIdentifier(input: {
  target: Semester;
  sourceStudentNo: string;
  classNo: string;
  number: string;
  name: string;
}): {
  studentId: string;
  studentNo: string;
} {
  const generatedStudentNo =
    input.sourceStudentNo
      ? ""
      : createGeneratedStudentNo({
          grade: input.target.grade,
          classNo: input.classNo,
          number: input.number
        });
  const studentNo = input.sourceStudentNo || generatedStudentNo;
  const studentId =
    createStudentAuxiliaryKey({
      studentNo,
      name: input.name,
      classNo: input.classNo,
      number: input.number
    }) || "";

  return { studentId, studentNo };
}

function findMatchingStudent(
  students: readonly Student[],
  input: {
    studentNo: string;
    classNo: string;
    number: string;
    name: string;
  }
): Student | undefined {
  const studentNoKey = normalizedKey(input.studentNo);
  const classNumberNameKey = createClassNumberNameKey({
    classNo: input.classNo,
    number: input.number,
    name: input.name
  });

  return students.find((student) => {
    if (studentNoKey && normalizedKey(student.studentNo) === studentNoKey) {
      return true;
    }

    return (
      classNumberNameKey !== "" &&
      createClassNumberNameKey({
        currentClassNo: student.currentClassNo,
        currentNumber: student.currentNumber,
        name: student.name
      }) === classNumberNameKey
    );
  });
}

function sortStudents(students: readonly Student[]): Student[] {
  return [...students].sort((left, right) => {
    const classCompare = (left.currentClassNo ?? "").localeCompare(
      right.currentClassNo ?? "",
      "ko",
      { numeric: true }
    );

    if (classCompare !== 0) {
      return classCompare;
    }

    const numberCompare = (left.currentNumber ?? "").localeCompare(
      right.currentNumber ?? "",
      "ko",
      { numeric: true }
    );

    if (numberCompare !== 0) {
      return numberCompare;
    }

    return left.name.localeCompare(right.name, "ko");
  });
}

function addInstructionSheet(
  workbook: WorkBook,
  rows: unknown[][],
  widths: number[] = [24, 72]
) {
  const sheet = utils.aoa_to_sheet(rows);

  sheet["!cols"] = widths.map((wch) => ({ wch }));
  utils.book_append_sheet(workbook, sheet, "작성안내");
}

function booleanLabel(value: boolean): string {
  return value ? "예" : "아니오";
}

function sourceTypeLabel(value: ExternalCourseInputSourceType): string {
  return value === "transfer" ? "전입" : "외부이수";
}

const validationRuleIds = Object.keys(validationRuleLabels) as ValidationRuleId[];

function validationRuleIdFromTemplateRow(input: {
  ruleId: unknown;
  label: unknown;
}): ValidationRuleId | undefined {
  const normalizedRuleId = compactString(input.ruleId).toLowerCase();
  const idMatch = validationRuleIds.find(
    (ruleId) => ruleId.toLowerCase() === normalizedRuleId
  );

  if (idMatch) {
    return idMatch;
  }

  const normalizedLabel = compactString(input.label);

  return validationRuleIds.find(
    (ruleId) => validationRuleLabels[ruleId] === normalizedLabel
  );
}

function validationRuleSettingRows(
  settings: readonly ValidationRuleSetting[]
): unknown[][] {
  return settings.map((setting) => [
    setting.id,
    validationRuleLabels[setting.id],
    booleanLabel(setting.enabled),
    booleanLabel(setting.includeExternalInputs)
  ]);
}

function operatingSubjectRows(
  subjects: readonly OperatingSubject[] | undefined
): unknown[][] {
  if (!subjects || subjects.length === 0) {
    return [[1, 1, "공통국어1", 4, "국어", "공통", "보통교과", 120]];
  }

  return subjects.map((subject) => [
    subject.target.grade,
    subject.target.semester,
    subject.subjectName,
    subject.credits,
    subject.subjectGroup,
    subject.selectionType,
    subject.groupType ?? "",
    ""
  ]);
}

const courseSelectionTemplateTargets: readonly Semester[] = [
  { grade: 1, semester: 1 },
  { grade: 1, semester: 2 },
  { grade: 2, semester: 1 },
  { grade: 2, semester: 2 },
  { grade: 3, semester: 1 },
  { grade: 3, semester: 2 }
];

function isSameTarget(row: ParsedCourseSelectionRow, target: Semester): boolean {
  return (
    row.target.grade === target.grade &&
    row.target.semester === target.semester
  );
}

function defaultCourseSelectionRows(target: Semester): unknown[][] {
  return [
    [
      createGeneratedStudentNo({
        grade: target.grade,
        classNo: 1,
        number: 1
      }),
      "남",
      "김하나",
      1,
      ""
    ],
    [
      createGeneratedStudentNo({
        grade: target.grade,
        classNo: 1,
        number: 2
      }),
      "여",
      "이두리",
      "",
      "O"
    ]
  ];
}

function courseSelectionRows(
  rows: readonly ParsedCourseSelectionRow[] | undefined,
  target: Semester
): unknown[][] {
  if (!rows || rows.length === 0) {
    return defaultCourseSelectionRows(target);
  }

  const targetRows = rows.filter((row) => isSameTarget(row, target));

  if (targetRows.length === 0) {
    return [];
  }

  const subjectNames = [
    ...new Map(
      targetRows.map((row) => [row.normalizedSubjectName, row.subjectName])
    ).values()
  ];
  const groupedRows = new Map<
    string,
    {
      row: ParsedCourseSelectionRow;
      subjects: Set<string>;
    }
  >();

  targetRows.forEach((row) => {
    const key = [
      row.studentId,
      row.target.grade,
      row.target.semester
    ].join("|");
    const group = groupedRows.get(key) ?? {
      row,
      subjects: new Set<string>()
    };

    group.subjects.add(row.subjectName);
    groupedRows.set(key, group);
  });

  return [...groupedRows.values()].map((group) => [
    group.row.studentNo,
    group.row.gender ?? "",
    group.row.studentName,
    ...subjectNames.map((subjectName) =>
      group.subjects.has(subjectName) ? 1 : ""
    )
  ]);
}

function courseSelectionHeaders(
  rows: readonly ParsedCourseSelectionRow[] | undefined,
  target: Semester
): string[] {
  const targetRows = rows?.filter((row) => isSameTarget(row, target)) ?? [];
  const subjectNames =
    targetRows.length > 0
      ? [
          ...new Map(
            targetRows.map((row) => [row.normalizedSubjectName, row.subjectName])
          ).values()
        ]
      : ["공통국어1", "공통수학1"];

  return ["학번", "성별", "이름", ...subjectNames];
}

function courseSelectionWidths(
  rows: readonly ParsedCourseSelectionRow[] | undefined,
  target: Semester
): number[] {
  const targetRows = rows?.filter((row) => isSameTarget(row, target)) ?? [];
  const subjectCount =
    targetRows.length > 0
      ? new Set(targetRows.map((row) => row.normalizedSubjectName)).size
      : 2;

  return [14, 10, 16, ...Array(subjectCount).fill(18)];
}

function externalCourseRows(input?: {
  inputs: readonly ExternalCourseInput[];
  students: readonly Student[];
}): unknown[][] {
  if (!input || input.inputs.length === 0) {
    return [
      [
        "10101",
        1,
        1,
        1,
        1,
        "김하나",
        "공통국어1",
        "국어",
        "공통",
        "보통교과",
        4,
        "전입",
        "이전 학교",
        ""
      ],
      [
        "10103",
        1,
        2,
        1,
        3,
        "박세린",
        "온라인 공동교육과정",
        "교양",
        "진로",
        "보통교과",
        2,
        "외부이수",
        "공동교육과정",
        ""
      ]
    ];
  }

  const studentById = new Map(
    input.students.map((student) => [student.studentId, student])
  );

  return input.inputs.map((externalInput) => {
    const student = studentById.get(externalInput.studentId);

    return [
      externalInput.studentNo,
      externalInput.target.grade,
      externalInput.target.semester,
      student?.currentClassNo ?? "",
      student?.currentNumber ?? "",
      externalInput.studentName,
      externalInput.subjectName,
      externalInput.subjectGroup ?? "",
      externalInput.selectionType ?? "",
      externalInput.groupType ?? "",
      externalInput.credits ?? "",
      sourceTypeLabel(externalInput.sourceType),
      externalInput.sourceName ?? "",
      externalInput.memo ?? ""
    ];
  });
}

function prerequisiteRuleRows(
  rules: readonly PrerequisiteRule[] | undefined
): unknown[][] {
  if (!rules || rules.length === 0) {
    return [
      ["사용", "물리학", "역학과 에너지", "예", "예"],
      ["미사용", "공통수학1", "공통수학2", "아니오", "예"]
    ];
  }

  return rules.map((rule) => [
    rule.status === "active" ? "사용" : "미사용",
    rule.beforeSubjectName,
    rule.afterSubjectName,
    booleanLabel(rule.allowConcurrent),
    booleanLabel(rule.includeExternalInputsOverride ?? true)
  ]);
}

function detailedConstraintSummaryRows(
  rules: readonly DetailedConstraintRule[] | undefined
): unknown[][] {
  if (!rules || rules.length === 0) {
    return [
      [
        "사용",
        "연계과목",
        "물리학-역학 연계",
        2,
        1,
        "물리학",
        2,
        2,
        "역학과 에너지",
        "",
        "",
        "예"
      ],
      [
        "사용",
        "기타제한",
        "과학 선택 3개 이상",
        "",
        "",
        "",
        "",
        "",
        "",
        "n개 이상이면 검출",
        3,
        "예"
      ]
    ];
  }

  return rules.map((rule) => {
    if (rule.type === "linkedSubject") {
      return [
        rule.status === "active" ? "사용" : "미사용",
        "연계과목",
        rule.name,
        rule.trigger.target.grade,
        rule.trigger.target.semester,
        rule.trigger.subjectName,
        rule.required.target.grade,
        rule.required.target.semester,
        rule.required.subjectName,
        "",
        "",
        booleanLabel(rule.includeExternalInputsOverride ?? true)
      ];
    }

    return [
      rule.status === "active" ? "사용" : "미사용",
      "기타제한",
      rule.name,
      "",
      "",
      "",
      "",
      "",
      "",
      comparisonLabel(rule.comparison),
      rule.count,
      booleanLabel(rule.includeExternalInputsOverride ?? true)
    ];
  });
}

function detailedConstraintSubjectRows(
  rules: readonly DetailedConstraintRule[] | undefined
): unknown[][] {
  if (!rules || rules.length === 0) {
    return [
      ["과학 선택 3개 이상", 2, 1, "물리학"],
      ["과학 선택 3개 이상", 2, 1, "화학"],
      ["과학 선택 3개 이상", 2, 2, "생명과학"]
    ];
  }

  return rules.flatMap((rule) =>
    rule.type === "subjectCount"
      ? rule.subjects.map((subject) => [
          rule.name,
          subject.target.grade,
          subject.target.semester,
          subject.subjectName
        ])
      : []
  );
}

export function createXlsxBlob(workbook: WorkBook): Blob {
  const buffer = write(workbook, {
    bookType: "xlsx",
    type: "array"
  }) as ArrayBuffer;

  return new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  });
}

export function createOperatingSubjectTemplateWorkbook(
  subjects?: readonly OperatingSubject[]
): WorkBook {
  const workbook = workbookFromSheet(
    "운영과목",
    [
      [
        "학년",
        "학기",
        "교과목",
        "운영학점",
        "교과(군)",
        "선택구분",
        "과목구분",
        "수강인원"
      ],
      ...operatingSubjectRows(subjects)
    ],
    [10, 10, 24, 12, 16, 14, 14, 12]
  );

  addInstructionSheet(workbook, [
    ["항목", "작성 방법"],
    ["학년/학기", "1~3학년, 1~2학기 값을 입력합니다."],
    ["교과목", "앱에서 운영과목명으로 읽는 과목명입니다."],
    ["운영학점", "숫자로 입력합니다."]
  ]);

  return workbook;
}

export function createCourseSelectionTemplateWorkbook(
  rows?: readonly ParsedCourseSelectionRow[]
): WorkBook {
  const workbook = utils.book_new();

  courseSelectionTemplateTargets.forEach((target) => {
    const sheet = utils.aoa_to_sheet([
      courseSelectionHeaders(rows, target),
      ...courseSelectionRows(rows, target)
    ]);

    sheet["!cols"] = courseSelectionWidths(rows, target).map((wch) => ({
      wch
    }));
    utils.book_append_sheet(workbook, sheet, semesterLabel(target));
  });

  addInstructionSheet(workbook, [
    ["항목", "작성 방법"],
    ["시트", "각 학년·학기 시트에 해당 학기 수강신청 결과만 입력합니다."],
    ["학생 정보", "학번과 이름을 입력합니다. 학년, 반, 번호는 학번에서 읽습니다."],
    ["과목 열", "이름 오른쪽부터 과목명을 헤더로 입력합니다."],
    ["선택값", "1, Y, O, ○, TRUE, 선택 중 하나를 입력하면 선택으로 읽습니다."]
  ]);

  return workbook;
}

export function createExternalCourseTemplateWorkbook(input?: {
  inputs: readonly ExternalCourseInput[];
  students: readonly Student[];
}): WorkBook {
  const workbook = workbookFromSheet(
    "전입외부이수",
    [
      [
        "학번",
        "학년",
        "학기",
        "반",
        "번호",
        "이름",
        "과목명",
        "교과군",
        "선택구분",
        "과목구분",
        "학점",
        "출처",
        "기관명",
        "메모"
      ],
      ...externalCourseRows(input)
    ],
    [14, 10, 10, 10, 10, 16, 26, 16, 14, 14, 10, 14, 20, 28]
  );

  addInstructionSheet(workbook, [
    ["항목", "작성 방법"],
    ["학생", "기존 학생은 학번 또는 반/번호/이름으로 매칭합니다."],
    ["새 학생", "현재 프로젝트에 없는 학생이면 새 학생으로 추가합니다."],
    ["출처", "전입, 전학, transfer, 외부이수, externalCourse 중 하나를 입력합니다."]
  ]);

  return workbook;
}

export function createPrerequisiteRuleTemplateWorkbook(
  rules?: readonly PrerequisiteRule[]
): WorkBook {
  const workbook = workbookFromSheet(
    "위계설정",
    [
      ["점검 여부", "선이수 과목", "후이수 과목", "병행 허용", "전입/외부 포함"],
      ...prerequisiteRuleRows(rules)
    ],
    [14, 24, 24, 14, 18]
  );

  addInstructionSheet(workbook, [
    ["항목", "작성 방법"],
    ["점검 여부", "사용/미사용, 예/아니오, 1/0 등을 입력합니다."],
    ["병행 허용", "같은 학기 이수를 허용하면 예를 입력합니다."],
    ["전입/외부 포함", "전입/외부 이수 입력을 위계 점검에 포함하면 예를 입력합니다."]
  ]);

  return workbook;
}

export function createDetailedConstraintRuleTemplateWorkbook(
  rules?: readonly DetailedConstraintRule[]
): WorkBook {
  const workbook = utils.book_new();
  const summarySheet = utils.aoa_to_sheet([
    [
      "점검 여부",
      "유형",
      "규칙명",
      "조건 학년",
      "조건 학기",
      "조건 과목",
      "필수 학년",
      "필수 학기",
      "필수 과목",
      "비교 방식",
      "기준 개수",
      "전입/외부 포함"
    ],
    ...detailedConstraintSummaryRows(rules)
  ]);
  const subjectSheet = utils.aoa_to_sheet([
    ["규칙명", "학년", "학기", "과목명"],
    ...detailedConstraintSubjectRows(rules)
  ]);

  summarySheet["!cols"] = [14, 14, 24, 12, 12, 24, 12, 12, 24, 20, 12, 18].map(
    (wch) => ({ wch })
  );
  subjectSheet["!cols"] = [24, 10, 10, 24].map((wch) => ({ wch }));

  utils.book_append_sheet(workbook, summarySheet, "세부제약");
  utils.book_append_sheet(workbook, subjectSheet, "기타제한과목");

  addInstructionSheet(workbook, [
    ["항목", "작성 방법"],
    ["유형", "연계과목 또는 기타제한 중 하나를 입력합니다."],
    [
      "연계과목",
      "조건 학년/학기/과목과 필수 학년/학기/과목을 모두 입력합니다."
    ],
    [
      "기타제한",
      "세부제약 시트에 비교 방식과 기준 개수를 입력하고 기타제한과목 시트에 과목 목록을 입력합니다."
    ],
    ["비교 방식", "n개 이상이면 검출 또는 n개 이하이면 검출을 입력합니다."]
  ]);

  return workbook;
}

export function createValidationRulesTemplateWorkbook(input: {
  validationRuleSettings: readonly ValidationRuleSetting[];
  prerequisiteRules: readonly PrerequisiteRule[];
  detailedConstraintRules: readonly DetailedConstraintRule[];
}): WorkBook {
  const workbook = utils.book_new();
  const settingsSheet = utils.aoa_to_sheet([
    ["검사 ID", "검사명", "사용 여부", "전입/외부 포함"],
    ...validationRuleSettingRows(input.validationRuleSettings)
  ]);
  const prerequisiteSheet = utils.aoa_to_sheet([
    ["점검 여부", "선이수 과목", "후이수 과목", "병행 허용", "전입/외부 포함"],
    ...prerequisiteRuleRows(input.prerequisiteRules)
  ]);
  const detailedSummarySheet = utils.aoa_to_sheet([
    [
      "점검 여부",
      "유형",
      "규칙명",
      "조건 학년",
      "조건 학기",
      "조건 과목",
      "필수 학년",
      "필수 학기",
      "필수 과목",
      "비교 방식",
      "기준 개수",
      "전입/외부 포함"
    ],
    ...detailedConstraintSummaryRows(input.detailedConstraintRules)
  ]);
  const detailedSubjectSheet = utils.aoa_to_sheet([
    ["규칙명", "학년", "학기", "과목명"],
    ...detailedConstraintSubjectRows(input.detailedConstraintRules)
  ]);

  settingsSheet["!cols"] = [28, 30, 14, 18].map((wch) => ({ wch }));
  prerequisiteSheet["!cols"] = [14, 24, 24, 14, 18].map((wch) => ({ wch }));
  detailedSummarySheet["!cols"] = [
    14,
    14,
    24,
    12,
    12,
    24,
    12,
    12,
    24,
    20,
    12,
    18
  ].map((wch) => ({ wch }));
  detailedSubjectSheet["!cols"] = [24, 10, 10, 24].map((wch) => ({ wch }));

  utils.book_append_sheet(workbook, settingsSheet, "점검설정");
  utils.book_append_sheet(workbook, prerequisiteSheet, "위계설정");
  utils.book_append_sheet(workbook, detailedSummarySheet, "세부제약");
  utils.book_append_sheet(workbook, detailedSubjectSheet, "기타제한과목");

  addInstructionSheet(workbook, [
    ["항목", "작성 방법"],
    ["점검설정", "첫 번째 시트에서 각 검사별 사용 여부와 전입/외부 포함 여부를 예/아니오로 입력합니다."],
    ["위계설정", "과목 위계 점검에 필요한 선이수/후이수 과목과 병행 허용 여부를 입력합니다."],
    ["세부제약", "연계과목 또는 기타제한 규칙을 입력합니다."],
    ["기타제한과목", "세부제약 시트의 기타제한 규칙명에 연결할 과목 목록을 입력합니다."]
  ]);

  return workbook;
}

export function parseExternalCourseTemplateWorkbook(
  workbook: WorkBook,
  currentStudents: readonly Student[]
): ExternalCourseTemplateParseResult {
  const matrix = firstSheetMatrix(workbook, "전입/외부 이수");
  const { headerRowIndex, columnMap } = findHeaderRow(
    matrix,
    externalCourseHeaderAliases,
    ["grade", "semester", "studentName", "subjectName", "credits", "sourceType"],
    "전입/외부 이수"
  );
  const issues: ParseIssue[] = [];
  const inputs: ExternalCourseInput[] = [];
  const nextStudents = [...currentStudents];
  const createdStudents: Student[] = [];

  matrix.slice(headerRowIndex + 1).forEach((row, offset) => {
    if (!rowHasContent(row)) {
      return;
    }

    const rowNumber = headerRowIndex + offset + 2;
    const sourceStudentNo = compactString(valueAt(row, columnMap.studentNo));
    const grade = parseGrade(valueAt(row, columnMap.grade));
    const semester = parseSemesterTerm(valueAt(row, columnMap.semester));
    const classNo = compactString(valueAt(row, columnMap.classNo));
    const number = compactString(valueAt(row, columnMap.number));
    const studentName = compactString(valueAt(row, columnMap.studentName));
    const subjectName = compactString(valueAt(row, columnMap.subjectName));
    const credits = toCreditNumber(valueAt(row, columnMap.credits));
    const sourceType = parseExternalCourseSourceType(
      valueAt(row, columnMap.sourceType)
    );
    const rowIssues: string[] = [];

    if (!grade || !semester) {
      rowIssues.push("학년 또는 학기 값을 찾지 못했습니다.");
    }

    if (!studentName) {
      rowIssues.push("학생 이름을 입력하세요.");
    }

    if (!subjectName) {
      rowIssues.push("과목명을 입력하세요.");
    }

    if (credits === undefined) {
      rowIssues.push("학점을 숫자로 입력하세요.");
    }

    if (!sourceType) {
      rowIssues.push("출처는 전입 또는 외부이수로 입력하세요.");
    }

    if (rowIssues.length > 0 || !grade || !semester || credits === undefined || !sourceType) {
      issues.push({ rowNumber, message: rowIssues.join(" ") });
      return;
    }

    const target: Semester = { grade, semester };
    const identifier = studentIdentifier({
      target,
      sourceStudentNo,
      classNo,
      number,
      name: studentName
    });

    if (!identifier.studentId || !identifier.studentNo) {
      issues.push({
        rowNumber,
        message: "학번 또는 반/번호/이름 식별 정보를 입력하세요."
      });
      return;
    }

    let student = findMatchingStudent(nextStudents, {
      studentNo: identifier.studentNo,
      classNo,
      number,
      name: studentName
    });

    if (!student) {
      student = {
        studentId: identifier.studentId,
        studentNo: identifier.studentNo,
        name: studentName,
        currentClassNo: classNo || undefined,
        currentNumber: number || undefined
      };
      nextStudents.push(student);
      createdStudents.push(student);
    }

    const normalizedSubjectName = normalizeSubjectName(subjectName);

    inputs.push({
      id: `external-template-${student.studentId}-${target.grade}-${target.semester}-${normalizedSubjectName}-${rowNumber}`,
      studentId: student.studentId,
      studentNo: student.studentNo,
      studentName: student.name,
      target,
      subjectName,
      normalizedSubjectName,
      subjectGroup: compactString(valueAt(row, columnMap.subjectGroup)) || undefined,
      selectionType:
        compactString(valueAt(row, columnMap.selectionType)) || undefined,
      groupType: compactString(valueAt(row, columnMap.groupType)) || undefined,
      credits,
      sourceType,
      sourceName: compactString(valueAt(row, columnMap.sourceName)) || undefined,
      memo: compactString(valueAt(row, columnMap.memo)) || undefined,
      updatedAt: new Date().toISOString()
    });
  });

  if (issues.length > 0) {
    summarizeIssues("전입/외부 이수", issues);
  }

  if (inputs.length === 0) {
    throw new Error("전입/외부 이수 템플릿에 가져올 행이 없습니다.");
  }

  return {
    inputs,
    students: sortStudents(nextStudents),
    createdStudents
  };
}

export function parsePrerequisiteRuleTemplateWorkbook(
  workbook: WorkBook
): PrerequisiteRuleTemplateParseResult {
  const matrix = workbook.Sheets["위계설정"]
    ? sheetMatrixByName(workbook, "위계설정", "위계 설정")
    : firstSheetMatrix(workbook, "위계 설정");
  const { headerRowIndex, columnMap } = findHeaderRow(
    matrix,
    prerequisiteRuleHeaderAliases,
    [
      "enabled",
      "beforeSubjectName",
      "afterSubjectName",
      "allowConcurrent",
      "includeExternalInputs"
    ],
    "위계 설정"
  );
  const issues: ParseIssue[] = [];
  const rules: PrerequisiteRule[] = [];

  matrix.slice(headerRowIndex + 1).forEach((row, offset) => {
    if (!rowHasContent(row)) {
      return;
    }

    const rowNumber = headerRowIndex + offset + 2;
    const beforeSubjectName = compactString(
      valueAt(row, columnMap.beforeSubjectName)
    );
    const afterSubjectName = compactString(valueAt(row, columnMap.afterSubjectName));
    const enabled = parseRequiredBoolean(
      valueAt(row, columnMap.enabled),
      "점검 여부",
      issues,
      rowNumber
    );
    const allowConcurrent = parseRequiredBoolean(
      valueAt(row, columnMap.allowConcurrent),
      "병행 허용",
      issues,
      rowNumber
    );
    const includeExternalInputs = parseRequiredBoolean(
      valueAt(row, columnMap.includeExternalInputs),
      "전입/외부 포함",
      issues,
      rowNumber
    );

    if (!beforeSubjectName) {
      issues.push({ rowNumber, message: "선이수 과목을 입력하세요." });
    }

    if (!afterSubjectName) {
      issues.push({ rowNumber, message: "후이수 과목을 입력하세요." });
    }

    if (
      !beforeSubjectName ||
      !afterSubjectName ||
      enabled === undefined ||
      allowConcurrent === undefined ||
      includeExternalInputs === undefined
    ) {
      return;
    }

    const beforeNormalizedSubjectName = normalizeSubjectName(beforeSubjectName);
    const afterNormalizedSubjectName = normalizeSubjectName(afterSubjectName);

    rules.push({
      id: `template-prerequisite-${beforeNormalizedSubjectName}-${afterNormalizedSubjectName}-${rowNumber}`,
      beforeSubjectName,
      beforeNormalizedSubjectName,
      afterSubjectName,
      afterNormalizedSubjectName,
      status: enabled ? "active" : "disabled",
      allowConcurrent,
      includeExternalInputsOverride: includeExternalInputs,
      source: "manual",
      updatedAt: new Date().toISOString()
    });
  });

  if (issues.length > 0) {
    summarizeIssues("위계 설정", issues);
  }

  if (rules.length === 0) {
    throw new Error("위계 설정 템플릿에 가져올 행이 없습니다.");
  }

  return { rules };
}

function detailedConstraintSubjectMapFromWorkbook(
  workbook: WorkBook
): Map<string, DetailedConstraintSubject[]> {
  const sheet = workbook.Sheets["기타제한과목"];
  const subjectsByRuleName = new Map<string, DetailedConstraintSubject[]>();

  if (!sheet) {
    return subjectsByRuleName;
  }

  const matrix = utils.sheet_to_json<unknown[]>(sheet, {
    header: 1,
    blankrows: false,
    defval: ""
  });
  const { headerRowIndex, columnMap } = findHeaderRow(
    matrix,
    detailedConstraintSubjectHeaderAliases,
    ["name", "grade", "semester", "subjectName"],
    "기타제한과목"
  );
  const issues: ParseIssue[] = [];

  matrix.slice(headerRowIndex + 1).forEach((row, offset) => {
    if (!rowHasContent(row)) {
      return;
    }

    const rowNumber = headerRowIndex + offset + 2;
    const name = compactString(valueAt(row, columnMap.name));
    const grade = parseGrade(valueAt(row, columnMap.grade));
    const semester = parseSemesterTerm(valueAt(row, columnMap.semester));
    const subjectName = compactString(valueAt(row, columnMap.subjectName));
    const rowIssues: string[] = [];

    if (!name) {
      rowIssues.push("규칙명을 입력하세요.");
    }

    if (!grade || !semester) {
      rowIssues.push("학년 또는 학기 값을 찾지 못했습니다.");
    }

    if (!subjectName) {
      rowIssues.push("과목명을 입력하세요.");
    }

    if (rowIssues.length > 0 || !name || !grade || !semester) {
      issues.push({ rowNumber, message: rowIssues.join(" ") });
      return;
    }

    const subjects = subjectsByRuleName.get(name) ?? [];

    subjects.push({
      target: { grade, semester },
      subjectName,
      normalizedSubjectName: normalizeSubjectName(subjectName)
    });
    subjectsByRuleName.set(name, subjects);
  });

  if (issues.length > 0) {
    summarizeIssues("기타제한과목", issues);
  }

  return subjectsByRuleName;
}

export function parseDetailedConstraintRuleTemplateWorkbook(
  workbook: WorkBook
): DetailedConstraintRuleTemplateParseResult {
  const matrix = sheetMatrixByName(workbook, "세부제약", "세부 제약");
  const { headerRowIndex, columnMap } = findHeaderRow(
    matrix,
    detailedConstraintHeaderAliases,
    ["enabled", "type", "name", "includeExternalInputs"],
    "세부 제약"
  );
  const subjectsByRuleName = detailedConstraintSubjectMapFromWorkbook(workbook);
  const issues: ParseIssue[] = [];
  const rules: DetailedConstraintRule[] = [];
  const usedRuleNames = new Set<string>();
  const now = new Date().toISOString();

  matrix.slice(headerRowIndex + 1).forEach((row, offset) => {
    if (!rowHasContent(row)) {
      return;
    }

    const rowNumber = headerRowIndex + offset + 2;
    const enabled = parseRequiredBoolean(
      valueAt(row, columnMap.enabled),
      "점검 여부",
      issues,
      rowNumber
    );
    const type = parseDetailedConstraintType(valueAt(row, columnMap.type));
    const name = compactString(valueAt(row, columnMap.name));
    const includeExternalInputs = parseRequiredBoolean(
      valueAt(row, columnMap.includeExternalInputs),
      "전입/외부 포함",
      issues,
      rowNumber
    );
    const rowIssues: string[] = [];

    if (!type) {
      rowIssues.push("유형은 연계과목 또는 기타제한으로 입력하세요.");
    }

    if (!name) {
      rowIssues.push("규칙명을 입력하세요.");
    } else if (usedRuleNames.has(name)) {
      rowIssues.push("규칙명이 중복되었습니다.");
    }

    if (!type || !name || enabled === undefined || includeExternalInputs === undefined) {
      if (rowIssues.length > 0) {
        issues.push({ rowNumber, message: rowIssues.join(" ") });
      }
      return;
    }

    if (rowIssues.length > 0) {
      issues.push({ rowNumber, message: rowIssues.join(" ") });
      return;
    }

    usedRuleNames.add(name);

    if (type === "linkedSubject") {
      const triggerGrade = parseGrade(valueAt(row, columnMap.triggerGrade));
      const triggerSemester = parseSemesterTerm(
        valueAt(row, columnMap.triggerSemester)
      );
      const triggerSubjectName = compactString(
        valueAt(row, columnMap.triggerSubjectName)
      );
      const requiredGrade = parseGrade(valueAt(row, columnMap.requiredGrade));
      const requiredSemester = parseSemesterTerm(
        valueAt(row, columnMap.requiredSemester)
      );
      const requiredSubjectName = compactString(
        valueAt(row, columnMap.requiredSubjectName)
      );
      const linkedIssues: string[] = [];

      if (!triggerGrade || !triggerSemester || !triggerSubjectName) {
        linkedIssues.push("조건 학년/학기/과목을 모두 입력하세요.");
      }

      if (!requiredGrade || !requiredSemester || !requiredSubjectName) {
        linkedIssues.push("필수 학년/학기/과목을 모두 입력하세요.");
      }

      if (
        linkedIssues.length > 0 ||
        !triggerGrade ||
        !triggerSemester ||
        !requiredGrade ||
        !requiredSemester
      ) {
        issues.push({ rowNumber, message: linkedIssues.join(" ") });
        return;
      }

      rules.push({
        id: `template-detailed-linked-${normalizedKey(name)}-${rowNumber}`,
        type: "linkedSubject",
        name,
        status: enabled ? "active" : "disabled",
        includeExternalInputsOverride: includeExternalInputs,
        source: "template",
        trigger: {
          target: { grade: triggerGrade, semester: triggerSemester },
          subjectName: triggerSubjectName,
          normalizedSubjectName: normalizeSubjectName(triggerSubjectName)
        },
        required: {
          target: { grade: requiredGrade, semester: requiredSemester },
          subjectName: requiredSubjectName,
          normalizedSubjectName: normalizeSubjectName(requiredSubjectName)
        },
        updatedAt: now
      });
      return;
    }

    const comparison = parseSubjectCountComparison(
      valueAt(row, columnMap.comparison)
    );
    const count = parseNonNegativeInteger(valueAt(row, columnMap.count));
    const subjects = subjectsByRuleName.get(name) ?? [];
    const countIssues: string[] = [];

    if (!comparison) {
      countIssues.push("비교 방식은 n개 이상이면 검출 또는 n개 이하이면 검출로 입력하세요.");
    }

    if (count === undefined) {
      countIssues.push("기준 개수를 0 이상의 정수로 입력하세요.");
    }

    if (subjects.length === 0) {
      countIssues.push("기타제한과목 시트에 해당 규칙명의 과목을 입력하세요.");
    }

    if (countIssues.length > 0 || !comparison || count === undefined) {
      issues.push({ rowNumber, message: countIssues.join(" ") });
      return;
    }

    rules.push({
      id: `template-detailed-count-${normalizedKey(name)}-${rowNumber}`,
      type: "subjectCount",
      name,
      status: enabled ? "active" : "disabled",
      includeExternalInputsOverride: includeExternalInputs,
      source: "template",
      subjects,
      comparison,
      count,
      updatedAt: now
    });
  });

  if (issues.length > 0) {
    summarizeIssues("세부 제약", issues);
  }

  if (rules.length === 0) {
    throw new Error("세부 제약 템플릿에 가져올 행이 없습니다.");
  }

  return { rules };
}

function parseValidationRuleSettingsTemplateSheet(
  workbook: WorkBook,
  currentSettings: readonly ValidationRuleSetting[]
): ValidationRuleSetting[] {
  const matrix = sheetMatrixByName(workbook, "점검설정", "점검 설정");
  const { headerRowIndex, columnMap } = findHeaderRow(
    matrix,
    validationRuleSettingHeaderAliases,
    ["enabled", "includeExternalInputs"],
    "점검 설정"
  );
  const issues: ParseIssue[] = [];
  const parsedSettings = new Map<
    ValidationRuleId,
    Pick<ValidationRuleSetting, "enabled" | "includeExternalInputs">
  >();

  matrix.slice(headerRowIndex + 1).forEach((row, offset) => {
    if (!rowHasContent(row)) {
      return;
    }

    const rowNumber = headerRowIndex + offset + 2;
    const ruleId = validationRuleIdFromTemplateRow({
      ruleId: valueAt(row, columnMap.ruleId),
      label: valueAt(row, columnMap.label)
    });
    const enabled = parseRequiredBoolean(
      valueAt(row, columnMap.enabled),
      "사용 여부",
      issues,
      rowNumber
    );
    const includeExternalInputs = parseRequiredBoolean(
      valueAt(row, columnMap.includeExternalInputs),
      "전입/외부 포함",
      issues,
      rowNumber
    );

    if (!ruleId) {
      issues.push({
        rowNumber,
        message: "검사 ID 또는 검사명을 현재 점검 항목과 맞게 입력하세요."
      });
      return;
    }

    if (parsedSettings.has(ruleId)) {
      issues.push({
        rowNumber,
        message: `${validationRuleLabels[ruleId]} 검사가 중복되었습니다.`
      });
      return;
    }

    if (enabled === undefined || includeExternalInputs === undefined) {
      return;
    }

    parsedSettings.set(ruleId, { enabled, includeExternalInputs });
  });

  if (parsedSettings.size === 0) {
    issues.push({
      rowNumber: headerRowIndex + 1,
      message: "가져올 점검 설정 행이 없습니다."
    });
  }

  if (issues.length > 0) {
    summarizeIssues("점검 설정", issues);
  }

  const now = new Date().toISOString();

  return currentSettings.map((setting) => {
    const parsed = parsedSettings.get(setting.id);

    return parsed
      ? {
          ...setting,
          ...parsed,
          updatedAt: now
        }
      : setting;
  });
}

export function parseValidationRulesTemplateWorkbook(
  workbook: WorkBook,
  currentSettings: readonly ValidationRuleSetting[]
): ValidationRulesTemplateParseResult {
  return {
    validationRuleSettings: parseValidationRuleSettingsTemplateSheet(
      workbook,
      currentSettings
    ),
    prerequisiteRules: parsePrerequisiteRuleTemplateWorkbook(workbook).rules,
    detailedConstraintRules:
      parseDetailedConstraintRuleTemplateWorkbook(workbook).rules
  };
}
