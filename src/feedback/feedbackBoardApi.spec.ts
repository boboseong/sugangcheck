import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { feedbackBoardApiUrl } from "../app/externalLinks";
import {
  createFeedbackPost,
  FeedbackBoardError,
  feedbackRequestTimeoutMs,
  listFeedbackPosts,
  verifyFeedbackAdminKey
} from "./feedbackBoardApi";

function jsonResponse(payload: unknown): Response {
  return new Response(JSON.stringify(payload), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
}

describe("feedbackBoardApi", () => {
  const fetchMock = vi.fn<typeof fetch>();

  beforeEach(() => {
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    fetchMock.mockReset();
    vi.unstubAllGlobals();
  });

  it("lists posts with paging parameters and fills missing comments", async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({
        ok: true,
        page: 2,
        pageSize: 20,
        total: 21,
        posts: [
          {
            id: "p1",
            createdAt: "2026-09-30T00:00:00.000Z",
            nickname: "교사",
            content: "좋아요",
            appVersion: "0.1.14"
          }
        ]
      })
    );

    const result = await listFeedbackPosts(2);

    expect(result.total).toBe(21);
    expect(result.posts[0]?.comments).toEqual([]);

    const [url, init] = fetchMock.mock.calls[0] ?? [];
    expect(String(url)).toContain(feedbackBoardApiUrl);
    expect(String(url)).toContain("action=list");
    expect(String(url)).toContain("page=2");
    expect(init?.method).toBe("GET");
  });

  it("posts JSON as text/plain so Apps Script skips the preflight", async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({ ok: true, id: "p2", createdAt: "2026-09-30T00:00:00.000Z" })
    );

    const result = await createFeedbackPost({
      nickname: "교사",
      content: "의견",
      appVersion: "0.1.14",
      password: "1234"
    });

    expect(result.id).toBe("p2");

    const [url, init] = fetchMock.mock.calls[0] ?? [];
    expect(url).toBe(feedbackBoardApiUrl);
    expect(init?.method).toBe("POST");
    expect(init?.headers).toEqual({
      "Content-Type": "text/plain;charset=utf-8"
    });
    expect(init?.signal).toBeInstanceOf(AbortSignal);
    expect(JSON.parse(String(init?.body))).toMatchObject({
      action: "createPost",
      nickname: "교사",
      content: "의견",
      appVersion: "0.1.14",
      password: "1234"
    });
  });

  it("maps server error codes to Korean messages", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ ok: false, error: "forbidden" }));

    await expect(verifyFeedbackAdminKey("x")).rejects.toMatchObject({
      code: "forbidden",
      message: "비밀번호가 맞지 않거나 삭제 권한이 없습니다."
    });
  });

  it("reports a network error when fetch throws", async () => {
    fetchMock.mockRejectedValue(new TypeError("Failed to fetch"));

    const error = await listFeedbackPosts().catch((caught: unknown) => caught);

    expect(error).toBeInstanceOf(FeedbackBoardError);
    expect((error as FeedbackBoardError).code).toBe("network");
  });

  it("gives up with a timeout error when the server never answers", async () => {
    vi.useFakeTimers();

    try {
      fetchMock.mockImplementation(
        (_input, init) =>
          new Promise<Response>((_resolve, reject) => {
            init?.signal?.addEventListener("abort", () =>
              reject(new DOMException("aborted", "AbortError"))
            );
          })
      );

      const pending = listFeedbackPosts().catch((caught: unknown) => caught);
      await vi.advanceTimersByTimeAsync(feedbackRequestTimeoutMs);
      const error = await pending;

      expect((error as FeedbackBoardError).code).toBe("timeout");
      expect((error as FeedbackBoardError).message).toContain("응답이 없습니다");
    } finally {
      vi.useRealTimers();
    }
  });

  it("reports an invalid response when the body is not JSON", async () => {
    fetchMock.mockResolvedValue(new Response("<html>", { status: 200 }));

    const error = await listFeedbackPosts().catch((caught: unknown) => caught);

    expect((error as FeedbackBoardError).code).toBe("invalid_response");
  });
});
