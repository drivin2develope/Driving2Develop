/**
 * The AI homeowner: a swappable adapter, not a hard-coded vendor.
 *
 * `getHomeownerAdapter()` returns an OpenAI-backed adapter when
 * OPENAI_API_KEY is configured, and an honest rule-based adapter otherwise.
 * Neither path is a fixed, pre-timed script: both react to what the rep
 * actually said on each turn and carry forward trust/irritation state
 * across the whole conversation (see HomeownerState below), which is what
 * "Restart Objection" and "Practice This Moment" key off of.
 *
 * This intentionally does not claim to be a full production-grade
 * conversational AI - the rule-based fallback is real, deterministic logic
 * over the transcript (same honesty standard as lib/analysis.ts), and the
 * OpenAI path is a genuine upgrade when a key is present. The UI must
 * always disclose which mode is active (see PracticeRecorder).
 */
import { keywordAdherenceScore, countFillerWords } from "@/lib/analysis";
import type { ScenarioDTO } from "@/lib/scenario-types";

export type HomeownerState = {
  trust: number; // 0-100
  irritation: number; // 0-100
  turnCount: number;
  disclosedFacts: string[];
  unresolvedConcerns: string[];
  addressedTalkingPoints: string[];
  stage: string;
  finished: boolean;
  endReason: "not-interested" | "closed-deal" | "ran-out-of-time" | null;
};

export type HomeownerTurn = { speaker: "rep" | "homeowner"; text: string };

export type HomeownerRespondInput = {
  scenario: ScenarioDTO;
  state: HomeownerState;
  repUtterance: string;
  fullRepTranscript: string;
  history: HomeownerTurn[];
};

export type HomeownerRespondOutput = {
  line: string;
  state: HomeownerState;
  source: "openai" | "rule-based";
};

export interface HomeownerAdapter {
  respond(input: HomeownerRespondInput): Promise<HomeownerRespondOutput>;
}

export function initialHomeownerState(scenario: ScenarioDTO): HomeownerState {
  const baseline = { EASY: 55, REALISTIC: 40, HARD: 22 }[scenario.difficulty] ?? 40;
  return {
    trust: baseline,
    irritation: 0,
    turnCount: 0,
    disclosedFacts: [],
    unresolvedConcerns: [...scenario.requiredTalkingPoints],
    addressedTalkingPoints: [],
    stage: scenario.homeownerScript[0]?.stage ?? "introduction",
    finished: false,
    endReason: null,
  };
}

// ---------------------------------------------------------------------------
// Rule-based adapter (default, zero-config, always available)
// ---------------------------------------------------------------------------

const RAPPORT_PATTERNS = [/\bhow are you\b/i, /\bnice (house|yard|garden|dog)\b/i, /\bi understand\b/i, /\bi hear you\b/i, /\bmakes sense\b/i, /\bappreciate\b/i];
const QUESTION_PATTERN = /\?\s*$/;
const PUSHY_PATTERNS = [/\bjust sign\b/i, /\btrust me\b/i, /\beveryone (is|does)\b/i, /\byou have to\b/i, /\bright now or\b/i];

function pickLine(scenario: ScenarioDTO, stage: string, fallback: string): string {
  const candidates = scenario.homeownerScript.filter((l) => l.stage === stage);
  if (candidates.length === 0) return fallback;
  return candidates[Math.min(candidates.length - 1, 0)].line;
}

class RuleBasedHomeownerAdapter implements HomeownerAdapter {
  async respond({ scenario, state, repUtterance, fullRepTranscript }: HomeownerRespondInput): Promise<HomeownerRespondOutput> {
    const next: HomeownerState = { ...state, turnCount: state.turnCount + 1 };

    const rapportHit = RAPPORT_PATTERNS.some((p) => p.test(repUtterance));
    const askedQuestion = QUESTION_PATTERN.test(repUtterance.trim());
    const soundedPushy = PUSHY_PATTERNS.some((p) => p.test(repUtterance));
    const filler = countFillerWords(repUtterance).total;

    let trustDelta = 0;
    if (rapportHit) trustDelta += 6;
    if (askedQuestion) trustDelta += 4;
    if (soundedPushy) trustDelta -= 12;
    if (filler >= 3) trustDelta -= 3;
    if (repUtterance.trim().length < 8) trustDelta -= 2; // curt/low-effort turn

    next.trust = clamp(state.trust + trustDelta, 0, 100);
    next.irritation = clamp(state.irritation + (soundedPushy ? 10 : rapportHit ? -4 : 1), 0, 100);

    const keyword = keywordAdherenceScore(fullRepTranscript, scenario.requiredTalkingPoints);
    next.addressedTalkingPoints = keyword.hits;
    next.unresolvedConcerns = scenario.requiredTalkingPoints.filter((p) => !keyword.hits.includes(p));

    // Homeowner can end the conversation if pushed too hard or trust collapses.
    if (next.irritation >= 85 || next.trust <= 5) {
      next.finished = true;
      next.endReason = "not-interested";
      return { line: pickLine(scenario, "close", "I'm going to have to stop you there - we're not interested. Please take us off your list."), state: next, source: "rule-based" };
    }

    // Choose the next stage: move forward through unresolved talking points,
    // weighted by trust (a skeptical homeowner surfaces the objection stage
    // again rather than advancing), then fall back to whatever stage the
    // scenario script defines next.
    let stage = next.unresolvedConcerns[0] ?? state.stage;
    if (next.trust < 30 && scenario.requiredTalkingPoints.includes("objection_handling")) {
      stage = "objection_handling";
    }
    next.stage = stage;

    const fallbackLine =
      next.trust >= 65
        ? "Okay, I'm listening - go on."
        : next.trust <= 20
        ? "I really don't have a lot of time for this."
        : "Hm. Go on, but make it quick.";
    const line = pickLine(scenario, stage, fallbackLine);

    return { line, state: next, source: "rule-based" };
  }
}

