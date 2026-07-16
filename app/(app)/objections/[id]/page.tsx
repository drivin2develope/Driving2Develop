import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { PageHeader, Card, CardHeader, Badge, ButtonLink } from "@/components/ui";
import { ArrowLeft, Quote, ListChecks, Lightbulb } from "lucide-react";

const DIFF: Record<string, "green" | "orange" | "red"> = { EASY: "green", REALISTIC: "orange", HARD: "red" };

export default async function ObjectionDetail({ params }: { params: { id: string } }) {
  const o = await prisma.objection.findUnique({ where: { slug: params.id } });
  if (!o) notFound();
  const steps: string[] = JSON.parse(o.recommendedResponse);
  const tactics: string[] = JSON.parse(o.relatedTactics);

  return (
    <div>
      <PageHeader eyebrow={o.category} title={o.title} action={<ButtonLink href="/practice" variant="secondary" size="sm">Drill this</ButtonLink>} />
      <div className="px-5 md:px-8 pb-10 space-y-6 max-w-3xl">
        <Link href="/objections" className="inline-flex items-center gap-1.5 text-sm text-[var(--color-secondary)] hover:text-[var(--color-primary)]"><ArrowLeft size={15} /> Objection library</Link>
        <Card>
          <div className="flex items-center gap-2 mb-3"><Badge color={DIFF[o.difficulty]}>{o.difficulty}</Badge><Badge>{o.category}</Badge></div>
          <p className="text-sm text-[var(--color-secondary)] leading-relaxed">{o.summary}</p>
          <div className="mt-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
            <p className="text-2xs uppercase tracking-wide text-[var(--color-disabled)] mb-1">Why it happens</p>
            <p className="text-sm text-[var(--color-secondary)]">{o.whyItHappens}</p>
          </div>
        </Card>
        <Card>
          <CardHeader title={<span className="flex items-center gap-2"><ListChecks size={15} className="text-[var(--color-gold)]" /> Recommended response</span>} />
          <ol className="space-y-2.5">
            {steps.map((s, i) => (
              <li key={i} className="flex gap-3 text-sm">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[rgba(227,179,65,0.12)] text-[var(--color-gold)] text-xs font-semibold">{i + 1}</span>
                <span className="text-[var(--color-secondary)] pt-0.5">{s}</span>
              </li>
            ))}
          </ol>
        </Card>
        <Card>
          <CardHeader title={<span className="flex items-center gap-2"><Quote size={15} className="text-[var(--color-purple)]" /> Example script</span>} />
          <p className="text-sm leading-relaxed rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">&ldquo;{o.exampleScript}&rdquo;</p>
        </Card>
        <Card>
          <CardHeader title={<span className="flex items-center gap-2"><Lightbulb size={15} className="text-[var(--color-gold)]" /> Related tactics</span>} />
          <div className="flex flex-wrap gap-2">
            {tactics.map((t) => <span key={t} className="text-xs px-3 py-1.5 rounded-full border border-[var(--color-border)] text-[var(--color-secondary)]">{t}</span>)}
          </div>
        </Card>
      </div>
    </div>
  );
}
