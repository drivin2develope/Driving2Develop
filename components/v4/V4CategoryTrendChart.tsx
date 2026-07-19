"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import { V4Reveal } from "./ui/V4Reveal";

interface CategoryTrend {
  label: string;
  value: number;
  delta: number;
}

const CATEGORIES: CategoryTrend[] = [
  { label: "Confidence", value: 77, delta: 7 },
  { label: "Keyword Adherence", value: 81, delta: 6 },
  { label: "Clarity", value: 74, delta: 6 },
  { label: "Closing Strength", value: 65, delta: 5 },
  { label: "Pace Control", value: 69, delta: -2 },
  { label: "Objection Handling", value: 58, delta: -5 },
];

/**
 * Team Analytics hero demo: category-level trend, not per-rep detail (the
 * Manager Dashboard's heat-map already covers per-rep). This answers a
 * different question - "which skill is the team drifting on this month" -
 * and deliberately surfaces the same Objection Handling decline flagged on
 * the Manager Dashboard, so the two pages visibly agree rather than each
 * inventing its own version of "what's wrong."
 */
export function V4CategoryTrendChart() {
  return (
    <div
      className="rounded-xl border overflow-hidden max-w-4xl p-6"
      style={{ borderColor: "var(--v4-border-strong)", background: "var(--v4-bg-raised)" }}
    >
      <div className="flex items-center justify-between mb-6">
        <span className="text-sm font-medium">Team skill averages, this month vs. last</span>
      </div>
      <div className="space-y-4">
        {CATEGORIES.map((c, i) => (
          <V4Reveal key={c.label} index={i} y={10}>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm">{c.label}</span>
                <div className="flex items-center gap-3">
                  <span
                    className="text-xs font-medium flex items-center gap-1"
                    style={{ color: c.delta >= 0 ? "var(--v4-green)" : "var(--v4-red)" }}
                  >
                    {c.delta >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    {c.delta >= 0 ? "+" : ""}
                    {c.delta}
                  </span>
                  <span className="text-sm font-semibold tabular-nums w-8 text-right">{c.value}</span>
                </div>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--v4-border)" }}>
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${c.value}%`, background: c.delta >= 0 ? "var(--v4-gold-b)" : "var(--v4-red)" }}
                />
              </div>
            </div>
          </V4Reveal>
        ))}
      </div>
    </div>
  );
}
