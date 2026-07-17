import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { PageHeader, Card, CardHeader, Badge, StatCard, EmptyState, ButtonLink, Avatar } from "@/components/ui";
import { teamWeakestAreas } from "@/lib/stats";
import { complianceFlags } from "@/lib/derive";
import { relativeTime } from "@/lib/utils";
import { AlertTriangle, Users, ClipboardList, Flag, ArrowRight, Bot } from "lucide-react";

export const metadata = { title: "Manager" };

export default async function ManagerPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const reps = await prisma.user.findMany({ where: { managerId: user.id }, include: { sessions: { include: { metric: true }, orderBy: { createdAt: "desc" } } } });

  if (reps.length === 0) {
    return (
      <div>
        <PageHeader eyebrow="Manager" title="Team overview" />
        <div className="px-5 md:px-8">
          <EmptyState icon={<Users size={22} />} title="No reps on your team yet" description="Once reps sign up and select you as their manager, their roster, scores and assignments show up here." />
        </div>
      </div>
    );
  }

  const roster = reps.map((rep) => {
    const latest = rep.sessions[0];
    const prior = rep.sessions[1];
    const trend = latest?.metric && prior?.metric ? latest.metric.overallScore - prior.metric.overallScore : 0;
    return { id: rep.id, name: rep.name, latestScore: latest?.metric?.overallScore ?? null, trend, lastActive: latest?.createdAt ?? null, sessionCount: rep.sessions.length };
  });
  const active = roster.filter((r) => r.latestScore !== null);
  const teamAvg = active.length ? Math.round(active.reduce((a, r) => a + (r.latestScore ?? 0), 0) / active.length) : 0;
  const needsAttention = [...roster].filter((r) => r.latestScore !== null).sort((a, b) => a.trend - b.trend || a.latestScore! - b.latestScore!).filter((r) => r.trend < 0 || r.latestScore! < 65).slice(0, 4);
  const allMetrics = reps.flatMap((rep) => rep.sessions.map((s) => s.metric).filter(Boolean)) as any[];
  const weakestAreas = teamWeakestAreas(allMetrics);
  const flags = complianceFlags(reps as any);
  const pendingAssignments = await prisma.assignment.count({ where: { managerId: user.id, status: "PENDING" } });

  return (
    <div>
      <PageHeader eyebrow="Manager" title="Team overview" subtitle={`${reps.length} reps on your team.`}
        action={<ButtonLink href="/manager/assignments/new"><ClipboardList size={16} /> New assignment</ButtonLink>} />
      <div className="px-5 md:px-8 pb-10 space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Team size" value={reps.length} accent="blue" icon={<Users size={15} />} />
          <StatCard label="Avg latest score" value={teamAvg} accent="gold" />
          <StatCard label="Open flags" value={flags.length} accent={flags.length ? "orange" : "green"} icon={<Flag size={15} />} />
          <StatCard label="Pending drills" value={pendingAssignments} accent="purple" icon={<ClipboardList size={15} />} />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 p-0 overflow-hidden">
            <div className="p-5 pb-3 flex items-center justify-between">
              <h3 className="font-medium text-sm">Team roster</h3>
              <Link href="/manager/team" className="text-xs text-[var(--color-gold)]">Full team →</Link>
            </div>
            <div className="divide-y divide-[var(--color-border)]">
              {roster.slice(0, 5).map((r) => (
                <Link key={r.id} href={`/manager/team/${r.id}`} className="flex items-center justify-between px-5 py-3.5 hover:bg-white/5">
                  <div className="flex items-center gap-3">
                    <Avatar name={r.name} size={34} />
                    <div>
                      <p className="text-sm font-medium">{r.name}</p>
                      <p className="text-xs text-[var(--color-secondary)]">{r.sessionCount} sessions · {r.lastActive ? relativeTime(r.lastActive) : "no activity"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {r.trend !== 0 && <span className={`text-xs ${r.trend > 0 ? "text-[var(--color-green)]" : "text-[var(--color-red)]"}`}>{r.trend > 0 ? "+" : ""}{r.trend}</span>}
                    <span className="text-lg font-semibold text-[var(--color-gold)] w-8 text-right tabular-nums">{r.latestScore ?? "—"}</span>
                  </div>
                </Link>
              ))}
            </div>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader title={<span className="flex items-center gap-2"><AlertTriangle size={15} className="text-[var(--color-orange)]" /> Needs attention</span>} action={<Link href="/manager/compliance" className="text-xs text-[var(--color-gold)]">Flags →</Link>} />
              {needsAttention.length === 0 ? <p className="text-sm text-[var(--color-secondary)]">Everyone&apos;s trending well — nice work.</p> : (
                <div className="space-y-3">
                  {needsAttention.map((r) => (
                    <Link key={r.id} href={`/manager/team/${r.id}`} className="flex items-center justify-between text-sm hover:text-[var(--color-primary)]">
                      <span>{r.name}</span><Badge color="orange">{r.latestScore} pts</Badge>
                    </Link>
                  ))}
                </div>
              )}
            </Card>
            <Card>
              <CardHeader title="Ask the Copilot" />
              <p className="text-sm text-[var(--color-secondary)] mb-3">Get quick answers about your team from real data.</p>
              <ButtonLink href="/manager/copilot" variant="secondary" size="sm"><Bot size={15} /> Open Copilot</ButtonLink>
            </Card>
          </div>
        </div>

        <Card>
          <CardHeader title="Team weakness aggregation" subtitle="Lowest average scores across all recent sessions." action={<Link href="/manager/analytics" className="text-xs text-[var(--color-gold)]">Analytics →</Link>} />
          <div className="grid sm:grid-cols-3 gap-4">
            {weakestAreas.map((area) => (
              <div key={area.label} className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
                <p className="text-sm text-[var(--color-secondary)]">{area.label}</p>
                <p className="text-2xl font-semibold text-[var(--color-orange)] mt-1 tabular-nums">{area.value}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
