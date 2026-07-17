"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { UploadCloud, FileAudio, CheckCircle2, Circle, Loader2 } from "lucide-react";
import { Card, Button, Checkbox } from "@/components/ui";
import { cn } from "@/lib/utils";

type Stage = "idle" | "uploading" | "decoding" | "analyzing" | "transcribing" | "scorecard" | "done" | "error";

const STAGE_ORDER: { key: Stage; label: string }[] = [
  { key: "uploading", label: "Uploading" },
  { key: "decoding", label: "Decoding audio" },
  { key: "analyzing", label: "Analyzing energy & pauses" },
  { key: "transcribing", label: "Transcribing (optional)" },
  { key: "scorecard", label: "Building scorecard" },
];

function computeAcousticMetrics(audioBuffer: AudioBuffer) {
  const channel = audioBuffer.getChannelData(0);
  const sampleRate = audioBuffer.sampleRate;
  const windowSize = Math.floor(sampleRate * 0.05);
  const windows: number[] = [];
  for (let i = 0; i < channel.length; i += windowSize) {
    let sumSquares = 0;
    const end = Math.min(i + windowSize, channel.length);
    for (let j = i; j < end; j++) sumSquares += channel[j] * channel[j];
    windows.push(Math.sqrt(sumSquares / (end - i)));
  }
  const maxRms = Math.max(...windows, 0.0001);
  const amplitudeSamples = windows.map((w) => (w / maxRms) * 255);
  const silenceThreshold = maxRms * 0.08;
  const pauseSegments: { startMs: number; endMs: number }[] = [];
  let silenceStart: number | null = null;
  const msPerWindow = (windowSize / sampleRate) * 1000;
  windows.forEach((w, i) => {
    const tMs = i * msPerWindow;
    if (w < silenceThreshold) {
      if (silenceStart === null) silenceStart = tMs;
    } else if (silenceStart !== null) {
      if (tMs - silenceStart >= 500) pauseSegments.push({ startMs: silenceStart, endMs: tMs });
      silenceStart = null;
    }
  });
  let peaks = 0;
  for (let i = 2; i < windows.length - 2; i++) {
    if (windows[i] > silenceThreshold * 2.2 && windows[i] > windows[i - 1] && windows[i] >= windows[i + 1]) peaks++;
  }
  const durationSeconds = audioBuffer.duration;
  const proxyWordsPerMinute = Math.round((peaks / Math.max(durationSeconds, 1)) * 60 * 0.62);
  return { amplitudeSamples, pauseSegments, durationSeconds, proxyWordsPerMinute };
}

export function UploadFlow() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [consent, setConsent] = useState(false);
  const [stage, setStage] = useState<Stage>("idle");
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) setFile(dropped);
  }, []);

  async function processAndUpload() {
    if (!file) return;
    setError(null);
    try {
      setStage("uploading");
      const arrayBuffer = await file.arrayBuffer();
      setStage("decoding");
      const Ctx = (window as any).AudioContext || (window as any).webkitAudioContext;
      const audioCtx: AudioContext = new Ctx();
      const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer.slice(0));
      setStage("analyzing");
      const metrics = computeAcousticMetrics(audioBuffer);
      await new Promise((r) => setTimeout(r, 400));
      setStage("transcribing");
      const formData = new FormData();
      formData.append("audio", file);
      formData.append("payload", JSON.stringify({
        durationSeconds: metrics.durationSeconds,
        pauseSegments: metrics.pauseSegments,
        amplitudeSamples: metrics.amplitudeSamples,
        proxyWordsPerMinute: metrics.proxyWordsPerMinute,
      }));
      setStage("scorecard");
      const res = await fetch("/api/sessions", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed.");
      setStage("done");
      router.push(`/upload/processing/${data.id}`);
    } catch (err: any) {
      setError(err.message || "Something went wrong processing this file.");
      setStage("error");
    }
  }

  if (stage !== "idle" && stage !== "error") {
    return (
      <div className="px-5 md:px-8">
        <Card className="max-w-md mx-auto mt-6">
          <h3 className="font-medium text-sm mb-5">Processing {file?.name}</h3>
          <div className="space-y-3.5">
            {STAGE_ORDER.map((s, i) => {
              const currentIdx = STAGE_ORDER.findIndex((x) => x.key === stage);
              const done = i < currentIdx || stage === "done";
              const active = s.key === stage;
              return (
                <div key={s.key} className="flex items-center gap-3 text-sm">
                  {done ? <CheckCircle2 size={18} className="text-[var(--color-green)]" />
                    : active ? <Loader2 size={18} className="animate-spin text-[var(--color-gold)]" />
                    : <Circle size={18} className="text-[var(--color-disabled)]" />}
                  <span className={done || active ? "text-[var(--color-primary)]" : "text-[var(--color-secondary)]"}>{s.label}</span>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="px-5 md:px-8 pb-10 max-w-xl mx-auto">
      <div onDragOver={(e) => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)} onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        role="button" tabIndex={0} aria-label="Upload an audio recording"
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") inputRef.current?.click(); }}
        className={cn("card p-10 flex flex-col items-center text-center cursor-pointer border-dashed transition-colors", dragOver && "border-[var(--color-gold)] bg-[rgba(227,179,65,0.04)]")}>
        <input ref={inputRef} type="file" accept="audio/mpeg,audio/wav,audio/mp4,audio/x-m4a,.mp3,.wav,.m4a" className="hidden" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
        {file ? (
          <>
            <FileAudio className="text-[var(--color-gold)]" size={28} />
            <p className="text-sm font-medium mt-3">{file.name}</p>
            <p className="text-xs text-[var(--color-secondary)] mt-1">{(file.size / 1024 / 1024).toFixed(1)} MB — click to change</p>
          </>
        ) : (
          <>
            <UploadCloud className="text-[var(--color-secondary)]" size={28} />
            <p className="text-sm font-medium mt-3">Drag & drop a recording here</p>
            <p className="text-xs text-[var(--color-secondary)] mt-1">mp3, wav, or m4a — click to browse</p>
          </>
        )}
      </div>

      <div className="mt-5">
        <Checkbox checked={consent} onCheckedChange={(v) => setConsent(!!v)}
          label="I confirm I'm authorized to use this recording for training purposes." />
      </div>

      {error && <p className="text-sm text-[var(--color-red)] mt-3" role="alert">{error}</p>}

      <Button disabled={!file || !consent} onClick={processAndUpload} className="w-full mt-6">Analyze Recording</Button>

      <Card className="mt-6 text-xs text-[var(--color-secondary)] leading-relaxed">
        Duration, pacing, pauses and volume come from real signal processing on the audio you upload. Transcript-based
        coaching (filler words, keyword adherence) requires speech-to-text — if an
        <code className="mx-1 px-1 py-0.5 rounded bg-white/5">OPENAI_API_KEY</code> is configured on the server, this upgrades
        automatically. Otherwise those fields show as unavailable rather than guessed.
      </Card>
    </div>
  );
}