// ---------------------------------------------------------------------------
// OpenAI-backed adapter (used automatically when OPENAI_API_KEY is set)
// ---------------------------------------------------------------------------

class OpenAIHomeownerAdapter implements HomeownerAdapter {
  constructor(private apiKey: string) {}

  async respond(input: HomeownerRespondInput): Promise<HomeownerRespondOutput> {
    const { scenario, state, repUtterance, history } = input;
    const system = [
      `You are role-playing a homeowner in a door-to-door ${scenario.industry} sales practice scenario titled "${scenario.title}".`,
      `Personality: ${scenario.personality}. Difficulty: ${scenario.difficulty}.`,
      `Current trust in the rep (0-100): ${state.trust}. Current irritation (0-100): ${state.irritation}.`,
      `Concerns not yet addressed by the rep: ${state.unresolvedConcerns.join(", ") || "none"}.`,
      `Stay fully in character as the homeowner. Respond with ONE short, natural spoken line (1-3 sentences) - never break character, never mention you are an AI.`,
      `Then, on a new line starting with "STATE:", output strict JSON: {"trustDelta": number (-20..20), "irritationDelta": number (-20..20), "endConversation": boolean, "endReason": "not-interested"|"closed-deal"|null}.`,
    ].join("\n");

    const messages = [
      { role: "system", content: system },
      ...history.slice(-12).map((h) => ({ role: h.speaker === "rep" ? "user" : "assistant", content: h.text })),
      { role: "user", content: repUtterance },
    ];

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${this.apiKey}` },
      body: JSON.stringify({ model: "gpt-4o-mini", messages, temperature: 0.8, max_tokens: 220 }),
    });

    if (!res.ok) {
      // Honest degrade: fall back to the deterministic adapter rather than
      // fabricating a response or silently failing.
      return new RuleBasedHomeownerAdapter().respond(input);
    }

    const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    const raw = data.choices?.[0]?.message?.content ?? "";
    const [linePart, statePart] = raw.split(/\nSTATE:/);
    let trustDelta = 0;
    let irritationDelta = 1;
    let endConversation = false;
    let endReason: HomeownerState["endReason"] = null;
    try {
      const parsed = JSON.parse((statePart ?? "{}").trim());
      trustDelta = clamp(Number(parsed.trustDelta) || 0, -20, 20);
      irritationDelta = clamp(Number(parsed.irritationDelta) || 0, -20, 20);
      endConversation = !!parsed.endConversation;
      endReason = parsed.endReason ?? null;
    } catch {
      // Model didn't return parseable state - keep conservative deltas.
    }

    const next: HomeownerState = {
      ...state,
      turnCount: state.turnCount + 1,
      trust: clamp(state.trust + trustDelta, 0, 100),
      irritation: clamp(state.irritation + irritationDelta, 0, 100),
      finished: endConversation,
      endReason: endConversation ? endReason ?? "not-interested" : null,
    };

    const keyword = keywordAdherenceScore(input.fullRepTranscript, scenario.requiredTalkingPoints);
    next.addressedTalkingPoints = keyword.hits;
    next.unresolvedConcerns = scenario.requiredTalkingPoints.filter((p) => !keyword.hits.includes(p));

    return { line: (linePart ?? raw).trim() || "...", state: next, source: "openai" };
  }
}

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

export function getHomeownerAdapter(): HomeownerAdapter {
  const apiKey = process.env.OPENAI_API_KEY;
  if (apiKey) return new OpenAIHomeownerAdapter(apiKey);
  return new RuleBasedHomeownerAdapter();
}

export function isLiveHomeownerConfigured(): boolean {
  return !!process.env.OPENAI_API_KEY;
}
