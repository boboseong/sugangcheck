export type CreditParseResult =
  | {
      ok: true;
      value: number;
    }
  | {
      ok: false;
      reason: "empty" | "invalid";
    };

export function parseCreditValue(value: unknown): CreditParseResult {
  if (value === null || value === undefined || value === "") {
    return { ok: false, reason: "empty" };
  }

  if (typeof value === "number") {
    return Number.isFinite(value)
      ? { ok: true, value }
      : { ok: false, reason: "invalid" };
  }

  const normalized = String(value)
    .normalize("NFKC")
    .trim()
    .replace(/\s+/g, "")
    .replace(/학점$/, "");

  if (!normalized) {
    return { ok: false, reason: "empty" };
  }

  const decimalNormalized = normalized.includes(".")
    ? normalized
    : normalized.replace(",", ".");

  if (!/^\d+(?:\.\d+)?$/.test(decimalNormalized)) {
    return { ok: false, reason: "invalid" };
  }

  const parsed = Number(decimalNormalized);

  return Number.isFinite(parsed)
    ? { ok: true, value: parsed }
    : { ok: false, reason: "invalid" };
}

export function toCreditNumber(value: unknown): number | undefined {
  const result = parseCreditValue(value);

  return result.ok ? result.value : undefined;
}
