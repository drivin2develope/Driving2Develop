import { describe, it, expect } from "vitest";
import {
  countWords,
  countFillerWords,
  wordsPerMinute,
  computePaceVariance,
  computePauses,
  keywordAdherenceScore,
  objectionHandledScore,
  closingStrengthScore,
  toneScore,
  volumeVariationScore,
  monotoneScoreFromPitchVariance,
  clarityScore,
  computeConfidenceScore,
  computeOverallScore,
  generateTips,
  buildPaceTimeline,
  buildEnergyTimeline,
  clamp,
  formatDuration,
} from "./analysis";

describe("clamp", () => {
  it("bounds a value inside [min, max]", () => {
    expect(clamp(50, 0, 100)).toBe(50);
    expect(clamp(-10, 0, 100)).toBe(0);
    expect(clamp(150, 0, 100)).toBe(100);
  });
});

describe("countWords", () => {
  it("returns 0 for empty/whitespace-only input", () => {
    expect(countWords("")).toBe(0);
    expect(countWords("   ")).toBe(0);
  });
  it("counts real words, collapsing extra whitespace", () => {
    expect(countWords("hi there  friend")).toBe(3);
  });
});

describe("countFillerWords", () => {
  it("finds zero fillers in clean text", () => {
    expect(countFillerWords("Hello, I'm here about your solar options.").total).toBe(0);
  });
  it("counts each filler occurrence across patterns", () => {
    const { total } = countFillerWords("um so, I was like, you know, kind of just checking in");
    expect(total).toBeGreaterThanOrEqual(3);
  });
});

describe("wordsPerMinute", () => {
  it("returns 0 when elapsed time is zero or negative (no divide-by-zero)", () => {
    expect(wordsPerMinute(50, 0)).toBe(0);
    expect(wordsPerMinute(50, -5)).toBe(0);
  });
  it("computes a real rate for positive elapsed time", () => {
    expect(wordsPerMinute(150, 60)).toBe(150);
    expect(wordsPerMinute(75, 30)).toBe(150);
  });
});

describe("computePaceVariance", () => {
  it("returns 0 for fewer than 2 chunks", () => {
    expect(computePaceVariance([])).toBe(0);
    expect(computePaceVariance([{ atMs: 0, wordCount: 5 }])).toBe(0);
  });
  it("returns 0 for perfectly steady pacing across windows", () => {
    const chunks = [
      { atMs: 1000, wordCount: 10 },
      { atMs: 16000, wordCount: 10 },
      { atMs: 31000, wordCount: 10 },
    ];
    expect(computePaceVariance(chunks)).toBe(0);
  });
  it("is bounded to [0, 100] even for wildly erratic pacing", () => {
    const chunks = [
      { atMs: 100, wordCount: 200 },
      { atMs: 20000, wordCount: 1 },
      { atMs: 40000, wordCount: 500 },
    ];
    const v = computePaceVariance(chunks);
    expect(v).toBeGreaterThanOrEqual(0);
    expect(v).toBeLessThanOrEqual(100);
  });
});

describe("computePauses", () => {
  it("returns zero pauses for fewer than 2 segments", () => {
    expect(computePauses([])).toEqual({ count: 0, avgLengthMs: 0 });
    expect(computePauses([{ startMs: 0, endMs: 100 }])).toEqual({ count: 0, avgLengthMs: 0 });
  });
  it("only counts gaps at/above the minimum pause threshold", () => {
    const segments = [
      { startMs: 0, endMs: 500 },
      { startMs: 600, endMs: 900 }, // 100ms gap - below default 700ms threshold
      { startMs: 2000, endMs: 2300 }, // 1100ms gap - counts
    ];
    const result = computePauses(segments);
    expect(result.count).toBe(1);
    expect(result.avgLengthMs).toBe(1100);
  });
});

describe("keywordAdherenceScore", () => {
  it("scores 100 when no talking points are required", () => {
    expect(keywordAdherenceScore("anything", []).score).toBe(100);
  });
  it("scores 0 when none of the required stages are mentioned", () => {
    const result = keywordAdherenceScore("completely unrelated text", ["introduction", "close"]);
    expect(result.score).toBe(0);
    expect(result.misses).toEqual(["introduction", "close"]);
  });
  it("credits a stage as a hit via a case-insensitive keyword match", () => {
    const result = keywordAdherenceScore("Hi there, I'm with the neighborhood solar program.", ["introduction"]);
    expect(result.hits).toContain("introduction");
    expect(result.score).toBe(100);
  });
});

describe("objectionHandledScore", () => {
  it("returns null (N/A) when the homeowner never raised an objection", () => {
    expect(objectionHandledScore("I hear you, that makes sense", ["Nice to meet you!"])).toBeNull();
  });
  it("scores low when an objection was raised but never acknowledged", () => {
    const score = objectionHandledScore("okay well anyway let's move on", ["This is too expensive for us."]);
    expect(score).toBe(30);
  });
  it("scores higher when the rep acknowledges and reframes", () => {
    const score = objectionHandledScore(
      "I hear you, that's a fair concern, however most homeowners save more over time",
      ["This is too expensive for us."]
    );
    expect(score).toBe(100);
  });
});

