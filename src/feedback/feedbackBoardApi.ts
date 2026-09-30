import {
  createFeedbackId,
  sendByFetch,
  sendByFrame,
  type FeedbackRequest
} from "./feedbackTransport";

export { createFeedbackId };

export type FeedbackComment = {
  id: string;
  postId: string;
  createdAt: string;
  nickname: string;
  content: string;
  isAdmin: boolean;
};

export type FeedbackPost = {
  id: string;
  createdAt: string;
  nickname: string;
  content: string;
  appVersion: string;
  comments: FeedbackComment[];
};

export type FeedbackPostPage = {
  page: number;
  pageSize: number;
  total: number;
  posts: FeedbackPost[];
};

export const feedbackBoardPageSize = 20;
export const feedbackNicknameMaxLength = 20;
export const feedbackContentMaxLength = 2000;

// A request is normally answered through the hidden frame in 1–3s. If no answer
// has come by the next start time, another attempt is started alongside it and
// whichever answers first wins. The second attempt is a plain fetch: it uses a
// different Google path, and unlike a frame it can tell when there is no
// connection at all.
export const feedbackAttemptPlan = [
  { startMs: 0, transport: "frame" },
  { startMs: 4_000, transport: "fetch" },
  { startMs: 8_000, transport: "frame" },
  { startMs: 16_000, transport: "frame" }
] as const;
export const feedbackRequestDeadlineMs = 60_000;

type ApiEnvelope<T> = ({ ok: true } & T) | { ok: false; error?: string };

export class FeedbackBoardError extends Error {
  readonly code: string;

  constructor(code: string) {
    super(feedbackErrorMessage(code));
    this.name = "FeedbackBoardError";
    this.code = code;
  }
}

export function feedbackErrorMessage(code: string): string {
  switch (code) {
    case "network":
      return "게시판에 연결하지 못했습니다. 인터넷 연결을 확인한 뒤 다시 시도해 주세요.";
    case "timeout":
      return "게시판 서버(Google)의 응답이 1분 넘게 없습니다. 잠시 후 다시 시도해 주세요.";
    case "nickname_required":
      return "닉네임을 입력해 주세요.";
    case "content_required":
      return "내용을 입력해 주세요.";
    case "post_not_found":
      return "글을 찾을 수 없습니다. 이미 삭제되었을 수 있습니다.";
    case "comment_not_found":
      return "댓글을 찾을 수 없습니다. 이미 삭제되었을 수 있습니다.";
    case "forbidden":
      return "비밀번호가 맞지 않거나 삭제 권한이 없습니다.";
    case "invalid_response":
      return "게시판 응답을 읽지 못했습니다. 잠시 후 다시 시도해 주세요.";
    default:
      return "요청을 처리하지 못했습니다. 잠시 후 다시 시도해 주세요.";
  }
}

type AttemptOutcome<T> =
  | { kind: "ok"; payload: T }
  /** The script answered and said no. */
  | { kind: "rejected"; code: string }
  /** No usable answer from this attempt; another attempt may still succeed. */
  | { kind: "lost"; code: "invalid_response" }
  /** There is no connection, so further attempts are pointless. */
  | { kind: "offline" };

// When the hand-off for a fetched POST is lost, Google bounces the browser back
// to the script as a plain GET, which answers with the post list. That is not
// the answer to the POST, so it counts as a lost response.
function isBouncedPost(request: FeedbackRequest, payload: object): boolean {
  return request.method === "POST" && Array.isArray((payload as { posts?: unknown }).posts);
}

async function runAttempt<T>(
  request: FeedbackRequest,
  transport: "frame" | "fetch",
  signal: AbortSignal
): Promise<AttemptOutcome<T>> {
  let payload: unknown;

  try {
    payload =
      transport === "frame"
        ? await sendByFrame(request, signal)
        : await sendByFetch(request, signal);
  } catch (error) {
    // Only a fetch can fail to connect; a body that is not JSON is Google's own
    // error page rather than the script's answer.
    return error instanceof TypeError
      ? { kind: "offline" }
      : { kind: "lost", code: "invalid_response" };
  }

  if (!payload || typeof payload !== "object" || !("ok" in payload)) {
    return { kind: "lost", code: "invalid_response" };
  }

  const envelope = payload as ApiEnvelope<T>;

  if (!envelope.ok) {
    return { kind: "rejected", code: envelope.error ?? "unknown" };
  }

  if (isBouncedPost(request, envelope)) {
    return { kind: "lost", code: "invalid_response" };
  }

  return { kind: "ok", payload: envelope };
}

