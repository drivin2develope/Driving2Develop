/**
 * Driving2Develop Analysis Engine
 * ---------------------------------------------------------------------------
 * This module is the "core trick" of Driving2Develop: it turns a raw transcript +
 * timing/audio signal into a believable sales-coaching scorecard WITHOUT any
 * paid AI API. Every number here is derived from real, deterministic
 * computation over what the rep actually said (regex/keyword matching over
 * the real transcript) and/or real signal processing (energy envelopes from
 * the Web Audio API). Nothing is a random number - see each function's doc
 * comment for exactly what it measures and how.
 *
 * This file is isomorphic (no DOM/window access) so it can run both in the
 * browser (live practice + upload page) and on the server (re-validation).
 */

// ---------------------------------------------------------------------------
// Lexicons
// ---------------------------------------------------------------------------

/** Filler words/phrases scanned for verbatim in the transcript (case-insensitive). */
export const FILLER_WORD_PATTERNS: RegExp[] = [
  /\bum\b/gi,
  /\buh\b/gi,
  /\ber\b/gi,
  /\blike\b/gi,
  /\byou know\b/gi,
  /\bso,\s/gi,
  /\bactually,\s/gi,
  /\bkind of\b/gi,
  /\bsort of\b/gi,
  /\bi mean\b/gi,
];

/** Words that read as confident / assertive. */
export const CONFIDENT_WORDS = [
  "guarantee",
  "will",
  "definitely",
  "absolutely",
  "proven",
  "save",
  "invest",
  "value",
  "recommend",
  "confident",
  "certified",
  "warranty",
  "results",
  "trust",
];

/** Words/phrases that read as hesitant or over-qualifying. */
export const HESITANT_WORDS = [
  "maybe",
  "i think",
  "probably",
  "i guess",
  "not sure",
  "possibly",
  "kind of",
  "sort of",
  "i suppose",
  "might be",
  "could be wrong",
];

/** Words/phrases that read as pushy or aggressive (can hurt trust). */
export const AGGRESSIVE_WORDS = [
  "you have to",
  "you need to",
  "right now or",
  "last chance",
  "only idiots",
  "everyone else",
  "you'd be stupid",
  "trust me just",
];

/** Keyword sets per canonical talking-point stage, used for script adherence. */
export const STAGE_KEYWORDS: Record<string, string[]> = {
  introduction: ["hi", "hello", "my name is", "i'm with", "i work with", "neighborhood", "stopping by"],
  value_prop: ["save", "savings", "solar", "electric bill", "energy", "offset", "reduce your", "value", "system"],
  objection_handling: ["understand", "totally get", "i hear you", "fair enough", "makes sense", "that said", "however"],
  close: ["schedule", "set up a time", "get you on the calendar", "next step", "sign", "get started", "appointment"],
  rapport: ["how's your day", "beautiful home", "how long have you lived", "great neighborhood"],
  qualifying: ["who handles", "decision", "roof", "shade", "usage", "bill average"],
};

/** Phrases that signal the homeowner raised an objection (used to test rep's next reply). */
export const OBJECTION_TRIGGER_PHRASES = [
  "too expensive",
  "not interested",
  "already have",
  "need to think",
  "talk to my spouse",
  "call my husband",
  "call my wife",
  "no money",
  "another company",
  "scam",
  "busy right now",
];

/** Words showing the rep acknowledged + reframed after an objection. */
export const ACKNOWLEDGMENT_WORDS = [
  "i understand",
  "i hear you",
  "totally get it",
  "makes sense",
  "fair enough",
  "i get that",
  "that's a great question",
  "many of my customers felt",
];

/** Closing-phrase keywords, weighted toward the end of a transcript. */
export const CLOSING_KEYWORDS = [
  "schedule",
  "set up a time",
  "get you on the calendar",
  "sign here",
  "get started today",
  "book your",
  "appointment",
  "next steps",
  "does that work for you",
  "what day works",
];

