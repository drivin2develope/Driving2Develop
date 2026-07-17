"use client";

import { Mic, Activity, Tags, LineChart, Lightbulb, ShieldCheck, EyeOff, Layers } from "lucide-react";
import { V4CapabilityPage } from "@/components/v4/V4CapabilityPage";
import { V4PlatformSection } from "@/components/v4/V4PlatformSection";

const FLOW = [
  { icon: Mic, label: "Audio + transcript", desc: "Live speech recognition, or Whisper for uploads when configured." },
  { icon: Activity, label: "Acoustic signal", desc: "Energy envelope: pace, pauses, and pause length over time." },
  { icon: Tags, label: "Semantic tagging", desc: "Keyword and pattern matching over the transcript text." },
  { icon: LineChart, label: "Dimension scoring", desc: "Six independent metrics computed deterministically." },
  { icon: Lightbulb, label: "Coaching recommendation", desc: "The lowest-scoring dimension drives the next drill." },
];

const DATA_INPUTS = [
  { label: "Transcript text", detail: "Filler words, confident vs. hesitant phrasing, and required talking points, matched verbatim." },
  { label: "Acoustic energy envelope", detail: "Real signal processing via the Web Audio API — not a transcript-only estimate of tone." },
  { label: "Scenario metadata", detail: "Difficulty, required talking points, and objection type set what 'good' looks like for this session." },
  { label: "Historical baseline", detail: "A rep's own prior sessions, so trend lines mean something beyond a single score." },
];

const MOAT = [
  { icon: EyeOff, title: "Never a silently-faked signal", body: "If a real transcript isn't available for an upload, the product says so and falls back to acoustic-only metrics — it never fabricates text." },
  { icon: Layers, title: "Analysis, not a single score", body: "Six independent dimensions, each traceable to its own excerpt — not one blended number with no explanation." },
  { icon: ShieldCheck, title: "Deterministic by default", body: "Every dimension is computed the same way every time from the same input. No opaque model in the critical path unless you opt in." },
];

export default function ConversationIntelligencePage() {
  return (
    <V4CapabilityPage
      eyebrow="Conversation Intelligence"
      title="The analysis layer underneath every scored session."
      subtitle="Transcript, acoustic signal, and scenario context are analyzed together, then handed to the scorecard, the coach, and the manager dashboard. Try it below — click a highlighted line to see the evidence."
      heroWide={<V4PlatformSection />}
      heroPaddingBottom="pb-4"
      flowTitle="From raw signal to a specific recommendation."
      flow={FLOW}
      dataTitle="Two independent signal sources, not one."
      dataInputs={DATA_INPUTS}
      moatTitle="Honest about its own limits, on purpose."
      moat={MOAT}
      relatedSlugs={["roleplay", "voice-analysis", "scorecard"]}
    />
  );
}
