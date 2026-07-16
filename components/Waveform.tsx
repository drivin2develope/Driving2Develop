"use client";

import { useEffect, useRef } from "react";

/** Canvas waveform driven by live amplitude samples (0-255 range from an AnalyserNode). */
export function Waveform({ levels, active }: { levels: number[]; active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);

    const barCount = 40;
    const recent = levels.slice(-barCount);
    const padded = new Array(barCount - recent.length).fill(0).concat(recent);
    const barWidth = width / barCount;

    padded.forEach((level, i) => {
      const h = Math.max(3, (level / 255) * height);
      const x = i * barWidth;
      const y = (height - h) / 2;
      ctx.fillStyle = active ? "#E3B341" : "rgba(227,179,65,0.3)";
      ctx.globalAlpha = 0.4 + (i / barCount) * 0.6;
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(x + 1, y, barWidth - 2, h, 3);
      } else {
        ctx.rect(x + 1, y, barWidth - 2, h);
      }
      ctx.fill();
    });
    ctx.globalAlpha = 1;
  }, [levels, active]);

  return <canvas ref={canvasRef} className="w-full h-16" />;
}
