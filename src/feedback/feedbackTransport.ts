import { feedbackBoardApiUrl } from "../app/externalLinks";

export type FeedbackRequest =
  | { method: "GET"; params: Record<string, string> }
  | { method: "POST"; body: Record<string, unknown> };

export const feedbackFrameMessageSource = "sugangcheck-feedback";

// Apps Script serves its pages from a per-script subdomain of this host.
const frameOriginPattern = /^https:\/\/[a-z0-9-]+\.googleusercontent\.com$/;

export function createFeedbackId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  const random = () =>
    Math.floor(Math.random() * 0x100000000)
      .toString(16)
      .padStart(8, "0");

  return `${random()}-${random()}-${random()}-${random()}`;
}

function abortError(): DOMException {
  return new DOMException("The request was aborted.", "AbortError");
}

/**
 * Asks the script through a hidden frame. The script answers with a small page
 * that posts the result to this window.
 *
 * This is the main channel: the JSON responses used by `sendByFetch` are handed
 * over through a second Google host that stalls for 10–60s about one request in
 * six, while pages are delivered directly and arrive in 1–3s.
 *
 * It never reports a connection problem by itself (a frame that fails to load
 * is silent), so it only settles on an answer or when `signal` aborts.
 */
export function sendByFrame(
  request: FeedbackRequest,
  signal: AbortSignal
): Promise<unknown> {
  return new Promise<unknown>((resolve, reject) => {
    if (signal.aborted) {
      reject(abortError());
      return;
    }

    const requestId = createFeedbackId();
    const url = new URL(feedbackBoardApiUrl);
    url.searchParams.set("transport", "frame");
    url.searchParams.set("rid", requestId);

    const iframe = document.createElement("iframe");
    iframe.name = `feedback-frame-${requestId}`;
    iframe.title = "의견 게시판 통신";
    iframe.setAttribute("aria-hidden", "true");
    iframe.tabIndex = -1;
    iframe.style.display = "none";

    let form: HTMLFormElement | undefined;

    function cleanup() {
      window.removeEventListener("message", onMessage);
      signal.removeEventListener("abort", onAbort);
      iframe.remove();
      form?.remove();
    }

    function onMessage(event: MessageEvent) {
      const data = event.data as
        | { source?: unknown; rid?: unknown; payload?: unknown }
        | null
        | undefined;

      if (
        !frameOriginPattern.test(event.origin) ||
        !data ||
        typeof data !== "object" ||
        data.source !== feedbackFrameMessageSource ||
        data.rid !== requestId
      ) {
        return;
      }

      cleanup();
      resolve(data.payload);
    }

    function onAbort() {
      cleanup();
      reject(abortError());
    }

    window.addEventListener("message", onMessage);
    signal.addEventListener("abort", onAbort);

    if (request.method === "GET") {
      for (const [key, value] of Object.entries(request.params)) {
        url.searchParams.set(key, value);
      }

      iframe.src = url.toString();
      document.body.appendChild(iframe);
      return;
    }

    // The body may carry a password or the admin key, so it goes in a form
    // field rather than the address.
    form = document.createElement("form");
    form.method = "POST";
    form.action = url.toString();
    form.target = iframe.name;
    form.style.display = "none";

    const payload = document.createElement("input");
    payload.type = "hidden";
    payload.name = "payload";
    payload.value = JSON.stringify(request.body);
    form.appendChild(payload);

    document.body.appendChild(iframe);
    document.body.appendChild(form);
    form.submit();
  });
}

/**
 * Asks the script with a plain request. Rejects with a `TypeError` when the
 * connection itself fails and a `SyntaxError` when Google answers with one of
 * its own error pages instead of the script's JSON.
 */
export async function sendByFetch(
  request: FeedbackRequest,
  signal: AbortSignal
): Promise<unknown> {
  let response: Response;

  if (request.method === "GET") {
    const url = new URL(feedbackBoardApiUrl);

    for (const [key, value] of Object.entries(request.params)) {
      url.searchParams.set(key, value);
    }

    response = await fetch(url.toString(), { method: "GET", signal });
  } else {
    // Apps Script only answers cross-origin POSTs without a preflight, so the
    // JSON travels as text/plain and the script parses it itself.
    response = await fetch(feedbackBoardApiUrl, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(request.body),
      signal
    });
  }

  return JSON.parse(await response.text()) as unknown;
}
