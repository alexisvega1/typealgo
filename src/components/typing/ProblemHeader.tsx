"use client";

import { motion } from "framer-motion";
import type { RecallMode, Snippet, TrainingMode } from "@/lib/types";
import { getPatternPack } from "@/data/curriculum";
import { formatCareerGoal } from "@/lib/curriculum-engine";
import { trainingModeLabel } from "@/lib/training-mode";
import { EvidenceIndicators } from "@/components/curriculum/EvidenceIndicators";
import { useIsMobileLayout } from "@/hooks/use-device-class";
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
  stageRequirement?: string | null;
  stageLabel?: string;
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
  stageRequirement,
  stageLabel,
}: ProblemHeaderProps) {
  const pack = getPatternPack(snippet.pattern);
  const isMobileLayout = useIsMobileLayout();

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
    <header className="problem-header border-b border-border/60 px-4 py-2 sm:px-6 sm:py-4">
      <motion.div
        key={snippet.id}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto max-w-4xl"
      >
        {stageRequirement && (
          <p className="stage-requirement-header">
            {stageLabel ? <span className="stage-requirement-label">{stageLabel}</span> : null}
            {stageLabel ? " · " : null}
            {stageRequirement}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <h1 className="text-base font-medium tracking-tight text-foreground sm:text-lg md:text-xl">
            {snippet.title}
          </h1>
          <div className="flex flex-wrap items-center gap-1.5 text-xs sm:gap-2 sm:text-sm">
            <span
              className="rounded-full px-2 py-0.5 font-medium"
              style={{
                backgroundColor: `${pack?.color ?? "#e2b714"}22`,
                color: pack?.color ?? "#e2b714",
              }}
            >
              {pack?.name ?? snippet.pattern}
            </span>
            <span className="tier-pill capitalize">{snippet.tier.replace("-", " ")}</span>
            {!isMobileLayout && (
              <>
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
              </>
            )}
            <span className={`capitalize ${DIFFICULTY_COLOR[snippet.difficulty]}`}>
              {snippet.difficulty}
            </span>
          </div>
          {!isMobileLayout && (
            <motion.div
              key={status}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="ml-auto text-sm text-muted"
            >
              {status}
            </motion.div>
          )}
        </div>
        {snippet.description && !isMobileLayout && (
          <p className="mt-2 text-sm text-muted">{snippet.description}</p>
        )}
        {!isMobileLayout && (
          <div className="mt-2">
            <EvidenceIndicators snippet={snippet} companyTrack={companyTrack} compact />
          </div>
        )}
      </motion.div>
    </header>
  );
}
