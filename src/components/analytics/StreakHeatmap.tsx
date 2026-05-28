"use client";

import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { buildHeatmap, parseLocalDate } from "@/lib/heatmap";
import { useStatsStore } from "@/stores/stats-store";

const LEVEL_CLASS = [
  "heatmap-0",
  "heatmap-1",
  "heatmap-2",
  "heatmap-3",
  "heatmap-4",
];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const TOOLTIP_EDGE_PADDING = 12;

type TooltipState = {
  anchorX: number;
  y: number;
  text: string;
};

function tooltipText(cell: {
  date: string;
  count: number;
  minutes: number;
  avgWpm: number;
  isFuture: boolean;
}): string {
  if (cell.isFuture) return `${cell.date} (upcoming)`;
  if (cell.count === 0) return `No activity on ${cell.date}`;
  return `${cell.count} session${cell.count > 1 ? "s" : ""} · ${cell.minutes.toFixed(1)} min · ${cell.avgWpm} wpm avg`;
}

export function StreakHeatmap() {
  const dailyActivity = useStatsStore((s) => s.dailyActivity);
  const streak = useStatsStore((s) => s.streak);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const [tooltipX, setTooltipX] = useState(0);

  const { weeks, totalActive } = useMemo(
    () => buildHeatmap(dailyActivity),
    [dailyActivity],
  );

  // Keep today (rightmost column) in view by default — when the card is narrow
  // the grid overflows, and otherwise today would be scrolled off-screen.
  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollLeft = el.scrollWidth;
  }, [weeks]);

  const monthLabels = useMemo(() => {
    const labels: { label: string; week: number }[] = [];
    let lastMonth = -1;
    weeks.forEach((week, wi) => {
      const firstDay = week.days.find((d) => d !== null);
      if (!firstDay) return;
      const month = parseLocalDate(firstDay.date).getMonth();
      if (month !== lastMonth) {
        labels.push({ label: MONTHS[month], week: wi });
        lastMonth = month;
      }
    });
    return labels;
  }, [weeks]);

  useLayoutEffect(() => {
    if (!tooltip || !tooltipRef.current) {
      setTooltipX(0);
      return;
    }

    const width = tooltipRef.current.offsetWidth;
    const half = width / 2;
    const minX = TOOLTIP_EDGE_PADDING + half;
    const maxX = window.innerWidth - TOOLTIP_EDGE_PADDING - half;
    setTooltipX(Math.max(minX, Math.min(maxX, tooltip.anchorX)));
  }, [tooltip]);

  const showTooltip = (target: HTMLElement, text: string) => {
    const rect = target.getBoundingClientRect();
    setTooltip({
      anchorX: rect.left + rect.width / 2,
      y: rect.top,
      text,
    });
  };

  return (
    <section className="card">
        <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="card-title">Activity</h2>
          <p className="card-subtitle">GitHub-style consistency tracker</p>
        </div>
        <div className="heatmap-summary flex flex-wrap gap-4 text-sm sm:gap-6">
          <div>
            <span className="text-2xl font-semibold text-accent">{streak.current}</span>
            <span className="ml-1.5 text-muted">day streak</span>
          </div>
          <div>
            <span className="text-2xl font-semibold text-foreground">{streak.longest}</span>
            <span className="ml-1.5 text-muted">best streak</span>
          </div>
          <div>
            <span className="text-2xl font-semibold text-foreground">{totalActive}</span>
            <span className="ml-1.5 text-muted">active days</span>
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="heatmap-wrap mt-6 overflow-x-auto">
        <div className="heatmap-grid min-w-[720px]">
          <div className="heatmap-day-labels">
            {DAYS.map((d, i) => (
              <span key={d} className={i % 2 === 0 ? "opacity-0" : ""}>
                {d}
              </span>
            ))}
          </div>

          <div className="heatmap-body">
            <div className="heatmap-months">
              {monthLabels.map((m) => (
                <span
                  key={`${m.label}-${m.week}`}
                  className="heatmap-month-label"
                  style={{ gridColumnStart: m.week + 1 }}
                >
                  {m.label}
                </span>
              ))}
            </div>

            <div className="heatmap-cells">
              {weeks.map((week, wi) => (
                <div key={wi} className="heatmap-week">
                  {week.days.map((cell, di) =>
                    cell ? (
                      <button
                        key={cell.date}
                        type="button"
                        className={`heatmap-cell ${LEVEL_CLASS[cell.level]}${cell.isFuture ? " heatmap-future" : ""}`}
                        aria-label={`${cell.date}: ${cell.count} sessions`}
                        onMouseEnter={(e) => showTooltip(e.currentTarget, tooltipText(cell))}
                        onMouseLeave={() => setTooltip(null)}
                        onFocus={(e) => showTooltip(e.currentTarget, tooltipText(cell))}
                        onBlur={() => setTooltip(null)}
                      />
                    ) : (
                      <span key={`empty-${wi}-${di}`} className="heatmap-cell heatmap-empty" />
                    ),
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-end gap-2 text-xs text-muted">
        <span>Less</span>
        {LEVEL_CLASS.map((cls) => (
          <span key={cls} className={`heatmap-cell ${cls}`} />
        ))}
        <span>More</span>
      </div>

      {tooltip && (
        <div
          ref={tooltipRef}
          className="heatmap-tooltip"
          style={{ left: tooltipX || tooltip.anchorX, top: tooltip.y - 8 }}
        >
          {tooltip.text}
        </div>
      )}
    </section>
  );
}
