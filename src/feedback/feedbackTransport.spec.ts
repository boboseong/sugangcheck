import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { feedbackBoardApiUrl } from "../app/externalLinks";
import {
  feedbackFrameMessageSource,
  sendByFetch,
  sendByFrame
} from "./feedbackTransport";

const scriptOrigin = "https://n-abc123-0lu-script.googleusercontent.com";

function frames(): HTMLIFrameElement[] {
  return Array.from(document.querySelectorAll("iframe"));
}

function answer(origin: string, data: unknown) {
  window.dispatchEvent(new MessageEvent("message", { origin, data }));
}

function requestIdOf(url: string): string {
  return new URL(url).searchParams.get("rid") ?? "";
}

describe("sendByFrame", () => {
  beforeEach(() => {
    // jsdom does not implement form submission.
    vi.spyOn(HTMLFormElement.prototype, "submit").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
    document.body.innerHTML = "";
  });

  it("loads a GET in a hidden frame and resolves with the posted payload", async () => {
    const controller = new AbortController();
    const pending = sendByFrame(
      { method: "GET", params: { action: "list", page: "1" } },
      controller.signal
    );

    const [frame] = frames();
    expect(frame).toBeDefined();
    expect(frame?.style.display).toBe("none");

    const url = new URL(frame?.src ?? "");
    expect(url.origin + url.pathname).toBe(feedbackBoardApiUrl);
    expect(url.searchParams.get("transport")).toBe("frame");
    expect(url.searchParams.get("action")).toBe("list");
    expect(url.searchParams.get("page")).toBe("1");

    const payload = { ok: true, total: 0, posts: [] };
    answer(scriptOrigin, {
      source: feedbackFrameMessageSource,
      rid: requestIdOf(frame?.src ?? ""),
      payload
    });

    await expect(pending).resolves.toEqual(payload);
    expect(frames()).toHaveLength(0);
  });

  it("submits a POST as a form field so secrets stay out of the address", async () => {
    const controller = new AbortController();
    const body = { action: "deletePost", postId: "p1", password: "1234" };
    const pending = sendByFrame({ method: "POST", body }, controller.signal);

    const form = document.querySelector("form");
    const [frame] = frames();
    expect(form?.method.toUpperCase()).toBe("POST");
    expect(form?.target).toBe(frame?.name);
    expect(form?.action).not.toContain("1234");
    expect(HTMLFormElement.prototype.submit).toHaveBeenCalledTimes(1);

    const field = form?.querySelector<HTMLInputElement>('input[name="payload"]');
    expect(JSON.parse(field?.value ?? "{}")).toEqual(body);

    answer(scriptOrigin, {
      source: feedbackFrameMessageSource,
      rid: requestIdOf(form?.action ?? ""),
      payload: { ok: true }
    });

    await expect(pending).resolves.toEqual({ ok: true });
    expect(document.querySelector("form")).toBeNull();
    expect(frames()).toHaveLength(0);
  });

  it("ignores messages from other origins, other sources and other requests", async () => {
    const controller = new AbortController();
    const pending = sendByFrame(
      { method: "GET", params: { action: "ping" } },
      controller.signal
    );
    const rid = requestIdOf(frames()[0]?.src ?? "");
    let settled = false;
    void pending.then(() => {
      settled = true;
    });

    answer("https://evil.example", { source: feedbackFrameMessageSource, rid, payload: { ok: true } });
    answer(scriptOrigin, { source: "something-else", rid, payload: { ok: true } });
    answer(scriptOrigin, { source: feedbackFrameMessageSource, rid: "other", payload: { ok: true } });
    answer(scriptOrigin, "not an object");
    await Promise.resolve();

    expect(settled).toBe(false);
    expect(frames()).toHaveLength(1);

    answer(scriptOrigin, { source: feedbackFrameMessageSource, rid, payload: { ok: true } });
    await expect(pending).resolves.toEqual({ ok: true });
  });

  it("removes the frame and rejects when aborted", async () => {
    const controller = new AbortController();
    const pending = sendByFrame(
      { method: "GET", params: { action: "ping" } },
      controller.signal
    );

    expect(frames()).toHaveLength(1);
    controller.abort();

    await expect(pending).rejects.toMatchObject({ name: "AbortError" });
    expect(frames()).toHaveLength(0);
  });
});

describe("sendByFetch", () => {
  const fetchMock = vi.fn<typeof fetch>();

  beforeEach(() => {
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    fetchMock.mockReset();
    vi.unstubAllGlobals();
  });

  it("posts JSON as text/plain so Apps Script skips the preflight", async () => {
    fetchMock.mockResolvedValue(new Response(JSON.stringify({ ok: true })));
    const controller = new AbortController();

    const result = await sendByFetch(
      { method: "POST", body: { action: "verifyAdmin", adminKey: "k" } },
      controller.signal
    );

    expect(result).toEqual({ ok: true });

    const [url, init] = fetchMock.mock.calls[0] ?? [];
    expect(url).toBe(feedbackBoardApiUrl);
    expect(init?.method).toBe("POST");
    expect(init?.headers).toEqual({ "Content-Type": "text/plain;charset=utf-8" });
    expect(JSON.parse(String(init?.body))).toEqual({ action: "verifyAdmin", adminKey: "k" });
    expect(init?.signal).toBe(controller.signal);
  });

  it("puts GET parameters in the address", async () => {
    fetchMock.mockResolvedValue(new Response(JSON.stringify({ ok: true })));

    await sendByFetch(
      { method: "GET", params: { action: "list", page: "3" } },
      new AbortController().signal
    );

    const [url, init] = fetchMock.mock.calls[0] ?? [];
    expect(String(url)).toContain("action=list");
    expect(String(url)).toContain("page=3");
    expect(init?.method).toBe("GET");
  });

  it("throws a SyntaxError when the body is one of Google's error pages", async () => {
    fetchMock.mockResolvedValue(new Response("<!DOCTYPE html>", { status: 404 }));

    await expect(
      sendByFetch({ method: "GET", params: { action: "list" } }, new AbortController().signal)
    ).rejects.toBeInstanceOf(SyntaxError);
  });
});
