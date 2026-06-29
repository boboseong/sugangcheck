import { normalizeSubjectName } from "../normalizers/normalizeSubjectName";
import type { SubjectMasterItem } from "../types/subject";

export const subjectMasterVersion = "2025.06.28-subject-master" as const;

const rawSubjectMasterItems = [
  {
    "subjectName": "공통국어1",
    "groupType": "보통교과",
    "subjectGroup": "국어",
    "selectionType": "공통"
  },
  {
    "subjectName": "공통국어2",
    "groupType": "보통교과",
    "subjectGroup": "국어",
    "selectionType": "공통"
  },
  {
    "subjectName": "화법과 언어",
    "groupType": "보통교과",
    "subjectGroup": "국어",
    "selectionType": "일반"
  },
  {
    "subjectName": "독서와 작문",
    "groupType": "보통교과",
    "subjectGroup": "국어",
    "selectionType": "일반"
  },
  {
    "subjectName": "문학",
    "groupType": "보통교과",
    "subjectGroup": "국어",
    "selectionType": "일반"
  },
  {
    "subjectName": "주제 탐구 독서",
    "groupType": "보통교과",
    "subjectGroup": "국어",
    "selectionType": "진로"
  },
  {
    "subjectName": "문학과 영상",
    "groupType": "보통교과",
    "subjectGroup": "국어",
    "selectionType": "진로"
  },
  {
    "subjectName": "직무 의사소통",
    "groupType": "보통교과",
    "subjectGroup": "국어",
    "selectionType": "진로"
  },
  {
    "subjectName": "독서 토론과 글쓰기",
    "groupType": "보통교과",
    "subjectGroup": "국어",
    "selectionType": "융합"
  },
  {
    "subjectName": "매체 의사소통",
    "groupType": "보통교과",
    "subjectGroup": "국어",
    "selectionType": "융합"
  },
  {
    "subjectName": "언어생활 탐구",
    "groupType": "보통교과",
    "subjectGroup": "국어",
    "selectionType": "융합"
  },
  {
    "subjectName": "공통수학1",
    "groupType": "보통교과",
    "subjectGroup": "수학",
    "selectionType": "공통"
  },
  {
    "subjectName": "공통수학2",
    "groupType": "보통교과",
    "subjectGroup": "수학",
    "selectionType": "공통"
  },
  {
    "subjectName": "기본수학1",
    "groupType": "보통교과",
    "subjectGroup": "수학",
    "selectionType": "공통"
  },
  {
    "subjectName": "기본수학2",
    "groupType": "보통교과",
    "subjectGroup": "수학",
    "selectionType": "공통"
  },
  {
    "subjectName": "대수",
    "groupType": "보통교과",
    "subjectGroup": "수학",
    "selectionType": "일반"
  },
  {
    "subjectName": "미적분I",
    "groupType": "보통교과",
    "subjectGroup": "수학",
    "selectionType": "일반"
  },
  {
    "subjectName": "확률과 통계",
    "groupType": "보통교과",
    "subjectGroup": "수학",
    "selectionType": "일반"
  },
  {
    "subjectName": "기하",
    "groupType": "보통교과",
    "subjectGroup": "수학",
    "selectionType": "진로"
  },
  {
    "subjectName": "미적분II",
    "groupType": "보통교과",
    "subjectGroup": "수학",
    "selectionType": "진로"
  },
  {
    "subjectName": "경제 수학",
    "groupType": "보통교과",
    "subjectGroup": "수학",
    "selectionType": "진로"
  },
  {
    "subjectName": "인공지능 수학",
    "groupType": "보통교과",
    "subjectGroup": "수학",
    "selectionType": "진로"
  },
  {
    "subjectName": "직무 수학",
    "groupType": "보통교과",
    "subjectGroup": "수학",
    "selectionType": "진로"
  },
  {
    "subjectName": "수학과 문화",
    "groupType": "보통교과",
    "subjectGroup": "수학",
    "selectionType": "융합"
  },
  {
    "subjectName": "실용 통계",
    "groupType": "보통교과",
    "subjectGroup": "수학",
    "selectionType": "융합"
  },
  {
    "subjectName": "수학과제 탐구",
    "groupType": "보통교과",
    "subjectGroup": "수학",
    "selectionType": "융합"
  },
  {
    "subjectName": "공통영어1",
    "groupType": "보통교과",
    "subjectGroup": "영어",
    "selectionType": "공통"
  },
  {
    "subjectName": "공통영어2",
    "groupType": "보통교과",
    "subjectGroup": "영어",
    "selectionType": "공통"
  },
  {
    "subjectName": "기본영어1",
    "groupType": "보통교과",
    "subjectGroup": "영어",
    "selectionType": "공통"
  },
  {
    "subjectName": "기본영어2",
    "groupType": "보통교과",
    "subjectGroup": "영어",
    "selectionType": "공통"
  },
  {
    "subjectName": "영어I",
    "groupType": "보통교과",
    "subjectGroup": "영어",
    "selectionType": "일반"
  },
  {
    "subjectName": "영어II",
    "groupType": "보통교과",
    "subjectGroup": "영어",
    "selectionType": "일반"
  },
  {
    "subjectName": "영어 독해와 작문",
    "groupType": "보통교과",
    "subjectGroup": "영어",
    "selectionType": "일반"
  },
  {
    "subjectName": "영미 문학 읽기",
    "groupType": "보통교과",
    "subjectGroup": "영어",
    "selectionType": "진로"
  },
  {
    "subjectName": "영어 발표와 토론",
    "groupType": "보통교과",
    "subjectGroup": "영어",
    "selectionType": "진로"
  },
  {
    "subjectName": "심화 영어",
    "groupType": "보통교과",
    "subjectGroup": "영어",
    "selectionType": "진로"
  },
  {
    "subjectName": "심화 영어 독해와 작문",
    "groupType": "보통교과",
    "subjectGroup": "영어",
    "selectionType": "진로"
  },
  {
    "subjectName": "직무 영어",
    "groupType": "보통교과",
    "subjectGroup": "영어",
    "selectionType": "진로"
  },
  {
    "subjectName": "실생활 영어 회화",
    "groupType": "보통교과",
    "subjectGroup": "영어",
    "selectionType": "융합"
  },
  {
    "subjectName": "미디어 영어",
    "groupType": "보통교과",
    "subjectGroup": "영어",
    "selectionType": "융합"
  },
  {
    "subjectName": "세계 문화와 영어",
    "groupType": "보통교과",
    "subjectGroup": "영어",
    "selectionType": "융합"
  },
  {
    "subjectName": "한국사1",
    "groupType": "보통교과",
    "subjectGroup": "사회",
    "selectionType": "공통"
  },
  {
    "subjectName": "한국사2",
    "groupType": "보통교과",
    "subjectGroup": "사회",
    "selectionType": "공통"
  },
  {
    "subjectName": "통합사회1",
    "groupType": "보통교과",
    "subjectGroup": "사회",
    "selectionType": "공통"
  },
  {
    "subjectName": "통합사회2",
    "groupType": "보통교과",
    "subjectGroup": "사회",
    "selectionType": "공통"
  },
  {
    "subjectName": "세계시민과 지리",
    "groupType": "보통교과",
    "subjectGroup": "사회",
    "selectionType": "일반"
  },
  {
    "subjectName": "세계사",
    "groupType": "보통교과",
    "subjectGroup": "사회",
    "selectionType": "일반"
  },
  {
    "subjectName": "사회와 문화",
    "groupType": "보통교과",
    "subjectGroup": "사회",
    "selectionType": "일반"
  },
  {
    "subjectName": "현대사회와 윤리",
    "groupType": "보통교과",
    "subjectGroup": "사회",
    "selectionType": "일반"
  },
  {
    "subjectName": "한국지리 탐구",
    "groupType": "보통교과",
    "subjectGroup": "사회",
    "selectionType": "진로"
  },
  {
    "subjectName": "도시의 미래 탐구",
    "groupType": "보통교과",
    "subjectGroup": "사회",
    "selectionType": "진로"
  },
  {
    "subjectName": "동아시아 역사 기행",
    "groupType": "보통교과",
    "subjectGroup": "사회",
    "selectionType": "진로"
  },
  {
    "subjectName": "정치",
    "groupType": "보통교과",
    "subjectGroup": "사회",
    "selectionType": "진로"
  },
  {
    "subjectName": "법과 사회",
    "groupType": "보통교과",
    "subjectGroup": "사회",
    "selectionType": "진로"
  },
  {
    "subjectName": "경제",
    "groupType": "보통교과",
    "subjectGroup": "사회",
    "selectionType": "진로"
  },
  {
    "subjectName": "윤리와 사상",
    "groupType": "보통교과",
    "subjectGroup": "사회",
    "selectionType": "진로"
  },
  {
    "subjectName": "인문학과 윤리",
    "groupType": "보통교과",
    "subjectGroup": "사회",
    "selectionType": "진로"
  },
  {
    "subjectName": "국제 관계의 이해",
    "groupType": "보통교과",
    "subjectGroup": "사회",
    "selectionType": "진로"
  },
  {
    "subjectName": "여행지리",
    "groupType": "보통교과",
    "subjectGroup": "사회",
    "selectionType": "융합"
  },
  {
    "subjectName": "역사로 탐구하는 현대 세계",
    "groupType": "보통교과",
    "subjectGroup": "사회",
    "selectionType": "융합"
  },
  {
    "subjectName": "사회문제 탐구",
    "groupType": "보통교과",
    "subjectGroup": "사회",
    "selectionType": "융합"
  },
  {
    "subjectName": "금융과 경제생활",
    "groupType": "보통교과",
    "subjectGroup": "사회",
    "selectionType": "융합"
  },
  {
    "subjectName": "윤리문제 탐구",
    "groupType": "보통교과",
    "subjectGroup": "사회",
    "selectionType": "융합"
  },
  {
    "subjectName": "기후변화와 지속가능한 세계",
    "groupType": "보통교과",
    "subjectGroup": "사회",
    "selectionType": "융합"
  },
  {
    "subjectName": "통합과학1",
    "groupType": "보통교과",
    "subjectGroup": "과학",
    "selectionType": "공통"
  },
  {
    "subjectName": "통합과학2",
    "groupType": "보통교과",
    "subjectGroup": "과학",
    "selectionType": "공통"
  },
  {
    "subjectName": "과학탐구실험1",
    "groupType": "보통교과",
    "subjectGroup": "과학",
    "selectionType": "공통"
  },
  {
    "subjectName": "과학탐구실험2",
    "groupType": "보통교과",
    "subjectGroup": "과학",
    "selectionType": "공통"
  },
  {
    "subjectName": "물리학",
    "groupType": "보통교과",
    "subjectGroup": "과학",
    "selectionType": "일반"
  },
  {
    "subjectName": "화학",
    "groupType": "보통교과",
    "subjectGroup": "과학",
    "selectionType": "일반"
  },
  {
    "subjectName": "생명과학",
    "groupType": "보통교과",
    "subjectGroup": "과학",
    "selectionType": "일반"
  },
  {
    "subjectName": "지구과학",
    "groupType": "보통교과",
    "subjectGroup": "과학",
    "selectionType": "일반"
  },
  {
    "subjectName": "역학과 에너지",
    "groupType": "보통교과",
    "subjectGroup": "과학",
    "selectionType": "진로"
  },
  {
    "subjectName": "전자기와 양자",
    "groupType": "보통교과",
    "subjectGroup": "과학",
    "selectionType": "진로"
  },
  {
    "subjectName": "물질과 에너지",
    "groupType": "보통교과",
    "subjectGroup": "과학",
    "selectionType": "진로"
  },
  {
    "subjectName": "화학 반응의 세계",
    "groupType": "보통교과",
    "subjectGroup": "과학",
    "selectionType": "진로"
  },
  {
    "subjectName": "세포와 물질대사",
    "groupType": "보통교과",
    "subjectGroup": "과학",
    "selectionType": "진로"
  },
  {
    "subjectName": "생물의 유전",
    "groupType": "보통교과",
    "subjectGroup": "과학",
    "selectionType": "진로"
  },
  {
    "subjectName": "지구시스템과학",
    "groupType": "보통교과",
    "subjectGroup": "과학",
    "selectionType": "진로"
  },
  {
    "subjectName": "행성우주과학",
    "groupType": "보통교과",
    "subjectGroup": "과학",
    "selectionType": "진로"
  },
  {
    "subjectName": "과학의 역사와 문화",
    "groupType": "보통교과",
    "subjectGroup": "과학",
    "selectionType": "융합"
  },
  {
    "subjectName": "기후변화와 환경생태",
    "groupType": "보통교과",
    "subjectGroup": "과학",
    "selectionType": "융합"
  },
  {
    "subjectName": "융합과학 탐구",
    "groupType": "보통교과",
    "subjectGroup": "과학",
    "selectionType": "융합"
  },
  {
    "subjectName": "체육1",
    "groupType": "보통교과",
    "subjectGroup": "체육",
    "selectionType": "일반"
  },
  {
    "subjectName": "체육2",
    "groupType": "보통교과",
    "subjectGroup": "체육",
    "selectionType": "일반"
  },
  {
    "subjectName": "운동과 건강",
    "groupType": "보통교과",
    "subjectGroup": "체육",
    "selectionType": "진로"
  },
  {
    "subjectName": "스포츠 문화",
    "groupType": "보통교과",
    "subjectGroup": "체육",
    "selectionType": "진로"
  },
  {
    "subjectName": "스포츠 과학",
    "groupType": "보통교과",
    "subjectGroup": "체육",
    "selectionType": "진로"
  },
  {
    "subjectName": "스포츠 생활1",
    "groupType": "보통교과",
    "subjectGroup": "체육",
    "selectionType": "융합"
  },
  {
    "subjectName": "스포츠 생활2",
    "groupType": "보통교과",
    "subjectGroup": "체육",
    "selectionType": "융합"
  },
  {
    "subjectName": "음악",
    "groupType": "보통교과",
    "subjectGroup": "예술",
    "selectionType": "일반"
  },
  {
    "subjectName": "미술",
    "groupType": "보통교과",
    "subjectGroup": "예술",
    "selectionType": "일반"
  },
  {
    "subjectName": "연극",
    "groupType": "보통교과",
    "subjectGroup": "예술",
    "selectionType": "일반"
  },
  {
    "subjectName": "음악 연주와 창작",
    "groupType": "보통교과",
    "subjectGroup": "예술",
    "selectionType": "진로"
  },
  {
    "subjectName": "음악 감상과 비평",
    "groupType": "보통교과",
    "subjectGroup": "예술",
    "selectionType": "진로"
  },
  {
    "subjectName": "미술 창작",
    "groupType": "보통교과",
    "subjectGroup": "예술",
    "selectionType": "진로"
  },
  {
    "subjectName": "미술 감상과 비평",
    "groupType": "보통교과",
    "subjectGroup": "예술",
    "selectionType": "진로"
  },
  {
    "subjectName": "음악과 미디어",
    "groupType": "보통교과",
    "subjectGroup": "예술",
    "selectionType": "융합"
  },
  {
    "subjectName": "미술과 매체",
    "groupType": "보통교과",
    "subjectGroup": "예술",
    "selectionType": "융합"
  },
  {
    "subjectName": "기술·가정",
    "groupType": "보통교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "일반"
  },
  {
    "subjectName": "정보",
    "groupType": "보통교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "일반"
  },
  {
    "subjectName": "로봇과 공학세계",
    "groupType": "보통교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "생활과학 탐구",
    "groupType": "보통교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "인공지능 기초",
    "groupType": "보통교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "데이터 과학",
    "groupType": "보통교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "창의 공학 설계",
    "groupType": "보통교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "융합"
  },
  {
    "subjectName": "지식 재산 일반",
    "groupType": "보통교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "융합"
  },
  {
    "subjectName": "생애 설계와 자립",
    "groupType": "보통교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "융합"
  },
  {
    "subjectName": "아동발달과 부모",
    "groupType": "보통교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "융합"
  },
  {
    "subjectName": "소프트웨어와 생활",
    "groupType": "보통교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "융합"
  },
  {
    "subjectName": "독일어",
    "groupType": "보통교과",
    "subjectGroup": "제2외국어/한문",
    "selectionType": "일반"
  },
  {
    "subjectName": "프랑스어",
    "groupType": "보통교과",
    "subjectGroup": "제2외국어/한문",
    "selectionType": "일반"
  },
  {
    "subjectName": "스페인어",
    "groupType": "보통교과",
    "subjectGroup": "제2외국어/한문",
    "selectionType": "일반"
  },
  {
    "subjectName": "중국어",
    "groupType": "보통교과",
    "subjectGroup": "제2외국어/한문",
    "selectionType": "일반"
  },
  {
    "subjectName": "일본어",
    "groupType": "보통교과",
    "subjectGroup": "제2외국어/한문",
    "selectionType": "일반"
  },
  {
    "subjectName": "러시아어",
    "groupType": "보통교과",
    "subjectGroup": "제2외국어/한문",
    "selectionType": "일반"
  },
  {
    "subjectName": "아랍어",
    "groupType": "보통교과",
    "subjectGroup": "제2외국어/한문",
    "selectionType": "일반"
  },
  {
    "subjectName": "베트남어",
    "groupType": "보통교과",
    "subjectGroup": "제2외국어/한문",
    "selectionType": "일반"
  },
  {
    "subjectName": "한문",
    "groupType": "보통교과",
    "subjectGroup": "제2외국어/한문",
    "selectionType": "일반"
  },
  {
    "subjectName": "독일어 회화",
    "groupType": "보통교과",
    "subjectGroup": "제2외국어/한문",
    "selectionType": "진로"
  },
  {
    "subjectName": "프랑스어 회화",
    "groupType": "보통교과",
    "subjectGroup": "제2외국어/한문",
    "selectionType": "진로"
  },
  {
    "subjectName": "스페인어 회화",
    "groupType": "보통교과",
    "subjectGroup": "제2외국어/한문",
    "selectionType": "진로"
  },
  {
    "subjectName": "중국어 회화",
    "groupType": "보통교과",
    "subjectGroup": "제2외국어/한문",
    "selectionType": "진로"
  },
  {
    "subjectName": "일본어 회화",
    "groupType": "보통교과",
    "subjectGroup": "제2외국어/한문",
    "selectionType": "진로"
  },
  {
    "subjectName": "러시아어 회화",
    "groupType": "보통교과",
    "subjectGroup": "제2외국어/한문",
    "selectionType": "진로"
  },
  {
    "subjectName": "아랍어 회화",
    "groupType": "보통교과",
    "subjectGroup": "제2외국어/한문",
    "selectionType": "진로"
  },
  {
    "subjectName": "베트남어 회화",
    "groupType": "보통교과",
    "subjectGroup": "제2외국어/한문",
    "selectionType": "진로"
  },
  {
    "subjectName": "심화 독일어",
    "groupType": "보통교과",
    "subjectGroup": "제2외국어/한문",
    "selectionType": "진로"
  },
  {
    "subjectName": "심화 프랑스어",
    "groupType": "보통교과",
    "subjectGroup": "제2외국어/한문",
    "selectionType": "진로"
  },
  {
    "subjectName": "심화 스페인어",
    "groupType": "보통교과",
    "subjectGroup": "제2외국어/한문",
    "selectionType": "진로"
  },
  {
    "subjectName": "심화 중국어",
    "groupType": "보통교과",
    "subjectGroup": "제2외국어/한문",
    "selectionType": "진로"
  },
  {
    "subjectName": "심화 일본어",
    "groupType": "보통교과",
    "subjectGroup": "제2외국어/한문",
    "selectionType": "진로"
  },
  {
    "subjectName": "심화 러시아어",
    "groupType": "보통교과",
    "subjectGroup": "제2외국어/한문",
    "selectionType": "진로"
  },
  {
    "subjectName": "심화 아랍어",
    "groupType": "보통교과",
    "subjectGroup": "제2외국어/한문",
    "selectionType": "진로"
  },
  {
    "subjectName": "심화 베트남어",
    "groupType": "보통교과",
    "subjectGroup": "제2외국어/한문",
    "selectionType": "진로"
  },
  {
    "subjectName": "한문 고전 읽기",
    "groupType": "보통교과",
    "subjectGroup": "제2외국어/한문",
    "selectionType": "진로"
  },
  {
    "subjectName": "독일어권 문화",
    "groupType": "보통교과",
    "subjectGroup": "제2외국어/한문",
    "selectionType": "융합"
  },
  {
    "subjectName": "프랑스어권 문화",
    "groupType": "보통교과",
    "subjectGroup": "제2외국어/한문",
    "selectionType": "융합"
  },
  {
    "subjectName": "스페인어권 문화",
    "groupType": "보통교과",
    "subjectGroup": "제2외국어/한문",
    "selectionType": "융합"
  },
  {
    "subjectName": "중국 문화",
    "groupType": "보통교과",
    "subjectGroup": "제2외국어/한문",
    "selectionType": "융합"
  },
  {
    "subjectName": "일본 문화",
    "groupType": "보통교과",
    "subjectGroup": "제2외국어/한문",
    "selectionType": "융합"
  },
  {
    "subjectName": "러시아 문화",
    "groupType": "보통교과",
    "subjectGroup": "제2외국어/한문",
    "selectionType": "융합"
  },
  {
    "subjectName": "아랍 문화",
    "groupType": "보통교과",
    "subjectGroup": "제2외국어/한문",
    "selectionType": "융합"
  },
  {
    "subjectName": "베트남 문화",
    "groupType": "보통교과",
    "subjectGroup": "제2외국어/한문",
    "selectionType": "융합"
  },
  {
    "subjectName": "언어생활과 한자",
    "groupType": "보통교과",
    "subjectGroup": "제2외국어/한문",
    "selectionType": "융합"
  },
  {
    "subjectName": "진로와 직업",
    "groupType": "보통교과",
    "subjectGroup": "교양",
    "selectionType": "일반"
  },
  {
    "subjectName": "생태와 환경",
    "groupType": "보통교과",
    "subjectGroup": "교양",
    "selectionType": "일반"
  },
  {
    "subjectName": "인간과 철학",
    "groupType": "보통교과",
    "subjectGroup": "교양",
    "selectionType": "진로"
  },
  {
    "subjectName": "논리와 사고",
    "groupType": "보통교과",
    "subjectGroup": "교양",
    "selectionType": "진로"
  },
  {
    "subjectName": "인간과 심리",
    "groupType": "보통교과",
    "subjectGroup": "교양",
    "selectionType": "진로"
  },
  {
    "subjectName": "교육의 이해",
    "groupType": "보통교과",
    "subjectGroup": "교양",
    "selectionType": "진로"
  },
  {
    "subjectName": "삶과 종교",
    "groupType": "보통교과",
    "subjectGroup": "교양",
    "selectionType": "진로"
  },
  {
    "subjectName": "보건",
    "groupType": "보통교과",
    "subjectGroup": "교양",
    "selectionType": "진로"
  },
  {
    "subjectName": "인간과 경제활동",
    "groupType": "보통교과",
    "subjectGroup": "교양",
    "selectionType": "융합"
  },
  {
    "subjectName": "논술",
    "groupType": "보통교과",
    "subjectGroup": "교양",
    "selectionType": "융합"
  },
  {
    "subjectName": "전문 수학",
    "groupType": "보통교과",
    "subjectGroup": "수학",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "이산 수학",
    "groupType": "보통교과",
    "subjectGroup": "수학",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "고급 기하",
    "groupType": "보통교과",
    "subjectGroup": "수학",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "고급 대수",
    "groupType": "보통교과",
    "subjectGroup": "수학",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "고급 미적분",
    "groupType": "보통교과",
    "subjectGroup": "수학",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "고급 물리학",
    "groupType": "보통교과",
    "subjectGroup": "과학",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "고급 화학",
    "groupType": "보통교과",
    "subjectGroup": "과학",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "고급 생명과학",
    "groupType": "보통교과",
    "subjectGroup": "과학",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "고급 지구과학",
    "groupType": "보통교과",
    "subjectGroup": "과학",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "과학과제 연구",
    "groupType": "보통교과",
    "subjectGroup": "과학",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "물리학 실험",
    "groupType": "보통교과",
    "subjectGroup": "과학",
    "selectionType": "융합(특목)"
  },
  {
    "subjectName": "화학 실험",
    "groupType": "보통교과",
    "subjectGroup": "과학",
    "selectionType": "융합(특목)"
  },
  {
    "subjectName": "생명과학 실험",
    "groupType": "보통교과",
    "subjectGroup": "과학",
    "selectionType": "융합(특목)"
  },
  {
    "subjectName": "지구과학 실험",
    "groupType": "보통교과",
    "subjectGroup": "과학",
    "selectionType": "융합(특목)"
  },
  {
    "subjectName": "정보과학",
    "groupType": "보통교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "스포츠 개론",
    "groupType": "보통교과",
    "subjectGroup": "체육",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "육상",
    "groupType": "보통교과",
    "subjectGroup": "체육",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "체조",
    "groupType": "보통교과",
    "subjectGroup": "체육",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "수상 스포츠",
    "groupType": "보통교과",
    "subjectGroup": "체육",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "기초 체육 전공 실기",
    "groupType": "보통교과",
    "subjectGroup": "체육",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "심화 체육 전공 실기",
    "groupType": "보통교과",
    "subjectGroup": "체육",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "고급 체육 전공 실기",
    "groupType": "보통교과",
    "subjectGroup": "체육",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "스포츠 경기 체력",
    "groupType": "보통교과",
    "subjectGroup": "체육",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "스포츠 경기 기술",
    "groupType": "보통교과",
    "subjectGroup": "체육",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "스포츠 경기 분석",
    "groupType": "보통교과",
    "subjectGroup": "체육",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "스포츠 교육",
    "groupType": "보통교과",
    "subjectGroup": "체육",
    "selectionType": "융합(특목)"
  },
  {
    "subjectName": "스포츠 생리의학",
    "groupType": "보통교과",
    "subjectGroup": "체육",
    "selectionType": "융합(특목)"
  },
  {
    "subjectName": "스포츠 행정 및 경영",
    "groupType": "보통교과",
    "subjectGroup": "체육",
    "selectionType": "융합(특목)"
  },
  {
    "subjectName": "음악 이론",
    "groupType": "보통교과",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "음악사",
    "groupType": "보통교과",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "시창·청음",
    "groupType": "보통교과",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "음악 전공 실기",
    "groupType": "보통교과",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "합창·합주",
    "groupType": "보통교과",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "음악 공연 실습",
    "groupType": "보통교과",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "미술 이론",
    "groupType": "보통교과",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "드로잉",
    "groupType": "보통교과",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "미술사",
    "groupType": "보통교과",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "미술 전공 실기",
    "groupType": "보통교과",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "조형 탐구",
    "groupType": "보통교과",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "무용의 이해",
    "groupType": "보통교과",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "무용과 몸",
    "groupType": "보통교과",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "무용 기초 실기",
    "groupType": "보통교과",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "무용 전공 실기",
    "groupType": "보통교과",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "안무",
    "groupType": "보통교과",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "무용 제작 실습",
    "groupType": "보통교과",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "무용 감상과 비평",
    "groupType": "보통교과",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "문예 창작의 이해",
    "groupType": "보통교과",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "문장론",
    "groupType": "보통교과",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "문학 감상과 비평",
    "groupType": "보통교과",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "시 창작",
    "groupType": "보통교과",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "소설 창작",
    "groupType": "보통교과",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "극 창작",
    "groupType": "보통교과",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "연극과 몸",
    "groupType": "보통교과",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "연극과 말",
    "groupType": "보통교과",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "연기",
    "groupType": "보통교과",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "무대미술과 기술",
    "groupType": "보통교과",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "연극 제작 실습",
    "groupType": "보통교과",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "연극 감상과 비평",
    "groupType": "보통교과",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "영화의 이해",
    "groupType": "보통교과",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "촬영·조명",
    "groupType": "보통교과",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "편집·사운드",
    "groupType": "보통교과",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "영화 제작 실습",
    "groupType": "보통교과",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "영화 감상과 비평",
    "groupType": "보통교과",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "사진의 이해",
    "groupType": "보통교과",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "사진 촬영",
    "groupType": "보통교과",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "사진 표현 기법",
    "groupType": "보통교과",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "영상 제작의 이해",
    "groupType": "보통교과",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "사진 감상과 비평",
    "groupType": "보통교과",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "음악과 문화",
    "groupType": "보통교과",
    "subjectGroup": "예술",
    "selectionType": "융합(특목)"
  },
  {
    "subjectName": "미술 매체 탐구",
    "groupType": "보통교과",
    "subjectGroup": "예술",
    "selectionType": "융합(특목)"
  },
  {
    "subjectName": "미술과 사회",
    "groupType": "보통교과",
    "subjectGroup": "예술",
    "selectionType": "융합(특목)"
  },
  {
    "subjectName": "무용과 매체",
    "groupType": "보통교과",
    "subjectGroup": "예술",
    "selectionType": "융합(특목)"
  },
  {
    "subjectName": "문학과 매체",
    "groupType": "보통교과",
    "subjectGroup": "예술",
    "selectionType": "융합(특목)"
  },
  {
    "subjectName": "연극과 삶",
    "groupType": "보통교과",
    "subjectGroup": "예술",
    "selectionType": "융합(특목)"
  },
  {
    "subjectName": "영화와 삶",
    "groupType": "보통교과",
    "subjectGroup": "예술",
    "selectionType": "융합(특목)"
  },
  {
    "subjectName": "사진과 삶",
    "groupType": "보통교과",
    "subjectGroup": "예술",
    "selectionType": "융합(특목)"
  },
  {
    "subjectName": "성공적인 직업 생활",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "노동 인권과 산업 안전 보건",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "디지털과 직업 생활",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "상업 경제",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "기업과 경영",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "사무 관리",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "회계 원리",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "회계 정보 처리 시스템",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "기업 자원 통합 관리",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "세무 일반",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "유통 일반",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "무역 일반",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "무역 영어",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "금융 일반",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "보험 일반",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "마케팅과 광고",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "창업 일반",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "비즈니스 커뮤니케이션",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "전자 상거래 일반",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "총무",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "인사",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "노무 관리",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "비서",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "사무 행정",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "예산·자금",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "회계 실무",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "세무 실무",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "유통 관리",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "구매 조달",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "자재 관리",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "공정 관리",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "공급망 관리",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "품질 관리",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "물류 관리",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "수출입 관리",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "원산지 관리",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "창구 사무",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "무역 금융 업무",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "고객 관리",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "전자 상거래 실무",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "매장 판매",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "인간 발달",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "보육 원리와 보육 교사",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "보육 과정",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "아동 생활 지도",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "아동 복지",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "보육 실습",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "영유아 교수 방법",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "생활 서비스 산업의 이해",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "복지 서비스의 기초",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "사회 복지 시설의 이해",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "공중 보건",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "인체 구조와 기능",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "간호의 기초",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "기초 간호 임상 실무",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "보건 간호",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "보건 의료 법규",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "치과 간호 임상 실무",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "영유아 건강·안전·영양 지도",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "영유아 놀이 지도",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "사회 복지 시설 실무",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "대인 복지 서비스",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "요양 지원",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "문화 콘텐츠 산업 일반",
    "groupType": "전문교과",
    "subjectGroup": "예술",
    "selectionType": "진로"
  },
  {
    "subjectName": "미디어 콘텐츠 일반",
    "groupType": "전문교과",
    "subjectGroup": "예술",
    "selectionType": "진로"
  },
  {
    "subjectName": "영상 제작 기초",
    "groupType": "전문교과",
    "subjectGroup": "예술",
    "selectionType": "진로"
  },
  {
    "subjectName": "애니메이션 기초",
    "groupType": "전문교과",
    "subjectGroup": "예술",
    "selectionType": "진로"
  },
  {
    "subjectName": "음악 콘텐츠 제작 기초",
    "groupType": "전문교과",
    "subjectGroup": "예술",
    "selectionType": "진로"
  },
  {
    "subjectName": "디자인 제도",
    "groupType": "전문교과",
    "subjectGroup": "예술",
    "selectionType": "진로"
  },
  {
    "subjectName": "디자인 일반",
    "groupType": "전문교과",
    "subjectGroup": "예술",
    "selectionType": "진로"
  },
  {
    "subjectName": "조형",
    "groupType": "전문교과",
    "subjectGroup": "예술",
    "selectionType": "진로"
  },
  {
    "subjectName": "색채 일반",
    "groupType": "전문교과",
    "subjectGroup": "예술",
    "selectionType": "진로"
  },
  {
    "subjectName": "컴퓨터 그래픽",
    "groupType": "전문교과",
    "subjectGroup": "예술",
    "selectionType": "진로"
  },
  {
    "subjectName": "공예 일반",
    "groupType": "전문교과",
    "subjectGroup": "예술",
    "selectionType": "진로"
  },
  {
    "subjectName": "공예 재료와 도구",
    "groupType": "전문교과",
    "subjectGroup": "예술",
    "selectionType": "진로"
  },
  {
    "subjectName": "방송 일반",
    "groupType": "전문교과",
    "subjectGroup": "예술",
    "selectionType": "진로"
  },
  {
    "subjectName": "영화 콘텐츠 제작",
    "groupType": "전문교과",
    "subjectGroup": "예술",
    "selectionType": "진로"
  },
  {
    "subjectName": "음악 콘텐츠 제작",
    "groupType": "전문교과",
    "subjectGroup": "예술",
    "selectionType": "진로"
  },
  {
    "subjectName": "광고 콘텐츠 제작",
    "groupType": "전문교과",
    "subjectGroup": "예술",
    "selectionType": "진로"
  },
  {
    "subjectName": "게임 기획",
    "groupType": "전문교과",
    "subjectGroup": "예술",
    "selectionType": "진로"
  },
  {
    "subjectName": "게임 디자인",
    "groupType": "전문교과",
    "subjectGroup": "예술",
    "selectionType": "진로"
  },
  {
    "subjectName": "게임 프로그래밍",
    "groupType": "전문교과",
    "subjectGroup": "예술",
    "selectionType": "진로"
  },
  {
    "subjectName": "애니메이션 콘텐츠 제작",
    "groupType": "전문교과",
    "subjectGroup": "예술",
    "selectionType": "진로"
  },
  {
    "subjectName": "만화 콘텐츠 제작",
    "groupType": "전문교과",
    "subjectGroup": "예술",
    "selectionType": "진로"
  },
  {
    "subjectName": "캐릭터 제작",
    "groupType": "전문교과",
    "subjectGroup": "예술",
    "selectionType": "진로"
  },
  {
    "subjectName": "스마트 문화 앱 콘텐츠 제작",
    "groupType": "전문교과",
    "subjectGroup": "예술",
    "selectionType": "진로"
  },
  {
    "subjectName": "VR·AR 콘텐츠 제작",
    "groupType": "전문교과",
    "subjectGroup": "예술",
    "selectionType": "진로"
  },
  {
    "subjectName": "시각 디자인",
    "groupType": "전문교과",
    "subjectGroup": "예술",
    "selectionType": "진로"
  },
  {
    "subjectName": "제품 디자인",
    "groupType": "전문교과",
    "subjectGroup": "예술",
    "selectionType": "진로"
  },
  {
    "subjectName": "디지털 디자인",
    "groupType": "전문교과",
    "subjectGroup": "예술",
    "selectionType": "진로"
  },
  {
    "subjectName": "실내 디자인",
    "groupType": "전문교과",
    "subjectGroup": "예술",
    "selectionType": "진로"
  },
  {
    "subjectName": "색채 디자인",
    "groupType": "전문교과",
    "subjectGroup": "예술",
    "selectionType": "진로"
  },
  {
    "subjectName": "편집 디자인",
    "groupType": "전문교과",
    "subjectGroup": "예술",
    "selectionType": "진로"
  },
  {
    "subjectName": "도자기 공예",
    "groupType": "전문교과",
    "subjectGroup": "예술",
    "selectionType": "진로"
  },
  {
    "subjectName": "목공예",
    "groupType": "전문교과",
    "subjectGroup": "예술",
    "selectionType": "진로"
  },
  {
    "subjectName": "금속 공예",
    "groupType": "전문교과",
    "subjectGroup": "예술",
    "selectionType": "진로"
  },
  {
    "subjectName": "방송 콘텐츠 제작",
    "groupType": "전문교과",
    "subjectGroup": "예술",
    "selectionType": "진로"
  },
  {
    "subjectName": "방송 제작 시스템 운용",
    "groupType": "전문교과",
    "subjectGroup": "예술",
    "selectionType": "진로"
  },
  {
    "subjectName": "미용의 기초",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "미용 안전·보건",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "헤어 미용",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "피부 미용",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "메이크업",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "네일 미용",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "관광 일반",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "관광 서비스",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "관광 영어",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "관광 일본어",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "관광 중국어",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "관광 문화와 자원",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "관광 콘텐츠 개발",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "전시·컨벤션·이벤트 일반",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "레저 서비스 일반",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "호텔 식음료 서비스 실무",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "호텔 객실 서비스 실무",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "국내 여행 서비스 실무",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "국외 여행 서비스 실무",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "전시·컨벤션·이벤트 실무",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "카지노 서비스 실무",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "식품과 영양",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "기초 조리",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "디저트 조리",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "식음료 기초",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "식품 과학",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "식품 위생",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "식품 가공 기술",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "식품 분석",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "한식 조리",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "양식 조리",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "중식 조리",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "일식 조리",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "바리스타",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "바텐더",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "식공간 연출",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "수산 식품 가공",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "축산 식품 가공",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "유제품 가공",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "건강 기능 식품 가공",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "김치·반찬 가공",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "음료·주류 가공",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "식품 품질 관리",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "떡 제조",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "제과",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "제빵",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "공업 일반",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "기초 제도",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "건축 일반",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "건축 기초 실습",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "건축 도면 해석과 제도",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "토목 일반",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "토목 도면 해석과 제도",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "건설 재료",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "역학 기초",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "토질·수리",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "측량 기초",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "드론 기초",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "스마트 시티 기초",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "건물 정보 관리 기초",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "철근 콘크리트 시공",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "건축 목공 시공",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "건축 마감 시공",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "건축 도장 시공",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "건축 설계",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "토목 설계",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "토목 시공",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "지적",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "측량",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "공간 정보 구축",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "공간 정보 융합 서비스",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "소형 무인기 운용·조종",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "국토 도시 계획",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "교통 계획·설계",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "주거 서비스",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "기계 제도",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "기계 기초 공작",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "전자 기계 이론",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "기계 일반",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "자동차 일반",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "기계 기초 역학",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "냉동 공조 일반",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "유체 기계",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "산업 설비",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "자동차 기관",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "자동차 섀시",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "자동차 전기·전자 제어",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "선박 이론",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "선박 구조",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "선박 건조",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "선체 도면 독도와 제도",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "항공기 일반",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "항공기 실무 기초",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "기계요소 설계",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "기계 제어 설계",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "선반 가공",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "밀링 가공",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "연삭 가공",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "컴퓨터 활용 생산",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "측정",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "성형 가공",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "특수 가공",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "기계 수동 조립",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "기계 소프트웨어 개발",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "운반 하역 기계 설치·정비",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "건설 광산 기계 설치·정비",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "공작 기계 설치·정비",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "승강기 설치·정비",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "오토바이 정비",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "자전거 정비",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "사출 금형 설계",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "사출 금형 제작",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "사출 금형 품질 관리",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "사출 금형 조립",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "프레스 금형 설계",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "프레스 금형 제작",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "프레스 금형 품질 관리",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "프레스 금형 조립",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "배관 시공",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "냉동 공조 설계",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "냉동 공조 유지 보수 관리",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "보일러 설치·정비",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "판금·제관",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "피복 아크 용접",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "이산화탄소·가스 메탈 아크 용접",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "가스 텅스텐 아크 용접",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "로봇 용접",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "보일러 장치 설치",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "냉동 공조 장치 설치",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "자동차 전기·전자 장치 정비",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "자동차 엔진 정비",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "자동차 섀시 정비",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "자동차 차체 정비",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "자동차 도장",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "자동차 정비 검사",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "자동차 튜닝",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "선체 조립",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "전장 생산",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "선체 생산 설계",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "항공기 기체 제작",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "항공기 전기·전자 장비 제작",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "항공기 기체 정비",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "항공기 가스 터빈 엔진 정비",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "항공기 왕복 엔진 정비",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "항공기 계통 정비",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "항공기 전기·전자 장비 정비",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "소형 무인기 정비",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "항공기 정비 관리",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "재료 일반",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "재료 시험",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "세라믹 재료",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "세라믹 원리·공정",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "제선",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "제강",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "압연",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "주조",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "금속 재료 가공",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "금속 열처리",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "도금",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "금속 재료 신뢰성 시험",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "도자기",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "탄소 재료",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "용융 세라믹 제조",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "공업 화학",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "제조 화학",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "스마트 공정 제어",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "화공 플랜트 기계",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "화공 플랜트 전기",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "바이오 기초 화학",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "에너지 공업 기초",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "에너지 화공 소재 생산",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "화학 분석",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "화학 물질 관리",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "화학 공정 유지 운영",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "기능성 정밀 화학 제품 제조",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "고분자 제품 제조",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "바이오 의약품 제조",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "바이오 화학 제품 제조",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "화장품 제조",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "에너지 설비 유틸리티",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "신재생 에너지 실무",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "섬유 재료",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "섬유 공정",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "염색·가공 기초",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "패션 소재",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "패션 디자인의 기초",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "의복 구성의 기초",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "편물",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "패션 마케팅",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "텍스타일 디자인",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "방적·방사",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "제포",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "염색·가공",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "패션 디자인의 실제",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "패턴 메이킹",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "서양 의복 구성과 생산",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "니트 의류 생산",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "한국 의복 구성과 생산",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "패션 소품 디자인과 생산",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "패션 상품 유통 관리",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "비주얼 머천다이징",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "전기 회로",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "전기 기기",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "전기 설비",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "자동화 설비",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "전기·전자 일반",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "전자 회로",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "전기·전자 측정",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "디지털 논리 회로",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "전자 제어",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "발전 설비 운영",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "송·변전 배전 설비 운영",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "전기 기기 설계",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "전기 기기 제작",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "전기 기기 유지 보수",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "전기 설비 운영",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "내선 공사",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "외선 공사",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "자동 제어 기기 제작",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "자동 제어 시스템 유지 정비",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "자동 제어 시스템 운영",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "전기 철도 시공",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "전기 철도 시설물 유지 보수",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "철도 신호 제어 시공",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "전자 제품 생산",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "전자 부품 생산",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "전자 제품 설치 정비",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "가전 기기 시스템 소프트웨어 개발",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "가전 기기 하드웨어 개발",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "가전 기기·기구 개발",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "산업용 전자 기기 하드웨어 개발",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "산업용 전자 기기·기구 개발",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "산업용 전자 기기 소프트웨어 개발",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "정보 통신 기기 하드웨어 개발",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "정보 통신 기기 소프트웨어 개발",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "전자 응용 기기 하드웨어 개발",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "전자 응용 기기 기구 개발",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "전자 응용 기기 소프트웨어 개발",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "전자 부품 기구 개발",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "반도체 개발",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "반도체 제조",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "반도체 장비",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "반도체 재료",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "디스플레이 생산",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "로봇 하드웨어 설계",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "로봇 기구 개발",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "로봇 소프트웨어 개발",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "로봇 지능 개발",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "로봇 유지 보수",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "의료 기기 연구 개발",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "의료 기기 인허가",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "의료 기기 생산",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "LED 기술 개발",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "3D 프린터 개발",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "3D 프린터용 제품 제작",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "통신 일반",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "통신 시스템",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "정보 통신",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "정보 처리와 관리",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "컴퓨터 구조",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "프로그래밍",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "자료 구조",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "알고리즘 설계",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "컴퓨터 시스템 일반",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "컴퓨터 네트워크",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "인공지능 일반",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "사물 인터넷과 센서 제어",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "네트워크 구축",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "유선 통신 구축·운용",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "무선 통신 구축·운용",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "초고속망 서비스 관리 운용",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "응용 프로그래밍 개",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "응용 프로그래밍 화면 구현",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "시스템 프로그래밍",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "데이터베이스 프로그래밍",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "네트워크 프로그래밍",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "시스템 관리 및 지원",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "빅 데이터 분석",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "인공지능 모델링",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "정보 보호 관리",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "컴퓨터 보안",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "사물 인터넷 서비스 기획",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "인간과 환경",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "환경 화학 기초",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "환경 기술",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "환경과 생태",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "산업 안전 보건 기초",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "소방 기초",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "소방 법규",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "소방 건축",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "소방 기계",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "소방 전기",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "대기 관리",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "수질 관리",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "폐기물 관리",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "소음 진동 관리",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "토양·지하수 관리",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "환경 유해 관리",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "환경 생태 복원 관리",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "기계 안전 관리",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "전기 안전 관리",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "건설 안전 관리",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "화공 안전 관리",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "가스 안전 관리",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "소방 시설 설계",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "소방 시설 공사",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "소방 안전 관리",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "농업 이해",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "농업 기초 기술",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "농업 경영",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "재배",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "농산물 유통",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "농산물 거래",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "관광 농업",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "친환경 농업",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "생명 공학 기술",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "농업 정보 관리",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "농업 창업 일반",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "원예",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "생산 자재",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "조경 식물 관리",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "화훼 장식 기초",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "산림 휴양",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "산림 자원",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "임산 가공",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "조림",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "조경",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "동물 자원",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "반려동물 관리",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "곤충 산업 일반",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "농업 기계",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "농업 기계 공작",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "농업 기계 운전·작업",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "농업용 전기·전자",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "농업 토목 제도·설계",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "농업 토목 시공·측량",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "농업 생산 환경 일반",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "수도작 재배",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "전특작 재배",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "육종",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "종자 생산",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "농촌 체험 상품 개발",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "농촌 체험 시설 운영",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "스마트 팜 운영",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "채소 재배",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "과수 재배",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "화훼 재배",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "화훼 장식",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "버섯 재배",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "임업 종묘",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "산림 조성",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "산림 보호",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "임산물 생산",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "목재 가공",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "펄프·종이 제조",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "조경 설계",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "조경 시공",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "조경 관리",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "종축",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "수의 보조",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "애완동물 미용",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "젖소 사육",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "돼지 사육",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "가금 사육",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "한우 사육",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "말 사육",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "곤충 사육",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "농업용 기계 설치·정비",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "농업 생산 환경 조성",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "해양의 이해",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "수산·해운 산업 기초",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "해양 생산 일반",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "해양 오염·방제",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "전자 통신 운용",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "어선 전문",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "수산 일반",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "수산 생물",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "수산 양식 일반",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "수산 경영",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "수산물 유통",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "양식 생물 질병",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "관상 생물 기초",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "수산 해양 창업",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "활어 취급 일반",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "해양 레저 관광",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "요트 조종",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "잠수 기술",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "항해 기초",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "해사 일반",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "해사 법규",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "선박 운용",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "선화 운송",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "항만 물류 일반",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "해사 영어",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "항해사 직무",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "열기관",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "선박 보조 기계",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "선박 전기·전자",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "기관 실무 기초",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "기관 직무 일반",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "근해 어업",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "원양 어업",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "해면 양식",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "수산 종묘 생산",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "내수면 양식",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "수산 질병 관리",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "수상 레저 기구 조종",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "일반 잠수",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "산업 잠수",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "어촌 체험 상품 개발",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "어촌 체험 시설 운영",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "선박 통신",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "선박 갑판 관리",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "선박 운항 관리",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "선박 안전 관리",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "선박 기기 운용",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "기관사 직무",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "선박 기관 정비",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "선박 보조 기계 정비",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "스마트 공장 일반",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "스마트 공장 운용",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "스마트 공장 설계와 구축",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "발명·특허 기초",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "발명과 기업가 정신",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "발명과 디자인",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "발명과 메이커",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "스마트 설비 실무",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "특허 정보 조사·분석",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "특허 출원의 실제",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "지식 재산 관리",
    "groupType": "전문교과",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "심화 영어 회화I",
    "groupType": "보통교과",
    "subjectGroup": "영어",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "심화 영어 회화II",
    "groupType": "보통교과",
    "subjectGroup": "영어",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "심화 영어I",
    "groupType": "보통교과",
    "subjectGroup": "영어",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "심화 영어II",
    "groupType": "보통교과",
    "subjectGroup": "영어",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "심화 영어 독해I",
    "groupType": "보통교과",
    "subjectGroup": "영어",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "심화 영어 독해II",
    "groupType": "보통교과",
    "subjectGroup": "영어",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "심화 영어 작문I",
    "groupType": "보통교과",
    "subjectGroup": "영어",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "심화 영어 작문II",
    "groupType": "보통교과",
    "subjectGroup": "영어",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "국제 정치",
    "groupType": "보통교과",
    "subjectGroup": "사회",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "국제 경제",
    "groupType": "보통교과",
    "subjectGroup": "사회",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "국제법",
    "groupType": "보통교과",
    "subjectGroup": "사회",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "지역 이해",
    "groupType": "보통교과",
    "subjectGroup": "사회",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "한국 사회의 이해",
    "groupType": "보통교과",
    "subjectGroup": "사회",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "비교 문화",
    "groupType": "보통교과",
    "subjectGroup": "사회",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "세계 문제와 미래 사회",
    "groupType": "보통교과",
    "subjectGroup": "사회",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "국제 관계와 국제기구",
    "groupType": "보통교과",
    "subjectGroup": "사회",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "현대 세계의 변화",
    "groupType": "보통교과",
    "subjectGroup": "사회",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "사회 탐구 방법",
    "groupType": "보통교과",
    "subjectGroup": "사회",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "사회과제 연구",
    "groupType": "보통교과",
    "subjectGroup": "사회",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "전공 기초 독일어",
    "groupType": "보통교과",
    "subjectGroup": "제2외국어/한문",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "독일어 회화I",
    "groupType": "보통교과",
    "subjectGroup": "제2외국어/한문",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "독일어 회화II",
    "groupType": "보통교과",
    "subjectGroup": "제2외국어/한문",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "독일어 독해와 작문I",
    "groupType": "보통교과",
    "subjectGroup": "제2외국어/한문",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "독일어 독해와 작문II",
    "groupType": "보통교과",
    "subjectGroup": "제2외국어/한문",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "전공 기초 프랑스어",
    "groupType": "보통교과",
    "subjectGroup": "제2외국어/한문",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "프랑스어 회화I",
    "groupType": "보통교과",
    "subjectGroup": "제2외국어/한문",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "프랑스어 회화II",
    "groupType": "보통교과",
    "subjectGroup": "제2외국어/한문",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "프랑스어 독해와 작문I",
    "groupType": "보통교과",
    "subjectGroup": "제2외국어/한문",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "프랑스어 독해와 작문II",
    "groupType": "보통교과",
    "subjectGroup": "제2외국어/한문",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "전공 기초 스페인어",
    "groupType": "보통교과",
    "subjectGroup": "제2외국어/한문",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "스페인어 회화I",
    "groupType": "보통교과",
    "subjectGroup": "제2외국어/한문",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "스페인어 회화II",
    "groupType": "보통교과",
    "subjectGroup": "제2외국어/한문",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "스페인어 독해와 작문I",
    "groupType": "보통교과",
    "subjectGroup": "제2외국어/한문",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "스페인어 독해와 작문II",
    "groupType": "보통교과",
    "subjectGroup": "제2외국어/한문",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "전공 기초 중국어",
    "groupType": "보통교과",
    "subjectGroup": "제2외국어/한문",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "중국어 회화I",
    "groupType": "보통교과",
    "subjectGroup": "제2외국어/한문",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "중국어 회화II",
    "groupType": "보통교과",
    "subjectGroup": "제2외국어/한문",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "중국어 독해와 작문I",
    "groupType": "보통교과",
    "subjectGroup": "제2외국어/한문",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "중국어 독해와 작문II",
    "groupType": "보통교과",
    "subjectGroup": "제2외국어/한문",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "전공 기초 일본어",
    "groupType": "보통교과",
    "subjectGroup": "제2외국어/한문",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "일본어 회화I",
    "groupType": "보통교과",
    "subjectGroup": "제2외국어/한문",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "일본어 회화II",
    "groupType": "보통교과",
    "subjectGroup": "제2외국어/한문",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "일본어 독해와 작문",
    "groupType": "보통교과",
    "subjectGroup": "제2외국어/한문",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "일본어 독해와 작문II",
    "groupType": "보통교과",
    "subjectGroup": "제2외국어/한문",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "전공 기초 러시아어",
    "groupType": "보통교과",
    "subjectGroup": "제2외국어/한문",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "러시아어 회화I",
    "groupType": "보통교과",
    "subjectGroup": "제2외국어/한문",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "러시아어 회화II",
    "groupType": "보통교과",
    "subjectGroup": "제2외국어/한문",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "러시아어 독해와 작문I",
    "groupType": "보통교과",
    "subjectGroup": "제2외국어/한문",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "러시아어 독해와 작문II",
    "groupType": "보통교과",
    "subjectGroup": "제2외국어/한문",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "전공 기초 아랍어",
    "groupType": "보통교과",
    "subjectGroup": "제2외국어/한문",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "아랍어 회화I",
    "groupType": "보통교과",
    "subjectGroup": "제2외국어/한문",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "아랍어 회화II",
    "groupType": "보통교과",
    "subjectGroup": "제2외국어/한문",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "아랍어 독해와 작문I",
    "groupType": "보통교과",
    "subjectGroup": "제2외국어/한문",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "아랍어 독해와 작문II",
    "groupType": "보통교과",
    "subjectGroup": "제2외국어/한문",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "전공 기초 베트남어",
    "groupType": "보통교과",
    "subjectGroup": "제2외국어/한문",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "베트남어 회화I",
    "groupType": "보통교과",
    "subjectGroup": "제2외국어/한문",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "베트남어 회화II",
    "groupType": "보통교과",
    "subjectGroup": "제2외국어/한문",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "베트남어 독해와 작문I",
    "groupType": "보통교과",
    "subjectGroup": "제2외국어/한문",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "베트남어 독해와 작문II",
    "groupType": "보통교과",
    "subjectGroup": "제2외국어/한문",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "진로 키스톤 디자인",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "진로 캡스톤 디자인",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초 근대5종 전공 실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초 레슬링 전공 실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초 배드민턴 전공 실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초 복싱 전공 실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초 사격 전공 실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초 사이클 전공 실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초 수영 경영 전공 실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초 수영 다이빙 전공 실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초 수영 수구 전공 실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초 양궁 전공 실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초 역도 전공 실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초 유도 전공 실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초 육상 단거리 전공 실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초 육상 도약 전공 실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초 육상 중장거리 전공 실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초 육상 투척 전공 실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초 조정 전공 실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초 체조 전공 실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초 태권도 전공 실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초 펜싱 전공 실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초 핀수영 전공 실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "심화 근대5종 전공 실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "심화 레슬링 전공 실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "심화 배드민턴 전공 실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "심화 복싱 전공 실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "심화 사격 전공 실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "심화 사이클 전공 실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "심화 수영 경영 전공 실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "심화 수영 다이빙 전공 실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "심화 수영 수구 전공 실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "심화 양궁 전공 실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "심화 역도 전공 실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "심화 유도 전공 실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "심화 육상 단거리 전공 실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "심화 육상 도약 전공 실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "심화 육상 중장거리 전공 실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "심화 육상 투척 전공 실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "심화 조정 전공 실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "심화 체조 전공 실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "심화 태권도 전공 실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "심화 펜싱 전공 실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "심화 핀수영 전공 실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "지역사회 간호 보조 실무",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "대상자별 간호 보조 실무",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "병원실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "영어 비평적 읽기와 쓰기",
    "groupType": "시도교육청인정",
    "subjectGroup": "영어",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "공학 커뮤니케이션",
    "groupType": "시도교육청인정",
    "subjectGroup": "과학",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "인공지능과 미래 사회",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "프런티어 사이언스",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "자아탐색과 글쓰기",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "호모 스토리텔리쿠스",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "정보와 디지털 문해력",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "생활과인성I",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "생활과인성II",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "Conceptual 물리학 I",
    "groupType": "시도교육청인정",
    "subjectGroup": "과학",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "사회과학 통계학",
    "groupType": "시도교육청인정",
    "subjectGroup": "사회",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "인공지능을 위한 선형대수학",
    "groupType": "시도교육청인정",
    "subjectGroup": "수학",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "인공지능을 위한 이산수학",
    "groupType": "시도교육청인정",
    "subjectGroup": "수학",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "전산 물리학",
    "groupType": "시도교육청인정",
    "subjectGroup": "과학",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "인간생활과 생명과학",
    "groupType": "시도교육청인정",
    "subjectGroup": "과학",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "전자회로 및 실험",
    "groupType": "시도교육청인정",
    "subjectGroup": "과학",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "근대5종 경기 분석",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "근대5종 경기 체력",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "레슬링 경기 분석",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "레슬링 경기 체력",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "배드민턴 경기 분석",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "배드민턴 경기 체력",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "복싱 경기 분석",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "복싱 경기 체력",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "사격 경기 분석",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "사격 경기 체력",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "사이클 경기 분석",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "사이클 경기 체력",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "수영 경영 경기 분석",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "수영 경영 경기 체력",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "수영 다이빙 경기 분석",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "수영 다이빙 경기 체력",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "수영 수구 경기 분석",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "수영 수구 경기 체력",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "양궁 경기 분석",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "양궁 경기 체력",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "역도 경기 분석",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "역도 경기 체력",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "유도 경기 분석",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "유도 경기 체력",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "육상 단거리 경기 분석",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "육상 단거리 경기 체력",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "육상 도약 경기 분석",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "육상 도약 경기 체력",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "육상 중장거리 경기 분석",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "육상 중장거리 경기 체력",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "육상 투척 경기 분석",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "육상 투척 경기 체력",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "조정 경기 분석",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "조정 경기 체력",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "체조 경기 분석",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "체조 경기 체력",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "태권도 경기 분석",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "태권도 경기 체력",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "펜싱 경기 분석",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "펜싱 경기 체력",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "핀수영 경기 분석",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "핀수영 경기 체력",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "스포츠산업 경영과 마케팅 이해",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "전통연희기초",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "전통연희의이해",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "디자인매체미술",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "관세 사무 일반",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국제 무역 입문",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "금융법규",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "반려동물 숍 경영",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "빅데이터 마케팅 4.0",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "빅데이터 시각화",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "빅데이터 엑셀",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "중급 회계",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "증권금융시장",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "취업 실무 국어",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "취업 실무 수학",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "카페 경영 관리",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "커리어 국어",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "커뮤니케이션 문학",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "핀테크 일반",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "PR/광고",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "비즈니스기획실무",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "창업아이템 개발",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "핀테크 기술 기획",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "핀테크 엔지니어링",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "의학용어",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "e스포츠 선수 심리",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "e스포츠 실습",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "e스포츠 윤리",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "e스포츠 훈련",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "미디어실무영어",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "스포츠 영상 분석",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "귀금속 가공",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "무대연출",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "무대조명",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "반려동물 제품 디자인",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "발상과 디자인",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "방송시스템 운영",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "서비스·경험디자인",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "실용사진",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "웹툰 콘텐츠 제작",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "인터랙션 디자인",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "촬영·편집 실습",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "하우스 매니징",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "디저트 제과 실무",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "식음료 접객",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "호텔외식조리",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "건설·플랜트 3D모델링",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "건설·플랜트 기초",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "건설·플랜트 재료 및 장비",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "발전 설비 실무",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "사회기반시설",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "철도선로시설물 유지보수",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "프로세스플랜트",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "해외 건설의 이해",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "3D 프린팅 활용 메이커 교육",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "드론 제작",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "메이커 일반",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "스마트 팩토리 시스템 관리",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "자주포 운용",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "자주포 일반",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "전기동차 구조기능(I)",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "전기동차 구조기능(II)",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "철도 비상 조치",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "철도 선로 일반",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "철도 운전",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "철도 운전 이론",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "철도 일반",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "철도관련법",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "항공 드론",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "드론 설계와 제작",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "로봇 캡스톤 디자인",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "산업설비도면의 해석",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "전기설비 도면의 해석",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "전기차량 유지보수",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "철도차량설계",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "철도차량제작",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "플랜트 배관",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "공정공학기초",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "플랜트엔지니어링",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "반려동물 패션 디자인",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "반도체인프라 일반",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "사물인터넷과 자동화",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "전기 철도 실무",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "철도 운영 시스템",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "철도 통신 시스템",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "철도신호제어",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "드론제작과 운용",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "로봇 제작",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "선박전기I",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "선박전기II",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "데이터 과학과 인공지능",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "블록체인 기초",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "빅데이터 프로그래밍",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "인공지능과 메이커프로젝트",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "자료구조 실무",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "정보처리수학",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "프로그래밍(C++)",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "프로그래밍(JAVA)",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "프로그래밍(PYTHON)",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "UI/UX 엔지니어링",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "가상현실 콘텐츠 제작",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "디지털 포렌식 프로세스",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "사물인터넷 실무",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "서버 구축 및 운영",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "실감콘텐츠 촬영",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "웹 프로그래밍 실무",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "인공지능 자율주행",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "전력자동화시스템실무",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "철도정보통신 설비공사",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "콘텐츠사용자서비스",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "클라우드 보안",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "클라우드 플랫폼 구축",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "피난설비설계",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "AP 영어와 작문",
    "groupType": "시도교육청인정",
    "subjectGroup": "영어",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "대중음악과 실용무용",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "현대무용 실기2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "현대무용 실기3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "현대무용 실기4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "현대무용 실기5",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "현대무용 실기6",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "뮤지컬 실습1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "뮤지컬 실습2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "뮤지컬 실습3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "뮤지컬 실습4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "뮤지컬 실습5",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "뮤지컬 실습6",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "전통 연희 기초2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "전통 연희 기초3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "전통 연희 기초4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "전통 연희 실습1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "전통 연희 실습2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "전통 연희 실습3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "전통 연희 실습4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "전통 연희 실습5",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "전통 연희 실습6",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "올드 스쿨 스트리트댄스",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "뉴 스쿨 스트리트댄스",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "인공지능 활용 서비스 개발",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "웹 응용 SW 프로그래밍 실무",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "운영체제와 클라우드 인프라스트럭쳐 활용",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "서버 응용 SW 엔지니어링 실무",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "생활 한국어",
    "groupType": "시도교육청인정",
    "subjectGroup": "국어",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "학습 한국어",
    "groupType": "시도교육청인정",
    "subjectGroup": "국어",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "AP 영문학과 작문",
    "groupType": "시도교육청인정",
    "subjectGroup": "영어",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "문화다양성 직업 체험",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "문화다양성 진로와 지도",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "글로컬 시대의 지역 문화 이해1",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "글로컬 시대의 지역 문화 이해2",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "시뮬레이션 화학",
    "groupType": "시도교육청인정",
    "subjectGroup": "과학",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "지구과학개론",
    "groupType": "시도교육청인정",
    "subjectGroup": "과학",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "라이브 퍼포먼스",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "재즈실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "즉흥연주",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "초견",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "음악프로듀싱",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "가야금 실기1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "가야금 실기2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "가야금 실기3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "가야금 실기4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "가야금 실기5",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "가야금 실기6",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "가야금병창 실기1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "가야금병창 실기2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "가야금병창 실기3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "가야금병창 실기4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "가야금병창 실기5",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "가야금병창 실기6",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "거문고 실기1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "거문고 실기2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "거문고 실기3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "거문고 실기4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "거문고 실기5",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "거문고 실기6",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악이론 실기1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악이론 실기2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악이론 실기3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악이론 실기4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악이론 실기5",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악이론 실기6",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악작곡 실기1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악작곡 실기2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악작곡 실기3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악작곡 실기4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악작곡 실기5",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악작곡 실기6",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "대금 실기1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "대금 실기2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "대금 실기3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "대금 실기4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "대금 실기5",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "대금 실기6",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "민요 실기1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "민요 실기2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "민요 실기3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "민요 실기4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "민요 실기5",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "민요 실기6",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "아쟁 실기1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "아쟁 실기2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "아쟁 실기3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "아쟁 실기4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "아쟁 실기5",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "아쟁 실기6",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "정가 실기1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "정가 실기2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "정가 실기3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "정가 실기4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "정가 실기5",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "정가 실기6",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "판소리 실기1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "판소리 실기2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "판소리 실기3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "판소리 실기4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "판소리 실기5",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "판소리 실기6",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "피리 실기1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "피리 실기2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "피리 실기3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "피리 실기4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "피리 실기5",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "피리 실기6",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "해금 실기1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "해금 실기2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "해금 실기3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "해금 실기4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "해금 실기5",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "해금 실기6",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "무대 공연 실습1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "무대 공연 실습2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악 성악 실습1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악 성악 실습2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악 성악 실습3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악 성악 실습4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악 성악 실습5",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악 성악 실습6",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악 합주 실습1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악 합주 실습2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악 합주 실습3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악 합주 실습4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악 합주 실습5",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악 합주 실습6",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "시창 청음 실습1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "시창 청음 실습2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "시창 청음 실습3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "시창 청음 실습4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "시창 청음 실습5",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "시창 청음 실습6",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "음악 응용 실습1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "음악 응용 실습2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "음악 응용 실습3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "음악 응용 실습4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "음악 응용 실습5",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "음악 응용 실습6",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악사1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악사2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악 전공실기 가야금1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악 전공실기 가야금2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악 전공실기 가야금3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악 전공실기 가야금4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악 전공실기 가야금5",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악 전공실기 가야금6",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악 전공실기 거문고1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악 전공실기 거문고2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악 전공실기 거문고3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악 전공실기 거문고4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악 전공실기 거문고5",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악 전공실기 거문고6",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악 전공실기 대금1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악 전공실기 대금2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악 전공실기 대금3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악 전공실기 대금4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악 전공실기 대금5",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악 전공실기 대금6",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악 전공실기 피리1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악 전공실기 피리2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악 전공실기 피리3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악 전공실기 피리4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악 전공실기 피리5",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악 전공실기 피리6",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악 전공실기 해금1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악 전공실기 해금2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악 전공실기 해금3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악 전공실기 해금4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악 전공실기 해금5",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악 전공실기 해금6",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악 전공실기 아쟁1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악 전공실기 아쟁2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악 전공실기 아쟁3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악 전공실기 아쟁4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악 전공실기 아쟁5",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악 전공실기 아쟁6",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악 전공실기 타악1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악 전공실기 타악2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악 전공실기 타악3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악 전공실기 타악4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악 전공실기 타악5",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악 전공실기 타악6",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악 전공실기 정가1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악 전공실기 정가2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악 전공실기 정가3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악 전공실기 정가4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악 전공실기 정가5",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악 전공실기 정가6",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악 전공실기 판소리1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악 전공실기 판소리2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악 전공실기 판소리3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악 전공실기 판소리4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악 전공실기 판소리5",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악 전공실기 판소리6",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악 전공실기 민요1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악 전공실기 민요2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악 전공실기 민요3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악 전공실기 민요4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악 전공실기 민요5",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악 전공실기 민요6",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악 전공실기 이론1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악 전공실기 이론2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악 전공실기 이론3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악 전공실기 이론4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악 전공실기 이론5",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악 전공실기 이론6",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악 전공실기 작곡1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악 전공실기 작곡2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악 전공실기 작곡3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악 전공실기 작곡4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악 전공실기 작곡5",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악 전공실기 작곡6",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "선의 이해",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "빛과 색",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "재료와 기법",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "발레 실기1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "발레 실기2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "발레 실기3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "발레 실기4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "발레 실기5",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "발레 실기6",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "한국무용 장단 실습1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "한국무용 장단 실습2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "한국무용 장단 실습3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "한국무용 장단 실습4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "한국무용 장단 실습5",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "한국무용 장단 실습6",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "현대무용 실기1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "연기 실습1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "연기 실습2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "전통 연희 기초1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "무용 창작 실기1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "무용 창작 실기2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "무용 창작 실기3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "무용 창작 실기4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "한국무용 실기1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "한국무용 실기2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "한국무용 실기3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "한국무용 실기4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "한국무용 실기5",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "한국무용 실기6",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "타악연희 실기1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "타악연희 실기2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "타악연희 실기3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "타악연희 실기4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "타악연희 실기5",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "타악연희 실기6",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "실용무용역사와 동작분류",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "경영 기획",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "마케팅 기획",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "인쇄 기초 실습",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "인쇄 실무",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "오프셋 인쇄",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "디지털 이미지 가공",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "AI 영상 제작",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "AI 이미지 콘텐츠 제작",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "시각디자인1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "시각디자인2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "3D 애니메이션 제작",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "브랜드 경험 디자인",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "모션그래픽 디자인",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "연기연출",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "보컬실무",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "레크리에이션지도1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "레크리에이션지도2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "광고제작실무",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "영화기술심화",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "영화산업의 이해",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "영화 작법",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "배우 특기 훈련",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "뮤지컬 제작",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "연기 방법론",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "무대감독",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "무대음향I",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "소셜미디어방송서비스",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "매체연기",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "영상촬영",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "영화 제작 심화 실습",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "네일미용 현장실무",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "피부미용 현장실무",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "헤어미용 현장실무",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "메이크업 현장실무",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "응용 제과",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "소믈리에 서비스",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "응용 제빵",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "3D 스캔·건축 시설물 역설계",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "공간정보 활용",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "3D 모델링 프로젝트",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "고속차량유지보수",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "디젤차량유지보수",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "자동차 안전관리",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "철도관제",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "철도차량제작 프로젝트",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "스마트 에너지 설계",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "스마트 공장 기계 설비 유지관리",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "스마트 시스템 관리",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "에너지 절약 서비스",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "건물 에너지 관리 시스템",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "비파괴 검사 실무",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "바이오 세라믹",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "전기·전자 세라믹",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "단위조작의 기초",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "바이오의약품 품질관리",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "웹 애플리케이션 개발",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "물분무등 소화 설비 시공",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "소방설비 시공관리",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "소방기계설비설계",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "소방전기설비설계",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "소방시설점검",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "내선설비공사",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "프로그래밍 JAVA 기초",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "프로그래밍 JAVA 실무",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "천문학 세미나",
    "groupType": "시도교육청인정",
    "subjectGroup": "과학",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "미술기초실기1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "미술기초실기2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "미술 전공실기2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "민요 전공 실기 1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "민요 전공 실기 2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "토의·토론 실습 기초",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "융합"
  },
  {
    "subjectName": "토의·토론 실습 심화",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "융합"
  },
  {
    "subjectName": "세계유산 탐구",
    "groupType": "시도교육청인정",
    "subjectGroup": "사회",
    "selectionType": "융합"
  },
  {
    "subjectName": "영어 비판적 사고와 토의 및 토론",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "진로"
  },
  {
    "subjectName": "학생자치와 민주시민",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "융합"
  },
  {
    "subjectName": "학생자치와 시민참여",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "융합"
  },
  {
    "subjectName": "주제 탐구(R&E) 기초",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "융합"
  },
  {
    "subjectName": "주제 탐구(R&E) 심화",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "융합"
  },
  {
    "subjectName": "탐구 프로젝트(R&E)I",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "융합"
  },
  {
    "subjectName": "탐구 프로젝트(R&E)II",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "융합"
  },
  {
    "subjectName": "인공지능과 함께하는 세상",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "진로"
  },
  {
    "subjectName": "태권도I",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "진로"
  },
  {
    "subjectName": "태권도II",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "진로"
  },
  {
    "subjectName": "학술 영어 작문",
    "groupType": "시도교육청인정",
    "subjectGroup": "영어",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "학술 영어 발표",
    "groupType": "시도교육청인정",
    "subjectGroup": "영어",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "글로벌 이슈와 토론",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "융합"
  },
  {
    "subjectName": "가야금 전공 실기 1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "가야금 전공 실기 2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "가야금병창 전공 실기 1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "가야금병창 전공 실기 2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "거문고 전공 실기 1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "거문고 전공 실기 2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "국악가곡 전공 실기 1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "국악가곡 전공 실기 2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "국악작곡 전공 실기 1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "국악작곡 전공 실기 2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "국악타악 전공 실기 1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "국악타악 전공 실기 2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "대금 전공 실기 1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "대금 전공 실기 2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "더블베이스 전공 실기 1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "더블베이스 전공 실기 2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "무용기초실기2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "무용 전공실기2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "바순 전공실기1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "바순 전공실기2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "바이올린 전공실기1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "바이올린 전공실기2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "발레기초실기1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "발레기초실기2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "발레 전공실기1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "발레 전공실기2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "비올라 전공실기1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "비올라 전공실기2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "색소폰 전공실기1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "색소폰 전공실기2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "시창·청음2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "아쟁 전공 실기 1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "아쟁 전공 실기 2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "오르간 전공 실기 1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "오르간 전공 실기 2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "오보에 전공실기1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "오보에 전공실기2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "음악공연실습2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "음악 전공실기2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "작곡 전공실기1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "작곡 전공실기2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "첼로 전공실기1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "첼로 전공실기2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "클라리넷 전공실기1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "클라리넷 전공실기2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "클래식기타 전공실기1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "클래식기타 전공실기2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "타악 전공실기1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "타악 전공실기2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "튜바 전공실기1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "튜바 전공실기2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "트럼본 전공 실기 1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "트럼본 전공 실기 2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "트럼펫 전공실기1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "트럼펫 전공실기2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "판소리 전공 실기 1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "판소리 전공 실기 2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "플루트 전공실기1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "플루트 전공실기2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "피리 전공 실기 1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "피리 전공 실기 2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "피아노 전공실기1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "피아노 전공실기2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "하프 전공 실기 1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "하프 전공 실기 2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "해금 전공 실기 1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "해금 전공 실기 2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "현대무용 전공실기1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "현대무용 전공실기2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "호른 전공실기1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "호른 전공실기2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "펜싱 경기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "투척·중장거리 경기 체력",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "투척·중장거리 경기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "태권도 경기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "탁구 경기 체력",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "탁구 경기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "체조 경기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "조정 경기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "유도 경기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "역도 경기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "에어로빅 경기 체력",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "에어로빅 경기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "양궁 경기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "심화 투척·중장거리 전공 실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "심화 탁구 전공 실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "심화 에어로빅 전공 실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "심화 수영·핀수영 전공 실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "심화 세팍타크로 전공 실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "심화 럭비 전공 실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "심화 단거리·도약 전공 실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "수영·핀수영 경기 체력",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "수영·핀수영 경기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "세팍타크로 경기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "세팍타크로 경기 체력",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "사이클 경기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "사격 경기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "복싱 경기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "레슬링 경기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "럭비 경기 체력",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "럭비 경기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "단거리·도약 경기 체력",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "단거리·도약 경기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "기초 투척·중장거리 전공 실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "기초 탁구 전공 실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "기초 에어로빅 전공 실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "기초 수영·핀수영 전공 실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "기초 세팍타크로 전공 실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "기초 럭비 전공 실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "기초 단거리·도약 전공 실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "근대5종 경기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "드로잉 심화I",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "드로잉 심화II",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "드로잉 심화III",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "무용 공연실습I",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "무용 전공실기I",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "무용 전공실기II",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "무용 전공실기III",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "무용 전공실기IV",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "무용 전공심화I",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "무용 전공심화II",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "무용과 표현I",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "무용과 표현II",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "무용과 표현III",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "무용과 표현IV",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "무용창작I",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "무용창작II",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "미술 매체 탐구 심화",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "미술사 토론",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "미술 전공 실기 심화I",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "미술 전공 실기 심화II",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "미술 전공 실기 심화III",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "미술 탐구와 토론",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "시창·청음의 실제I",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "시창·청음의 실제II",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "시창·청음의 실제III",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "음악이론의 실제I",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "음악이론의 실제II",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "음악 전공실기의 실제I",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "음악 전공실기의 실제II",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "음악 전공실기의 실제III",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "음악 전공실기의 실제IV",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "음악 전공실기의 실제V",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "조형 탐구 심화",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "종교와 공연예술I",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "융합"
  },
  {
    "subjectName": "종교와 공연예술II",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "융합"
  },
  {
    "subjectName": "종교와 사회실천",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "진로"
  },
  {
    "subjectName": "종교와 생명과학 토론",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "융합"
  },
  {
    "subjectName": "종교와 실천I",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "진로"
  },
  {
    "subjectName": "종교와 실천II",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "진로"
  },
  {
    "subjectName": "종교와 인공지능",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "융합"
  },
  {
    "subjectName": "합창·합주I",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "합창·합주II",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "합창·합주III",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "합창·합주IV",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "합창·합주V",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "화성학의 실제I",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "화성학의 실제II",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "드로잉 I",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "수학과 인공지능",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "미래자동차공학개론",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "신발생산",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "신발개발",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "3D제작디자인",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "진로"
  },
  {
    "subjectName": "헤어 미용 기초",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "네일 미용 기초",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "메이크업 기초",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "피부 미용 기초",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "헤어 디자인",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "실내디자인2",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "크루즈항공서비스실무",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "해군리더십I",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "특목"
  },
  {
    "subjectName": "방재 안전1",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "방재 안전2",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "구조구급교육훈련1",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "구조구급교육훈련2",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "경호 실무1",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "경호 실무2",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "진로"
  },
  {
    "subjectName": "한국무용기초실기I",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "한국무용기초실기II",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "한국무용 전공실기I",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "한국무용 전공실기II",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "현대무용기초실기I",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "현대무용기초실기II",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "진로(특목)"
  },
  {
    "subjectName": "영상 촬영 실무",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "진로"
  },
  {
    "subjectName": "부산의 활동수학",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "융합"
  },
  {
    "subjectName": "진로·직업 탐구",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "진로"
  },
  {
    "subjectName": "진로·학업 설계",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "진로"
  },
  {
    "subjectName": "화학물질 취급 실무",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "SW제품기획",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "자기성장 프로젝트",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "어울림 프로젝트",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "인공지능 서비스 구현",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "창의융합 과제연구",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초 요트 전공 실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "시설원예복합환경관리I",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "시설원예복합환경관리II",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "미생물 배양 기술",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "GMP 품질관리실무",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "지게차 운전 기초",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "문학적 감성과 상상력",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "인문학의 창을 통해 본 미술",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "인문학적 감성과 도덕적 상상력",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "인문학적 감성과 역사 이해",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "인문학적 상상여행",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "생활과 창의성",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "진로와 기업가 정신",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "창의적 디자인 사고와 비즈니스 모델",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "비즈니스 모델 개발과 사업계획서",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "수학 과제연구",
    "groupType": "시도교육청인정",
    "subjectGroup": "수학",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "물리 과제연구",
    "groupType": "시도교육청인정",
    "subjectGroup": "과학",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "화학 과제연구",
    "groupType": "시도교육청인정",
    "subjectGroup": "과학",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "생명과학 과제연구",
    "groupType": "시도교육청인정",
    "subjectGroup": "과학",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "지구과학 과제연구",
    "groupType": "시도교육청인정",
    "subjectGroup": "과학",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국어 연구방법론",
    "groupType": "시도교육청인정",
    "subjectGroup": "국어",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "역사 연구방법론",
    "groupType": "시도교육청인정",
    "subjectGroup": "사회",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "도덕윤리 연구방법론",
    "groupType": "시도교육청인정",
    "subjectGroup": "사회",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "지리 연구방법론",
    "groupType": "시도교육청인정",
    "subjectGroup": "사회",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "경제 연구방법론",
    "groupType": "시도교육청인정",
    "subjectGroup": "사회",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "정치 및 법과 사회 연구방법론",
    "groupType": "시도교육청인정",
    "subjectGroup": "사회",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "사회문화 연구방법론",
    "groupType": "시도교육청인정",
    "subjectGroup": "사회",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국어 과제연구",
    "groupType": "시도교육청인정",
    "subjectGroup": "국어",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "역사 과제연구",
    "groupType": "시도교육청인정",
    "subjectGroup": "사회",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "도덕윤리 과제연구",
    "groupType": "시도교육청인정",
    "subjectGroup": "사회",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "지리 과제연구",
    "groupType": "시도교육청인정",
    "subjectGroup": "사회",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "경제 과제연구",
    "groupType": "시도교육청인정",
    "subjectGroup": "사회",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "정치 및 법과 사회 과제연구",
    "groupType": "시도교육청인정",
    "subjectGroup": "사회",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "사회와문화 과제연구",
    "groupType": "시도교육청인정",
    "subjectGroup": "사회",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "과학 시민",
    "groupType": "시도교육청인정",
    "subjectGroup": "과학",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "인구와 미래",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "통계와 사회",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "미디어와 사회",
    "groupType": "시도교육청인정",
    "subjectGroup": "사회",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "영어 토론과 시사I",
    "groupType": "시도교육청인정",
    "subjectGroup": "영어",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "영어 토론과 시사II",
    "groupType": "시도교육청인정",
    "subjectGroup": "영어",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "영어 연구 및 세미나I",
    "groupType": "시도교육청인정",
    "subjectGroup": "영어",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "영어 연구 및 세미나II",
    "groupType": "시도교육청인정",
    "subjectGroup": "영어",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "영어 비판적 사고와 논증",
    "groupType": "시도교육청인정",
    "subjectGroup": "영어",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "통합수학I",
    "groupType": "시도교육청인정",
    "subjectGroup": "수학",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "상륙장갑차 운용",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "삶과 철학",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "창작활동",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "생태농업",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "학생자치활동과 토론",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "통합 기행",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "문화 비평",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "진로탐색 과제연구",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "강화사의 이해",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "지역 사회 봉사",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "자율 탐구 프로젝트",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "물리학 주제 토론",
    "groupType": "시도교육청인정",
    "subjectGroup": "과학",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "화학 주제 토론",
    "groupType": "시도교육청인정",
    "subjectGroup": "과학",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "생명과학 주제 토론",
    "groupType": "시도교육청인정",
    "subjectGroup": "과학",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "지구과학 주제 토론",
    "groupType": "시도교육청인정",
    "subjectGroup": "과학",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "수치해석의 기초",
    "groupType": "시도교육청인정",
    "subjectGroup": "과학",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "현대사회와 철학",
    "groupType": "시도교육청인정",
    "subjectGroup": "사회",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "영문학",
    "groupType": "시도교육청인정",
    "subjectGroup": "영어",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "에세이 프리젠테이션",
    "groupType": "시도교육청인정",
    "subjectGroup": "영어",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "비판적 읽기와 쓰기",
    "groupType": "시도교육청인정",
    "subjectGroup": "영어",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "한국사 심화 탐구",
    "groupType": "시도교육청인정",
    "subjectGroup": "사회",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "서양의 철학과 사상",
    "groupType": "시도교육청인정",
    "subjectGroup": "사회",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "사회 정의",
    "groupType": "시도교육청인정",
    "subjectGroup": "사회",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "사회 문제와 윤리",
    "groupType": "시도교육청인정",
    "subjectGroup": "사회",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "정치와 사회",
    "groupType": "시도교육청인정",
    "subjectGroup": "사회",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "세계 문화 이해",
    "groupType": "시도교육청인정",
    "subjectGroup": "사회",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "대중문화 산업 그리고 한류",
    "groupType": "시도교육청인정",
    "subjectGroup": "사회",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "미래 사회학",
    "groupType": "시도교육청인정",
    "subjectGroup": "사회",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "과학기술 사회학",
    "groupType": "시도교육청인정",
    "subjectGroup": "사회",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "예술과 미적 경험에 대한 철학적 이해",
    "groupType": "시도교육청인정",
    "subjectGroup": "사회",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "소비하는 인간",
    "groupType": "시도교육청인정",
    "subjectGroup": "사회",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "창의적 문제 해결 연습",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "비판적 사고 연습",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "후마니타스: 인간의 가치 탐색",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "인공지능과 피지컬 컴퓨팅",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "패키지디자인(NCS)",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "병원안내(NCS)",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "항공사무일반",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "항공보안",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "항공여객운송서비스",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "항공객실서비스",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "소방설비I",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "소방설비II",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "소방점검실무",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "위험물질론",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "위험시설론",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "총기장비",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "화포장비",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "학생자치와 사회참여",
    "groupType": "시도교육청인정",
    "subjectGroup": "사회",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "성악 전공 실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "피아노 전공 실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "바이올린 전공 실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "비올라 전공 실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "첼로 전공 실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "콘트라베이스 전공 실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "클래식기타 전공 실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "플루트 전공 실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "오보에 전공 실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "클라리넷 전공 실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "바순 전공 실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "색소폰 전공 실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "리코더 전공 실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "호른 전공 실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "트럼펫 전공 실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "트롬본 전공 실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "튜바 전공 실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "타악 전공 실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "작곡 전공 실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "한국화 전공 실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "서양화 전공 실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "디자인 전공 실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "조소 전공 실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "한국무용 기초 실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "현대무용 기초 실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "발레 기초 실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "한국무용 전공 실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "현대무용 전공 실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "발레 전공 실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "동시대 미술",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "디자인 전공 실기I",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "디자인 전공 실기II",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "디자인 전공 실기III",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "디자인 전공 실기IV",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "서양화 전공 실기I",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "서양화 전공 실기II",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "서양화 전공 실기III",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "서양화 전공 실기IV",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "한국화 전공 실기I",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "한국화 전공 실기II",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "한국화 전공 실기III",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "한국화 전공 실기IV",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "평면조형I",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "평면조형II",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "평면조형III",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "평면조형IV",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "인공지능 시대의 4차 산업 영어",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "인공지능 플랫폼 구축",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초 체육(유도) 전공실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초 체육(수영) 전공실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초 체육(다이빙) 전공실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초 체육(핀수영) 전공실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초 체육(펜싱) 전공실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초 체육(투척) 전공실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초 체육(태권도) 전공실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초 체육(체조) 전공실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초 체육(육상 중장거리) 전공실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초 체육(조정) 전공실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초 체육(자전거) 전공실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초 체육(역도) 전공실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초 체육(양궁) 전공실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초 체육(사격) 전공실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초 체육(복싱) 전공실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초 체육(레슬링) 전공실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초 체육(육상 도약) 전공실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초 체육(육상 단거리) 전공실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초 체육(근대5종) 전공실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초 체육(세팍타크로) 전공실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "심화 체육(세팍타크로) 전공실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "고급 체육(세팍타크로) 전공실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "생각하기와 표현하기",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "세계시민교육",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "평화통일교육",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "커뮤니케이션의 공학적 이해",
    "groupType": "시도교육청인정",
    "subjectGroup": "국어",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "인공지능 자율주행자동차 탐구",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "해양경찰학 개론",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "선박 일반",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "해상 관제",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "선박 보수I",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "선박 보수II",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "동아시아 시민",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "탐구 기반 영어 글쓰기",
    "groupType": "시도교육청인정",
    "subjectGroup": "영어",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "전통 조리",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "전통 조리 심화",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "고급 서양 조리",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "고급 서양 조리 심화",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "식음료 서비스",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "식음료 서비스 심화",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "양서파충류 사육 기초",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "반도체 기초",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "반도체 공정 기초",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "질문 기반 주제 탐구",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "아카데믹 영어와 글로벌 이슈",
    "groupType": "시도교육청인정",
    "subjectGroup": "영어",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "합주1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "합주2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "합주3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "합주4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "합주5",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "합창1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "합창2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "합창3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "합창4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "합창5",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "조소 전공 실기I",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "조소 전공 실기II",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "조소 전공 실기III",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "조소 전공 실기IV",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초 체육 전공 실기 핀수영1",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초 체육 전공 실기 핀수영2",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초 체육 전공 실기 펜싱1",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초 체육 전공 실기 펜싱2",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초 체육 전공 실기 태권도1",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초 체육 전공 실기 태권도2",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초 체육 전공 실기 체조1",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초 체육 전공 실기 체조2",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초 체육 전공 실기 조정1",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초 체육 전공 실기 조정2",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초 체육 전공 실기 자전거1",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초 체육 전공 실기 자전거2",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초 체육 전공 실기 육상 투척1",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초 체육 전공 실기 육상 투척2",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초 체육 전공 실기 육상 중장거리1",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초 체육 전공 실기 육상 중장거리2",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초 체육 전공 실기 육상 도약1",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초 체육 전공 실기 육상 도약2",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초 체육 전공 실기 육상 단거리1",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초 체육 전공 실기 육상 단거리2",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초 체육 전공 실기 유도1",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초 체육 전공 실기 유도2",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초 체육 전공 실기 역도1",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초 체육 전공 실기 역도2",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초 체육 전공 실기 양궁1",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초 체육 전공 실기 양궁2",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초 체육 전공 실기 수영 다이빙1",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초 체육 전공 실기 수영 다이빙2",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초 체육 전공 실기 수영 경영1",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초 체육 전공 실기 수영 경영2",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초 체육 전공 실기 세팍타크로1",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초 체육 전공 실기 세팍타크로2",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초 체육 전공 실기 사격 소총1",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초 체육 전공 실기 사격 소총2",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초 체육 전공 실기 사격 권총1",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초 체육 전공 실기 사격 권총2",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초 체육 전공 실기 복싱1",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초 체육 전공 실기 복싱2",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초 체육 전공 실기 레슬링1",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초 체육 전공 실기 레슬링2",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초 체육 전공 실기 근대5종1",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초 체육 전공 실기 근대5종2",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "시창과 청음1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "시창과 청음2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "시창과 청음3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "시창과 청음4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "시창과 청음5",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "음악 공연 실습1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "음악 공연 실습3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "음악 공연 실습4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "음악 공연 실습5",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "음악 공연 실습6",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "음악이론심화",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "리코더 전공 실기1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "리코더 전공 실기2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "리코더 전공 실기3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "리코더 전공 실기4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "리코더 전공 실기5",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "리코더 전공 실기6",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "바순 전공 실기3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "바순 전공 실기4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "바순 전공 실기5",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "바순 전공 실기6",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "바이올린 전공 실기3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "바이올린 전공 실기4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "바이올린 전공 실기5",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "바이올린 전공 실기6",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "비올라 전공 실기3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "비올라 전공 실기4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "비올라 전공 실기5",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "비올라 전공 실기6",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "색소폰 전공 실기3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "색소폰 전공 실기4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "색소폰 전공 실기5",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "색소폰 전공 실기6",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "성악 전공 실기1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "성악 전공 실기2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "성악 전공 실기3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "성악 전공 실기4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "성악 전공 실기5",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "성악 전공 실기6",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "오보에 전공 실기3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "오보에 전공 실기4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "오보에 전공 실기5",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "오보에 전공 실기6",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "작곡 전공 실기3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "작곡 전공 실기4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "작곡 전공 실기5",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "작곡 전공 실기6",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "첼로 전공 실기3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "첼로 전공 실기4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "첼로 전공 실기5",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "첼로 전공 실기6",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "콘트라베이스 전공 실기1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "콘트라베이스 전공 실기2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "콘트라베이스 전공 실기3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "콘트라베이스 전공 실기4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "콘트라베이스 전공 실기5",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "콘트라베이스 전공 실기6",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "클라리넷 전공 실기3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "클라리넷 전공 실기4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "클라리넷 전공 실기5",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "클라리넷 전공 실기6",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "클래식기타 전공 실기3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "클래식기타 전공 실기4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "클래식기타 전공 실기5",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "클래식기타 전공 실기6",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "타악 전공 실기3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "타악 전공 실기4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "타악 전공 실기5",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "타악 전공 실기6",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "튜바 전공 실기3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "튜바 전공 실기4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "튜바 전공 실기5",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "튜바 전공 실기6",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "트럼펫 전공 실기3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "트럼펫 전공 실기4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "트럼펫 전공 실기5",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "트럼펫 전공 실기6",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "트롬본 전공 실기1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "트롬본 전공 실기2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "트롬본 전공 실기3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "트롬본 전공 실기4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "트롬본 전공 실기5",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "트롬본 전공 실기6",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "플루트 전공 실기3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "플루트 전공 실기4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "플루트 전공 실기5",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "플루트 전공 실기6",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "피아노 전공 실기3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "피아노 전공 실기4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "피아노 전공 실기5",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "피아노 전공 실기6",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "호른 전공 실기3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "호른 전공 실기4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "호른 전공 실기5",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "호른 전공 실기6",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "호른 전공 실기_1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "호른 전공 실기_2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "피아노 전공 실기_1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "피아노 전공 실기_2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "플루트 전공 실기_1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "플루트 전공 실기_2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "트럼펫 전공 실기_1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "트럼펫 전공 실기_2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "튜바 전공 실기_1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "튜바 전공 실기_2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "타악 전공 실기_1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "타악 전공 실기_2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "클라리넷 전공 실기_1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "클라리넷 전공 실기_2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "첼로 전공 실기_1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "첼로 전공 실기_2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "오보에 전공 실기_1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "오보에 전공 실기_2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "색소폰 전공 실기_1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "색소폰 전공 실기_2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "비올라 전공 실기_1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "비올라 전공 실기_2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "바이올린 전공 실기_1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "바이올린 전공 실기_2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "바순 전공 실기_1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "바순 전공 실기_2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "음악 공연 실습_2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "작곡 전공 실기_1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "작곡 전공 실기_2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "클래식기타 전공 실기_1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "클래식기타 전공 실기_2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "굴착기 운전",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기계장치제어",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "비파괴 검사",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "실내디자인I",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "실내디자인II",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "측량I",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "측량II",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "군대윤리",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "소프트웨어공학 실무",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "앱프로그래밍",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "운영체제",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "웹프로그래밍",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "웹프로그래밍 기초",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "인공지능 프로그래밍",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "인공지능 프로그래밍 기초(파이선)",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "자바 프로그래밍",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "파이썬 프로그래밍",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "종교와 공동체",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "종교와 생활",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "현대 사회와 종교",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "곡류 가공",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "농업 기초 기술 일반",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "동물보건",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "반려동물 행동교정",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "식품 가공 기술 심화",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "식품 과학 심화",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "식품 위생 심화",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "양식 조리 기초",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "양식 조리 심화",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "제과 심화",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "제빵 심화",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "트리밍",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "펫패션",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "한식 조리 심화",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "건설기계구조·정비",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기계구조와기능",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "로봇 설비 보전",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "자동차기초실습",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "자동차프로젝트실습 I",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "자동차프로젝트실습 II",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "패키지디자인",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "프로젝트실습",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "광주 근·현대사1",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "광주 근·현대사2",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "생명존중1",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "생명존중2",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "생활목공 초급",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "인문학 입문1",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "인문학 입문2",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "자전거 초급",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "주를 여는 시간의 이해1",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "주를 여는 시간의 이해2",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "환경과에너지1",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "환경과에너지2",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "의약품 제조",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "의약품품질관리",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "제빵 1",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "제빵 2",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "화장품 제조1",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "화장품 제조2",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "공예",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국토순례",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "노작활동",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "산악등반",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "요가체조 및 영상",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "풍선아트",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "네일미용1",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "네일미용2",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "미용 고객관리1",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "미용 고객관리2",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "피부미용1",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "피부미용2",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "헤어미용1",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "헤어미용2",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "다문화 음식",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "음악의 이해",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "자기이해와 진로1",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "자기이해와 진로2",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "태권도 초급1",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "태권도 초급2",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "토픽1",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "토픽2",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "한국문화체험",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "한국어1",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "한국어2",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "수리와 인공지능",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "정보 과제 연구",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "건강운동관리",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "골프 캐디 실무",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "병원 안내",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "병원행정",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "일반인스포츠지도",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "고등학교 헤어미용",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초 피부 미용",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초 헤어 미용",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "네일아트",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "메이크업 실무",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "비즈니스 엑셀",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "응용네일",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "응용 메이크업",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "응용 에스테틱",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "정보기술과 활용",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "피부미용 기기관리",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "헤어컬러 스타일링",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국가안보론",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국방체육",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "군리더십",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "굴착기 정비",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "독도법",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "부사관역할과 실무",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "부사관 태권도",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "전쟁사",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "지게차 정비",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "미디어정보리터러시",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "AI코딩목공",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "건축설계I",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "건축설계II",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "드론콘텐츠제작",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "실내건축설계",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "상업수학",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "토익연습일반",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "삶과 종교1",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "삶과 종교2",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "생태학습",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "문화탐방1",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "문화탐방2",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "마음공부1",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "마음공부2",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "원예와 생활",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "보컬 기초",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "보컬 심화",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "대중음악의 이해1",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "대중음악의 이해2",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "실용공예",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "풍선아트의 활용",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "바른자세 및 스트레칭",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "생활체육1",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "생활체육2",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악 공연 실습",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악 공연 실습I",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악 전공 실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악 전공실기I",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악 합주I",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악 합창",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악 합창I",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "음악 공연 실습I",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "음악 전공실기I",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "평면 조형",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "한국화 드로잉",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "한국화 드로잉I",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "미술 전공실기I",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "드로잉 심화",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "무용의 이해 I",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "안무 I",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "근대5종 전공 실기 기초 1",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "근대5종 전공 실기 기초 2",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "레슬링 전공 실기 기초 1",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "레슬링 전공 실기 기초 2",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "롤러 전공 실기 기초 1",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "롤러 전공 실기 기초 2",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "배구 전공 실기 기초 1",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "배구 전공 실기 기초 2",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "배드민턴 전공 실기 기초 1",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "배드민턴 전공 실기 기초 2",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "복싱 전공 실기 기초 1",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "복싱 전공 실기 기초 2",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "볼링 전공 실기 기초 1",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "볼링 전공 실기 기초 2",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "사격 전공 실기 기초 1",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "사격 전공 실기 기초 2",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "수영 전공 실기 기초 1",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "수영 전공 실기 기초 2",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "양궁 전공 실기 기초 1",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "양궁 전공 실기 기초 2",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "에어로빅힙합 전공 실기 기초 1",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "에어로빅힙합 전공 실기 기초 2",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "역도 전공 실기 기초 1",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "역도 전공 실기 기초 2",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "유도 전공 실기 기초 1",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "유도 전공 실기 기초 2",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "육상 단거리 전공 실기 기초 1",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "육상 단거리 전공 실기 기초 2",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "육상 도약 전공 실기 기초 1",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "육상 도약 전공 실기 기초 2",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "육상 중장거리 전공 실기 기초 1",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "육상 중장거리 전공 실기 기초 2",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "육상 투척 전공 실기 기초 1",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "육상 투척 전공 실기 기초 2",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "자전거 전공 실기 기초 1",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "자전거 전공 실기 기초 2",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "조정 전공 실기 기초 1",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "조정 전공 실기 기초 2",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "체조 전공 실기 기초 1",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "체조 전공 실기 기초 2",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "태권도 전공 실기 기초 1",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "태권도 전공 실기 기초 2",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "펜싱 전공 실기 기초 1",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "펜싱 전공 실기 기초 2",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "핀수영 전공 실기 기초 1",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "핀수영 전공 실기 기초 2",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악합주",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "합주_I",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "합창_I",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "골프 경기 기술 전공 실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "근대5종경기기술전공실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "레슬링경기기술전공실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "복싱경기기술전공실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "사격경기기술전공실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "수영경영경기기술전공실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "양궁경기기술전공실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "역도경기기술전공실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "유도경기기술전공실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "육상단거리경기기술전공실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "육상도약경기기술전공실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "육상중장거리경기기술전공실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "육상투척경기기술전공실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "인라인룰러경기기술전공실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "자전거경기기술전공실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "체조경기기술전공실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "태권도경기기술전공실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "핀수영경기기술전공실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "핸드볼경기기술전공실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "골프경기분석전공실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "근대5종경기분석전공실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "레슬링경기분석전공실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "복싱경기분석전공실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "사격경기분석전공실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "수영경영경기분석전공실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "양궁경기분석전공실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "역도경기분석전공실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "유도경기분석전공실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "육상단거리경기분석전공실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "육상도약경기분석전공실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "육상 중장거리경기분석전공실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "육상투척경기분석전공실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "인라인룰러경기분석전공실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "자전거경기분석전공실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "체조경기분석전공실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "태권도경기분석전공실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "핀수영경기분석전공실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "핸드볼경기분석전공실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "골프경기체력전공실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "근대5종경기체력전공실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "레슬링경기체력전공실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "복싱경기체력전공실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "사격경기체력전공실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "수영경영경기체력전공실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "양궁경기체력전공실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "역도경기체력전공실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "유도경기체력전공실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "육상단거리경기체력전공실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "육상도약경기체력전공실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "육상중장거리경기체력전공실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "육상투척경기체력전공실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "인라인룰러경기체력전공실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "자전거경기체력전공실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "체조경기체력전공실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "태권도경기체력전공실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "핀수영경기체력전공실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "핸드볼경기체력전공실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "고급골프전공실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "고급근대5종전공실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "고급레슬링전공실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "고급복싱전공실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "고급사격전공실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "고급수영경영전공실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "고급양궁전공실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "고급역도전공실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "고급유도전공실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "고급육상단거리전공실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "고급육상도약전공실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "고급육상중장거리전공실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "고급육상투척전공실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "고급인라인롤러전공실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "고급자전거전공실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "고급체조전공실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "고급태권도전공실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "고급핀수영전공실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "고급핸드볼전공실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초골프전공실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초인라인롤러전공실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초핸드볼전공실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "심화골프전공실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "심화인라인롤러전공 실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "심화핸드볼전공실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "피아노실기I",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "피아노실기II",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "성악실기I",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "성악실기II",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "작곡실기I",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "작곡실기II",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "현악실기I",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "현악실기II",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악실기I",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악실기II",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "타악실기I",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "타악실기II",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "관악실기I",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "관악실기II",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "실용음악실기I",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "실용음악실기II",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "미술실기I",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "미술실기II",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "발레실기I",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "발레실기II",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "한국무용실기I",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "한국무용실기II",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "현대무용실기I",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "현대무용실기II",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "연기실기I",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "연기실기II",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "로더운전",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "바이오기초기술",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "반려동물사회화교육기초",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "반려동물사회화교육실무",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "반려동물행동교정기초",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "반려동물행동교정실무",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "분리정제실무",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "지게차 운전",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "방산프로젝트",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국방캡스톤디자인",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "방위산업안전관리",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "철도차량기계장치",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "철도차량전자장치",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "철도차량전기장치",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "철도안전관리",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "철도차량정비 1",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "철도차량정비 2",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "용접공통직무",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "스마트공장시스템설치",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "화면디자인",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "태권도1",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "태권도2",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "역 시설물 유지보수",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "이용",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "창호시공",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "헬스 바디 에스테틱",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "헬스 뷰티 응용실무",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "운영체제1",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "운영체제2",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "인공지능론1",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "인공지능론2",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "서버프로그래밍",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "인공지능활용",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "프론트엔드 프로그래밍",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "알고리즘 실무1",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "알고리즘 실무2",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "컴퓨터과학 탐구I",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "컴퓨터과학 탐구II",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "프로젝트 실무I",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "프로젝트 실무II",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "딥러닝 실무",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "빅데이터 실무",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "서버 프로그래밍 실무",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "프론트엔드 프로그래밍 실무",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "웹 개발 입문",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "인공지능 프로그래밍 입문",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "웹 개발 프로그래밍",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "객체지향 프로그래밍(JAVA)",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "소프트웨어 엔지니어링 실무",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "발레 기초",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "실용무용 기초",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "한국무용 기초",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "현대무용 기초",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "발레 기초I",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "실용무용 기초I",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "한국무용 기초I",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "현대무용 기초I",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "발레 전공",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "실용무용 전공",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "한국무용 전공",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "현대무용 전공",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "발레 전공I",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "실용무용 전공I",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "한국무용 전공I",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "현대무용 전공I",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "관현악전공",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "관현악전공I",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "성악전공",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "성악전공I",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "실용음악전공",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "실용음악전공I",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "작곡전공",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "작곡전공I",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "피아노전공",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "피아노전공I",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "한국음악전공",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "한국음악전공I",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "미술 창작I",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "에너지와 탄소 중립",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "영어 비판적 읽기- 분석, 평가, 계발",
    "groupType": "시도교육청인정",
    "subjectGroup": "영어",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "AP미적분학I",
    "groupType": "시도교육청인정",
    "subjectGroup": "수학",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "AP미적분학II",
    "groupType": "시도교육청인정",
    "subjectGroup": "수학",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "AP일반물리I",
    "groupType": "시도교육청인정",
    "subjectGroup": "과학",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "AP일반물리II",
    "groupType": "시도교육청인정",
    "subjectGroup": "과학",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "AP일반화학I",
    "groupType": "시도교육청인정",
    "subjectGroup": "과학",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "AP일반화학II",
    "groupType": "시도교육청인정",
    "subjectGroup": "과학",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "AP일반생물학I",
    "groupType": "시도교육청인정",
    "subjectGroup": "과학",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "AP일반생물학II",
    "groupType": "시도교육청인정",
    "subjectGroup": "과학",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초 육상 전공 실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "심화 육상 전공 실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "스포츠 경기 체력 심화",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "노작체험활동2",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "문화예술체험활동2",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "팀프로젝트활동2",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "피아노",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "작곡",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "성악",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "관현악",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "실용보컬",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "실용작곡",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "실용연주",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "시창·청음 심화",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "시창·청음 응용",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "시창·청음 적용",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "시대별 연주 실습",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "음악 분석과 연주",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "피아노I",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "피아노II",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "피아노III",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "피아노IV",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "피아노V",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "성악I",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "성악II",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "성악III",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "성악IV",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "성악V",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "관현악I",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "관현악II",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "관현악III",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "관현악IV",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "관현악V",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악I",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악II",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악III",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악IV",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악V",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "한국화 실기I",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "한국화 실기II",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "한국화 실기III",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "한국화 실기IV",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "한국화 실기V",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "서양화 실기I",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "서양화 실기II",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "서양화 실기III",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "서양화 실기IV",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "서양화 실기V",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "조소 실기I",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "조소 실기II",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "조소 실기III",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "조소 실기IV",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "조소 실기V",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "디자인 실기I",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "디자인 실기II",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "디자인 실기III",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "디자인 실기IV",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "디자인 실기V",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "합창·합주 심화",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "음악 연주와 창작 심화",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "음악 공연 실습 심화",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "음악 이론 실습",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "시창·청음 실습",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "실용보컬I",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "실용보컬II",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "실용보컬III",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "실용보컬IV",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "실용보컬V",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "실용작곡I",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "실용작곡II",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "실용작곡III",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "실용작곡IV",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "실용작곡V",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "연극 제작 실습 기초",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "영화 기술 실습",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "영화 연구 실습",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "시나리오 창작",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "영화 창작과 표현",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "신체훈련",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "영상 연출I",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "영상 연출II",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "연기I",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "연기II",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "연기III",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "조세제도의 이해와 실제",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "문화로 보는 한국사",
    "groupType": "시도교육청인정",
    "subjectGroup": "사회",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "게임기획의 이해",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "색소폰1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "색소폰2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "트롬본1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "트롬본2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "디자인1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "서양화1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "조소1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "한국화1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "현대정치철학의이해",
    "groupType": "시도교육청인정",
    "subjectGroup": "사회",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "판소리1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "판소리2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "가야금1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "가야금2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "거문고1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "거문고2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "해금1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "해금2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "아쟁1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "아쟁2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "피리1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "피리2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "대금1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "대금2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악타악1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악타악2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "성악1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "성악2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "드럼1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "드럼2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "베이스기타1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "베이스기타2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "실용작곡1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "실용작곡2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "일렉기타1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "일렉기타2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "작곡1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "작곡2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "피아노1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "피아노2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "바이올린1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "바이올린2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "비올라1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "비올라2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "첼로1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "첼로2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "더블베이스1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "더블베이스2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "플루트1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "플루트2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "오보에1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "오보에2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "클라리넷1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "클라리넷2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "타악기1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "타악기2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "트럼펫1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "트럼펫2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "호른1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "호른2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "바순1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "바순2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "튜바1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "튜바2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "클래식기타1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "클래식기타2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "미술 전공실기III",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "게임기획의 이해(실습)",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "게임엔진응용 기본실습",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "게임엔진응용 심화실습",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "3D게임프로그래밍",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "3D게임프로그래밍(실습)",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "게임서버프로그래밍",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "게임서버프로그래밍(실습)",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "게임엔진기초 기본실습",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "게임엔진기초 심화실습",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국토 순례1",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국토 순례2",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "노작 과제 연구",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "문화 체험1",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "문화 체험2",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "인공지능 기반 생물정보학 기초와 활용",
    "groupType": "시도교육청인정",
    "subjectGroup": "과학",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "AP 프로그래밍과 문제해결",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "자동차 인공지능 구현",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "자율주행 자동차",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "커넥티드카 소프트웨어 개발",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초중국어1",
    "groupType": "시도교육청인정",
    "subjectGroup": "제2외국어/한문",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초중국어2",
    "groupType": "시도교육청인정",
    "subjectGroup": "제2외국어/한문",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기본중국어1",
    "groupType": "시도교육청인정",
    "subjectGroup": "제2외국어/한문",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기본중국어2",
    "groupType": "시도교육청인정",
    "subjectGroup": "제2외국어/한문",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "카푸치노 실무",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "과학창의연구",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "생활과학1",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "생활과학2",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "디딤수학",
    "groupType": "시도교육청인정",
    "subjectGroup": "수학",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "프로젝트 기본",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "그리스 언어와 문화",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "중국문학읽기1",
    "groupType": "시도교육청인정",
    "subjectGroup": "제2외국어/한문",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "중국문학읽기2",
    "groupType": "시도교육청인정",
    "subjectGroup": "제2외국어/한문",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "중국역사와 지역이해",
    "groupType": "시도교육청인정",
    "subjectGroup": "제2외국어/한문",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "비판적 사고와 철학",
    "groupType": "시도교육청인정",
    "subjectGroup": "사회",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "세계 역사와 문화",
    "groupType": "시도교육청인정",
    "subjectGroup": "사회",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "거시경제학 탐구",
    "groupType": "시도교육청인정",
    "subjectGroup": "사회",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "미시경제학 탐구",
    "groupType": "시도교육청인정",
    "subjectGroup": "사회",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "경제학 개론 탐구",
    "groupType": "시도교육청인정",
    "subjectGroup": "사회",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "사회학 탐구",
    "groupType": "시도교육청인정",
    "subjectGroup": "사회",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "논증적 글쓰기",
    "groupType": "시도교육청인정",
    "subjectGroup": "영어",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "독서와 의사소통",
    "groupType": "시도교육청인정",
    "subjectGroup": "국어",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "영화 소설 탐구",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "통계로 바라보는 국제문제",
    "groupType": "시도교육청인정",
    "subjectGroup": "사회",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국제기구와 과학 기술 협력",
    "groupType": "시도교육청인정",
    "subjectGroup": "사회",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "4차 산업혁명과 윤리 문제 탐구",
    "groupType": "시도교육청인정",
    "subjectGroup": "사회",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "공간 정보와 공간 분석",
    "groupType": "시도교육청인정",
    "subjectGroup": "사회",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "동양근대사 탐구",
    "groupType": "시도교육청인정",
    "subjectGroup": "사회",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "역사학으로 국제사회 읽기",
    "groupType": "시도교육청인정",
    "subjectGroup": "사회",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "윤리학 연습",
    "groupType": "시도교육청인정",
    "subjectGroup": "사회",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "프랑스어권 언어와 역사의 이해1",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "프랑스어권 언어와 역사의 이해2",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "일본 언어와 역사의 이해1",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "일본 언어와 역사의 이해2",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "중국 언어와 역사의 이해1",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "중국 언어와 역사의 이해2",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "독일어권 언어와 역사의 이해1",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "독일어권 언어와 역사의 이해2",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "스페인어권 언어와 역사의 이해1",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "스페인어권 언어와 역사의 이해2",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "글로벌 이슈 세미나1",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "글로벌 이슈 세미나2",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "미적분학 II",
    "groupType": "시도교육청인정",
    "subjectGroup": "수학",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "심화 미분적분학 I",
    "groupType": "시도교육청인정",
    "subjectGroup": "수학",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "심화 미분적분학 II",
    "groupType": "시도교육청인정",
    "subjectGroup": "수학",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "건축 CAD",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "회계 원리 기본 실습",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "뉴스포츠 전략 및 실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "인체구조와 기능 기본 실습",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "지게차 운전2",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "종교1",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "종교2",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초연기",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "촬영·조명1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "촬영·조명2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초한국화1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초한국화2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "스토리텔링1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "스토리텔링2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "실용관악1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "실용관악2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "프로그래밍 기본 실습",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "프로그래밍 심화 실습",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "바리스타 실습",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "제과 실습",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "연기1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "연기2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초동양화2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초디자인2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초서양화2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초조소2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "재즈피아노1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "재즈피아노2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "골프 역사1",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "골프 역사2",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "골프 장비학1",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "골프 장비학2",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "골프 규칙 및 에티켓1",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "골프 규칙 및 에티켓2",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기업 자원 관리 실무",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "시창작1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "시창작2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "시창작3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "시창작4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "시창작5",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "시창작6",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "소설창작1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "소설창작2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "소설창작3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "소설창작4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "소설창작5",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "소설창작6",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "극창작3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "극창작4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "극창작5",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "극창작6",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "공연실습3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "공연실습4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "공연실습5",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "공연실습6",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초드로잉1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "한국화3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "한국화4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "한국화드로잉1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "한국화드로잉2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "한국화드로잉3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "한국화드로잉4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "합창·합주1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "합창·합주2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "합창·합주3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "합창·합주4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "시창·청음1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "실내악1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "실내악2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "실내악3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "실내악4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "발상드로잉1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "발상드로잉2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "만화·애니메이션 기초",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "애니메이션 제작",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "만화창작1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "만화창작2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "융합콘텐츠 제작",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "시나리오1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "연극제작실습1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "연극제작실습2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "영화제작실습1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "영화제작실습2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "영화제작실습3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "경영 경기체력I",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "경영 경기체력II",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "경영 초급I",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "경영 초급II",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "근대5종 경기체력I",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "근대5종 경기체력II",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "근대5종 초급I",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "근대5종 초급II",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "다이빙 경기체력I",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "다이빙 경기체력II",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "다이빙 초급I",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "다이빙 초급II",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "단거리 경기체력I",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "단거리 경기체력II",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "단거리 초급I",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "단거리 초급II",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "도약 경기체력I",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "도약 경기체력II",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "도약 초급I",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "도약 초급II",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "레슬링 경기체력I",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "레슬링 경기체력II",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "레슬링 초급I",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "레슬링 초급II",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "복싱 경기체력I",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "복싱 경기체력II",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "복싱 초급I",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "복싱 초급II",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "사격 경기체력I",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "사격 경기체력II",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "사격 초급I",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "사격 초급II",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "수구 경기체력I",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "수구 경기체력II",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "수구 초급I",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "수구 초급II",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "양궁 경기체력I",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "양궁 경기체력II",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "양궁 초급I",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "양궁 초급II",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "역도 경기체력I",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "역도 경기체력II",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "역도 초급I",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "역도 초급II",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "유도 경기체력I",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "유도 경기체력II",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "유도 초급I",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "유도 초급II",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "중장거리 경기체력I",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "중장거리 경기체력II",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "중장거리 초급I",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "중장거리 초급II",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "체조 경기체력I",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "체조 경기체력II",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "체조 초급I",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "체조 초급II",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "투척 경기체력I",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "투척 경기체력II",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "투척 초급I",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "투척 초급II",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "트라이애슬론 경기체력I",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "트라이애슬론 경기체력II",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "트라이애슬론 초급I",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "트라이애슬론 초급II",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "핀수영 경기체력I",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "핀수영 경기체력II",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "핀수영 초급I",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "핀수영 초급II",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "단거리 중급I",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "단거리 중급II",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "단거리 경기기술I",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "단거리 경기기술II",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "중장거리 중급I",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "중장거리 중급II",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "중장거리 경기기술I",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "중장거리 경기기술II",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "투척 중급I",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "투척 중급II",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "투척 경기기술I",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "투척 경기기술II",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초드로잉2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초동양화1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초서양화1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초조소1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초디자인1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "동양화1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "동양화2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "동양화3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "동양화4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "서양화2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "서양화3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "서양화4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "조소2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "조소3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "조소4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "디자인2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "디자인3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "디자인4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "동양화드로잉1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "동양화드로잉2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "동양화드로잉3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "동양화드로잉4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "서양화드로잉1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "서양화드로잉2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "서양화드로잉3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "서양화드로잉4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "조소드로잉1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "조소드로잉2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "조소드로잉3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "조소드로잉4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "디자인드로잉1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "디자인드로잉2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "디자인드로잉3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "디자인드로잉4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "시창·청음3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "시창·청음4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "가야금3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "가야금4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "가야금5",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "가야금6",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "거문고3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "거문고4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "거문고5",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "거문고6",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "해금3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "해금4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "해금5",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "해금6",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "아쟁3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "아쟁4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "아쟁5",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "아쟁6",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "판소리3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "판소리4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "판소리5",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "판소리6",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "대금3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "대금4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "대금5",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "대금6",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "피리3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "피리4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "피리5",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "피리6",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악타악3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악타악4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악타악5",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악타악6",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "플루트3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "플루트4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "플루트5",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "플루트6",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "오보에3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "오보에4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "오보에5",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "오보에6",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "클라리넷3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "클라리넷4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "클라리넷5",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "클라리넷6",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "바순3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "바순4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "바순5",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "바순6",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "색소폰3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "색소폰4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "색소폰5",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "색소폰6",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "호른3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "호른4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "호른5",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "호른6",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "트럼펫3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "트럼펫4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "트럼펫5",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "트럼펫6",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "트롬본3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "트롬본4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "트롬본5",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "트롬본6",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "튜바3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "튜바4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "튜바5",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "튜바6",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "유포늄1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "유포늄2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "유포늄3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "유포늄4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "유포늄5",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "유포늄6",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "타악기3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "타악기4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "타악기5",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "타악기6",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "작곡3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "작곡4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "작곡5",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "작곡6",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "성악3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "성악4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "성악5",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "성악6",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "피아노3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "피아노4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "피아노5",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "피아노6",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "오르간1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "오르간2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "오르간3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "오르간4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "오르간5",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "오르간6",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "바이올린3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "바이올린4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "바이올린5",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "바이올린6",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "비올라3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "비올라4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "비올라5",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "비올라6",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "첼로3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "첼로4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "첼로5",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "첼로6",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "더블베이스3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "더블베이스4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "더블베이스5",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "더블베이스6",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "하프1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "하프2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "하프3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "하프4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "하프5",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "하프6",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "클래식기타3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "클래식기타4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "클래식기타5",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "클래식기타6",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "실용음악1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "실용음악2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "실용음악3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "실용음악4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "실용음악5",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "실용음악6",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "일렉기타3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "일렉기타4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "일렉기타5",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "일렉기타6",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "베이스기타3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "베이스기타4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "베이스기타5",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "베이스기타6",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "건반1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "건반2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "건반3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "건반4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "건반5",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "건반6",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "보컬1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "보컬2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "보컬3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "보컬4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "보컬5",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "보컬6",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "드럼3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "드럼4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "드럼5",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "드럼6",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "실용작곡3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "실용작곡4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "실용작곡5",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "실용작곡6",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초한국무용1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초한국무용2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초현대무용1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초현대무용2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초발레1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초발레2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "한국무용1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "한국무용2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "한국무용3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "한국무용4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "현대무용1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "현대무용2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "현대무용3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "현대무용4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "발레1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "발레2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "발레3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "발레4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "발레5",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "발레6",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "연극의 이해1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "연극의 이해2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "연극의 이해3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "연극의 이해4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "영화의 이해1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "영화의 이해2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "영화의 이해3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "영화의 이해4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "영화창작과 표현1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "영화창작과 표현2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "공연무대기술1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "공연무대기술2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "연극제작실습3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "연극제작실습4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "영화제작실습4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "연기5",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "연기6",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "도약 중급I",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "도약 중급II",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "도약 경기기술I",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "도약 경기기술II",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "다이빙 중급I",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "다이빙 중급II",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "다이빙 경기기술I",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "다이빙 경기기술II",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "수구 중급I",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "수구 중급II",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "수구 경기기술I",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "수구 경기기술II",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "경영 중급I",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "경영 중급II",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "경영 경기기술I",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "경영 경기기술II",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "핀수영 중급I",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "핀수영 중급II",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "핀수영 경기기술I",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "핀수영 경기기술II",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "복싱 중급I",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "복싱 중급II",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "복싱 경기기술I",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "복싱 경기기술II",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "레슬링 중급I",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "레슬링 중급II",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "레슬링 경기기술I",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "레슬링 경기기술II",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "역도 중급I",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "역도 중급II",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "역도 경기기술I",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "역도 경기기술II",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "유도 중급I",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "유도 중급II",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "유도 경기기술I",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "유도 경기기술II",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "양궁 중급I",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "양궁 중급II",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "양궁 경기기술I",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "양궁 경기기술II",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "사격 중급I",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "사격 중급II",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "사격 경기기술I",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "사격 경기기술II",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "체조 중급I",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "체조 중급II",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "체조 경기기술I",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "체조 경기기술II",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "근대5종 중급I",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "근대5종 중급II",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "근대5종 경기기술I",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "근대5종 경기기술II",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "트라이애슬론 중급I",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "트라이애슬론 중급II",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "트라이애슬론 경기기술I",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "트라이애슬론 경기기술II",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "경영 고급I",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "경영 고급II",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "경영 경기실습I",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "경영 경기실습II",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "근대5종 고급I",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "근대5종 고급II",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "근대5종 경기실습I",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "근대5종 경기실습II",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "다이빙 고급I",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "다이빙 고급II",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "다이빙 경기실습I",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "다이빙 경기실습II",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "단거리 고급I",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "단거리 고급II",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "단거리 경기실습I",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "단거리 경기실습II",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "도약 고급I",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "도약 고급II",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "도약 경기실습I",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "도약 경기실습II",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "레슬링 고급I",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "레슬링 고급II",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "레슬링 경기실습I",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "레슬링 경기실습II",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "복싱 고급I",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "복싱 고급II",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "복싱 경기실습I",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "복싱 경기실습II",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "사격 고급I",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "사격 고급II",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "사격 경기실습I",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "사격 경기실습II",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "수구 고급I",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "수구 고급II",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "수구 경기실습I",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "수구 경기실습II",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "양궁 고급I",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "양궁 고급II",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "양궁 경기실습I",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "양궁 경기실습II",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "역도 고급I",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "역도 고급II",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "역도 경기실습I",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "역도 경기실습II",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "유도 고급I",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "유도 고급II",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "유도 경기실습I",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "유도 경기실습II",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "중장거리 고급I",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "중장거리 고급II",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "중장거리 경기실습I",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "중장거리 경기실습II",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "체조 고급I",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "체조 고급II",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "체조 경기실습I",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "체조 경기실습II",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "투척 고급I",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "투척 고급II",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "투척 경기실습I",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "투척 경기실습II",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "트라이애슬론 고급I",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "트라이애슬론 고급II",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "트라이애슬론 경기실습I",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "트라이애슬론 경기실습II",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "핀수영 고급I",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "핀수영 고급II",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "핀수영 경기실습I",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "핀수영 경기실습II",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "드로잉 연구1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "드로잉 연구2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "드로잉 연구3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "드로잉 연구4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "입체조형1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "입체조형2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "입체조형3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "입체조형4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "한국화2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "현대서양화1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "현대서양화2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "현대서양화3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "현대서양화4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "현대한국화1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "현대한국화2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "현대한국화3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "현대한국화4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "문예창작 전공실기1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "문예창작 전공실기2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "문예창작 전공실기3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "문예창작 전공실기4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "문장문체실습1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "문장문체실습2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "문장문체실습3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "문장문체실습4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "창작세미나1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "창작세미나2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "시창·청음5",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "시창·청음6",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "음악이론1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "음악이론2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "음악이론3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "음악이론4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "공연실습1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "공연실습2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "뉴미디어작곡1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "뉴미디어작곡2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "뉴미디어작곡3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "뉴미디어작곡4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "뉴미디어작곡5",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "뉴미디어작곡6",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초댄스스포츠1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초댄스스포츠2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초댄스스포츠3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초댄스스포츠4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초댄스스포츠5",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초댄스스포츠6",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초발레3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초발레4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초발레5",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초발레6",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초한국무용3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초한국무용4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초한국무용5",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초한국무용6",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초현대무용3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초현대무용4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초현대무용5",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초현대무용6",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "댄스스포츠1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "댄스스포츠2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "댄스스포츠3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "댄스스포츠4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "댄스스포츠5",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "댄스스포츠6",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "안무1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "안무2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "안무3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "안무4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "안무5",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "안무6",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "한국무용5",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "한국무용6",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "현대무용5",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "현대무용6",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "신체훈련1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "신체훈련2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "고급연기1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "고급연기2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "신체훈련5",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "신체훈련6",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "종합연기1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "종합연기2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "독백연기1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "독백연기2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "신체훈련3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "신체훈련4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "연극제작1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "연극제작2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "스토리창작기초1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "스토리창작기초2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "스토리창작기초3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "스토리창작기초4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "시나리오2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "시나리오3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "시나리오4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "영화감상과비평1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "영화감상과비평2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "영화감상과비평3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "영화감상과비평4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "영화이론및창작1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "영화이론및창작2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "영화제작1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "영화제작2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "영화창작과 표현3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "영화창작과 표현4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "건강걷기",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "비판적 질문과 창의적 해결",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "고전으로 만나는 학문의 처음",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "만화 콘텐츠 제작 기초",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "영상 편집",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "사진의 이해 기본 실습",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "컴퓨터 그래픽 심화 실습",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "바리스타 실무",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "컴퓨터 그래픽 기본 실습",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "음악예술공연제작I",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "연기예술공연제작I",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "동물자원 기본실습",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "반려동물관리 기본실습",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "원예 기본실습",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "조경 기본실습",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "산림자원 기본실습",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "골프산업탐구",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "헤어디자인실무",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "도자 소지 조합",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "토론과 논술 활용",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "상담심리의 이해",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "우리 지역의 이해",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "미래주제연구I",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "미래주제연구II",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "미래주제연구III",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "세계시민",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "음악과 융합",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "자동제어시스템설계",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기계시스템설계",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "5축 가공",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "스마트설비설계",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "경찰학 기본 실습",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "경찰학 심화 실습",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "형법 기본 실습",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "형사소송법 기본 실습",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "군사영어",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "상담심리",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "인명구조학",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "직업군인론",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "공간화훼장식",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기후변화",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "탄약관리",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "패션스타일리스트 실무",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "디자인과 생활",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "유약 위의 장식 1",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "유약 위의 장식 2",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "도자 조형 기본 실습",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "도자 조형 심화 실습",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "세라믹 페인팅 1",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "세라믹 페인팅 2",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "미디어아트 탐구",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국제탐구프로젝트",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초러시아어1",
    "groupType": "시도교육청인정",
    "subjectGroup": "제2외국어/한문",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초러시아어2",
    "groupType": "시도교육청인정",
    "subjectGroup": "제2외국어/한문",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기본러시아어1",
    "groupType": "시도교육청인정",
    "subjectGroup": "제2외국어/한문",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기본러시아어2",
    "groupType": "시도교육청인정",
    "subjectGroup": "제2외국어/한문",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "빙상",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "생활명상",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "음악공연의 실제1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "시창 청음 1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "시창 청음 2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "합창〮합주 1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "합창〮합주 2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "가야금병창I",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "가야금병창II",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "미술사 1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "미술사 2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "드로잉 II",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "무용기초실기I",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "무용기초실기II",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "고전문학의 감상과 비평",
    "groupType": "시도교육청인정",
    "subjectGroup": "국어",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "토론과 논술",
    "groupType": "시도교육청인정",
    "subjectGroup": "국어",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "독서논술",
    "groupType": "시도교육청인정",
    "subjectGroup": "국어",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "현대 희곡",
    "groupType": "시도교육청인정",
    "subjectGroup": "국어",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "현대 국어 문법의 이해",
    "groupType": "시도교육청인정",
    "subjectGroup": "국어",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "심화 영어 토론",
    "groupType": "시도교육청인정",
    "subjectGroup": "영어",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "AP 영문학 I",
    "groupType": "시도교육청인정",
    "subjectGroup": "영어",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "AP 영문학 II",
    "groupType": "시도교육청인정",
    "subjectGroup": "영어",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "AP 영어학 I",
    "groupType": "시도교육청인정",
    "subjectGroup": "영어",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "AP 영어학 II",
    "groupType": "시도교육청인정",
    "subjectGroup": "영어",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "미국 문학 I",
    "groupType": "시도교육청인정",
    "subjectGroup": "영어",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "미국 문학 II",
    "groupType": "시도교육청인정",
    "subjectGroup": "영어",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "영어 대중 연설과 발표",
    "groupType": "시도교육청인정",
    "subjectGroup": "영어",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "심화 영어 토론과 작문",
    "groupType": "시도교육청인정",
    "subjectGroup": "영어",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "영어 토론 I",
    "groupType": "시도교육청인정",
    "subjectGroup": "영어",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "영어 토론 II",
    "groupType": "시도교육청인정",
    "subjectGroup": "영어",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "자서전 연구",
    "groupType": "시도교육청인정",
    "subjectGroup": "영어",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "AP 미적분학 BC-I",
    "groupType": "시도교육청인정",
    "subjectGroup": "수학",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "AP 미적분학 BC-II",
    "groupType": "시도교육청인정",
    "subjectGroup": "수학",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "AP 미적분학 BC-III",
    "groupType": "시도교육청인정",
    "subjectGroup": "수학",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "미분 방정식",
    "groupType": "시도교육청인정",
    "subjectGroup": "수학",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "벡터 미적분학",
    "groupType": "시도교육청인정",
    "subjectGroup": "수학",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "선형대수학",
    "groupType": "시도교육청인정",
    "subjectGroup": "수학",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "응용수학탐구",
    "groupType": "시도교육청인정",
    "subjectGroup": "수학",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "AP 통계학 I",
    "groupType": "시도교육청인정",
    "subjectGroup": "수학",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "AP 통계학 II",
    "groupType": "시도교육청인정",
    "subjectGroup": "수학",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "AP 거시경제",
    "groupType": "시도교육청인정",
    "subjectGroup": "사회",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "AP 미국사 I",
    "groupType": "시도교육청인정",
    "subjectGroup": "사회",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "AP 미국사 II",
    "groupType": "시도교육청인정",
    "subjectGroup": "사회",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "AP 미국정치 I",
    "groupType": "시도교육청인정",
    "subjectGroup": "사회",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "AP 미국정치 II",
    "groupType": "시도교육청인정",
    "subjectGroup": "사회",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "AP 미시경제",
    "groupType": "시도교육청인정",
    "subjectGroup": "사회",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "AP 비교정치 I",
    "groupType": "시도교육청인정",
    "subjectGroup": "사회",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "AP 비교정치 II",
    "groupType": "시도교육청인정",
    "subjectGroup": "사회",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "AP 세계사 I",
    "groupType": "시도교육청인정",
    "subjectGroup": "사회",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "AP 세계사 II",
    "groupType": "시도교육청인정",
    "subjectGroup": "사회",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "AP 심리학 I",
    "groupType": "시도교육청인정",
    "subjectGroup": "사회",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "AP 심리학 II",
    "groupType": "시도교육청인정",
    "subjectGroup": "사회",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "AP 유럽사 I",
    "groupType": "시도교육청인정",
    "subjectGroup": "사회",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "AP 유럽사 II",
    "groupType": "시도교육청인정",
    "subjectGroup": "사회",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "AP 인문지리",
    "groupType": "시도교육청인정",
    "subjectGroup": "사회",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "U.S. History",
    "groupType": "시도교육청인정",
    "subjectGroup": "사회",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "건축과 공간, 도시",
    "groupType": "시도교육청인정",
    "subjectGroup": "사회",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "경제학고전강독",
    "groupType": "시도교육청인정",
    "subjectGroup": "사회",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "고고학",
    "groupType": "시도교육청인정",
    "subjectGroup": "사회",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "근대 정치사상",
    "groupType": "시도교육청인정",
    "subjectGroup": "사회",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "긍정 심리학",
    "groupType": "시도교육청인정",
    "subjectGroup": "사회",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "다산 연구",
    "groupType": "시도교육청인정",
    "subjectGroup": "사회",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "미학",
    "groupType": "시도교육청인정",
    "subjectGroup": "사회",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "비교 정치",
    "groupType": "시도교육청인정",
    "subjectGroup": "사회",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "사회과학 방법론",
    "groupType": "시도교육청인정",
    "subjectGroup": "사회",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "사회철학",
    "groupType": "시도교육청인정",
    "subjectGroup": "사회",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "서양철학 개론",
    "groupType": "시도교육청인정",
    "subjectGroup": "사회",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "성격과 자기 이해",
    "groupType": "시도교육청인정",
    "subjectGroup": "사회",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "역사연구방법",
    "groupType": "시도교육청인정",
    "subjectGroup": "사회",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "임진왜란 연구",
    "groupType": "시도교육청인정",
    "subjectGroup": "사회",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "정치학 고전 읽기",
    "groupType": "시도교육청인정",
    "subjectGroup": "사회",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "젠더와 사회",
    "groupType": "시도교육청인정",
    "subjectGroup": "사회",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "중급 미시 경제학",
    "groupType": "시도교육청인정",
    "subjectGroup": "사회",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "철학 I",
    "groupType": "시도교육청인정",
    "subjectGroup": "사회",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "철학 II",
    "groupType": "시도교육청인정",
    "subjectGroup": "사회",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "철학 원전 읽기",
    "groupType": "시도교육청인정",
    "subjectGroup": "사회",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "학문적 글쓰기",
    "groupType": "시도교육청인정",
    "subjectGroup": "사회",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "한국 정치의 이해",
    "groupType": "시도교육청인정",
    "subjectGroup": "사회",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "한국 근·현대사",
    "groupType": "시도교육청인정",
    "subjectGroup": "사회",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "AP 화학 I",
    "groupType": "시도교육청인정",
    "subjectGroup": "과학",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "AP 화학 II",
    "groupType": "시도교육청인정",
    "subjectGroup": "과학",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "AP 물리학 I",
    "groupType": "시도교육청인정",
    "subjectGroup": "과학",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "AP 물리학 II",
    "groupType": "시도교육청인정",
    "subjectGroup": "과학",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "AP 물리학 C: 역학",
    "groupType": "시도교육청인정",
    "subjectGroup": "과학",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "AP 물리학 C: 전자기학",
    "groupType": "시도교육청인정",
    "subjectGroup": "과학",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "AP 생물학 I",
    "groupType": "시도교육청인정",
    "subjectGroup": "과학",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "AP 생물학 II",
    "groupType": "시도교육청인정",
    "subjectGroup": "과학",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "AP 컴퓨터과학 A",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "AP 환경과학",
    "groupType": "시도교육청인정",
    "subjectGroup": "과학",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "Biology I",
    "groupType": "시도교육청인정",
    "subjectGroup": "과학",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "Chemistry I",
    "groupType": "시도교육청인정",
    "subjectGroup": "과학",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "Physics I",
    "groupType": "시도교육청인정",
    "subjectGroup": "과학",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "관측 천문학",
    "groupType": "시도교육청인정",
    "subjectGroup": "과학",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초 생태학",
    "groupType": "시도교육청인정",
    "subjectGroup": "과학",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "빛과 화학",
    "groupType": "시도교육청인정",
    "subjectGroup": "과학",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "생명과학세미나 I",
    "groupType": "시도교육청인정",
    "subjectGroup": "과학",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "생명의 화학",
    "groupType": "시도교육청인정",
    "subjectGroup": "과학",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "세포생물학의 이해",
    "groupType": "시도교육청인정",
    "subjectGroup": "과학",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "일반화학 I",
    "groupType": "시도교육청인정",
    "subjectGroup": "과학",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "일반화학 II",
    "groupType": "시도교육청인정",
    "subjectGroup": "과학",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "지질학 및 실험",
    "groupType": "시도교육청인정",
    "subjectGroup": "과학",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "천문 통계학",
    "groupType": "시도교육청인정",
    "subjectGroup": "과학",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "첨단 기기와 화학",
    "groupType": "시도교육청인정",
    "subjectGroup": "과학",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "탄소의 화학 기초",
    "groupType": "시도교육청인정",
    "subjectGroup": "과학",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "탄소의 화학 심화",
    "groupType": "시도교육청인정",
    "subjectGroup": "과학",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "프로그래밍기초",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "해석역학 I",
    "groupType": "시도교육청인정",
    "subjectGroup": "과학",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "해석역학 II",
    "groupType": "시도교육청인정",
    "subjectGroup": "과학",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "현대 물리학 I",
    "groupType": "시도교육청인정",
    "subjectGroup": "과학",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "현대 물리학 II",
    "groupType": "시도교육청인정",
    "subjectGroup": "과학",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "생각하는 삶(기초1)",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "표현하는 삶(기초1)",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "자전거 기행",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "꿈너머 꿈(자기이해)",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "비즈니스 프레젠테이션",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "의공학입문",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "산업 안전 실무",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "음악공연의 실제2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "합창 합주 1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "합창 합주 2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "생활과 인성",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "현대 문학의 감상과 이해",
    "groupType": "시도교육청인정",
    "subjectGroup": "국어",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "고전의 항기",
    "groupType": "시도교육청인정",
    "subjectGroup": "국어",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "창의적 영어 글쓰기와 독서",
    "groupType": "시도교육청인정",
    "subjectGroup": "영어",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "문학 에세이 쓰기",
    "groupType": "시도교육청인정",
    "subjectGroup": "영어",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "세계문학I",
    "groupType": "시도교육청인정",
    "subjectGroup": "국어",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "세계 문학II",
    "groupType": "시도교육청인정",
    "subjectGroup": "국어",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "영국 문학 I",
    "groupType": "시도교육청인정",
    "subjectGroup": "국어",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "영국 문학II",
    "groupType": "시도교육청인정",
    "subjectGroup": "국어",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "영어권 문학I",
    "groupType": "시도교육청인정",
    "subjectGroup": "국어",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "고급 영어 토론과 작문",
    "groupType": "시도교육청인정",
    "subjectGroup": "영어",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "서양근대철학의 이해",
    "groupType": "시도교육청인정",
    "subjectGroup": "사회",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "서양현대철학의 이해",
    "groupType": "시도교육청인정",
    "subjectGroup": "사회",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "결정의 화학",
    "groupType": "시도교육청인정",
    "subjectGroup": "과학",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "중급 화학 실험",
    "groupType": "시도교육청인정",
    "subjectGroup": "과학",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "생명과학세미나",
    "groupType": "시도교육청인정",
    "subjectGroup": "과학",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "생체모방공학",
    "groupType": "시도교육청인정",
    "subjectGroup": "과학",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "일반 화학I",
    "groupType": "시도교육청인정",
    "subjectGroup": "과학",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "일반 화학II",
    "groupType": "시도교육청인정",
    "subjectGroup": "과학",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "항성 천문학",
    "groupType": "시도교육청인정",
    "subjectGroup": "과학",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "은하와 우주론",
    "groupType": "시도교육청인정",
    "subjectGroup": "과학",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "컴퓨터로 과학하기",
    "groupType": "시도교육청인정",
    "subjectGroup": "과학",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "과학철학입문",
    "groupType": "시도교육청인정",
    "subjectGroup": "과학",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "생각하는 삶(기초2)",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "표현하는 삶(기초2)",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "역사문화기행1",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "꿈 너머 꿈(관심사 탐색)",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "노작과 자연1",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "민요 1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "민요 2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "정가 1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "정가 2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "가야금병창 1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "가야금병창 2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악합창합주의 실제 1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악합창합주의 실제 2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "합창의 실제 1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "합창의 실제 2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "실용보컬 1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "실용보컬 2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "트럼본 1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "트럼본 2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "키보드 1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "키보드 2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "합주의 실제 1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "합주의 실제 2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "한국무용 기초 실기 1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "한국무용 기초 실기 2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "현대무용 기초 실기 1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "현대무용 기초 실기 2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "발레 기초 전공 실기 1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "발레 기초 전공 실기 2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "실용무용 기초 실기 1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "실용무용 기초 실기 2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "드로잉1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초 우슈 전공 실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "심화 우슈 전공 실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "스포츠 개론 심화",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "체조 심화",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "가족관계 I",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "가족관계 II",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "노작 I",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "노작 II",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "봉사활동 I",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "봉사활동 II",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "산악등반 I",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "산악등반 II",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "영성 I",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "영성 II",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "청소년인성교육",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "청소년자아성장훈련 I",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "현장학습 I",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "현장학습 II",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "스마트농업의 이해",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "반려 동물 관리 기초",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초 수목 생리학",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "반도체기초기술1",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "반도체기초기술2",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "바이오기초실습",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "바이오기초조작",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "바이오제약 1",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "바이오제약 2",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "인공지능 교과 탐구",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "인공지능 생활 탐구",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "단재와 나",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "단재의 삶과 사상",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "단재 체육 1",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "단재 체육 2",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "모두 드로잉 1",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "모두 드로잉 2",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "어울림 음악 1",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "어울림 음악 2",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "모두모임1",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "융합프로젝트1",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "융합프로젝트2",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "삶의기술1",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "삶의기술2",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "만남과대화1",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "만남과대화2",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "모두모임2",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "몸활동",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "세계시민과공동체",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "인턴십",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "아침모임 1",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "아침모임 2",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "아침모임 3",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "아침모임 4",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "아침모임 5",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "아침모임 6",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "전체세미나 1",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "전체세미나 2",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "전체세미나 3",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "전체세미나 4",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "전체세미나 5",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "전체세미나 6",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "참만남세미나 1",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "참만남세미나 2",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "참만남세미나 3",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "참만남세미나 4",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "참만남세미나 5",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "참만남세미나 6",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "학급 자치 1",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "학급 자치 2",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "학급 자치 3",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "학급 자치 4",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "학급 자치 5",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "학급 자치 6",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "피지컬 리터러시1",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "피지컬 리터러시2",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "피지컬 리터러시3",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "피지컬 리터러시4",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "피지컬 리터러시5",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "피지컬 리터러시6",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "역할세미나 1",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "역할세미나 2",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "역할세미나 3",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "역할세미나 4",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "역할세미나 5",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "역할세미나 6",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "성장세미나 1",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "성장세미나 2",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "성장세미나 3",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "성장세미나 4",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "성장세미나 5",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "성장세미나 6",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "개별프로젝트 1",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "개별프로젝트 2",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "개별프로젝트 3",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "개별프로젝트 4",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "개별프로젝트 5",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "개별프로젝트 6",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "팀프로젝트 1",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "팀프로젝트 2",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "생태 1",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "생태 2",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "존중 세미나 1",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "존중 세미나 2",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "공감 세미나 1",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "공감 세미나 2",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "평화 세미나 1",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "평화 세미나 2",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "인턴십 1",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "인턴십 2",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "인턴십 3",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "인턴십 4",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "인턴십 5",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "인턴십 6",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "다배움 1",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "다배움 2",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "다배움 3",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "다배움 4",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기본한국어1",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기본한국어2",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기본한국어3",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기본한국어4",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기본한국어5",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기본한국어6",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기본한국어7",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기본한국어8",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "한국어표현1",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "한국어표현2",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "한국어표현3",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "한국어표현4",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "드로잉 응용",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "생활과 인성I",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "미래형 항공기체(AAV)",
    "groupType": "시도교육청인정",
    "subjectGroup": "과학",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "경찰행정학",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "경찰헌법1",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "경찰헌법2",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "경호무도",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "군대윤리1",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "군대윤리2",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "군리더십1",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "군리더십2",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "독도법1",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "독도법2",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "GMP 기초",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "멀티미디어 콘텐츠 제작",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "부동산 일반1",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "제품 영상 촬영",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "푸드 콘텐츠 마케팅1",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "스마트기기 설계 · 개발",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "스마트기기 운용 · 제어",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "스마트기기 제작 프로젝트",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "이차전지 원리와 활용",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "신재생에너지 전기공사",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "스마트 철강 제조I",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "스마트 철강 제조II",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "비판적 사고와 영어 토론",
    "groupType": "시도교육청인정",
    "subjectGroup": "영어",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "비판적 사고와 영어 작문",
    "groupType": "시도교육청인정",
    "subjectGroup": "영어",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "중국어 낭독과 연설",
    "groupType": "시도교육청인정",
    "subjectGroup": "제2외국어/한문",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "일본어 낭독과 전통문화 이해",
    "groupType": "시도교육청인정",
    "subjectGroup": "제2외국어/한문",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "베트남어 낭독과 문화 이해",
    "groupType": "시도교육청인정",
    "subjectGroup": "제2외국어/한문",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초봉제I",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "시창·청음I-1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "시창·청음I-2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "시창·청음II-1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "시창·청음II-2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "시창·청음III-1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "시창·청음III-2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "음악 공연 실습I-1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "음악 공연 실습I-2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "음악 공연 실습II-1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "음악 공연 실습II-2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "음악 공연 실습III-1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "음악 공연 실습III-2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "피아노합주I-1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "피아노합주I-2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "피아노합주II-1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "피아노합주II-2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "피아노합주III-1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "피아노합주III-2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "합창I-1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "합창I-2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "합창II-1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "합창II-2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "합창III-1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "합창III-2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "합주I-1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "합주I-2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "합주II-1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "합주II-2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "합주III-1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "합주III-2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악합주I-1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악합주I-2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악합주II-1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악합주II-2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악합주III-1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악합주III-2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "피아노I-1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "피아노I-2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "피아노II-1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "피아노II-2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "피아노III-1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "피아노III-2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "성악I-1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "성악I-2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "성악II-1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "성악II-2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "성악III-1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "성악III-2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "작곡I-1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "작곡I-2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "작곡II-1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "작곡II-2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "작곡III-1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "작곡III-2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "현악I-1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "현악I-2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "현악II-1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "현악II-2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "현악III-1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "현악III-2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "관악I-1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "관악I-2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "관악II-1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "관악II-2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "관악III-1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "관악III-2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악I-1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악I-2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악II-1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악II-2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악III-1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악III-2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "드로잉 이해",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "드로잉 기법",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "발상드로잉I-1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "발상드로잉I-2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "발상드로잉II-1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "발상드로잉II-2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "매체드로잉I-1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "매체드로잉I-2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "매체드로잉II-1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "매체드로잉II-2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "조형드로잉I-1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "조형드로잉I-2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "조형드로잉II-1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "조형드로잉II-2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "한국화I-1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "한국화I-2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "한국화II-1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "한국화II-2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "서양화I-1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "서양화I-2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "서양화II-1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "서양화II-2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "조소I-1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "조소I-2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "조소II-1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "조소II-2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "디자인I-1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "디자인I-2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "디자인II-1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "디자인II-2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "무용 음악 실습",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초한국무용I-1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초한국무용I-2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초한국무용II-1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초한국무용II-2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초한국무용III-1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초한국무용III-2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초현대무용I-1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초현대무용I-2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초현대무용II-1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초현대무용II-2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초현대무용III-1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초현대무용III-2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초발레I-1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초발레I-2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초발레II-1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초발레II-2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초발레III-1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초발레III-2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "한국무용I-1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "한국무용I-2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "한국무용II-1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "한국무용II-2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "한국무용III-1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "한국무용III-2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "현대무용I-1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "현대무용I-2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "현대무용II-1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "현대무용II-2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "현대무용III-1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "현대무용III-2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "발레I-1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "발레I-2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "발레II-1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "발레II-2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "발레III-1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "발레III-2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "예술 융합 컨텐츠 제작 실습",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "화학실험(전문교과)",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "화학공업기초실험",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기하학 과제연구",
    "groupType": "시도교육청인정",
    "subjectGroup": "수학",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "수치해석 과제연구",
    "groupType": "시도교육청인정",
    "subjectGroup": "수학",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "정수론 과제연구",
    "groupType": "시도교육청인정",
    "subjectGroup": "수학",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "통계이론 과제연구",
    "groupType": "시도교육청인정",
    "subjectGroup": "수학",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "문제해결기법 탐구",
    "groupType": "시도교육청인정",
    "subjectGroup": "수학",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "함수론 과제연구",
    "groupType": "시도교육청인정",
    "subjectGroup": "수학",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "광공학 과제연구",
    "groupType": "시도교육청인정",
    "subjectGroup": "과학",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기계공학 과제연구",
    "groupType": "시도교육청인정",
    "subjectGroup": "과학",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "전기공학 과제연구",
    "groupType": "시도교육청인정",
    "subjectGroup": "과학",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "화학공학 연구",
    "groupType": "시도교육청인정",
    "subjectGroup": "과학",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "화학 세미나",
    "groupType": "시도교육청인정",
    "subjectGroup": "과학",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "생명공학 연구",
    "groupType": "시도교육청인정",
    "subjectGroup": "과학",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "생명과학융합 연구",
    "groupType": "시도교육청인정",
    "subjectGroup": "과학",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "융합과학 과제연구",
    "groupType": "시도교육청인정",
    "subjectGroup": "과학",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "정보과학융합 탐구",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "정보과학 과제연구",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "예산 글로컬 잉글리쉬",
    "groupType": "시도교육청인정",
    "subjectGroup": "영어",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초봉제II",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "미래 자동차 일반",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "지게차 운전·작업",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "굴착기 운전·작업",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "GMP 실무",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "위험물질실무",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "부동산 일반2",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "푸드 콘텐츠 마케팅2",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "화학-과제연구",
    "groupType": "시도교육청인정",
    "subjectGroup": "과학",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "농업과 직업",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "AP 미술사",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "드로잉2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "표현 기법",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "창작 실습",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "미술 전공실기II",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "미술 전공실기IV",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "한국 음악사",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악연주실습I",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악연주실습II",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악연주실습III",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악연주실습IV",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악연주실습V",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악 합창합주I",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악 합창합주II",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악 합창합주III",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악 합창합주IV",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악 합창합주V",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악 전공실기II",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악 전공실기III",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악 전공실기IV",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악 전공실기V",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "베이커리 실무",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "수경 재배",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "시설 원예",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "조직배양 실무",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "종자 가공",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "종자 검정",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "스마트 팜 모델링 및 제작",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "스마트 팜 자동 제어",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "심력 훈련1",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "심력 훈련2",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "인간관계1",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "인간관계2",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "자기 관리1",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "자기 관리2",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "태권도와 생활1",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "태권도와 생활2",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "마음공부3",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "수어로 소통하기",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "지역 사회의 이해와 실천",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "말관리1",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "말관리2",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "말관리3",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "경마산업1",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "경마산업2",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "승마산업1",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "승마산업2",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "생태적 삶1",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "생태적 삶2",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "낭독1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "낭독2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "생활 바리스타",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "삶과 철학1",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "삶과 철학2",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "삶과 배움1",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "삶과 배움2",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "삶과 진로1",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "삶과 진로2",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "생태-통합기행1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "생태-통합기행2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "평화-통합기행1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "평화-통합기행2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "진로-통합기행1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "진로-통합기행2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "뮤지컬 제작 실습",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "뮤지컬 공연 실습",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "졸업작품1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "졸업작품2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "무용실기I",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "무용실기II",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "고급 안무I",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "고급 안무",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "고급 무용과 매체I",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "고급 무용과 매체II",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "무용기초실기 응용",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "무용전공실기 심화",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "연기 전공 실기I",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "연기 전공 실기II",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "연기 전공 실기III",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "연기 전공 실기IV",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "연기 전공 실기V",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "연기 전공 실기VI",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "드로잉3",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "드로잉4",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "입체 조형",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "표현 기법I",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "표현 기법II",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "공연실습III",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "공연실습IV",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "공연실습V",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "공연실습VI",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "음악 전공실기II",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "음악 전공실기III",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "음악 전공실기IV",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "음악 전공실기V",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "음악 전공실기VI",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "합주I",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "합주II",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "합창I",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "합창II",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "합창·합주의 심화",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악이론I",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악이론II",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악이론III",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악이론IV",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "음악이론I",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "음악이론II",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "공연실습I",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "공연실습II",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "시창·청음I",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "시창·청음II",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "시창·청음III",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "시창·청음IV",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "실용연주I",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "실용연주II",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "실용연주III",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "반주법",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "작곡I",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "작곡II",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "합창III",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "합창IV",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "화성학I",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "화성학II",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "민속악",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "컴퓨터음악",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초발레",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초한국무용",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초현대무용I",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초현대무용II",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "발레I",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "발레II",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "발레III",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "발레IV",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "한국무용I",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "한국무용II",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "한국무용III",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "한국무용IV",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "현대무용I",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "현대무용II",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "현대무용III",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "현대무용IV",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "국악전공실기VI",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초 미술I",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초 미술II",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기계측정가공",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "3D프린팅실무",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기계하드웨어개발",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "응용SW엔지니어링",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "자동차 종합 정비",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "자동차 보수",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "위험물 안전 관리",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "중장비 운전 정비",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "해양과 생활",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "미래자동차정비실무",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "미래자동차 안전 취급·관리",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "미래자동차 정비",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "토탈미용",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "물류 기획",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "보관 하역 관리",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기계절삭가공",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "중장비운영",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "바둑 기초",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "초반 전술",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "중반 전술",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "사활과 수읽기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "맥점과 수읽기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "끝내기 기술",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "바둑경기체력",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "바둑경기심리",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초 동계 스포츠 전공 실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "심화 동계 스포츠 전공 실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초 카누 전공 실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "심화 카누 전공 실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초 테니스 전공 실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "심화 테니스 전공 실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "골프 경기 체력",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "골프 경기 기술",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "골프 경기 분석",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "골프 교육",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "골프 행정 및 경영",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "CO2용접",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "한옥시공",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "3D CAM",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "스마트공장과 유공압제어",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "로봇과 자동제어",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "인공지능과 사물인터넷",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "방공무기운용1",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "풍력 에너지 생산",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "태양광 에너지 생산",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "전기자동차 장치 정비",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "자동차 SW 엔지니어링",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "그린 전동 자동차 설계",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "석유화학 공업입문",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "화공양론",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "화학공장 설계 및 도면 이해",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "유체 역학",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "유틸리티",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "공정 운전 실무",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "화공 열역학",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "압력용기",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "공업 계측",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "캡스톤디자인",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "e모빌리티 융합시스템",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "콘크리트공기계운전",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "관상생물 실무",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "첨단농업용기계설치정비",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "말조련",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "말의 보건관리",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "재활승마의 이해",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "말이용",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "물류 영어",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "바둑학 개론",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "바둑 지도사 실무",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "골프 경기 실습 I",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "골프 경기 실습 II",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기후변화와 순천만",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "미래자동차 안전 취급관리",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "아쿠아-스케이프",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "건설기계운전",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "심화 배구 전공 실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초 배구 전공 실기",
    "groupType": "시도교육청인정",
    "subjectGroup": "체육",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "과학 교양",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "수리생물학",
    "groupType": "시도교육청인정",
    "subjectGroup": "수학",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "바이오 제약",
    "groupType": "시도교육청인정",
    "subjectGroup": "과학",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "화학공학양론",
    "groupType": "시도교육청인정",
    "subjectGroup": "과학",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "사회 문제 시사 토론",
    "groupType": "시도교육청인정",
    "subjectGroup": "국어",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "신문활용교육",
    "groupType": "시도교육청인정",
    "subjectGroup": "국어",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "산업입지론",
    "groupType": "시도교육청인정",
    "subjectGroup": "사회",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "지도학과 GIS",
    "groupType": "시도교육청인정",
    "subjectGroup": "사회",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "정신분석학의 이해",
    "groupType": "시도교육청인정",
    "subjectGroup": "사회",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "AP 미국사",
    "groupType": "시도교육청인정",
    "subjectGroup": "사회",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "영화비평",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "스마트유지보수운영",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "항공기 기체1",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "항공기 기체2",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "항공기 기체3",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "항공기 기체4",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "항공기 엔진1",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "항공기 엔진2",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "항공기 엔진3",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "항공기 엔진4",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "항공기 전자전기계기1",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "항공기 전자전기계기2",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "항공기 전자전기계기3",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "항공기 전자전기계기4",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "항공정비일반1",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "항공정비일반2",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "항공정비일반3",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "헬기일반 I",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "헬기일반 II",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "반려동물복지론",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "펫 푸드 가공개발",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "동물 간호의 이해",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "마학",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "마술학",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "용접과제제작",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "레이저 용접",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "레이저 절단",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "객체지향 프로그래밍",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "세포배양기술 현장실무",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "해외영업",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "무역마케팅",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "무역실무",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "프로젝트-전시기획",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "반려동물미용 안전 실무",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "반려동물미용상담 실무",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "반려동물미용 기술 실무",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "반려동물미용 전문 실무",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "반려견훈련기본",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "반려견훈련심화",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "반려견 행동교정 실무",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "반려견스포츠",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "미래자동차정비1",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "미래자동차정비2",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "미래자동차정비3",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "고전압 배터리 시스템 정비",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "자동차 전기·전자 장치 정비2",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "자동차 엔진 정비 2",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "자동차 섀시 정비 2",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "과제연구II_컴퓨터응용가공",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "설비보전 연구1",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "설비보전 연구2",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "화력발전설비 및 원전현장실무",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "전기설비실무 및 화력발전설비",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "원자력기초",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "스마트팜 경영",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "스마트팜 기초",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "식육가공",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "식육처리기술",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "외식산업관리",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "조경 심화 실무",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "케이크데코레이션",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "철도영업일반",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "철도차량일반",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "철도 전기∙신호 일반",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "마케팅전략기획",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "농산물 가공",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "IoT 시스템 연동",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "미래농업프로젝트",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "스마트식물프로젝트",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "애완 곤충 산업",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "식용 곤충 산업",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "곤충 산업 프로젝트",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "스마트 축산 시설 관리",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "동물 산업 프로젝트",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "파충류 사육",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "양서류 사육",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "절지류 사육",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "과제연구I_기계",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "과제연구I_기계설계·CAD",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "과제연구I_용접·특수용접",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "과제연구I_컴퓨터응용가공",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "과제연구1_자동화시스템",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "과제연구2_자동화시스템",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기관 시뮬레이션",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "항해 및 어로 시뮬레이션",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "스마트 양식의 이해",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "스마트 양식",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "활어회 실무",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "수산물품질관리",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "아쿠아스케이프",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "제철 일반",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "임업기계",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기초수목학",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "6차산업이해",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "애완곤충사육",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "항공 5축 CNC밀링 가공(CATIA)",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "현대사회와 봉사",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "마음공부심화1",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "마음공부심화2",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "마음공부응용1",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "마음공부응용2",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "평화세미나",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "통합기행1",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "통합기행2",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "통합기행3",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "환경 융합 탐구",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "도보이동학습",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "생태탐방1",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "생태탐방2",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "인턴십기초1",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "인턴십기초2",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "인턴십일반1",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "인턴십일반2",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "인턴십심화1",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "인턴십심화2",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "현지문화탐방",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "주제탐구이동학습",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "진로맞춤형탐구",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "통합프로젝트기행1",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "통합프로젝트기행2",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "통합프로젝트기행3",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "이동학습1",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "이동학습2",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "이동학습3",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "식구총회1",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "식구총회2",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "식구총회3",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "식구총회4",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "식구총회5",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "식구총회6",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "과제연구",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "진로연구",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "졸업작품",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "댄스I",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "댄스II",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "재즈피아노I",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "재즈피아노II",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "항공법규",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "항공교통·통신·정보업무",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "항행안전시설",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "항공관제영어",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "관제일반",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "항공통제기초",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "항공통제일반",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "MCRC체계 이론",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "MCRC체계 실무",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기상학기초",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기상일기도 분석",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기상관측",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기상영상분석",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "기상분석 및 실무",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "항공기술영어",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "항공기술영어심화",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "항공방공무장",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "무선통신시스템",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "군사학 기초",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "군사학 숙련",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "군사학 심화",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "마음 공부2(경남)",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "우리 지역 탐구",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "승강기이해",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "나노기술공학개론",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "나노융합소재",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "나노품질측정검사",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "나노융합제조공정",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "반도체 설계",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "나노구조분석",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "나노물성분석",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "반도체소자제조",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "반도체 설비",
    "groupType": "시도교육청인정",
    "subjectGroup": "기술·가정/정보",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "미술 매체 탐구I",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "실용공연실습 I",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "실용공연실습 II",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "실용앙상블 I",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "실용앙상블 II",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "마음공부II",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "마음공부-2",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "마음공부-1",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "산업수학",
    "groupType": "시도교육청인정",
    "subjectGroup": "수학",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "삶과 철학 I",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "삶과 철학 II",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "음악 전공실기1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "합창∙합주1",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "합창∙합주2",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "비판적 사고 기초",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "비판적 사고 탐구",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "세계 속의 지역 문화",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "글로벌 융합과학 과제연구",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "항공우주와 스마트 기술",
    "groupType": "시도교육청인정",
    "subjectGroup": "교양",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "음악기초이론",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  },
  {
    "subjectName": "음악사 탐구",
    "groupType": "시도교육청인정",
    "subjectGroup": "예술",
    "selectionType": "시도교육청인정"
  }
] as const;

