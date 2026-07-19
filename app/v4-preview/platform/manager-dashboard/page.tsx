"use client";

import { ClipboardCheck, AlertTriangle, Grid3x3, ClipboardList, Users2, ShieldCheck, GitBranch, Route, TrendingDown } from "lucide-react";
import { V4CapabilityPage } from "@/components/v4/V4CapabilityPage";
import { V4ManagerDashboard } from "@/components/v4/V4ManagerDashboard";
import { V4ScoreGauge } from "@/components/v4/ui/V4Arc";
import { V4IntelligenceMap } from "@/components/v4/V4IntelligenceMap";
import { V4PerformanceGraph } from "@/components/v4/V4PerformanceGraph";

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
  return (
    <V4CapabilityPage
      eyebrow="Manager Operating System"
      title="The manager operating system, not another reporting dashboard."
      subtitle="A needs-attention queue built from evidence, a live skill heat-map across the whole team, and assignments that route straight to the drill that targets the gap. Try it below."
      heroSide={
        <div
          className="rounded-xl border p-5 flex flex-col items-center"
          style={{ borderColor: "var(--v4-border-strong)", background: "var(--v4-bg-raised)" }}
        >
          <V4ScoreGauge value={73} label="Team avg score" radius={54} size="w-[150px]" />
          <div className="flex items-center gap-1.5 text-xs mt-3 pt-3 border-t w-full justify-center" style={{ borderColor: "var(--v4-border)", color: "var(--v4-red)" }}>
            <TrendingDown size={13} /> Weakest: Objection Handling
          </div>
        </div>
      }
      heroWide={
        <>
          <V4ManagerDashboard />
          <V4IntelligenceMap />
          <V4PerformanceGraph />
        </>
      }
      flowTitle="From individual sessions to a manager's next move."
      flow={FLOW}
      dataTitle="The data behind the queue."
      dataInputs={DATA_INPUTS}
      moatTitle="An operating system, not a reporting dashboard."
      moat={MOAT}
      relatedSlugs={["assignments-playbooks", "compliance", "team-analytics"]}
    />
  );
}
