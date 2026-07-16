import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { PageHeader, Card, ButtonLink } from "@/components/ui";
import { highlightTranscript, type EvidenceItem } from "@/lib/analysis";
import { ArrowLeft } from "lucide-react";

export const metadata = { title: "Transcript" };

export default async function TranscriptPage({ params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const session = await prisma.practiceSession.findUnique({ where: { id: params.id }, include: { user: true, metric: true } });
  if (!session) notFound();
  const isOwner = session.userId === user!.id;
  const isManagerOfOwner = user!.role === "MANAGER" && session.user.managerId === user!.id;
  if (!isOwner && !isManagerOfOwner) redirect("/dashboard");

  const highlighted = session.transcript ? highlightTranscript(session.transcript) : null;
  const evidence: EvidenceItem[] = session.metric ? JSON.parse(session.metric.evidenceJson || "[]") : [];
  // Map each evidence charIndex to the highlighted token whose span contains
  // it, so that token can carry a real #e-<charIndex> anchor - the same
  // offsets buildEvidence() computed from this exact transcript string.
  const anchorForTokenIndex = new Map<number, number>();
  if (highlighted) {
    let offset = 0;
    const remaining = evidence.filter((e) => e.charIndex !== null).map((e) => e.charIndex as number);
    highlighted.forEach((token, tokenIndex) => {
      const start = offset;
      const end = offset + token.text.length;
      const hitIdx = remaining.findIndex((ci) => ci >= start && ci < end);
      if (hitIdx !== -1) {
        anchorForTokenIndex.set(tokenIndex, remaining[hitIdx]);
        remaining.splice(hitIdx, 1);
      }
      offset = end;
    });
  }

  return (
    <div>
      <PageHeader eyebrow="Transcript" title="Full transcript"
        action={<ButtonLink href={`/report/${session.id}`} variant="secondary" size="sm"><ArrowLeft size={15} /> Back to scorecard</ButtonLink>} />
      <div className="px-5 md:px-8 pb-10 space-y-4">
        <div className="flex flex-wrap gap-4 text-xs text-[var(--color-secondary)]">
          <span className="flex items-center gap-1.5"><span className="inline-block w-3 h-3 rounded bg-[rgba(52,211,153,0.3)]" /> Keyword / talking point</span>
          <span className="flex items-center gap-1.5"><span className="inline-block w-3 h-3 rounded bg-[rgba(248,113,113,0.3)]" /> Filler word</span>
        </div>
        <Card>
          {highlighted ? (
            <p className="text-sm leading-loose">
              {highlighted.map((t, i) => {
                const anchorCharIndex = anchorForTokenIndex.get(i);
                const className =
                  t.type === "filler"
                    ? "bg-[rgba(248,113,113,0.18)] text-[var(--color-red)] rounded px-0.5"
                    : t.type === "keyword"
                    ? "bg-[rgba(52,211,153,0.18)] text-[var(--color-green)] rounded px-0.5"
                    : "";
                return anchorCharIndex !== undefined ? (
                  <span key={i} id={`e-${anchorCharIndex}`} className={`evidence-anchor ${className}`}>
                    {t.text}
                  </span>
                ) : (
                  <span key={i} className={className}>
                    {t.text}
                  </span>
                );
              })}
            </p>
          ) : (
            <p className="text-sm text-[var(--color-secondary)]">No transcript recorded for this session.</p>
          )}
        </Card>
      </div>
    </div>
  );
}