function uniqueSorted(values: readonly string[]): string[] {
  return [...new Set(values)].filter(Boolean).sort((left, right) =>
    left.localeCompare(right, "ko")
  );
}

export const subjectMasterItems: SubjectMasterItem[] = rawSubjectMasterItems.map(
  (item, index) => ({
    id: `subject-master-${index + 1}`,
    subjectName: item.subjectName,
    normalizedSubjectName: normalizeSubjectName(item.subjectName),
    subjectGroup: item.subjectGroup,
    selectionType: item.selectionType,
    groupType: item.groupType
  })
);

export const subjectGroups = uniqueSorted(
  subjectMasterItems.map((item) => item.subjectGroup)
);

export const selectionTypes = uniqueSorted(
  subjectMasterItems.map((item) => item.selectionType)
);

export const groupTypes = uniqueSorted(
  subjectMasterItems.map((item) => item.groupType ?? "")
);

export type SubjectMasterDuplicate = {
  key: string;
  items: SubjectMasterItem[];
};

function findDuplicatesByKey(
  items: readonly SubjectMasterItem[],
  getKey: (item: SubjectMasterItem) => string
): SubjectMasterDuplicate[] {
  const buckets = new Map<string, SubjectMasterItem[]>();

  for (const item of items) {
    const key = getKey(item);
    const bucket = buckets.get(key);

    if (bucket) {
      bucket.push(item);
    } else {
      buckets.set(key, [item]);
    }
  }

  return [...buckets.entries()]
    .filter(([, duplicateItems]) => duplicateItems.length > 1)
    .map(([key, duplicateItems]) => ({ key, items: duplicateItems }));
}

export function findDuplicateNormalizedSubjectNames(
  items: readonly SubjectMasterItem[] = subjectMasterItems
): SubjectMasterDuplicate[] {
  return findDuplicatesByKey(items, (item) => item.normalizedSubjectName);
}

export function findDuplicateSubjectMasterCompositeKeys(
  items: readonly SubjectMasterItem[] = subjectMasterItems
): SubjectMasterDuplicate[] {
  return findDuplicatesByKey(items, (item) =>
    [
      item.normalizedSubjectName,
      item.subjectGroup,
      item.selectionType,
      item.groupType ?? ""
    ].join("|")
  );
}

