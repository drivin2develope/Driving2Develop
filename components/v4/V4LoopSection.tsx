"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion, type MotionValue } from "framer-motion";
import { Mic, MessageSquareText, FileSearch, GraduationCap, TrendingUp, Building2 } from "lucide-react";

const STAGES = [
  { icon: Mic, label: "Practice", body: "A rep rehearses against an adaptive homeowner before a real door ever opens." },
  { icon: MessageSquareText, label: "Conversation", body: "Every exchange is captured — transcript and acoustic signal together." },
  { icon: FileSearch, label: "Evidence", body: "The conversation is scored across six dimensions, each traceable to its own excerpt." },
  { icon: GraduationCap, label: "Coaching", body: "The lowest-scoring dimension becomes the rep's next targeted drill." },
  { icon: TrendingUp, label: "Improvement", body: "Trend lines show whether the specific gap is actually closing, session over session." },
  { icon: Building2, label: "Org Intelligence", body: "Aggregated across the team, weak points shape what gets assigned next." },
] as const;

const X = [100, 300, 500, 700, 900, 1100];
const Y_MAIN = 120;
const Y_RETURN = 250;
const FORWARD_PATH = X.map((x, i) => `${i === 0 ? "M" : "L"}${x},${Y_MAIN}`).join(" ");
const RETURN_PATH = `M${X[5]},${Y_MAIN} C${X[5]},${Y_RETURN - 40} ${X[5]},${Y_RETURN} ${X[5] - 100},${Y_RETURN} L${X[0] + 100},${Y_RETURN} C${X[0]},${Y_RETURN} ${X[0]},${Y_RETURN - 40} ${X[0]},${Y_MAIN}`;

function StageNode({ x, active }: { x: number; active: MotionValue<number> }) {
  const scale = useTransform(active, [0, 1], [0.7, 1]);
  const opacity = useTransform(active, [0, 1], [0.35, 1]);
  return <motion.circle cx={x} cy={Y_MAIN} r={9} fill="var(--v4-gold-b)" style={{ scale, opacity }} />;
}

function StaticNode({ x }: { x: number }) {
  return <circle cx={x} cy={Y_MAIN} r={9} fill="var(--v4-gold-b)" />;
}

/**
 * Signature visual: the practice -> conversation -> evidence -> coaching ->
 * improvement -> org intelligence loop, drawn as a scroll-scrubbed path
 * rather than a static diagram. The loop draws itself as you scroll through
 * it and closes with a return curve back to the first stage - the one
 * visual idea in the system that isn't a card grid.
 */
export function V4LoopSection() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.75", "end 0.4"] });

  const forwardLength = useTransform(scrollYProgress, [0, 0.65], [0, 1]);
  const returnLength = useTransform(scrollYProgress, [0.65, 1], [0, 1]);

  // Six fixed hook calls (not a .map() of hooks) - one activation window per stage.
  const active0 = useTransform(scrollYProgress, [0, 0.13], [0, 1]);
  const active1 = useTransform(scrollYProgress, [0.12, 0.25], [0, 1]);
  const active2 = useTransform(scrollYProgress, [0.24, 0.38], [0, 1]);
  const active3 = useTransform(scrollYProgress, [0.37, 0.5], [0, 1]);
  const active4 = useTransform(scrollYProgress, [0.49, 0.62], [0, 1]);
  const active5 = useTransform(scrollYProgress, [0.6, 0.72], [0, 1]);
  const nodeActive = [active0, active1, active2, active3, active4, active5];

  return (
    <section ref={ref} className="border-t py-24 md:py-32" style={{ borderColor: "var(--v4-border)" }}>
      <div className="max-w-[1600px] mx-auto px-6 md:px-10">
        <p className="v4-eyebrow mb-3 text-center">The core loop</p>
        <h2 className="text-2xl md:text-[2rem] font-semibold tracking-tight text-center max-w-2xl mx-auto mb-16">
          Every feature feeds the same cycle. Nothing here is an isolated screen.
        </h2>

        <div className="relative">
          <svg viewBox="0 0 1200 300" className="w-full" aria-hidden="true">
            <path d={FORWARD_PATH} fill="none" stroke="var(--v4-border-strong)" strokeWidth={2} />
            <path d={RETURN_PATH} fill="none" stroke="var(--v4-border-strong)" strokeWidth={2} strokeDasharray="4 6" />
            {reduce ? (
              <>
                <path d={FORWARD_PATH} fill="none" stroke="var(--v4-gold-b)" strokeWidth={2.5} strokeLinecap="round" />
                <path d={RETURN_PATH} fill="none" stroke="var(--v4-gold-b)" strokeWidth={2.5} strokeLinecap="round" strokeDasharray="4 6" />
                {X.map((x) => (
                  <StaticNode key={x} x={x} />
                ))}
              </>
            ) : (
              <>
                <motion.path
                  d={FORWARD_PATH}
                  fill="none"
                  stroke="var(--v4-gold-b)"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  style={{ pathLength: forwardLength }}
                />
                <motion.path
                  d={RETURN_PATH}
                  fill="none"
                  stroke="var(--v4-gold-b)"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  strokeDasharray="4 6"
                  style={{ pathLength: returnLength }}
                />
                {X.map((x, i) => (
                  <StageNode key={x} x={x} active={nodeActive[i]} />
                ))}
              </>
            )}
          </svg>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-6 -mt-4 md:mt-4">
            {STAGES.map((s) => (
              <div key={s.label} className="text-center px-1">
                <s.icon size={18} style={{ color: "var(--v4-gold-b)" }} className="mx-auto" />
                <p className="text-sm font-medium mt-2">{s.label}</p>
                <p className="text-xs mt-1.5" style={{ color: "var(--v4-text-secondary)" }}>
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
