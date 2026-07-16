import Link from "next/link";
import { Compass } from "lucide-react";
import { Logo } from "@/components/Logo";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[var(--color-base)] flex flex-col items-center justify-center px-5 text-center relative">
      <div className="absolute inset-x-0 top-0 h-72 hero-glow pointer-events-none" aria-hidden="true" />
      <div className="relative">
        <div className="flex justify-center mb-8"><Logo /></div>
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[rgba(227,179,65,0.12)] text-[var(--color-gold-text)]"><Compass size={26} /></div>
        <p className="text-5xl font-semibold tracking-tight gold-gradient-text">404</p>
        <h1 className="text-xl font-semibold tracking-tight mt-3">This door doesn&apos;t open</h1>
        <p className="text-sm text-[var(--color-secondary)] mt-2 max-w-sm mx-auto">The page you&apos;re looking for doesn&apos;t exist or has moved.</p>
        <div className="mt-7 flex items-center justify-center gap-3">
          <Link href="/" className="rounded-lg bg-[var(--color-gold)] px-5 py-2.5 text-sm font-semibold text-[var(--color-gold-ink)] hover:brightness-110 transition">Back home</Link>
          <Link href="/dashboard" className="rounded-lg border border-[var(--color-border-strong)] px-5 py-2.5 text-sm hover:bg-[var(--color-border)] transition">Go to dashboard</Link>
        </div>
      </div>
    </div>
  );
}
