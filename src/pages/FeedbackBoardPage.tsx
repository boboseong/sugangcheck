import { KeyRound, RefreshCw, Send } from "lucide-react";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import { FeedbackPostCard } from "../components/FeedbackPostCard";
import { HelpPanel } from "../components/HelpPanel";
import { Button } from "../components/ui/Button";
import { PageHeader } from "../components/ui/PageHeader";
import {
  createFeedbackComment,
  createFeedbackPost,
  deleteFeedbackComment,
  deleteFeedbackPost,
  feedbackContentMaxLength,
  feedbackErrorMessage,
  feedbackNicknameMaxLength,
  FeedbackBoardError,
  listFeedbackPosts,
  verifyFeedbackAdminKey,
  type FeedbackPostPage
} from "../feedback/feedbackBoardApi";
import {
  cacheFirstPage,
  readCachedFirstPage,
  readSavedAdminKey,
  readSavedNickname,
  saveAdminKey,
  saveNickname
} from "../feedback/feedbackBoardStorage";
import { appVersion } from "../state/projectMetaStore";

const helpItems = [
  "앱을 쓰면서 느낀 점, 불편한 점, 바라는 기능을 자유롭게 남겨 주세요.",
  "학생 이름, 학번 등 개인정보는 절대 적지 마세요. 게시판은 인터넷에 공개됩니다.",
  "글을 쓸 때 삭제용 비밀번호를 정하면 나중에 직접 지울 수 있습니다.",
  "운영자 답글에는 운영자 배지가 붙습니다."
] as const;

const submitCooldownMs = 10_000;

type LoadState = "idle" | "loading" | "ready" | "error" | "cached";

function errorText(error: unknown): string {
  if (error instanceof FeedbackBoardError) {
    return error.message;
  }

  return feedbackErrorMessage("unknown");
}

