import { describe, expect, it } from "vitest";
import { utils } from "xlsx";
import { parseCourseSelectionWorkbook } from "../parsers/parseCourseSelectionFile";
import { parseOperatingSubjectWorkbook } from "../parsers/parseOperatingSubjectFile";
import type {
  CourseSelectionDetectedSubject,
  ParsedCourseSelectionStudent
} from "../types/CourseSelectionParseResult";
import type { ParsedCourseSelectionRow } from "../types/courseSelection";
import type { OperatingSubject } from "../types/subject";
import {
  createGeneratedCourseSelectionRows,
  findMissingOperatingSubjectSelections
} from "./courseSelectionOperatingSubjectCompletion";

const target = { grade: 2, semester: 1 } as const;

function operatingSubject(input: {
  id: string;
  subjectName: string;
  normalizedSubjectName: string;
  choiceGroup: string;
}): OperatingSubject {
  return {
    ...input,
    target,
    subjectGroup: "과학",
    selectionType: "진로",
    groupType: "보통교과",
    credits: 3,
    masterMatchStatus: "matched"
  };
}

function detectedSubject(input: {
  subjectName: string;
  normalizedSubjectName: string;
}): CourseSelectionDetectedSubject {
  return {
    ...input,
    columnIndex: 4,
    columnNumber: 5
  };
}

function student(input: {
  studentId: string;
  studentNo: string;
  studentName: string;
}): ParsedCourseSelectionStudent {
  return {
    ...input,
    classNo: "1",
    number: input.studentNo.slice(-2),
    sourceRowNumber: Number(input.studentNo.slice(-2)) + 1
  };
}

