import { PageHero, Section, CtaBand } from "@/components/marketing/sections";
import { FadeIn, Badge } from "@/components/ui";
import { Quote } from "lucide-react";

export const metadata = { title: "Customers" };

const STORIES = [
  { company: "Helios Solar", industry: "Solar", metric: "+22% close rate", quote: "New hires ramp in half the time. They've heard every objection before they knock.", who: "VP of Sales" },
  { company: "Brightline Energy", industry: "Solar", metric: "−31% ramp time", quote: "The scorecard turned 'good hustle out there' into an actual coaching plan.", who: "Regional Manager" },
  { company: "Peak Power Co.", industry: "Solar", metric: "3.1x more reps/week", quote: "My team practices on the drive in. That never happened with slide decks.", who: "Team Lead" },
];

export default function CustomersPage() {
  return (
    <>
      <PageHero eyebrow="Customers" title="Teams that rep more, close more." subtitle="A look at how door-to-door orgs use Driving2Develop to turn training into a measurable habit." />
      <Section className="pb-16">
        <div className="grid md:grid-cols-3 gap-6">
          {STORIES.map((s) => (
            <FadeIn key={s.company} className="card p-6 flex flex-col">
              <div className="flex items-center justify-between">
                <span className="font-medium">{s.company}</span>
                <Badge color="gold">{s.industry}</Badge>
              </div>
              <p className="mt-4 text-2xl font-semibold gold-gradient-text">{s.metric}</p>
              <Quote size={20} className="text-[var(--color-gold)] mt-5" />
              <p className="text-sm text-[var(--color-secondary)] mt-2 leading-relaxed flex-1">&ldquo;{s.quote}&rdquo;</p>
              <p className="text-xs text-[var(--color-disabled)] mt-4">— {s.who}, {s.company}</p>
            </FadeIn>
          ))}
        </div>
        <FadeIn className="mt-8 text-center text-xs text-[var(--color-disabled)]">
          Illustrative case studies shown with representative figures for this demo build.
        </FadeIn>
      </Section>
      <CtaBand title="Write your own results." cta={{ href: "/signup", label: "Start Free" }} />
    </>
  );
}
