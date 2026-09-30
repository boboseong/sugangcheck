import type { FeedbackPostPage } from "./feedbackBoardApi";

const nicknameKey = "sugangcheck.feedbackBoard.nickname";
const adminKeyKey = "sugangcheck.feedbackBoard.adminKey";
const cacheKey = "sugangcheck.feedbackBoard.cache";

function readItem(key: string): string | undefined {
  if (typeof localStorage === "undefined") {
    return undefined;
  }

  try {
    return localStorage.getItem(key) ?? undefined;
  } catch {
    return undefined;
  }
}

function writeItem(key: string, value: string | undefined) {
  if (typeof localStorage === "undefined") {
    return;
  }

  try {
    if (value === undefined) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, value);
    }
  } catch {
    // Storage may be unavailable; the board still works without persistence.
  }
}

export function readSavedNickname(): string {
  return readItem(nicknameKey) ?? "";
}

export function saveNickname(nickname: string) {
  writeItem(nicknameKey, nickname.trim() || undefined);
}

export function readSavedAdminKey(): string | undefined {
  return readItem(adminKeyKey);
}

export function saveAdminKey(adminKey: string | undefined) {
  writeItem(adminKeyKey, adminKey);
}

export type CachedFeedbackPage = FeedbackPostPage & { fetchedAt: string };

export function readCachedFirstPage(): CachedFeedbackPage | undefined {
  const raw = readItem(cacheKey);

  if (!raw) {
    return undefined;
  }

  try {
    const parsed = JSON.parse(raw) as CachedFeedbackPage;

    return Array.isArray(parsed.posts) ? parsed : undefined;
  } catch {
    return undefined;
  }
}

export function cacheFirstPage(page: FeedbackPostPage) {
  if (page.page !== 1) {
    return;
  }

  writeItem(
    cacheKey,
    JSON.stringify({ ...page, fetchedAt: new Date().toISOString() })
  );
}
