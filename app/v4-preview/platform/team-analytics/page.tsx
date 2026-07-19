"use client";

import { ClipboardCheck, Layers3, CalendarClock, TrendingDown, ShieldCheck, GitCompareArrows, Fingerprint } from "lucide-react";
import { V4CapabilityPage } from "@/components/v4/V4CapabilityPage";
import { V4CategoryTrendChart } from "@/components/v4/V4CategoryTrendChart";

const FLOW = [
  { icon: ClipboardCheck, label: "Session scored", desc: "Six category dimensions computed per session, per rep." },
  { icon: Layers3, label: "Categorized", desc: "Every session's metrics roll into the same six skill categories." },
  { icon: CalendarClock, label: "Windowed", desc: "Averaged across this month and compared to the prior window." },
  { icon: TrendingDown, label: "Drift flagged", desc: "A category trending down team-wide surfaces before it's a crisis." },
  { icon: ShieldCheck, label: "Feeds the queue", desc: "The same drift shows up in the Manager Dashboard's needs-attention logic." },
];

const DATA_INPUTS = [
  { label: "Every scored session", detail: "Not a sample — every session across the roster, in the same six categories the coach and scorecard already use." },
  { label: "Rolling time windows", detail: "This month vs. last, so a category average is a trend, not a single noisy snapshot." },
  { label: "Shared category taxonomy", detail: "The same six categories power the coach's tip dictionary and the manager's heat-map — one taxonomy, not three." },
  { label: "Team roster", detail: "Pulled from the org hierarchy, so 'the team' always means exactly who reports to this manager." },
];

const MOAT = [
  { icon: GitCompareArrows, title: "Trend, not a snapshot", body: "Every category shows this-period vs. last — a single average score hides exactly the drift a manager needs to catch early." },
  { icon: Fingerprint, title: "One taxonomy, everywhere", body: "The same six categories appear in the scorecard, the coach, and here — a rep's 'Objection Handling' means the same thing on every screen." },
  { icon: ShieldCheck, title: "Feeds real decisions, not a report", body: "A declining category here is the same signal that raises a rep in the Manager Dashboard's needs-attention queue — not a separate, disconnected metric." },
];

export default function TeamAnalyticsPage() {
  return (
    <V4CapabilityPage
      eyebrow="Team Analytics"
      title="Which skill the team is drifting on — before it shows up as a crisis."
      subtitle="Six categories, this month against last, computed from every scored session — not a single blended number that hides which direction things are moving."
      heroInline={
        <div className="mt-12">
          <V4CategoryTrendChart />
        </div>
      }
      flowTitle="From individual sessions to a team-wide trend line."
      flow={FLOW}
      dataTitle="The same categories, every screen."
      dataInputs={DATA_INPUTS}
      moatTitle="A trend line, not a leaderboard snapshot."
      moat={MOAT}
      relatedSlugs={["manager-dashboard", "ai-coach", "compliance"]}
    />
  );
}
