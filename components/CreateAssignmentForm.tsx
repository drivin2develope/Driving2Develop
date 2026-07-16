"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Field, Select, Textarea, Input, Button, useToast } from "@/components/ui";

export function CreateAssignmentForm({
  reps,
  scenarios,
  initialRepId,
}: {
  reps: { id: string; name: string }[];
  scenarios: { id: string; title: string }[];
  initialRepId?: string;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [repId, setRepId] = useState(initialRepId && reps.some((r) => r.id === initialRepId) ? initialRepId : reps[0]?.id ?? "");
  const [scenarioId, setScenarioId] = useState("");
  const [note, setNote] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (note.trim().length < 3) return setError("Add a short note so the rep knows what to focus on.");
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/assignments", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ repId, scenarioId: scenarioId || null, note, dueDate: dueDate || null }) });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed to create assignment."); return; }
      toast({ kind: "success", title: "Assignment created", description: "The rep will see it as today's focus." });
      router.push("/manager/assignments");
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  }

  if (reps.length === 0) return <p className="text-sm text-[var(--color-secondary)]">Add reps to your team before creating assignments.</p>;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Field label="Rep"><Select value={repId} onChange={(e) => setRepId(e.target.value)}>{reps.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}</Select></Field>
      <Field label="Scenario (optional)"><Select value={scenarioId} onChange={(e) => setScenarioId(e.target.value)}><option value="">No specific scenario</option>{scenarios.map((s) => <option key={s.id} value={s.id}>{s.title}</option>)}</Select></Field>
      <Field label="Note" error={error}><Textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="What should they focus on?" error={!!error} /></Field>
      <Field label="Due date (optional)"><Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} /></Field>
      <Button type="submit" loading={submitting} className="w-full">{submitting ? "Creating…" : "Create assignment"}</Button>
    </form>
  );
}
