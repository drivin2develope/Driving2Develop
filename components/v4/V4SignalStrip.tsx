"use client";

import { motion } from "framer-motion";
import { LiveWaveform, CountUpMetric } from "./ui/V4Metrics";
import { V4TrustGauge } from "./ui/V4TrustGauge";

/**
 * The raw signal behind every score: acoustic waveform + the trust/irritation
 * state, shown as its own proof point before the click-to-inspect evidence
 * panel below. Deliberately not the Roleplay page's scrubber (that
 * interaction already has its own real home) - this is the static "here's
 * what we're actually measuring" view that leads into "here's what we found."
 */
export function V4SignalStrip() {
  return (
    <section className="border-t" style={{ borderColor: "var(--v4-border)" }}>
      <div className="max-w-[1600px] mx-auto px-6 md:px-10 py-16 md:py-20">
        <p className="v4-eyebrow mb-3">The raw signal</p>
        <h2 className="text-2xl md:text-[1.75rem] font-semibold tracking-tight mb-10 max-w-xl">
          Every score below starts as an acoustic waveform and a live trust state — not just text.
        </h2>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-xl border overflow-hidden"
          style={{ borderColor: "var(--v4-border-strong)", background: "var(--v4-bg-raised)" }}
        >
          <div className="grid md:grid-cols-[1fr_260px]">
            <div className="p-6 space-y-4">
              <div className="rounded-lg border p-4" style={{ borderColor: "var(--v4-border)", background: "var(--v4-bg-inset)" }}>
                <p className="v4-eyebrow mb-1.5 opacity-80">Homeowner · skeptical</p>
                <p className="text-sm leading-relaxed">
                  &ldquo;We already got quotes from two other companies. Honestly, this feels like a lot to take in
                  right now.&rdquo;
                </p>
              </div>
              <LiveWaveform />
              <div className="rounded-lg border p-4" style={{ borderColor: "var(--v4-border)", background: "var(--v4-bg-inset)" }}>
                <p className="v4-eyebrow mb-1.5 opacity-80">Rep</p>
                <p className="text-sm leading-relaxed">
                  Totally fair — a lot of homeowners tell me that. Can I ask what stood out about the other two
                  quotes so I&apos;m not repeating what you&apos;ve already heard?
                </p>
              </div>
            </div>
            <div className="p-6 border-t md:border-t-0 md:border-l flex flex-col items-center" style={{ borderColor: "var(--v4-border)" }}>
              <V4TrustGauge trust={61} irritation={18} />
              <div className="grid grid-cols-2 gap-4 w-full mt-2 pt-4 border-t" style={{ borderColor: "var(--v4-border)" }}>
                <CountUpMetric label="Pace" value={142} suffix=" wpm" />
                <CountUpMetric label="Objection Handling" value={88} />
              </div>
            </div>
          </div>
        </motion.div>
        <p className="mt-4 text-xs" style={{ color: "var(--v4-text-tertiary)" }}>
          Illustrative session data. This same signal is what the evidence panel below traces every finding back to.
        </p>
      </div>
    </section>
  );
}
