import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  createFeedbackId,
  createFeedbackPost,
  FeedbackBoardError,
  feedbackAttemptPlan,
  feedbackRequestDeadlineMs,
  listFeedbackPosts,
  verifyFeedbackAdminKey
} from "./feedbackBoardApi";
import type { FeedbackRequest } from "./feedbackTransport";

const transportMocks = vi.hoisted(() => ({
  sendByFrame: vi.fn(),
  sendByFetch: vi.fn()
}));

vi.mock("./feedbackTransport", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./feedbackTransport")>();

  return { ...actual, ...transportMocks };
});

/** An attempt that never answers until it is aborted, like a stalled hand-off. */
function stalled(_request: FeedbackRequest, signal: AbortSignal): Promise<unknown> {
  return new Promise<unknown>((_resolve, reject) => {
    signal.addEventListener("abort", () =>
      reject(new DOMException("aborted", "AbortError"))
    );
  });
}

const listPayload = {
  ok: true,
  page: 1,
  pageSize: 20,
  total: 1,
  posts: [
    {
      id: "p1",
      createdAt: "2026-09-30T00:00:00.000Z",
      nickname: "교사",
      content: "좋아요",
      appVersion: "0.1.14"
    }
  ]
};

const secondAttemptAt = feedbackAttemptPlan[1].startMs;
const thirdAttemptAt = feedbackAttemptPlan[2].startMs;

