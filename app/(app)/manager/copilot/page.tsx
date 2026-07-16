import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { PageHeader, EmptyState } from "@/components/ui";
import { CoachChat, type Suggestion } from "@/components/CoachChat";
import { teamWeakestAreas } from "@/lib/stats";
import { complianceFlags } from "@/lib/derive";
import { sevenDayImprovement } from "@/lib/stats";
import { Bot } from "lucide-react";

export const metadata = { title: "Copilot" };

export default async function CopilotPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  const reps = await prisma.user.findMany({ where: { managerId: user.id }, include: { sessions: { include: { metric: true }, orderBy: { createdAt: "desc" } } } });

  if (reps.length === 0) {
    return (<div><PageHeader eyebrow="Manager" title="Team Copilot" /><div className="px-5 md:px-8"><EmptyState icon={<Bot size={22} />} title="No team yet" description="Your copilot answers questions about your team once reps join." /></div></div>);
  }

  const roster = reps.map((r) => {
    const forStats = r.sessions.map((s) => ({ createdAt: s.createdAt, durationSeconds: s.durationSeconds, metric: s.metric ? { overallScore: s.metric.overallScore } : null }));
    return { name: r.name, latest: r.sessions[0]?.metric?.overallScore ?? null, improvement: sevenDayImprovement(forStats as any), count: r.sessions.length };
  });
  const active = roster.filter((r) => r.latest !== null);
  const needsAttention = [...active].sort((a, b) => (a.latest ?? 0) - (b.latest ?? 0)).slice(0, 3);
  const topPerformer = [...active].sort((a, b) => (b.latest ?? 0) - (a.latest ?? 0))[0];
  const mostImproved = [...active].sort((a, b) => b.improvement - a.improvement)[0];
  const allMetrics = reps.flatMap((r) => r.sessions.map((s) => s.metric).filter(Boolean)) as any[];
  const weakest = teamWeakestAreas(allMetrics);
  const flags = complianceFlags(reps as any);
  const pending = await prisma.assignment.count({ where: { managerId: user.id, status: "PENDING" } });

  const suggestions: Suggestion[] = [
    { id: "attention", label: "Who needs attention?", answer: needsAttention.length ? [`These reps are lowest right now:`, ...needsAttention.map((r) => `• ${r.name} — ${r.latest} pts`), "Consider assigning a targeted drill from their weakest area."] : ["Everyone's tracking well — no one's flagged right now."] },
    { id: "weakest", label: "What's the team's weakest skill?", answer: [`Across all recent sessions, the team's lowest areas are:`, ...weakest.map((w) => `• ${w.label} — ${w.value}/100`), "Great candidate for the next team huddle."] },
    { id: "top", label: "Who's my top performer?", answer: topPerformer ? [`${topPerformer.name} leads with a latest score of ${topPerformer.latest}.`, "Consider having them demo their close for the team."] : ["No scored sessions yet."] },
    { id: "improved", label: "Who's improving fastest?", answer: mostImproved && mostImproved.improvement !== 0 ? [`${mostImproved.name} has the biggest 7-day jump (${mostImproved.improvement > 0 ? "+" : ""}${mostImproved.improvement} pts).`, "Worth recognizing publicly — it reinforces the habit."] : ["Not enough recent data to compute improvement trends yet."] },
    { id: "flags", label: "Any compliance flags?", answer: flags.length ? [`There are ${flags.length} open flag(s).`, ...flags.slice(0, 3).map((f) => `• ${f.repName}: ${f.label} (${f.score})`), "Open the Compliance page for the full list."] : ["No compliance flags — every rep's latest session is clearing the thresholds."] },
    { id: "assign", label: "What should I assign this week?", answer: [`You have ${pending} pending assignment(s).`, weakest[0] ? `The team is weakest at ${weakest[0].label} — assign a scenario that stresses it to your lowest reps.` : "Assign targeted drills based on each rep's weakest area."] },
  ];

  return (
    <div>
      <PageHeader eyebrow="Manager" title="Team Copilot" subtitle="Rule-based answers about your team, driven by real session data." />
      <div className="px-5 md:px-8 pb-10">
        <CoachChat persona="copilot" intro={`Hi ${user.name.split(" ")[0]} — I've got a read on your ${reps.length}-rep team. Ask me who needs attention, your weakest skill, or what to assign.`} suggestions={suggestions} />
      </div>
    </div>
  );
}
