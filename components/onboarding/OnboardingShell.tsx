"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Logo } from "@/components/Logo";
import { cn } from "@/lib/utils";

export const ONBOARDING_STEPS = [
  { slug: "role", label: "Role" },
  { slug: "industry", label: "Industry" },
  { slug: "experience", label: "Experience" },
  { slug: "goal", label: "Goal" },
  { slug: "self-assessment", label: "Self-assessment" },
  { slug: "mic-check", label: "Mic check" },
  { slug: "first-scenario", label: "Ready" },
];

export function OnboardingShell({
  step,
  title,
  subtitle,
  children,
  footer,
}: {
  step: number;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  const reduce = useReducedMotion();
  return (
    <div className="min-h-screen bg-[var(--color-base)] flex flex-col items-center px-5 py-10">
      <main id="main-content" className="w-full max-w-lg">
        <div className="flex justify-center mb-8"><Logo /></div>
        <div className="flex items-center gap-1.5 justify-center mb-2" aria-hidden="true">
          {ONBOARDING_STEPS.map((s, i) => (
            <div key={s.slug} className={cn("h-1.5 rounded-full transition-all", i === step ? "w-7 bg-[var(--color-gold)]" : i < step ? "w-1.5 bg-[var(--color-gold)]" : "w-1.5 bg-[var(--color-border-strong)]")} />
          ))}
        </div>
        <p className="text-center text-2xs uppercase tracking-widest text-[var(--color-disabled)] mb-6">
          Step {step + 1} of {ONBOARDING_STEPS.length}
        </p>
        <motion.div
          key={step}
          className="card p-6 md:p-7 min-h-[340px] flex flex-col shadow-pop"
          initial={reduce ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex-1">
            <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
            {subtitle && <p className="text-sm text-[var(--color-secondary)] mt-1.5">{subtitle}</p>}
            <div className="mt-6">{children}</div>
          </div>
          {footer && <div className="mt-8 flex items-center justify-between">{footer}</div>}
        </motion.div>
      </main>
    </div>
  );
}

export async function saveOnboarding(body: Record<string, unknown>) {
  try {
    await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    /* best-effort */
  }
}
