"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { OnboardingShell } from "@/components/onboarding/OnboardingShell";
import { Button, Badge } from "@/components/ui";
import { Lock } from "lucide-react";

type Scenario = { id: string; title: string; description: string; difficulty: string };

export default function FirstScenarioStep() {
  const router = useRouter();
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/scenarios")
      .then((r) => (r.ok ? r.json() : []))
      .then((list: Scenario[]) => {
        const first = list.find((s: any) => !s.isLocked) ?? list[0] ?? null;
        setScenario(first);
      })
      .catch(() => {});
  }, []);

  function go(href: string) {
    setLoading(true);
    router.push(href);
    router.refresh();
  }

  return (
    <OnboardingShell step={6} title="You're set" subtitle="Here's your recommended first scenario."
      footer={<><Button variant="ghost" onClick={() => router.push("/onboarding/mic-check")}>Back</Button>
        <Button loading={loading} onClick={() => go(scenario ? `/practice/session?scenarioId=${scenario.id}` : "/dashboard")}>
          Start first drill
        </Button></>}>
      <div className="card p-5 bg-[var(--color-surface)]">
        <div className="flex items-center justify-between">
          <span className="font-medium text-sm">{scenario?.title ?? "Friendly First Pitch"}</span>
          <Badge color="green">{scenario?.difficulty ?? "EASY"}</Badge>
        </div>
        <p className="text-xs text-[var(--color-secondary)] mt-2">
          {scenario?.description ?? "A warm, curious homeowner — perfect for finding your rhythm on intro, value prop, and close."}
        </p>
      </div>
      <button onClick={() => go("/dashboard")} className="text-sm text-[var(--color-secondary)] hover:text-[var(--color-primary)] mt-4">
        Skip and go to dashboard
      </button>
      <div className="mt-4 flex items-center gap-2 text-xs text-[var(--color-secondary)]">
        <Lock size={12} /> Humor Mode unlocks after 35 drills — stay tuned.
      </div>
    </OnboardingShell>
  );
}
