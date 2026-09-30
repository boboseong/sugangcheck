import { feedbackBoardApiUrl } from "../app/externalLinks";

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
export const feedbackRequestTimeoutMs = 15_000;

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
      return "게시판 응답이 없습니다. 학교 네트워크에서 Google 접속이 막혀 있을 수 있습니다.";
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

async function parseEnvelope<T>(response: Response): Promise<T> {
  let payload: ApiEnvelope<T>;

  try {
    payload = (await response.json()) as ApiEnvelope<T>;
  } catch {
    throw new FeedbackBoardError("invalid_response");
  }

  if (!payload || typeof payload !== "object" || !("ok" in payload)) {
    throw new FeedbackBoardError("invalid_response");
  }

  if (!payload.ok) {
    throw new FeedbackBoardError(payload.error ?? "unknown");
  }

  return payload;
}

// A firewall that silently drops Google traffic leaves fetch hanging with no
// error, so every request gives up after a fixed wait instead.
async function fetchWithTimeout(
  input: string,
  init: RequestInit
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), feedbackRequestTimeoutMs);

  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } catch {
    throw new FeedbackBoardError(controller.signal.aborted ? "timeout" : "network");
  } finally {
    clearTimeout(timer);
  }
}

async function getJson<T>(params: Record<string, string>): Promise<T> {
  const url = new URL(feedbackBoardApiUrl);

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  const response = await fetchWithTimeout(url.toString(), { method: "GET" });

  return parseEnvelope<T>(response);
}

// Apps Script only answers cross-origin POSTs without a preflight, so the JSON
// travels as text/plain and the script parses it itself.
async function postJson<T>(body: Record<string, unknown>): Promise<T> {
  const response = await fetchWithTimeout(feedbackBoardApiUrl, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(body)
  });

  return parseEnvelope<T>(response);
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
