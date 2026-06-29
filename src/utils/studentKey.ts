export type StudentKeyInput = {
  studentId?: string | number | null;
  studentNo?: string | number | null;
  grade?: string | number | null;
  name?: string | null;
  classNo?: string | number | null;
  number?: string | number | null;
  currentGrade?: string | number | null;
  currentClassNo?: string | number | null;
  currentNumber?: string | number | null;
};

function normalizeIdentifierPart(value: string | number | null | undefined): string {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value).normalize("NFKC").trim().replace(/\s+/g, "");
}

function normalizeNamePart(value: string | null | undefined): string {
  if (!value) {
    return "";
  }

  return value.normalize("NFKC").trim().replace(/\s+/g, "");
}

function classNoFrom(input: StudentKeyInput): string {
  return normalizeIdentifierPart(input.classNo ?? input.currentClassNo);
}

function numberFrom(input: StudentKeyInput): string {
  return normalizeIdentifierPart(input.number ?? input.currentNumber);
}

function parsePositiveIntegerPart(value: string): number | undefined {
  if (!/^\d+$/.test(value)) {
    return undefined;
  }

  const parsed = Number(value);

  return Number.isInteger(parsed) && parsed > 0 ? parsed : undefined;
}

export function createGeneratedStudentNo(input: StudentKeyInput): string {
  const grade = parsePositiveIntegerPart(
    normalizeIdentifierPart(input.grade ?? input.currentGrade)
  );
  const classNo = parsePositiveIntegerPart(classNoFrom(input));
  const number = parsePositiveIntegerPart(numberFrom(input));

  if (grade === undefined || classNo === undefined || number === undefined) {
    return "";
  }

  return String(grade * 10000 + classNo * 100 + number);
}

export function createStudentNameKey(name: string | null | undefined): string {
  return normalizeNamePart(name).toLowerCase();
}

export function createClassNumberNameKey(input: StudentKeyInput): string {
  const classNo = classNoFrom(input);
  const number = numberFrom(input);
  const name = createStudentNameKey(input.name);

  return [classNo, number, name].filter(Boolean).join(":");
}

export function createStudentAuxiliaryKey(input: StudentKeyInput): string {
  const generatedStudentNo = createGeneratedStudentNo(input);

  if (generatedStudentNo) {
    return `student-no:${generatedStudentNo.toLowerCase()}`;
  }

  const studentNo = normalizeIdentifierPart(input.studentNo);

  if (studentNo) {
    return `student-no:${studentNo.toLowerCase()}`;
  }

  const studentId = normalizeIdentifierPart(input.studentId);

  if (studentId) {
    return `student-id:${studentId.toLowerCase()}`;
  }

  const classNumberNameKey = createClassNumberNameKey(input);

  if (classNumberNameKey) {
    return `class-number-name:${classNumberNameKey}`;
  }

  return "";
}