describe("feedbackBoardApi", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    transportMocks.sendByFrame.mockReset();
    transportMocks.sendByFetch.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("lists posts through the frame channel and fills missing comments", async () => {
    transportMocks.sendByFrame.mockResolvedValue({ ...listPayload, page: 2, total: 21 });

    const result = await listFeedbackPosts(2);

    expect(result.total).toBe(21);
    expect(result.posts[0]?.comments).toEqual([]);
    expect(transportMocks.sendByFrame).toHaveBeenCalledTimes(1);
    expect(transportMocks.sendByFetch).not.toHaveBeenCalled();
    expect(transportMocks.sendByFrame.mock.calls[0]?.[0]).toEqual({
      method: "GET",
      params: { action: "list", page: "2", pageSize: "20" }
    });
  });

  it("sends a create as a POST body that carries the client id", async () => {
    transportMocks.sendByFrame.mockResolvedValue({
      ok: true,
      id: "post-id-1",
      createdAt: "2026-09-30T00:00:00.000Z"
    });

    const result = await createFeedbackPost({
      id: "post-id-1",
      nickname: "교사",
      content: "의견",
      appVersion: "0.1.14",
      password: "1234"
    });

    expect(result.id).toBe("post-id-1");
    expect(transportMocks.sendByFrame.mock.calls[0]?.[0]).toEqual({
      method: "POST",
      body: {
        action: "createPost",
        id: "post-id-1",
        nickname: "교사",
        content: "의견",
        appVersion: "0.1.14",
        password: "1234"
      }
    });
  });

  it("starts a fetch alongside a stalled frame and uses whichever answers", async () => {
    transportMocks.sendByFrame.mockImplementation(stalled);
    transportMocks.sendByFetch.mockResolvedValue(listPayload);

    const pending = listFeedbackPosts();

    await vi.advanceTimersByTimeAsync(secondAttemptAt - 1);
    expect(transportMocks.sendByFetch).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(1);
    const result = await pending;

    expect(result.posts).toHaveLength(1);
    expect(transportMocks.sendByFrame).toHaveBeenCalledTimes(1);
    expect(transportMocks.sendByFetch).toHaveBeenCalledTimes(1);

    const frameSignal = transportMocks.sendByFrame.mock.calls[0]?.[1] as AbortSignal;
    expect(frameSignal.aborted).toBe(true);
  });

  it("starts another frame when both the frame and the fetch stall", async () => {
    transportMocks.sendByFrame
      .mockImplementationOnce(stalled)
      .mockResolvedValueOnce(listPayload);
    transportMocks.sendByFetch.mockImplementation(stalled);

    const pending = listFeedbackPosts();

    await vi.advanceTimersByTimeAsync(thirdAttemptAt);
    const result = await pending;

    expect(result.total).toBe(1);
    expect(transportMocks.sendByFrame).toHaveBeenCalledTimes(2);
    expect(transportMocks.sendByFetch).toHaveBeenCalledTimes(1);
  });

  it("treats a fetched POST that was bounced to the post list as lost and retries", async () => {
    // Google bounces a lost POST back as a GET, which answers with the post list.
    transportMocks.sendByFrame
      .mockImplementationOnce(stalled)
      .mockResolvedValueOnce({
        ok: true,
        id: "post-id-2",
        createdAt: "2026-09-30T00:00:00.000Z",
        duplicate: true
      });
    transportMocks.sendByFetch.mockResolvedValue(listPayload);

    const pending = createFeedbackPost({
      id: "post-id-2",
      nickname: "교사",
      content: "의견",
      appVersion: "0.1.14"
    });

    await vi.advanceTimersByTimeAsync(secondAttemptAt);
    const result = await pending;

    expect(result.id).toBe("post-id-2");
    expect(transportMocks.sendByFrame).toHaveBeenCalledTimes(2);

    const requests = [
      ...transportMocks.sendByFrame.mock.calls,
      ...transportMocks.sendByFetch.mock.calls
    ].map(([request]) => request as FeedbackRequest);
    expect(new Set(requests.map((request) => JSON.stringify(request))).size).toBe(1);
  });

  it("retries when Google answers with its own error page", async () => {
    transportMocks.sendByFrame
      .mockImplementationOnce(stalled)
      .mockResolvedValueOnce(listPayload);
    transportMocks.sendByFetch.mockRejectedValue(new SyntaxError("Unexpected token <"));

    const pending = listFeedbackPosts();
    await vi.advanceTimersByTimeAsync(secondAttemptAt);
    const result = await pending;

    expect(result.total).toBe(1);
    expect(transportMocks.sendByFrame).toHaveBeenCalledTimes(2);
  });

  it("does not retry an answer the server gave on purpose", async () => {
    transportMocks.sendByFrame.mockResolvedValue({ ok: false, error: "forbidden" });

    await expect(verifyFeedbackAdminKey("x")).rejects.toMatchObject({
      code: "forbidden",
      message: "비밀번호가 맞지 않거나 삭제 권한이 없습니다."
    });
    expect(transportMocks.sendByFrame).toHaveBeenCalledTimes(1);
    expect(transportMocks.sendByFetch).not.toHaveBeenCalled();
  });

  it("reports a network error without waiting when the browser is offline", async () => {
    vi.spyOn(navigator, "onLine", "get").mockReturnValue(false);

    const error = await listFeedbackPosts().catch((caught: unknown) => caught);

    expect(error).toBeInstanceOf(FeedbackBoardError);
    expect((error as FeedbackBoardError).code).toBe("network");
    expect(transportMocks.sendByFrame).not.toHaveBeenCalled();
  });

  it("reports a network error as soon as the fetch cannot connect", async () => {
    transportMocks.sendByFrame.mockImplementation(stalled);
    transportMocks.sendByFetch.mockRejectedValue(new TypeError("Failed to fetch"));

    const pending = listFeedbackPosts().catch((caught: unknown) => caught);
    await vi.advanceTimersByTimeAsync(secondAttemptAt);
    const error = await pending;

    expect((error as FeedbackBoardError).code).toBe("network");
    expect(transportMocks.sendByFrame).toHaveBeenCalledTimes(1);
  });

  it("gives up with a timeout error when nothing answers before the deadline", async () => {
    transportMocks.sendByFrame.mockImplementation(stalled);
    transportMocks.sendByFetch.mockImplementation(stalled);

    const pending = listFeedbackPosts().catch((caught: unknown) => caught);
    await vi.advanceTimersByTimeAsync(feedbackRequestDeadlineMs);
    const error = await pending;

    expect((error as FeedbackBoardError).code).toBe("timeout");
    expect(
      transportMocks.sendByFrame.mock.calls.length +
        transportMocks.sendByFetch.mock.calls.length
    ).toBe(feedbackAttemptPlan.length);

    const signals = [
      ...transportMocks.sendByFrame.mock.calls,
      ...transportMocks.sendByFetch.mock.calls
    ].map(([, signal]) => signal as AbortSignal);
    expect(signals.every((signal) => signal.aborted)).toBe(true);
  });

  it("creates ids the server accepts", () => {
    const id = createFeedbackId();

    expect(id).toMatch(/^[A-Za-z0-9-]{8,64}$/);
    expect(createFeedbackId()).not.toBe(id);
  });
});
