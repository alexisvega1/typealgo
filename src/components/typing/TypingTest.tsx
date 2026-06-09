"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import { playTypingClick } from "@/lib/typing-sound";
import { pickSnippet } from "@/data/curriculum";
import {
  snippetStageCode,
  snippetStageCount,
  snippetStageLabel,
  snippetStageRequirement,
} from "@/lib/snippet-stages";
import { useAppearanceStore } from "@/stores/appearance-store";
import { shouldAutoCompletePair } from "@/lib/auto-pair";
import { tokenizeCode } from "@/lib/tokenizer";
import { calcAccuracy, calcRawWpm, calcWpm } from "@/lib/metrics";
import { buildRecallPlan, computeRecallIntensity } from "@/lib/recall-blanks";
import { computeRecallMetrics, priorSnippetRecallStats } from "@/lib/recall-metrics";
import { analyzeSession, applySuggestedRecallMode } from "@/lib/coach";
import {
  countCognitiveChars,
  isAutoKeystroke,
  isStructuralChar,
} from "@/lib/semantic-traversal";
import { applyCharPending, applyCharTyped, resetAllChars, showAllCharsReview } from "@/lib/typing-display";
import {
  effectiveRecallMode,
  isRecallTraining,
  isReviewTraining,
  isSprintTraining,
  isTypingEnabled,
} from "@/lib/training-mode";
import { resolveSprintProfile } from "@/lib/curriculum-engine";
import { buildReviewAnalytics, computeSprintMetrics, linesForMotif } from "@/lib/modes";
import { useDeviceClass, useIsMobileLayout } from "@/hooks/use-device-class";
import { isTouchDeviceClass } from "@/lib/device-class";
import type { DeviceClass, SyntaxMotif } from "@/lib/types";
import { useSettingsStore } from "@/stores/settings-store";
import { useStatsStore } from "@/stores/stats-store";
import type { CharToken, KeystrokeEvent, Snippet, TypingResult } from "@/lib/types";
import { ProblemHeader } from "./ProblemHeader";
import { LiveStats } from "./LiveStats";
import { MobileActionBar } from "./MobileActionBar";
import { RecallConfidence } from "./RecallConfidence";
import { ResultsPanel } from "./ResultsPanel";
import { ReviewWorkspace } from "./ReviewWorkspace";
import { SprintHUD } from "./SprintHUD";

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function buildCharLineMap(tokens: CharToken[]): number[] {
  const map = new Array<number>(tokens.length);
  let line = 0;
  let lineCount = 1;
  for (const t of tokens) {
    if (t.char === "\n") lineCount++;
  }
  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i].char === "\n") {
      map[i] = Math.min(line + 1, lineCount - 1);
      line++;
    } else {
      map[i] = line;
    }
  }
  return map;
}

function flashChar(el: HTMLElement, correct: boolean) {
  el.classList.remove("char-flash-correct", "char-incorrect-flash");
  void el.offsetWidth;
  el.classList.add(correct ? "char-flash-correct" : "char-incorrect-flash");
}

