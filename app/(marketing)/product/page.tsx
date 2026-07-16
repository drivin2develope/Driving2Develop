import { Mic, Gauge, MessageSquare, Repeat, BarChart3, ShieldCheck, Upload, Trophy } from "lucide-react";
import { PageHero, Section, FeatureGrid, CtaBand } from "@/components/marketing/sections";
import { FadeIn } from "@/components/ui";

export const metadata = { title: "Product" };

export default function ProductPage() {
  return (
    <>
      <PageHero
        eyebrow="Product"
        title="Everything a rep needs to get sharper, in one place."
        subtitle="Live roleplay, honest scorecards, rule-based coaching, and a manager cockpit — all built on real transcript and audio analysis, no paid AI required."
        primaryCta={{ href: "/signup", label: "Start Free" }}
        secondaryCta={{ href: "/how-it-works", label: "How it works" }}
      />
      <Section className="pb-16">
        <FeatureGrid
          items={[
            { icon: Mic, title: "Live roleplay", body: "Mic on, against a scripted homeowner personality tuned to your level. Real speech recognition, real transcript." },
            { icon: Gauge, title: "Real scorecard", body: "Pace, filler words, tone, script adherence, objection handling and closing strength — all deterministic, never faked." },
            { icon: MessageSquare, title: "Rule-based coach", body: "Targeted tips driven by your lowest metrics with clickable follow-ups. Honest about what it is." },
            { icon: Repeat, title: "Retry from weakness", body: "Jump straight back into a scenario matched to the skill you scored lowest on." },
            { icon: Upload, title: "Upload analysis", body: "Drop a real field recording and get pacing, pauses, and energy from genuine signal processing." },
            { icon: BarChart3, title: "Manager cockpit", body: "Roster, needs-attention flags, team weakness aggregation, assignments and analytics." },
            { icon: Trophy, title: "Leaderboards & streaks", body: "Most improved, highest score and longest streak — computed from real session data." },
            { icon: ShieldCheck, title: "Privacy first", body: "Your recordings stay yours. Transcription only happens if your operator opts in." },
          ]}
        />
      </Section>
      <CtaBand title="See it on your own pitch." cta={{ href: "/signup", label: "Create your free account" }} />
    </>
  );
}
