"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Card, ButtonLink, ProgressRing } from "@/components/ui";

export function ProcessingComplete({ id, ready, score, transcriptUnavailable }: { id: string; ready: boolean; score: number | null; transcriptUnavailable: boolean }) {
  const router = useRouter();
  useEffect(() => {
    const t = setTimeout(() => router.push(`/report/${id}`), 2200);
    return () => clearTimeout(t);
  }, [id, router]);

  return (
    <div className="px-5 md:px-8 py-16 flex justify-center">
      <Card className="max-w-md w-full text-center py-12">
        <div className="mx-auto mb-5 flex items-center justify-center">
          {score !== null ? <ProgressRing value={score} size={88} stroke={7} /> : <CheckCircle2 size={40} className="text-[var(--color-green)]" />}
        </div>
        <h2 className="text-lg font-semibold">Analysis complete</h2>
        <p className="text-sm text-[var(--color-secondary)] mt-2 max-w-xs mx-auto">
          {ready ? "Your scorecard is ready. Taking you there now…" : "Still finalizing your scorecard…"}
        </p>
        {transcriptUnavailable && (
          <p className="text-xs text-[var(--color-disabled)] mt-3">Transcript-based metrics were unavailable for this upload — acoustic metrics only.</p>
        )}
        <ButtonLink href={`/report/${id}`} className="mt-6">View scorecard <ArrowRight size={16} /></ButtonLink>
      </Card>
    </div>
  );
}
