import { PageHero, Section, CtaBand } from "@/components/marketing/sections";
import { FadeIn } from "@/components/ui";

export const metadata = { title: "About" };

export default function AboutPage() {
  return (
    <>
      <PageHero eyebrow="About" title="We think reps deserve real reps." subtitle="Driven2Develop was built on a simple belief: the doorstep is the worst place to practice." />
      <Section className="pb-16 max-w-3xl space-y-6 text-[var(--color-secondary)] leading-relaxed">
        <FadeIn><p>Door-to-door is one of the last sales motions still trained by osmosis — shadow a veteran, get a slide deck, and figure out the objections live on real homeowners. That burns leads and breaks confidence.</p></FadeIn>
        <FadeIn><p>We wanted a way to rep the hard moments the way athletes and pilots do: in a realistic simulator, with an honest scorecard, on your own schedule. So we built one that runs on real speech recognition and real audio analysis — no smoke, no faked numbers, and no expensive AI bill.</p></FadeIn>
        <FadeIn><p>Our north star is honesty: if a metric isn&apos;t backed by something you actually said or did, we don&apos;t show it. That principle shows up everywhere in the product, from the &ldquo;scripted partner&rdquo; label to the &ldquo;transcript unavailable&rdquo; state on uploads.</p></FadeIn>
      </Section>
      <CtaBand title="Come rep with us." cta={{ href: "/signup", label: "Start Free" }} />
    </>
  );
}
