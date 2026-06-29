import {
  createStudentReportFileName,
  printStudentReport,
  type StudentReportPrintScope
} from "./printStudentReport";

export function exportStudentReportPdf(input: {
  scope: StudentReportPrintScope;
  studentName?: string;
  classNo?: string;
}): string {
  const fileName = createStudentReportFileName(input);
  printStudentReport();
  return fileName;
}
