import { Users, Flag, ClipboardList, BarChart3 } from "lucide-react";
import { PageHero, Section, FeatureGrid, CtaBand } from "@/components/marketing/sections";

export const metadata = { title: "For managers" };

export default function ForManagersPage() {
  return (
    <>
      <PageHero eyebrow="For managers" title="Coach the whole team without cloning yourself." subtitle="See who's slipping, assign the exact drill they need, and let the scorecards do the diagnosing so your 1:1 time goes further." primaryCta={{ href: "/signup", label: "Get started" }} secondaryCta={{ href: "/for-companies", label: "For companies" }} />
      <Section className="pb-16">
        <FeatureGrid items={[
          { icon: Users, title: "Team roster at a glance", body: "Latest score, trend and last-active for every rep, sorted so the reps who need you float to the top." },
          { icon: Flag, title: "Needs-attention flags", body: "Compliance-adjacent and low-score signals derived from real metric thresholds — not vibes." },
          { icon: ClipboardList, title: "Targeted assignments", body: "Assign a specific scenario with a note and a due date; reps see it as today's focus." },
          { icon: BarChart3, title: "Team analytics", body: "Aggregate weakest areas across the whole team so you know what to run in the next huddle." },
        ]} />
      </Section>
      <CtaBand title="Spend your coaching time where it counts." cta={{ href: "/signup", label: "Start Free" }} />
    </>
  );
}
