import { KeyRound, RefreshCw, Send } from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent
} from "react";
import {
  FeedbackPostCard,
  type FeedbackDisplayComment,
  type FeedbackDisplayPost
} from "../components/FeedbackPostCard";
import { HelpPanel } from "../components/HelpPanel";
import { Button } from "../components/ui/Button";
import { PageHeader } from "../components/ui/PageHeader";
import {
  createFeedbackComment,
  createFeedbackId,
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
  "운영자 답글에는 운영자 배지가 붙습니다.",
  "글은 등록을 누르면 바로 화면에 보이고, 서버 저장은 뒤에서 이어집니다."
] as const;

const submitCooldownMs = 10_000;
const slowServerHint =
  "게시판 서버(Google) 응답이 느리면 시간이 더 걸릴 수 있습니다.";

// Posts and comments appear the moment they are submitted and are confirmed in
// the background: the server needs a few seconds at best and much longer when
// Google is having a slow spell.
type PendingStatus = "sending" | "sent" | "failed";

type PendingPost = {
  id: string;
  createdAt: string;
  nickname: string;
  content: string;
  password?: string;
  website: string;
  status: PendingStatus;
  error?: string;
};

type PendingComment = {
  id: string;
  postId: string;
  createdAt: string;
  nickname: string;
  content: string;
  isAdmin: boolean;
  adminKey?: string;
  website: string;
  status: PendingStatus;
  error?: string;
};

function errorText(error: unknown): string {
  if (error instanceof FeedbackBoardError) {
    return error.message;
  }

  return feedbackErrorMessage("unknown");
}

function localState(entry: { status: PendingStatus; error?: string }) {
  return entry.status === "sent"
    ? {}
    : { localStatus: entry.status, localError: entry.error };
}

