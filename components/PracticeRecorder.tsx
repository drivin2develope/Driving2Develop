"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Mic, Pause, Play, Square, Info } from "lucide-react";
import { ScenarioDTO, STAGE_LABELS } from "@/lib/scenario-types";
import { Waveform } from "@/components/Waveform";
import {
  countWords,
  countFillerWords,
  wordsPerMinute,
  computePaceVariance,
  computePauses,
  keywordAdherenceScore,
  toneScore,
  clarityScore,
} from "@/lib/analysis";
import { cn } from "@/lib/utils";

type WordChunk = { atMs: number; wordCount: number };

export function PracticeRecorder({ scenario }: { scenario: ScenarioDTO }) {
  const router = useRouter();

  const [phase, setPhase] = useState<"idle" | "recording" | "paused" | "ending" | "unsupported">("idle");
  const [elapsedMs, setElapsedMs] = useState(0);
  const [finalTranscript, setFinalTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [levels, setLevels] = useState<number[]>([]);
  const [homeownerLineIdx, setHomeownerLineIdx] = useState(-1);
  const [supportError, setSupportError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

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
  const homeownerTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
        "Your browser doesn't support live speech recognition. Try the latest Chrome or Edge on desktop or Android."
      );
      setPhase("unsupported");
    }
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
    if (homeownerTimeoutRef.current) clearTimeout(homeownerTimeoutRef.current);
    if (typeof window !== "undefined") window.speechSynthesis?.cancel();
  }

  async function start() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Audio analysis (waveform + amplitude + pitch-proxy samples)
      const AudioContextCtor = (window as any).AudioContext || (window as any).webkitAudioContext;
      const audioCtx: AudioContext = new AudioContextCtor();
      audioCtxRef.current = audioCtx;
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 1024;
      source.connect(analyser);
      analyserRef.current = analyser;

      // MediaRecorder purely for pause/resume-accurate timing (audio discarded)
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      recorder.start();

      // Speech recognition -> real transcript
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

      // Sample amplitude + pitch-proxy (zero-crossing rate) periodically
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

      scheduleHomeownerLines();
    } catch (err) {
      setSupportError("Microphone access is required for live practice. Please allow mic access and try again.");
    }
  }

  function scheduleHomeownerLines() {
    const script = scenario.homeownerScript;
    if (!script.length) return;
    const totalMs = scenario.estimatedMinutes * 60 * 1000;
    const stepMs = totalMs / (script.length + 1);

    let idx = 0;
    function playNext() {
      if (idx >= script.length) return;
      const line = script[idx];
      setHomeownerLineIdx(idx);
      homeownerLinesShownRef.current.push(line.line);
      if (typeof window !== "undefined" && window.speechSynthesis) {
        const utterance = new SpeechSynthesisUtterance(line.line);
        utterance.rate = 0.98;
        utterance.pitch = 1.0;
        window.speechSynthesis.speak(utterance);
      }
      idx++;
      homeownerTimeoutRef.current = setTimeout(playNext, stepMs);
    }
    homeownerTimeoutRef.current = setTimeout(playNext, Math.min(2500, stepMs * 0.4));
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
    if (homeownerTimeoutRef.current) clearTimeout(homeownerTimeoutRef.current);
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

  const currentStage = homeownerLineIdx >= 0 ? scenario.homeownerScript[homeownerLineIdx]?.stage : null;

  if (phase === "unsupported") {
    return (
      <div className="card p-6 max-w-lg mx-auto mt-10 text-center">
        <Info className="mx-auto text-[var(--color-orange)]" />
        <p className="text-sm mt-3">{supportError}</p>
      </div>
    );
  }

  return (
    <div className="px-5 md:px-8 pb-10">
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
              <Info size={12} /> Scripted practice partner - not a live conversational AI voice
            </p>

            <div className="rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] p-4 mb-4 min-h-[74px]">
              <p className="text-xs text-[var(--color-purple)] font-medium mb-1">Homeowner ({scenario.personality})</p>
              <p className="text-sm">
                {homeownerLineIdx >= 0
                  ? scenario.homeownerScript[homeownerLineIdx]?.line
                  : "Listening for your opening line..."}
              </p>
            </div>

            <Waveform levels={levels} active={phase === "recording"} />

            <div className="rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] p-4 mt-4 min-h-[80px]">
              <p className="text-xs text-[var(--color-secondary)] font-medium mb-1">You (live transcript)</p>
              <p className="text-sm">
                {finalTranscript}
                <span className="text-[var(--color-secondary)]"> {interimTranscript}</span>
                {!finalTranscript && !interimTranscript && phase === "idle" && (
                  <span className="text-[var(--color-disabled)]">Press start and begin your pitch...</span>
                )}
              </p>
            </div>

            {supportError && <p className="text-xs text-[var(--color-red)] mt-3">{supportError}</p>}

            <div className="flex items-center gap-3 mt-5">
              {phase === "idle" && (
                <button onClick={start} className="btn-gold flex-1 py-3 text-sm flex items-center justify-center gap-2">
                  <Mic size={16} /> Start Practice
                </button>
              )}
              {phase === "recording" && (
                <>
                  <button onClick={pause} className="btn-secondary flex-1 py-3 text-sm flex items-center justify-center gap-2">
                    <Pause size={16} /> Pause
                  </button>
                  <button
                    onClick={endSession}
                    className="flex-1 py-3 text-sm rounded-lg bg-[var(--color-red)] text-white flex items-center justify-center gap-2"
                  >
                    <Square size={16} /> End Session
                  </button>
                </>
              )}
              {phase === "paused" && (
                <>
                  <button onClick={resume} className="btn-gold flex-1 py-3 text-sm flex items-center justify-center gap-2">
                    <Play size={16} /> Resume
                  </button>
                  <button
                    onClick={endSession}
                    className="flex-1 py-3 text-sm rounded-lg bg-[var(--color-red)] text-white flex items-center justify-center gap-2"
                  >
                    <Square size={16} /> End Session
                  </button>
                </>
              )}
              {(phase === "ending" || submitting) && (
                <button disabled className="btn-gold flex-1 py-3 text-sm opacity-70">
                  Scoring your session...
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
                    stage === currentStage
                      ? "border-[var(--color-gold)] text-[var(--color-gold)] bg-[rgba(227,179,65,0.08)]"
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
          </div>
          <p className="text-[11px] text-[var(--color-secondary)] mt-5">
            Computed live from your real transcript and audio signal - pausing won't reset these numbers.
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
