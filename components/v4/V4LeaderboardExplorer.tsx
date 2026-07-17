"use client";

import { useState } from "react";
import { Trophy, TrendingUp, Flame } from "lucide-react";

interface Rep {
  name: string;
  bestScore: number;
  improvement: number;
  streak: number;
}

const REPS: Rep[] = [
  { name: "Alex Reyes", bestScore: 91, improvement: 4, streak: 12 },
  { name: "Sam Torres", bestScore: 85, improvement: 9, streak: 6 },
  { name: "Dana Kim", bestScore: 77, improvement: 2, streak: 3 },
  { name: "Priya Nair", bestScore: 74, improvement: 11, streak: 2 },
  { name: "Jordan Casey", bestScore: 63, improvement: -3, streak: 0 },
  { name: "Miguel Ortiz", bestScore: 59, improvement: 1, streak: 1 },
];

const TABS = [
  { key: "score", label: "Highest Score", icon: Trophy, sort: (a: Rep, b: Rep) => b.bestScore - a.bestScore, value: (r: Rep) => `${r.bestScore}` },
  { key: "improved", label: "Most Improved", icon: TrendingUp, sort: (a: Rep, b: Rep) => b.improvement - a.improvement, value: (r: Rep) => `${r.improvement >= 0 ? "+" : ""}${r.improvement}` },
  { key: "streak", label: "Longest Streak", icon: Flame, sort: (a: Rep, b: Rep) => b.streak - a.streak, value: (r: Rep) => `${r.streak}d` },
] as const;

/**
 * Leaderboard hero demo: the same three real ranking views the product
 * ships (highest score, most improved over 7 days, longest daily streak),
 * scoped to a peer group - reuses the exact rep roster from the Manager
 * Intelligence Map so the two pages agree on who's who.
 */
export function V4LeaderboardExplorer() {
  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("score");
  const active = TABS.find((t) => t.key === tab)!;
  const ranked = [...REPS].sort(active.sort);

  return (
    <div
      className="rounded-xl border overflow-hidden max-w-4xl"
      style={{ borderColor: "var(--v4-border-strong)", background: "var(--v4-bg-raised)" }}
    >
      <div className="flex items-center gap-1 px-3 py-3 border-b" style={{ borderColor: "var(--v4-border)" }}>
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            aria-pressed={tab === t.key}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors"
            style={{
              background: tab === t.key ? "var(--v4-bg-raised-2)" : "transparent",
              color: tab === t.key ? "var(--v4-gold-b)" : "var(--v4-text-secondary)",
            }}
          >
            <t.icon size={13} /> {t.label}
          </button>
        ))}
      </div>
      <div className="p-4 space-y-1.5">
        {ranked.map((r, i) => (
          <div key={r.name} className="flex items-center gap-3 px-2 py-2 rounded-md" style={{ background: i === 0 ? "color-mix(in srgb, var(--v4-gold-b) 10%, transparent)" : "transparent" }}>
            <span
              className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold shrink-0"
              style={{
                background: i === 0 ? "var(--v4-gold-b)" : "var(--v4-border)",
                color: i === 0 ? "var(--v4-gold-ink)" : "var(--v4-text-secondary)",
              }}
            >
              {i + 1}
            </span>
            <span className="text-sm flex-1">{r.name}</span>
            <span className="text-sm font-semibold tabular-nums" style={{ color: i === 0 ? "var(--v4-gold-b)" : "var(--v4-text)" }}>
              {active.value(r)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
