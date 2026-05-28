"use client";

import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { generateEnglishWords } from "@/lib/english-baseline";
import { calcAccuracy, calcRawWpm, calcWpm } from "@/lib/metrics";
import { useDeviceClass } from "@/hooks/use-device-class";
import { deviceClassLabel, isTouchDeviceClass } from "@/lib/device-class";
import type { BaselineResult } from "@/lib/types";
import { useStatsStore } from "@/stores/stats-store";

const TEST_SECONDS = 30;

type CharState = "pending" | "correct" | "incorrect";
type Phase = "ready" | "running" | "done";

function generateId(): string {
  return `bl-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

interface EnglishBaselineModalProps {
  open: boolean;
  onClose: () => void;
}

export function EnglishBaselineModal({ open, onClose }: EnglishBaselineModalProps) {
  // Portal to <body> so the fixed overlay centers against the real viewport — a
  // backdrop-filter on the sticky header would otherwise become its containing
  // block and clip the modal at the top.
  const content = (
    <AnimatePresence>
      {open && <BaselineRunner key="baseline" onClose={onClose} />}
    </AnimatePresence>
  );

  if (typeof document === "undefined") return null;
  return createPortal(content, document.body);
}

function BaselineRunner({ onClose }: { onClose: () => void }) {
  const deviceClass = useDeviceClass();
  const recordBaseline = useStatsStore((s) => s.recordBaseline);

  const [words, setWords] = useState<string[]>(() => generateEnglishWords());
  const text = useMemo(() => words.join(" "), [words]);
  const chars = useMemo(() => Array.from(text), [text]);

  // Group the flat char stream into words (+ the single space that follows each
  // word) so the text wraps by word instead of scrolling horizontally.
  const segments = useMemo(() => {
    const segs: { chars: { ch: string; i: number }[]; space: number | null }[] = [];
    let i = 0;
    words.forEach((w, wi) => {
      const wordChars: { ch: string; i: number }[] = [];
      for (const ch of w) {
        wordChars.push({ ch, i });
        i++;
      }
      let space: number | null = null;
      if (wi < words.length - 1) {
        space = i;
        i++;
      }
      segs.push({ chars: wordChars, space });
    });
    return segs;
  }, [words]);

  const [phase, setPhase] = useState<Phase>("ready");
  const [idx, setIdx] = useState(0);
  const [states, setStates] = useState<CharState[]>(() => chars.map(() => "pending"));
  const [timeLeft, setTimeLeft] = useState(TEST_SECONDS);
  const [result, setResult] = useState<BaselineResult | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const activeCharRef = useRef<HTMLSpanElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const startRef = useRef<number | null>(null);
  const correctRef = useRef(0);
  const incorrectRef = useRef(0);
  const idxRef = useRef(0);
  const finishedRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const reset = useCallback(() => {
    const next = generateEnglishWords();
    finishedRef.current = false;
    startRef.current = null;
    correctRef.current = 0;
    incorrectRef.current = 0;
    idxRef.current = 0;
    if (timerRef.current) clearInterval(timerRef.current);
    setWords(next);
    setStates(Array.from(next.join(" ")).map(() => "pending"));
    setIdx(0);
    setTimeLeft(TEST_SECONDS);
    setResult(null);
    setPhase("ready");
    requestAnimationFrame(() => inputRef.current?.focus());
  }, []);

  const finish = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    if (timerRef.current) clearInterval(timerRef.current);
    const elapsed = startRef.current ? performance.now() - startRef.current : TEST_SECONDS * 1000;
    const correct = correctRef.current;
    const incorrect = incorrectRef.current;
    const total = correct + incorrect;
    const res: BaselineResult = {
      id: generateId(),
      wpm: calcWpm(correct, elapsed),
      rawWpm: calcRawWpm(total, elapsed),
      accuracy: calcAccuracy(correct, total),
      durationMs: Math.round(elapsed),
      correctChars: correct,
      incorrectChars: incorrect,
      totalChars: total,
      durationSec: TEST_SECONDS,
      timestamp: Date.now(),
      deviceClass,
    };
    setResult(res);
    setPhase("done");
    recordBaseline(res);
  }, [deviceClass, recordBaseline]);

  const beginTimer = useCallback(() => {
    startRef.current = performance.now();
    setPhase("running");
    timerRef.current = setInterval(() => {
      const elapsed = startRef.current ? (performance.now() - startRef.current) / 1000 : 0;
      const remaining = Math.max(0, TEST_SECONDS - elapsed);
      setTimeLeft(Math.ceil(remaining));
      if (remaining <= 0) finish();
    }, 100);
  }, [finish]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (finishedRef.current) return;
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      if (e.key === "Backspace") {
        e.preventDefault();
        const i = idxRef.current;
        if (i === 0) return;
        const prevState = states[i - 1];
        if (prevState === "correct") correctRef.current = Math.max(0, correctRef.current - 1);
        else if (prevState === "incorrect")
          incorrectRef.current = Math.max(0, incorrectRef.current - 1);
        idxRef.current = i - 1;
        setIdx(i - 1);
        setStates((s) => {
          const copy = s.slice();
          copy[i - 1] = "pending";
          return copy;
        });
        return;
      }

      if (e.key.length !== 1) return;
      e.preventDefault();

      const i = idxRef.current;
      if (i >= chars.length) {
        finish();
        return;
      }
      if (startRef.current === null) beginTimer();

      const correct = e.key === chars[i];
      if (correct) correctRef.current++;
      else incorrectRef.current++;

      setStates((s) => {
        const copy = s.slice();
        copy[i] = correct ? "correct" : "incorrect";
        return copy;
      });
      idxRef.current = i + 1;
      setIdx(i + 1);

      if (i + 1 >= chars.length) finish();
    },
    [chars, states, beginTimer, finish, onClose],
  );

  useEffect(() => {
    requestAnimationFrame(() => inputRef.current?.focus());
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    const container = textRef.current;
    const active = activeCharRef.current;
    if (!container || !active) return;
    // Center the active character vertically within the text box only (never the
    // page), so you're always typing near the middle and can see the next lines.
    const cRect = container.getBoundingClientRect();
    const aRect = active.getBoundingClientRect();
    const delta = aRect.top - cRect.top - (container.clientHeight / 2 - aRect.height / 2);
    container.scrollTo({ top: container.scrollTop + delta, behavior: "smooth" });
  }, [idx]);

  const touch = isTouchDeviceClass(deviceClass);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="results-overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.98 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        className="results-card baseline-card"
      >
        <button
          type="button"
          className="results-close-btn"
          onClick={onClose}
          aria-label="Close English baseline"
          title="Close"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

        <div className="baseline-header">
          <h2 className="text-lg font-semibold text-accent">English baseline</h2>
          <p className="mt-1 text-sm text-muted">
            {TEST_SECONDS}s · standard English words · same WPM engine as code, so it&apos;s a
            clean control.
          </p>
        </div>

        {phase !== "done" ? (
          <>
            <div className="baseline-timer" aria-live="polite">
              <span className="baseline-timer-value">{timeLeft}</span>
              <span className="baseline-timer-unit">s</span>
              {phase === "ready" && (
                <span className="baseline-hint">— start typing to begin</span>
              )}
            </div>

            <div
              ref={textRef}
              className="baseline-text"
              onMouseDown={() => inputRef.current?.focus()}
            >
              {segments.map((seg, si) => (
                <Fragment key={si}>
                  <span className="baseline-word">
                    {seg.chars.map(({ ch, i }) => {
                      const isActive = i === idx;
                      return (
                        <span
                          key={i}
                          ref={isActive ? activeCharRef : undefined}
                          className={`baseline-char baseline-char-${states[i]}${
                            isActive ? " baseline-char-active" : ""
                          }`}
                        >
                          {ch}
                        </span>
                      );
                    })}
                  </span>
                  {seg.space !== null && (
                    <span
                      ref={seg.space === idx ? activeCharRef : undefined}
                      className={`baseline-char baseline-space baseline-char-${
                        states[seg.space]
                      }${seg.space === idx ? " baseline-char-active" : ""}`}
                    >
                      {" "}
                    </span>
                  )}
                </Fragment>
              ))}
            </div>

            <input
              ref={inputRef}
              className="baseline-input"
              type="text"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              inputMode={touch ? "text" : undefined}
              aria-label="Type the words shown above"
              value=""
              onChange={() => {}}
              onKeyDown={handleKeyDown}
            />
          </>
        ) : (
          result && <BaselineResults result={result} onAgain={reset} onClose={onClose} touch={touch} />
        )}
      </motion.div>
    </motion.div>
  );
}

function BaselineResults({
  result,
  onAgain,
  onClose,
  touch,
}: {
  result: BaselineResult;
  onAgain: () => void;
  onClose: () => void;
  touch: boolean;
}) {
  return (
    <div className="baseline-results">
      <div className="grid grid-cols-3 gap-3">
        <ResultStat label={touch ? "Practice WPM" : "WPM"} value={result.wpm} highlight />
        <ResultStat label="Raw" value={result.rawWpm} />
        <ResultStat label="Accuracy" value={result.accuracy} suffix="%" />
      </div>
      {touch && (
        <p className="mobile-wpm-disclaimer mt-3">
          {deviceClassLabel(result.deviceClass ?? "mobile-touch")} session — not comparable to a
          desktop keyboard.
        </p>
      )}
      <p className="mt-3 text-sm text-muted">
        Saved to your baselines. Compare it against your code WPM on the Stats page.
      </p>
      <div className="mt-5 flex gap-3">
        <button type="button" className="btn-primary flex-1" onClick={onAgain}>
          Run again
        </button>
        <button type="button" className="btn-secondary flex-1" onClick={onClose}>
          Done
        </button>
      </div>
    </div>
  );
}

function ResultStat({
  label,
  value,
  suffix = "",
  highlight,
}: {
  label: string;
  value: number;
  suffix?: string;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-lg bg-surface-2 px-3 py-3 text-center">
      <div
        className={`text-2xl font-semibold tabular-nums ${
          highlight ? "text-accent" : "text-foreground"
        }`}
      >
        {value}
        {suffix}
      </div>
      <div className="mt-0.5 text-xs uppercase tracking-wider text-muted">{label}</div>
    </div>
  );
}
