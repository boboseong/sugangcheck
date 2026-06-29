const middleDotLikeCharacters = /[·ㆍ•･∙‧・⋅]/g;
const dashLikeCharacters = /[-‐‑‒–—―]/g;
const bracketLikeCharacters = /[()[\]{}<>〈〉《》「」『』【】〔〕]/g;
const slashLikeCharacters = /[\\/]/g;
const connectorLikeCharacters = /[_+|]/g;

const romanNumerals: Record<string, string> = {
  IV: "4",
  III: "3",
  II: "2",
  I: "1"
};

function replaceRomanNumeralToken(value: string): string {
  return romanNumerals[value.toUpperCase()] ?? value;
}

function normalizeRomanNumeralSteps(value: string): string {
  let normalized = value.replace(
    /(^|[^A-Za-z가-힣0-9])(IV|III|II|I)(?=$|[^A-Za-z가-힣0-9])/gi,
    (_, prefix: string, roman: string) => `${prefix}${replaceRomanNumeralToken(roman)}`
  );

  normalized = normalized.replace(
    /([가-힣])(IV|III|II|I)(?=$|[^A-Za-z가-힣0-9])/g,
    (_, prefix: string, roman: string) => `${prefix} ${replaceRomanNumeralToken(roman)}`
  );

  return normalized;
}

function normalizeArabicNumeralSteps(value: string): string {
  return value
    .replace(/([가-힣A-Za-z])([1-4])(?=$|[^0-9])/g, "$1 $2")
    .replace(/(^|[^0-9])([1-4])([가-힣A-Za-z])/g, "$1$2 $3");
}

function normalizeSubjectSeparators(value: string): string {
  return value
    .replace(middleDotLikeCharacters, " ")
    .replace(dashLikeCharacters, " ")
    .replace(slashLikeCharacters, " ")
    .replace(connectorLikeCharacters, " ")
    .replace(bracketLikeCharacters, " ");
}

export function normalizeSubjectName(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }

  return normalizeArabicNumeralSteps(
    normalizeRomanNumeralSteps(
      normalizeSubjectSeparators(String(value).normalize("NFKC"))
    )
  )
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();
}
