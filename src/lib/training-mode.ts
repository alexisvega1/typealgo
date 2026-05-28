import type { RecallMode, TrainingMode } from "./types";

export const TRAINING_MODES: {
  id: TrainingMode;
  label: string;
  description: string;
  available: boolean;
}[] = [
  {
    id: "type",
    label: "Type",
    description: "Passive fluency — full visible code, rhythm and speed",
    available: true,
  },
  {
    id: "recall",
    label: "Recall",
    description: "Active retrieval — reconstruct syntax from memory",
    available: true,
  },
  {
    id: "review",
    label: "Review",
    description: "Study mode — inspect motifs and syntax chunks",
    available: true,
  },
  {
    id: "sprint",
    label: "Sprint",
    description: "Interview simulation — type from memory under pressure",
    available: true,
  },
];

export const RECALL_INTENSITY_MODES: { id: RecallMode; label: string }[] = [
  { id: "token-blank", label: "Token Recall" },
  { id: "line-blank", label: "Line Recall" },
  { id: "skeleton", label: "Skeleton" },
];

/** Map top-level training mode to the recall blanking strategy. */
export function effectiveRecallMode(
  trainingMode: TrainingMode,
  recallIntensity: RecallMode,
): RecallMode {
  switch (trainingMode) {
    case "type":
      return "full-copy";
    case "recall":
      return recallIntensity === "full-copy" ? "token-blank" : recallIntensity;
    case "review":
      return "full-copy";
    case "sprint":
      return "skeleton";
    default:
      return "full-copy";
  }
}

export function isTypingEnabled(trainingMode: TrainingMode, sprintActive = true): boolean {
  if (trainingMode === "type" || trainingMode === "recall") return true;
  if (trainingMode === "sprint") return sprintActive;
  return false;
}

export function isSprintTraining(trainingMode: TrainingMode): boolean {
  return trainingMode === "sprint";
}

export function isReviewTraining(trainingMode: TrainingMode): boolean {
  return trainingMode === "review";
}

export function isRecallTraining(trainingMode: TrainingMode): boolean {
  return trainingMode === "recall";
}

export function trainingModeLabel(mode: TrainingMode): string {
  return TRAINING_MODES.find((m) => m.id === mode)?.label ?? mode;
}
