"use client";

import { motion, useReducedMotion } from "framer-motion";

const CX = 100;
const CY = 100;

/** Path for a left-to-right semicircle (180deg -> 0deg) of the given radius, centered at (CX, CY). */
export function semicirclePath(r: number) {
  return `M ${CX - r} ${CY} A ${r} ${r} 0 0 1 ${CX + r} ${CY}`;
}

/**
 * One animated semicircle arc - the shared primitive behind every gauge in
 * the design system (V4TrustGauge's dual arcs, single-value score gauges
 * elsewhere). Keeping the arc math in one place means every gauge on the
 * site draws and animates identically.
 */
export function V4Arc({
  radius,
  value,
  color,
  strokeWidth = 10,
  delay = 0.15,
}: {
  radius: number;
  value: number;
  color: string;
  strokeWidth?: number;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  const len = Math.PI * radius;
  const offset = len * (1 - Math.max(0, Math.min(100, value)) / 100);
  const transition = reduce ? { duration: 0 } : { duration: 1.1, ease: [0.16, 1, 0.3, 1] as const, delay };
  const d = semicirclePath(radius);

  return (
    <>
      <path d={d} fill="none" stroke="var(--v4-border)" strokeWidth={strokeWidth} strokeLinecap="round" />
      <motion.path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={len}
        initial={{ strokeDashoffset: len }}
        animate={{ strokeDashoffset: offset }}
        transition={transition}
      />
    </>
  );
}

/** Single-value gauge for any 0-100 score - the same visual language as
    V4TrustGauge, applied to whatever metric a given page actually needs. */
export function V4ScoreGauge({ value, label, radius = 60, size = "w-[180px]" }: { value: number; label?: string; radius?: number; size?: string }) {
  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 200 112" className={`${size} w-full`} aria-hidden="true">
        <V4Arc radius={radius} value={value} color="var(--v4-gold-b)" strokeWidth={10} />
      </svg>
      <div className="text-center -mt-2">
        <p className="text-2xl font-semibold tabular-nums">{value}</p>
        {label && (
          <p className="text-[11px] uppercase tracking-wide" style={{ color: "var(--v4-text-tertiary)" }}>
            {label}
          </p>
        )}
      </div>
    </div>
  );
}
