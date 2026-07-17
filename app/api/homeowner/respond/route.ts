import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { parseScenario } from "@/lib/scenario-types";
import { getHomeownerAdapter, isLiveHomeownerConfigured, type HomeownerState, type HomeownerTurn } from "@/lib/ai/homeowner";
import { checkRateLimit } from "@/lib/rate-limit";

type RespondBody = {
  scenarioId: string;
  state: HomeownerState;
  repUtterance: string;
  fullRepTranscript: string;
  history: HomeownerTurn[];
};

export async function GET() {
  return NextResponse.json({ liveHomeownerConfigured: isLiveHomeownerConfigured() });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  if (!checkRateLimit(`homeowner:${user.id}`, 60, 60_000)) {
    return NextResponse.json({ error: "Too many requests. Slow down a moment." }, { status: 429 });
  }

  const body = (await req.json()) as RespondBody;
  if (!body.scenarioId || typeof body.repUtterance !== "string") {
    return NextResponse.json({ error: "scenarioId and repUtterance are required." }, { status: 400 });
  }

  const raw = await prisma.scenario.findUnique({ where: { id: body.scenarioId } });
  if (!raw) {
    return NextResponse.json({ error: "Scenario not found." }, { status: 404 });
  }
  const scenario = parseScenario(raw);

  const adapter = getHomeownerAdapter();
  const result = await adapter.respond({
    scenario,
    state: body.state,
    repUtterance: body.repUtterance,
    fullRepTranscript: body.fullRepTranscript ?? body.repUtterance,
    history: body.history ?? [],
  });

  return NextResponse.json(result);
}
