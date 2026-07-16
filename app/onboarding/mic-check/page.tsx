"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { OnboardingShell } from "@/components/onboarding/OnboardingShell";
import { Button, ProgressBar } from "@/components/ui";
import { Mic } from "lucide-react";
import { cn } from "@/lib/utils";

export default function MicCheckStep() {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "requesting" | "granted" | "denied">("idle");
  const [level, setLevel] = useState(0);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
  }, []);

  async function requestMic() {
    setStatus("requesting");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      setStatus("granted");
      const Ctx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new Ctx();
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      source.connect(analyser);
      const data = new Uint8Array(analyser.frequencyBinCount);
      function tick() {
        analyser.getByteFrequencyData(data);
        const avg = data.reduce((a, b) => a + b, 0) / data.length;
        setLevel(Math.min(100, Math.round((avg / 140) * 100)));
        rafRef.current = requestAnimationFrame(tick);
      }
      tick();
    } catch {
      setStatus("denied");
    }
  }

  function finish() {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    router.push("/onboarding/first-scenario");
  }

  return (
    <OnboardingShell step={5} title="Mic check" subtitle="We need mic access for live practice sessions."
      footer={<><Button variant="ghost" onClick={() => router.push("/onboarding/self-assessment")}>Back</Button><Button onClick={finish}>Continue</Button></>}>
      <div className="flex flex-col items-center justify-center gap-5 py-6">
        <div className={cn("flex h-20 w-20 items-center justify-center rounded-full border-2 transition-all", status === "granted" ? "border-[var(--color-green)]" : "border-[var(--color-border-strong)]")}
          style={{ boxShadow: status === "granted" ? `0 0 0 ${level / 6}px rgba(52,211,153,0.15)` : "none" }}>
          <Mic size={28} className={status === "granted" ? "text-[var(--color-green)]" : "text-[var(--color-secondary)]"} />
        </div>
        {status === "granted" && <div className="w-full max-w-[220px]"><ProgressBar value={level} color="var(--color-green)" /></div>}
        {status === "idle" && <Button onClick={requestMic}>Enable microphone</Button>}
        {status === "requesting" && <p className="text-sm text-[var(--color-secondary)]">Requesting access…</p>}
        {status === "granted" && <p className="text-sm text-[var(--color-green)]">Mic is live — speak to see the level move.</p>}
        {status === "denied" && (
          <div className="text-center">
            <p className="text-sm text-[var(--color-red)]">Mic access denied.</p>
            <p className="text-xs text-[var(--color-secondary)] mt-1">You can continue and enable it later in Settings.</p>
          </div>
        )}
      </div>
    </OnboardingShell>
  );
}
