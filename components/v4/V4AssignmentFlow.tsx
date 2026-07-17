"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarClock, BookOpen } from "lucide-react";
import { V4Badge } from "./ui/V4Badge";

interface AssignmentEntry {
  rep: string;
  scenario: string;
  note: string;
  dueDate: string;
  status: "PENDING" | "COMPLETE";
  playbookTitle: string;
  playbookBody: string;
}

const ASSIGNMENTS: AssignmentEntry[] = [
  {
    rep: "Miguel Ortiz",
    scenario: "Price-Focused Objection, Hard",
    note: "Objection handling dropped 14 pts over 3 sessions — run this before Friday.",
    dueDate: "Fri",
    status: "PENDING",
    playbookTitle: "Acknowledge-then-reframe",
    playbookBody: "Never argue the price point directly. Acknowledge the competing quote first, then reframe around what it didn't cover.",
  },
  {
    rep: "Jordan Casey",
    scenario: "Stalling Objection, Easy",
    note: "Closing strength consistently below team floor — start with the easier variant.",
    dueDate: "Mon",
    status: "PENDING",
    playbookTitle: "Name the stall directly",
    playbookBody: "\"We need to think about it\" is rarely about the decision. Name the pattern, then ask what specifically needs more thought.",
  },
  {
    rep: "Priya Nair",
    scenario: "Category Rejection, Realistic",
    note: "Completed — score improved from 71 to 84.",
    dueDate: "Done",
    status: "COMPLETE",
    playbookTitle: "Separate category from offer",
    playbookBody: "A flat 'not interested' is often about the category, not this specific program. Get curious about the source before pushing further.",
  },
];

/**
 * Assignments & Playbooks hero demo: the real Assignment model fields
 * (rep, scenario, note, dueDate, status) paired with the PlaybookEntry it
 * routes to - showing the actual link between "here's what's assigned"
 * and "here's the play behind it," not two disconnected lists.
 */
export function V4AssignmentFlow() {
  const [selected, setSelected] = useState(0);
  const active = ASSIGNMENTS[selected];

  return (
    <div
      className="rounded-xl border overflow-hidden max-w-4xl"
      style={{ borderColor: "var(--v4-border-strong)", background: "var(--v4-bg-raised)" }}
    >
      <div className="flex items-center justify-between px-5 py-3.5 border-b" style={{ borderColor: "var(--v4-border)" }}>
        <span className="text-xs font-medium">Assignment Queue</span>
        <V4Badge status="available" />
      </div>
      <div className="grid md:grid-cols-[280px_1fr]">
        <div className="p-4 space-y-2 border-b md:border-b-0 md:border-r" style={{ borderColor: "var(--v4-border)" }}>
          {ASSIGNMENTS.map((a, i) => (
            <button
              key={a.rep}
              type="button"
              onClick={() => setSelected(i)}
              aria-pressed={i === selected}
              className="w-full text-left rounded-md p-3 transition-colors"
              style={{
                background: i === selected ? "var(--v4-bg-raised-2)" : "transparent",
                border: i === selected ? "1px solid var(--v4-gold-b)" : "1px solid transparent",
                opacity: a.status === "COMPLETE" ? 0.7 : 1,
              }}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium">{a.rep}</span>
                <span className="text-[10px]" style={{ color: a.status === "COMPLETE" ? "var(--v4-green)" : "var(--v4-text-tertiary)" }}>
                  {a.status === "COMPLETE" ? "Done" : a.dueDate}
                </span>
              </div>
              <p className="text-xs mt-1" style={{ color: "var(--v4-text-tertiary)" }}>
                {a.scenario}
              </p>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active.rep}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="p-5 space-y-4"
          >
            <div className="flex items-center gap-2 text-xs" style={{ color: "var(--v4-text-tertiary)" }}>
              <CalendarClock size={13} /> {active.note}
            </div>
            <div className="h-px" style={{ background: "var(--v4-border)" }} />
            <div>
              <p className="text-[11px] uppercase tracking-wide mb-1.5 flex items-center gap-1.5" style={{ color: "var(--v4-text-tertiary)" }}>
                <BookOpen size={12} /> Linked playbook entry
              </p>
              <p className="text-sm font-medium">{active.playbookTitle}</p>
              <p className="text-sm mt-1.5" style={{ color: "var(--v4-text-secondary)" }}>
                {active.playbookBody}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
