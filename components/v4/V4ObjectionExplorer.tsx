"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ListChecks, Quote } from "lucide-react";
import { V4Badge } from "./ui/V4Badge";

interface ObjectionEntry {
  title: string;
  category: string;
  difficulty: "EASY" | "REALISTIC" | "HARD";
  whyItHappens: string;
  steps: string[];
  script: string;
}

const OBJECTIONS: ObjectionEntry[] = [
  {
    title: "We already got quotes from two other companies",
    category: "Price-Focused",
    difficulty: "HARD",
    whyItHappens: "The homeowner is anchored to a specific number from a competing quote and is testing whether you'll just discount to match it.",
    steps: ["Acknowledge without conceding on price", "Ask what specifically stood out in those quotes", "Reframe around the criteria the other quotes didn't cover"],
    script: "Totally fair — a lot of homeowners tell me that. Can I ask what stood out about the other two quotes so I'm not repeating what you've already heard?",
  },
  {
    title: "We need to think about it",
    category: "Stalling",
    difficulty: "EASY",
    whyItHappens: "This is rarely about the decision itself — it's a low-friction way to end the conversation without a real objection to defend.",
    steps: ["Name the pattern directly, without pressure", "Ask what specifically needs more thought", "Offer a concrete next step, not a generic follow-up"],
    script: "Totally understand — most people say that when something specific is still unclear. What's the one thing that would make this an easy yes?",
  },
  {
    title: "We're not interested in solar at all",
    category: "Category Rejection",
    difficulty: "REALISTIC",
    whyItHappens: "The homeowner is rejecting the category, not your specific offer — often from a bad experience or misconception, not this pitch.",
    steps: ["Don't argue the rejection — get curious about its source", "Separate the category from this specific program", "Leave the door open without pushing further today"],
    script: "Fair enough — can I ask what's made solar a no for you in the past? I might be able to clear up something, or I might just leave you a card.",
  },
];

/**
 * Objection Intelligence hero demo: select an objection to see the same
 * structured breakdown the real Objection model stores (category,
 * difficulty, why it happens, recommended response steps, example script) -
 * grounded in prisma/schema.prisma's actual Objection fields, not invented.
 */
export function V4ObjectionExplorer() {
  const [selected, setSelected] = useState(0);
  const active = OBJECTIONS[selected];

  return (
    <div
      className="rounded-xl border overflow-hidden max-w-4xl"
      style={{ borderColor: "var(--v4-border-strong)", background: "var(--v4-bg-raised)" }}
    >
      <div className="flex items-center justify-between px-5 py-3.5 border-b" style={{ borderColor: "var(--v4-border)" }}>
        <span className="text-xs font-medium">Objection Library</span>
        <V4Badge status="available" />
      </div>
      <div className="grid md:grid-cols-[220px_1fr]">
        <div className="p-4 space-y-2 border-b md:border-b-0 md:border-r" style={{ borderColor: "var(--v4-border)" }}>
          {OBJECTIONS.map((o, i) => (
            <button
              key={o.title}
              type="button"
              onClick={() => setSelected(i)}
              aria-pressed={i === selected}
              className="w-full text-left rounded-md p-3 transition-colors"
              style={{
                background: i === selected ? "var(--v4-bg-raised-2)" : "transparent",
                border: i === selected ? "1px solid var(--v4-gold-b)" : "1px solid transparent",
              }}
            >
              <p className="text-xs font-medium leading-snug">{o.title}</p>
              <p className="text-[11px] mt-1" style={{ color: "var(--v4-text-tertiary)" }}>
                {o.category}
              </p>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active.title}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="p-5 space-y-4"
          >
            <div>
              <p className="text-[11px] uppercase tracking-wide mb-1" style={{ color: "var(--v4-text-tertiary)" }}>
                Why it happens
              </p>
              <p className="text-sm" style={{ color: "var(--v4-text-secondary)" }}>
                {active.whyItHappens}
              </p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wide mb-2 flex items-center gap-1.5" style={{ color: "var(--v4-text-tertiary)" }}>
                <ListChecks size={12} /> Recommended response
              </p>
              <ol className="space-y-1.5">
                {active.steps.map((s, i) => (
                  <li key={i} className="text-sm flex gap-2.5">
                    <span
                      className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-semibold shrink-0 mt-0.5"
                      style={{ background: "color-mix(in srgb, var(--v4-gold-b) 20%, transparent)", color: "var(--v4-gold-b)" }}
                    >
                      {i + 1}
                    </span>
                    <span style={{ color: "var(--v4-text-secondary)" }}>{s}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div className="rounded-lg border p-3.5" style={{ borderColor: "var(--v4-border)", background: "var(--v4-bg-inset)" }}>
              <p className="text-[11px] uppercase tracking-wide mb-1.5 flex items-center gap-1.5" style={{ color: "var(--v4-text-tertiary)" }}>
                <Quote size={12} /> Example script
              </p>
              <p className="text-sm leading-relaxed">&ldquo;{active.script}&rdquo;</p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
