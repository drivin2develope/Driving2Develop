"use client";

import { Database, Calculator, MessageCircleQuestion, Bot, Ban, Layers, ShieldCheck } from "lucide-react";
import { V4CapabilityPage } from "@/components/v4/V4CapabilityPage";
import { V4CopilotChat } from "@/components/v4/V4CopilotChat";

const FLOW = [
  { icon: Database, label: "Roster + sessions pulled", desc: "Every rep reporting to this manager, with their scored session history." },
  { icon: Calculator, label: "Stats computed live", desc: "Needs-attention, weakest skill, improvement, and flags — on each visit." },
  { icon: MessageCircleQuestion, label: "Question asked", desc: "Tap a suggested question, or the copilot's default read on the team." },
  { icon: Bot, label: "Rule-based answer", desc: "Composed from the computed stats — not a model guessing at an answer." },
];

const DATA_INPUTS = [
  { label: "Team roster + sessions", detail: "The same underlying data as the Manager Dashboard and Team Analytics — no separate copilot-only dataset." },
  { label: "7-day improvement", detail: "Same computation that powers the Leaderboard's 'Most Improved' view." },
  { label: "Compliance flags", detail: "The same threshold-based flags shown on the Compliance page, summarized conversationally." },
  { label: "Pending assignment count", detail: "A live count from the Assignments queue, not a stale cached number." },
];

const MOAT = [
  { icon: Ban, title: "Answers are composed, not generated", body: "Every response is built from the same computed stats a manager could see on other pages — there's no free-text generation that could invent a number." },
  { icon: Layers, title: "One data source, five surfaces", body: "Copilot, Dashboard, Analytics, Leaderboard, and Compliance all read the same underlying session data — ask the copilot or check the page yourself, and they agree." },
  { icon: ShieldCheck, title: "A shortcut to the same truth", body: "The copilot doesn't know anything a manager couldn't find by clicking through — it just answers the question directly instead of requiring the click." },
];

export default function ManagerCopilotPage() {
  return (
    <V4CapabilityPage
      eyebrow="Manager Copilot"
      title="A shortcut to what you'd find anyway — just faster to ask."
      subtitle="Every answer is composed from the same real roster and session data behind the dashboard, analytics, and compliance pages — never a free-text guess. Tap a question below."
      heroInline={
        <div className="mt-12">
          <V4CopilotChat />
        </div>
      }
      flowTitle="From roster data to a direct answer."
      flow={FLOW}
      dataTitle="The same data, asked a different way."
      dataInputs={DATA_INPUTS}
      moatTitle="A shortcut, not a separate source of truth."
      moat={MOAT}
      relatedSlugs={["manager-dashboard", "compliance", "team-analytics"]}
    />
  );
}
