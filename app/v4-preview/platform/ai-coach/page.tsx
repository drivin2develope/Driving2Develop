"use client";

import { BarChart3, ArrowDownWideNarrow, BookOpenText, MessageSquare, ShieldCheck, Repeat, Ban } from "lucide-react";
import { V4CapabilityPage } from "@/components/v4/V4CapabilityPage";
import { V4CoachExplorer } from "@/components/v4/V4CoachExplorer";

const FLOW = [
  { icon: BarChart3, label: "Session scored", desc: "Six metrics computed from the transcript and audio signal." },
  { icon: ArrowDownWideNarrow, label: "Sorted lowest-first", desc: "The three weakest metrics become the coaching priority, every time." },
  { icon: BookOpenText, label: "Tip dictionary lookup", desc: "Each metric maps to a specific, written tip — not a generated paragraph." },
  { icon: MessageSquare, label: "Surfaced as a suggestion", desc: "Tap-to-expand chips, not a wall of text to scroll past." },
  { icon: Repeat, label: "Routed to a drill", desc: "\"Give me a drill for today\" points at the exact weak metric." },
];

const DATA_INPUTS = [
  { label: "The rep's own metrics", detail: "Clarity, pacing, keyword adherence, closing strength, objection handling, and confidence — from real sessions, not a self-assessment survey." },
  { label: "A fixed tip dictionary", detail: "One specific, written tip per metric — the same tip for the same weakness, every time, not regenerated per request." },
  { label: "Rolling session history", detail: "The last several sessions, so 'weakest area' reflects a pattern, not one bad session." },
  { label: "Scenario library metadata", detail: "Difficulty and objection category, so a drill recommendation actually targets the right practice." },
];

const MOAT = [
  { icon: Ban, title: "Deterministic, not generative", body: "The coach maps a metric to a fixed, pre-written tip — there's no model in the loop to hallucinate advice that sounds right but isn't." },
  { icon: ArrowDownWideNarrow, title: "Always the weakest first", body: "The lowest-scoring metric is always what's surfaced first — a rep never gets generic praise instead of the thing that's actually holding them back." },
  { icon: ShieldCheck, title: "Every tip is inspectable", body: "The tip dictionary is a fixed, readable list, not a black-box prompt — what the coach can say is fully auditable." },
];

export default function AICoachPage() {
  return (
    <V4CapabilityPage
      eyebrow="AI Coach"
      title="Rule-based coaching, aimed at your actual lowest score."
      subtitle="Every tip maps to a specific metric from a fixed dictionary — never a generated paragraph that might be wrong. Select a metric below to see its coaching."
      heroInline={
        <div className="mt-12">
          <V4CoachExplorer />
        </div>
      }
      flowTitle="From a scored session to a specific next drill."
      flow={FLOW}
      dataTitle="What the coach is actually looking at."
      dataInputs={DATA_INPUTS}
      moatTitle="Honest about being rule-based, on purpose."
      moat={MOAT}
      relatedSlugs={["scorecard", "objection-intelligence", "assignments-playbooks"]}
    />
  );
}
