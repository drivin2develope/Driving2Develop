"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ScenarioDTO } from "@/lib/scenario-types";
import { Card, Badge, Button, Stagger, StaggerItem, EmptyState } from "@/components/ui";
import { Clock, Lock, ArrowRight, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

const DIFFICULTIES = ["ALL", "EASY", "REALISTIC", "HARD"] as const;
const DIFFICULTY_COLOR: Record<string, "green" | "orange" | "red"> = { EASY: "green", REALISTIC: "orange", HARD: "red" };

export function ScenarioPicker({ scenarios }: { scenarios: ScenarioDTO[] }) {
  const router = useRouter();
  const [filter, setFilter] = useState<(typeof DIFFICULTIES)[number]>("ALL");
  const filtered = scenarios.filter((s) => filter === "ALL" || s.difficulty === filter);

  return (
    <div className="px-5 md:px-8 pb-10">
      <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
        <div className="flex items-center gap-2" role="tablist" aria-label="Difficulty filter">
          {DIFFICULTIES.map((d) => (
            <button key={d} role="tab" aria-selected={filter === d} onClick={() => setFilter(d)}
              className={cn("text-xs px-3 py-1.5 rounded-full border transition-colors",
                filter === d ? "border-[var(--color-gold)] text-[var(--color-gold)] bg-[rgba(227,179,65,0.08)]" : "border-[var(--color-border)] text-[var(--color-secondary)] hover:bg-white/5")}>
              {d === "ALL" ? "All levels" : d.charAt(0) + d.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
        <div title="Complete 35 more drills to unlock Humor Mode"
          className="flex items-center gap-2 text-xs text-[var(--color-disabled)] px-3 py-1.5 rounded-full border border-[var(--color-border)] cursor-not-allowed">
          <Lock size={12} /> Humor Mode
          <span className="w-8 h-4 rounded-full bg-white/5 relative shrink-0"><span className="absolute top-0.5 left-0.5 w-3 h-3 rounded-full bg-white/20" /></span>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={<BookOpen size={22} />} title="No scenarios at this level yet" description="Try a different difficulty filter to see available roleplays." />
      ) : (
        <Stagger className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((s) => (
            <StaggerItem key={s.id}>
              <Card className="flex flex-col h-full">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-medium text-sm">{s.title}</h3>
                  <Badge color={DIFFICULTY_COLOR[s.difficulty]}>{s.difficulty}</Badge>
                </div>
                <p className="text-xs text-[var(--color-secondary)] mt-2 line-clamp-3 flex-1">{s.description}</p>
                <div className="flex items-center gap-3 mt-4 text-xs text-[var(--color-secondary)]">
                  <span className="capitalize">{s.personality}</span>
                  <span className="flex items-center gap-1"><Clock size={12} /> {s.estimatedMinutes} min</span>
                </div>
                <Button className="w-full mt-4" onClick={() => router.push(`/practice/session?scenarioId=${s.id}`)}>
                  Start roleplay <ArrowRight size={15} />
                </Button>
              </Card>
            </StaggerItem>
          ))}
        </Stagger>
      )}
    </div>
  );
}
