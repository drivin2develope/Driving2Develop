import { describe, it, expect } from "vitest";
import { initialHomeownerState } from "./homeowner";
import type { ScenarioDTO } from "@/lib/scenario-types";

// Reach into the module's internal rule-based class the same way
// getHomeownerAdapter() does when OPENAI_API_KEY is unset.
import { getHomeownerAdapter } from "./homeowner";

const scenario: ScenarioDTO = {
  id: "scn_1",
  title: "Friendly First Pitch",
  industry: "Solar",
  difficulty: "REALISTIC",
  personality: "friendly",
  description: "test scenario",
  requiredTalkingPoints: ["introduction", "rapport", "value_prop", "close"],
  homeownerScript: [
    { stage: "introduction", line: "Oh hey, come on in off the porch." },
    { stage: "rapport", line: "We've lived here six years." },
    { stage: "value_prop", line: "Solar, huh? Tell me more." },
    { stage: "close", line: "Okay, what's the next step?" },
  ],
  estimatedMinutes: 4,
  isLocked: false,
};

describe("initialHomeownerState", () => {
  it("starts with a higher baseline trust for EASY than HARD scenarios", () => {
    const easy = initialHomeownerState({ ...scenario, difficulty: "EASY" });
    const hard = initialHomeownerState({ ...scenario, difficulty: "HARD" });
    expect(easy.trust).toBeGreaterThan(hard.trust);
  });
  it("starts with every required talking point unresolved and none addressed", () => {
    const state = initialHomeownerState(scenario);
    expect(state.unresolvedConcerns).toEqual(scenario.requiredTalkingPoints);
    expect(state.addressedTalkingPoints).toEqual([]);
    expect(state.finished).toBe(false);
    expect(state.endReason).toBeNull();
  });
});

describe("rule-based homeowner adapter (no OPENAI_API_KEY)", () => {
  it("is selected by default when no provider key is configured", () => {
    const original = process.env.OPENAI_API_KEY;
    delete process.env.OPENAI_API_KEY;
    const adapter = getHomeownerAdapter();
    expect(adapter).toBeDefined();
    if (original) process.env.OPENAI_API_KEY = original;
  });

  it("increases trust in response to rapport-building, question-asking language", async () => {
    const adapter = getHomeownerAdapter();
    const state = initialHomeownerState(scenario);
    const result = await adapter.respond({
      scenario,
      state,
      repUtterance: "How are you doing today? I love what you've done with the yard.",
      fullRepTranscript: "How are you doing today? I love what you've done with the yard.",
      history: [],
    });
    expect(result.state.trust).toBeGreaterThan(state.trust);
    expect(result.source).toBe("rule-based");
    expect(result.line.length).toBeGreaterThan(0);
  });

  it("decreases trust and raises irritation in response to pushy language", async () => {
    const adapter = getHomeownerAdapter();
    const state = initialHomeownerState(scenario);
    const result = await adapter.respond({
      scenario,
      state,
      repUtterance: "You have to sign today, trust me just do it, everyone else already did.",
      fullRepTranscript: "You have to sign today, trust me just do it, everyone else already did.",
      history: [],
    });
    expect(result.state.trust).toBeLessThan(state.trust);
    expect(result.state.irritation).toBeGreaterThan(state.irritation);
  });

  it("ends the conversation once irritation crosses the threshold from repeated pushiness", async () => {
    const adapter = getHomeownerAdapter();
    let state = initialHomeownerState({ ...scenario, difficulty: "HARD" });
    let finished = false;
    for (let i = 0; i < 10 && !finished; i++) {
      const result = await adapter.respond({
        scenario,
        state,
        repUtterance: "You have to sign right now or you'll regret it, trust me just do it.",
        fullRepTranscript: "You have to sign right now or you'll regret it, trust me just do it.",
        history: [],
      });
      state = result.state;
      finished = state.finished;
    }
    expect(finished).toBe(true);
    expect(state.endReason).toBe("not-interested");
  });

  it("tracks addressed vs. unresolved talking points from the cumulative transcript", async () => {
    const adapter = getHomeownerAdapter();
    const state = initialHomeownerState(scenario);
    const result = await adapter.respond({
      scenario,
      state,
      repUtterance: "Hi there, my name is Alex and I'm with the neighborhood solar program.",
      fullRepTranscript: "Hi there, my name is Alex and I'm with the neighborhood solar program.",
      history: [],
    });
    expect(result.state.addressedTalkingPoints).toContain("introduction");
    expect(result.state.unresolvedConcerns).not.toContain("introduction");
  });

  it("never mutates the state object it was given (returns a new one)", async () => {
    const adapter = getHomeownerAdapter();
    const state = initialHomeownerState(scenario);
    const snapshot = { ...state };
    await adapter.respond({
      scenario,
      state,
      repUtterance: "How's your day going?",
      fullRepTranscript: "How's your day going?",
      history: [],
    });
    expect(state).toEqual(snapshot);
  });
});
