"use client";

import { Fragment } from "react";
import { AlertTriangle, ArrowUpRight, TrendingDown, TrendingUp } from "lucide-react";

const QUEUE = [
  { rep: "Jordan Casey", issue: "Objection handling dropped 14 pts over 3 sessions", evidence: "6 sessions", action: "Assign Drill" },
  { rep: "Priya Nair", issue: "Closing strength consistently below team floor", evidence: "9 sessions", action: "Schedule Coaching" },
  { rep: "Miguel Ortiz", issue: "Compliance flag: unapproved savings claim", evidence: "1 session", action: "Review" },
];

const SKILLS = ["Intro", "Rapport", "Discovery", "Value Prop", "Objection", "Close"];
const HEAT = [
  [82, 74, 61, 55, 40, 68],
  [90, 85, 70, 66, 58, 72],
  [76, 80, 65, 48, 35, 50],
  [88, 79, 72, 60, 62, 77],
];
const REPS = ["Jordan C.", "Priya N.", "Miguel O.", "Team avg"];

function heatColor(v: number) {
  if (v >= 75) return "var(--v4-green)";
  if (v >= 55) return "var(--v4-gold-b)";
  return "var(--v4-red)";
}

export function V4ManagerDashboard() {
  return (
    <section className="py-24 md:py-32 border-t" style={{ borderColor: "var(--v4-border)" }}>
      <div className="max-w-[1600px] mx-auto px-6 md:px-10">
        <div className="max-w-2xl mb-14">
          <p className="v4-eyebrow mb-5">Manager Operating System</p>
          <h2 className="text-3xl md:text-[2.5rem] leading-[1.08] font-semibold tracking-tight">
            See every rep&apos;s real skill gaps — not just activity.
          </h2>
          <p className="mt-5 text-base" style={{ color: "var(--v4-text-secondary)" }}>
            A needs-attention queue built from evidence, not guesswork, plus a live skill heat-map across the whole
            team.
          </p>
        </div>

        <div
          className="rounded-xl border overflow-hidden"
          style={{ borderColor: "var(--v4-border-strong)", background: "var(--v4-bg-raised)" }}
        >
          <div className="grid lg:grid-cols-[1fr_420px]">
            {/* Needs attention queue */}
            <div className="p-6 lg:border-r" style={{ borderColor: "var(--v4-border)" }}>
              <div className="flex items-center justify-between mb-5">
                <span className="text-sm font-medium">Needs Attention</span>
                <span
                  className="text-xs px-2.5 py-1 rounded-full border"
                  style={{ borderColor: "var(--v4-border-strong)", color: "var(--v4-text-secondary)" }}
                >
                  Available now
                </span>
              </div>
              <div className="space-y-3">
                {QUEUE.map((q) => (
                  <div
                    key={q.rep}
                    className="flex items-start justify-between gap-4 rounded-lg border p-4 transition-colors hover:border-[var(--v4-border-strong)]"
                    style={{ borderColor: "var(--v4-border)", background: "var(--v4-bg-inset)" }}
                  >
                    <div className="flex items-start gap-3">
                      <AlertTriangle size={16} className="mt-0.5 shrink-0" style={{ color: "var(--v4-red)" }} />
                      <div>
                        <p className="text-sm font-medium">{q.rep}</p>
                        <p className="text-xs mt-0.5" style={{ color: "var(--v4-text-secondary)" }}>
                          {q.issue}
                        </p>
                        <p className="text-[11px] mt-1.5" style={{ color: "var(--v4-text-tertiary)" }}>
                          Evidence: {q.evidence}
                        </p>
                      </div>
                    </div>
                    <button
                      className="text-xs font-semibold shrink-0 whitespace-nowrap rounded-md px-2.5 py-1.5 border border-transparent transition-colors hover:border-[var(--v4-gold-b)]"
                      style={{ color: "var(--v4-gold-b)" }}
                    >
                      {q.action}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Skill heat map */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-5">
                <span className="text-sm font-medium">Team Skill Map</span>
                <span className="inline-flex items-center gap-1 text-xs" style={{ color: "var(--v4-green)" }}>
                  <TrendingUp size={13} /> +6 this month
                </span>
              </div>
              <div className="overflow-x-auto -mx-1 px-1">
              <div className="grid gap-1.5 min-w-[420px]" style={{ gridTemplateColumns: `72px repeat(${SKILLS.length}, 1fr)` }}>
                <div />
                {SKILLS.map((s) => (
                  <div key={s} className="text-[10px] text-center pb-1" style={{ color: "var(--v4-text-tertiary)" }}>
                    {s}
                  </div>
                ))}
                {HEAT.map((row, ri) => (
                  <Fragment key={ri}>
                    <div className="text-xs pr-2 flex items-center" style={{ color: "var(--v4-text-secondary)" }}>
                      {REPS[ri]}
                    </div>
                    {row.map((v, ci) => (
                      <div
                        key={ci}
                        title={`${REPS[ri]} · ${SKILLS[ci]}: ${v}/100`}
                        className="aspect-square rounded-sm flex items-center justify-center text-[10px] font-medium tabular-nums cursor-default transition-transform hover:scale-[1.12] hover:z-10 relative"
                        style={{ background: `color-mix(in srgb, ${heatColor(v)} 28%, var(--v4-bg-inset))`, color: "var(--v4-text)" }}
                      >
                        {v}
                      </div>
                    ))}
                  </Fragment>
                ))}
              </div>
              </div>
              <div className="mt-5 pt-5 border-t flex items-center justify-between" style={{ borderColor: "var(--v4-border)" }}>
                <span className="text-xs" style={{ color: "var(--v4-text-tertiary)" }}>
                  Weakest area team-wide
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-medium" style={{ color: "var(--v4-red)" }}>
                  <TrendingDown size={13} /> Objection Handling
                </span>
              </div>
            </div>
          </div>
        </div>

        <a href="#" className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold" style={{ color: "var(--v4-gold-b)" }}>
          View manager dashboard <ArrowUpRight size={14} />
        </a>
      </div>
    </section>
  );
}
