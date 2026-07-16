"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { OnboardingShell, saveOnboarding } from "@/components/onboarding/OnboardingShell";
import { RadioGroup, RadioCard, Button } from "@/components/ui";

const GOALS = [
  { id: "close_more", label: "Close more deals" },
  { id: "handle_objections", label: "Handle objections better" },
  { id: "reduce_fillers", label: "Sound more confident" },
  { id: "onboard_team", label: "Onboard my team faster" },
];

export default function GoalStep() {
  const router = useRouter();
  const [goal, setGoal] = useState("close_more");
  const [saving, setSaving] = useState(false);
  async function next() {
    setSaving(true);
    await saveOnboarding({ goal });
    router.push("/onboarding/self-assessment");
    router.refresh();
  }
  return (
    <OnboardingShell step={3} title="What's your main goal?" subtitle="We'll recommend scenarios around this."
      footer={<><Button variant="ghost" onClick={() => router.push("/onboarding/experience")}>Back</Button><Button loading={saving} onClick={next}>Continue</Button></>}>
      <RadioGroup value={goal} onValueChange={setGoal}>
        {GOALS.map((g) => <RadioCard key={g.id} value={g.id} title={g.label} />)}
      </RadioGroup>
    </OnboardingShell>
  );
}
