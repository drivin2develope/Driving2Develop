"use client";

/**
 * FROZEN HISTORICAL SNAPSHOT - Conversation Intelligence panel V1
 * Exact recovery from commit 65324c4 (components/v4/V4PlatformSection.tsx) -
 * the evidence panel showing the active finding's score as plain text,
 * before it was swapped for the V4ScoreGauge arc visualization in 18d5845.
 */
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, ExternalLink } from "lucide-react";

const TRANSCRIPT = [
  { speaker: "Rep", text: "Hi there, my name is Alex — I'm with the neighborhood solar program.", tag: null as string | null, evidence: null as null | { metric: string; score: number; note: string; drill: string } },
  {
    speaker: "Homeowner",
    text: "We've already got a system quoted, honestly.",
    tag: "Objection detected",
    evidence: { metric: "Objection Handling", score: 86, note: "Acknowledged before reframing", drill: "Price-Focused Objection, Hard" },
  },
  {
    speaker: "Rep",
    text: "Totally fair. Mind if I ask what mattered most in that quote?",
    tag: "Acknowledgment",
    evidence: { metric: "Rapport", score: 91, note: "Open question, no defensiveness", drill: "Discovery Depth, Realistic" },
  },
  { speaker: "Homeowner", text: "Mostly the monthly savings, I guess.", tag: null, evidence: null },
];

const DIMENSIONS = ["Pace & variation", "Filler words", "Talk / listen ratio", "Objection recognition", "Trust trajectory", "Closing strength"];

const DEFAULT_EVIDENCE = { metric: "Objection Handling", score: 86, note: "Acknowledged before reframing", drill: "Price-Focused Objection, Hard" };

export function ConversationIntelligenceV1() {
  const [activeIdx, setActiveIdx] = useState(1);
  const active = TRANSCRIPT[activeIdx]?.evidence ?? DEFAULT_EVIDENCE;

  return (
    <section className="py-24 md:py-32 border-t" style={{ borderColor: "var(--v4-border)" }}>
      <div className="max-w-[1600px] mx-auto px-6 md:px-10">
        <div className="grid lg:grid-cols-[440px_1fr] gap-16 items-start">
          <div className="lg:sticky lg:top-28">
            <p className="v4-eyebrow mb-5">Conversation Intelligence</p>
            <h2 className="text-3xl md:text-[2.5rem] leading-[1.08] font-semibold tracking-tight">
              Every finding traces back to a real moment — never an opaque score.
            </h2>
            <p className="mt-5 text-base" style={{ color: "var(--v4-text-secondary)" }}>
              Transcript-level metrics, acoustic signal, and scenario context are analyzed as one system. Click a
              highlighted line to see the evidence behind it. Each observation carries the exact excerpt, timestamp,
              and a recommended drill — not a number with no explanation.
            </p>
            <ul className="mt-8 space-y-3">
              {DIMENSIONS.map((d) => (
                <li key={d} className="flex items-center gap-2.5 text-sm">
                  <CheckCircle2 size={16} style={{ color: "var(--v4-gold-b)" }} />
                  <span>{d}</span>
                </li>
              ))}
            </ul>
            <a href="#" className="mt-8 inline-flex items-center gap-1.5 text-sm font-semibold group" style={{ color: "var(--v4-gold-b)" }}>
              View conversation intelligence{" "}
              <ExternalLink size={13} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>

          <div className="rounded-xl border overflow-hidden" style={{ borderColor: "var(--v4-border-strong)", background: "var(--v4-bg-raised)" }}>
            <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "var(--v4-border)" }}>
              <span className="text-sm font-medium">Transcript · Session #4471</span>
              <span className="text-xs px-2.5 py-1 rounded-full border" style={{ borderColor: "var(--v4-border-strong)", color: "var(--v4-text-secondary)" }}>
                Available now
              </span>
            </div>
            <div className="grid md:grid-cols-[1fr_260px]">
              <div className="p-6 space-y-5">
                {TRANSCRIPT.map((line, i) => {
                  const clickable = !!line.evidence;
                  const isActive = i === activeIdx;
                  return (
                    <div
                      key={i}
                      className={clickable ? "flex gap-4 cursor-pointer" : "flex gap-4"}
                      onClick={() => clickable && setActiveIdx(i)}
                      role={clickable ? "button" : undefined}
                      tabIndex={clickable ? 0 : undefined}
                      onKeyDown={(e) => {
                        if (clickable && (e.key === "Enter" || e.key === " ")) setActiveIdx(i);
                      }}
                    >
                      <span
                        className="text-xs font-medium w-20 shrink-0 pt-0.5"
                        style={{ color: line.speaker === "Rep" ? "var(--v4-gold-b)" : "var(--v4-text-tertiary)" }}
                      >
                        {line.speaker}
                      </span>
                      <div className="flex-1">
                        <p
                          className="text-sm leading-relaxed rounded px-1 -mx-1 transition-all"
                          style={
                            line.tag
                              ? {
                                  background: isActive ? "color-mix(in srgb, var(--v4-gold-b) 22%, transparent)" : "color-mix(in srgb, var(--v4-red) 16%, transparent)",
                                  outline: isActive ? "1px solid var(--v4-gold-b)" : "none",
                                }
                              : undefined
                          }
                        >
                          {line.text}
                        </p>
                        {line.tag && (
                          <span className="text-[11px] mt-1 inline-block" style={{ color: isActive ? "var(--v4-gold-b)" : "var(--v4-red)" }}>
                            {line.tag} {clickable && !isActive && "· click to inspect"}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="p-6 border-t md:border-t-0 md:border-l space-y-5 overflow-hidden" style={{ borderColor: "var(--v4-border)" }}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active.metric}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <p className="text-[11px] uppercase tracking-wide mb-1" style={{ color: "var(--v4-text-tertiary)" }}>
                      {active.metric}
                    </p>
                    <p className="text-2xl font-semibold tabular-nums">{active.score}</p>
                    <p className="text-xs mt-1" style={{ color: "var(--v4-green)" }}>
                      {active.note}
                    </p>
                  </motion.div>
                </AnimatePresence>
                <div className="h-px" style={{ background: "var(--v4-border)" }} />
                <div>
                  <p className="text-[11px] uppercase tracking-wide mb-1" style={{ color: "var(--v4-text-tertiary)" }}>
                    Recommended drill
                  </p>
                  <p className="text-sm font-medium">{active.drill}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
