"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot } from "lucide-react";

interface Suggestion {
  question: string;
  answer: string[];
}

const SUGGESTIONS: Suggestion[] = [
  {
    question: "Who needs attention?",
    answer: ["These reps are lowest right now:", "• Miguel Ortiz — 59 pts", "• Jordan Casey — 63 pts", "Consider assigning a targeted drill from their weakest area."],
  },
  {
    question: "What's the team's weakest skill?",
    answer: ["Across all recent sessions, the team's lowest area is:", "• Objection Handling — 58/100", "Good candidate for the next team huddle."],
  },
  {
    question: "Who's improving fastest?",
    answer: ["Priya Nair has the biggest 7-day jump (+11 pts).", "Worth recognizing publicly — it reinforces the habit."],
  },
  {
    question: "Any compliance flags?",
    answer: ["There are 3 open flags.", "• Miguel Ortiz: Weak objection handling (28)", "Open the Compliance page for the full list."],
  },
];

/**
 * Manager Copilot hero demo: the real suggestion-chip Q&A pattern from
 * app/(app)/manager/copilot - tap a question, get a rule-based answer
 * computed from real roster/session data, not a freeform chat input.
 */
export function V4CopilotChat() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <div
      className="rounded-xl border overflow-hidden max-w-4xl"
      style={{ borderColor: "var(--v4-border-strong)", background: "var(--v4-bg-raised)" }}
    >
      <div className="flex items-center gap-2.5 px-5 py-3.5 border-b" style={{ borderColor: "var(--v4-border)" }}>
        <Bot size={16} style={{ color: "var(--v4-gold-b)" }} />
        <span className="text-sm">
          Hi — I&apos;ve got a read on your 6-rep team. Ask me who needs attention, your weakest skill, or what to assign.
        </span>
      </div>
      <div className="p-5">
        <div className="flex flex-wrap gap-2 mb-4">
          {SUGGESTIONS.map((s, i) => (
            <button
              key={s.question}
              type="button"
              onClick={() => setActive(active === i ? null : i)}
              aria-pressed={active === i}
              className="text-xs px-3 py-1.5 rounded-full border transition-colors"
              style={{
                borderColor: active === i ? "var(--v4-gold-b)" : "var(--v4-border-strong)",
                color: active === i ? "var(--v4-gold-b)" : "var(--v4-text-secondary)",
              }}
            >
              {s.question}
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          {active !== null && (
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="rounded-lg border p-4 space-y-1"
              style={{ borderColor: "var(--v4-border)", background: "var(--v4-bg-inset)" }}
            >
              {SUGGESTIONS[active].answer.map((line, i) => (
                <p key={i} className="text-sm" style={{ color: i === 0 ? "var(--v4-text)" : "var(--v4-text-secondary)" }}>
                  {line}
                </p>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
