"use client";

import { useEffect, useRef, useState } from "react";

/** Smooth eased number transitions for live stats. */
export function useAnimatedNumber(
  value: number,
  enabled: boolean,
  duration = 260,
): number {
  const [display, setDisplay] = useState(value);
  const fromRef = useRef(value);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) {
      fromRef.current = value;
      setDisplay(value);
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
      return;
    }

    const from = fromRef.current;
    const to = value;
    if (Math.abs(from - to) < 0.01) {
      fromRef.current = to;
      return;
    }

    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      const next = from + (to - from) * eased;
      fromRef.current = next;
      setDisplay(next);
      if (t < 1) frameRef.current = requestAnimationFrame(tick);
      else fromRef.current = to;
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, [value, enabled, duration]);

  return enabled ? display : value;
}

export function formatAnimatedStat(value: number, decimals = 0): string {
  if (decimals === 0) return Math.round(value).toString();
  return value.toFixed(decimals);
}
