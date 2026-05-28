"use client";

import { motion } from "framer-motion";
import type { RecallMode, Snippet, TrainingMode } from "@/lib/types";
import { getPatternPack } from "@/data/curriculum";
import { formatCareerGoal } from "@/lib/curriculum-engine";
import { trainingModeLabel } from "@/lib/training-mode";
import { EvidenceIndicators } from "@/components/curriculum/EvidenceIndicators";
import type { CareerLevelId, CompanyTrackId } from "@/lib/types";

const RECALL_LABEL: Record<RecallMode, string> = {
  "full-copy": "Full Copy",
  "token-blank": "Token Recall",
  "line-blank": "Line Recall",
  skeleton: "Skeleton",
};

interface ProblemHeaderProps {
  snippet: Snippet;
  started: boolean;
  finished: boolean;
  trainingMode: TrainingMode;
  recallMode?: RecallMode;
  companyTrack?: CompanyTrackId;
  careerLevel?: CareerLevelId;
}

const DIFFICULTY_COLOR = {
  easy: "text-green",
  medium: "text-amber",
  hard: "text-red",
};

export function ProblemHeader({
  snippet,
  started,
  finished,
  trainingMode,
  recallMode,
  companyTrack = "general",
  careerLevel = "mid",
}: ProblemHeaderProps) {
  const pack = getPatternPack(snippet.pattern);

  const status =
    trainingMode === "review"
      ? "Consolidation"
      : trainingMode === "sprint"
        ? finished
          ? "Sprint complete"
          : started
            ? "Under pressure"
            : "Ready to sprint"
        : finished
          ? "Complete"
          : started
            ? "Typing…"
            : trainingMode === "type"
              ? "Start typing for flow"
              : "Start typing to recall";

  return (
    <header className="border-b border-border/60 px-4 py-3 sm:px-6 sm:py-4">
      <motion.div
        key={snippet.id}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto max-w-4xl"
      >
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <h1 className="text-lg font-medium tracking-tight text-foreground md:text-xl">
            {snippet.title}
          </h1>
        <div className="flex items-center gap-2 text-sm">
          <span
            className="rounded-full px-2.5 py-0.5 font-medium"
            style={{
              backgroundColor: `${pack?.color ?? "#e2b714"}22`,
              color: pack?.color ?? "#e2b714",
            }}
          >
            {pack?.name ?? snippet.pattern}
          </span>
          <span className="tier-pill capitalize">{snippet.tier.replace("-", " ")}</span>
          <span className={`mode-pill mode-pill-${trainingMode}`}>
            {trainingModeLabel(trainingMode)}
          </span>
          {trainingMode === "recall" && recallMode && recallMode !== "full-copy" && (
            <span className="recall-pill">{RECALL_LABEL[recallMode]}</span>
          )}
          {companyTrack !== "general" && (
            <span className="tier-pill">{formatCareerGoal(companyTrack, careerLevel)}</span>
          )}
          <span className="text-muted capitalize">{snippet.language}</span>
            <span className={`capitalize ${DIFFICULTY_COLOR[snippet.difficulty]}`}>
              {snippet.difficulty}
            </span>
          </div>
          <motion.div
            key={status}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="ml-auto text-sm text-muted"
          >
            {status}
          </motion.div>
        </div>
        {snippet.description && (
          <p className="mt-2 text-sm text-muted">{snippet.description}</p>
        )}
        <div className="mt-2">
          <EvidenceIndicators snippet={snippet} companyTrack={companyTrack} compact />
        </div>
      </motion.div>
    </header>
  );
}
