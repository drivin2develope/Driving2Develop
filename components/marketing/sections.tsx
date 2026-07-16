import Link from "next/link";
import { ArrowRight, type LucideIcon } from "lucide-react";
import { FadeIn } from "@/components/ui";

export function Section({ id, className, children }: { id?: string; className?: string; children: React.ReactNode }) {
  return (
    <section id={id} className={`max-w-6xl mx-auto px-5 md:px-8 ${className ?? ""}`}>
      {children}
    </section>
  );
}

export function PageHero({
  eyebrow,
  title,
  subtitle,
  primaryCta,
  secondaryCta,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  primaryCta?: { href: string; label: string };
  secondaryCta?: { href: string; label: string };
}) {
  return (
    <div className="relative">
      <div className="absolute inset-0 hero-glow pointer-events-none" aria-hidden="true" />
      <Section className="pt-16 md:pt-24 pb-14 relative">
        <FadeIn className="max-w-3xl">
          {eyebrow && (
            <span className="text-2xs font-semibold uppercase tracking-widest text-[var(--color-gold-text)]">{eyebrow}</span>
          )}
          <h1 className="mt-4 text-4xl md:text-5xl font-semibold tracking-tight leading-[1.08]">{title}</h1>
          {subtitle && <p className="mt-5 text-lg text-[var(--color-secondary)] max-w-2xl">{subtitle}</p>}
          {(primaryCta || secondaryCta) && (
            <div className="mt-8 flex flex-wrap items-center gap-3">
              {primaryCta && (
                <Link href={primaryCta.href} className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-gold)] px-6 py-3 text-sm font-semibold text-[var(--color-gold-ink)] shadow-gold hover:brightness-110 transition">
                  {primaryCta.label} <ArrowRight size={16} />
                </Link>
              )}
              {secondaryCta && (
                <Link href={secondaryCta.href} className="inline-flex items-center gap-2 rounded-lg border border-[var(--color-border-strong)] px-6 py-3 text-sm hover:bg-[var(--color-border)] transition">
                  {secondaryCta.label}
                </Link>
              )}
            </div>
          )}
        </FadeIn>
      </Section>
    </div>
  );
}

export function CtaBand({ title, subtitle, cta }: { title: string; subtitle?: string; cta: { href: string; label: string } }) {
  return (
    <Section className="py-16">
      <FadeIn className="rounded-2xl border border-[var(--color-border)] bg-gradient-to-b from-[var(--color-elevated)] to-[var(--color-surface)] p-10 md:p-14 text-center">
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">{title}</h2>
        {subtitle && <p className="mt-3 text-[var(--color-secondary)] max-w-xl mx-auto">{subtitle}</p>}
        <Link href={cta.href} className="mt-7 inline-flex items-center gap-2 rounded-lg bg-[var(--color-gold)] px-6 py-3 text-sm font-semibold text-[var(--color-gold-ink)] shadow-gold hover:brightness-110 transition">
          {cta.label} <ArrowRight size={16} />
        </Link>
      </FadeIn>
    </Section>
  );
}

export function FeatureGrid({ items }: { items: { icon: LucideIcon; title: string; body: string }[] }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item) => (
        <FadeIn key={item.title} className="card p-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[rgba(227,179,65,0.1)] text-[var(--color-gold-text)]">
            <item.icon size={20} />
          </div>
          <h3 className="font-medium mt-4">{item.title}</h3>
          <p className="text-sm text-[var(--color-secondary)] mt-1.5 leading-relaxed">{item.body}</p>
        </FadeIn>
      ))}
    </div>
  );
}
