"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Logo } from "@/components/Logo";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return (
    <div className="min-h-screen bg-[var(--color-base)] flex flex-col items-center justify-center px-5 text-center">
      <div className="absolute inset-x-0 top-0 h-72 hero-glow pointer-events-none" aria-hidden="true" />
      <div className="relative">
        <div className="flex justify-center mb-8"><Logo /></div>
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[rgba(248,113,113,0.12)] text-[var(--color-red)]"><AlertTriangle size={26} /></div>
        <h1 className="text-2xl font-semibold tracking-tight">Something went wrong</h1>
        <p className="text-sm text-[var(--color-secondary)] mt-2 max-w-sm mx-auto">An unexpected error interrupted this page. Try again, or head back home.</p>
        <div className="mt-7 flex items-center justify-center gap-3">
          <button onClick={reset} className="rounded-lg bg-[var(--color-gold)] px-5 py-2.5 text-sm font-semibold text-[var(--color-gold-ink)] hover:brightness-110 transition">Try again</button>
          <Link href="/" className="rounded-lg border border-[var(--color-border-strong)] px-5 py-2.5 text-sm hover:bg-[var(--color-border)] transition">Back home</Link>
        </div>
      </div>
    </div>
  );
}
