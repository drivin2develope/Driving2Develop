import { Mic, Gauge, MessageSquare, Repeat } from "lucide-react";
import { PageHero, Section, CtaBand } from "@/components/marketing/sections";
import { FadeIn } from "@/components/ui";

export const metadata = { title: "How it works" };

const STEPS = [
  { icon: Mic, title: "1 · Practice live", body: "Pick a scenario and difficulty. Your mic captures a real transcript via the browser's speech recognition while a scripted homeowner pushes back with objections tuned to the personality you chose." },
  { icon: Gauge, title: "2 · Get scored", body: "The moment you end, your transcript and audio envelope run through a deterministic scoring engine: words-per-minute, filler-word rate, pace variance, keyword adherence, objection handling, closing strength, tone and confidence." },
  { icon: MessageSquare, title: "3 · Coach the gaps", body: "Your two or three lowest metrics generate specific, canned coaching tips — and the AI Coach page lets you drill into each with clickable suggestions grounded in your real numbers." },
  { icon: Repeat, title: "4 · Retry & track", body: "Retry from the exact weakness, then watch your trend line move session over session on your dashboard, history and skills pages." },
];

export default function HowItWorksPage() {
  return (
    <>
      <PageHero eyebrow="How it works" title="Four honest steps. Zero magic." subtitle="Every number you see comes from something you actually said or how you said it." primaryCta={{ href: "/signup", label: "Try it free" }} />
      <Section className="pb-8 space-y-4">
        {STEPS.map((s, i) => (
          <FadeIn key={s.title} delay={i * 0.05} className="card p-6 flex gap-5 items-start">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[rgba(227,179,65,0.1)] text-[var(--color-gold)]"><s.icon size={20} /></div>
            <div>
              <h3 className="font-medium text-lg">{s.title}</h3>
              <p className="text-[var(--color-secondary)] mt-1.5 leading-relaxed">{s.body}</p>
            </div>
          </FadeIn>
        ))}
      </Section>
      <Section className="pb-16">
        <FadeIn className="card p-6 border-[rgba(227,179,65,0.25)]">
          <h3 className="font-medium">What&apos;s real vs. simulated</h3>
          <p className="text-sm text-[var(--color-secondary)] mt-2 leading-relaxed">
            The homeowner is a scripted practice partner read aloud by your browser — not a live conversational voice model, and we say so on every screen.
            Uploaded recordings get real acoustic analysis; transcript-based metrics only unlock if your operator adds a transcription key. We never
            silently fake a number.
          </p>
        </FadeIn>
      </Section>
      <CtaBand title="Run your first scored roleplay." cta={{ href: "/signup", label: "Start Free" }} />
    </>
  );
}
