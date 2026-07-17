import Link from "next/link";
import { Mic, Users, ArrowRight, MessageSquare, BarChart3, Gauge, ShieldCheck, Repeat } from "lucide-react";
import { Section, PageHero, FeatureGrid, CtaBand } from "@/components/marketing/sections";
import { FadeIn } from "@/components/ui";

export default function HomePage() {
  return (
    <>
      <div className="relative">
        <div className="absolute inset-0 hero-glow pointer-events-none" aria-hidden="true" />
        <Section className="pt-16 md:pt-24 pb-16 grid md:grid-cols-2 gap-12 items-center relative">
          <FadeIn>
            <span className="text-2xs font-semibold uppercase tracking-widest text-[var(--color-gold)]">
              Sales training that actually reps
            </span>
            <h1 className="mt-4 text-4xl md:text-5xl font-semibold tracking-tight leading-[1.08]">
              Practice the conversation <span className="gold-gradient-text">before the door opens.</span>
            </h1>
            <p className="mt-5 text-lg text-[var(--color-secondary)] max-w-md">
              Roleplay live against a scripted homeowner, get a real scorecard on your pace, filler words,
              tone and close, and drill the exact moment the pitch falls apart.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/signup" className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-gold)] px-6 py-3 text-sm font-semibold text-[var(--color-gold-ink)] shadow-gold hover:brightness-110 transition">
                Start Free <ArrowRight size={16} />
              </Link>
              <Link href="/how-it-works" className="inline-flex items-center gap-2 rounded-lg border border-[var(--color-border-strong)] px-6 py-3 text-sm hover:bg-white/5 transition">
                See how it works
              </Link>
            </div>
            <p className="mt-4 text-xs text-[var(--color-disabled)]">No credit card · Works in Chrome & Edge · Free tier forever</p>
          </FadeIn>

          <FadeIn delay={0.12} className="card p-5 relative">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-red)] animate-rec" />
                <span className="text-xs text-[var(--color-secondary)]">Live Roleplay · Solar · Realistic</span>
              </div>
              <span className="text-xs text-[var(--color-secondary)] tabular-nums">02:14</span>
            </div>
            <div className="rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] p-4 mb-4">
              <p className="text-xs text-[var(--color-purple)] font-medium mb-1">Homeowner (scripted)</p>
              <p className="text-sm">
                &ldquo;We already got quotes from two other companies, honestly this feels like a lot.&rdquo;
              </p>
            </div>
            <div className="flex items-end gap-[3px] h-14 mb-4" aria-hidden="true">
              {[8, 20, 14, 30, 22, 34, 18, 26, 12, 30, 20, 16, 24, 34, 20, 10, 28, 18, 22, 14].map((h, i) => (
                <span key={i} className="flex-1 rounded-full bg-[var(--color-gold)]" style={{ height: `${h * 2}%`, opacity: 0.35 + (i % 5) * 0.13 }} />
              ))}
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div><p className="text-lg font-semibold">128</p><p className="text-2xs text-[var(--color-secondary)] uppercase tracking-wide">WPM</p></div>
              <div><p className="text-lg font-semibold text-[var(--color-orange)]">4</p><p className="text-2xs text-[var(--color-secondary)] uppercase tracking-wide">Fillers</p></div>
              <div><p className="text-lg font-semibold text-[var(--color-gold)]">82</p><p className="text-2xs text-[var(--color-secondary)] uppercase tracking-wide">Live Score</p></div>
            </div>
          </FadeIn>
        </Section>
      </div>

      <Section className="py-16 border-t border-[var(--color-border)]">
        <FadeIn>
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-3 max-w-2xl">
            Reps don&apos;t fail on the doorstep. They fail in practice they never got.
          </h2>
          <p className="text-[var(--color-secondary)] mb-10 max-w-2xl">
            Most training is a slide deck and a shadow ride. None of it simulates the actual pressure of a real objection, in real time.
          </p>
        </FadeIn>
        <FeatureGrid
          items={[
            { icon: Mic, title: "No reps before real doors", body: "New hires practice on real homeowners, burning leads while they find their footing." },
            { icon: MessageSquare, title: "Feedback comes too late", body: "Managers ride along once a month. By the time feedback lands, the bad habit is set." },
            { icon: BarChart3, title: "No objective scorecard", body: "\"Good job out there\" isn't a metric. Reps don't know what to actually fix." },
          ]}
        />
      </Section>

      <Section className="py-16 border-t border-[var(--color-border)]">
        <FadeIn><h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-10">Practice. Analyze. Coach. Improve.</h2></FadeIn>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Mic, step: "01", title: "Practice", body: "Roleplay live, mic on, against a scripted homeowner personality tuned to your difficulty level." },
            { icon: Gauge, step: "02", title: "Analyze", body: "Real transcript + audio signal get scored: pace, filler words, tone, adherence, closing strength." },
            { icon: MessageSquare, step: "03", title: "Coach", body: "Get specific tips generated from your weakest scores — not generic advice." },
            { icon: Repeat, step: "04", title: "Improve", body: "Retry from the exact objection that tripped you up. Track your trend session over session." },
          ].map((item, i) => (
            <FadeIn key={item.step} delay={i * 0.06}>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[rgba(227,179,65,0.1)] text-[var(--color-gold)]">
                <item.icon size={18} />
              </div>
              <span className="mt-4 block text-[var(--color-gold)] text-sm font-semibold">{item.step}</span>
              <h3 className="font-medium mt-1">{item.title}</h3>
              <p className="text-sm text-[var(--color-secondary)] mt-1.5">{item.body}</p>
            </FadeIn>
          ))}
        </div>
      </Section>

      <Section className="py-16 border-t border-[var(--color-border)]">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: Mic, title: "For reps", body: "Build muscle memory on your intro, objection handling, and close before it counts.", href: "/for-reps" },
            { icon: Users, title: "For managers", body: "See who needs attention, assign targeted drills, and aggregate team weaknesses.", href: "/for-managers" },
            { icon: ShieldCheck, title: "For companies", body: "Scale onboarding without burning your best closer's time on 1:1 ride-alongs.", href: "/for-companies" },
          ].map((c) => (
            <FadeIn key={c.title} className="card p-6 flex flex-col">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[rgba(227,179,65,0.1)] text-[var(--color-gold)]"><c.icon size={20} /></div>
              <h3 className="font-medium mt-4">{c.title}</h3>
              <p className="text-sm text-[var(--color-secondary)] mt-1.5 flex-1">{c.body}</p>
              <Link href={c.href} className="text-sm text-[var(--color-gold)] mt-4 inline-flex items-center gap-1">Learn more <ArrowRight size={14} /></Link>
            </FadeIn>
          ))}
        </div>
      </Section>

      <CtaBand title="Your next door is coming. Be ready for it." subtitle="Start free and run your first scored roleplay in under two minutes." cta={{ href: "/signup", label: "Start Training Free" }} />
    </>
  );
}
