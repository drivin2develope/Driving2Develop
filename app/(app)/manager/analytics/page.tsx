import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { PageHeader, Card, CardHeader, StatCard, EmptyState } from "@/components/ui";
import { ScoreCategoryBars } from "@/components/charts";
import { TEAM_METRIC_LABELS } from "@/lib/stats";
import { BarChart3 } from "lucide-react";

export const metadata = { title: "Analytics" };

export default async function AnalyticsPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  const reps = await prisma.user.findMany({ where: { managerId: user.id }, include: { sessions: { include: { metric: true }, orderBy: { createdAt: "desc" } } } });
  const allMetrics = reps.flatMap((r) => r.sessions.map((s) => s.metric).filter(Boolean)) as any[];

  if (allMetrics.length === 0) {
    return (<div><PageHeader eyebrow="Manager" title="Team analytics" /><div className="px-5 md:px-8"><EmptyState icon={<BarChart3 size={22} />} title="No data yet" description="Once your reps log sessions, team analytics populate here." /></div></div>);
  }

  const avg = (key: string) => { const v = allMetrics.map((m) => m[key]).filter((x): x is number => typeof x === "number"); return v.length ? Math.round(v.reduce((a, b) => a + b, 0) / v.length) : 0; };
  const categoryData = Object.entries(TEAM_METRIC_LABELS).map(([key, label]) => ({ label, value: key === "fillerWordRate" || key === "monotoneScore" ? Math.max(0, 100 - avg(key)) : avg(key) }));
  const rosterData = reps.map((r) => ({ label: r.name.split(" ")[0], value: r.sessions[0]?.metric?.overallScore ?? 0 })).filter((r) => r.value > 0);

  const totalSessions = reps.reduce((a, r) => a + r.sessions.length, 0);
  const liveShare = allMetrics.length ? Math.round((reps.flatMap((r) => r.sessions).filter((s) => s.source === "LIVE").length / totalSessions) * 100) : 0;
  const teamAvg = avg("overallScore");

  return (
    <div>
      <PageHeader eyebrow="Manager" title="Team analytics" subtitle="Aggregated from every scored session on your team." />
      <div className="px-5 md:px-8 pb-10 space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Team avg score" value={teamAvg} accent="gold" />
          <StatCard label="Total sessions" value={totalSessions} accent="blue" />
          <StatCard label="Live share" value={liveShare} suffix="%" accent="purple" />
          <StatCard label="Reps active" value={rosterData.length} accent="green" />
        </div>
        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader title="Team skill averages" subtitle="Higher is better (filler & monotone inverted)." />
            <ScoreCategoryBars data={categoryData} />
          </Card>
          <Card>
            <CardHeader title="Latest score by rep" subtitle="Most recent session per rep." />
            <ScoreCategoryBars data={rosterData} />
          </Card>
        </div>
      </div>
    </div>
  );
}
