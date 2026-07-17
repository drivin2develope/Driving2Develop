"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, ShieldCheck } from "lucide-react";

interface Flag {
  repName: string;
  label: string;
  detail: string;
  score: number;
  severity: "high" | "medium";
}

const FLAGS: Flag[] = [
  { repName: "Miguel Ortiz", label: "Weak objection handling", detail: "Rebutting before acknowledging — a trust risk on skeptical doors, not just a lost point.", score: 28, severity: "high" },
  { repName: "Jordan Casey", label: "Skipping approved talking points", detail: "Low script adherence — required disclosures may be getting missed, not just off-script phrasing.", score: 46, severity: "medium" },
  { repName: "Priya Nair", label: "Soft or unclear close", detail: "Weak closing pattern — worth coaching toward a specific next step rather than added pressure.", score: 38, severity: "medium" },
];

/**
 * Compliance hero demo: flags are derived from real metric thresholds
 * (objection handling < 45, adherence < 50, closing < 40 -
 * lib/derive.ts's complianceFlags), not keyword-matched phrases. Framed
 * exactly as the real product frames it: coaching signals, not accusations.
 */
export function V4ComplianceFlags() {
  const [selected, setSelected] = useState(0);
  const active = FLAGS[selected];

  return (
    <div
      className="rounded-xl border overflow-hidden max-w-4xl"
      style={{ borderColor: "var(--v4-border-strong)", background: "var(--v4-bg-raised)" }}
    >
      <div className="flex items-center justify-between px-5 py-3.5 border-b" style={{ borderColor: "var(--v4-border)" }}>
        <span className="text-xs font-medium">Open flags</span>
        <span className="text-xs" style={{ color: "var(--v4-text-tertiary)" }}>
          Coaching signals, not accusations
        </span>
      </div>
      <div className="grid md:grid-cols-[280px_1fr]">
        <div className="p-4 space-y-2 border-b md:border-b-0 md:border-r" style={{ borderColor: "var(--v4-border)" }}>
          {FLAGS.map((f, i) => (
            <button
              key={f.repName}
              type="button"
              onClick={() => setSelected(i)}
              aria-pressed={i === selected}
              className="w-full text-left rounded-md p-3 transition-colors"
              style={{
                background: i === selected ? "var(--v4-bg-raised-2)" : "transparent",
                border: i === selected ? "1px solid var(--v4-gold-b)" : "1px solid transparent",
              }}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium">{f.repName}</span>
                <span
                  className="text-[10px] px-2 py-0.5 rounded-full border"
                  style={{
                    color: f.severity === "high" ? "var(--v4-red)" : "var(--v4-gold-b)",
                    borderColor: f.severity === "high" ? "var(--v4-red)" : "var(--v4-gold-b)",
                  }}
                >
                  {f.severity}
                </span>
              </div>
              <p className="text-xs mt-1" style={{ color: "var(--v4-text-tertiary)" }}>
                {f.label}
              </p>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active.repName}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="p-5"
          >
            <AlertTriangle size={18} style={{ color: active.severity === "high" ? "var(--v4-red)" : "var(--v4-gold-b)" }} />
            <p className="text-sm font-medium mt-3">{active.label}</p>
            <p className="text-sm mt-2" style={{ color: "var(--v4-text-secondary)" }}>
              {active.detail}
            </p>
            <div className="h-px my-4" style={{ background: "var(--v4-border)" }} />
            <div className="flex items-center gap-2 text-xs" style={{ color: "var(--v4-text-tertiary)" }}>
              <ShieldCheck size={13} /> Triggered by session score {active.score}, from the rep&apos;s latest session
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
