import JSZip from "jszip";
import { utils, write, type WorkBook } from "xlsx";
import type { CourseSelectionRecord } from "../types/courseSelection";
import type { Semester } from "../types/semester";
import type { Student } from "../types/student";
import type { ValidationError } from "../types/validation";
import { compareSemesters, semesterLabel } from "../utils/semester";
import { validationRuleLabel } from "../utils/validationRuleLabels";

export const teacherShareSummaryEntryName = "00_담당자용_전체요약.xlsx";

type ClassShareGroup = {
  classNo: string;
  label: string;
  students: Student[];
  records: CourseSelectionRecord[];
  errors: ValidationError[];
};

type TeacherSharePackageInput = {
  projectName: string;
  generatedAt: Date;
  students: readonly Student[];
  courseSelectionRecords: readonly CourseSelectionRecord[];
  validationErrors: readonly ValidationError[];
};

function safeFileNamePart(value: string): string {
  return value.trim().replace(/[\\/:*?"<>|]/g, "_") || "미지정";
}

function formatDateYYYYMMDD(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}${month}${day}`;
}

export function teacherSharePackageFileName(generatedAt = new Date()): string {
  return `교사용_수강신청공유_${formatDateYYYYMMDD(generatedAt)}.zip`;
}

function teacherShareClassFileName(group: ClassShareGroup): string {
  return `${safeFileNamePart(group.label)}_수강신청_오류공유.xlsx`;
}

function workbookBuffer(workbook: WorkBook): ArrayBuffer {
  return write(workbook, {
    bookType: "xlsx",
    type: "array"
  }) as ArrayBuffer;
}

function appendSheet(workbook: WorkBook, name: string, rows: unknown[][], widths: number[]) {
  const sheet = utils.aoa_to_sheet(rows);

  sheet["!cols"] = widths.map((wch) => ({ wch }));
  utils.book_append_sheet(workbook, sheet, name);
}

function classLabel(classNo: string): string {
  return classNo ? `${classNo}반` : "미지정반";
}

function studentClassNo(student?: Student): string {
  return student?.currentClassNo ? String(student.currentClassNo) : "";
}

function compareClassNo(left: string, right: string): number {
  if (!left && !right) {
    return 0;
  }

  if (!left) {
    return 1;
  }

  if (!right) {
    return -1;
  }

  return left.localeCompare(right, "ko", { numeric: true });
}

function compareStudentLike(
  left: Pick<Student, "currentClassNo" | "currentNumber" | "name" | "studentNo">,
  right: Pick<Student, "currentClassNo" | "currentNumber" | "name" | "studentNo">
): number {
  const classCompare = compareClassNo(
    String(left.currentClassNo ?? ""),
    String(right.currentClassNo ?? "")
  );

  if (classCompare !== 0) {
    return classCompare;
  }

  const numberCompare = String(left.currentNumber ?? "").localeCompare(
    String(right.currentNumber ?? ""),
    "ko",
    { numeric: true }
  );

  if (numberCompare !== 0) {
    return numberCompare;
  }

  const nameCompare = left.name.localeCompare(right.name, "ko");

  if (nameCompare !== 0) {
    return nameCompare;
  }

  return left.studentNo.localeCompare(right.studentNo, "ko", { numeric: true });
}

function compareStudentRecords(
  left: CourseSelectionRecord,
  right: CourseSelectionRecord,
  studentById: ReadonlyMap<string, Student>
): number {
  const leftStudent = studentById.get(left.studentId);
  const rightStudent = studentById.get(right.studentId);
  const studentCompare = compareStudentLike(
    {
      currentClassNo: leftStudent?.currentClassNo,
      currentNumber: leftStudent?.currentNumber,
      name: left.studentName,
      studentNo: left.studentNo
    },
    {
      currentClassNo: rightStudent?.currentClassNo,
      currentNumber: rightStudent?.currentNumber,
      name: right.studentName,
      studentNo: right.studentNo
    }
  );

  if (studentCompare !== 0) {
    return studentCompare;
  }

  return (
    compareSemesters(left.target, right.target) ||
    left.subjectName.localeCompare(right.subjectName, "ko")
  );
}

function compareErrors(
  left: ValidationError,
  right: ValidationError,
  studentById: ReadonlyMap<string, Student>
): number {
  const leftStudent = studentById.get(left.studentId);
  const rightStudent = studentById.get(right.studentId);
  const studentCompare = compareStudentLike(
    {
      currentClassNo: leftStudent?.currentClassNo,
      currentNumber: leftStudent?.currentNumber,
      name: left.studentName,
      studentNo: left.studentNo
    },
    {
      currentClassNo: rightStudent?.currentClassNo,
      currentNumber: rightStudent?.currentNumber,
      name: right.studentName,
      studentNo: right.studentNo
    }
  );

  if (studentCompare !== 0) {
    return studentCompare;
  }

  return (
    compareOptionalSemester(left.semester, right.semester) ||
    validationRuleLabel(left.type).localeCompare(validationRuleLabel(right.type), "ko") ||
    left.message.localeCompare(right.message, "ko")
  );
}

function compareOptionalSemester(left?: Semester, right?: Semester): number {
  if (left && right) {
    return compareSemesters(left, right);
  }

  if (left) {
    return -1;
  }

  if (right) {
    return 1;
  }

  return 0;
}

function uniqueText(values: readonly (string | undefined)[]): string {
  return [...new Set(values.map((value) => value?.trim()).filter((value): value is string => Boolean(value)))]
    .sort((left, right) => left.localeCompare(right, "ko"))
    .join(", ");
}

function buildClassGroups(input: TeacherSharePackageInput): ClassShareGroup[] {
  const studentById = new Map(input.students.map((student) => [student.studentId, student]));
  const classNos = new Set<string>();

  input.students.forEach((student) => classNos.add(studentClassNo(student)));
  input.courseSelectionRecords.forEach((record) =>
    classNos.add(studentClassNo(studentById.get(record.studentId)))
  );
  input.validationErrors.forEach((error) =>
    classNos.add(studentClassNo(studentById.get(error.studentId)))
  );

  return [...classNos]
    .sort(compareClassNo)
    .map((classNo) => {
      const students = input.students
        .filter((student) => studentClassNo(student) === classNo)
        .sort(compareStudentLike);
      const records = input.courseSelectionRecords
        .filter((record) => studentClassNo(studentById.get(record.studentId)) === classNo)
        .sort((left, right) => compareStudentRecords(left, right, studentById));
      const errors = input.validationErrors
        .filter((error) => studentClassNo(studentById.get(error.studentId)) === classNo)
        .sort((left, right) => compareErrors(left, right, studentById));

      return {
        classNo,
        label: classLabel(classNo),
        students,
        records,
        errors
      };
    });
}

function instructionRows(input: {
  projectName: string;
  generatedAt: Date;
  group?: ClassShareGroup;
}): unknown[][] {
  return [
    ["항목", "내용"],
    ["프로젝트", input.projectName],
    ["생성일시", input.generatedAt.toLocaleString("ko-KR")],
    ["공유 범위", input.group ? input.group.label : "전체"],
    [
      "개인정보",
      "이 파일에는 학생 이름과 학번이 포함되어 있으므로 필요한 교사에게만 공유하세요."
    ],
    [
      "확인상태",
      "교사는 오류명렬 또는 오류학생 시트의 확인상태와 교사메모 칸에 확인 결과를 적습니다."
    ]
  ];
}

function courseSelectionRows(
  records: readonly CourseSelectionRecord[],
  studentById: ReadonlyMap<string, Student>
): unknown[][] {
  return records.map((record) => {
    const student = studentById.get(record.studentId);

    return [
      record.studentNo,
      record.studentName,
      student?.currentClassNo ?? "",
      student?.currentNumber ?? "",
      record.target.grade,
      record.target.semester,
      record.subjectName,
      record.subjectGroup,
      record.selectionType,
      record.groupType ?? "",
      record.credits
    ];
  });
}

function errorListRows(input: {
  errors: readonly ValidationError[];
  studentById: ReadonlyMap<string, Student>;
  includeRecordIds: boolean;
}): unknown[][] {
  return input.errors.map((error, index) => {
    const student = input.studentById.get(error.studentId);
    const base = [
      index + 1,
      validationRuleLabel(error.type),
      error.studentNo,
      error.studentName,
      student?.currentClassNo ?? "",
      student?.currentNumber ?? "",
      error.semester?.grade ?? "",
      error.semester?.semester ?? "",
      error.message,
      (error.relatedSubjectNames ?? []).join(", "),
      error.fixHint ?? ""
    ];

    return input.includeRecordIds
      ? [...base, error.relatedRecordIds.join(", ")]
      : [...base, "", ""];
  });
}

function errorStudentRows(
  students: readonly Student[],
  errors: readonly ValidationError[]
): unknown[][] {
  const errorsByStudentId = new Map<string, ValidationError[]>();
  const studentById = new Map(students.map((student) => [student.studentId, student]));

  errors.forEach((error) => {
    const studentErrors = errorsByStudentId.get(error.studentId) ?? [];

    studentErrors.push(error);
    errorsByStudentId.set(error.studentId, studentErrors);
  });

  return [...errorsByStudentId.entries()]
    .map(([studentId, studentErrors]) => {
      const firstError = studentErrors[0];
      const student = studentById.get(studentId) ?? {
        studentId,
        studentNo: firstError?.studentNo ?? "",
        name: firstError?.studentName ?? "",
        currentClassNo: "",
        currentNumber: ""
      };

      return [
        student.studentNo,
        student.name,
        student.currentClassNo ?? "",
        student.currentNumber ?? "",
        studentErrors.length,
        uniqueText(studentErrors.map((error) => validationRuleLabel(error.type))),
        uniqueText(studentErrors.flatMap((error) => error.relatedSubjectNames ?? [])),
        "",
        ""
      ];
    })
    .sort((left, right) =>
      String(left[2] ?? "").localeCompare(String(right[2] ?? ""), "ko", {
        numeric: true
      }) ||
      String(left[3] ?? "").localeCompare(String(right[3] ?? ""), "ko", {
        numeric: true
      }) ||
      String(left[1] ?? "").localeCompare(String(right[1] ?? ""), "ko")
    );
}

export function createTeacherShareClassWorkbook(input: {
  projectName: string;
  generatedAt: Date;
  group: ClassShareGroup;
  studentById: ReadonlyMap<string, Student>;
}): WorkBook {
  const workbook = utils.book_new();

  appendSheet(workbook, "작성안내", instructionRows(input), [18, 80]);
  appendSheet(
    workbook,
    "오류학생",
    [
      [
        "학번",
        "학생명",
        "반",
        "번호",
        "오류건수",
        "오류유형",
        "관련과목",
        "확인상태",
        "교사메모"
      ],
      ...errorStudentRows(input.group.students, input.group.errors)
    ],
    [14, 16, 8, 8, 10, 32, 40, 14, 40]
  );
  appendSheet(
    workbook,
    "오류명렬",
    [
      [
        "번호",
        "유형",
        "학번",
        "학생명",
        "반",
        "번호",
        "학년",
        "학기",
        "오류 메시지",
        "관련 과목",
        "수정 안내",
        "확인상태",
        "교사메모"
      ],
      ...errorListRows({
        errors: input.group.errors,
        studentById: input.studentById,
        includeRecordIds: false
      })
    ],
    [8, 24, 14, 16, 8, 8, 8, 8, 48, 28, 40, 14, 40]
  );
  appendSheet(
    workbook,
    "수강신청결과",
    [
      [
        "학번",
        "학생명",
        "반",
        "번호",
        "학년",
        "학기",
        "과목명",
        "교과군",
        "선택구분",
        "과목구분",
        "학점"
      ],
      ...courseSelectionRows(input.group.records, input.studentById)
    ],
    [14, 16, 8, 8, 8, 8, 24, 16, 14, 14, 8]
  );

  return workbook;
}

function summaryByClassRows(groups: readonly ClassShareGroup[]): unknown[][] {
  return groups.map((group) => [
    group.label,
    group.students.length,
    new Set(group.records.map((record) => record.studentId)).size,
    group.records.length,
    new Set(group.errors.map((error) => error.studentId)).size,
    group.errors.length
  ]);
}

function errorTypeSummaryRows(errors: readonly ValidationError[]): unknown[][] {
  const counts = new Map<string, number>();

  errors.forEach((error) => {
    const label = validationRuleLabel(error.type);

    counts.set(label, (counts.get(label) ?? 0) + 1);
  });

  return [...counts.entries()]
    .sort((left, right) => left[0].localeCompare(right[0], "ko"))
    .map(([label, count]) => [label, count]);
}

export function createTeacherShareSummaryWorkbook(input: TeacherSharePackageInput): WorkBook {
  const workbook = utils.book_new();
  const studentById = new Map(input.students.map((student) => [student.studentId, student]));
  const groups = buildClassGroups(input);

  appendSheet(workbook, "작성안내", instructionRows(input), [18, 80]);
  appendSheet(
    workbook,
    "반별요약",
    [
      ["반", "학생 수", "수강신청 학생 수", "수강신청 행 수", "오류 학생 수", "오류 건수"],
      ...summaryByClassRows(groups)
    ],
    [14, 12, 18, 16, 14, 12]
  );
  appendSheet(
    workbook,
    "오류유형별",
    [["유형", "건수"], ...errorTypeSummaryRows(input.validationErrors)],
    [28, 12]
  );
  appendSheet(
    workbook,
    "전체오류명렬",
    [
      [
        "번호",
        "유형",
        "학번",
        "학생명",
        "반",
        "번호",
        "학년",
        "학기",
        "오류 메시지",
        "관련 과목",
        "수정 안내",
        "관련 기록"
      ],
      ...errorListRows({
        errors: [...input.validationErrors].sort((left, right) =>
          compareErrors(left, right, studentById)
        ),
        studentById,
        includeRecordIds: true
      })
    ],
    [8, 24, 14, 16, 8, 8, 8, 8, 48, 28, 40, 28]
  );
  appendSheet(
    workbook,
    "전체수강신청결과",
    [
      [
        "학번",
        "학생명",
        "반",
        "번호",
        "학년",
        "학기",
        "과목명",
        "교과군",
        "선택구분",
        "과목구분",
        "학점"
      ],
      ...courseSelectionRows(
        [...input.courseSelectionRecords].sort((left, right) =>
          compareStudentRecords(left, right, studentById)
        ),
        studentById
      )
    ],
    [14, 16, 8, 8, 8, 8, 24, 16, 14, 14, 8]
  );

  return workbook;
}

export async function createTeacherSharePackage(
  input: TeacherSharePackageInput
): Promise<Blob> {
  const zip = new JSZip();
  const studentById = new Map(input.students.map((student) => [student.studentId, student]));
  const groups = buildClassGroups(input);

  zip.file(teacherShareSummaryEntryName, workbookBuffer(createTeacherShareSummaryWorkbook(input)));

  groups.forEach((group) => {
    zip.file(
      teacherShareClassFileName(group),
      workbookBuffer(
        createTeacherShareClassWorkbook({
          projectName: input.projectName,
          generatedAt: input.generatedAt,
          group,
          studentById
        })
      )
    );
  });

  return zip.generateAsync({
    type: "blob",
    compression: "DEFLATE",
    compressionOptions: {
      level: 6
    }
  });
}