describe("closingStrengthScore", () => {
  it("is 0 for a transcript with no closing language anywhere", () => {
    expect(closingStrengthScore("we talked about the weather and the neighborhood")).toBe(0);
  });
  it("weights closing keywords in the final quarter more heavily", () => {
    const earlyOnly = closingStrengthScore("schedule schedule schedule " + "filler word ".repeat(40));
    const lateOnly = closingStrengthScore("filler word ".repeat(40) + "what day works for you");
    expect(lateOnly).toBeGreaterThan(earlyOnly);
  });
  it("never exceeds 100", () => {
    const packed = Array(20).fill("schedule set up a time get you on the calendar sign here get started today book your appointment next steps does that work for you what day works").join(" ");
    expect(closingStrengthScore(packed)).toBeLessThanOrEqual(100);
  });
});

describe("toneScore", () => {
  it("defaults to the 55 baseline for neutral text", () => {
    expect(toneScore("the weather has been nice lately")).toBe(55);
  });
  it("rewards confident language above baseline", () => {
    expect(toneScore("I guarantee this will save you money, trust me")).toBeGreaterThan(55);
  });
  it("penalizes hesitant and aggressive language below baseline, clamped at 0", () => {
    const hesitant = toneScore("maybe, i think, probably, i guess this could be wrong");
    expect(hesitant).toBeLessThan(55);
    const veryAggressive = toneScore(AGGRESSIVE_REPEATED);
    expect(veryAggressive).toBe(0);
  });
});
const AGGRESSIVE_REPEATED =
  "you have to do this you need to right now or last chance only idiots everyone else you'd be stupid trust me just sign";

describe("volumeVariationScore / monotoneScoreFromPitchVariance", () => {
  it("returns 0 for fewer than 2 samples", () => {
    expect(volumeVariationScore([])).toBe(0);
    expect(volumeVariationScore([10])).toBe(0);
  });
  it("returns the neutral 50 default for monotone score with insufficient samples", () => {
    expect(monotoneScoreFromPitchVariance([])).toBe(50);
  });
  it("keeps both scores within [0, 100]", () => {
    const samples = [10, 200, 5, 180, 30, 220];
    expect(volumeVariationScore(samples)).toBeGreaterThanOrEqual(0);
    expect(volumeVariationScore(samples)).toBeLessThanOrEqual(100);
    expect(monotoneScoreFromPitchVariance(samples)).toBeGreaterThanOrEqual(0);
    expect(monotoneScoreFromPitchVariance(samples)).toBeLessThanOrEqual(100);
  });
});

describe("clarityScore", () => {
  it("is 100 with zero filler rate and zero pace variance", () => {
    expect(clarityScore(0, 0)).toBe(100);
  });
  it("caps each penalty component independently before combining", () => {
    // fillerPenalty caps at 60, pacePenalty caps at 30 - so even at these
    // (or more extreme) inputs, the combined penalty tops out at 90, not 100.
    expect(clarityScore(100, 100)).toBe(10);
    expect(clarityScore(1000, 1000)).toBe(10);
  });
});

describe("computeConfidenceScore", () => {
  it("is bounded to [0, 100] across extremes", () => {
    expect(computeConfidenceScore({ tone: 0, volumeVariation: 0, monotoneScore: 100 })).toBe(0);
    expect(computeConfidenceScore({ tone: 100, volumeVariation: 100, monotoneScore: 0 })).toBe(100);
  });
});

describe("computeOverallScore", () => {
  const perfect = { clarity: 100, keywordAdherence: 100, objectionHandled: 100 as number | null, closingStrength: 100, confidence: 100, paceVariance: 0 };
  it("is 100 when every input is perfect", () => {
    expect(computeOverallScore(perfect)).toBe(100);
  });
  it("is 0 when every input is worst-case", () => {
    expect(
      computeOverallScore({ clarity: 0, keywordAdherence: 0, objectionHandled: 0, closingStrength: 0, confidence: 0, paceVariance: 100 })
    ).toBe(0);
  });
  it("redistributes objection-handling weight instead of penalizing when N/A, so a perfect score is still reachable", () => {
    expect(computeOverallScore({ ...perfect, objectionHandled: null })).toBe(100);
  });
});

describe("generateTips", () => {
  it("returns an encouraging, skill-less tip when there is nothing to score", () => {
    const tips = generateTips({});
    expect(tips).toHaveLength(1);
    expect(tips[0].skill).toBeNull();
  });
  it("tags each returned tip with its source skill, worst-scoring first", () => {
    const tips = generateTips({ clarity: 90, keywordAdherence: 10, closingStrength: 40 });
    expect(tips[0].skill).toBe("keywordAdherence");
    expect(tips.map((t) => t.skill)).toEqual(["keywordAdherence", "closingStrength", "clarity"]);
  });
  it("never returns more than 3 tips", () => {
    const tips = generateTips({
      clarity: 10,
      keywordAdherence: 20,
      closingStrength: 30,
      confidence: 40,
      pacing: 50,
    });
    expect(tips.length).toBeLessThanOrEqual(3);
  });
});

describe("buildPaceTimeline / buildEnergyTimeline", () => {
  it("returns an empty timeline for zero duration or no data", () => {
    expect(buildPaceTimeline([], 0)).toEqual([]);
    expect(buildPaceTimeline([{ atMs: 0, wordCount: 5 }], 0)).toEqual([]);
    expect(buildEnergyTimeline([])).toEqual([]);
  });
  it("produces the requested number of buckets for pace", () => {
    const chunks = [{ atMs: 1000, wordCount: 10 }, { atMs: 5000, wordCount: 10 }];
    expect(buildPaceTimeline(chunks, 8000, 4)).toHaveLength(4);
  });
});

describe("formatDuration", () => {
  it("formats seconds as m:ss", () => {
    expect(formatDuration(0)).toBe("0:00");
    expect(formatDuration(65)).toBe("1:05");
    expect(formatDuration(600)).toBe("10:00");
  });
});
