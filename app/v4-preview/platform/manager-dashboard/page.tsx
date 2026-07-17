"use client";

import { ClipboardCheck, AlertTriangle, Grid3x3, ClipboardList, Users2, ShieldCheck, GitBranch, Route } from "lucide-react";
import "../../../v4-preview.css";
import { V4Nav } from "@/components/v4/V4Nav";
import { V4ManagerDashboard } from "@/components/v4/V4ManagerDashboard";
import { V4FinalCTA } from "@/components/v4/V4FinalCTA";
import { SectionHeading } from "@/components/v4/ui/SectionHeading";
import { V4Badge } from "@/components/v4/ui/V4Badge";
import { V4Card } from "@/components/v4/ui/V4Card";
import { V4FlowDiagram } from "@/components/v4/ui/V4FlowDiagram";
import { RelatedCapabilities } from "@/components/v4/RelatedCapabilities";
import { useV4Theme } from "@/components/v4/useV4Theme";

const FLOW = [
  { icon: ClipboardCheck, label: "Session scores", desc: "Every scored session across the whole roster." },
  { icon: Grid3x3, label: "Team aggregation", desc: "Averaged per-skill across every rep, every session." },
  { icon: AlertTriangle, label: "Needs-attention detection", desc: "Flags reps trending down or below the team floor." },
  { icon: Route, label: "Assignment routing", desc: "Suggests a specific drill tied to the exact gap." },
  { icon: Users2, label: "Manager action", desc: "One click to assign, schedule, or review." },
];

const DATA_INPUTS = [
  { label: "Team roster", detail: "Every rep reporting to this manager, pulled directly from the org hierarchy." },
  { label: "Session-level metrics", detail: "Six scoring dimensions per session, rolled up into team and individual trends." },
  { label: "Assignment & playbook history", detail: "What's already been assigned, so the queue doesn't repeat itself." },
  { label: "Compliance flags", detail: "Script deviations and unapproved claims, surfaced automatically, not by spot-checking recordings." },
];

const MOAT = [
  { icon: ClipboardList, title: "Evidence, not a hunch", body: "The needs-attention queue is built from scored session data — never a manager's gut feeling about who's struggling." },
  { icon: GitBranch, title: "Routes to a specific drill", body: "Every flagged gap links to the exact scenario type that targets it, not a generic 'coach this rep' reminder." },
  { icon: ShieldCheck, title: "Compliance built in, not bolted on", body: "The same scoring pipeline that grades a pitch also flags a script deviation — one system, not a separate audit tool." },
];

export default function ManagerDashboardPage() {
  const { theme, toggleTheme } = useV4Theme();

  return (
    <div className="v4-scope font-sans" data-v4-theme={theme} style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
      <V4Nav theme={theme} onToggleTheme={toggleTheme} />
      <main>
        <section className="relative overflow-hidden" style={{ background: "var(--v4-bg)" }}>
          <div className="absolute inset-0 v4-grid-bg opacity-[0.35]" aria-hidden="true" />
          <div className="relative max-w-[1600px] mx-auto px-6 md:px-10 pt-20 pb-4 md:pt-28">
            <div className="flex items-center gap-3 mb-5">
              <span className="v4-eyebrow">Manager Operating System</span>
              <V4Badge status="available" />
            </div>
            <h1 className="text-[2.6rem] leading-[1.05] md:text-[3.2rem] md:leading-[1.03] font-semibold tracking-tight max-w-3xl">
              The manager operating system, not another reporting dashboard.
            </h1>
            <p className="mt-6 text-base md:text-lg max-w-xl" style={{ color: "var(--v4-text-secondary)" }}>
              A needs-attention queue built from evidence, a live skill heat-map across the whole team, and
              assignments that route straight to the drill that targets the gap. Try it below.
            </p>
          </div>
        </section>

        <V4ManagerDashboard />

        <section className="py-20 md:py-28 border-t" style={{ borderColor: "var(--v4-border)" }}>
          <div className="max-w-[1600px] mx-auto px-6 md:px-10">
            <SectionHeading eyebrow="How it works" title="From individual sessions to a manager's next move." />
            <div className="mt-12">
              <V4FlowDiagram nodes={FLOW} />
            </div>
          </div>
        </section>

        <section className="py-20 md:py-28 border-t" style={{ borderColor: "var(--v4-border)" }}>
          <div className="max-w-[1600px] mx-auto px-6 md:px-10">
            <SectionHeading eyebrow="What it's built on" title="The data behind the queue." />
            <div className="mt-12 grid md:grid-cols-2 gap-4">
              {DATA_INPUTS.map((d) => (
                <V4Card key={d.label} className="p-6">
                  <p className="text-sm font-medium">{d.label}</p>
                  <p className="text-sm mt-2" style={{ color: "var(--v4-text-secondary)" }}>
                    {d.detail}
                  </p>
                </V4Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 md:py-28 border-t" style={{ borderColor: "var(--v4-border)" }}>
          <div className="max-w-[1600px] mx-auto px-6 md:px-10">
            <SectionHeading eyebrow="Why it's hard to copy" title="An operating system, not a reporting dashboard." />
            <div className="mt-12 grid md:grid-cols-3 gap-6">
              {MOAT.map((m) => (
                <div key={m.title}>
                  <m.icon size={20} style={{ color: "var(--v4-gold-b)" }} />
                  <h3 className="font-medium mt-4">{m.title}</h3>
                  <p className="text-sm mt-1.5" style={{ color: "var(--v4-text-secondary)" }}>
                    {m.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 md:py-28 border-t" style={{ borderColor: "var(--v4-border)" }}>
          <div className="max-w-[1600px] mx-auto px-6 md:px-10">
            <SectionHeading eyebrow="Related capabilities" title="Part of one connected system." />
            <div className="mt-10">
              <RelatedCapabilities slugs={["assignments-playbooks", "compliance", "team-analytics"]} />
            </div>
          </div>
        </section>

        <V4FinalCTA />
      </main>
    </div>
  );
}
