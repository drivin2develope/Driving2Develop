"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform, useReducedMotion, AnimatePresence } from "framer-motion";

const WEEKS = ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8"];
const TEAM_AVG = [58, 60, 63, 65, 68, 70, 72, 73];
const BENCHMARK = [65, 65, 66, 66, 67, 67, 68, 68];

const VB_W = 800;
const VB_H = 280;
const PAD_X = 40;
const PAD_TOP = 20;
const PAD_BOTTOM = 30;
const Y_MIN = 50;
const Y_MAX = 80;

function xFor(i: number) {
  return PAD_X + (i / (WEEKS.length - 1)) * (VB_W - PAD_X * 2);
}
function yFor(v: number) {
  const usable = VB_H - PAD_TOP - PAD_BOTTOM;
  return PAD_TOP + usable * (1 - (v - Y_MIN) / (Y_MAX - Y_MIN));
}
function linePath(values: number[]) {
  return values.map((v, i) => `${i === 0 ? "M" : "L"}${xFor(i)},${yFor(v)}`).join(" ");
}
function areaPath(values: number[]) {
  const line = values.map((v, i) => `${i === 0 ? "M" : "L"}${xFor(i)},${yFor(v)}`).join(" ");
  return `${line} L${xFor(values.length - 1)},${yFor(Y_MIN)} L${xFor(0)},${yFor(Y_MIN)} Z`;
}

/**
 * Signature #5: the team's trend isn't a static screenshot of a chart - the
 * line draws itself in as you scroll to it (same pathLength technique as
 * the Loop, applied to real data this time), and every point is
 * individually inspectable. A manager sees not just "73 today" but the
 * shape of how the team got there relative to a benchmark.
 */
export function V4PerformanceGraph() {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.8", "start 0.25"] });
  const drawLength = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const fillOpacity = useTransform(scrollYProgress, [0.3, 1], [0, 0.12]);

  return (
    <section className="py-24 md:py-32 border-t" style={{ borderColor: "var(--v4-border)" }}>
      <div className="max-w-[1600px] mx-auto px-6 md:px-10">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-12">
          <div>
            <p className="v4-eyebrow mb-3">Organization performance</p>
            <h2 className="text-2xl md:text-[2rem] font-semibold tracking-tight max-w-xl">
              The trend, not just today&apos;s number.
            </h2>
          </div>
          <div className="flex items-center gap-5 text-xs">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: "var(--v4-gold-b)" }} /> Team avg score
            </span>
            <span className="flex items-center gap-1.5" style={{ color: "var(--v4-text-secondary)" }}>
              <span className="w-2.5 h-2.5 rounded-full border" style={{ borderColor: "var(--v4-text-tertiary)" }} /> Org benchmark
            </span>
          </div>
        </div>

        <div ref={ref} className="v4-diagram-node p-6 relative">
          <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className="w-full" role="img" aria-label="Team average score trending from 58 to 73 over eight weeks, against a steady benchmark around 67">
            {[50, 60, 70, 80].map((v) => (
              <line key={v} x1={PAD_X} x2={VB_W - PAD_X} y1={yFor(v)} y2={yFor(v)} stroke="var(--v4-border)" strokeWidth={1} />
            ))}

            <motion.path d={areaPath(TEAM_AVG)} fill="var(--v4-gold-b)" style={{ opacity: reduce ? 0.12 : fillOpacity }} />

            <path d={linePath(BENCHMARK)} fill="none" stroke="var(--v4-text-tertiary)" strokeWidth={1.5} strokeDasharray="4 5" />

            <motion.path
              d={linePath(TEAM_AVG)}
              fill="none"
              stroke="var(--v4-gold-b)"
              strokeWidth={2.5}
              strokeLinecap="round"
              style={{ pathLength: reduce ? 1 : drawLength }}
            />

            {TEAM_AVG.map((v, i) => (
              <g key={i}>
                <circle
                  cx={xFor(i)}
                  cy={yFor(v)}
                  r={hoverIdx === i ? 6 : 4}
                  fill="var(--v4-bg-raised)"
                  stroke="var(--v4-gold-b)"
                  strokeWidth={2}
                  className="transition-all cursor-pointer"
                  onMouseEnter={() => setHoverIdx(i)}
                  onMouseLeave={() => setHoverIdx(null)}
                  onFocus={() => setHoverIdx(i)}
                  onBlur={() => setHoverIdx(null)}
                  tabIndex={0}
                  role="img"
                  aria-label={`${WEEKS[i]}: team average ${v}, benchmark ${BENCHMARK[i]}`}
                />
                <text x={xFor(i)} y={VB_H - 8} textAnchor="middle" fontSize={11} fill="var(--v4-text-tertiary)">
                  {WEEKS[i]}
                </text>
              </g>
            ))}
          </svg>

          <AnimatePresence>
            {hoverIdx !== null && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="absolute pointer-events-none rounded-md border px-3 py-2 text-xs"
                style={{
                  left: `${(xFor(hoverIdx) / VB_W) * 100}%`,
                  top: `${(yFor(TEAM_AVG[hoverIdx]) / VB_H) * 100}%`,
                  transform: "translate(-50%, -140%)",
                  borderColor: "var(--v4-border-strong)",
                  background: "var(--v4-bg-raised-2)",
                }}
              >
                <p className="font-semibold">{WEEKS[hoverIdx]}: {TEAM_AVG[hoverIdx]}</p>
                <p style={{ color: "var(--v4-text-tertiary)" }}>Benchmark: {BENCHMARK[hoverIdx]}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <p className="mt-4 text-xs" style={{ color: "var(--v4-text-tertiary)" }}>
          Illustrative session data. Hover or focus any point for the exact value.
        </p>
      </div>
    </section>
  );
}
