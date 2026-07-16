import { Mail, MessageSquare, Building2 } from "lucide-react";
import { Section } from "@/components/marketing/sections";
import { ContactForm } from "@/components/marketing/ContactForm";
import { FadeIn } from "@/components/ui";

export const metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <Section className="pt-16 md:pt-20 pb-20 grid md:grid-cols-2 gap-10 items-start">
      <FadeIn>
        <span className="text-2xs font-semibold uppercase tracking-widest text-[var(--color-gold)]">Contact</span>
        <h1 className="mt-4 text-3xl md:text-4xl font-semibold tracking-tight">Let&apos;s talk.</h1>
        <p className="mt-4 text-[var(--color-secondary)] leading-relaxed max-w-md">
          Questions, demos, or rolling this out across your org? Send a note and we&apos;ll get back within one business day.
        </p>
        <div className="mt-8 space-y-4">
          {[
            { icon: Mail, title: "Email", body: "partners@driving2develop.dev" },
            { icon: MessageSquare, title: "Support", body: "Reps & managers — check the help center first." },
            { icon: Building2, title: "Sales", body: "Team rollouts, security reviews, and pilots." },
          ].map((c) => (
            <div key={c.title} className="flex items-start gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[rgba(227,179,65,0.1)] text-[var(--color-gold)]"><c.icon size={17} /></div>
              <div>
                <p className="text-sm font-medium">{c.title}</p>
                <p className="text-sm text-[var(--color-secondary)]">{c.body}</p>
              </div>
            </div>
          ))}
        </div>
      </FadeIn>
      <FadeIn delay={0.1}><ContactForm /></FadeIn>
    </Section>
  );
}