export function FeedbackBoardPage() {
  const [pageData, setPageData] = useState<FeedbackPostPage | undefined>();
  const [cachedAt, setCachedAt] = useState<string | undefined>();
  const [currentPage, setCurrentPage] = useState(1);
  const [loadState, setLoadState] = useState<LoadState>("idle");
  const [loadError, setLoadError] = useState<string | undefined>();
  const [notice, setNotice] = useState<string | undefined>();
  const [actionError, setActionError] = useState<string | undefined>();
  const [busy, setBusy] = useState(false);
  const [lastSubmittedAt, setLastSubmittedAt] = useState(0);

  const [nickname, setNickname] = useState(() => readSavedNickname());
  const [content, setContent] = useState("");
  const [password, setPassword] = useState("");
  const [website, setWebsite] = useState("");

  const [adminKey, setAdminKey] = useState<string | undefined>(() =>
    readSavedAdminKey()
  );
  const [adminKeyDraft, setAdminKeyDraft] = useState("");
  const [showAdminForm, setShowAdminForm] = useState(false);
  const isAdmin = Boolean(adminKey);

  const loadPage = useCallback(async (page: number) => {
    setLoadState("loading");
    setLoadError(undefined);

    try {
      const result = await listFeedbackPosts(page);
      setPageData(result);
      setCurrentPage(result.page);
      setCachedAt(undefined);
      setLoadState("ready");
      cacheFirstPage(result);
    } catch (error) {
      const cached = page === 1 ? readCachedFirstPage() : undefined;

      if (cached) {
        setPageData(cached);
        setCurrentPage(1);
        setCachedAt(cached.fetchedAt);
        setLoadState("cached");
      } else {
        setLoadState("error");
      }

      setLoadError(errorText(error));
    }
  }, []);

  useEffect(() => {
    void loadPage(1);
  }, [loadPage]);

  async function runAction(action: () => Promise<void>): Promise<boolean> {
    setBusy(true);
    setActionError(undefined);
    setNotice(undefined);

    try {
      await action();
      return true;
    } catch (error) {
      setActionError(errorText(error));
      return false;
    } finally {
      setBusy(false);
    }
  }

  function cooldownRemaining(): number {
    return Math.max(0, lastSubmittedAt + submitCooldownMs - Date.now());
  }

  async function submitPost(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const remaining = cooldownRemaining();

    if (remaining > 0) {
      setActionError(
        `잠시 후 다시 시도해 주세요. (${Math.ceil(remaining / 1000)}초)`
      );
      return;
    }

    const ok = await runAction(async () => {
      await createFeedbackPost({
        nickname: nickname.trim(),
        content: content.trim(),
        appVersion,
        password: password.trim() || undefined,
        website
      });
    });

    if (!ok) {
      return;
    }

    saveNickname(nickname);
    setLastSubmittedAt(Date.now());
    setContent("");
    setPassword("");
    setNotice("글이 등록되었습니다.");
    await loadPage(1);
  }

  async function addComment(
    postId: string,
    input: { nickname: string; content: string; website: string }
  ): Promise<boolean> {
    const remaining = cooldownRemaining();

    if (remaining > 0) {
      setActionError(
        `잠시 후 다시 시도해 주세요. (${Math.ceil(remaining / 1000)}초)`
      );
      return false;
    }

    const ok = await runAction(async () => {
      await createFeedbackComment({
        postId,
        nickname: input.nickname.trim(),
        content: input.content.trim(),
        adminKey,
        website: input.website
      });
    });

    if (!ok) {
      return false;
    }

    if (!isAdmin) {
      saveNickname(input.nickname);
      setNickname(input.nickname);
    }

    setLastSubmittedAt(Date.now());
    setNotice("댓글이 등록되었습니다.");
    await loadPage(currentPage);
    return true;
  }

  async function deletePost(postId: string, postPassword?: string) {
    const ok = await runAction(async () => {
      await deleteFeedbackPost({ postId, password: postPassword, adminKey });
    });

    if (ok) {
      setNotice("글을 삭제했습니다.");
      await loadPage(currentPage);
    }

    return ok;
  }

  async function deleteComment(commentId: string) {
    if (!adminKey) {
      return false;
    }

    const ok = await runAction(async () => {
      await deleteFeedbackComment({ commentId, adminKey });
    });

    if (ok) {
      setNotice("댓글을 삭제했습니다.");
      await loadPage(currentPage);
    }

    return ok;
  }

  async function submitAdminKey(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const candidate = adminKeyDraft.trim();

    if (!candidate) {
      return;
    }

    const ok = await runAction(async () => {
      const verified = await verifyFeedbackAdminKey(candidate);

      if (!verified) {
        throw new FeedbackBoardError("forbidden");
      }
    });

    if (ok) {
      saveAdminKey(candidate);
      setAdminKey(candidate);
      setAdminKeyDraft("");
      setShowAdminForm(false);
      setNotice("운영자 모드가 켜졌습니다.");
    }
  }

  function clearAdminKey() {
    saveAdminKey(undefined);
    setAdminKey(undefined);
    setNotice("운영자 모드를 껐습니다.");
  }

  const totalPages = pageData
    ? Math.max(1, Math.ceil(pageData.total / pageData.pageSize))
    : 1;

  return (
    <section className="page">
      <PageHeader
        title="의견 게시판"
        description="앱에 대한 의견과 후기를 남기고 운영자의 답글을 확인하는 공간입니다. 여기 적은 글은 인터넷을 통해 모든 사용자에게 공개됩니다."
      />

      <div className="feedback-layout">
        <div className="feedback-main">
          <section className="card feedback-write-card" aria-labelledby="feedback-write-title">
            <h2 id="feedback-write-title">글 남기기</h2>
            <form className="feedback-form" onSubmit={submitPost}>
              <div className="feedback-form__row">
                <label>
                  닉네임
                  <input
                    maxLength={feedbackNicknameMaxLength}
                    onChange={(event) => setNickname(event.target.value)}
                    placeholder="예: 부산 ○○고 교사"
                    required
                    value={nickname}
                  />
                </label>
                <label>
                  삭제용 비밀번호 (선택)
                  <input
                    autoComplete="new-password"
                    maxLength={20}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="글을 직접 지우려면 입력"
                    type="password"
                    value={password}
                  />
                </label>
              </div>
              <label>
                내용
                <textarea
                  maxLength={feedbackContentMaxLength}
                  onChange={(event) => setContent(event.target.value)}
                  placeholder="학생 개인정보는 적지 말아 주세요."
                  required
                  rows={5}
                  value={content}
                />
              </label>
              <input
                aria-hidden="true"
                autoComplete="off"
                className="visually-hidden"
                name="website"
                onChange={(event) => setWebsite(event.target.value)}
                tabIndex={-1}
                value={website}
              />
              <div className="feedback-form__footer">
                <span className="feedback-form__hint">
                  {content.length} / {feedbackContentMaxLength}자 · 앱 버전 {appVersion}이 함께 기록됩니다.
                </span>
                <Button
                  disabled={busy}
                  icon={<Send size={16} aria-hidden="true" />}
                  type="submit"
                >
                  등록
                </Button>
              </div>
            </form>
          </section>

          {notice ? (
            <p className="feedback-notice" role="status">
              {notice}
            </p>
          ) : null}
          {actionError ? (
            <div className="form-errors" role="alert">
              <p>{actionError}</p>
            </div>
          ) : null}

          <section className="section feedback-list-section" aria-labelledby="feedback-list-title">
            <div className="section-heading-row section-heading-row--with-controls">
              <h2 id="feedback-list-title">
                전체 글{pageData ? ` (${pageData.total})` : ""}
              </h2>
              <div className="section-heading-actions">
                <Button
                  className="button--compact"
                  disabled={loadState === "loading"}
                  icon={<RefreshCw size={14} aria-hidden="true" />}
                  onClick={() => void loadPage(currentPage)}
                  variant="secondary"
                >
                  새로고침
                </Button>
              </div>
            </div>

            {loadState === "loading" && !pageData ? (
              <p className="feedback-empty">글을 불러오는 중입니다…</p>
            ) : null}

            {loadState === "error" ? (
              <div className="form-errors" role="alert">
                <p>{loadError}</p>
              </div>
            ) : null}

            {loadState === "cached" && cachedAt ? (
              <div className="form-errors" role="alert">
                <p>{loadError}</p>
                <p>
                  마지막으로 불러온 목록을 보여드립니다. (
                  {new Date(cachedAt).toLocaleString("ko-KR")})
                </p>
              </div>
            ) : null}

            {pageData && pageData.posts.length === 0 && loadState !== "error" ? (
              <p className="feedback-empty">아직 남겨진 글이 없습니다. 첫 의견을 남겨 주세요.</p>
            ) : null}

            {pageData && pageData.posts.length > 0 ? (
              <div className="feedback-post-list">
                {pageData.posts.map((post) => (
                  <FeedbackPostCard
                    key={post.id}
                    busy={busy}
                    defaultNickname={nickname}
                    isAdmin={isAdmin}
                    onAddComment={addComment}
                    onDeleteComment={deleteComment}
                    onDeletePost={deletePost}
                    post={post}
                  />
                ))}
              </div>
            ) : null}

            {pageData && totalPages > 1 ? (
              <nav className="feedback-pagination" aria-label="페이지 이동">
                <Button
                  className="button--compact"
                  disabled={busy || loadState === "loading" || currentPage <= 1}
                  onClick={() => void loadPage(currentPage - 1)}
                  variant="secondary"
                >
                  이전
                </Button>
                <span>
                  {currentPage} / {totalPages}
                </span>
                <Button
                  className="button--compact"
                  disabled={
                    busy || loadState === "loading" || currentPage >= totalPages
                  }
                  onClick={() => void loadPage(currentPage + 1)}
                  variant="secondary"
                >
                  다음
                </Button>
              </nav>
            ) : null}
          </section>
        </div>

        <aside className="feedback-side">
          <HelpPanel title="이용 안내" items={helpItems} />

          <section className="card feedback-admin-card" aria-labelledby="feedback-admin-title">
            <div className="feedback-admin-card__title">
              <KeyRound size={16} aria-hidden="true" />
              <h2 id="feedback-admin-title">운영자</h2>
            </div>
            {isAdmin ? (
              <>
                <p>운영자 모드가 켜져 있습니다. 답글에 운영자 배지가 붙고 글과 댓글을 삭제할 수 있습니다.</p>
                <Button
                  className="button--compact"
                  onClick={clearAdminKey}
                  variant="secondary"
                >
                  운영자 모드 끄기
                </Button>
              </>
            ) : showAdminForm ? (
              <form className="feedback-admin-form" onSubmit={submitAdminKey}>
                <label>
                  관리자 키
                  <input
                    autoComplete="off"
                    onChange={(event) => setAdminKeyDraft(event.target.value)}
                    required
                    type="password"
                    value={adminKeyDraft}
                  />
                </label>
                <div className="feedback-admin-form__actions">
                  <Button className="button--compact" disabled={busy} type="submit">
                    확인
                  </Button>
                  <Button
                    className="button--compact"
                    onClick={() => setShowAdminForm(false)}
                    variant="secondary"
                  >
                    취소
                  </Button>
                </div>
              </form>
            ) : (
              <>
                <p>운영자만 사용하는 기능입니다. 관리자 키는 이 컴퓨터에만 저장됩니다.</p>
                <Button
                  className="button--compact"
                  onClick={() => setShowAdminForm(true)}
                  variant="secondary"
                >
                  운영자 모드 켜기
                </Button>
              </>
            )}
          </section>
        </aside>
      </div>
    </section>
  );
}