// Every action is safe to repeat: reads and deletes by nature, creates because
// the server writes a given id only once.
function requestWithRetry<T>(request: FeedbackRequest): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    if (typeof navigator !== "undefined" && navigator.onLine === false) {
      reject(new FeedbackBoardError("network"));
      return;
    }

    const maxAttempts = feedbackAttemptPlan.length;
    const controllers = new Set<AbortController>();
    const timers: ReturnType<typeof setTimeout>[] = [];
    let started = 0;
    let lost = 0;
    let settled = false;

    function finish(settle: () => void) {
      if (settled) {
        return;
      }

      settled = true;
      timers.forEach((timer) => clearTimeout(timer));
      controllers.forEach((controller) => controller.abort());
      settle();
    }

    function startAttempt() {
      if (settled || started >= maxAttempts) {
        return;
      }

      const plan = feedbackAttemptPlan[started];

      if (!plan) {
        return;
      }

      started += 1;
      const controller = new AbortController();
      controllers.add(controller);

      void runAttempt<T>(request, plan.transport, controller.signal).then((outcome) => {
        controllers.delete(controller);

        if (settled) {
          return;
        }

        if (outcome.kind === "ok") {
          finish(() => resolve(outcome.payload));
          return;
        }

        if (outcome.kind === "rejected") {
          finish(() => reject(new FeedbackBoardError(outcome.code)));
          return;
        }

        if (outcome.kind === "offline") {
          finish(() => reject(new FeedbackBoardError("network")));
          return;
        }

        lost += 1;

        if (started < maxAttempts) {
          startAttempt();
        } else if (lost >= started) {
          finish(() => reject(new FeedbackBoardError(outcome.code)));
        }
      });
    }

    feedbackAttemptPlan.forEach((plan, index) => {
      if (index === 0) {
        return;
      }

      timers.push(
        setTimeout(() => {
          if (started <= index) {
            startAttempt();
          }
        }, plan.startMs)
      );
    });

    timers.push(
      setTimeout(() => {
        finish(() => reject(new FeedbackBoardError("timeout")));
      }, feedbackRequestDeadlineMs)
    );

    startAttempt();
  });
}

function getJson<T>(params: Record<string, string>): Promise<T> {
  return requestWithRetry<T>({ method: "GET", params });
}

function postJson<T>(body: Record<string, unknown>): Promise<T> {
  return requestWithRetry<T>({ method: "POST", body });
}

export async function listFeedbackPosts(page = 1): Promise<FeedbackPostPage> {
  const result = await getJson<FeedbackPostPage>({
    action: "list",
    page: String(page),
    pageSize: String(feedbackBoardPageSize)
  });

  return {
    page: result.page,
    pageSize: result.pageSize,
    total: result.total,
    posts: result.posts.map((post) => ({
      ...post,
      comments: post.comments ?? []
    }))
  };
}

export type CreateFeedbackPostInput = {
  /** Client-generated; the server writes each id once, so retries are safe. */
  id: string;
  nickname: string;
  content: string;
  appVersion: string;
  password?: string;
  website?: string;
};

export async function createFeedbackPost(
  input: CreateFeedbackPostInput
): Promise<{ id: string; createdAt: string }> {
  return postJson({ action: "createPost", ...input });
}

export type CreateFeedbackCommentInput = {
  /** Client-generated; the server writes each id once, so retries are safe. */
  id: string;
  postId: string;
  nickname: string;
  content: string;
  adminKey?: string;
  website?: string;
};

export async function createFeedbackComment(
  input: CreateFeedbackCommentInput
): Promise<{ id: string; createdAt: string; isAdmin: boolean }> {
  return postJson({ action: "createComment", ...input });
}

export async function deleteFeedbackPost(input: {
  postId: string;
  password?: string;
  adminKey?: string;
}): Promise<void> {
  await postJson({ action: "deletePost", ...input });
}

export async function deleteFeedbackComment(input: {
  commentId: string;
  adminKey: string;
}): Promise<void> {
  await postJson({ action: "deleteComment", ...input });
}

export async function verifyFeedbackAdminKey(adminKey: string): Promise<boolean> {
  const result = await postJson<{ isAdmin: boolean }>({
    action: "verifyAdmin",
    adminKey
  });

  return result.isAdmin === true;
}
