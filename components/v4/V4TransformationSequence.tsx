"use client";

import { AlertTriangle, FileSearch, Target, ArrowRight } from "lucide-react";
import { V4ScoreGauge } from "./ui/V4Arc";
import { V4Reveal } from "./ui/V4Reveal";

/**
 * Signature #3: a concrete before/after case, not another abstract flow
 * diagram. Walks one real weak moment through the whole loop to a measured
 * outcome - the same 62 -> 84 delta a manager would actually see on a rep's
 * profile after the assigned drill.
 */
export function V4TransformationSequence() {
  return (
    <section className="py-24 md:py-32 border-t" style={{ borderColor: "var(--v4-border)" }}>
      <div className="max-w-[1600px] mx-auto px-6 md:px-10">
        <p className="v4-eyebrow mb-3 text-center">One flagged moment, followed through</p>
        <h2 className="text-2xl md:text-[2rem] font-semibold tracking-tight text-center max-w-2xl mx-auto mb-16">
          From a weak moment to a measured improvement — not just a score.
        </h2>

        <div className="grid md:grid-cols-4 gap-4 items-stretch">
          <V4Reveal index={0}>
            <div className="v4-diagram-node p-5 h-full">
              <AlertTriangle size={18} style={{ color: "var(--v4-red)" }} />
              <p className="text-xs uppercase tracking-wide mt-3" style={{ color: "var(--v4-text-tertiary)" }}>
                Moment flagged
              </p>
              <p className="text-sm mt-2 leading-relaxed">
                &ldquo;We already got quotes from two other companies, honestly this feels like a lot.&rdquo;
              </p>
            </div>
          </V4Reveal>

          <V4Reveal index={1}>
            <div className="v4-diagram-node p-5 h-full">
              <FileSearch size={18} style={{ color: "var(--v4-gold-b)" }} />
              <p className="text-xs uppercase tracking-wide mt-3" style={{ color: "var(--v4-text-tertiary)" }}>
                Evidence extracted
              </p>
              <p className="text-2xl font-semibold tabular-nums mt-2">62</p>
              <p className="text-xs mt-1" style={{ color: "var(--v4-text-secondary)" }}>
                Objection Handling
              </p>
            </div>
          </V4Reveal>

          <V4Reveal index={2}>
            <div className="v4-diagram-node p-5 h-full">
              <Target size={18} style={{ color: "var(--v4-gold-b)" }} />
              <p className="text-xs uppercase tracking-wide mt-3" style={{ color: "var(--v4-text-tertiary)" }}>
                Drill assigned
              </p>
              <p className="text-sm font-medium mt-2">Price-Focused Objection, Hard</p>
              <p className="text-xs mt-1" style={{ color: "var(--v4-text-secondary)" }}>
                Targets this exact gap, not a generic refresher.
              </p>
            </div>
          </V4Reveal>

          <V4Reveal index={3}>
            <div className="v4-diagram-node p-5 h-full flex flex-col items-center justify-center">
              <p className="text-xs uppercase tracking-wide mb-3 self-start" style={{ color: "var(--v4-text-tertiary)" }}>
                Score improved
              </p>
              <div className="flex items-center gap-3">
                <V4ScoreGauge value={62} radius={40} size="w-[110px]" />
                <ArrowRight size={16} style={{ color: "var(--v4-text-tertiary)" }} />
                <V4ScoreGauge value={84} radius={40} size="w-[110px]" />
              </div>
              <p className="text-xs font-semibold mt-1" style={{ color: "var(--v4-green)" }}>
                +22 across four sessions
              </p>
            </div>
          </V4Reveal>
        </div>
      </div>
    </section>
  );
}
