"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Circle, Play, Pause } from "lucide-react";
import { LiveWaveform } from "./ui/V4Metrics";
import { V4TrustGauge } from "./ui/V4TrustGauge";

interface Keyframe {
  t: number;
  speaker: "Rep" | "Homeowner";
  text: string;
  trust: number;
  irritation: number;
  label: string;
}

const KEYFRAMES: Keyframe[] = [
  { t: 0, speaker: "Rep", label: "Open", trust: 40, irritation: 5, text: "Hi there, my name is Alex — I'm with the neighborhood solar program." },
  { t: 33, speaker: "Homeowner", label: "Objection", trust: 28, irritation: 15, text: "We already got quotes from two other companies, honestly this feels like a lot." },
  { t: 66, speaker: "Rep", label: "Reframe", trust: 45, irritation: 8, text: "Totally fair — a lot of homeowners tell me that. Mind if I ask what stood out about those quotes?" },
  { t: 100, speaker: "Homeowner", label: "Opens up", trust: 58, irritation: 4, text: "Mostly the monthly savings, I guess." },
];

function nearestKeyframe(percent: number): Keyframe {
  return KEYFRAMES.reduce((closest, kf) => (Math.abs(kf.t - percent) < Math.abs(closest.t - percent) ? kf : closest));
}

/**
 * Signature interaction #2: a scrubbable conversation replay. Dragging the
 * timeline moves through the exchange and synchronously updates the
 * transcript, speaker, and the trust/irritation gauge - a different
 * interaction pattern from both the scroll-driven Loop and the
 * click-to-inspect evidence panel, built on a native range input so it's
 * fully keyboard- and touch-accessible without custom pointer-event code.
 */
export function V4ConversationReplay() {
  const [percent, setPercent] = useState(0);
  const active = useMemo(() => nearestKeyframe(percent), [percent]);

  return (
    <div
      className="rounded-xl border overflow-hidden max-w-4xl"
      style={{ borderColor: "var(--v4-border-strong)", background: "var(--v4-bg-raised)" }}
    >
      <div className="flex items-center justify-between px-5 py-3.5 border-b" style={{ borderColor: "var(--v4-border)" }}>
        <div className="flex items-center gap-2.5">
          <Circle size={8} fill="var(--v4-red)" stroke="none" />
          <span className="text-xs font-medium">Conversation Replay</span>
          <span className="text-xs" style={{ color: "var(--v4-text-tertiary)" }}>
            {active.label}
          </span>
        </div>
      </div>

      <div className="grid md:grid-cols-[1fr_260px]">
        <div className="p-5 space-y-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.t}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-lg border p-4"
              style={{ borderColor: "var(--v4-border)", background: "var(--v4-bg-inset)" }}
            >
              <p className="v4-eyebrow mb-1.5 opacity-80" style={{ color: active.speaker === "Rep" ? "var(--v4-gold-b)" : "var(--v4-text-tertiary)" }}>
                {active.speaker}
              </p>
              <p className="text-sm leading-relaxed">{active.text}</p>
            </motion.div>
          </AnimatePresence>

          <LiveWaveform />

          <div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setPercent((p) => (p >= 100 ? 0 : Math.min(100, p + 34)))}
                aria-label={percent >= 100 ? "Restart replay" : "Advance replay"}
                className="w-8 h-8 rounded-full border flex items-center justify-center shrink-0 transition-colors hover:border-[var(--v4-gold-b)]"
                style={{ borderColor: "var(--v4-border-strong)" }}
              >
                {percent >= 100 ? <Play size={12} /> : <Pause size={12} />}
              </button>
              <input
                type="range"
                min={0}
                max={100}
                value={percent}
                onChange={(e) => setPercent(Number(e.target.value))}
                aria-label="Scrub through the conversation"
                className="v4-scrubber flex-1"
              />
            </div>
            <div className="flex justify-between mt-2 px-1">
              {KEYFRAMES.map((kf) => (
                <span key={kf.t} className="text-[10px]" style={{ color: percent >= kf.t ? "var(--v4-gold-b)" : "var(--v4-text-tertiary)" }}>
                  {kf.label}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="p-5 border-t md:border-t-0 md:border-l flex flex-col items-center justify-center" style={{ borderColor: "var(--v4-border)" }}>
          <V4TrustGauge trust={active.trust} irritation={active.irritation} />
        </div>
      </div>
    </div>
  );
}
