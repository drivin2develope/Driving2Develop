"use client";

import { Mic, Activity, Tags, LineChart, Lightbulb, ShieldCheck, EyeOff, Layers } from "lucide-react";
import "../../../v4-preview.css";
import { V4Nav } from "@/components/v4/V4Nav";
import { V4PlatformSection } from "@/components/v4/V4PlatformSection";
import { V4FinalCTA } from "@/components/v4/V4FinalCTA";
import { SectionHeading } from "@/components/v4/ui/SectionHeading";
import { V4Badge } from "@/components/v4/ui/V4Badge";
import { V4Card } from "@/components/v4/ui/V4Card";
import { V4FlowDiagram } from "@/components/v4/ui/V4FlowDiagram";
import { RelatedCapabilities } from "@/components/v4/RelatedCapabilities";
import { useV4Theme } from "@/components/v4/useV4Theme";

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
  const { theme, toggleTheme } = useV4Theme();

  return (
    <div className="v4-scope font-sans" data-v4-theme={theme} style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
      <V4Nav theme={theme} onToggleTheme={toggleTheme} />
      <main>
        <section className="relative overflow-hidden" style={{ background: "var(--v4-bg)" }}>
          <div className="absolute inset-0 v4-grid-bg opacity-[0.35]" aria-hidden="true" />
          <div className="relative max-w-[1600px] mx-auto px-6 md:px-10 pt-20 pb-4 md:pt-28">
            <div className="flex items-center gap-3 mb-5">
              <span className="v4-eyebrow">Conversation Intelligence</span>
              <V4Badge status="available" />
            </div>
            <h1 className="text-[2.6rem] leading-[1.05] md:text-[3.2rem] md:leading-[1.03] font-semibold tracking-tight max-w-3xl">
              The analysis layer underneath every scored session.
            </h1>
            <p className="mt-6 text-base md:text-lg max-w-xl" style={{ color: "var(--v4-text-secondary)" }}>
              Transcript, acoustic signal, and scenario context are analyzed together, then handed to the scorecard,
              the coach, and the manager dashboard. Try it below — click a highlighted line to see the evidence.
            </p>
          </div>
        </section>

        <V4PlatformSection />

        <section className="py-20 md:py-28 border-t" style={{ borderColor: "var(--v4-border)" }}>
          <div className="max-w-[1600px] mx-auto px-6 md:px-10">
            <SectionHeading eyebrow="How it works" title="From raw signal to a specific recommendation." />
            <div className="mt-12">
              <V4FlowDiagram nodes={FLOW} />
            </div>
          </div>
        </section>

        <section className="py-20 md:py-28 border-t" style={{ borderColor: "var(--v4-border)" }}>
          <div className="max-w-[1600px] mx-auto px-6 md:px-10">
            <SectionHeading eyebrow="What it's built on" title="Two independent signal sources, not one." />
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
            <SectionHeading eyebrow="Why it's hard to copy" title="Honest about its own limits, on purpose." />
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
              <RelatedCapabilities slugs={["roleplay", "voice-analysis", "scorecard"]} />
            </div>
          </div>
        </section>

        <V4FinalCTA />
      </main>
    </div>
  );
}
