import Link from "next/link";
import { prisma } from "@/lib/db";
import { PageHeader, Card, Badge, Stagger, StaggerItem } from "@/components/ui";
import { Lock, Clock, ArrowRight } from "lucide-react";

export const metadata = { title: "Scenarios" };
const DIFFICULTY_COLOR: Record<string, "green" | "orange" | "red"> = { EASY: "green", REALISTIC: "orange", HARD: "red" };

export default async function ScenariosPage() {
  const scenarios = await prisma.scenario.findMany({ orderBy: { createdAt: "asc" } });
  return (
    <div>
      <PageHeader eyebrow="Scenarios" title="Roleplay library" subtitle="Solar roleplays across difficulty and homeowner personality." />
      <div className="px-5 md:px-8 pb-10">
        <Stagger className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {scenarios.map((s) => (
            <StaggerItem key={s.id}>
              <Card className={`flex flex-col h-full ${s.isLocked ? "opacity-60" : ""}`}>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-medium text-sm">{s.title}</h3>
                  <Badge color={DIFFICULTY_COLOR[s.difficulty] ?? "default"}>{s.difficulty}</Badge>
                </div>
                <p className="text-xs text-[var(--color-secondary)] mt-2 line-clamp-3 flex-1">{s.description}</p>
                <div className="flex items-center gap-3 mt-4 text-xs text-[var(--color-secondary)]">
                  <span className="capitalize">{s.personality}</span>
                  <span className="flex items-center gap-1"><Clock size={12} /> {s.estimatedMinutes} min</span>
                </div>
                <div className="mt-4">
                  {s.isLocked ? (
                    <button disabled className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm bg-[var(--color-border)] text-[var(--color-disabled)] cursor-not-allowed">
                      <Lock size={14} /> Locked — 35 more drills to unlock
                    </button>
                  ) : (
                    <Link href={`/scenarios/${s.id}`} className="flex items-center justify-center gap-2 w-full text-center py-2.5 text-sm rounded-lg border border-[var(--color-border-strong)] hover:bg-[var(--color-border)] transition-colors">
                      View details <ArrowRight size={14} />
                    </Link>
                  )}
                </div>
              </Card>
            </StaggerItem>
          ))}
        </Stagger>

        <div className="mt-10">
          <h3 className="text-sm font-medium mb-3 text-[var(--color-secondary)]">Other industries</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {["Pest Control", "Roofing", "Home Security"].map((industry) => (
              <Card key={industry} className="opacity-50">
                <h3 className="font-medium text-sm">{industry}</h3>
                <p className="text-xs text-[var(--color-secondary)] mt-2">Coming soon.</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
