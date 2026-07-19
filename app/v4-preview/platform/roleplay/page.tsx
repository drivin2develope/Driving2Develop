"use client";

import { Mic, MessageSquareText, Activity, Gauge as GaugeIcon, ClipboardCheck, ShieldCheck, Cpu, SlidersHorizontal } from "lucide-react";
import { V4CapabilityPage } from "@/components/v4/V4CapabilityPage";
import { V4ConversationReplay } from "@/components/v4/V4ConversationReplay";

const FLOW = [
  { icon: Mic, label: "Mic input", desc: "Live audio captured during the roleplay." },
  { icon: Activity, label: "Speech-to-text", desc: "Continuous transcript, timed to the audio." },
  { icon: MessageSquareText, label: "Homeowner adapter", desc: "Reacts to what was just said, not a fixed script." },
  { icon: GaugeIcon, label: "Trust & irritation state", desc: "Carried across every turn of the conversation." },
  { icon: ClipboardCheck, label: "Session score", desc: "Deterministic scoring over the full transcript." },
];

const DATA_INPUTS = [
  { label: "Acoustic signal", detail: "Energy envelope from the Web Audio API — real pace and pause detection, not estimated." },
  { label: "Transcript text", detail: "Regex/keyword matched for filler words, confident vs. hesitant language, and script adherence." },
  { label: "Scenario configuration", detail: "Difficulty tier and required talking points set the homeowner's starting trust baseline." },
  { label: "Turn-by-turn history", detail: "Every prior exchange, so the homeowner's reaction reflects the whole conversation, not just the last line." },
];

const MOAT = [
  { icon: Cpu, title: "Stateful, not scripted", body: "Trust and irritation carry across every turn — the same objection lands differently depending on how the conversation got there." },
  { icon: ShieldCheck, title: "Honest about its own mode", body: "Runs on a real rule-based engine by default, upgrades to an OpenAI-backed adapter when a key is configured — and always discloses which one is active." },
  { icon: SlidersHorizontal, title: "Difficulty is a starting condition, not a label", body: "Easy, Realistic, and Hard set a different starting trust baseline for the homeowner — not a cosmetic tag on an otherwise identical scenario." },
];

export default function RoleplayPage() {
  return (
    <V4CapabilityPage
      eyebrow="AI Roleplay Simulator"
      heroGlow
      title="A homeowner that reacts to what you actually said — not a script that plays out the same way twice."
      subtitle="Every roleplay carries a real trust and irritation state across the whole conversation. Push too hard on price and the homeowner gets defensive for the rest of the session — exactly like a real doorstep."
      heroInline={
        <>
          <div className="mt-12">
            <V4ConversationReplay />
          </div>
          <p className="mt-4 text-xs max-w-4xl" style={{ color: "var(--v4-text-tertiary)" }}>
            Illustrative session data. Drag the timeline to replay how trust and irritation shifted through the
            conversation.
          </p>
        </>
      }
      flowTitle="Five steps, every turn of the conversation."
      flow={FLOW}
      dataTitle="The data behind every score."
      dataInputs={DATA_INPUTS}
      moatTitle="Not a demo trick — a stateful system."
      moat={MOAT}
      relatedSlugs={["conversation-intelligence", "objection-intelligence", "ai-coach"]}
    />
  );
}
