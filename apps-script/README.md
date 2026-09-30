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
  - `createPost` { id?, nickname, content, appVersion, password? }
  - `createComment` { id?, postId, nickname, content, adminKey? }
  - `deletePost` { postId, password? | adminKey? }
  - `deleteComment` { commentId, adminKey }
  - `verifyAdmin` { adminKey }

## 응답 전달 방식과 재시도

Apps Script의 JSON 응답(ContentService)은 `script.googleusercontent.com`을 한 번 더 거쳐
전달되는데, 이 단계가 여섯 번에 한 번꼴로 10~60초 멈추거나 Google 오류 페이지를 돌려줍니다.
스크립트 실행은 이미 끝난 뒤라서 글은 저장되지만 앱은 응답을 받지 못합니다.

그래서 앱은 **숨은 프레임 방식**을 기본으로 씁니다.

- 요청 주소에 `transport=frame&rid=<요청 id>`를 붙여 숨은 iframe으로 엽니다. 쓰기 요청은
  `payload` 폼 필드에 JSON을 담아 POST합니다 (비밀번호와 관리자 키가 주소에 남지 않게).
- 스크립트는 JSON 대신 작은 페이지(HtmlService)를 돌려주고, 그 페이지가
  `window.top.postMessage({ source: "sugangcheck-feedback", rid, payload })`로 결과를 앱에 전달합니다.
- 이 경로는 멈추는 단계를 거치지 않아 1~3초에 안정적으로 응답합니다.
- 4초 안에 답이 없으면 기존 fetch 방식을 함께 보내고, 8초와 16초에 프레임을 다시 시도합니다.
  먼저 온 응답을 쓰며 전체 제한은 60초입니다.

재시도가 안전하도록 다음 규칙을 지킵니다.

- 글과 댓글은 앱이 만든 `id`를 함께 보냅니다. 서버는 같은 `id`를 한 번만 기록하고,
  두 번째부터는 `duplicate: true`로 기존 글을 돌려줍니다.
- `id`가 없거나 형식(영문, 숫자, `-` 8~64자)에 맞지 않으면 서버가 새로 만듭니다 (0.1.15 호환).
- fetch로 보낸 POST의 응답이 유실되면 Google이 매개변수 없는 GET으로 되돌려 보내 글 목록이
  응답으로 옵니다. 앱은 이것을 유실로 보고 재시도합니다. 그래서 `doGet`의 기본 action은
  `list`로 유지해야 합니다.
- `transport` 매개변수가 없는 요청에는 지금처럼 JSON으로 답해야 합니다 (0.1.15 호환).

스크립트를 편집기에 붙여넣은 뒤에는 저장 표시가 "Drive에 저장됨"으로 바뀌었는지 확인하고
배포하세요. 저장되지 않은 채로 새 버전을 만들면 이전 코드가 그대로 배포됩니다.
배포 관리에서 버전을 고를 때는 목록 맨 위의 "새 버전"인지 다시 확인하세요.

## 처음부터 다시 만들어야 할 때

1. 새 Google 시트를 만들고 확장 프로그램 > Apps Script를 엽니다.
2. `Code.gs` 내용을 붙여넣고 저장한 뒤 `setup()`을 한 번 실행합니다 (권한 승인 필요).
3. 프로젝트 설정 > 스크립트 속성에 `ADMIN_KEY`를 추가합니다.
4. 배포 > 새 배포 > 웹 앱, 실행 계정 "나", 액세스 권한 "모든 사용자"로 배포합니다.
5. 발급된 웹 앱 주소를 `src/app/externalLinks.ts`에 넣고 앱을 새 버전으로 배포합니다.
