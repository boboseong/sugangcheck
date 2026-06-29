export type StudentReportPrintScope = "single" | "class" | "all";

export function printStudentReport(): void {
  window.print();
}

export function createStudentReportFileName(input: {
  scope: StudentReportPrintScope;
  studentName?: string;
  classNo?: string;
  createdAt?: Date;
}): string {
  const createdAt = input.createdAt ?? new Date();
  const datePart = createdAt.toISOString().slice(0, 10).replace(/-/g, "");
  const targetPart =
    input.scope === "single"
      ? input.studentName ?? "학생"
      : input.scope === "class"
        ? `${input.classNo ?? "반"}`
        : "전체";
  const safeTargetPart = targetPart.replace(/[\\/:*?"<>|]/g, "_");

  return `수강확인서_${safeTargetPart}_${datePart}.pdf`;
}
