"use client";

import { Tag, Mic, CheckCircle2, Database, BookOpen, Layers, Target, ListTree } from "lucide-react";
import { V4CapabilityPage } from "@/components/v4/V4CapabilityPage";
import { V4ObjectionExplorer } from "@/components/v4/V4ObjectionExplorer";

const FLOW = [
  { icon: Tag, label: "Objection tagged", desc: "Each scenario carries the objection category it's built to test." },
  { icon: Mic, label: "Rep encounters it live", desc: "During roleplay or a real recording, not a multiple-choice quiz." },
  { icon: CheckCircle2, label: "Response scored", desc: "Matched against the required talking points for that objection." },
  { icon: Database, label: "Outcome logged", desc: "Handled or missed, attached to the rep's real session history." },
  { icon: BookOpen, label: "Library surfaces the play", desc: "The next rep who hits this objection sees the structured response." },
];

const DATA_INPUTS = [
  { label: "Objection taxonomy", detail: "Category, difficulty, and a structured recommended-response sequence — not a single paragraph of advice." },
  { label: "Session transcript", detail: "Matched against the scenario's required talking points to determine if the objection was actually handled." },
  { label: "Example scripts", detail: "A concrete line a rep can say, not an abstract principle to interpret under pressure." },
  { label: "Per-rep handle rate", detail: "Computed from real sessions per category, so 'good at objections' means something specific." },
];

const MOAT = [
  { icon: ListTree, title: "Structured, not a blog post", body: "Every objection has the same shape: category, difficulty, why it happens, ordered steps, and a script — queryable and drillable, not prose to skim." },
  { icon: Target, title: "Handle rate is computed, not claimed", body: "Whether an objection was handled comes from matching the transcript against required talking points, not a rep's self-assessment." },
  { icon: Layers, title: "One category, one drill, one score", body: "Practice This Moment jumps straight into the exact objection category that broke down — not a generic 'objection handling' scenario." },
];

export default function ObjectionIntelligencePage() {
  return (
    <V4CapabilityPage
      eyebrow="Objection Intelligence"
      title="The objections that actually break deals, broken down the same way every time."
      subtitle="Category, difficulty, why it happens, an ordered response, and a script a rep can actually say — not a paragraph of general advice. Select an objection below."
      heroInline={
        <div className="mt-12">
          <V4ObjectionExplorer />
        </div>
      }
      flowTitle="From scenario tag to a logged, scoreable outcome."
      flow={FLOW}
      dataTitle="What makes a play worth trusting."
      dataInputs={DATA_INPUTS}
      moatTitle="A taxonomy, not a knowledge base article."
      moat={MOAT}
      relatedSlugs={["roleplay", "conversation-intelligence", "ai-coach"]}
    />
  );
}
