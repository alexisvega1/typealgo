"use client";

import { motion } from "framer-motion";
import type { SprintMetrics } from "@/lib/types";

export function SprintResultsSection({ metrics }: { metrics: SprintMetrics }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-6 border-t border-border pt-6"
    >
      <h3 className="text-sm font-medium text-muted">Sprint grading</h3>
      <p className="mt-1 text-lg font-semibold text-foreground">{metrics.gradeLabel}</p>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <SprintStat label="Readiness" value={`${metrics.interviewReadiness}`} accent />
        <SprintStat label="Confidence" value={`${metrics.implementationConfidence}`} />
        <SprintStat label="Hesitation/min" value={`${metrics.hesitationDensity}`} />
        <SprintStat label="Corrections" value={`${metrics.correctionCount}`} />
      </div>

      <ul className="sprint-insights mt-4">
        {metrics.insights.map((insight) => (
          <li key={insight}>{insight}</li>
        ))}
      </ul>
    </motion.div>
  );
}

function SprintStat({
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
      <div className={`text-lg font-semibold tabular-nums ${accent ? "text-accent" : ""}`}>
        {value}
      </div>
      <div className="text-xs uppercase tracking-wider text-muted">{label}</div>
    </div>
  );
}
