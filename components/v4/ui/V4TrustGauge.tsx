"use client";

import { motion, useReducedMotion } from "framer-motion";
import { CountUpMetric } from "./V4Metrics";

const R_OUTER = 80;
const R_INNER = 60;
const CX = 100;
const CY = 100;

/** Path for a left-to-right semicircle (180deg -> 0deg) of the given radius, centered at (CX, CY). */
function semicircle(r: number) {
  return `M ${CX - r} ${CY} A ${r} ${r} 0 0 1 ${CX + r} ${CY}`;
}

/**
 * Signature visual motif: the rep-facing homeowner's trust/irritation state,
 * rendered as two concentric arcs rather than plain number cards. This is
 * the one visual element unique to Driven2Develop's stateful roleplay model
 * (lib/ai/homeowner.ts) - reused everywhere the trust/irritation state
 * appears so it reads as a signature, not a one-off widget.
 */
export function V4TrustGauge({ trust, irritation }: { trust: number; irritation: number }) {
  const reduce = useReducedMotion();
  const outerLen = Math.PI * R_OUTER;
  const innerLen = Math.PI * R_INNER;
  const outerOffset = outerLen * (1 - trust / 100);
  const innerOffset = innerLen * (1 - irritation / 100);
  const transition = reduce ? { duration: 0 } : { duration: 1.1, ease: [0.16, 1, 0.3, 1] as const, delay: 0.15 };

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 200 112" className="w-full max-w-[260px]" aria-hidden="true">
        <path d={semicircle(R_OUTER)} fill="none" stroke="var(--v4-border)" strokeWidth={10} strokeLinecap="round" />
        <path d={semicircle(R_INNER)} fill="none" stroke="var(--v4-border)" strokeWidth={8} strokeLinecap="round" />
        <motion.path
          d={semicircle(R_OUTER)}
          fill="none"
          stroke="var(--v4-gold-b)"
          strokeWidth={10}
          strokeLinecap="round"
          strokeDasharray={outerLen}
          initial={{ strokeDashoffset: outerLen }}
          animate={{ strokeDashoffset: outerOffset }}
          transition={transition}
        />
        <motion.path
          d={semicircle(R_INNER)}
          fill="none"
          stroke="var(--v4-red)"
          strokeWidth={8}
          strokeLinecap="round"
          strokeDasharray={innerLen}
          initial={{ strokeDashoffset: innerLen }}
          animate={{ strokeDashoffset: innerOffset }}
          transition={transition}
        />
      </svg>
      <div className="flex gap-8 -mt-2">
        <div className="text-center">
          <CountUpMetric label="Trust" value={trust} />
        </div>
        <div className="text-center">
          <CountUpMetric label="Irritation" value={irritation} />
        </div>
      </div>
    </div>
  );
}
