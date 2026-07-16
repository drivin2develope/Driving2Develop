import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { PageHeader, Card, CardHeader, Badge, StatCard, ButtonLink, ProgressRing } from "@/components/ui";
import { PaceLineChart, ScoreCategoryBars } from "@/components/charts";
import { formatDuration, scoreColorClass } from "@/lib/analysis";
import { formatDateTime } from "@/lib/utils";
import { ArrowRight, FileText, Lightbulb } from "lucide-react";

const METRIC_TO_PERSONALITY: Record<string, string[]> = {
  "Objection Handling": ["defensive", "skeptical"],
  "Closing Strength": ["analytical", "price-focused"],
  Clarity: ["friendly", "busy"],
  Confidence: ["friendly"],
  "Script Adherence": ["busy", "friendly"],
};

export default async function ReportPage({ params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const session = await prisma.practiceSession.findUnique({ where: { id: params.id }, include: { metric: true, scenario: true, user: true } });
  if (!session) notFound();

  const isOwner = session.userId === user!.id;
  const isManagerOfOwner = user!.role === "MANAGER" && session.user.managerId === user!.id;
  if (!isOwner && !isManagerOfOwner) redirect("/dashboard");

  const metric = session.metric;
  if (!metric) {
    return (
      <div>
        <PageHeader title="Processing" subtitle="This session is still being scored." />
        <div className="px-5 md:px-8"><Card>Check back in a moment — your scorecard is being built.</Card></div>
      </div>
    );
  }

  const tips: string[] = JSON.parse(metric.tipsJson || "[]");
  const paceTimeline: { t: string; wpm: number }[] = JSON.parse(metric.paceTimelineJson || "[]");
  const categories = [
    { label: "Clarity", value: metric.clarityScore },
    { label: "Script Adherence", value: metric.keywordAdherenceScore },
    ...(metric.objectionHandledScore !== null ? [{ label: "Objection Handling", value: metric.objectionHandledScore }] : []),
    { label: "Closing Strength", value: metric.closingStrengthScore },
    { label: "Confidence", value: metric.confidenceScore },
    { label: "Pacing", value: Math.max(0, 100 - metric.paceVariance) },
  ];
  const weakest = [...categories].sort((a, b) => a.value - b.value)[0];
  const targets = METRIC_TO_PERSONALITY[weakest?.label] ?? [];
  const recommended = targets.length > 0 ? await prisma.scenario.findFirst({ where: { personality: { in: targets }, isLocked: false } }) : null;
  const transcriptUnavailable = session.source === "UPLOAD" && !session.transcript;

  return (
    <div>
      <PageHeader eyebrow="Scorecard" title={session.scenario?.title ?? "Uploaded Recording"}
        subtitle={`${formatDateTime(session.createdAt)} · ${formatDuration(session.durationSeconds)} · ${session.source}`}
        action={<ButtonLink href={`/practice/session${recommended ? `?scenarioId=${recommended.id}` : ""}`} size="sm">Practice this weakness <ArrowRight size={15} /></ButtonLink>} />

      <div className="px-5 md:px-8 pb-10 space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="flex flex-col items-center justify-center py-7">
            <ProgressRing value={metric.overallScore} size={92} stroke={7} label={<span className={`text-2xl font-semibold ${scoreColorClass(metric.overallScore)}`}>{metric.overallScore}</span>} />
            <span className="text-2xs uppercase tracking-wide text-[var(--color-secondary)] mt-3">Overall Pitch Score</span>
          </Card>
          <StatCard label="Confidence" value={metric.confidenceScore} accent="purple" />
          <StatCard label="Words / Min" value={Math.round(metric.wordsPerMinute)} accent="blue" />
          <StatCard label="Filler Words" value={metric.fillerWordCount} suffix={`(${metric.fillerWordRate.toFixed(1)}%)`} accent="orange" />
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader title={session.source === "LIVE" ? "Pace Over Time" : "Energy Over Time"}
              subtitle={session.source === "LIVE" ? "Words per minute from your real transcript timing." : "Relative vocal energy from real audio analysis."} />
            {paceTimeline.length > 0 ? <PaceLineChart data={paceTimeline} /> : <p className="text-sm text-[var(--color-secondary)] py-10 text-center">Not enough data for this chart.</p>}
          </Card>
          <Card>
            <CardHeader title="Score Categories" />
            <ScoreCategoryBars data={categories} />
          </Card>
        </div>

        <Card>
          <CardHeader title={<span className="flex items-center gap-2"><Lightbulb size={15} className="text-[var(--color-gold)]" /> Coaching Tips</span>}
            action={<Link href="/coach" className="text-xs text-[var(--color-gold)]">Ask the coach →</Link>} />
          <ul className="space-y-2.5">
            {tips.map((tip, i) => (
              <li key={i} className="flex gap-2.5 text-sm">
                <span className="text-[var(--color-gold)] font-semibold">{i + 1}.</span>
                <span className="text-[var(--color-secondary)]">{tip}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <CardHeader title="Transcript"
            action={<div className="flex items-center gap-3">
              <Badge color={metric.transcriptConfidence === "HIGH" ? "green" : metric.transcriptConfidence === "MEDIUM" ? "orange" : "default"}>{metric.transcriptConfidence} confidence</Badge>
              {!transcriptUnavailable && session.transcript && <Link href={`/report/${session.id}/transcript`} className="text-xs text-[var(--color-gold)] inline-flex items-center gap-1"><FileText size={13} /> Full view</Link>}
            </div>} />
          {transcriptUnavailable ? (
            <p className="text-sm text-[var(--color-secondary)]">Transcript unavailable — this requires speech-to-text. Add an <code className="px-1 py-0.5 rounded bg-white/5">OPENAI_API_KEY</code> to unlock automatically on future uploads.</p>
          ) : session.transcript ? (
            <p className="text-sm leading-relaxed text-[var(--color-secondary)] line-clamp-4">{session.transcript}</p>
          ) : (
            <p className="text-sm text-[var(--color-secondary)]">No transcript recorded for this session.</p>
          )}
        </Card>
      </div>
    </div>
  );
}
