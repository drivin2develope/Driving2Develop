"use client";

import { useEffect, useState } from "react";
import { animate, useReducedMotion } from "framer-motion";

export function CountUpMetric({ label, value, suffix = "" }: { label: string; value: number; suffix?: string }) {
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

const DEFAULT_BAR_HEIGHTS = [
  22, 40, 30, 55, 70, 45, 60, 80, 50, 35, 65, 90, 55, 40, 30, 60, 75, 45, 55, 85, 60, 40, 25, 50, 70, 55, 35, 60, 80, 45,
  30, 55, 65, 40, 50, 75, 60, 35, 45, 20,
];

export function LiveWaveform({ heights = DEFAULT_BAR_HEIGHTS, className = "h-16" }: { heights?: number[]; className?: string }) {
  const [bars, setBars] = useState(heights);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const interval = setInterval(() => {
      setBars((prev) => prev.map((h, i) => Math.max(15, Math.min(95, h + Math.sin(Date.now() / 400 + i) * 8))));
    }, 220);
    return () => clearInterval(interval);
  }, [reduce]);

  return (
    <div className={`flex items-end gap-[3px] ${className}`} aria-hidden="true">
      {bars.map((h, i) => (
        <div
          key={i}
          className="flex-1 rounded-sm transition-all duration-200 ease-out"
          style={{ height: `${h}%`, background: "var(--v4-gold-b)", opacity: 0.35 + (i % 5) * 0.13 }}
        />
      ))}
    </div>
  );
}
