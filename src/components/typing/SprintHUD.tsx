"use client";

import { motion, AnimatePresence } from "framer-motion";

interface SprintHUDProps {
  phase: "idle" | "countdown" | "active";
  countdown: number;
  elapsedMs: number;
  accuracy: number;
  mistakes: number;
}

function formatTime(ms: number): string {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${String(sec).padStart(2, "0")}`;
}

export function SprintHUD({ phase, countdown, elapsedMs, accuracy, mistakes }: SprintHUDProps) {
  return (
    <>
      <div className="sprint-hud">
        <div className="sprint-hud-item">
          <span className="sprint-hud-label">Elapsed</span>
          <span className="sprint-hud-value tabular-nums">
            {phase === "active" ? formatTime(elapsedMs) : "—"}
          </span>
        </div>
        <div className="sprint-hud-item">
          <span className="sprint-hud-label">Accuracy</span>
          <span className="sprint-hud-value tabular-nums">
            {phase === "active" ? `${accuracy.toFixed(1)}%` : "—"}
          </span>
        </div>
        <div className="sprint-hud-item">
          <span className="sprint-hud-label">Corrections</span>
          <span className={`sprint-hud-value tabular-nums${mistakes > 0 ? " text-red" : ""}`}>
            {phase === "active" ? mistakes : "—"}
          </span>
        </div>
      </div>

      <AnimatePresence>
        {phase === "idle" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="sprint-idle-prompt"
          >
            Press any key to begin sprint
          </motion.div>
        )}
        {phase === "countdown" && (
          <motion.div
            key={countdown}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.18 }}
            className="sprint-countdown-overlay"
          >
            <span className="sprint-countdown-num">{countdown > 0 ? countdown : "Go"}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
