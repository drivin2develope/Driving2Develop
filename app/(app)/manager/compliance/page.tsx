import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { PageHeader, Card, Badge, EmptyState, StatCard, Avatar } from "@/components/ui";
import { complianceFlags } from "@/lib/derive";
import { ShieldCheck, Flag } from "lucide-react";

export const metadata = { title: "Compliance" };

export default async function CompliancePage() {
  const user = await getCurrentUser();
  if (!user) return null;
  const reps = await prisma.user.findMany({ where: { managerId: user.id }, include: { sessions: { include: { metric: true }, orderBy: { createdAt: "desc" } } } });
  const flags = complianceFlags(reps as any);
  const high = flags.filter((f) => f.severity === "high").length;

  return (
    <div>
      <PageHeader eyebrow="Manager" title="Compliance flags" subtitle="Derived from real metric thresholds on each rep's latest session — coaching signals, not accusations." />
      <div className="px-5 md:px-8 pb-10 space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard label="Open flags" value={flags.length} accent={flags.length ? "orange" : "green"} icon={<Flag size={15} />} />
          <StatCard label="High severity" value={high} accent={high ? "red" : "green"} />
          <StatCard label="Reps reviewed" value={reps.length} accent="blue" />
        </div>
        {flags.length === 0 ? (
          <EmptyState icon={<ShieldCheck size={22} />} title="No compliance flags" description="Every rep's latest session is clearing the coaching thresholds. Nice work." />
        ) : (
          <div className="space-y-3">
            {flags.map((f, i) => (
              <Card key={i} className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 min-w-0">
                  <Avatar name={f.repName} size={36} />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <Link href={`/manager/team/${f.repId}`} className="text-sm font-medium hover:text-[var(--color-gold-text)]">{f.repName}</Link>
                      <Badge color={f.severity === "high" ? "red" : "orange"}>{f.severity}</Badge>
                    </div>
                    <p className="text-sm mt-1">{f.label}</p>
                    <p className="text-xs text-[var(--color-secondary)] mt-0.5">{f.detail}</p>
                  </div>
                </div>
                <span className="text-lg font-semibold text-[var(--color-orange)] tabular-nums shrink-0">{f.score}</span>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
