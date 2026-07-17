"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion, animate } from "framer-motion";
import { ArrowUpRight, Circle } from "lucide-react";

const BASE_BAR_HEIGHTS = [
  22, 40, 30, 55, 70, 45, 60, 80, 50, 35, 65, 90, 55, 40, 30, 60, 75, 45, 55, 85, 60, 40, 25, 50, 70, 55, 35, 60, 80, 45,
  30, 55, 65, 40, 50, 75, 60, 35, 45, 20,
];

const METRICS: { label: string; value: number; suffix: string }[] = [
  { label: "Pace", value: 142, suffix: " wpm" },
  { label: "Filler Words", value: 2, suffix: "" },
  { label: "Objection Handling", value: 88, suffix: "" },
  { label: "Trust", value: 61, suffix: " / 100" },
];

function CountUpMetric({ label, value, suffix }: { label: string; value: number; suffix: string }) {
  const [display, setDisplay] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) {
      setDisplay(value);
      return;
    }
    const controls = animate(0, value, {
      duration: 1.1,
      delay: 0.2,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [value, reduce]);

  return (
    <div>
      <p className="text-[11px] uppercase tracking-wide" style={{ color: "var(--v4-text-tertiary)" }}>
        {label}
      </p>
      <p className="text-lg font-semibold tabular-nums mt-0.5">
        {display}
        {suffix}
      </p>
    </div>
  );
}

function LiveWaveform() {
  const [heights, setHeights] = useState(BASE_BAR_HEIGHTS);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const interval = setInterval(() => {
      setHeights((prev) => prev.map((h, i) => Math.max(15, Math.min(95, h + (Math.sin(Date.now() / 400 + i) * 8)))));
    }, 220);
    return () => clearInterval(interval);
  }, [reduce]);

  return (
    <div className="flex items-end gap-[3px] h-16" aria-hidden="true">
      {heights.map((h, i) => (
        <div
          key={i}
          className="flex-1 rounded-sm transition-all duration-200 ease-out"
          style={{ height: `${h}%`, background: "var(--v4-gold-b)", opacity: 0.35 + (i % 5) * 0.13 }}
        />
      ))}
    </div>
  );
}

export function V4Hero() {
  return (
    <section className="relative overflow-hidden" style={{ background: "var(--v4-bg)" }}>
      <div className="absolute inset-0 v4-grid-bg opacity-[0.35]" aria-hidden="true" />
      <div
        className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full blur-[120px] opacity-20"
        style={{ background: "var(--v4-gold-b)" }}
        aria-hidden="true"
      />
      <div className="relative max-w-[1600px] mx-auto px-6 md:px-10 pt-20 pb-24 md:pt-28 md:pb-32">
        <div className="grid lg:grid-cols-[minmax(0,460px)_1fr] gap-14 lg:gap-10 items-center">
          {/* Copy */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="v4-eyebrow mb-5">Performance intelligence for field sales</p>
            <h1 className="text-[2.6rem] leading-[1.05] md:text-[3.4rem] md:leading-[1.03] font-semibold tracking-tight">
              The performance intelligence system for field sales.
            </h1>
            <p className="mt-6 text-base md:text-lg max-w-md" style={{ color: "var(--v4-text-secondary)" }}>
              Rehearse difficult conversations. Measure the behaviors that determine outcomes. Convert every session
              into a precise next action — for the rep, the manager, and the organization.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <a href="#" className="v4-gold-fill inline-flex items-center gap-2 rounded-md px-6 py-3.5 text-sm font-semibold transition-transform hover:scale-[1.02]">
                Request Pilot <ArrowUpRight size={15} />
              </a>
              <a
                href="#"
                className="inline-flex items-center gap-2 rounded-md px-6 py-3.5 text-sm font-medium border transition-colors"
                style={{ borderColor: "var(--v4-border-strong)", color: "var(--v4-text)" }}
              >
                See How It Works
              </a>
            </div>
            <p className="mt-6 text-xs" style={{ color: "var(--v4-text-tertiary)" }}>
              No credit card required · Product preview shown below uses illustrative session data
            </p>
          </motion.div>

          {/* Product demo panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-xl border overflow-hidden"
            style={{ borderColor: "var(--v4-border-strong)", background: "var(--v4-bg-raised)" }}
          >
            <div className="flex items-center justify-between px-5 py-3.5 border-b" style={{ borderColor: "var(--v4-border)" }}>
              <div className="flex items-center gap-2.5">
                <Circle size={8} fill="var(--v4-red)" stroke="none" className="animate-pulse" />
                <span className="text-xs font-medium">Live Roleplay</span>
                <span className="text-xs" style={{ color: "var(--v4-text-tertiary)" }}>
                  Solar · Skeptical · Hard
                </span>
              </div>
              <span className="text-xs tabular-nums" style={{ color: "var(--v4-text-tertiary)" }}>
                02:41
              </span>
            </div>

            <div className="grid md:grid-cols-[1fr_220px]">
              <div className="p-5 space-y-4">
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--v4-border)", background: "var(--v4-bg-inset)" }}>
                  <p className="v4-eyebrow mb-1.5 opacity-80">Homeowner · skeptical</p>
                  <p className="text-sm leading-relaxed">
                    &ldquo;We already got quotes from two other companies. Honestly, this feels like a lot to take in
                    right now.&rdquo;
                  </p>
                </div>
                <LiveWaveform />
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--v4-border)", background: "var(--v4-bg-inset)" }}>
                  <p className="v4-eyebrow mb-1.5 opacity-80">You</p>
                  <p className="text-sm leading-relaxed">
                    Totally fair — a lot of homeowners tell me that. Can I ask what stood out about the other two
                    quotes so I&apos;m not repeating what you&apos;ve already heard?
                  </p>
                </div>
              </div>

              <div
                className="p-5 border-t md:border-t-0 md:border-l space-y-4"
                style={{ borderColor: "var(--v4-border)" }}
              >
                {METRICS.map((m) => (
                  <CountUpMetric key={m.label} {...m} />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
