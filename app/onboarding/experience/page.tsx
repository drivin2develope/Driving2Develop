"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { OnboardingShell, saveOnboarding } from "@/components/onboarding/OnboardingShell";
import { RadioGroup, RadioCard, Button } from "@/components/ui";

const LEVELS = [
  { id: "new", label: "Brand new", body: "First 30 days in the field" },
  { id: "developing", label: "Developing", body: "A few months in, still building habits" },
  { id: "experienced", label: "Experienced", body: "6+ months, sharpening the edges" },
  { id: "veteran", label: "Veteran", body: "Multiple seasons, mentoring others" },
];

export default function ExperienceStep() {
  const router = useRouter();
  const [level, setLevel] = useState("developing");
  const [saving, setSaving] = useState(false);
  async function next() {
    setSaving(true);
    await saveOnboarding({ experienceLevel: level });
    router.push("/onboarding/goal");
    router.refresh();
  }
  return (
    <OnboardingShell step={2} title="Where are you at?" subtitle="We'll calibrate difficulty accordingly."
      footer={<><Button variant="ghost" onClick={() => router.push("/onboarding/industry")}>Back</Button><Button loading={saving} onClick={next}>Continue</Button></>}>
      <RadioGroup value={level} onValueChange={setLevel}>
        {LEVELS.map((l) => <RadioCard key={l.id} value={l.id} title={l.label} description={l.body} />)}
      </RadioGroup>
    </OnboardingShell>
  );
}
