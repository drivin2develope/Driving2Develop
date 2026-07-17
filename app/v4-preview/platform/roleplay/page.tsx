"use client";

import { Mic, MessageSquareText, Activity, Gauge as GaugeIcon, ClipboardCheck, ShieldCheck, Cpu } from "lucide-react";
import "../../../v4-preview.css";
import { V4Nav } from "@/components/v4/V4Nav";
import { V4FinalCTA } from "@/components/v4/V4FinalCTA";
import { SectionHeading } from "@/components/v4/ui/SectionHeading";
import { V4Badge } from "@/components/v4/ui/V4Badge";
import { V4FlowDiagram } from "@/components/v4/ui/V4FlowDiagram";
import { V4DataGrid } from "@/components/v4/ui/V4DataGrid";
import { V4MoatGrid } from "@/components/v4/ui/V4MoatGrid";
import { V4ConversationReplay } from "@/components/v4/V4ConversationReplay";
import { RelatedCapabilities } from "@/components/v4/RelatedCapabilities";
import { useV4Theme } from "@/components/v4/useV4Theme";

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
  { icon: GaugeIcon, title: "Zero-dependency scoring", body: "Every score is deterministic computation over the transcript and audio signal. No paid API is required for the core product to work." },
];

export default function RoleplayPage() {
  const { theme, toggleTheme } = useV4Theme();

  return (
    <div className="v4-scope font-sans" data-v4-theme={theme} style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
      <V4Nav theme={theme} onToggleTheme={toggleTheme} />
      <main id="main-content">
        <section className="relative overflow-hidden" style={{ background: "var(--v4-bg)" }}>
          <div className="absolute inset-0 v4-grid-bg opacity-[0.35]" aria-hidden="true" />
          <div
            className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full blur-[120px] opacity-20"
            style={{ background: "var(--v4-gold-b)" }}
            aria-hidden="true"
          />
          <div className="relative max-w-[1600px] mx-auto px-6 md:px-10 pt-20 pb-16 md:pt-28">
            <div className="flex items-center gap-3 mb-5">
              <span className="v4-eyebrow">AI Roleplay Simulator</span>
              <V4Badge status="available" />
            </div>
            <h1 className="text-[2.6rem] leading-[1.05] md:text-[3.2rem] md:leading-[1.03] font-semibold tracking-tight max-w-3xl">
              A homeowner that reacts to what you actually said — not a script that plays out the same way twice.
            </h1>
            <p className="mt-6 text-base md:text-lg max-w-xl" style={{ color: "var(--v4-text-secondary)" }}>
              Every roleplay carries a real trust and irritation state across the whole conversation. Push too hard
              on price and the homeowner gets defensive for the rest of the session — exactly like a real doorstep.
            </p>

            <div className="mt-12">
              <V4ConversationReplay />
            </div>
            <p className="mt-4 text-xs max-w-4xl" style={{ color: "var(--v4-text-tertiary)" }}>
              Illustrative session data. Drag the timeline to replay how trust and irritation shifted through the
              conversation.
            </p>
          </div>
        </section>

        <section className="py-20 md:py-28 border-t" style={{ borderColor: "var(--v4-border)" }}>
          <div className="max-w-[1600px] mx-auto px-6 md:px-10">
            <SectionHeading eyebrow="How it works" title="Five steps, every turn of the conversation." />
            <div className="mt-12">
              <V4FlowDiagram nodes={FLOW} />
            </div>
          </div>
        </section>

        <section className="py-20 md:py-28 border-t" style={{ borderColor: "var(--v4-border)" }}>
          <div className="max-w-[1600px] mx-auto px-6 md:px-10">
            <SectionHeading eyebrow="What it's built on" title="The data behind every score." />
            <div className="mt-12">
              <V4DataGrid items={DATA_INPUTS} />
            </div>
          </div>
        </section>

        <section className="py-20 md:py-28 border-t" style={{ borderColor: "var(--v4-border)" }}>
          <div className="max-w-[1600px] mx-auto px-6 md:px-10">
            <SectionHeading eyebrow="Why it's hard to copy" title="Not a demo trick — a stateful system." />
            <div className="mt-12">
              <V4MoatGrid items={MOAT} />
            </div>
          </div>
        </section>

        <section className="py-20 md:py-28 border-t" style={{ borderColor: "var(--v4-border)" }}>
          <div className="max-w-[1600px] mx-auto px-6 md:px-10">
            <SectionHeading eyebrow="Related capabilities" title="Part of one connected system." />
            <div className="mt-10">
              <RelatedCapabilities slugs={["conversation-intelligence", "objection-intelligence", "ai-coach"]} />
            </div>
          </div>
        </section>

        <V4FinalCTA />
      </main>
    </div>
  );
}
