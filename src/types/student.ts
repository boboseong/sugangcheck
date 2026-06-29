import type { SemesterMap } from "./semester";

export type Student = {
  studentId: string;
  studentNo: string;
  name: string;
  currentClassNo?: string;
  currentNumber?: string;
  gender?: string;
};

export type SemesterPresenceValue = "unknown" | "present" | "absent";

export type StudentSemesterPresence = {
  studentId: string;
  studentNo?: string;
  name?: string;
  semesters: SemesterMap<SemesterPresenceValue>;
};