describe("courseSelectionOperatingSubjectCompletion", () => {
  it("finds operating subjects missing from course-selection subject headers", () => {
    const missing = findMissingOperatingSubjectSelections({
      target,
      detectedSubjects: [
        detectedSubject({
          subjectName: "물리학",
          normalizedSubjectName: "물리학"
        })
      ],
      operatingSubjects: [
        operatingSubject({
          id: "physics",
          subjectName: "물리학",
          normalizedSubjectName: "물리학",
          choiceGroup: "학생선택"
        }),
        operatingSubject({
          id: "korean-history",
          subjectName: "한국사",
          normalizedSubjectName: "한국사",
          choiceGroup: "학교 지정"
        }),
        {
          ...operatingSubject({
            id: "other-semester",
            subjectName: "화학",
            normalizedSubjectName: "화학",
            choiceGroup: "학교 지정"
          }),
          target: { grade: 2, semester: 2 }
        }
      ]
    });

    expect(missing).toHaveLength(1);
    expect(missing[0]).toMatchObject({
      id: "korean-history",
      subjectName: "한국사",
      choiceGroup: "학교 지정"
    });
  });

  it("detects 공통국어1 from input1-shaped operating and course-selection files", () => {
    const operatingWorkbook = utils.book_new();
    const operatingSheet = utils.aoa_to_sheet([
      [
        "학년",
        "학기",
        "과목코드(NEIS)",
        "교과목",
        "그룹구분",
        "그룹명",
        "영역/분류",
        "운영단위",
        "수강인원",
        "등록일"
      ],
      [1, "1학기", "", "통합과학1", "학교지정", "", "교과>과학", 4, 214, ""],
      [1, "1학기", "", "과학탐구실험1", "학교지정", "", "교과>과학", 1, 214, ""],
      [1, "1학기", "", "진로와 직업", "학교지정", "", "교과>교양", 2, 214, ""],
      [1, "1학기", "", "공통국어1", "학교지정", "", "교과>국어", 4, 214, ""],
      [1, "1학기", "", "통합사회1", "학교지정", "", "교과>사회", 4, 214, ""],
      [1, "1학기", "", "한국사1", "학교지정", "", "교과>사회", 3, 214, ""],
      [1, "1학기", "", "공통수학1", "학교지정", "", "교과>수학", 4, 214, ""],
      [1, "1학기", "", "공통영어1", "학교지정", "", "교과>영어", 4, 214, ""],
      [
        1,
        "1학기",
        "",
        "음악",
        "학생선택",
        "1학년 1학기 음악미술 교차이수",
        "교과>예술",
        2,
        129,
        ""
      ],
      [
        1,
        "1학기",
        "",
        "미술",
        "학생선택",
        "1학년 1학기 음악미술 교차이수",
        "교과>예술",
        2,
        85,
        ""
      ],
      [1, "1학기", "", "체육1", "학교지정", "", "교과>체육", 2, 214, ""]
    ]);
    const courseWorkbook = utils.book_new();
    const courseSheet = utils.aoa_to_sheet([
      [
        "",
        "",
        "",
        "운영과목코드=>",
        "",
        "",
        957290,
        957291,
        957370,
        957389,
        957373,
        957299,
        957307,
        957317,
        957386,
        957382
      ],
      [
        "회원코드",
        " 학년",
        "반",
        "번호",
        "성별",
        "이름",
        "공통수학1",
        "공통영어1",
        "과학탐구실험1",
        "진로와 직업",
        "체육1",
        "통합과학1",
        "통합사회1",
        "한국사1",
        "미술",
        "음악"
      ],
      [3067541, "1", "1", "1", "남", "강은로", 1, 1, 1, 1, 1, 1, 1, 1, 1, 0]
    ]);

    utils.book_append_sheet(operatingWorkbook, operatingSheet, "Sheet1");
    utils.book_append_sheet(courseWorkbook, courseSheet, "Sheet1");

    const operatingResult = parseOperatingSubjectWorkbook(operatingWorkbook, {
      semesterImportId: "operatingSubjects-1-1",
      target: { grade: 1, semester: 1 }
    });
    const courseResult = parseCourseSelectionWorkbook(courseWorkbook, {
      semesterImportId: "courseSelections-1-1",
      target: { grade: 1, semester: 1 }
    });
    const missing = findMissingOperatingSubjectSelections({
      target: { grade: 1, semester: 1 },
      detectedSubjects: courseResult.detectedSubjects,
      operatingSubjects: operatingResult.subjects
    });

    expect(missing.map((subject) => subject.subjectName)).toEqual(["공통국어1"]);
  });

  it("creates generated completion rows for every parsed student and skips duplicates", () => {
    const students = [
      student({
        studentId: "student-1",
        studentNo: "20101",
        studentName: "김학생"
      }),
      student({
        studentId: "student-2",
        studentNo: "20102",
        studentName: "이학생"
      })
    ];
    const subject = operatingSubject({
      id: "korean-history",
      subjectName: "한국사",
      normalizedSubjectName: "한국사",
      choiceGroup: "학교 지정"
    });
    const existingRow: ParsedCourseSelectionRow = {
      id: "existing",
      semesterImportId: "courseSelections-2-1",
      studentId: "student-1",
      studentNo: "20101",
      studentName: "김학생",
      target,
      subjectName: "한국사",
      normalizedSubjectName: "한국사"
    };

    const rows = createGeneratedCourseSelectionRows({
      semesterImportId: "courseSelections-2-1",
      fileName: "수강신청.xlsx",
      sheetName: "2-1",
      target,
      students,
      subjects: [subject],
      existingRows: [existingRow]
    });

    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({
      semesterImportId: "courseSelections-2-1",
      studentId: "student-2",
      studentNo: "20102",
      studentName: "이학생",
      subjectName: "한국사",
      normalizedSubjectName: "한국사",
      credits: 3,
      sourceLocation: {
        fileName: "수강신청.xlsx",
        sheetName: "2-1",
        rowNumber: 3,
        fieldName: "운영과목 모두 이수 반영: 한국사"
      }
    });
  });
});
