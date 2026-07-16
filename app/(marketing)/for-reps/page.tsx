import { Mic, Trophy, Repeat, Sparkles } from "lucide-react";
import { PageHero, Section, FeatureGrid, CtaBand } from "@/components/marketing/sections";

export const metadata = { title: "For reps" };

export default function ForRepsPage() {
  return (
    <>
      <PageHero eyebrow="For reps" title="Build the muscle memory before it costs you a deal." subtitle="Stop burning real doors while you find your footing. Rep the hard moments on your own time and walk up to the porch already warmed up." primaryCta={{ href: "/signup", label: "Start training" }} />
      <Section className="pb-16">
        <FeatureGrid items={[
          { icon: Mic, title: "Reps on demand", body: "Practice any personality — friendly, skeptical, price-focused, defensive — whenever you want, as many times as you want." },
          { icon: Sparkles, title: "Know your weak spot", body: "A skill tree shows exactly which part of your pitch is dragging your score down." },
          { icon: Repeat, title: "Drill the objection", body: "Retry straight from the moment you froze until the reframe is automatic." },
          { icon: Trophy, title: "Compete with yourself", body: "Streaks, most-improved and score leaderboards keep the reps honest." },
        ]} />
      </Section>
      <CtaBand title="Your best pitch is a few reps away." cta={{ href: "/signup", label: "Start Free" }} />
    </>
  );
}
