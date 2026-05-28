/** Opening character → expected closing character (IDE-style pairs). */
const PAIR_CLOSER: Record<string, string> = {
  "(": ")",
  "[": "]",
  "{": "}",
  "<": ">",
  '"': '"',
  "'": "'",
  "`": "`",
};

export function closingCharFor(open: string): string | null {
  return PAIR_CLOSER[open] ?? null;
}

export function shouldAutoCompletePair(open: string, nextExpected: string | undefined): boolean {
  const close = closingCharFor(open);
  return close !== null && nextExpected === close;
}
