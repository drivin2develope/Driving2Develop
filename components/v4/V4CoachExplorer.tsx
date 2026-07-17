"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageSquare } from "lucide-react";
import { V4Badge } from "./ui/V4Badge";

interface Metric {
  label: string;
  value: number;
  tip: string;
}

const METRICS: Metric[] = [
  { label: "Objection Handling", value: 58, tip: "Acknowledge first, always — \"totally fair\" before anything else — then reframe with a bridge word and end on a question, not a statement." },
  { label: "Keyword Adherence", value: 64, tip: "You skipped a few required talking points this session — run through your intro, value prop, and close every time, even when the conversation moves fast." },
  { label: "Clarity", value: 71, tip: "Slow down and cut filler words like \"um\" and \"like\" — pause instead of filling the silence." },
  { label: "Closing Strength", value: 79, tip: "You're asking for the close, but softening it right after — state it, then stop talking." },
];

/**
 * AI Coach hero demo: the coach's actual mechanic - pick the lowest-scoring
 * metric, generate its tip from a real dictionary (lib/analysis.ts's
 * TIP_DICTIONARY), not a paragraph of generic encouragement. Sorted
 * lowest-first by default because that's what the real coach does first.
 */
export function V4CoachExplorer() {
  const sorted = [...METRICS].sort((a, b) => a.value - b.value);
  const [selected, setSelected] = useState(0);
  const active = sorted[selected];

  return (
    <div
      className="rounded-xl border overflow-hidden max-w-4xl"
      style={{ borderColor: "var(--v4-border-strong)", background: "var(--v4-bg-raised)" }}
    >
      <div className="flex items-center justify-between px-5 py-3.5 border-b" style={{ borderColor: "var(--v4-border)" }}>
        <span className="text-xs font-medium">Your last session</span>
        <V4Badge status="available" />
      </div>
      <div className="grid md:grid-cols-[1fr_300px]">
        <div className="p-5 space-y-3">
          {sorted.map((m, i) => (
            <button
              key={m.label}
              type="button"
              onClick={() => setSelected(i)}
              aria-pressed={i === selected}
              className="w-full text-left"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm" style={{ color: i === selected ? "var(--v4-text)" : "var(--v4-text-secondary)" }}>
                  {m.label}
                </span>
                <span className="text-sm font-semibold tabular-nums">{m.value}</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--v4-border)" }}>
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${m.value}%`,
                    background: i === selected ? "var(--v4-gold-b)" : "var(--v4-text-tertiary)",
                  }}
                />
              </div>
            </button>
          ))}
        </div>

        <div className="p-5 border-t md:border-t-0 md:border-l" style={{ borderColor: "var(--v4-border)" }}>
          <p className="text-[11px] uppercase tracking-wide mb-2 flex items-center gap-1.5" style={{ color: "var(--v4-text-tertiary)" }}>
            <MessageSquare size={12} /> Coach says
          </p>
          <AnimatePresence mode="wait">
            <motion.p
              key={active.label}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="text-sm leading-relaxed"
            >
              {active.tip}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
