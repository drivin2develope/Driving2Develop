"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Mic, Pause, Play, Square, Info, RotateCcw, ChevronDown } from "lucide-react";
import { ScenarioDTO, STAGE_LABELS } from "@/lib/scenario-types";
import { Waveform } from "@/components/Waveform";
import {
  countWords,
  countFillerWords,
  wordsPerMinute,
  computePaceVariance,
  keywordAdherenceScore,
  toneScore,
  clarityScore,
} from "@/lib/analysis";
import { initialHomeownerState, type HomeownerState, type HomeownerTurn } from "@/lib/ai/homeowner";
import { cn } from "@/lib/utils";

type WordChunk = { atMs: number; wordCount: number };
type Checkpoint = { stage: string; atMs: number; homeownerState: HomeownerState };

function pickSupportedMimeType(): string | undefined {
  if (typeof MediaRecorder === "undefined" || !MediaRecorder.isTypeSupported) return undefined;
  const candidates = ["audio/webm;codecs=opus", "audio/webm", "audio/ogg;codecs=opus", "audio/mp4"];
  return candidates.find((c) => MediaRecorder.isTypeSupported(c));
}

export function PracticeRecorder({ scenario }: { scenario: ScenarioDTO }) {
  const router = useRouter();

  const [phase, setPhase] = useState<"idle" | "recording" | "paused" | "ending" | "unsupported">("idle");
  const [elapsedMs, setElapsedMs] = useState(0);
  const [finalTranscript, setFinalTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [levels, setLevels] = useState<number[]>([]);
  const [supportError, setSupportError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [homeownerState, setHomeownerState] = useState<HomeownerState>(() => initialHomeownerState(scenario));
  const [homeownerLine, setHomeownerLine] = useState<string>(scenario.homeownerScript[0]?.line ?? "");
  const [homeownerThinking, setHomeownerThinking] = useState(false);
  const [homeownerSource, setHomeownerSource] = useState<"openai" | "rule-based" | null>(null);
  const [showRestartMenu, setShowRestartMenu] = useState(false);

  const recognitionRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef<number | null>(null);
  const tickIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const accumulatedMsRef = useRef(0);
  const lastResumeAtRef = useRef<number>(0);
  const wordChunksRef = useRef<WordChunk[]>([]);
  const finalTimestampsRef = useRef<number[]>([]);
  const amplitudeSamplesRef = useRef<number[]>([]);
  const pitchSamplesRef = useRef<number[]>([]);
  const homeownerLinesShownRef = useRef<string[]>([]);
  const shouldRestartRecognitionRef = useRef(false);

  const historyRef = useRef<HomeownerTurn[]>([]);
  const pendingUtteranceRef = useRef("");
  const utteranceDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const askingRef = useRef(false);
  const checkpointsRef = useRef<Checkpoint[]>([]);
  const seenStagesRef = useRef<Set<string>>(new Set());

  const getElapsedMs = useCallback(() => {
    if (phase === "recording") {
      return accumulatedMsRef.current + (Date.now() - lastResumeAtRef.current);
    }
    return accumulatedMsRef.current;
  }, [phase]);

  // ---- Setup on mount ----
  useEffect(() => {
    const SpeechRecognitionCtor =
      typeof window !== "undefined" ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition : null;
    if (!SpeechRecognitionCtor) {
      setSupportError(
        "Live, real-time practice needs a browser with the Web Speech API (Chrome, Edge, and most Chromium-based browsers). You can still record or upload a practice conversation instead."
      );
      setPhase("unsupported");
    }
    fetch("/api/homeowner/respond")
      .then((r) => r.json())
      .then((d) => setHomeownerSource(d.liveHomeownerConfigured ? "openai" : "rule-based"))
      .catch(() => setHomeownerSource("rule-based"));
    return () => {
      cleanup();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    };
  }, []);

  function cleanup() {
    try {
      recognitionRef.current?.stop();
    } catch {}
    try {
      mediaRecorderRef.current?.stop();
    } catch {}
    streamRef.current?.getTracks().forEach((t) => t.stop());
    audioCtxRef.current?.close().catch(() => {});
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (tickIntervalRef.current) clearInterval(tickIntervalRef.current);
    if (utteranceDebounceRef.current) clearTimeout(utteranceDebounceRef.current);
    if (typeof window !== "undefined") window.speechSynthesis?.cancel();
  }

  async function askHomeowner(repUtterance: string) {
    if (askingRef.current || !repUtterance.trim()) return;
    askingRef.current = true;
    setHomeownerThinking(true);
    historyRef.current.push({ speaker: "rep", text: repUtterance });
    try {
      const res = await fetch("/api/homeowner/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenarioId: scenario.id,
          state: homeownerState,
          repUtterance,
          fullRepTranscript: finalTranscript,
          history: historyRef.current,
        }),
      });
      if (!res.ok) return;
      const data = await res.json();
      historyRef.current.push({ speaker: "homeowner", text: data.line });
      homeownerLinesShownRef.current.push(data.line);
      setHomeownerLine(data.line);
      setHomeownerState(data.state as HomeownerState);
      setHomeownerSource(data.source);

      const nextStage = (data.state as HomeownerState).stage;
      if (nextStage && !seenStagesRef.current.has(nextStage)) {
        seenStagesRef.current.add(nextStage);
        checkpointsRef.current.push({ stage: nextStage, atMs: getElapsedMs(), homeownerState: data.state });
      }

      if (typeof window !== "undefined" && window.speechSynthesis) {
        const utterance = new SpeechSynthesisUtterance(data.line);
        utterance.rate = 0.98;
        window.speechSynthesis.speak(utterance);
      }

      if ((data.state as HomeownerState).finished) {
        endSession();
      }
    } catch {
      // Network hiccup - stay silent this turn rather than fabricate a line.
    } finally {
      askingRef.current = false;
      setHomeownerThinking(false);
    }
  }

  async function start() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const AudioContextCtor = (window as any).AudioContext || (window as any).webkitAudioContext;
      const audioCtx: AudioContext = new AudioContextCtor();
      audioCtxRef.current = audioCtx;
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 1024;
      source.connect(analyser);
      analyserRef.current = analyser;

      // MediaRecorder purely for pause/resume-accurate timing (audio discarded);
      // dynamic codec selection per Section 8 rather than assuming one codec.
      const mimeType = pickSupportedMimeType();
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      mediaRecorderRef.current = recorder;
      recorder.start();

      const SpeechRecognitionCtor = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognitionCtor();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onresult = (event: any) => {
        let interim = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          const text = result[0].transcript;
          if (result.isFinal) {
            setFinalTranscript((prev) => {
              const updated = (prev + " " + text).trim();
              const wordCount = countWords(text);
              const atMs = getElapsedMs();
              wordChunksRef.current.push({ atMs, wordCount });
              finalTimestampsRef.current.push(atMs);
              return updated;
            });
            pendingUtteranceRef.current = (pendingUtteranceRef.current + " " + text).trim();
            if (utteranceDebounceRef.current) clearTimeout(utteranceDebounceRef.current);
            utteranceDebounceRef.current = setTimeout(() => {
              const utterance = pendingUtteranceRef.current;
              pendingUtteranceRef.current = "";
              askHomeowner(utterance);
            }, 900);
          } else {
            interim += text;
          }
        }
        setInterimTranscript(interim);
      };

      recognition.onerror = () => {
        // swallow transient errors (e.g. no-speech); onend will handle restart
      };

      recognition.onend = () => {
        if (shouldRestartRecognitionRef.current) {
          try {
            recognition.start();
          } catch {}
        }
      };

      recognitionRef.current = recognition;
      shouldRestartRecognitionRef.current = true;
      recognition.start();

      lastResumeAtRef.current = Date.now();
      setPhase("recording");

      homeownerLinesShownRef.current.push(homeownerLine);
      historyRef.current.push({ speaker: "homeowner", text: homeownerLine });
      if (window.speechSynthesis) {
        const opener = new SpeechSynthesisUtterance(homeownerLine);
        opener.rate = 0.98;
        window.speechSynthesis.speak(opener);
      }

      const freqData = new Uint8Array(analyser.frequencyBinCount);
      const timeData = new Float32Array(analyser.fftSize);
      tickIntervalRef.current = setInterval(() => {
        analyser.getByteFrequencyData(freqData);
        const avg = freqData.reduce((a, b) => a + b, 0) / freqData.length;
        amplitudeSamplesRef.current.push(avg);
        setLevels((prev) => [...prev.slice(-60), avg]);

        analyser.getFloatTimeDomainData(timeData);
        let crossings = 0;
        for (let i = 1; i < timeData.length; i++) {
          if ((timeData[i - 1] < 0 && timeData[i] >= 0) || (timeData[i - 1] > 0 && timeData[i] <= 0)) crossings++;
        }
        pitchSamplesRef.current.push(crossings);

        setElapsedMs(getElapsedMs());
      }, 200);
    } catch (err) {
      setSupportError("Microphone access is required for live practice. Please allow mic access and try again.");
    }
  }

  function pause() {
    if (phase !== "recording") return;
    accumulatedMsRef.current = getElapsedMs();
    shouldRestartRecognitionRef.current = false;
    try {
      recognitionRef.current?.stop();
    } catch {}
    try {
      mediaRecorderRef.current?.pause();
    } catch {}
    if (tickIntervalRef.current) clearInterval(tickIntervalRef.current);
    if (utteranceDebounceRef.current) clearTimeout(utteranceDebounceRef.current);
    window.speechSynthesis?.pause();
    setPhase("paused");
  }

  function resume() {
    if (phase !== "paused") return;
    lastResumeAtRef.current = Date.now();
    shouldRestartRecognitionRef.current = true;
    try {
      recognitionRef.current?.start();
    } catch {}
    try {
      mediaRecorderRef.current?.resume();
    } catch {}
    window.speechSynthesis?.resume();
    const analyser = analyserRef.current;
    if (analyser) {
      const freqData = new Uint8Array(analyser.frequencyBinCount);
      const timeData = new Float32Array(analyser.fftSize);
      tickIntervalRef.current = setInterval(() => {
        analyser.getByteFrequencyData(freqData);
        const avg = freqData.reduce((a, b) => a + b, 0) / freqData.length;
        amplitudeSamplesRef.current.push(avg);
        setLevels((prev) => [...prev.slice(-60), avg]);
        analyser.getFloatTimeDomainData(timeData);
        let crossings = 0;
        for (let i = 1; i < timeData.length; i++) {
          if ((timeData[i - 1] < 0 && timeData[i] >= 0) || (timeData[i - 1] > 0 && timeData[i] <= 0)) crossings++;
        }
        pitchSamplesRef.current.push(crossings);
        setElapsedMs(getElapsedMs());
      }, 200);
    }
    setPhase("recording");
  }

  /** Reopens an earlier objection/stage: the homeowner's conversational state
   *  rewinds to that checkpoint so the rep can retry it, but nothing already
   *  recorded (audio, transcript, timing, evidence) is discarded. */
  function restartObjection(checkpoint: Checkpoint) {
    setHomeownerState(checkpoint.homeownerState);
    setHomeownerLine(`Let's go back to that. ${STAGE_LABELS[checkpoint.stage] ?? checkpoint.stage}?`);
    historyRef.current.push({ speaker: "homeowner", text: `[Restarting from ${STAGE_LABELS[checkpoint.stage] ?? checkpoint.stage}]` });
    setShowRestartMenu(false);
    if (phase === "paused") resume();
  }

  async function endSession() {
    setPhase("ending");
    shouldRestartRecognitionRef.current = false;
    const finalMs = getElapsedMs();
    cleanup();

    const transcript = finalTranscript.trim();
    const pauseSegments = finalTimestampsRef.current.map((t, i) => {
      const wordsInChunk = wordChunksRef.current[i]?.wordCount ?? 3;
      const estDuration = Math.max(400, wordsInChunk * 350);
      return { startMs: Math.max(0, t - estDuration), endMs: t };
    });

    setSubmitting(true);
    try {
      const res = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "LIVE",
          scenarioId: scenario.id,
          durationSeconds: Math.round(finalMs / 1000),
          transcript,
          wordChunks: wordChunksRef.current,
          pauseSegments,
          amplitudeSamples: amplitudeSamplesRef.current,
          pitchSamples: pitchSamplesRef.current,
          homeownerLines: homeownerLinesShownRef.current,
          talkMs: wordChunksRef.current.reduce((sum, c) => sum + c.wordCount * 350, 0),
          listenMs: homeownerLinesShownRef.current.reduce((sum, l) => sum + l.split(" ").length * 350, 0),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        router.push(`/report/${data.id}`);
        return;
      }
    } catch {
      // fall through to error UI below
    }
    setSubmitting(false);
    setPhase("idle");
  }

  // ---- Live "feedback so far" (recomputed from real data on every tick) ----
  const wordCount = countWords(finalTranscript);
  const wpm = wordsPerMinute(wordCount, elapsedMs / 1000);
  const filler = countFillerWords(finalTranscript);
  const fillerRate = wordCount > 0 ? (filler.total / wordCount) * 100 : 0;
  const paceVar = computePaceVariance(wordChunksRef.current);
  const keyword = keywordAdherenceScore(finalTranscript, scenario.requiredTalkingPoints);
  const tone = toneScore(finalTranscript);
  const clarity = clarityScore(fillerRate, paceVar);

  const minutes = Math.floor(elapsedMs / 60000);
  const seconds = Math.floor((elapsedMs % 60000) / 1000);

  if (phase === "unsupported") {
    return (
      <div className="card p-6 max-w-lg mx-auto mt-10 text-center">
        <Info className="mx-auto text-[var(--color-orange)]" />
        <p className="text-sm mt-3">{supportError}</p>
        <a href="/upload" className="btn-gold inline-flex mt-4 px-4 py-2 text-sm rounded-lg">
          Upload a recording instead
        </a>
      </div>
    );
  }

  return (
    <div className="practice-dark px-5 md:px-8 pb-10 -mx-5 md:-mx-8 pt-5 md:pt-8 rounded-none">
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                {phase === "recording" && <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-red)] animate-rec" />}
                <span className="text-sm font-medium">{scenario.title}</span>
              </div>
              <span className="text-sm text-[var(--color-secondary)] tabular-nums">
                {minutes}:{seconds.toString().padStart(2, "0")}
              </span>
            </div>

            <p className="text-xs text-[var(--color-purple)] flex items-center gap-1.5 mb-3">
              <Info size={12} />
              {homeownerSource === "openai"
                ? "Live conversational AI homeowner"
                : homeownerSource === "rule-based"
                ? "Rule-based practice partner - reacts to what you say, but isn't a live conversational AI (add OPENAI_API_KEY for that)"
                : "Loading practice partner…"}
            </p>

            <div className="rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] p-4 mb-4 min-h-[74px]">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs text-[var(--color-purple)] font-medium">Homeowner ({scenario.personality})</p>
                {homeownerThinking && <span className="text-[11px] text-[var(--color-disabled)]">thinking…</span>}
              </div>
              <p className="text-sm">{homeownerLine || "Listening for your opening line..."}</p>
            </div>

            <Waveform levels={levels} active={phase === "recording"} />

            <div className="rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] p-4 mt-4 min-h-[80px]">
              <p className="text-xs text-[var(--color-secondary)] font-medium mb-1">You (live transcript)</p>
              <p className="text-sm">
                {finalTranscript}
                <span className="text-[var(--color-secondary)]"> {interimTranscript}</span>
                {!finalTranscript && !interimTranscript && phase === "idle" && (
                  <span className="text-[var(--color-disabled)]">Knock on the door and begin your pitch...</span>
                )}
              </p>
            </div>

            {supportError && <p className="text-xs text-[var(--color-red)] mt-3">{supportError}</p>}

            <div className="flex items-center gap-3 mt-5">
              {phase === "idle" && (
                <button onClick={start} className="btn-gold flex-1 py-3 text-sm flex items-center justify-center gap-2">
                  <Mic size={16} /> Knock on Door
                </button>
              )}
              {phase === "recording" && (
                <>
                  <button onClick={pause} className="btn-secondary flex-1 py-3 text-sm flex items-center justify-center gap-2">
                    <Pause size={16} /> Pause Practice
                  </button>
                  <button
                    onClick={endSession}
                    className="flex-1 py-3 text-sm rounded-lg bg-[var(--color-red)] text-white flex items-center justify-center gap-2"
                  >
                    <Square size={16} /> End Practice
                  </button>
                </>
              )}
              {phase === "paused" && (
                <>
                  <button onClick={resume} className="btn-gold flex-1 py-3 text-sm flex items-center justify-center gap-2">
                    <Play size={16} /> Resume Practice
                  </button>
                  {checkpointsRef.current.length > 0 && (
                    <div className="relative">
                      <button
                        onClick={() => setShowRestartMenu((s) => !s)}
                        className="btn-secondary h-full px-3 py-3 text-sm flex items-center justify-center gap-1.5"
                        aria-haspopup="menu"
                        aria-expanded={showRestartMenu}
                      >
                        <RotateCcw size={15} /> Restart Objection <ChevronDown size={13} />
                      </button>
                      {showRestartMenu && (
                        <div role="menu" className="absolute bottom-full mb-2 right-0 card p-1.5 w-56 z-10">
                          {checkpointsRef.current.map((cp, i) => (
                            <button
                              key={i}
                              role="menuitem"
                              onClick={() => restartObjection(cp)}
                              className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-[var(--color-border)]"
                            >
                              {STAGE_LABELS[cp.stage] ?? cp.stage}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  <button
                    onClick={endSession}
                    className="flex-1 py-3 text-sm rounded-lg bg-[var(--color-red)] text-white flex items-center justify-center gap-2"
                  >
                    <Square size={16} /> End Practice
                  </button>
                </>
              )}
              {(phase === "ending" || submitting) && (
                <button disabled className="btn-gold flex-1 py-3 text-sm opacity-70">
                  Scoring your practice...
                </button>
              )}
            </div>
          </div>

          {/* Stage timeline */}
          <div className="card p-5">
            <h3 className="text-sm font-medium mb-3">Talking Points</h3>
            <div className="flex flex-wrap gap-2">
              {scenario.requiredTalkingPoints.map((stage) => (
                <span
                  key={stage}
                  className={cn(
                    "text-xs px-3 py-1.5 rounded-full border",
                    stage === homeownerState.stage
                      ? "border-[var(--color-gold)] text-[var(--color-gold-text)] bg-[rgba(227,179,65,0.08)]"
                      : keyword.hits.includes(stage)
                      ? "border-[var(--color-green)] text-[var(--color-green)] bg-[rgba(52,211,153,0.06)]"
                      : "border-[var(--color-border)] text-[var(--color-secondary)]"
                  )}
                >
                  {STAGE_LABELS[stage] ?? stage}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Live feedback so far */}
        <div className="card p-5 h-fit lg:sticky lg:top-6">
          <h3 className="text-sm font-medium mb-4">Feedback So Far</h3>
          <div className="space-y-4">
            <LiveMetric label="Pace" value={`${wpm || 0} wpm`} />
            <LiveMetric label="Filler Words" value={`${filler.total}`} tone={filler.total > 5 ? "warn" : "good"} />
            <LiveMetric label="Script Adherence" value={`${keyword.score}/100`} tone={keyword.score >= 60 ? "good" : "warn"} />
            <LiveMetric label="Tone" value={`${tone}/100`} tone={tone >= 60 ? "good" : "warn"} />
            <LiveMetric label="Clarity" value={`${clarity}/100`} tone={clarity >= 60 ? "good" : "warn"} />
            <LiveMetric label="Homeowner Trust" value={`${homeownerState.trust}/100`} tone={homeownerState.trust >= 50 ? "good" : "warn"} />
          </div>
          <p className="text-[11px] text-[var(--color-secondary)] mt-5">
            Computed live from your real transcript and audio signal - pausing does not reset these numbers.
          </p>
        </div>
      </div>
    </div>
  );
}

function LiveMetric({ label, value, tone }: { label: string; value: string; tone?: "good" | "warn" }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-[var(--color-secondary)]">{label}</span>
      <span
        className={cn(
          "font-medium",
          tone === "good" && "text-[var(--color-green)]",
          tone === "warn" && "text-[var(--color-orange)]"
        )}
      >
        {value}
      </span>
    </div>
  );
}
