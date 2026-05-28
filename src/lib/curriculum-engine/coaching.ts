import type { CoachRecommendation } from "@/lib/coach/types";
import type { CompanyTrackId } from "@/lib/types";
import { getCompanyTrack } from "./tracks";

/** Apply track-specific coaching voice to a base recommendation. */
export function applyTrackCoaching(
  rec: CoachRecommendation,
  trackId: CompanyTrackId,
): CoachRecommendation {
  if (trackId === "general") return rec;

  const track = getCompanyTrack(trackId);
  const { coaching } = track;

  let headline = rec.headline;
  let explanation = rec.explanation;

  if (rec.action === "continue-next" || rec.action === "harder-recall") {
    if (rec.suggestedSnippetTitle && !headline.startsWith(coaching.nextStepPrefix)) {
      headline = `${coaching.nextStepPrefix}: ${rec.suggestedSnippetTitle}`;
    }
    if (rec.confidenceLabel === "likely-mastered") {
      explanation = `${coaching.strengthFraming} ${explanation}`;
    }
  }

  if (
    rec.action === "retry-same" ||
    rec.action === "easier-recall" ||
    rec.action === "practice-prerequisite"
  ) {
    explanation = `${coaching.weaknessFraming}. ${explanation}`;
  }

  return { ...rec, headline, explanation };
}

export function trackSprintInsight(trackId: CompanyTrackId): string {
  if (trackId === "general") return "Balanced sprint grading";
  return getCompanyTrack(trackId).coaching.sprintEmphasis;
}
