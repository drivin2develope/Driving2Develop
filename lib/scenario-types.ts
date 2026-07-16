export type HomeownerLine = { stage: string; line: string };

export type ScenarioDTO = {
  id: string;
  title: string;
  industry: string;
  difficulty: "EASY" | "REALISTIC" | "HARD";
  personality: string;
  description: string;
  requiredTalkingPoints: string[];
  homeownerScript: HomeownerLine[];
  estimatedMinutes: number;
  isLocked: boolean;
};

export function parseScenario(raw: {
  id: string;
  title: string;
  industry: string;
  difficulty: string;
  personality: string;
  description: string;
  requiredTalkingPoints: string;
  homeownerScript: string;
  estimatedMinutes: number;
  isLocked: boolean;
}): ScenarioDTO {
  return {
    id: raw.id,
    title: raw.title,
    industry: raw.industry,
    difficulty: raw.difficulty as ScenarioDTO["difficulty"],
    personality: raw.personality,
    description: raw.description,
    requiredTalkingPoints: JSON.parse(raw.requiredTalkingPoints),
    homeownerScript: JSON.parse(raw.homeownerScript),
    estimatedMinutes: raw.estimatedMinutes,
    isLocked: raw.isLocked,
  };
}

export const STAGE_LABELS: Record<string, string> = {
  introduction: "Introduction",
  rapport: "Rapport",
  value_prop: "Value Prop",
  qualifying: "Qualifying",
  objection_handling: "Objection Handling",
  objection: "Objection",
  objection_2: "Objection",
  close: "Close",
};
