import type { CompanyTrackId, Language } from "@/lib/types";

const GOOGLE_INTERVIEW_LANGUAGES: Language[] = ["python", "javascript", "java", "cpp"];

/** Non-blocking guidance when language mismatches a track's interview reality. */
export function trackLanguageHint(
  trackId: CompanyTrackId,
  language: Language,
): string | null {
  if (trackId === "anthropic" && language !== "python") {
    return "Anthropic interviews use a shared Python environment — consider practicing in Python.";
  }
  if (trackId === "openai" && language !== "python") {
    return "OpenAI interviews are primarily Python — consider practicing in Python.";
  }
  if (trackId === "google" && !GOOGLE_INTERVIEW_LANGUAGES.includes(language)) {
    return "Google interviews restrict languages to Python, Java, C++, and JavaScript.";
  }
  return null;
}

export function trackLanguageHintKey(trackId: CompanyTrackId, language: Language): string {
  return `${trackId}:${language}`;
}
