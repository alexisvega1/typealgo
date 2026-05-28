"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { analyzeSession, applySuggestedRecallMode } from "@/lib/coach";
import { hesitationHotspots } from "@/lib/metrics";
import { formatAnimatedStat, useAnimatedNumber } from "@/lib/use-animated-number";
import type { CoachAnalysis } from "@/lib/coach/types";
import { deviceClassLabel, isTouchDeviceClass } from "@/lib/device-class";
import type { DeviceClass, Snippet, TypingResult } from "@/lib/types";
import { CoachSection, recommendedActionIsRetry } from "@/components/coach/CoachSection";
import { SprintResultsSection } from "./SprintResultsSection";
import { useSettingsStore } from "@/stores/settings-store";
import { useStatsStore } from "@/stores/stats-store";

interface ResultsPanelProps {
  result: TypingResult;
  snippet: Snippet;
  deviceClass?: DeviceClass;
  onRetry: () => void;
  onNext: () => void;
}

const stagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.12 },
  },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function ResultsPanel({ result, snippet, deviceClass = "desktop-keyboard", onRetry, onNext }: ResultsPanelProps) {
  const hotspots = hesitationHotspots(result.keystrokes, snippet.code);
  const allResults = useStatsStore((s) => s.results);
  const settings = useSettingsStore();
  const setRecallMode = useSettingsStore((s) => s.setRecallMode);
  const setTrainingMode = useSettingsStore((s) => s.setTrainingMode);

  const coach: CoachAnalysis = useMemo(
    () =>
      analyzeSession({
        result,
        snippet,
        allResults,
        recallMode: result.recallMode ?? settings.recallMode,
        filterOpts: {
          pattern: settings.patternPack,
          difficulty: settings.difficulty,
          language: settings.language,
          tier: settings.curriculumTier,
        },
      }),
    [result, snippet, allResults, settings],
  );

  const recommendRetry = recommendedActionIsRetry(coach.recommendation.action);
  const touchSession = isTouchDeviceClass(deviceClass);

  const handleNext = () => {
    applySuggestedRecallMode(coach, setRecallMode, setTrainingMode);
    onNext();
  };

  const handleRetry = () => {
    applySuggestedRecallMode(coach, setRecallMode, setTrainingMode);
    onRetry();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
      className="results-overlay"
    >
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.98 }}
        transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
        className="results-card results-card-complete"
      >
        <div className="results-card-body">
          <motion.div variants={stagger} initial="hidden" animate="show">
            <motion.h2 variants={item} className="text-xl font-semibold text-accent">
              {result.sprintMetrics ? "Sprint complete" : "Session complete"}
            </motion.h2>
            <motion.p variants={item} className="mt-1 text-sm text-muted">
              {snippet.title}
              {result.deviceClass && (
                <span className="ml-2 text-xs uppercase tracking-wide opacity-70">
                  · {deviceClassLabel(result.deviceClass)}
                </span>
              )}
            </motion.p>

            {touchSession && (
              <motion.p variants={item} className="mobile-wpm-disclaimer mt-3">
                Practice session on {deviceClassLabel(deviceClass)} — not comparable to desktop
                keyboard benchmarking.
              </motion.p>
            )}

            <motion.div
              variants={item}
              className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4"
            >
              <StatBlock
                label={touchSession ? "Practice WPM" : "WPM"}
                value={result.wpm}
                highlight
                decimals={1}
              />
              {!touchSession && (
                <StatBlock label="Raw WPM" value={result.rawWpm} decimals={1} />
              )}
              <StatBlock label="Accuracy" value={result.accuracy} suffix="%" decimals={1} />
              <StatBlock
                label="Time"
                value={result.durationMs / 1000}
                suffix="s"
                decimals={1}
              />
            </motion.div>

            <motion.div variants={item} className="mt-6">
              <CoachSection analysis={coach} compact />
            </motion.div>

            {result.recallMetrics && (
              <motion.div variants={item} className="mt-6">
                <h3 className="text-sm font-medium text-muted">Recall performance</h3>
                <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <MiniStat label="Recall" value={`${result.recallMetrics.recallAccuracy}%`} accent />
                  <MiniStat label="Confidence" value={`${result.recallMetrics.confidenceScore}`} />
                  <MiniStat label="Reveals" value={`${result.recallMetrics.reveals}`} />
                  <MiniStat
                    label="Blank hesitation"
                    value={`${result.recallMetrics.avgBlankHesitationMs}ms`}
                  />
                </div>
                {result.recallMetrics.weakTokens.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {result.recallMetrics.weakTokens.map((t) => (
                      <span key={t} className="hotspot-chip">
                        <code>{t}</code>
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {result.sprintMetrics && (
              <motion.div variants={item}>
                <SprintResultsSection metrics={result.sprintMetrics} />
              </motion.div>
            )}

            {hotspots.length > 0 && (
              <motion.div variants={item} className="mt-6">
                <h3 className="text-sm font-medium text-muted">Hesitation hotspots</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {hotspots.map((h) => (
                    <span key={h.token} className="hotspot-chip">
                      <code>{h.token}</code>
                      <span className="text-muted">{h.avgDelayMs}ms</span>
                      {h.errors > 0 && <span className="text-red">{h.errors} err</span>}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            <motion.div variants={item} className="results-actions mt-8 hidden gap-3 md:flex">
              <button
                type="button"
                className={`btn-primary flex-1${!recommendRetry ? " btn-recommended" : ""}`}
                onClick={handleNext}
              >
                Next snippet
              </button>
              <button
                type="button"
                className={`btn-secondary flex-1${recommendRetry ? " btn-recommended" : ""}`}
                onClick={handleRetry}
              >
                Retry
              </button>
            </motion.div>
            <motion.p variants={item} className="mt-3 hidden text-center text-xs text-muted md:block">
              Press <kbd className="kbd">Enter</kbd> or <kbd className="kbd">Shift+Tab</kbd> for next ·{" "}
              <kbd className="kbd">Esc</kbd> to retry
            </motion.p>
          </motion.div>
        </div>

        <div className="results-actions-mobile md:hidden">
          <button
            type="button"
            className={`btn-primary flex-1${!recommendRetry ? " btn-recommended" : ""}`}
            onClick={handleNext}
          >
            Next snippet
          </button>
          <button
            type="button"
            className={`btn-secondary flex-1${recommendRetry ? " btn-recommended" : ""}`}
            onClick={handleRetry}
          >
            Retry
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function MiniStat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-lg bg-surface-2 px-3 py-2 text-center">
      <div className={`text-lg font-semibold ${accent ? "text-accent" : ""}`}>{value}</div>
      <div className="text-xs uppercase tracking-wider text-muted">{label}</div>
    </div>
  );
}

function StatBlock({
  label,
  value,
  highlight,
  suffix = "",
  decimals = 0,
}: {
  label: string;
  value: number;
  highlight?: boolean;
  suffix?: string;
  decimals?: number;
}) {
  const animated = useAnimatedNumber(value, true, 420);

  return (
    <div className="rounded-lg bg-surface-2 px-3 py-3 text-center">
      <div className={`text-2xl font-semibold tabular-nums ${highlight ? "text-accent" : "text-foreground"}`}>
        {formatAnimatedStat(animated, decimals)}
        {suffix}
      </div>
      <div className="mt-0.5 text-xs uppercase tracking-wider text-muted">{label}</div>
    </div>
  );
}
