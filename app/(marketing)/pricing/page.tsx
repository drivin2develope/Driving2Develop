import Link from "next/link";
import { Check } from "lucide-react";
import { PageHero, Section, CtaBand } from "@/components/marketing/sections";
import { FadeIn, Badge } from "@/components/ui";

export const metadata = { title: "Pricing" };

const PLANS = [
  { name: "Free", price: "$0", cadence: "forever", body: "For reps kicking the tires.", cta: "Start Free", featured: false,
    features: ["3 practice sessions / month", "1 industry (Solar)", "Basic scorecard", "Session history"] },
  { name: "Core", price: "$39", cadence: "per rep / month", body: "For reps who want to win.", cta: "Get Core", featured: true,
    features: ["Unlimited practice", "Full scorecards & coaching", "Skill tree & achievements", "Retry-from-objection", "Objection library", "Leaderboards"] },
  { name: "Team", price: "$99", cadence: "per rep / month", body: "For managers and orgs.", cta: "Get Team", featured: false,
    features: ["Everything in Core", "Manager dashboard", "Team assignments", "Weakness aggregation", "Compliance flags", "Playbook & Copilot"] },
];

const FAQ = [
  { q: "Do I need an API key?", a: "No. Live practice uses your browser's built-in speech recognition — no paid AI needed. Uploaded-recording transcription is an optional operator add-on." },
  { q: "Which browsers work?", a: "Live, real-time roleplay needs a browser with the Web Speech API (Chrome, Edge, and most Chromium-based browsers). We detect support automatically — if your browser doesn't have it, you can record or upload a practice conversation instead and get the same scorecard." },
  { q: "Can I switch plans later?", a: "Yes, upgrade or downgrade anytime. Team billing is per active rep, prorated." },
];

export default function PricingPage() {
  return (
    <>
      <PageHero eyebrow="Pricing" title="Simple pricing that scales with your team." subtitle="Start free, upgrade when the reps pay off." />
      <Section className="pb-16">
        <div className="grid md:grid-cols-3 gap-6 items-start">
          {PLANS.map((p) => (
            <FadeIn key={p.name} className={`card p-7 flex flex-col ${p.featured ? "border-[var(--color-gold)] shadow-gold relative" : ""}`}>
              {p.featured && <span className="absolute -top-3 left-7"><Badge color="gold">Most popular</Badge></span>}
              <h3 className="font-medium text-lg">{p.name}</h3>
              <p className="text-sm text-[var(--color-secondary)] mt-1">{p.body}</p>
              <div className="mt-5 flex items-baseline gap-1.5">
                <span className="text-4xl font-semibold tracking-tight">{p.price}</span>
                <span className="text-sm text-[var(--color-secondary)]">{p.cadence}</span>
              </div>
              <ul className="mt-6 space-y-2.5 flex-1">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <Check size={16} className="text-[var(--color-gold-text)] mt-0.5 shrink-0" />
                    <span className="text-[var(--color-secondary)]">{f}</span>
                  </li>
                ))}
              </ul>
              <Link href="/signup" className={`mt-7 text-center text-sm py-3 rounded-lg font-semibold transition ${p.featured ? "bg-[var(--color-gold)] text-[var(--color-gold-ink)] hover:brightness-110" : "border border-[var(--color-border-strong)] hover:bg-[var(--color-border)]"}`}>
                {p.cta}
              </Link>
            </FadeIn>
          ))}
        </div>
      </Section>
      <Section className="pb-16">
        <FadeIn><h2 className="text-2xl font-semibold tracking-tight mb-6">Frequently asked</h2></FadeIn>
        <div className="grid md:grid-cols-3 gap-6">
          {FAQ.map((f) => (
            <FadeIn key={f.q} className="card p-5">
              <h3 className="font-medium text-sm">{f.q}</h3>
              <p className="text-sm text-[var(--color-secondary)] mt-2 leading-relaxed">{f.a}</p>
            </FadeIn>
          ))}
        </div>
      </Section>
      <CtaBand title="Start free. Upgrade when you're closing more." cta={{ href: "/signup", label: "Create free account" }} />
    </>
  );
}
