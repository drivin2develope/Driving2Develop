import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { PageHeader, Card, Avatar, Badge, Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui";
import { computeStreak, sevenDayImprovement } from "@/lib/stats";
import { Trophy, TrendingUp, Flame } from "lucide-react";
import { cn } from "@/lib/utils";

export const metadata = { title: "Leaderboard" };

export default async function LeaderboardPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  // Peer group: the manager's whole roster (+ manager reps). If the rep has a
  // manager, rank against teammates; a manager ranks their own reps.
  let memberIds: string[] = [];
  if (user.role === "MANAGER") {
    const reps = await prisma.user.findMany({ where: { managerId: user.id }, select: { id: true } });
    memberIds = reps.map((r) => r.id);
  } else if (user.managerId) {
    const peers = await prisma.user.findMany({ where: { managerId: user.managerId }, select: { id: true } });
    memberIds = peers.map((p) => p.id);
  } else {
    memberIds = [user.id];
  }

  const members = await prisma.user.findMany({
    where: { id: { in: memberIds } },
    include: { sessions: { include: { metric: true }, orderBy: { createdAt: "desc" } } },
  });

  const rows = members.map((m) => {
    const forStats = m.sessions.map((s) => ({ createdAt: s.createdAt, durationSeconds: s.durationSeconds, metric: s.metric ? { overallScore: s.metric.overallScore } : null }));
    return {
      id: m.id,
      name: m.name,
      isMe: m.id === user.id,
      bestScore: Math.max(0, ...m.sessions.map((s) => s.metric?.overallScore ?? 0)),
      improvement: sevenDayImprovement(forStats as any),
      streak: computeStreak(forStats as any),
      sessions: m.sessions.length,
    };
  }).filter((r) => r.sessions > 0);

  const board = (key: "bestScore" | "improvement" | "streak", suffix = "") => {
    const sorted = [...rows].sort((a, b) => b[key] - a[key]);
    return (
      <Card className="p-0 overflow-hidden">
        <div className="divide-y divide-[var(--color-border)]">
          {sorted.map((r, i) => (
            <div key={r.id} className={cn("flex items-center gap-4 px-5 py-3.5", r.isMe && "bg-[rgba(227,179,65,0.06)]")}>
              <span className={cn("w-6 text-center font-semibold tabular-nums", i === 0 ? "text-[var(--color-gold-text)]" : "text-[var(--color-secondary)]")}>{i + 1}</span>
              <Avatar name={r.name} size={34} />
              <span className="flex-1 min-w-0">
                <span className="text-sm font-medium truncate flex items-center gap-2">{r.name} {r.isMe && <Badge color="gold">You</Badge>}</span>
                <span className="block text-xs text-[var(--color-secondary)]">{r.sessions} sessions</span>
              </span>
              <span className="text-lg font-semibold text-[var(--color-gold-text)] tabular-nums">{r[key] > 0 && key === "improvement" ? "+" : ""}{r[key]}{suffix}</span>
            </div>
          ))}
          {sorted.length === 0 && <p className="px-5 py-8 text-center text-sm text-[var(--color-secondary)]">No ranked activity yet.</p>}
        </div>
      </Card>
    );
  };

  return (
    <div>
      <PageHeader eyebrow="Leaderboard" title="Team rankings" subtitle="Ranked from real session data across your team." />
      <div className="px-5 md:px-8 pb-10">
        <Tabs defaultValue="score">
          <TabsList className="mb-5">
            <TabsTrigger value="score"><Trophy size={14} className="mr-1.5 inline" /> Highest score</TabsTrigger>
            <TabsTrigger value="improved"><TrendingUp size={14} className="mr-1.5 inline" /> Most improved</TabsTrigger>
            <TabsTrigger value="streak"><Flame size={14} className="mr-1.5 inline" /> Longest streak</TabsTrigger>
          </TabsList>
          <TabsContent value="score">{board("bestScore")}</TabsContent>
          <TabsContent value="improved">{board("improvement")}</TabsContent>
          <TabsContent value="streak">{board("streak", "d")}</TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
