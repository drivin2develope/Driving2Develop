import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { PageHeader, Card, CardHeader, Badge, StatCard, ButtonLink, ProgressRing } from "@/components/ui";
import { PaceLineChart, ScoreCategoryBars } from "@/components/charts";
import { formatDuration, scoreColorClass, SKILL_TO_PERSONALITY, type CoachingTip } from "@/lib/analysis";
import { formatDateTime } from "@/lib/utils";
import { ArrowRight, FileText, Lightbulb, Target } from "lucide-react";

const SKILL_LABELS: Record<string, string> = {
  objectionHandled: "Objection Handling",
  closingStrength: "Closing Strength",
  clarity: "Clarity",
  confidence: "Confidence",
  keywordAdherence: "Script Adherence",
  pacing: "Pacing",
};

async function recommendedScenarioFor(skill: string | null) {
  const targets = skill ? SKILL_TO_PERSONALITY[skill] ?? [] : [];
  if (targets.length === 0) return null;
  return prisma.scenario.findFirst({ where: { personality: { in: targets }, isLocked: false } });
}

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

  const rawTips: unknown[] = JSON.parse(metric.tipsJson || "[]");
  const tips: CoachingTip[] = rawTips.map((t) => (typeof t === "string" ? { skill: null, tip: t } : (t as CoachingTip)));
  const paceTimeline: { t: string; wpm: number }[] = JSON.parse(metric.paceTimelineJson || "[]");
  const categories = [
    { key: "clarity", label: "Clarity", value: metric.clarityScore },
    { key: "keywordAdherence", label: "Script Adherence", value: metric.keywordAdherenceScore },
    ...(metric.objectionHandledScore !== null ? [{ key: "objectionHandled", label: "Objection Handling", value: metric.objectionHandledScore }] : []),
    { key: "closingStrength", label: "Closing Strength", value: metric.closingStrengthScore },
    { key: "confidence", label: "Confidence", value: metric.confidenceScore },
    { key: "pacing", label: "Pacing", value: Math.max(0, 100 - metric.paceVariance) },
  ];
  const weakest = [...categories].sort((a, b) => a.value - b.value)[0];
  const recommended = await recommendedScenarioFor(weakest?.key ?? null);
  const tipScenarios = await Promise.all(tips.map((t) => recommendedScenarioFor(t.skill)));
  const transcriptUnavailable = session.source === "UPLOAD" && !session.transcript;

  return (
    <div>
      <PageHeader eyebrow="Scorecard" title={session.scenario?.title ?? "Uploaded Recording"}
        subtitle={`${formatDateTime(session.createdAt)} · ${formatDuration(session.durationSeconds)} · ${session.source}`}
        action={<ButtonLink href={`/practice/session${recommended ? `?scenarioId=${recommended.id}` : ""}`} size="sm">Practice This Moment <ArrowRight size={15} /></ButtonLink>} />

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
          <CardHeader title={<span className="flex items-center gap-2"><Lightbulb size={15} className="text-[var(--color-gold-text)]" /> Coaching Tips</span>}
            action={<Link href="/coach" className="text-xs text-[var(--color-gold-text)]">Ask the coach →</Link>} />
          <ul className="space-y-3">
            {tips.map((t, i) => {
              const scenario = tipScenarios[i];
              return (
                <li key={i} className="flex items-start justify-between gap-3 text-sm">
                  <div className="flex gap-2.5">
                    <span className="text-[var(--color-gold-text)] font-semibold">{i + 1}.</span>
                    <span className="text-[var(--color-secondary)]">
                      {t.skill && <span className="text-xs uppercase tracking-wide text-[var(--color-disabled)] mr-1.5">{SKILL_LABELS[t.skill] ?? t.skill}</span>}
                      {t.tip}
                    </span>
                  </div>
                  {scenario && (
                    <Link
                      href={`/practice/session?scenarioId=${scenario.id}`}
                      className="shrink-0 text-xs text-[var(--color-gold-text)] inline-flex items-center gap-1 whitespace-nowrap"
                    >
                      <Target size={12} /> Practice This Moment
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </Card>

        <Card>
          <CardHeader title="Transcript"
            action={<div className="flex items-center gap-3">
              <Badge color={metric.transcriptConfidence === "HIGH" ? "green" : metric.transcriptConfidence === "MEDIUM" ? "orange" : "default"}>{metric.transcriptConfidence} confidence</Badge>
              {!transcriptUnavailable && session.transcript && <Link href={`/report/${session.id}/transcript`} className="text-xs text-[var(--color-gold-text)] inline-flex items-center gap-1"><FileText size={13} /> Full view</Link>}
            </div>} />
          {transcriptUnavailable ? (
            <p className="text-sm text-[var(--color-secondary)]">Transcript unavailable — this requires speech-to-text. Add an <code className="px-1 py-0.5 rounded bg-[var(--color-border)]">OPENAI_API_KEY</code> to unlock automatically on future uploads.</p>
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
