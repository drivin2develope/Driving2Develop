import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { PageHeader, Card, Badge, EmptyState } from "@/components/ui";
import { computeAchievements } from "@/lib/derive";
import { sevenDayImprovement } from "@/lib/stats";
import { relativeTime } from "@/lib/utils";
import { Bell, ClipboardList, Award, TrendingDown, TrendingUp } from "lucide-react";

export const metadata = { title: "Notifications" };

export default async function NotificationsPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const [assignments, sessions] = await Promise.all([
    prisma.assignment.findMany({ where: { repId: user.id }, include: { scenario: true, manager: true }, orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.practiceSession.findMany({ where: { userId: user.id }, include: { metric: true }, orderBy: { createdAt: "desc" } }),
  ]);

  type Notif = { icon: any; color: string; title: string; body: string; when: string; tag: string };
  const items: Notif[] = [];

  for (const a of assignments.filter((x) => x.status === "PENDING")) {
    items.push({ icon: ClipboardList, color: "text-[var(--color-gold-text)]", title: "New assignment", body: `${a.manager.name}: ${a.note}`, when: relativeTime(a.createdAt), tag: "Assignment" });
  }
  const achievements = computeAchievements(sessions as any).filter((a) => a.unlocked).slice(-3).reverse();
  for (const a of achievements) {
    items.push({ icon: Award, color: "text-[var(--color-purple)]", title: `Badge unlocked: ${a.title}`, body: a.description, when: "recently", tag: "Achievement" });
  }
  const improvement = sevenDayImprovement(sessions as any);
  if (improvement !== 0) {
    items.push({
      icon: improvement > 0 ? TrendingUp : TrendingDown,
      color: improvement > 0 ? "text-[var(--color-green)]" : "text-[var(--color-red)]",
      title: improvement > 0 ? "Your score is trending up" : "Your score dipped this week",
      body: `Your 7-day average changed by ${improvement > 0 ? "+" : ""}${improvement} points.`,
      when: "this week",
      tag: "Progress",
    });
  }

  return (
    <div>
      <PageHeader eyebrow="Notifications" title="What's new" subtitle="Assignments, badges and score trends — derived from your real activity." />
      <div className="px-5 md:px-8 pb-10">
        {items.length === 0 ? (
          <EmptyState icon={<Bell size={22} />} title="You're all caught up" description="New assignments, unlocked badges and score changes will show up here." />
        ) : (
          <Card className="p-0 overflow-hidden">
            <div className="divide-y divide-[var(--color-border)]">
              {items.map((n, i) => {
                const Icon = n.icon;
                return (
                  <div key={i} className="flex items-start gap-3.5 px-5 py-4">
                    <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--color-border)] ${n.color}`}><Icon size={17} /></span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-medium">{n.title}</p>
                        <Badge>{n.tag}</Badge>
                      </div>
                      <p className="text-sm text-[var(--color-secondary)] mt-0.5">{n.body}</p>
                      <p className="text-2xs text-[var(--color-disabled)] mt-1">{n.when}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
