export type SessionForStats = {
  createdAt: Date;
  durationSeconds: number;
  metric: { overallScore: number } | null;
};

export function computeStreak(sessions: SessionForStats[]): number {
  if (sessions.length === 0) return 0;
  const days = new Set(
    sessions.map((s) => {
      const d = new Date(s.createdAt);
      return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    })
  );
  let streak = 0;
  const cursor = new Date();
  for (;;) {
    const key = `${cursor.getFullYear()}-${cursor.getMonth()}-${cursor.getDate()}`;
    if (days.has(key)) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    } else if (streak === 0) {
      // allow "today" to be missing without breaking the streak count from yesterday
      cursor.setDate(cursor.getDate() - 1);
      const yKey = `${cursor.getFullYear()}-${cursor.getMonth()}-${cursor.getDate()}`;
      if (days.has(yKey)) continue;
      break;
    } else {
      break;
    }
  }
  return streak;
}

export function sevenDayImprovement(sessions: SessionForStats[]): number {
  const now = Date.now();
  const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
  const recent = sessions.filter((s) => now - new Date(s.createdAt).getTime() <= sevenDaysMs && s.metric);
  const prior = sessions.filter(
    (s) =>
      now - new Date(s.createdAt).getTime() > sevenDaysMs &&
      now - new Date(s.createdAt).getTime() <= sevenDaysMs * 2 &&
      s.metric
  );
  if (recent.length === 0 || prior.length === 0) return 0;
  const avg = (arr: SessionForStats[]) => arr.reduce((sum, s) => sum + (s.metric?.overallScore ?? 0), 0) / arr.length;
  return Math.round(avg(recent) - avg(prior));
}

export function practiceMinutes(sessions: SessionForStats[], sinceDays = 30): number {
  const now = Date.now();
  const cutoff = sinceDays * 24 * 60 * 60 * 1000;
  const total = sessions
    .filter((s) => now - new Date(s.createdAt).getTime() <= cutoff)
    .reduce((sum, s) => sum + s.durationSeconds, 0);
  return Math.round(total / 60);
}

export const METRIC_LABELS: Record<string, string> = {
  clarityScore: "Clarity",
  keywordAdherenceScore: "Script Adherence",
  objectionHandledScore: "Objection Handling",
  closingStrengthScore: "Closing Strength",
  confidenceScore: "Confidence",
};

export function radarDataFromMetric(metric: Record<string, number | null> | null | undefined) {
  if (!metric) return [];
  return Object.entries(METRIC_LABELS).map(([key, label]) => ({
    skill: label,
    value: Math.round(metric[key] ?? 0),
  }));
}

export const TEAM_METRIC_LABELS: Record<string, string> = {
  clarityScore: "Clarity",
  keywordAdherenceScore: "Script Adherence",
  closingStrengthScore: "Closing Strength",
  confidenceScore: "Confidence",
  fillerWordRate: "Filler Word Rate",
  monotoneScore: "Vocal Monotone",
};

type MetricRow = Record<string, number | null>;

export function teamWeakestAreas(allMetrics: MetricRow[], take = 3) {
  const keys = Object.keys(TEAM_METRIC_LABELS);
  const averages = keys.map((key) => {
    const values = allMetrics.map((m) => m[key]).filter((v): v is number => typeof v === "number");
    const avg = values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;
    // For "bad when high" metrics, invert so sorting-ascending still means "needs work" at top.
    const inverted = key === "fillerWordRate" || key === "monotoneScore";
    return { label: TEAM_METRIC_LABELS[key], value: Math.round(avg), sortValue: inverted ? 100 - avg : avg };
  });
  return averages.sort((a, b) => a.sortValue - b.sortValue).slice(0, take);
}

export function strengthsAndWeaknesses(metric: Record<string, number | null> | null | undefined) {
  if (!metric) return { strengths: [], weaknesses: [] };
  const entries = Object.entries(METRIC_LABELS)
    .map(([key, label]) => ({ label, value: metric[key] }))
    .filter((e): e is { label: string; value: number } => typeof e.value === "number");
  const sorted = [...entries].sort((a, b) => b.value - a.value);
  return {
    strengths: sorted.slice(0, 2),
    weaknesses: sorted.slice(-2).reverse(),
  };
}
