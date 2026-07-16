import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { PageHeader, Card, CardHeader, StatCard, Badge, EmptyState, ButtonLink, ProgressRing, Stagger, StaggerItem } from "@/components/ui";
import { SkillRadarChart } from "@/components/charts";
import { computeStreak, sevenDayImprovement, practiceMinutes, radarDataFromMetric, strengthsAndWeaknesses } from "@/lib/stats";
import { formatDuration } from "@/lib/analysis";
import { relativeTime } from "@/lib/utils";
import { ArrowRight, TrendingUp, Clock, Flame, Target, Mic } from "lucide-react";
import { AssignmentDoneButton } from "@/components/AssignmentDoneButton";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const [sessions, assignment, scenarios] = await Promise.all([
    prisma.practiceSession.findMany({ where: { userId: user.id }, include: { metric: true, scenario: true }, orderBy: { createdAt: "desc" } }),
    prisma.assignment.findFirst({ where: { repId: user.id, status: "PENDING" }, include: { scenario: true, manager: true }, orderBy: { createdAt: "desc" } }),
    prisma.scenario.findMany({ where: { isLocked: false }, orderBy: { createdAt: "asc" }, take: 1 }),
  ]);

  const latest = sessions[0];
  const overall = latest?.metric?.overallScore ?? null;
  const improvement = sevenDayImprovement(sessions as any);
  const minutes = practiceMinutes(sessions as any);
  const streak = computeStreak(sessions as any);
  const radarData = radarDataFromMetric(latest?.metric as any);
  const { strengths, weaknesses } = strengthsAndWeaknesses(latest?.metric as any);
  const recommended = assignment?.scenario ?? scenarios[0];

  return (
    <div>
      <PageHeader eyebrow="Dashboard" title={`Welcome back, ${user.name.split(" ")[0]}`} subtitle="Here's where you stand today."
        action={<ButtonLink href="/practice"><Mic size={16} /> Practice now</ButtonLink>} />

      <div className="px-5 md:px-8 space-y-6 pb-10">
        <Card className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-[rgba(227,179,65,0.22)]">
          <div className="min-w-0">
            <Badge color="gold"><Target size={12} /> Today&apos;s Focus</Badge>
            {assignment ? (
              <>
                <h3 className="font-medium mt-2.5">{assignment.scenario?.title ?? "Practice drill"}</h3>
                <p className="text-sm text-[var(--color-secondary)] mt-1 max-w-lg">Assigned by {assignment.manager.name}: {assignment.note}</p>
                <div className="mt-2"><AssignmentDoneButton assignmentId={assignment.id} /></div>
              </>
            ) : recommended ? (
              <>
                <h3 className="font-medium mt-2.5">{recommended.title}</h3>
                <p className="text-sm text-[var(--color-secondary)] mt-1 max-w-lg">Recommended based on your goals — {recommended.description}</p>
              </>
            ) : (
              <h3 className="font-medium mt-2.5">You&apos;re all caught up</h3>
            )}
          </div>
          <ButtonLink href={`/practice/session${recommended ? `?scenarioId=${recommended.id}` : ""}`} className="shrink-0">
            Start practice <ArrowRight size={16} />
          </ButtonLink>
        </Card>

        <Stagger className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StaggerItem><StatCard label="Overall Score" value={overall ?? "—"} accent="gold" icon={<Target size={15} />} /></StaggerItem>
          <StaggerItem><StatCard label="7-Day Trend" value={improvement === 0 ? "—" : `${improvement > 0 ? "+" : ""}${improvement}`} accent={improvement >= 0 ? "green" : "red"} icon={<TrendingUp size={15} />} /></StaggerItem>
          <StaggerItem><StatCard label="Practice Minutes" value={minutes} suffix="min" accent="blue" icon={<Clock size={15} />} /></StaggerItem>
          <StaggerItem><StatCard label="Streak" value={streak} suffix={streak === 1 ? "day" : "days"} accent="orange" icon={<Flame size={15} />} /></StaggerItem>
        </Stagger>

        {sessions.length === 0 ? (
          <EmptyState icon={<Mic size={22} />} title="No practice sessions yet"
            description="Run your first live roleplay to see your scorecard, radar chart, and coaching tips populate here."
            action={<ButtonLink href="/practice">Start your first drill <ArrowRight size={16} /></ButtonLink>} />
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader title="Skill Breakdown" subtitle="From your latest session" action={overall !== null ? <ProgressRing value={overall} size={54} stroke={5} /> : null} />
              {radarData.length > 0 ? <SkillRadarChart data={radarData} /> : <p className="text-sm text-[var(--color-secondary)] py-10 text-center">Not enough data yet.</p>}
            </Card>
            <div className="space-y-4">
              <Card>
                <CardHeader title="Strengths" />
                <div className="space-y-2.5">
                  {strengths.map((s) => (
                    <div key={s.label} className="flex items-center justify-between text-sm">
                      <span className="text-[var(--color-secondary)]">{s.label}</span>
                      <span className="font-medium text-[var(--color-green)] tabular-nums">{s.value}</span>
                    </div>
                  ))}
                </div>
              </Card>
              <Card>
                <CardHeader title="Focus Areas" action={<Link href="/skills" className="text-xs text-[var(--color-gold-text)]">Skills →</Link>} />
                <div className="space-y-2.5">
                  {weaknesses.map((s) => (
                    <div key={s.label} className="flex items-center justify-between text-sm">
                      <span className="text-[var(--color-secondary)]">{s.label}</span>
                      <span className="font-medium text-[var(--color-orange)] tabular-nums">{s.value}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        )}

        {sessions.length > 0 && (
          <Card>
            <CardHeader title="Recent Sessions" action={<Link href="/history" className="text-xs text-[var(--color-gold-text)]">View all</Link>} />
            <div className="divide-y divide-[var(--color-border)]">
              {sessions.slice(0, 5).map((s) => (
                <Link key={s.id} href={`/report/${s.id}`} className="flex items-center justify-between py-3 text-sm hover:bg-[var(--color-border)] -mx-2 px-2 rounded-lg">
                  <div>
                    <p className="font-medium">{s.scenario?.title ?? "Uploaded recording"}</p>
                    <p className="text-xs text-[var(--color-secondary)] mt-0.5">{relativeTime(s.createdAt)} · {formatDuration(s.durationSeconds)} · {s.source}</p>
                  </div>
                  <span className="text-lg font-semibold text-[var(--color-gold-text)] tabular-nums">{s.metric?.overallScore ?? "—"}</span>
                </Link>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
