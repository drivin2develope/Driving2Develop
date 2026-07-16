"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { useToast } from "@/components/ui";

export function AssignmentDoneButton({ assignmentId }: { assignmentId: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  async function markDone() {
    setLoading(true);
    try {
      await fetch(`/api/assignments/${assignmentId}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: "DONE" }) });
      toast({ kind: "success", title: "Marked as done" });
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <button onClick={markDone} disabled={loading} className="text-xs text-[var(--color-secondary)] hover:text-[var(--color-green)] inline-flex items-center gap-1 disabled:opacity-60">
      <Check size={12} /> {loading ? "Marking done…" : "Mark as done"}
    </button>
  );
}
