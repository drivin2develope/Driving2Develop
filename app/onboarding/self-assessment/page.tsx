"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { OnboardingShell } from "@/components/onboarding/OnboardingShell";
import { Button } from "@/components/ui";

const QUESTIONS = [
  { key: "confidence", label: "How confident do you feel on the doorstep today?" },
  { key: "objections", label: "How well do you handle a hard objection?" },
  { key: "closing", label: "How strong is your close right now?" },
];

export default function SelfAssessmentStep() {
  const router = useRouter();
  const [values, setValues] = useState<Record<string, number>>({ confidence: 60, objections: 50, closing: 55 });

  function next() {
    try {
      localStorage.setItem("d2d_self_assessment", JSON.stringify(values));
    } catch {}
    router.push("/onboarding/mic-check");
  }

  return (
    <OnboardingShell step={4} title="Quick self-assessment" subtitle="No wrong answers — this just sets your starting baseline."
      footer={<><Button variant="ghost" onClick={() => router.push("/onboarding/goal")}>Back</Button><Button onClick={next}>Continue</Button></>}>
      <div className="space-y-6">
        {QUESTIONS.map((q) => (
          <div key={q.key}>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor={q.key} className="text-sm">{q.label}</label>
              <span className="text-sm font-semibold text-[var(--color-gold-text)] tabular-nums w-8 text-right">{values[q.key]}</span>
            </div>
            <input
              id={q.key}
              type="range"
              min={0}
              max={100}
              value={values[q.key]}
              onChange={(e) => setValues((v) => ({ ...v, [q.key]: Number(e.target.value) }))}
              className="w-full accent-[var(--color-gold)] cursor-pointer"
            />
          </div>
        ))}
      </div>
    </OnboardingShell>
  );
}
