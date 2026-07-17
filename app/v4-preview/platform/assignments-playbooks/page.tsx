"use client";

import { AlertTriangle, Target, BookOpen, CalendarClock, CheckCircle2, Link2, RefreshCcw, LayoutList } from "lucide-react";
import { V4CapabilityPage } from "@/components/v4/V4CapabilityPage";
import { V4AssignmentFlow } from "@/components/v4/V4AssignmentFlow";

const FLOW = [
  { icon: AlertTriangle, label: "Gap identified", desc: "A rep's weakest metric, from real session data, not a guess." },
  { icon: Target, label: "Scenario matched", desc: "The exact objection category and difficulty that targets the gap." },
  { icon: BookOpen, label: "Playbook linked", desc: "The assignment carries the specific play behind the drill." },
  { icon: CalendarClock, label: "Due date set", desc: "A manager sets urgency, not just a floating to-do." },
  { icon: CheckCircle2, label: "Outcome tracked", desc: "Completion and the resulting score change, in one place." },
];

const DATA_INPUTS = [
  { label: "Assignment record", detail: "Manager, rep, scenario, note, and due date — a real relational record, not a sticky note." },
  { label: "Playbook entries", detail: "Section, title, body, and tags — structured content a manager can reference and reuse, not a one-off note." },
  { label: "Assignment status", detail: "Pending or complete, so a manager's queue reflects reality without a manual check-in." },
  { label: "Linked scenario", detail: "Every assignment points at a real scenario in the practice library, not a vague instruction." },
];

const MOAT = [
  { icon: Link2, title: "Assignment and playbook are linked, not parallel", body: "Every assignment carries the specific playbook entry behind it — a rep never gets a task with no context for why." },
  { icon: LayoutList, title: "A queue, not a chat message", body: "Assignments are structured records with status and due dates — nothing depends on a manager remembering what they asked for." },
  { icon: RefreshCcw, title: "Closes the loop automatically", body: "An assignment's outcome (score before/after) is visible from the same record — no separate spreadsheet to reconcile." },
];

export default function AssignmentsPlaybooksPage() {
  return (
    <V4CapabilityPage
      eyebrow="Assignments & Playbooks"
      title="Every assignment carries the play behind it — not just a task."
      subtitle="A rep's real gap routes to the exact scenario that targets it, linked to the playbook entry that explains why. Select an assignment below."
      heroInline={
        <div className="mt-12">
          <V4AssignmentFlow />
        </div>
      }
      flowTitle="From a real gap to a tracked, linked assignment."
      flow={FLOW}
      dataTitle="What ties an assignment to a play."
      dataInputs={DATA_INPUTS}
      moatTitle="Structured records, not a to-do list."
      moat={MOAT}
      relatedSlugs={["manager-dashboard", "objection-intelligence", "compliance"]}
    />
  );
}
