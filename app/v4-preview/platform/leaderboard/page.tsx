"use client";

import { Trophy, Users, Calculator, Award, ListOrdered, RefreshCw, Scale } from "lucide-react";
import { V4CapabilityPage } from "@/components/v4/V4CapabilityPage";
import { V4LeaderboardExplorer } from "@/components/v4/V4LeaderboardExplorer";

const FLOW = [
  { icon: Users, label: "Peer group scoped", desc: "A manager's roster, or a rep's teammates under the same manager." },
  { icon: Calculator, label: "Three views computed", desc: "Best score, 7-day improvement, and daily practice streak." },
  { icon: ListOrdered, label: "Ranked", desc: "Sorted independently per view — a rep can lead one and trail another." },
  { icon: Award, label: "Surfaced", desc: "Three tabs, not one blended ranking that hides the story." },
];

const DATA_INPUTS = [
  { label: "Best score", detail: "The highest overall score across the rep's session history — a ceiling, not an average." },
  { label: "7-day improvement", detail: "Change in score over the trailing week — rewards recent trajectory, not lifetime performance." },
  { label: "Practice streak", detail: "Consecutive days with a scored session — rewards the habit, independent of skill level." },
  { label: "Peer group boundaries", detail: "Scoped to the org hierarchy, so a rep only ever ranks against the team they're actually part of." },
];

const MOAT = [
  { icon: Scale, title: "Three rankings, not one score", body: "Highest score, most improved, and longest streak reward different things on purpose — a new rep can lead on streak without competing on raw score yet." },
  { icon: RefreshCw, title: "Recomputed from real sessions", body: "Every rank is derived from actual scored sessions each time it's viewed — not a cached vanity number that drifts from reality." },
  { icon: Trophy, title: "Scoped to a real peer group", body: "Rankings respect the org hierarchy automatically — a rep never sees themselves ranked against people they don't actually work with." },
];

export default function LeaderboardPage() {
  return (
    <V4CapabilityPage
      eyebrow="Leaderboard & Gamification"
      title="Three ways to be recognized, not just one score to chase."
      subtitle="Highest score, most improved, and longest streak — a new rep can lead on habit-building before they ever top the score board. Switch tabs below."
      heroInline={
        <div className="mt-12">
          <V4LeaderboardExplorer />
        </div>
      }
      flowTitle="From a peer group to three independent rankings."
      flow={FLOW}
      dataTitle="What each ranking actually rewards."
      dataInputs={DATA_INPUTS}
      moatTitle="Recognition with more than one way to win."
      moat={MOAT}
      relatedSlugs={["manager-dashboard", "team-analytics", "ai-coach"]}
    />
  );
}
