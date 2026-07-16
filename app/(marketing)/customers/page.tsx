import { PageHero, Section, CtaBand } from "@/components/marketing/sections";
import { FadeIn, Badge } from "@/components/ui";

export const metadata = { title: "Customers" };

const SCENARIOS = [
  {
    role: "New rep, first two weeks",
    industry: "Solar",
    body: "Runs the same tough objection scenario until the scorecard stops flagging it, before ever knocking on a real door.",
  },
  {
    role: "Manager reviewing a team",
    industry: "Solar",
    body: "Opens the Needs Attention queue instead of listening to every recording, and assigns a targeted drill from the evidence.",
  },
  {
    role: "Rep coming back from a slump",
    industry: "Solar",
    body: "Uses Practice This Moment on the scorecard to jump straight into a drill for whatever specific skill broke down last time, instead of redoing the whole scenario.",
  },
];

export default function CustomersPage() {
  return (
    <>
      <PageHero
        eyebrow="How teams use it"
        title="What a session looks like."
        subtitle="Driven2Develop is early. Rather than publish invented customer logos or performance stats we can't back up, here's what the product actually does for the people who'd use it."
      />
      <Section className="pb-16">
        <div className="grid md:grid-cols-3 gap-6">
          {SCENARIOS.map((s) => (
            <FadeIn key={s.role} className="card p-6 flex flex-col">
              <div className="flex items-center justify-between">
                <span className="font-medium">{s.role}</span>
                <Badge color="gold">{s.industry}</Badge>
              </div>
              <p className="text-sm text-[var(--color-secondary)] mt-3 leading-relaxed flex-1">{s.body}</p>
            </FadeIn>
          ))}
        </div>
        <FadeIn className="mt-8 text-center text-xs text-[var(--color-disabled)]">
          These are illustrative usage patterns, not quotes or results from real customers. We&apos;ll publish real
          case studies once we have documented ones.
        </FadeIn>
      </Section>
      <CtaBand title="Be one of the first teams on it." cta={{ href: "/signup", label: "Start Free" }} />
    </>
  );
}
