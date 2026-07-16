import { ShieldCheck, TrendingUp, Layers, Building2 } from "lucide-react";
import { PageHero, Section, FeatureGrid, CtaBand } from "@/components/marketing/sections";

export const metadata = { title: "For companies" };

export default function ForCompaniesPage() {
  return (
    <>
      <PageHero eyebrow="For companies" title="Scale onboarding without burning your best closer." subtitle="Turn tribal knowledge into a repeatable, measurable ramp. Every new hire gets the same reps, the same scorecard, and the same objection library on day one." primaryCta={{ href: "/contact", label: "Talk to us" }} secondaryCta={{ href: "/pricing", label: "See pricing" }} />
      <Section className="pb-16">
        <FeatureGrid items={[
          { icon: TrendingUp, title: "Faster ramp", body: "New hires arrive at their first real door already having handled the top ten objections a dozen times." },
          { icon: Layers, title: "One source of truth", body: "Approved scripts and playbook content live in one place your whole org practices against." },
          { icon: Building2, title: "Consistency across offices", body: "Every branch trains against the same scenarios and thresholds, so quality doesn't depend on geography." },
          { icon: ShieldCheck, title: "Privacy & control", body: "You decide whether recordings are transcribed and how long data is retained." },
        ]} />
      </Section>
      <CtaBand title="Bring measurable training to your whole org." subtitle="We'll help you roll it out office by office." cta={{ href: "/contact", label: "Contact sales" }} />
    </>
  );
}
