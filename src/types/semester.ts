export type Grade = 1 | 2 | 3;

export type SemesterTerm = 1 | 2;

export type Semester = {
  grade: Grade;
  semester: SemesterTerm;
};

export type SemesterKey = `${Grade}-${SemesterTerm}`;

export type SemesterMap<T> = Record<SemesterKey, T>;

export const semesterKeys = [
  "1-1",
  "1-2",
  "2-1",
  "2-2",
  "3-1",
  "3-2"
] as const satisfies readonly SemesterKey[];
