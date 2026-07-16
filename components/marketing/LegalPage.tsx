import { Section } from "@/components/marketing/sections";

export function LegalPage({ title, updated, sections }: { title: string; updated: string; sections: { heading: string; body: string[] }[] }) {
  return (
    <>
      <Section className="pt-16 md:pt-20 pb-6">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">{title}</h1>
        <p className="text-sm text-[var(--color-secondary)] mt-2">Last updated {updated}</p>
      </Section>
      <Section className="pb-20 max-w-3xl space-y-8">
        {sections.map((s) => (
          <div key={s.heading}>
            <h2 className="text-lg font-medium mb-2.5">{s.heading}</h2>
            <div className="space-y-3">
              {s.body.map((p, i) => (
                <p key={i} className="text-sm text-[var(--color-secondary)] leading-relaxed">{p}</p>
              ))}
            </div>
          </div>
        ))}
      </Section>
    </>
  );
}
