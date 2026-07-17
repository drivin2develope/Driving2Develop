"use client";

import { Gauge, Flag, ShieldCheck, HeartHandshake, ScrollText, Ban } from "lucide-react";
import { V4CapabilityPage } from "@/components/v4/V4CapabilityPage";
import { V4ComplianceFlags } from "@/components/v4/V4ComplianceFlags";

const FLOW = [
  { icon: Gauge, label: "Session scored", desc: "Objection handling, adherence, and closing scored per session." },
  { icon: Flag, label: "Thresholds checked", desc: "Objection <45, adherence <50, closing <40 trigger a flag." },
  { icon: ShieldCheck, label: "Severity assigned", desc: "High or medium, based on how far below the threshold." },
  { icon: HeartHandshake, label: "Framed as coaching", desc: "Every flag reads as a risk pattern, never an accusation." },
  { icon: ScrollText, label: "Surfaced to the manager", desc: "Sorted by severity, linked to the rep's session." },
];

const DATA_INPUTS = [
  { label: "Objection handling score", detail: "Below 45 flags a trust risk — rebutting before acknowledging, not just a lost point." },
  { label: "Keyword adherence score", detail: "Below 50 flags missed required talking points — required disclosures may not be reaching the homeowner." },
  { label: "Closing strength score", detail: "Below 40 flags pressure risk — a signal to coach toward a clear next step." },
  { label: "Rep's latest session only", detail: "Flags reflect the most recent session, not a history that could unfairly follow a rep." },
];

const MOAT = [
  { icon: Ban, title: "No keyword blocklist to game", body: "Flags come from score thresholds on real scoring dimensions, not a list of forbidden words a rep could learn to avoid saying." },
  { icon: HeartHandshake, title: "Coaching framing, not a violation log", body: "Every flag's copy is written as a risk pattern to address, never as a citation — the tone is deliberate, not incidental." },
  { icon: ShieldCheck, title: "Same pipeline, not a bolt-on audit", body: "The scoring that grades a pitch is the same scoring that flags a risk — there's no separate compliance model to keep in sync." },
];

export default function CompliancePage() {
  return (
    <V4CapabilityPage
      eyebrow="Compliance Monitoring"
      title="Risk patterns, flagged automatically — never an accusation."
      subtitle="Objection handling, script adherence, and closing strength cross real thresholds, not a keyword blocklist. Select a flag below to see why it triggered."
      heroInline={
        <div className="mt-12">
          <V4ComplianceFlags />
        </div>
      }
      flowTitle="From a scored session to a framed coaching signal."
      flow={FLOW}
      dataTitle="What actually triggers a flag."
      dataInputs={DATA_INPUTS}
      moatTitle="A scoring pipeline, not a surveillance layer."
      moat={MOAT}
      relatedSlugs={["manager-dashboard", "team-analytics", "manager-copilot"]}
    />
  );
}
