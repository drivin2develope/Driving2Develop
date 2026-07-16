import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { PageHeader, Card, CardHeader, ProgressBar, EmptyState, ButtonLink, Stagger, StaggerItem } from "@/components/ui";
import { buildSkillTree } from "@/lib/derive";
import { Sparkles, Lock, CheckCircle2 } from "lucide-react";

export const metadata = { title: "Skills" };

export default async function SkillsPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  const sessions = await prisma.practiceSession.findMany({ where: { userId: user.id }, include: { metric: true }, orderBy: { createdAt: "desc" } });

  if (sessions.length === 0) {
    return (
      <div>
        <PageHeader eyebrow="Skills" title="Skill tree" />
        <div className="px-5 md:px-8">
          <EmptyState icon={<Sparkles size={22} />} title="No skills mapped yet" description="Practice a few sessions to unlock your skill tree across delivery, structure and resilience." action={<ButtonLink href="/practice">Start practicing</ButtonLink>} />
        </div>
      </div>
    );
  }

  const branches = buildSkillTree(sessions as any);

  return (
    <div>
      <PageHeader eyebrow="Skills" title="Skill tree" subtitle="Your abilities across every scored dimension, averaged over your sessions." />
      <div className="px-5 md:px-8 pb-10 space-y-6">
        {branches.map((branch) => (
          <Card key={branch.name}>
            <CardHeader title={branch.name} subtitle={branch.description} />
            <Stagger className="grid md:grid-cols-2 gap-4">
              {branch.nodes.map((n) => (
                <StaggerItem key={n.key}>
                  <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium flex items-center gap-2">
                        {n.value >= 55 ? <CheckCircle2 size={15} className="text-[var(--color-green)]" /> : <Lock size={14} className="text-[var(--color-disabled)]" />}
                        {n.label}
                      </span>
                      <span className="text-sm font-semibold text-[var(--color-gold)] tabular-nums">{n.value}</span>
                    </div>
                    <div className="mt-3"><ProgressBar value={n.value} color={n.value >= 70 ? "var(--color-green)" : n.value >= 45 ? "var(--color-gold)" : "var(--color-orange)"} /></div>
                    <div className="flex items-center justify-between mt-2.5">
                      <p className="text-xs text-[var(--color-secondary)]">{n.blurb}</p>
                      <span className="text-2xs uppercase tracking-wide text-[var(--color-disabled)] shrink-0 ml-2">Lvl {n.level}</span>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </Card>
        ))}
      </div>
    </div>
  );
}