export function TypingTest() {
  const settings = useSettingsStore();
  const setRecallMode = useSettingsStore((s) => s.setRecallMode);
  const setTrainingMode = useSettingsStore((s) => s.setTrainingMode);
  const recordResult = useStatsStore((s) => s.recordResult);

  const [snippet, setSnippet] = useState<Snippet | null>(null);
  const [stageIndex, setStageIndex] = useState(0);
  const stageIndexRef = useRef(0);
  const [finished, setFinished] = useState(false);
  const [resultsDismissed, setResultsDismissed] = useState(false);
  const [liveWpm, setLiveWpm] = useState(0);
  const [liveAcc, setLiveAcc] = useState(100);
  const [liveRecallAcc, setLiveRecallAcc] = useState(100);
  const [confidenceScore, setConfidenceScore] = useState(100);
  const [showRevealHint, setShowRevealHint] = useState(false);
  const [result, setResult] = useState<TypingResult | null>(null);
  const [started, setStarted] = useState(false);
  const [tick, setTick] = useState(0);
  const [reviewLine, setReviewLine] = useState(0);
  const [reviewMotif, setReviewMotif] = useState<SyntaxMotif | null>(null);
  const [sprintPhase, setSprintPhase] = useState<"idle" | "countdown" | "active">("idle");
  const [sprintCountdown, setSprintCountdown] = useState(3);
  const [sprintElapsed, setSprintElapsed] = useState(0);
  const [liveMistakes, setLiveMistakes] = useState(0);

  const viewportRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const linesTransformRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const charRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const lineRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const lineOffsetRef = useRef(0);

  const tokensRef = useRef<CharToken[]>([]);
  const blankMaskRef = useRef<boolean[]>([]);
  const revealedRef = useRef<Set<number>>(new Set());
  const charLineMapRef = useRef<number[]>([]);
  const indexRef = useRef(0);
  const correctRef = useRef(0);
  const incorrectRef = useRef(0);
  const blankCorrectRef = useRef(0);
  const blankIncorrectRef = useRef(0);
  const revealsRef = useRef(0);
  const startTimeRef = useRef<number | null>(null);
  const lastKeyTimeRef = useRef<number | null>(null);
  const keystrokesRef = useRef<KeystrokeEvent[]>([]);
  const snippetRef = useRef<Snippet | null>(null);
  const activeLineRef = useRef(-1);
  const finishedRef = useRef(false);
  const trainingModeRef = useRef(settings.trainingMode);
  const recallModeRef = useRef(
    effectiveRecallMode(settings.trainingMode, settings.recallMode),
  );
  const deviceClassRef = useRef<DeviceClass>("desktop-keyboard");

  const deviceClass = useDeviceClass();
  const isMobileLayout = useIsMobileLayout();

  const activeRecallMode = effectiveRecallMode(settings.trainingMode, settings.recallMode);
  const isRecallActive = isRecallTraining(settings.trainingMode);
  const isReviewMode = isReviewTraining(settings.trainingMode);
  const isSprintMode = isSprintTraining(settings.trainingMode);
  const typingEnabled = isTypingEnabled(
    settings.trainingMode,
    isSprintMode && sprintPhase === "active",
  );

  const results = useStatsStore((s) => s.results);
  const reviewAnalytics = useMemo(
    () => (snippet ? buildReviewAnalytics(snippet, results) : null),
    [snippet, results],
  );

  const finishedCoach = useMemo(() => {
    if (!finished || !result || !snippet) return null;
    const allResults = useStatsStore.getState().results;
    return analyzeSession({
      result,
      snippet,
      allResults,
      recallMode: result.recallMode ?? activeRecallMode,
      filterOpts: {
        pattern: settings.patternPack,
        difficulty: settings.difficulty,
        language: settings.language,
        tier: settings.curriculumTier,
      },
      companyTrack: settings.companyTrack,
      careerLevel: settings.careerLevel,
    });
  }, [finished, result, snippet, settings]);

  const prepareSnippetStage = useCallback(
    (next: Snippet, stage: number, results: ReturnType<typeof useStatsStore.getState>["results"]) => {
      stageIndexRef.current = stage;
      setStageIndex(stage);
      const code = snippetStageCode(next, stage);
      trainingModeRef.current = settings.trainingMode;
      recallModeRef.current = effectiveRecallMode(
        settings.trainingMode,
        settings.recallMode,
      );
      indexRef.current = 0;
      correctRef.current = 0;
      incorrectRef.current = 0;
      blankCorrectRef.current = 0;
      blankIncorrectRef.current = 0;
      revealsRef.current = 0;
      startTimeRef.current = null;
      lastKeyTimeRef.current = null;
      keystrokesRef.current = [];
      revealedRef.current = new Set();
      tokensRef.current = tokenizeCode(code, next.language);
      charLineMapRef.current = buildCharLineMap(tokensRef.current);

      const prior = priorSnippetRecallStats(results, next.id);
      const intensity = isSprintTraining(settings.trainingMode)
        ? 1
        : computeRecallIntensity({
            fluencyLevel: next.fluencyLevel,
            priorAccuracy: prior?.accuracy,
            priorRecallAccuracy: prior?.recallAccuracy,
          });
      blankMaskRef.current = buildRecallPlan(
        tokensRef.current,
        code,
        recallModeRef.current,
        intensity,
      ).blankMask;

      if (deviceClassRef.current === "mobile-touch" && isRecallTraining(settings.trainingMode)) {
        const mobileRecall =
          recallModeRef.current === "skeleton" ? "skeleton" : "token-blank";
        if (mobileRecall !== recallModeRef.current) {
          recallModeRef.current = mobileRecall;
          blankMaskRef.current = buildRecallPlan(
            tokensRef.current,
            code,
            mobileRecall,
            intensity,
          ).blankMask;
        }
      }

      charRefs.current = new Array(tokensRef.current.length).fill(null);
      lineRefs.current = [];
      activeLineRef.current = -1;
      setTick((t) => t + 1);
    },
    [settings.trainingMode, settings.recallMode],
  );

  const loadSnippet = useCallback(
    (excludeId?: string) => {
      const results = useStatsStore.getState().results;
      const next = pickSnippet({
        pattern: settings.patternPack,
        difficulty: settings.difficulty,
        language: settings.language,
        tier: settings.curriculumTier,
        companyTrack: settings.companyTrack,
        careerLevel: settings.careerLevel,
        excludeId,
        adaptive: settings.adaptiveMode,
        results,
      });
      snippetRef.current = next;
      setSnippet(next);
      setFinished(false);
      finishedRef.current = false;
      setResultsDismissed(false);
      setResult(null);
      setStarted(false);
      setLiveWpm(0);
      setLiveAcc(100);
      setLiveRecallAcc(100);
      setConfidenceScore(100);
      setShowRevealHint(false);
      setReviewLine(0);
      setReviewMotif(null);
      setSprintPhase(isSprintTraining(settings.trainingMode) ? "idle" : "active");
      setSprintCountdown(3);
      setSprintElapsed(0);
      setLiveMistakes(0);
      prepareSnippetStage(next, 0, results);
    },
    [
      settings.patternPack,
      settings.difficulty,
      settings.language,
      settings.curriculumTier,
      settings.companyTrack,
      settings.careerLevel,
      settings.adaptiveMode,
      settings.trainingMode,
      prepareSnippetStage,
    ],
  );

  useEffect(() => {
    deviceClassRef.current = deviceClass;
  }, [deviceClass]);

  useEffect(() => {
    if (finishedRef.current) return;
    loadSnippet();
  }, [
    loadSnippet,
    settings.patternPack,
    settings.difficulty,
    settings.language,
    settings.curriculumTier,
    settings.companyTrack,
    settings.careerLevel,
    settings.adaptiveMode,
    settings.recallMode,
    settings.trainingMode,
  ]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [snippet, tick]);

  const handleReviewNavigation = useCallback(
    (e: globalThis.KeyboardEvent): boolean => {
      if (finishedRef.current || trainingModeRef.current !== "review" || !reviewAnalytics) {
        return false;
      }

      const target = e.target as HTMLElement | null;
      if (target?.closest("select, textarea, button, a")) return false;

      const motifs = reviewAnalytics.motifStats.map((m) => m.motif);
      const maxLine = Math.max(0, lineRefs.current.length - 1);

      if (e.key === "ArrowDown" || e.key === "j") {
        e.preventDefault();
        setReviewLine((l) => Math.min(maxLine, l + 1));
        return true;
      }
      if (e.key === "ArrowUp" || e.key === "k") {
        e.preventDefault();
        setReviewLine((l) => Math.max(0, l - 1));
        return true;
      }
      if (e.key === "ArrowRight" || e.key === "]") {
        e.preventDefault();
        if (motifs.length === 0) return true;
        const idx = reviewMotif ? motifs.indexOf(reviewMotif) : -1;
        setReviewMotif(motifs[(idx + 1) % motifs.length]);
        return true;
      }
      if (e.key === "ArrowLeft" || e.key === "[") {
        e.preventDefault();
        if (motifs.length === 0) return true;
        const idx = reviewMotif ? motifs.indexOf(reviewMotif) : 0;
        setReviewMotif(motifs[(idx - 1 + motifs.length) % motifs.length]);
        return true;
      }
      return false;
    },
    [reviewAnalytics, reviewMotif],
  );

  useEffect(() => {
    if (!isReviewMode || finished) return;
    window.addEventListener("keydown", handleReviewNavigation, { capture: true });
    return () => window.removeEventListener("keydown", handleReviewNavigation, { capture: true });
  }, [isReviewMode, finished, handleReviewNavigation]);

  const applyReviewStyles = useCallback(() => {
    if (trainingModeRef.current !== "review" || !snippetRef.current || !reviewAnalytics) return;

    showAllCharsReview(charRefs.current, tokensRef.current, {
      hesitationIndices: reviewAnalytics.hesitationIndices,
    });

    const motifLines = reviewMotif
      ? new Set(linesForMotif(snippetRef.current.code, reviewMotif))
      : new Set<number>();

    lineRefs.current.forEach((line, i) => {
      line?.classList.remove(
        "code-line-active",
        "code-line-review-focus",
        "code-line-review-motif",
        "code-line-review-dim",
      );
      if (reviewMotif && motifLines.has(i)) {
        line?.classList.add("code-line-review-motif");
      } else if (i === reviewLine) {
        line?.classList.add("code-line-review-focus");
      } else if (reviewMotif || reviewLine >= 0) {
        line?.classList.add("code-line-review-dim");
      }
    });

    if (cursorRef.current) cursorRef.current.style.display = "none";
  }, [reviewAnalytics, reviewLine, reviewMotif]);

  const resetDisplay = useCallback(() => {
    if (trainingModeRef.current === "review") {
      applyReviewStyles();
      return;
    }
    resetAllChars(
      charRefs.current,
      tokensRef.current,
      blankMaskRef.current,
      revealedRef.current,
    );
    lineRefs.current.forEach((line) =>
      line?.classList.remove(
        "code-line-active",
        "code-line-review-focus",
        "code-line-review-motif",
        "code-line-review-dim",
      ),
    );
    activeLineRef.current = -1;
    if (cursorRef.current) {
      cursorRef.current.style.display = "";
    }
  }, [applyReviewStyles]);

  const rebuildBlankMaskForMode = useCallback(() => {
    const s = snippetRef.current;
    const tokens = tokensRef.current;
    if (!s || tokens.length === 0) return;

    trainingModeRef.current = settings.trainingMode;
    recallModeRef.current = effectiveRecallMode(settings.trainingMode, settings.recallMode);

    const results = useStatsStore.getState().results;
    const prior = priorSnippetRecallStats(results, s.id);
    const intensity = isSprintTraining(settings.trainingMode)
      ? 1
      : computeRecallIntensity({
          fluencyLevel: s.fluencyLevel,
          priorAccuracy: prior?.accuracy,
          priorRecallAccuracy: prior?.recallAccuracy,
        });

    blankMaskRef.current = buildRecallPlan(
      tokens,
      s.code,
      recallModeRef.current,
      intensity,
    ).blankMask;

    if (deviceClassRef.current === "mobile-touch" && isRecallTraining(settings.trainingMode)) {
      const mobileRecall =
        recallModeRef.current === "skeleton" ? "skeleton" : "token-blank";
      if (mobileRecall !== recallModeRef.current) {
        recallModeRef.current = mobileRecall;
        blankMaskRef.current = buildRecallPlan(
          tokens,
          s.code,
          mobileRecall,
          intensity,
        ).blankMask;
      }
    }
  }, [settings.trainingMode, settings.recallMode]);

  useEffect(() => {
    rebuildBlankMaskForMode();
    resetDisplay();
  }, [
    snippet,
    resetDisplay,
    tick,
    settings.trainingMode,
    activeRecallMode,
    rebuildBlankMaskForMode,
  ]);

  useEffect(() => {
    if (isReviewMode) applyReviewStyles();
  }, [isReviewMode, applyReviewStyles, reviewLine, reviewMotif, tick]);

  useEffect(() => {
    if (!isSprintMode || sprintPhase !== "countdown") return;
    if (sprintCountdown <= 0) {
      const id = window.setTimeout(() => {
        setSprintPhase("active");
        const now = performance.now();
        startTimeRef.current = now;
        lastKeyTimeRef.current = now;
        setStarted(true);
      }, 0);
      return () => clearTimeout(id);
    }
    const t = window.setTimeout(() => setSprintCountdown((c) => c - 1), 700);
    return () => clearTimeout(t);
  }, [isSprintMode, sprintPhase, sprintCountdown]);

  useEffect(() => {
    if (!isSprintMode || sprintPhase !== "active" || !started) return;
    const id = window.setInterval(() => {
      if (startTimeRef.current) {
        setSprintElapsed(performance.now() - startTimeRef.current);
      }
    }, 200);
    return () => clearInterval(id);
  }, [isSprintMode, sprintPhase, started]);

  const startSprintCountdown = useCallback(() => {
    setSprintCountdown(3);
    setSprintPhase("countdown");
  }, []);

  useEffect(() => {
    if (!isRecallActive || finished || isReviewMode) return;
    const id = window.setInterval(() => {
      const idx = indexRef.current;
      const mask = blankMaskRef.current;
      if (finishedRef.current || idx >= mask.length) return;
      const hesitating =
        mask[idx] &&
        !revealedRef.current.has(idx) &&
        lastKeyTimeRef.current != null &&
        performance.now() - lastKeyTimeRef.current > 2400;
      setShowRevealHint(hesitating);
      cursorRef.current?.classList.toggle("typing-cursor-hint", hesitating);
    }, 250);
    return () => clearInterval(id);
  }, [isRecallActive, finished, isReviewMode, snippet, tick]);

  const findCursorTarget = useCallback((idx: number): HTMLSpanElement | null => {
    const tokens = tokensRef.current;
    const refs = charRefs.current;
    if (refs[idx]) return refs[idx];
    if (idx < tokens.length && tokens[idx]?.char === "\n") {
      for (let i = idx + 1; i < tokens.length; i++) {
        if (refs[i]) return refs[i];
      }
    }
    for (let i = idx; i < tokens.length; i++) {
      if (refs[i]) return refs[i];
    }
    for (let i = idx - 1; i >= 0; i--) {
      if (refs[i]) return refs[i];
    }
    return null;
  }, []);

  const scrollActiveLineIntoView = useCallback((lineIndex: number) => {
    const line = lineRefs.current[lineIndex];
    const viewport = viewportRef.current;
    if (!line || !viewport) return;
    const viewportRect = viewport.getBoundingClientRect();
    const lineRect = line.getBoundingClientRect();
    const delta = lineRect.top + lineRect.height / 2 - (viewportRect.top + viewportRect.height / 2);
    if (Math.abs(delta) > 8) {
      viewport.scrollTo({ top: viewport.scrollTop + delta, behavior: "smooth" });
    }
  }, []);

  const focusActiveLine = useCallback(
    (lineIndex: number) => {
      const line = lineRefs.current[lineIndex];
      const viewport = viewportRef.current;
      const linesLayer = linesTransformRef.current;
      if (!line || !viewport || !linesLayer) return;

      if (isReviewMode) {
        scrollActiveLineIntoView(lineIndex);
        return;
      }

      const viewportHeight = viewport.clientHeight;
      const lineTop = line.offsetTop;
      const lineHeight = line.offsetHeight;
      const displayHeight = linesLayer.offsetHeight;
      const totalLines = lineRefs.current.length;
      const topPad = 14;
      const bottomPad = 12;

      const isFirstLine = lineIndex === 0;
      const isLastLine = lineIndex >= totalLines - 1;

      let translateY: number;
      if (isLastLine) {
        translateY = viewportHeight - bottomPad - lineTop - lineHeight;
      } else if (isFirstLine) {
        translateY = topPad - lineTop;
      } else {
        translateY = viewportHeight / 2 - lineTop - lineHeight / 2;
      }

      const lineMinY = topPad - lineTop;
      const lineMaxY = viewportHeight - bottomPad - lineTop - lineHeight;
      translateY = Math.max(lineMinY, Math.min(lineMaxY, translateY));

      const contentMinY = Math.min(0, viewportHeight - displayHeight);
      const contentMaxY = isFirstLine ? Math.max(0, topPad - lineTop) : 0;
      translateY = Math.max(contentMinY, Math.min(contentMaxY, translateY));

      const rounded = Math.round(translateY);
      lineOffsetRef.current = rounded;
      linesLayer.style.transform = `translate3d(0, ${rounded}px, 0)`;
    },
    [isReviewMode, scrollActiveLineIntoView],
  );

  useEffect(() => {
    if (!isReviewMode) return;
    focusActiveLine(reviewLine);
  }, [isReviewMode, reviewLine, focusActiveLine]);

  const updateActiveLine = useCallback(
    (idx: number) => {
      const map = charLineMapRef.current;
      const line = idx < map.length ? map[idx] : Math.max(0, lineRefs.current.length - 1);
      if (line !== activeLineRef.current) {
        if (activeLineRef.current >= 0) {
          lineRefs.current[activeLineRef.current]?.classList.remove("code-line-active");
        }
        lineRefs.current[line]?.classList.add("code-line-active");
        activeLineRef.current = line;
        focusActiveLine(line);
      }
    },
    [focusActiveLine],
  );

  const updateCursor = useCallback(
    (idx: number) => {
      updateActiveLine(idx);
      requestAnimationFrame(() => {
        const cursor = cursorRef.current;
        const target = findCursorTarget(idx);
        if (!cursor || !target || !containerRef.current) return;

        // Keep the trailing/last line pinned before measuring, so lineOffsetRef holds
        // the line's final translateY when we place the caret.
        if (!isReviewMode && lineRefs.current.length > 0) {
          const map = charLineMapRef.current;
          const lineIdx =
            idx < map.length ? map[idx] : Math.max(0, lineRefs.current.length - 1);
          if (lineIdx >= lineRefs.current.length - 1) {
            focusActiveLine(lineIdx);
          }
        }

        // Use static layout offsets (relative to the positioned container) plus the
        // lines layer's final translateY. getBoundingClientRect() would capture the
        // mid-flight value of the 100ms scroll transition and strand the caret
        // between lines; offsets are unaffected by transforms, so the caret lands on
        // the target character's resting position.
        const offsetX = target.offsetLeft;
        const offsetY = target.offsetTop + lineOffsetRef.current;
        cursor.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0)`;
        cursor.style.width = `${Math.max(target.offsetWidth, 2.5)}px`;
        cursor.style.height = `${target.offsetHeight}px`;
      });
    },
    [findCursorTarget, updateActiveLine, isReviewMode, focusActiveLine],
  );

  const autoAdvanceStructural = useCallback(
    (now: number) => {
      const tokens = tokensRef.current;
      while (
        indexRef.current < tokens.length &&
        isStructuralChar(tokens, indexRef.current)
      ) {
        const idx = indexRef.current;
        const el = charRefs.current[idx];
        const ch = tokens[idx].char;
        if (startTimeRef.current != null) {
          keystrokesRef.current.push({
            char: ch === "\n" ? "\n" : " ",
            index: idx,
            correct: true,
            timestamp: now,
            delayMs: 0,
            wasBlank: false,
            autoStructural: true,
          });
        }
        if (el) {
          applyCharTyped(el, idx, tokens, true, blankMaskRef.current);
          el.classList.add("char-structural-auto");
        }
        indexRef.current = idx + 1;
      }
      updateCursor(indexRef.current);
    },
    [updateCursor],
  );

  useEffect(() => {
    if (isReviewMode) return;
    autoAdvanceStructural(performance.now());
    updateCursor(indexRef.current);
    if (lineRefs.current[0]) {
      lineRefs.current[0].classList.add("code-line-active");
      activeLineRef.current = 0;
    }
    if (linesTransformRef.current) {
      linesTransformRef.current.style.transform = "";
    }
    if (viewportRef.current) {
      viewportRef.current.scrollTop = 0;
    }
    requestAnimationFrame(() => {
      focusActiveLine(0);
      // Reposition the caret after the first-line offset transform is applied,
      // otherwise it lands ~topPad px above the first character.
      updateCursor(indexRef.current);
    });
  }, [snippet, tick, updateCursor, isReviewMode, autoAdvanceStructural, focusActiveLine]);

  const refreshStats = useCallback(() => {
    if (!startTimeRef.current) return;
    const elapsed = performance.now() - startTimeRef.current;
    const total = correctRef.current + incorrectRef.current;
    setLiveWpm(calcWpm(correctRef.current, elapsed));
    setLiveAcc(calcAccuracy(correctRef.current, total));
    setLiveMistakes(incorrectRef.current);
    if (isRecallActive) {
      const blankTotal = blankCorrectRef.current + blankIncorrectRef.current;
      const recallAcc =
        blankTotal > 0 ? calcAccuracy(blankCorrectRef.current, blankTotal) : 100;
      setLiveRecallAcc(recallAcc);
      setConfidenceScore(
        Math.round(
          recallAcc * 0.55 +
            Math.max(0, 100 - revealsRef.current * 8) * 0.2 +
            Math.max(0, 100 - blankIncorrectRef.current * 4) * 0.25,
        ),
      );
    }
  }, [isRecallActive]);

  const dismissTypingKeyboard = useCallback(() => {
    inputRef.current?.blur();
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }, []);

  const finishTest = useCallback(() => {
    if (finishedRef.current) return;
    const s = snippetRef.current;
    if (!s || !startTimeRef.current) return;

    const totalStages = snippetStageCount(s);
    if (stageIndexRef.current < totalStages - 1) {
      finishedRef.current = false;
      setFinished(false);
      setStarted(false);
      setLiveWpm(0);
      setLiveAcc(100);
      setLiveRecallAcc(100);
      prepareSnippetStage(s, stageIndexRef.current + 1, useStatsStore.getState().results);
      return;
    }

    finishedRef.current = true;
    const durationMs = performance.now() - startTimeRef.current;
    const total = correctRef.current + incorrectRef.current;
    const stageCode = snippetStageCode(s, stageIndexRef.current);
    const recallMetrics =
      isRecallTraining(trainingModeRef.current)
        ? computeRecallMetrics(
            keystrokesRef.current,
            blankMaskRef.current,
            revealsRef.current,
            stageCode,
          )
        : undefined;
    const wpm = calcWpm(correctRef.current, durationMs);
    const accuracy = calcAccuracy(correctRef.current, total);
    const sprintProfile = resolveSprintProfile(
      useSettingsStore.getState().companyTrack,
      useSettingsStore.getState().careerLevel,
    );
    const sprintMetrics = isSprintTraining(trainingModeRef.current)
      ? computeSprintMetrics(
          keystrokesRef.current,
          stageCode,
          accuracy,
          wpm,
          durationMs,
          incorrectRef.current,
          sprintProfile,
        )
      : undefined;
    const res: TypingResult = {
      id: generateId(),
      snippetId: s.id,
      pattern: s.pattern,
      difficulty: s.difficulty,
      language: s.language,
      wpm,
      rawWpm: calcRawWpm(total, durationMs),
      accuracy,
      durationMs,
      correctChars: correctRef.current,
      incorrectChars: incorrectRef.current,
      totalChars: countCognitiveChars(tokensRef.current),
      timestamp: Date.now(),
      keystrokes: keystrokesRef.current,
      trainingMode: trainingModeRef.current,
      recallMode: recallModeRef.current,
      recallMetrics,
      sprintMetrics,
      deviceClass: deviceClassRef.current,
    };
    setResult(res);
    setFinished(true);
    recordResult(res);
    if (isTouchDeviceClass(deviceClassRef.current)) {
      dismissTypingKeyboard();
      requestAnimationFrame(dismissTypingKeyboard);
    } else {
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [recordResult, dismissTypingKeyboard, prepareSnippetStage]);

  useEffect(() => {
    if (!finished || !isMobileLayout) return;
    dismissTypingKeyboard();
    const timer = window.setTimeout(dismissTypingKeyboard, 50);
    return () => window.clearTimeout(timer);
  }, [finished, isMobileLayout, dismissTypingKeyboard]);

  const ensureStarted = useCallback((now: number) => {
    if (!startTimeRef.current) {
      startTimeRef.current = now;
      lastKeyTimeRef.current = now;
      setStarted(true);
    }
  }, []);

  const revealCurrent = useCallback(() => {
    const idx = indexRef.current;
    if (!blankMaskRef.current[idx] || revealedRef.current.has(idx)) return;
    revealedRef.current.add(idx);
    revealsRef.current++;
    const el = charRefs.current[idx];
    if (el) {
      applyCharPending(
        el,
        idx,
        tokensRef.current,
        indexRef.current,
        blankMaskRef.current,
        revealedRef.current,
      );
    }
    setShowRevealHint(false);
    refreshStats();
  }, [refreshStats]);

  const advanceAutoPair = useCallback(
    (openChar: string, now: number) => {
      if (!settings.autoPairCompletion) return;

      const tokens = tokensRef.current;
      const idx = indexRef.current;
      if (idx >= tokens.length) return;

      const nextExpected = tokens[idx].char;
      if (!shouldAutoCompletePair(openChar, nextExpected)) return;

      const wasBlank = blankMaskRef.current[idx];
      keystrokesRef.current.push({
        char: nextExpected,
        index: idx,
        correct: true,
        timestamp: now,
        delayMs: 0,
        wasBlank,
        autoPair: true,
      });
      if (wasBlank) blankCorrectRef.current++;

      const el = charRefs.current[idx];
      if (el) {
        applyCharTyped(el, idx, tokens, true, blankMaskRef.current);
        flashChar(el, true);
      }
      indexRef.current = idx + 1;
    },
    [settings.autoPairCompletion],
  );

  const typeChar = useCallback(
    (char: string, now: number): boolean => {
      const tokens = tokensRef.current;
      let idx = indexRef.current;
      if (idx >= tokens.length) return false;

      if (isStructuralChar(tokens, idx)) {
        autoAdvanceStructural(now);
        if (indexRef.current >= tokens.length) {
          finishTest();
          return true;
        }
        idx = indexRef.current;
      }

      const expected = tokens[idx].char;
      const correct = char === expected;
      const { soundPack, soundVolume } = useAppearanceStore.getState();
      if (soundPack !== "off") playTypingClick(correct, soundPack, soundVolume);
      const delayMs = lastKeyTimeRef.current ? now - lastKeyTimeRef.current : 0;
      const wasBlank = blankMaskRef.current[idx];
      keystrokesRef.current.push({ char, index: idx, correct, timestamp: now, delayMs, wasBlank });
      if (correct) correctRef.current++;
      else incorrectRef.current++;
      if (wasBlank) {
        if (correct) blankCorrectRef.current++;
        else blankIncorrectRef.current++;
      }
      const el = charRefs.current[idx];
      if (el) {
        applyCharTyped(el, idx, tokens, correct, blankMaskRef.current);
        flashChar(el, correct);
      }
      indexRef.current = idx + 1;
      lastKeyTimeRef.current = now;
      setShowRevealHint(false);

      if (correct) {
        advanceAutoPair(char, now);
        autoAdvanceStructural(now);
      } else {
        updateCursor(idx + 1);
      }

      refreshStats();
      if (indexRef.current >= tokens.length) finishTest();
      return true;
    },
    [finishTest, refreshStats, updateCursor, autoAdvanceStructural, advanceAutoPair],
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (finished) {
        if (e.key === "Escape") {
          e.preventDefault();
          if (finishedCoach) applySuggestedRecallMode(finishedCoach, setRecallMode, setTrainingMode);
          loadSnippet();
        } else if (e.key === "Enter" || (e.key === "Tab" && e.shiftKey)) {
          e.preventDefault();
          if (finishedCoach) applySuggestedRecallMode(finishedCoach, setRecallMode, setTrainingMode);
          loadSnippet(snippetRef.current?.id);
        }
        return;
      }
      if (!snippetRef.current) return;

      if (isReviewMode && reviewAnalytics && handleReviewNavigation(e.nativeEvent)) {
        return;
      }

      if (isSprintMode && sprintPhase === "idle") {
        if (e.key === "Escape") {
          e.preventDefault();
          loadSnippet();
          return;
        }
        if (e.key === "Tab" && e.shiftKey) {
          e.preventDefault();
          loadSnippet(snippetRef.current.id);
          return;
        }
        if (!e.ctrlKey && !e.metaKey && !e.altKey) {
          e.preventDefault();
          startSprintCountdown();
        }
        return;
      }

      if (isSprintMode && sprintPhase === "countdown") {
        e.preventDefault();
        return;
      }

      if (!typingEnabled) {
        if (e.key === "Tab" && e.shiftKey) {
          e.preventDefault();
          loadSnippet(snippetRef.current.id);
        } else if (e.key === "Escape") {
          e.preventDefault();
          loadSnippet();
        }
        return;
      }
      if (e.key === "?") {
        e.preventDefault();
        if (isSprintMode) return;
        ensureStarted(performance.now());
        revealCurrent();
        return;
      }
      if (e.key === "Tab") {
        e.preventDefault();
        if (e.shiftKey) {
          loadSnippet(snippetRef.current.id);
        }
        return;
      }
      if (e.key === "Escape") {
        e.preventDefault();
        loadSnippet();
        return;
      }
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const now = performance.now();
      ensureStarted(now);
      const tokens = tokensRef.current;
      if (e.key === "Backspace") {
        e.preventDefault();
        if (keystrokesRef.current.length === 0) return;
        while (keystrokesRef.current.length > 0) {
          const prevKs = keystrokesRef.current.pop()!;
          const charIdx = prevKs.index;
          if (prevKs.correct && !isAutoKeystroke(prevKs)) correctRef.current--;
          else if (!prevKs.correct && !isAutoKeystroke(prevKs)) incorrectRef.current--;
          if (prevKs.wasBlank) {
            if (prevKs.correct) blankCorrectRef.current--;
            else blankIncorrectRef.current--;
          }
          revealedRef.current.delete(charIdx);
          const el = charRefs.current[charIdx];
          if (el) {
            applyCharPending(el, charIdx, tokens, charIdx, blankMaskRef.current, revealedRef.current);
            el.classList.remove("char-structural-auto", "char-indent-auto");
          }
          indexRef.current = charIdx;
          if (!isAutoKeystroke(prevKs)) break;
        }
        updateCursor(indexRef.current);
        lastKeyTimeRef.current = now;
        refreshStats();
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (isStructuralChar(tokens, indexRef.current)) {
          autoAdvanceStructural(now);
          refreshStats();
          if (indexRef.current >= tokens.length) finishTest();
        }
      } else if (e.key.length === 1) {
        e.preventDefault();
        typeChar(e.key, now);
      }
    },
    [finished, finishedCoach, loadSnippet, updateCursor, ensureStarted, refreshStats, typeChar, revealCurrent, autoAdvanceStructural, finishTest, setRecallMode, setTrainingMode, typingEnabled, isReviewMode, reviewAnalytics, handleReviewNavigation, isSprintMode, sprintPhase, startSprintCountdown],
  );

  const handleMobileNext = useCallback(() => {
    if (finishedCoach) applySuggestedRecallMode(finishedCoach, setRecallMode, setTrainingMode);
    loadSnippet(snippetRef.current?.id);
  }, [finishedCoach, loadSnippet, setRecallMode, setTrainingMode]);

  const handleMobileRetry = useCallback(() => {
    if (finishedCoach) applySuggestedRecallMode(finishedCoach, setRecallMode, setTrainingMode);
    loadSnippet();
  }, [finishedCoach, loadSnippet, setRecallMode, setTrainingMode]);

  const codeLines = useMemo(() => {
    if (!snippet) return [];
    const tokens = tokenizeCode(snippet.code, snippet.language);
    const lines: { tokens: CharToken[]; startIndex: number }[] = [];
    let current: CharToken[] = [];
    let startIndex = 0;
    tokens.forEach((tok, i) => {
      if (tok.char === "\n") {
        lines.push({ tokens: current, startIndex });
        current = [];
        startIndex = i + 1;
      } else {
        current.push(tok);
      }
    });
    if (current.length) lines.push({ tokens: current, startIndex });
    return lines;
  }, [snippet]);

  if (!snippet) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="loader-ring" />
      </div>
    );
  }

  return (
    <div
      id="typing-stage-panel"
      role="tabpanel"
      aria-labelledby={`training-mode-${settings.trainingMode}`}
      className={`flex min-h-0 flex-1 flex-col training-atmosphere-${settings.trainingMode}${isMobileLayout ? " typing-mobile" : ""}`}
    >
      <ProblemHeader
        snippet={snippet}
        started={started}
        finished={finished}
        trainingMode={settings.trainingMode}
        recallMode={activeRecallMode}
        companyTrack={settings.companyTrack}
        careerLevel={settings.careerLevel}
        stageRequirement={snippetStageRequirement(snippet, stageIndex)}
        stageLabel={snippetStageLabel(snippet, stageIndex)}
      />
      <div
        className="typing-stage relative mx-auto flex min-h-0 w-full max-w-4xl flex-1 flex-col px-4 py-4 sm:px-6 sm:py-6"
        onPointerDown={() => {
          if (!finished && typingEnabled) inputRef.current?.focus();
        }}
      >
        {typingEnabled && !isSprintMode && (
          <LiveStats
            wpm={liveWpm}
            accuracy={liveAcc}
            started={started}
            recallAccuracy={liveRecallAcc}
            showRecall={isRecallActive}
            deviceClass={deviceClass}
          />
        )}
        {isSprintMode && (
          <SprintHUD
            phase={sprintPhase}
            countdown={sprintCountdown}
            elapsedMs={sprintElapsed}
            accuracy={liveAcc}
            mistakes={liveMistakes}
          />
        )}
        {isReviewMode && (
          <p className="review-mode-tagline text-center text-sm text-muted">
            Review — consolidate patterns before your next rep
          </p>
        )}
        <RecallConfidence
          score={confidenceScore}
          recallAccuracy={liveRecallAcc}
          visible={(isRecallActive || isSprintMode) && started && sprintPhase === "active"}
          showRevealHint={showRevealHint && !isSprintMode}
        />
        <div
          ref={viewportRef}
          className={clsx("code-viewport mt-6", !isReviewMode && "code-viewport-typing")}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={`${snippet.id}-${settings.trainingMode}-${activeRecallMode}`}
              initial={{ opacity: 0, y: isReviewMode ? 4 : 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: isReviewMode ? -4 : -8 }}
              transition={{
                duration: isReviewMode ? 0.35 : 0.28,
                ease: [0.22, 1, 0.36, 1] as const,
              }}
              onAnimationComplete={(definition) => {
                if (definition !== "exit") resetDisplay();
              }}
            >
              <div
                ref={containerRef}
                className="code-display relative font-mono"
                onClick={() => typingEnabled && !finished && inputRef.current?.focus()}
              >
                <div ref={linesTransformRef} className="code-viewport-lines">
                  {codeLines.map((line, li) => (
                    <div
                      key={li}
                      ref={(el) => {
                        lineRefs.current[li] = el;
                      }}
                      className="code-line flex"
                    >
                      <span className="line-num select-none">{li + 1}</span>
                      <span className="line-content">
                        {line.tokens.map((tok, ti) => {
                          const globalIndex = line.startIndex + ti;
                          return (
                            <span
                              key={globalIndex}
                              ref={(el) => {
                                charRefs.current[globalIndex] = el;
                              }}
                              className="code-char char-pending"
                            />
                          );
                        })}
                      </span>
                    </div>
                  ))}
                </div>
                <span ref={cursorRef} className="typing-cursor" aria-hidden />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        {isReviewMode && reviewAnalytics && (
          <ReviewWorkspace
            snippet={snippet}
            analytics={reviewAnalytics}
            activeLine={reviewLine}
            lineCount={codeLines.length}
            focusedMotif={reviewMotif}
            onLineChange={setReviewLine}
            onMotifFocus={setReviewMotif}
          />
        )}
        <input
          ref={inputRef}
          type="text"
          className="typing-input"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          readOnly={finished && isMobileLayout}
          inputMode={
            finished && isMobileLayout ? "none" : isReviewMode ? "none" : "text"
          }
          tabIndex={
            finished
              ? isMobileLayout
                ? -1
                : 0
              : typingEnabled || isReviewMode
                ? 0
                : -1
          }
          aria-label={typingEnabled ? "Typing input" : "Typing paused in review mode"}
          aria-disabled={!typingEnabled || (finished && isMobileLayout)}
          onKeyDown={handleKeyDown}
        />
      </div>
      <p className="typing-hints-footer hidden shrink-0 md:block">
        {isReviewMode ? (
          <>
            <kbd className="kbd">↑</kbd>/<kbd className="kbd">↓</kbd> lines ·{" "}
            <kbd className="kbd">[</kbd>/<kbd className="kbd">]</kbd> motifs ·{" "}
            <kbd className="kbd">Shift+Tab</kbd> next · <kbd className="kbd">Esc</kbd> restart
          </>
        ) : isSprintMode ? (
          <>
            {sprintPhase === "idle" && "Press any key to start · "}
            {sprintPhase === "active" && (
              <>
                No reveals · <kbd className="kbd">Shift+Tab</kbd> next ·{" "}
              </>
            )}
            <kbd className="kbd">Esc</kbd> restart
          </>
        ) : (
          <>
            Lines flow automatically · <kbd className="kbd">Shift+Tab</kbd> next ·{" "}
            {isRecallActive && (
              <>
                <kbd className="kbd">?</kbd> reveal ·{" "}
              </>
            )}
            <kbd className="kbd">Esc</kbd> restart
          </>
        )}
      </p>
      <MobileActionBar
        visible={isMobileLayout && !finished}
        finished={finished}
        trainingMode={settings.trainingMode}
        reviewLine={reviewLine}
        reviewLineCount={codeLines.length}
        onRetry={handleMobileRetry}
        onNext={handleMobileNext}
        onReviewLinePrev={() => setReviewLine((l) => Math.max(0, l - 1))}
        onReviewLineNext={() =>
          setReviewLine((l) => Math.min(Math.max(0, codeLines.length - 1), l + 1))
        }
      />
      <AnimatePresence>
        {finished && result && !resultsDismissed && (
          <ResultsPanel
            result={result}
            snippet={snippet}
            deviceClass={deviceClass}
            onRetry={handleMobileRetry}
            onNext={handleMobileNext}
            onDismiss={() => setResultsDismissed(true)}
          />
        )}
      </AnimatePresence>
      {finished && result && resultsDismissed && (
        <button
          type="button"
          className="results-reopen-btn"
          onClick={() => setResultsDismissed(false)}
        >
          View results
        </button>
      )}
    </div>
  );
}