export function FeedbackBoardPage() {
  const [pageData, setPageData] = useState<FeedbackPostPage | undefined>();
  const [cachedAt, setCachedAt] = useState<string | undefined>();
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | undefined>();
  const [notice, setNotice] = useState<string | undefined>();
  const [actionError, setActionError] = useState<string | undefined>();
  const [busy, setBusy] = useState(false);
  const [lastSubmittedAt, setLastSubmittedAt] = useState(0);
  const [pendingPosts, setPendingPosts] = useState<PendingPost[]>([]);
  const [pendingComments, setPendingComments] = useState<PendingComment[]>([]);
  const loadSequence = useRef(0);

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
    const sequence = ++loadSequence.current;
    setIsLoading(true);

    try {
      const result = await listFeedbackPosts(page);

      // A slower, older request must not overwrite a newer one.
      if (sequence !== loadSequence.current) {
        return;
      }

      const confirmedPostIds = new Set(result.posts.map((post) => post.id));
      const confirmedCommentIds = new Set(
        result.posts.flatMap((post) => post.comments.map((comment) => comment.id))
      );

      setPageData(result);
      setCurrentPage(result.page);
      setCachedAt(undefined);
      setLoadError(undefined);
      setPendingPosts((entries) =>
        entries.filter((entry) => !confirmedPostIds.has(entry.id))
      );
      setPendingComments((entries) =>
        entries.filter((entry) => !confirmedCommentIds.has(entry.id))
      );
      cacheFirstPage(result);
    } catch (error) {
      if (sequence === loadSequence.current) {
        setLoadError(errorText(error));
      }
    } finally {
      if (sequence === loadSequence.current) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const cached = readCachedFirstPage();

    if (cached) {
      setPageData(cached);
      setCachedAt(cached.fetchedAt);
    }

    void loadPage(1);
  }, [loadPage]);

  const displayPosts = useMemo<FeedbackDisplayPost[]>(() => {
    const serverPosts = pageData?.posts ?? [];
    const serverPostIds = new Set(serverPosts.map((post) => post.id));

    function withPendingComments(
      postId: string,
      comments: FeedbackDisplayComment[]
    ): FeedbackDisplayComment[] {
      const known = new Set(comments.map((comment) => comment.id));
      const extra = pendingComments
        .filter((entry) => entry.postId === postId && !known.has(entry.id))
        .map<FeedbackDisplayComment>((entry) => ({
          id: entry.id,
          postId: entry.postId,
          createdAt: entry.createdAt,
          nickname: entry.nickname,
          content: entry.content,
          isAdmin: entry.isAdmin,
          ...localState(entry)
        }));

      return [...comments, ...extra];
    }

    const localPosts =
      currentPage === 1
        ? pendingPosts
            .filter((entry) => !serverPostIds.has(entry.id))
            .map<FeedbackDisplayPost>((entry) => ({
              id: entry.id,
              createdAt: entry.createdAt,
              nickname: entry.nickname,
              content: entry.content,
              appVersion,
              comments: withPendingComments(entry.id, []),
              ...localState(entry)
            }))
        : [];

    return [
      ...localPosts,
      ...serverPosts.map<FeedbackDisplayPost>((post) => ({
        ...post,
        comments: withPendingComments(post.id, post.comments)
      }))
    ];
  }, [currentPage, pageData, pendingComments, pendingPosts]);

  function cooldownMessage(): string | undefined {
    const remaining = lastSubmittedAt + submitCooldownMs - Date.now();

    return remaining > 0
      ? `잠시 후 다시 시도해 주세요. (${Math.ceil(remaining / 1000)}초)`
      : undefined;
  }

  async function sendPost(entry: PendingPost) {
    setPendingPosts((entries) =>
      entries.map((item) =>
        item.id === entry.id ? { ...item, status: "sending", error: undefined } : item
      )
    );

    try {
      await createFeedbackPost({
        id: entry.id,
        nickname: entry.nickname,
        content: entry.content,
        appVersion,
        password: entry.password,
        website: entry.website
      });
      setPendingPosts((entries) =>
        entries.map((item) =>
          item.id === entry.id ? { ...item, status: "sent" } : item
        )
      );
      void loadPage(1);
    } catch (error) {
      setPendingPosts((entries) =>
        entries.map((item) =>
          item.id === entry.id
            ? { ...item, status: "failed", error: errorText(error) }
            : item
        )
      );
    }
  }

  async function sendComment(entry: PendingComment) {
    setPendingComments((entries) =>
      entries.map((item) =>
        item.id === entry.id ? { ...item, status: "sending", error: undefined } : item
      )
    );

    try {
      await createFeedbackComment({
        id: entry.id,
        postId: entry.postId,
        nickname: entry.nickname,
        content: entry.content,
        adminKey: entry.adminKey,
        website: entry.website
      });
      setPendingComments((entries) =>
        entries.map((item) =>
          item.id === entry.id ? { ...item, status: "sent" } : item
        )
      );
      void loadPage(currentPage);
    } catch (error) {
      setPendingComments((entries) =>
        entries.map((item) =>
          item.id === entry.id
            ? { ...item, status: "failed", error: errorText(error) }
            : item
        )
      );
    }
  }

  function submitPost(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice(undefined);

    const waitMessage = cooldownMessage();

    if (waitMessage) {
      setActionError(waitMessage);
      return;
    }

    const entry: PendingPost = {
      id: createFeedbackId(),
      createdAt: new Date().toISOString(),
      nickname: nickname.trim(),
      content: content.trim(),
      password: password.trim() || undefined,
      website,
      status: "sending"
    };

    if (!entry.nickname || !entry.content) {
      setActionError(
        feedbackErrorMessage(entry.nickname ? "content_required" : "nickname_required")
      );
      return;
    }

    setActionError(undefined);
    saveNickname(entry.nickname);
    setLastSubmittedAt(Date.now());
    setContent("");
    setPassword("");
    setCurrentPage(1);
    setPendingPosts((entries) => [entry, ...entries]);
    void sendPost(entry);
  }

  function addComment(
    postId: string,
    input: { nickname: string; content: string; website: string }
  ): boolean {
    setNotice(undefined);

    const waitMessage = cooldownMessage();

    if (waitMessage) {
      setActionError(waitMessage);
      return false;
    }

    const entry: PendingComment = {
      id: createFeedbackId(),
      postId,
      createdAt: new Date().toISOString(),
      nickname: input.nickname.trim(),
      content: input.content.trim(),
      isAdmin,
      adminKey,
      website: input.website,
      status: "sending"
    };

    if (!entry.nickname || !entry.content) {
      setActionError(
        feedbackErrorMessage(entry.nickname ? "content_required" : "nickname_required")
      );
      return false;
    }

    if (!isAdmin) {
      saveNickname(entry.nickname);
      setNickname(entry.nickname);
    }

    setActionError(undefined);
    setLastSubmittedAt(Date.now());
    setPendingComments((entries) => [...entries, entry]);
    void sendComment(entry);
    return true;
  }

  function retryPost(postId: string) {
    const entry = pendingPosts.find((item) => item.id === postId);

    if (entry) {
      void sendPost(entry);
    }
  }

  function discardPost(postId: string) {
    setPendingPosts((entries) => entries.filter((item) => item.id !== postId));
  }

  function retryComment(commentId: string) {
    const entry = pendingComments.find((item) => item.id === commentId);

    if (entry) {
      void sendComment(entry);
    }
  }

  function discardComment(commentId: string) {
    setPendingComments((entries) => entries.filter((item) => item.id !== commentId));
  }

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

  async function deletePost(postId: string, postPassword?: string) {
    const ok = await runAction(async () => {
      await deleteFeedbackPost({ postId, password: postPassword, adminKey });
    });

    if (ok) {
      setNotice("글을 삭제했습니다.");
      setPendingPosts((entries) => entries.filter((item) => item.id !== postId));
      setPageData((data) =>
        data
          ? {
              ...data,
              total: Math.max(0, data.total - 1),
              posts: data.posts.filter((post) => post.id !== postId)
            }
          : data
      );
      void loadPage(currentPage);
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
      setPendingComments((entries) =>
        entries.filter((item) => item.id !== commentId)
      );
      setPageData((data) =>
        data
          ? {
              ...data,
              posts: data.posts.map((post) => ({
                ...post,
                comments: post.comments.filter((comment) => comment.id !== commentId)
              }))
            }
          : data
      );
      void loadPage(currentPage);
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
  const unconfirmedCount = pendingPosts.filter(
    (entry) => !pageData?.posts.some((post) => post.id === entry.id)
  ).length;
  const totalCount = pageData ? pageData.total + unconfirmedCount : undefined;

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
                <Button icon={<Send size={16} aria-hidden="true" />} type="submit">
                  등록
                </Button>
              </div>
            </form>
          </section>

          {busy ? (
            <p className="feedback-notice feedback-notice--progress" role="status">
              처리 중입니다. {slowServerHint}
            </p>
          ) : null}
          {notice && !busy ? (
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
                전체 글{totalCount !== undefined ? ` (${totalCount})` : ""}
              </h2>
              <div className="section-heading-actions">
                {isLoading && pageData ? (
                  <span className="feedback-refreshing">최신 글 확인 중…</span>
                ) : null}
                <Button
                  className="button--compact"
                  disabled={isLoading}
                  icon={<RefreshCw size={14} aria-hidden="true" />}
                  onClick={() => void loadPage(currentPage)}
                  variant="secondary"
                >
                  새로고침
                </Button>
              </div>
            </div>

            {isLoading && !pageData && displayPosts.length === 0 ? (
              <p className="feedback-empty">
                글을 불러오는 중입니다… {slowServerHint}
              </p>
            ) : null}

            {loadError && !isLoading ? (
              <div className="form-errors" role="alert">
                <p>{loadError}</p>
                {cachedAt ? (
                  <p>
                    마지막으로 불러온 목록을 보여드립니다. (
                    {new Date(cachedAt).toLocaleString("ko-KR")})
                  </p>
                ) : null}
              </div>
            ) : null}

            {pageData && displayPosts.length === 0 && !loadError ? (
              <p className="feedback-empty">아직 남겨진 글이 없습니다. 첫 의견을 남겨 주세요.</p>
            ) : null}

            {displayPosts.length > 0 ? (
              <div className="feedback-post-list">
                {displayPosts.map((post) => (
                  <FeedbackPostCard
                    key={post.id}
                    busy={busy}
                    defaultNickname={nickname}
                    isAdmin={isAdmin}
                    onAddComment={addComment}
                    onDeleteComment={deleteComment}
                    onDeletePost={deletePost}
                    onDiscardComment={discardComment}
                    onDiscardPost={discardPost}
                    onRetryComment={retryComment}
                    onRetryPost={retryPost}
                    post={post}
                  />
                ))}
              </div>
            ) : null}

            {pageData && totalPages > 1 ? (
              <nav className="feedback-pagination" aria-label="페이지 이동">
                <Button
                  className="button--compact"
                  disabled={busy || isLoading || currentPage <= 1}
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
                  disabled={busy || isLoading || currentPage >= totalPages}
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
