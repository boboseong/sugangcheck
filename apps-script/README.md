# 의견 게시판 서버 (Google Apps Script)

앱의 "의견 게시판" 페이지가 사용하는 서버입니다. Google 시트에 글과 댓글을 저장하고,
Apps Script 웹 앱이 읽기/쓰기 API 역할을 합니다. 이 폴더의 `Code.gs`가 원본이며,
GitHub Actions는 이 서버를 배포하지 않습니다. 아래 절차대로 직접 배포합니다.

## 구성

- Google 시트 "수강신청 오류 점검 - 의견 게시판"
  - `posts` 탭: id, createdAt, nickname, content, appVersion, passwordHash, status
  - `comments` 탭: id, postId, createdAt, nickname, content, isAdmin, status
  - 삭제는 `status` 열이 `deleted`로 바뀌는 소프트 삭제입니다. 시트에서 `active`로 되돌리면 복구됩니다.
- Apps Script 프로젝트 "sugangcheck-feedback-board" (시트의 확장 프로그램 > Apps Script)
  - 스크립트 속성 `ADMIN_KEY`: 운영자 모드 키. 앱의 "운영자 모드 켜기"에 같은 값을 입력합니다.
  - 스크립트 속성 `SALT`: 삭제용 비밀번호 해시에 쓰이며 `setup()`이 자동 생성합니다.
- 웹 앱 주소는 `src/app/externalLinks.ts`의 `feedbackBoardApiUrl`입니다.

## 스크립트를 고쳤을 때

1. `Code.gs`를 수정하고 저장소에 커밋합니다.
2. Apps Script 편집기에서 `Code.gs` 내용을 전부 바꿔 붙여넣고 저장합니다.
3. **배포 > 배포 관리 > (연필) 수정 > 버전: 새 버전 > 배포**로 올립니다.

   "새 배포"를 만들면 주소가 바뀌어서 이미 설치된 앱이 게시판에 접속하지 못합니다.
   반드시 기존 배포를 새 버전으로 올려 주소를 유지하세요.
4. 스크립트 속성만 바꾼 경우에는 재배포가 필요 없습니다.

## 호환성 규칙

설치된 앱은 언제 업데이트될지 알 수 없으므로 API는 항상 하위 호환으로만 바꿉니다.

- 기존 action 이름과 응답 필드는 유지하고, 필드는 추가만 합니다.
- 응답은 항상 `{ ok: true, ... }` 또는 `{ ok: false, error: "코드" }` 형태를 지킵니다.

## API 요약

- `GET ?action=list&page=1&pageSize=20` → 글 목록과 각 글의 댓글
- `POST` (본문은 JSON, Content-Type은 `text/plain`)
  - `createPost` { nickname, content, appVersion, password? }
  - `createComment` { postId, nickname, content, adminKey? }
  - `deletePost` { postId, password? | adminKey? }
  - `deleteComment` { commentId, adminKey }
  - `verifyAdmin` { adminKey }

## 처음부터 다시 만들어야 할 때

1. 새 Google 시트를 만들고 확장 프로그램 > Apps Script를 엽니다.
2. `Code.gs` 내용을 붙여넣고 저장한 뒤 `setup()`을 한 번 실행합니다 (권한 승인 필요).
3. 프로젝트 설정 > 스크립트 속성에 `ADMIN_KEY`를 추가합니다.
4. 배포 > 새 배포 > 웹 앱, 실행 계정 "나", 액세스 권한 "모든 사용자"로 배포합니다.
5. 발급된 웹 앱 주소를 `src/app/externalLinks.ts`에 넣고 앱을 새 버전으로 배포합니다.
