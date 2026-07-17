import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { transcribeAudio } from "@/lib/stt";
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
} from "@/lib/analysis";

const DEFAULT_TALKING_POINTS = ["introduction", "value_prop", "objection_handling", "close"];

type LivePayload = {
  source: "LIVE";
  scenarioId: string;
  durationSeconds: number;
  transcript: string;
  wordChunks: { atMs: number; wordCount: number }[];
  pauseSegments: { startMs: number; endMs: number }[];
  amplitudeSamples: number[];
  pitchSamples: number[];
  homeownerLines: string[];
  talkMs: number;
  listenMs: number;
};

async function handleLive(userId: string, payload: LivePayload) {
  const scenario = await prisma.scenario.findUnique({ where: { id: payload.scenarioId } });
  const requiredTalkingPoints: string[] = scenario
    ? JSON.parse(scenario.requiredTalkingPoints)
    : DEFAULT_TALKING_POINTS;

  const transcript = payload.transcript || "";
  const wordCount = countWords(transcript);
  const wpm = wordsPerMinute(wordCount, payload.durationSeconds);
  const paceVariance = computePaceVariance(payload.wordChunks || []);
  const filler = countFillerWords(transcript);
  const fillerWordRate = wordCount > 0 ? (filler.total / wordCount) * 100 : 0;
  const pauses = computePauses(payload.pauseSegments || []);
  const keyword = keywordAdherenceScore(transcript, requiredTalkingPoints);
  const objection = objectionHandledScore(transcript, payload.homeownerLines || []);
  const closing = closingStrengthScore(transcript);
  const tone = toneScore(transcript);
  const volumeVariation = volumeVariationScore(payload.amplitudeSamples || []);
  const monotone = monotoneScoreFromPitchVariance(payload.pitchSamples || []);
  const clarity = clarityScore(fillerWordRate, paceVariance);
  const confidence = computeConfidenceScore({ tone, volumeVariation, monotoneScore: monotone });
  const overall = computeOverallScore({
    clarity,
    keywordAdherence: keyword.score,
    objectionHandled: objection,
    closingStrength: closing,
    confidence,
    paceVariance,
  });
  const talkListenRatio = payload.talkMs > 0 ? payload.talkMs / Math.max(payload.listenMs, 1) : 0;
  const tips = generateTips({
    clarity,
    keywordAdherence: keyword.score,
    objectionHandled: objection,
    closingStrength: closing,
    confidence,
    pacing: 100 - paceVariance,
    fillerWordRate,
    monotoneScore: monotone,
    volumeVariation,
    talkListenRatio: Math.min(talkListenRatio, 100),
  });
  const paceTimeline = buildPaceTimeline(payload.wordChunks || [], payload.durationSeconds * 1000);

  const session = await prisma.practiceSession.create({
    data: {
      userId,
      scenarioId: payload.scenarioId,
      source: "LIVE",
      status: "COMPLETE",
      durationSeconds: Math.round(payload.durationSeconds),
      transcript,
      metric: {
        create: {
          wordsPerMinute: wpm,
          paceVariance,
          fillerWordCount: filler.total,
          fillerWordRate,
          pauseCount: pauses.count,
          avgPauseLengthMs: pauses.avgLengthMs,
          volumeVariation,
          monotoneScore: monotone,
          talkListenRatio: Math.min(talkListenRatio, 100),
          clarityScore: clarity,
          keywordAdherenceScore: keyword.score,
          objectionHandledScore: objection,
          closingStrengthScore: closing,
          confidenceScore: confidence,
          overallScore: overall,
          transcriptConfidence: "HIGH",
          tipsJson: JSON.stringify(tips),
          paceTimelineJson: JSON.stringify(paceTimeline),
        },
      },
    },
  });

  return session;
}

