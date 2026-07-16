import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { PageHeader, Card, CardHeader, Badge, ButtonLink } from "@/components/ui";
import { parseScenario, STAGE_LABELS } from "@/lib/scenario-types";
import { Clock, Mic, ArrowLeft, User } from "lucide-react";

const DIFFICULTY_COLOR: Record<string, "green" | "orange" | "red"> = { EASY: "green", REALISTIC: "orange", HARD: "red" };

export default async function ScenarioDetailPage({ params }: { params: { id: string } }) {
  const raw = await prisma.scenario.findUnique({ where: { id: params.id } });
  if (!raw) notFound();
  const s = parseScenario(raw);

  return (
    <div>
      <PageHeader eyebrow="Scenario" title={s.title} subtitle={`${s.difficulty} · ${s.personality} homeowner · ~${s.estimatedMinutes} min`}
        action={!s.isLocked ? <ButtonLink href={`/practice/session?scenarioId=${s.id}`}><Mic size={16} /> Start roleplay</ButtonLink> : undefined} />
      <div className="px-5 md:px-8 pb-10 space-y-6 max-w-3xl">
        <Link href="/scenarios" className="inline-flex items-center gap-1.5 text-sm text-[var(--color-secondary)] hover:text-[var(--color-primary)]"><ArrowLeft size={15} /> All scenarios</Link>
        <Card>
          <div className="flex items-center gap-2 mb-3">
            <Badge color={DIFFICULTY_COLOR[s.difficulty]}>{s.difficulty}</Badge>
            <Badge><span className="capitalize">{s.personality}</span></Badge>
            <Badge><Clock size={11} /> {s.estimatedMinutes} min</Badge>
          </div>
          <p className="text-sm text-[var(--color-secondary)] leading-relaxed">{s.description}</p>
        </Card>
        <Card>
          <CardHeader title="Talking points you'll be scored on" subtitle="Hit each of these to maximize script adherence." />
          <div className="flex flex-wrap gap-2">
            {s.requiredTalkingPoints.map((p) => (
              <span key={p} className="text-xs px-3 py-1.5 rounded-full border border-[var(--color-border)] text-[var(--color-secondary)]">{STAGE_LABELS[p] ?? p}</span>
            ))}
          </div>
        </Card>
        <Card>
          <CardHeader title="How the homeowner will play it" subtitle="A preview of the scripted partner's beats." />
          <div className="space-y-3">
            {s.homeownerScript.map((line, i) => (
              <div key={i} className="flex gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[rgba(167,139,250,0.12)] text-[var(--color-purple)]"><User size={14} /></span>
                <div>
                  <p className="text-2xs uppercase tracking-wide text-[var(--color-purple)]">{STAGE_LABELS[line.stage] ?? line.stage}</p>
                  <p className="text-sm mt-0.5">&ldquo;{line.line}&rdquo;</p>
                </div>
              </div>
            ))}
            {s.homeownerScript.length === 0 && <p className="text-sm text-[var(--color-secondary)]">This scenario is locked — script hidden until unlocked.</p>}
          </div>
        </Card>
      </div>
    </div>
  );
}
