import { computeStreak, sevenDayImprovement, type SessionForStats } from "@/lib/stats";

export type MetricLike = Record<string, number | null> | null | undefined;

export type SessionWithMetric = {
  id: string;
  createdAt: Date | string;
  durationSeconds: number;
  metric:
    | (Record<string, number | null> & { overallScore: number })
    | null;
};

/** Average a metric key across sessions that have it. */
function avg(sessions: SessionWithMetric[], key: string): number | null {
  const vals = sessions
    .map((s) => s.metric?.[key])
    .filter((v): v is number => typeof v === "number");
  if (vals.length === 0) return null;
  return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
}

export type SkillNode = { key: string; label: string; value: number; level: number; blurb: string };
export type SkillBranch = { name: string; description: string; nodes: SkillNode[] };

const LEVEL = (v: number) => (v >= 85 ? 5 : v >= 70 ? 4 : v >= 55 ? 3 : v >= 40 ? 2 : 1);

/** Build a skill-tree view over the rep's real Metric categories. */
export function buildSkillTree(sessions: SessionWithMetric[]): SkillBranch[] {
  const clarity = avg(sessions, "clarityScore") ?? 0;
  const confidence = avg(sessions, "confidenceScore") ?? 0;
  const pace = 100 - (avg(sessions, "paceVariance") ?? 0);
  const adherence = avg(sessions, "keywordAdherenceScore") ?? 0;
  const closing = avg(sessions, "closingStrengthScore") ?? 0;
  const objection = avg(sessions, "objectionHandledScore") ?? 0;
  const monotoneInv = 100 - (avg(sessions, "monotoneScore") ?? 50);

  const node = (key: string, label: string, value: number, blurb: string): SkillNode => ({
    key,
    label,
    value: Math.max(0, Math.min(100, Math.round(value))),
    level: LEVEL(value),
    blurb,
  });

  return [
    {
      name: "Delivery",
      description: "How you sound on the doorstep",
      nodes: [
        node("clarity", "Clarity", clarity, "Filler words and steady, understandable speech."),
        node("pacing", "Pacing", pace, "A steady, conversational rhythm — not too fast or erratic."),
        node("vocal", "Vocal energy", monotoneInv, "Varying your tone to keep the pitch alive."),
      ],
    },
    {
      name: "Structure",
      description: "How you run the pitch",
      nodes: [
        node("adherence", "Script adherence", adherence, "Hitting every stage: intro, value prop, close."),
        node("closing", "Closing strength", closing, "Ending on a specific, concrete next step."),
      ],
    },
    {
      name: "Resilience",
      description: "How you handle pushback",
      nodes: [
        node("objection", "Objection handling", objection, "Acknowledge first, then reframe under pressure."),
        node("confidence", "Confidence", confidence, "Declarative language instead of hedging."),
      ],
    },
  ];
}

export type Achievement = {
  key: string;
  title: string;
  description: string;
  unlocked: boolean;
  progress: number; // 0-100
  tier: "bronze" | "silver" | "gold";
};

export function computeAchievements(sessions: SessionWithMetric[]): Achievement[] {
  const count = sessions.length;
  const forStats: SessionForStats[] = sessions.map((s) => ({
    createdAt: new Date(s.createdAt),
    durationSeconds: s.durationSeconds,
    metric: s.metric ? { overallScore: s.metric.overallScore } : null,
  }));
  const streak = computeStreak(forStats);
  const best = Math.max(0, ...sessions.map((s) => s.metric?.overallScore ?? 0));
  const improvement = sevenDayImprovement(forStats);
  const totalMinutes = Math.round(sessions.reduce((a, s) => a + s.durationSeconds, 0) / 60);
  const cleanCloses = sessions.filter((s) => (s.metric?.closingStrengthScore ?? 0) >= 75).length;
  const lowFiller = sessions.filter((s) => (s.metric?.fillerWordRate ?? 100) < 3).length;

  const pct = (v: number, target: number) => Math.max(0, Math.min(100, Math.round((v / target) * 100)));

  return [
    { key: "first", title: "First Rep", description: "Complete your first practice session.", unlocked: count >= 1, progress: pct(count, 1), tier: "bronze" },
    { key: "five", title: "Warming Up", description: "Complete 5 sessions.", unlocked: count >= 5, progress: pct(count, 5), tier: "bronze" },
    { key: "ten", title: "Grinder", description: "Complete 10 sessions.", unlocked: count >= 10, progress: pct(count, 10), tier: "silver" },
    { key: "streak3", title: "On a Roll", description: "Hit a 3-day practice streak.", unlocked: streak >= 3, progress: pct(streak, 3), tier: "silver" },
    { key: "streak7", title: "Unbreakable", description: "Hit a 7-day practice streak.", unlocked: streak >= 7, progress: pct(streak, 7), tier: "gold" },
    { key: "score80", title: "Sharpshooter", description: "Score 80+ on a session.", unlocked: best >= 80, progress: pct(best, 80), tier: "gold" },
    { key: "improve", title: "Most Improved", description: "Improve your 7-day average by 5+ points.", unlocked: improvement >= 5, progress: pct(improvement, 5), tier: "silver" },
    { key: "closer", title: "Closer", description: "Land 5 sessions with a strong close (75+).", unlocked: cleanCloses >= 5, progress: pct(cleanCloses, 5), tier: "gold" },
    { key: "clean", title: "Silver Tongue", description: "3 sessions under 3% filler words.", unlocked: lowFiller >= 3, progress: pct(lowFiller, 3), tier: "silver" },
    { key: "hour", title: "Reps In", description: "Practice for 60 total minutes.", unlocked: totalMinutes >= 60, progress: pct(totalMinutes, 60), tier: "bronze" },
  ];
}

/** Compliance-adjacent flags derived from real metric thresholds. */
export type ComplianceFlag = {
  repId: string;
  repName: string;
  kind: "trust" | "pressure" | "clarity" | "adherence";
  label: string;
  detail: string;
  score: number;
  severity: "high" | "medium";
};

export function complianceFlags(
  reps: { id: string; name: string; sessions: SessionWithMetric[] }[]
): ComplianceFlag[] {
  const flags: ComplianceFlag[] = [];
  for (const rep of reps) {
    const withMetric = rep.sessions.filter((s) => s.metric);
    if (withMetric.length === 0) continue;
    const latest = withMetric[0].metric!;
    const objection = latest.objectionHandledScore;
    const confidence = latest.confidenceScore ?? 0;
    const adherence = latest.keywordAdherenceScore ?? 0;
    const closing = latest.closingStrengthScore ?? 0;

    if (typeof objection === "number" && objection < 45) {
      flags.push({ repId: rep.id, repName: rep.name, kind: "trust", label: "Weak objection handling", detail: "May be rebutting before acknowledging — trust risk on skeptical doors.", score: Math.round(objection), severity: objection < 30 ? "high" : "medium" });
    }
    if (adherence < 50) {
      flags.push({ repId: rep.id, repName: rep.name, kind: "adherence", label: "Skipping approved talking points", detail: "Low script adherence — required disclosures may be getting missed.", score: Math.round(adherence), severity: adherence < 35 ? "high" : "medium" });
    }
    if (closing < 40) {
      flags.push({ repId: rep.id, repName: rep.name, kind: "pressure", label: "Soft / unclear close", detail: "Weak closing — coach toward a specific next step, not pressure.", score: Math.round(closing), severity: "medium" });
    }
  }
  return flags.sort((a, b) => (a.severity === b.severity ? a.score - b.score : a.severity === "high" ? -1 : 1));
}