async function handleUpload(userId: string, formData: FormData) {
  const payloadRaw = formData.get("payload");
  const file = formData.get("audio");
  if (typeof payloadRaw !== "string" || !(file instanceof File)) {
    throw new Error("Missing payload or audio file.");
  }
  const payload = JSON.parse(payloadRaw) as {
    durationSeconds: number;
    pauseSegments: { startMs: number; endMs: number }[];
    amplitudeSamples: number[];
    proxyWordsPerMinute: number;
  };

  const buffer = Buffer.from(await file.arrayBuffer());
  const transcript = await transcribeAudio(buffer, file.name);

  const pauses = computePauses(payload.pauseSegments || []);
  const volumeVariation = volumeVariationScore(payload.amplitudeSamples || []);
  const monotone = monotoneScoreFromPitchVariance(payload.amplitudeSamples || []);

  let metricsData;
  let transcriptConfidence: "HIGH" | "MEDIUM" | "LOW" = "LOW";

  if (transcript) {
    const wordCount = countWords(transcript);
    const wpm = wordsPerMinute(wordCount, payload.durationSeconds);
    const filler = countFillerWords(transcript);
    const fillerWordRate = wordCount > 0 ? (filler.total / wordCount) * 100 : 0;
    const keyword = keywordAdherenceScore(transcript, DEFAULT_TALKING_POINTS);
    const closing = closingStrengthScore(transcript);
    const tone = toneScore(transcript);
    const clarity = clarityScore(fillerWordRate, 0);
    const confidence = computeConfidenceScore({ tone, volumeVariation, monotoneScore: monotone });
    const overall = computeOverallScore({
      clarity,
      keywordAdherence: keyword.score,
      objectionHandled: null,
      closingStrength: closing,
      confidence,
      paceVariance: 0,
    });
    const tips = generateTips({
      clarity,
      keywordAdherence: keyword.score,
      closingStrength: closing,
      confidence,
      fillerWordRate,
      monotoneScore: monotone,
      volumeVariation,
    });
    transcriptConfidence = "HIGH";
    metricsData = {
      wordsPerMinute: wpm,
      paceVariance: 0,
      fillerWordCount: filler.total,
      fillerWordRate,
      pauseCount: pauses.count,
      avgPauseLengthMs: pauses.avgLengthMs,
      volumeVariation,
      monotoneScore: monotone,
      talkListenRatio: 0,
      clarityScore: clarity,
      keywordAdherenceScore: keyword.score,
      objectionHandledScore: null,
      closingStrengthScore: closing,
      confidenceScore: confidence,
      overallScore: overall,
      transcriptConfidence,
      tipsJson: JSON.stringify(tips),
      paceTimelineJson: JSON.stringify(buildEnergyTimeline(payload.amplitudeSamples || [])),
    };
  } else {
    // Acoustic-only fallback - honest about what's real vs unavailable.
    const confidence = computeConfidenceScore({ tone: 50, volumeVariation, monotoneScore: monotone });
    const overall = Math.round((confidence + (100 - monotone)) / 2);
    metricsData = {
      wordsPerMinute: Math.round(payload.proxyWordsPerMinute || 0),
      paceVariance: 0,
      fillerWordCount: 0,
      fillerWordRate: 0,
      pauseCount: pauses.count,
      avgPauseLengthMs: pauses.avgLengthMs,
      volumeVariation,
      monotoneScore: monotone,
      talkListenRatio: 0,
      clarityScore: 0,
      keywordAdherenceScore: 0,
      objectionHandledScore: null,
      closingStrengthScore: 0,
      confidenceScore: confidence,
      overallScore: overall,
      transcriptConfidence: "LOW" as const,
      tipsJson: JSON.stringify([
        "Add an OPENAI_API_KEY to unlock transcript-based coaching (filler words, keyword adherence, closing strength) for uploads.",
        "In the meantime, keep an eye on your pacing and pauses from the acoustic analysis below.",
      ]),
      paceTimelineJson: JSON.stringify(buildEnergyTimeline(payload.amplitudeSamples || [])),
    };
  }

  const session = await prisma.practiceSession.create({
    data: {
      userId,
      scenarioId: null,
      source: "UPLOAD",
      status: "COMPLETE",
      durationSeconds: Math.round(payload.durationSeconds),
      transcript: transcript ?? null,
      metric: { create: metricsData },
    },
  });

  return session;
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const contentType = request.headers.get("content-type") || "";

  try {
    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const session = await handleUpload(user.id, formData);
      return NextResponse.json({ id: session.id });
    } else {
      const body = (await request.json()) as LivePayload;
      const session = await handleLive(user.id, body);
      return NextResponse.json({ id: session.id });
    }
  } catch (err) {
    console.error("Failed to create session", err);
    return NextResponse.json({ error: "Failed to process session." }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const sort = searchParams.get("sort") ?? "date";
  const source = searchParams.get("source");

  const sessions = await prisma.practiceSession.findMany({
    where: {
      userId: user.id,
      ...(source ? { source: source as "LIVE" | "UPLOAD" } : {}),
    },
    include: { metric: true, scenario: true },
    orderBy: sort === "score" ? undefined : { createdAt: "desc" },
  });

  const sorted =
    sort === "score"
      ? sessions.sort((a, b) => (b.metric?.overallScore ?? 0) - (a.metric?.overallScore ?? 0))
      : sessions;

  return NextResponse.json(sorted);
}
