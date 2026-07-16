import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { PageHeader, Card, Avatar, Table, THead, TH, TBody, TR, TD, EmptyState } from "@/components/ui";
import { relativeTime } from "@/lib/utils";
import { Users, ArrowRight } from "lucide-react";

export const metadata = { title: "Team" };

export default async function TeamPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  const reps = await prisma.user.findMany({ where: { managerId: user.id }, include: { sessions: { include: { metric: true }, orderBy: { createdAt: "desc" } } } });

  if (reps.length === 0) {
    return (<div><PageHeader eyebrow="Manager" title="Team" /><div className="px-5 md:px-8"><EmptyState icon={<Users size={22} />} title="No reps yet" description="Reps who choose you as their manager will appear here." /></div></div>);
  }

  const rows = reps.map((rep) => {
    const latest = rep.sessions[0];
    const prior = rep.sessions[1];
    const trend = latest?.metric && prior?.metric ? latest.metric.overallScore - prior.metric.overallScore : 0;
    const avg = rep.sessions.filter((s) => s.metric).length ? Math.round(rep.sessions.reduce((a, s) => a + (s.metric?.overallScore ?? 0), 0) / rep.sessions.filter((s) => s.metric).length) : null;
    return { id: rep.id, name: rep.name, email: rep.email, level: rep.experienceLevel ?? "—", latest: latest?.metric?.overallScore ?? null, avg, trend, count: rep.sessions.length, lastActive: latest?.createdAt ?? null };
  });

  return (
    <div>
      <PageHeader eyebrow="Manager" title="Team roster" subtitle={`${reps.length} reps — click a rep for their full history.`} />
      <div className="px-5 md:px-8 pb-10">
        <Card className="p-0 overflow-hidden">
          <Table>
            <THead><TR>
              <TH>Rep</TH><TH>Level</TH><TH className="text-right">Latest</TH><TH className="text-right">Avg</TH><TH className="text-right">Trend</TH><TH className="text-right">Sessions</TH><TH>Last active</TH><TH></TH>
            </TR></THead>
            <TBody>
              {rows.map((r) => (
                <TR key={r.id} className="cursor-pointer">
                  <TD><Link href={`/manager/team/${r.id}`} className="flex items-center gap-3"><Avatar name={r.name} size={30} /><span className="font-medium">{r.name}</span></Link></TD>
                  <TD className="capitalize text-[var(--color-secondary)]">{r.level}</TD>
                  <TD className="text-right font-semibold text-[var(--color-gold)] tabular-nums">{r.latest ?? "—"}</TD>
                  <TD className="text-right tabular-nums text-[var(--color-secondary)]">{r.avg ?? "—"}</TD>
                  <TD className={`text-right tabular-nums ${r.trend > 0 ? "text-[var(--color-green)]" : r.trend < 0 ? "text-[var(--color-red)]" : "text-[var(--color-secondary)]"}`}>{r.trend > 0 ? "+" : ""}{r.trend || "—"}</TD>
                  <TD className="text-right tabular-nums text-[var(--color-secondary)]">{r.count}</TD>
                  <TD className="text-[var(--color-secondary)] text-xs">{r.lastActive ? relativeTime(r.lastActive) : "—"}</TD>
                  <TD className="text-right"><Link href={`/manager/team/${r.id}`}><ArrowRight size={15} className="text-[var(--color-secondary)]" /></Link></TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </Card>
      </div>
    </div>
  );
}
