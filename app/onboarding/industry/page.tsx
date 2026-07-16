"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { OnboardingShell, saveOnboarding } from "@/components/onboarding/OnboardingShell";
import { Button } from "@/components/ui";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const INDUSTRIES = [
  { id: "solar", label: "Solar", available: true },
  { id: "pest_control", label: "Pest Control", available: false },
  { id: "roofing", label: "Roofing", available: false },
  { id: "security", label: "Home Security", available: false },
  { id: "internet", label: "Fiber Internet", available: false },
];

export default function IndustryStep() {
  const router = useRouter();
  const [industry, setIndustry] = useState("solar");
  const [saving, setSaving] = useState(false);
  async function next() {
    setSaving(true);
    await saveOnboarding({ industry });
    router.push("/onboarding/experience");
    router.refresh();
  }
  return (
    <OnboardingShell step={1} title="What industry?" subtitle="Solar is fully live. Others are coming soon."
      footer={<><Button variant="ghost" onClick={() => router.push("/onboarding/role")}>Back</Button><Button loading={saving} onClick={next}>Continue</Button></>}>
      <div className="grid gap-2.5">
        {INDUSTRIES.map((ind) => (
          <button key={ind.id} disabled={!ind.available} onClick={() => ind.available && setIndustry(ind.id)}
            className={cn("flex items-center justify-between px-4 py-3.5 rounded-xl border text-sm text-left transition-colors",
              !ind.available && "opacity-40 cursor-not-allowed border-[var(--color-border)]",
              ind.available && industry === ind.id && "border-[var(--color-gold)] bg-[rgba(227,179,65,0.08)]",
              ind.available && industry !== ind.id && "border-[var(--color-border)] hover:bg-white/5")}>
            {ind.label}
            {!ind.available ? <span className="text-2xs uppercase tracking-wide text-[var(--color-disabled)]">Coming soon</span>
              : industry === ind.id ? <Check size={16} className="text-[var(--color-gold)]" /> : null}
          </button>
        ))}
      </div>
    </OnboardingShell>
  );
}
