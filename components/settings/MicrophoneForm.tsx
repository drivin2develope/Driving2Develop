"use client";
import { useEffect, useState } from "react";
import { Card, CardHeader, Select, Button, ProgressBar, useToast } from "@/components/ui";

export function MicrophoneForm() {
  const { toast } = useToast();
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selected, setSelected] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [level, setLevel] = useState(0);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    try {
      const s = localStorage.getItem("d2d_mic_device");
      if (s) setSelected(s);
    } catch {}
  }, []);

  async function loadDevices() {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      const list = await navigator.mediaDevices.enumerateDevices();
      const mics = list.filter((d) => d.kind === "audioinput");
      setDevices(mics);
      if (mics[0] && !selected) setSelected(mics[0].deviceId);
      setError(null);
    } catch {
      setError("Microphone access denied — enable it in your browser settings to see device options.");
    }
  }

  function save(id: string) {
    setSelected(id);
    try { localStorage.setItem("d2d_mic_device", id); } catch {}
    toast({ kind: "success", title: "Microphone saved" });
  }

  async function test() {
    setTesting(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: selected ? { deviceId: selected } : true });
      const Ctx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new Ctx();
      const src = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      src.connect(analyser);
      const data = new Uint8Array(analyser.frequencyBinCount);
      const start = Date.now();
      const tick = () => {
        analyser.getByteFrequencyData(data);
        setLevel(Math.min(100, Math.round((data.reduce((a, b) => a + b, 0) / data.length / 140) * 100)));
        if (Date.now() - start < 5000) requestAnimationFrame(tick);
        else { stream.getTracks().forEach((t) => t.stop()); ctx.close(); setTesting(false); setLevel(0); }
      };
      tick();
    } catch { setTesting(false); setError("Couldn't start the mic test."); }
  }

  return (
    <Card>
      <CardHeader title="Microphone" subtitle="Choose which mic Driven2Develop uses for live practice." />
      {devices.length === 0 ? (
        <Button variant="secondary" onClick={loadDevices}>Detect microphones</Button>
      ) : (
        <div className="space-y-4">
          <Select value={selected} onChange={(e) => save(e.target.value)} aria-label="Microphone device">
            {devices.map((d) => <option key={d.deviceId} value={d.deviceId}>{d.label || "Microphone"}</option>)}
          </Select>
          <div>
            <Button variant="secondary" onClick={test} disabled={testing}>{testing ? "Listening…" : "Test microphone (5s)"}</Button>
            {testing && <div className="mt-3"><ProgressBar value={level} color="var(--color-green)" /></div>}
          </div>
        </div>
      )}
      {error && <p className="text-sm text-[var(--color-red)] mt-3" role="alert">{error}</p>}
    </Card>
  );
}
