"use client";

import { useCallback, useRef, type KeyboardEvent } from "react";
import clsx from "clsx";
import { TRAINING_MODES } from "@/lib/training-mode";
import type { TrainingMode } from "@/lib/types";
import { useSettingsStore } from "@/stores/settings-store";

interface TrainingModeToggleProps {
  variant?: "segment" | "menu";
  onSelect?: () => void;
}

export function TrainingModeToggle({ variant = "segment", onSelect }: TrainingModeToggleProps) {
  const trainingMode = useSettingsStore((s) => s.trainingMode);
  const setTrainingMode = useSettingsStore((s) => s.setTrainingMode);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const focusTab = useCallback((index: number) => {
    tabRefs.current[index]?.focus();
  }, []);

  const selectMode = useCallback(
    (mode: TrainingMode, index: number) => {
      const entry = TRAINING_MODES.find((m) => m.id === mode);
      if (!entry?.available) return;
      setTrainingMode(mode);
      if (variant === "segment") focusTab(index);
      onSelect?.();
    },
    [setTrainingMode, focusTab, variant, onSelect],
  );

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    const available = TRAINING_MODES.filter((m) => m.available);
    const currentAvailIndex = available.findIndex((m) => m.id === trainingMode);
    let nextIndex = currentAvailIndex;

    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      nextIndex = (currentAvailIndex + 1) % available.length;
      selectMode(available[nextIndex].id, TRAINING_MODES.findIndex((m) => m.id === available[nextIndex].id));
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      nextIndex = (currentAvailIndex - 1 + available.length) % available.length;
      selectMode(available[nextIndex].id, TRAINING_MODES.findIndex((m) => m.id === available[nextIndex].id));
    } else if (e.key === "Home") {
      e.preventDefault();
      selectMode(available[0].id, TRAINING_MODES.findIndex((m) => m.id === available[0].id));
    } else if (e.key === "End") {
      e.preventDefault();
      const last = available[available.length - 1];
      selectMode(last.id, TRAINING_MODES.findIndex((m) => m.id === last.id));
    }
  };

  const isMenu = variant === "menu";

  return (
    <div
      className={clsx(isMenu ? "mode-segment-menu" : "mode-segment")}
      role="tablist"
      aria-label="Training mode"
    >
      {TRAINING_MODES.map((mode, index) => {
        const active = trainingMode === mode.id;
        const disabled = !mode.available;

        return (
          <button
            key={mode.id}
            ref={(el) => {
              tabRefs.current[index] = el;
            }}
            type="button"
            role="tab"
            id={isMenu ? `training-mode-menu-${mode.id}` : `training-mode-${mode.id}`}
            aria-selected={active}
            aria-controls="typing-stage-panel"
            aria-disabled={disabled}
            disabled={disabled}
            title={mode.description}
            tabIndex={active ? 0 : -1}
            className={clsx(
              isMenu ? "mode-segment-menu-btn" : "mode-segment-btn",
              active && (isMenu ? "mode-segment-menu-btn-active" : "mode-segment-btn-active"),
              disabled && "mode-segment-btn-disabled",
            )}
            onClick={() => selectMode(mode.id, index)}
            onKeyDown={(e) => onKeyDown(e)}
          >
            {mode.label}
            {disabled && <span className="mode-soon-badge">Soon</span>}
          </button>
        );
      })}
    </div>
  );
}
