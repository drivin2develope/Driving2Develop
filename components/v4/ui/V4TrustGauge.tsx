"use client";

import { V4Arc } from "./V4Arc";
import { CountUpMetric } from "./V4Metrics";

/**
 * Signature visual motif: the rep-facing homeowner's trust/irritation state,
 * rendered as two concentric arcs rather than plain number cards. This is
 * the one visual element unique to Driven2Develop's stateful roleplay model
 * (lib/ai/homeowner.ts) - reused everywhere the trust/irritation state
 * appears so it reads as a signature, not a one-off widget. Built on the
 * same V4Arc primitive as every other gauge on the site.
 */
export function V4TrustGauge({ trust, irritation }: { trust: number; irritation: number }) {
  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 200 112" className="w-full max-w-[260px]" aria-hidden="true">
        <V4Arc radius={80} value={trust} color="var(--v4-gold-b)" strokeWidth={10} />
        <V4Arc radius={60} value={irritation} color="var(--v4-red)" strokeWidth={8} />
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
