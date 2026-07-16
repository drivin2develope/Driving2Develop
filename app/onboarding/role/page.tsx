"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { OnboardingShell, saveOnboarding } from "@/components/onboarding/OnboardingShell";
import { RadioGroup, RadioCard, Button } from "@/components/ui";
import { Mic, Users } from "lucide-react";

export default function RoleStep() {
  const router = useRouter();
  const [role, setRole] = useState("REP");
  const [saving, setSaving] = useState(false);
  async function next() {
    setSaving(true);
    await saveOnboarding({ role });
    router.push("/onboarding/industry");
    router.refresh();
  }
  return (
    <OnboardingShell step={0} title="What's your role?" subtitle="This shapes what you'll see first."
      footer={<><span /><Button loading={saving} onClick={next}>Continue</Button></>}>
      <RadioGroup value={role} onValueChange={setRole}>
        <RadioCard value="REP" title="I'm a rep" description="I practice pitches and track my own scores" icon={<Mic size={18} />} />
        <RadioCard value="MANAGER" title="I manage a team" description="I assign drills and review my team's scores" icon={<Users size={18} />} />
      </RadioGroup>
    </OnboardingShell>
  );
}
