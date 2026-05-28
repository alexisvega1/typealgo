import type { DailyActivity } from "./types";

export interface HeatmapCell {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
  minutes: number;
  avgWpm: number;
  isFuture: boolean;
}

export interface HeatmapWeek {
  days: (HeatmapCell | null)[];
}

const WEEKS = 52;

/** Local calendar date as YYYY-MM-DD (avoids UTC drift from toISOString). */
export function localDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Parse a YYYY-MM-DD key as local midnight. */
export function parseLocalDate(key: string): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function addDays(d: Date, n: number): Date {
  const next = new Date(d);
  next.setDate(next.getDate() + n);
  return next;
}

function levelFromCount(count: number): 0 | 1 | 2 | 3 | 4 {
  if (count === 0) return 0;
  if (count === 1) return 1;
  if (count <= 3) return 2;
  if (count <= 6) return 3;
  return 4;
}

export function buildHeatmap(
  activity: Record<string, DailyActivity>,
  endDate = new Date(),
): { weeks: HeatmapWeek[]; maxCount: number; totalActive: number } {
  const today = new Date(endDate);
  today.setHours(0, 0, 0, 0);

  // GitHub-style: rightmost column is the current week; today is always visible.
  const gridEnd = addDays(today, 6 - today.getDay());
  const gridStart = addDays(gridEnd, -(WEEKS * 7 - 1));
  const rangeStart = addDays(today, -(WEEKS * 7 - 1));

  const weeks: HeatmapWeek[] = [];
  let maxCount = 0;
  let totalActive = 0;

  for (let w = 0; w < WEEKS; w++) {
    const days: (HeatmapCell | null)[] = [];
    for (let d = 0; d < 7; d++) {
      const cellDate = addDays(gridStart, w * 7 + d);
      if (cellDate < rangeStart) {
        days.push(null);
        continue;
      }

      const isFuture = cellDate > today;
      const key = localDateKey(cellDate);
      const day = activity[key];
      const count = isFuture ? 0 : (day?.sessions ?? 0);
      maxCount = Math.max(maxCount, count);
      if (count > 0) totalActive++;

      days.push({
        date: key,
        count,
        level: levelFromCount(count),
        minutes: day?.minutes ?? 0,
        avgWpm: day?.avgWpm ?? 0,
        isFuture,
      });
    }
    weeks.push({ days });
  }

  return { weeks, maxCount, totalActive };
}

export function computeStreak(activity: Record<string, DailyActivity>): {
  current: number;
  longest: number;
  lastActive: string | null;
} {
  const dates = Object.keys(activity)
    .filter((d) => activity[d].sessions > 0)
    .sort();

  if (dates.length === 0) return { current: 0, longest: 0, lastActive: null };

  let longest = 0;
  let run = 1;

  for (let i = 1; i < dates.length; i++) {
    const prev = parseLocalDate(dates[i - 1]);
    const cur = parseLocalDate(dates[i]);
    const diff = (cur.getTime() - prev.getTime()) / 86400000;
    if (diff === 1) {
      run++;
    } else {
      longest = Math.max(longest, run);
      run = 1;
    }
  }
  longest = Math.max(longest, run);

  const today = localDateKey(new Date());
  const yesterday = localDateKey(addDays(new Date(), -1));
  const lastActive = dates[dates.length - 1];

  let current = 0;
  if (lastActive === today || lastActive === yesterday) {
    current = 1;
    for (let i = dates.length - 2; i >= 0; i--) {
      const prev = parseLocalDate(dates[i]);
      const cur = parseLocalDate(dates[i + 1]);
      const diff = (cur.getTime() - prev.getTime()) / 86400000;
      if (diff === 1) current++;
      else break;
    }
  }

  return { current, longest, lastActive };
}
