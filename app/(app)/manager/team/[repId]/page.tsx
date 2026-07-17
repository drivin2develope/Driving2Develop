import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { PageHeader, Card, CardHeader, StatCard, Avatar, Badge, ButtonLink } from "@/components/ui";
import { SkillRadarChart } from "@/components/charts";
import { computeStreak, sevenDayImprovement, radarDataFromMetric } from "@/lib/stats";
import { formatDuration } from "@/lib/analysis";
import { relativeTime } from "@/lib/utils";
import { ArrowLeft, ClipboardList } from "lucide-react";

export default async function RepDetailPage({ params }: { params: { repId: string } }) {
  const user = await getCurrentUser();
  if (!user || user.role !== "MANAGER") redirect("/dashboard");
  const rep = await prisma.user.findUnique({ where: { id: params.repId }, include: { sessions: { include: { metric: true, scenario: true }, orderBy: { createdAt: "desc" } } } });
  if (!rep || rep.managerId !== user.id) notFound();

  const latest = rep.sessions[0];
  const avg = rep.sessions.filter((s) => s.metric).length ? Math.round(rep.sessions.reduce((a, s) => a + (s.metric?.overallScore ?? 0), 0) / rep.sessions.filter((s) => s.metric).length) : null;
  const streak = computeStreak(rep.sessions as any);
  const improvement = sevenDayImprovement(rep.sessions as any);
  const radar = radarDataFromMetric(latest?.metric as any);

  return (
    <div>
      <PageHeader eyebrow="Team member" title={rep.name} subtitle={rep.email}
        action={<ButtonLink href={`/manager/assignments/new?repId=${rep.id}`} size="sm"><ClipboardList size={15} /> Assign drill</ButtonLink>} />
      <div className="px-5 md:px-8 pb-10 space-y-6">
        <Link href="/manager/team" className="inline-flex items-center gap-1.5 text-sm text-[var(--color-secondary)] hover:text-[var(--color-primary)]"><ArrowLeft size={15} /> Full team</Link>
        <div className="flex items-center gap-4">
          <Avatar name={rep.name} size={56} />
          <div className="flex flex-wrap gap-2">
            <Badge>{rep.experienceLevel ?? "—"}</Badge>
            <Badge color="blue">{rep.sessions.length} sessions</Badge>
            {latest && <Badge color="gold">Last active {relativeTime(latest.createdAt)}</Badge>}
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Latest score" value={latest?.metric?.overallScore ?? "—"} accent="gold" />
          <StatCard label="Average" value={avg ?? "—"} accent="blue" />
          <StatCard label="7-day trend" value={improvement === 0 ? "—" : `${improvement > 0 ? "+" : ""}${improvement}`} accent={improvement >= 0 ? "green" : "red"} />
          <StatCard label="Streak" value={streak} suffix={streak === 1 ? "day" : "days"} accent="orange" />
        </div>
        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1">
            <CardHeader title="Latest skill breakdown" />
            {radar.length > 0 ? <SkillRadarChart data={radar} /> : <p className="text-sm text-[var(--color-secondary)] py-8 text-center">No data yet.</p>}
          </Card>
          <Card className="lg:col-span-2 p-0 overflow-hidden">
            <div className="p-5 pb-3"><h3 className="font-medium text-sm">Session history</h3></div>
            <div className="divide-y divide-[var(--color-border)] max-h-[420px] overflow-y-auto">
              {rep.sessions.length === 0 && <p className="px-5 pb-4 text-sm text-[var(--color-secondary)]">No sessions yet.</p>}
              {rep.sessions.map((s) => (
                <Link key={s.id} href={`/report/${s.id}`} className="flex items-center justify-between px-5 py-3 text-sm hover:bg-[var(--color-border)]">
                  <div>
                    <p className="font-medium">{s.scenario?.title ?? "Uploaded recording"}</p>
                    <p className="text-xs text-[var(--color-secondary)] mt-0.5">{relativeTime(s.createdAt)} · {formatDuration(s.durationSeconds)} · {s.source}</p>
                  </div>
                  <span className="text-lg font-semibold text-[var(--color-gold-text)] tabular-nums">{s.metric?.overallScore ?? "—"}</span>
                </Link>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
