import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { PageHeader, Card, StatCard, ProgressBar, Stagger, StaggerItem } from "@/components/ui";
import { computeAchievements } from "@/lib/derive";
import { Award, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

export const metadata = { title: "Achievements" };
const TIER_COLOR: Record<string, string> = { bronze: "text-[var(--color-orange)]", silver: "text-[var(--color-secondary)]", gold: "text-[var(--color-gold-text)]" };

export default async function AchievementsPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  const sessions = await prisma.practiceSession.findMany({ where: { userId: user.id }, include: { metric: true }, orderBy: { createdAt: "desc" } });
  const achievements = computeAchievements(sessions as any);
  const unlocked = achievements.filter((a) => a.unlocked).length;

  return (
    <div>
      <PageHeader eyebrow="Achievements" title="Your badges" subtitle="Earned from your real practice activity." />
      <div className="px-5 md:px-8 pb-10 space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard label="Unlocked" value={`${unlocked}/${achievements.length}`} accent="gold" icon={<Award size={15} />} />
          <StatCard label="Sessions" value={sessions.length} accent="blue" />
          <StatCard label="Completion" value={Math.round((unlocked / achievements.length) * 100)} suffix="%" accent="green" />
        </div>
        <Stagger className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((a) => (
            <StaggerItem key={a.key}>
              <Card className={cn("h-full", !a.unlocked && "opacity-70")}>
                <div className="flex items-start justify-between">
                  <div className={cn("flex h-11 w-11 items-center justify-center rounded-xl", a.unlocked ? "bg-[rgba(227,179,65,0.12)]" : "bg-[var(--color-border)]")}>
                    {a.unlocked ? <Award size={22} className={TIER_COLOR[a.tier]} /> : <Lock size={18} className="text-[var(--color-disabled)]" />}
                  </div>
                  <span className={cn("text-2xs uppercase tracking-wide", TIER_COLOR[a.tier])}>{a.tier}</span>
                </div>
                <h3 className="font-medium text-sm mt-3">{a.title}</h3>
                <p className="text-xs text-[var(--color-secondary)] mt-1">{a.description}</p>
                {!a.unlocked && <div className="mt-3"><ProgressBar value={a.progress} /><p className="text-2xs text-[var(--color-disabled)] mt-1.5">{a.progress}% there</p></div>}
              </Card>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </div>
  );
}
