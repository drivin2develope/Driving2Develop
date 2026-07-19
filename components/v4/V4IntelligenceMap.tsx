"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { AnimatePresence } from "framer-motion";

interface RepNode {
  name: string;
  initials: string;
  score: number;
  weakest: string;
  sessions: number;
  flagged: boolean;
}

const REPS: RepNode[] = [
  { name: "Jordan Casey", initials: "JC", score: 63, weakest: "Objection Handling", sessions: 6, flagged: true },
  { name: "Priya Nair", initials: "PN", score: 74, weakest: "Closing Strength", sessions: 9, flagged: true },
  { name: "Miguel Ortiz", initials: "MO", score: 59, weakest: "Discovery", sessions: 1, flagged: true },
  { name: "Sam Torres", initials: "ST", score: 85, weakest: "Pace Control", sessions: 12, flagged: false },
  { name: "Alex Reyes", initials: "AR", score: 91, weakest: "Talk/Listen Ratio", sessions: 15, flagged: false },
  { name: "Dana Kim", initials: "DK", score: 77, weakest: "Value Proposition", sessions: 7, flagged: false },
];

const CX = 50;
const CY = 48;
const NODE_RADIUS_PCT = 36;

function scoreColor(score: number) {
  if (score >= 75) return "var(--v4-green)";
  if (score >= 60) return "var(--v4-gold-b)";
  return "var(--v4-red)";
}

function nodePosition(i: number, total: number) {
  const angle = (360 / total) * i - 90;
  const rad = (angle * Math.PI) / 180;
  return { x: CX + NODE_RADIUS_PCT * Math.cos(rad), y: CY + NODE_RADIUS_PCT * Math.sin(rad) };
}

/**
 * Signature #4: a relational map of the team, not another flat table. The
 * manager sits at the center; each rep is a node whose ring visualizes their
 * score, distance from center is uniform (this isn't a scatter plot) but
 * position is fixed so a manager builds spatial memory of "who's where"
 * over repeated visits - the same reason org charts and seating maps work
 * better than lists for a fixed group of people.
 */
export function V4IntelligenceMap() {
  const [selected, setSelected] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.8", "start 0.2"] });
  const lineLength = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const active = REPS[selected];
  const teamAvg = Math.round(REPS.reduce((sum, r) => sum + r.score, 0) / REPS.length);

  return (
    <section className="py-24 md:py-32 border-t" style={{ borderColor: "var(--v4-border)" }}>
      <div className="max-w-[1600px] mx-auto px-6 md:px-10">
        <p className="v4-eyebrow mb-3 text-center">Manager Intelligence Map</p>
        <h2 className="text-2xl md:text-[2rem] font-semibold tracking-tight text-center max-w-2xl mx-auto mb-16">
          The whole team, at a glance — not a table you have to scroll.
        </h2>

        <div className="grid lg:grid-cols-[1fr_320px] gap-10 items-center">
          <div ref={ref} className="relative aspect-square max-w-[520px] mx-auto w-full">
            <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full" aria-hidden="true">
              {REPS.map((rep, i) => {
                const pos = nodePosition(i, REPS.length);
                return (
                  <motion.line
                    key={rep.name}
                    x1={CX}
                    y1={CY}
                    x2={pos.x}
                    y2={pos.y}
                    stroke={i === selected ? "var(--v4-gold-b)" : "var(--v4-border-strong)"}
                    strokeWidth={i === selected ? 0.6 : 0.4}
                    style={{ pathLength: reduce ? 1 : lineLength }}
                  />
                );
              })}
            </svg>

            <div
              className="absolute rounded-full border flex flex-col items-center justify-center"
              style={{
                left: `${CX}%`,
                top: `${CY}%`,
                transform: "translate(-50%, -50%)",
                width: "22%",
                height: "22%",
                borderColor: "var(--v4-border-strong)",
                background: "var(--v4-bg-raised-2)",
              }}
            >
              <p className="text-lg font-semibold tabular-nums">{teamAvg}</p>
              <p className="text-[9px] uppercase tracking-wide" style={{ color: "var(--v4-text-tertiary)" }}>
                Team
              </p>
            </div>

            {REPS.map((rep, i) => {
              const pos = nodePosition(i, REPS.length);
              const isSelected = i === selected;
              return (
                <button
                  key={rep.name}
                  type="button"
                  onClick={() => setSelected(i)}
                  aria-label={`${rep.initials}: ${rep.name}, score ${rep.score}${rep.flagged ? ", needs attention" : ""}`}
                  aria-pressed={isSelected}
                  className="absolute rounded-full flex items-center justify-center transition-transform hover:scale-110"
                  style={{
                    left: `${pos.x}%`,
                    top: `${pos.y}%`,
                    transform: "translate(-50%, -50%)",
                    width: "15%",
                    height: "15%",
                    background: `conic-gradient(${scoreColor(rep.score)} ${rep.score * 3.6}deg, var(--v4-border) 0deg)`,
                    padding: 3,
                    boxShadow: isSelected ? `0 0 0 2px var(--v4-bg-raised), 0 0 0 4px var(--v4-gold-b)` : "none",
                  }}
                >
                  <span
                    className="w-full h-full rounded-full flex items-center justify-center text-[11px] font-semibold relative"
                    style={{ background: "var(--v4-bg-raised)" }}
                  >
                    {rep.initials}
                    {rep.flagged && (
                      <span
                        className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full"
                        style={{ background: "var(--v4-red)" }}
                        aria-hidden="true"
                      />
                    )}
                  </span>
                </button>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={active.name}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="v4-diagram-node p-6"
            >
              <div className="flex items-center justify-between">
                <p className="font-medium">{active.name}</p>
                {active.flagged && (
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ color: "var(--v4-red)", border: "1px solid var(--v4-red)" }}>
                    Needs attention
                  </span>
                )}
              </div>
              <p className="text-3xl font-semibold tabular-nums mt-3">{active.score}</p>
              <p className="text-xs mt-1" style={{ color: "var(--v4-text-tertiary)" }}>
                Overall score
              </p>
              <div className="h-px my-4" style={{ background: "var(--v4-border)" }} />
              <p className="text-xs uppercase tracking-wide mb-1" style={{ color: "var(--v4-text-tertiary)" }}>
                Weakest skill
              </p>
              <p className="text-sm font-medium">{active.weakest}</p>
              <p className="text-xs mt-4" style={{ color: "var(--v4-text-secondary)" }}>
                {active.sessions} scored sessions this quarter.
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