// ---------------------------------------------------------------------------
// Basic transcript helpers
// ---------------------------------------------------------------------------

export function countWords(transcript: string): number {
  const trimmed = transcript.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

export function countFillerWords(transcript: string): { total: number; byPattern: Record<string, number> } {
  const byPattern: Record<string, number> = {};
  let total = 0;
  for (const pattern of FILLER_WORD_PATTERNS) {
    const matches = transcript.match(pattern);
    const count = matches ? matches.length : 0;
    if (count > 0) byPattern[pattern.source] = count;
    total += count;
  }
  return { total, byPattern };
}

export function wordsPerMinute(wordCount: number, elapsedSeconds: number): number {
  if (elapsedSeconds <= 0) return 0;
  return Math.round((wordCount / elapsedSeconds) * 60);
}

/**
 * Computes WPM variance across rolling windows (default 15s) given an array
 * of { timestampMs, text } transcript chunks. Higher variance = less steady
 * pacing. Returns a 0-100 "pace variance" score where 0 = perfectly steady.
 */
export function computePaceVariance(
  chunks: { atMs: number; wordCount: number }[],
  windowMs = 15000
): number {
  if (chunks.length < 2) return 0;
  const totalMs = chunks[chunks.length - 1].atMs;
  if (totalMs <= 0) return 0;
  const windowCount = Math.max(1, Math.ceil(totalMs / windowMs));
  const wordsPerWindow: number[] = new Array(windowCount).fill(0);
  for (const chunk of chunks) {
    const idx = Math.min(windowCount - 1, Math.floor(chunk.atMs / windowMs));
    wordsPerWindow[idx] += chunk.wordCount;
  }
  const wpmPerWindow = wordsPerWindow.map((w) => (w / (windowMs / 1000)) * 60);
  const mean = wpmPerWindow.reduce((a, b) => a + b, 0) / wpmPerWindow.length;
  if (mean === 0) return 0;
  const variance = wpmPerWindow.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / wpmPerWindow.length;
  const stdDev = Math.sqrt(variance);
  // Normalize: a stddev of 0 => 0 (steady), a stddev >= mean => 100 (erratic)
  return clamp(Math.round((stdDev / Math.max(mean, 1)) * 100), 0, 100);
}

/** Counts pauses (silence gaps) from an array of segment end/start timestamps (ms). */
export function computePauses(
  segments: { startMs: number; endMs: number }[],
  minPauseMs = 700
): { count: number; avgLengthMs: number } {
  if (segments.length < 2) return { count: 0, avgLengthMs: 0 };
  const sorted = [...segments].sort((a, b) => a.startMs - b.startMs);
  const gaps: number[] = [];
  for (let i = 1; i < sorted.length; i++) {
    const gap = sorted[i].startMs - sorted[i - 1].endMs;
    if (gap >= minPauseMs) gaps.push(gap);
  }
  if (gaps.length === 0) return { count: 0, avgLengthMs: 0 };
  const avg = gaps.reduce((a, b) => a + b, 0) / gaps.length;
  return { count: gaps.length, avgLengthMs: Math.round(avg) };
}

// ---------------------------------------------------------------------------
// Keyword / stage adherence
// ---------------------------------------------------------------------------

export function keywordAdherenceScore(transcript: string, requiredTalkingPoints: string[]): {
  score: number;
  hits: string[];
  misses: string[];
} {
  const lower = transcript.toLowerCase();
  const hits: string[] = [];
  const misses: string[] = [];
  for (const stage of requiredTalkingPoints) {
    const keywords = STAGE_KEYWORDS[stage] ?? [stage];
    const found = keywords.some((kw) => lower.includes(kw.toLowerCase()));
    if (found) hits.push(stage);
    else misses.push(stage);
  }
  const score = requiredTalkingPoints.length === 0 ? 100 : Math.round((hits.length / requiredTalkingPoints.length) * 100);
  return { score, hits, misses };
}

/**
 * Looks for an objection-trigger phrase in the homeowner's scripted lines,
 * then checks whether the rep's transcript (overall, or the portion after
 * the trigger's timestamp) contains acknowledgment/reframe language.
 */
export function objectionHandledScore(
  repTranscript: string,
  homeownerLines: string[]
): number | null {
  const raisedObjection = homeownerLines.some((line) =>
    OBJECTION_TRIGGER_PHRASES.some((trigger) => line.toLowerCase().includes(trigger))
  );
  if (!raisedObjection) return null; // N/A - scenario didn't raise one
  const lower = repTranscript.toLowerCase();
  const acknowledgedCount = ACKNOWLEDGMENT_WORDS.filter((w) => lower.includes(w)).length;
  const reframed = /(but|however|that said|here's the thing|what i've found)/i.test(repTranscript);
  let score = 30;
  if (acknowledgedCount > 0) score += 40;
  if (reframed) score += 30;
  return clamp(score, 0, 100);
}

export function closingStrengthScore(transcript: string): number {
  const lower = transcript.toLowerCase();
  const words = transcript.trim().split(/\s+/);
  const lastQuarterStart = Math.floor(words.length * 0.75);
  const lastQuarter = words.slice(lastQuarterStart).join(" ").toLowerCase();
  let hits = 0;
  for (const kw of CLOSING_KEYWORDS) {
    if (lastQuarter.includes(kw)) hits += 2;
    else if (lower.includes(kw)) hits += 1;
  }
  return clamp(Math.round((hits / (CLOSING_KEYWORDS.length * 1.2)) * 100), 0, 100);
}

// ---------------------------------------------------------------------------
// Tone / confidence lexicon scoring
// ---------------------------------------------------------------------------

export function toneScore(transcript: string): number {
  const lower = transcript.toLowerCase();
  const confident = CONFIDENT_WORDS.filter((w) => lower.includes(w)).length;
  const hesitant = HESITANT_WORDS.filter((w) => lower.includes(w)).length;
  const aggressive = AGGRESSIVE_WORDS.filter((w) => lower.includes(w)).length;
  const base = 55;
  const score = base + confident * 6 - hesitant * 7 - aggressive * 10;
  return clamp(Math.round(score), 0, 100);
}

// ---------------------------------------------------------------------------
// Volume / energy (from Web Audio AnalyserNode amplitude samples, 0-255 range)
// ---------------------------------------------------------------------------

export function volumeVariationScore(amplitudeSamples: number[]): number {
  if (amplitudeSamples.length < 2) return 0;
  const mean = amplitudeSamples.reduce((a, b) => a + b, 0) / amplitudeSamples.length;
  if (mean === 0) return 0;
  const variance =
    amplitudeSamples.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / amplitudeSamples.length;
  const stdDev = Math.sqrt(variance);
  // Healthy delivery has some variation but not chaos - normalize to 0-100
  // where ~15-35% coefficient of variation maps near the top of the range.
  const coefficientOfVariation = stdDev / mean;
  const score = 100 - Math.abs(coefficientOfVariation - 0.25) * 200;
  return clamp(Math.round(score), 0, 100);
}

export function monotoneScoreFromPitchVariance(pitchSamples: number[]): number {
  // Lower variance in pitch/amplitude proxy => more monotone => higher score
  // (monotoneScore is framed as "how monotone", so higher = more of a problem).
  if (pitchSamples.length < 2) return 50;
  const mean = pitchSamples.reduce((a, b) => a + b, 0) / pitchSamples.length;
  const variance = pitchSamples.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / pitchSamples.length;
  const stdDev = Math.sqrt(variance);
  const normalizedVariation = mean === 0 ? 0 : stdDev / mean;
  const monotone = 100 - clamp(Math.round(normalizedVariation * 250), 0, 100);
  return clamp(monotone, 0, 100);
}

// ---------------------------------------------------------------------------
// Clarity (filler rate + pace steadiness composite)
// ---------------------------------------------------------------------------

export function clarityScore(fillerRatePercent: number, paceVariance: number): number {
  const fillerPenalty = clamp(fillerRatePercent * 4, 0, 60);
  const pacePenalty = clamp(paceVariance * 0.3, 0, 30);
  return clamp(Math.round(100 - fillerPenalty - pacePenalty), 0, 100);
}

// ---------------------------------------------------------------------------
// Weighted composite scoring (documented weights)
// ---------------------------------------------------------------------------

export const OVERALL_SCORE_WEIGHTS = {
  clarity: 0.18,
  keywordAdherence: 0.2,
  objectionHandled: 0.15,
  closingStrength: 0.17,
  confidence: 0.2,
  pacing: 0.1,
} as const;

export const CONFIDENCE_SCORE_WEIGHTS = {
  tone: 0.5,
  volumeVariation: 0.2,
  monotoneInverse: 0.3,
} as const;

export function computeConfidenceScore(input: {
  tone: number;
  volumeVariation: number;
  monotoneScore: number;
}): number {
  const monotoneInverse = 100 - input.monotoneScore;
  const score =
    input.tone * CONFIDENCE_SCORE_WEIGHTS.tone +
    input.volumeVariation * CONFIDENCE_SCORE_WEIGHTS.volumeVariation +
    monotoneInverse * CONFIDENCE_SCORE_WEIGHTS.monotoneInverse;
  return clamp(Math.round(score), 0, 100);
}

export function computeOverallScore(input: {
  clarity: number;
  keywordAdherence: number;
  objectionHandled: number | null;
  closingStrength: number;
  confidence: number;
  paceVariance: number;
}): number {
  const pacingScore = clamp(100 - input.paceVariance, 0, 100);
  // If objection handling is N/A (scenario had none), redistribute its
  // weight proportionally across the remaining categories.
  const weights: Record<string, number> = { ...OVERALL_SCORE_WEIGHTS };
  let objectionWeight: number = weights.objectionHandled;
  let objectionContribution = 0;
  if (input.objectionHandled === null) {
    const remainingKeys = ["clarity", "keywordAdherence", "closingStrength", "confidence", "pacing"] as const;
    const bump = objectionWeight / remainingKeys.length;
    for (const k of remainingKeys) weights[k] += bump;
    objectionWeight = 0;
  } else {
    objectionContribution = input.objectionHandled * objectionWeight;
  }
  const score =
    input.clarity * weights.clarity +
    input.keywordAdherence * weights.keywordAdherence +
    objectionContribution +
    input.closingStrength * weights.closingStrength +
    input.confidence * weights.confidence +
    pacingScore * weights.pacing;
  return clamp(Math.round(score), 0, 100);
}

// ---------------------------------------------------------------------------
// Coaching tips dictionary
// ---------------------------------------------------------------------------

export const TIP_DICTIONARY: Record<string, string> = {
  clarity: "Slow down and cut filler words like \"um\" and \"like\" - pause instead of filling silence.",
  keywordAdherence: "You skipped a few key talking points - run through your intro, value prop, and close every time.",
  objectionHandled: "When a homeowner objects, acknowledge it first (\"I hear you\") before you reframe - don't argue immediately.",
  closingStrength: "Your close was soft - end with a specific, concrete next step like a date/time on the calendar.",
  confidence: "Use more declarative language (\"this will save you\") instead of hedging (\"this might help\").",
  pacing: "Your pace swung a lot during the pitch - aim for a steady, conversational rhythm throughout.",
  fillerWordRate: "Try replacing filler words with a brief pause - it reads as more confident, not less.",
  monotoneScore: "Vary your vocal energy on key benefits and the close - a flat tone undersells strong points.",
  volumeVariation: "Add more emphasis on your key value points - a steady volume can make the pitch feel flat.",
  talkListenRatio: "Ask more questions and leave room for the homeowner to respond - it builds trust faster than talking straight through.",
};

/** Picks the 2-3 lowest-scoring metrics and returns their canned tips. */
export function generateTips(scores: Record<string, number | null>): string[] {
  const entries = Object.entries(scores).filter(
    (entry): entry is [string, number] => typeof entry[1] === "number" && entry[0] in TIP_DICTIONARY
  );
  entries.sort((a, b) => a[1] - b[1]);
  const picked = entries.slice(0, 3).map(([key]) => TIP_DICTIONARY[key]);
  if (picked.length === 0) {
    return ["Solid rep overall - keep drilling to build muscle memory on your close."];
  }
  return picked;
}

// ---------------------------------------------------------------------------
// Timeline builders (for the report page's pace-over-time chart)
// ---------------------------------------------------------------------------

/** Builds a real words-per-minute-over-time series from timestamped word chunks. */
export function buildPaceTimeline(
  chunks: { atMs: number; wordCount: number }[],
  totalMs: number,
  bucketCount = 8
): { t: string; wpm: number }[] {
  if (totalMs <= 0 || chunks.length === 0) return [];
  const bucketMs = totalMs / bucketCount;
  const buckets = new Array(bucketCount).fill(0);
  for (const chunk of chunks) {
    const idx = clamp(Math.floor(chunk.atMs / bucketMs), 0, bucketCount - 1);
    buckets[idx] += chunk.wordCount;
  }
  return buckets.map((wordCount, i) => ({
    t: formatDuration((i * bucketMs) / 1000),
    wpm: Math.round((wordCount / (bucketMs / 1000)) * 60),
  }));
}

/** Builds a real energy/activity-over-time series from amplitude samples (upload fallback). */
export function buildEnergyTimeline(amplitudeSamples: number[], bucketCount = 8): { t: string; wpm: number }[] {
  if (amplitudeSamples.length === 0) return [];
  const bucketSize = Math.max(1, Math.ceil(amplitudeSamples.length / bucketCount));
  const buckets: { t: string; wpm: number }[] = [];
  for (let i = 0; i < amplitudeSamples.length; i += bucketSize) {
    const slice = amplitudeSamples.slice(i, i + bucketSize);
    const avg = slice.reduce((a, b) => a + b, 0) / slice.length;
    buckets.push({ t: `${Math.round((i / amplitudeSamples.length) * 100)}%`, wpm: Math.round(avg) });
  }
  return buckets;
}

// ---------------------------------------------------------------------------
// Formatting helpers
// ---------------------------------------------------------------------------

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function scoreColorClass(score: number): string {
  if (score >= 80) return "text-[var(--color-green)]";
  if (score >= 60) return "text-[var(--color-gold)]";
  if (score >= 40) return "text-[var(--color-orange)]";
  return "text-[var(--color-red)]";
}

export function highlightTranscript(transcript: string): { text: string; type: "filler" | "keyword" | "plain" }[] {
  const tokens = transcript.split(/(\s+)/);
  const allKeywords = new Set(
    Object.values(STAGE_KEYWORDS)
      .flat()
      .concat(CLOSING_KEYWORDS)
      .concat(ACKNOWLEDGMENT_WORDS)
      .map((k) => k.toLowerCase())
  );
  return tokens.map((token) => {
    const clean = token.trim().toLowerCase().replace(/[.,!?]/g, "");
    if (!clean) return { text: token, type: "plain" as const };
    const isFiller = FILLER_WORD_PATTERNS.some((p) => new RegExp(p.source, "i").test(token));
    if (isFiller) return { text: token, type: "filler" as const };
    for (const kw of allKeywords) {
      if (kw.split(" ").length === 1 && kw === clean) return { text: token, type: "keyword" as const };
    }
    return { text: token, type: "plain" as const };
  });
}
