"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Card, Badge, EmptyState, Select, ButtonLink } from "@/components/ui";
import { formatDuration } from "@/lib/analysis";
import { formatDateTime } from "@/lib/utils";
import { ArrowRight, History as HistoryIcon } from "lucide-react";

type SessionRow = {
  id: string;
  createdAt: string;
  durationSeconds: number;
  source: "LIVE" | "UPLOAD";
  scenario: { title: string; difficulty: string } | null;
  metric: { overallScore: number } | null;
};

export function HistoryTable({ sessions }: { sessions: SessionRow[] }) {
  const [sort, setSort] = useState<"date" | "score">("date");
  const [sourceFilter, setSourceFilter] = useState<"ALL" | "LIVE" | "UPLOAD">("ALL");

  const filtered = useMemo(() => {
    let rows = sessions.filter((s) => sourceFilter === "ALL" || s.source === sourceFilter);
    rows = [...rows].sort((a, b) =>
      sort === "score" ? (b.metric?.overallScore ?? 0) - (a.metric?.overallScore ?? 0) : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return rows;
  }, [sessions, sort, sourceFilter]);

  if (sessions.length === 0) {
    return (
      <div className="px-5 md:px-8 pb-10">
        <EmptyState icon={<HistoryIcon size={22} />} title="No sessions yet"
          description="Once you practice or upload a recording, every session shows up here with a link to its scorecard."
          action={<ButtonLink href="/practice">Start practicing</ButtonLink>} />
      </div>
    );
  }

  return (
    <div className="px-5 md:px-8 pb-10">
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="w-44"><Select value={sort} onChange={(e) => setSort(e.target.value as any)} aria-label="Sort sessions">
          <option value="date">Sort: Most recent</option>
          <option value="score">Sort: Highest score</option>
        </Select></div>
        <div className="w-44"><Select value={sourceFilter} onChange={(e) => setSourceFilter(e.target.value as any)} aria-label="Filter by source">
          <option value="ALL">All sources</option>
          <option value="LIVE">Live practice</option>
          <option value="UPLOAD">Uploads</option>
        </Select></div>
      </div>
      <Card className="p-0 overflow-hidden">
        <div className="divide-y divide-[var(--color-border)]">
          {filtered.map((s) => (
            <Link key={s.id} href={`/report/${s.id}`} className="flex items-center justify-between px-5 py-4 text-sm hover:bg-white/5 transition-colors">
              <div className="min-w-0">
                <p className="font-medium truncate">{s.scenario?.title ?? "Uploaded recording"}</p>
                <p className="text-xs text-[var(--color-secondary)] mt-0.5">{formatDateTime(s.createdAt)} · {formatDuration(s.durationSeconds)}</p>
              </div>
              <div className="flex items-center gap-4 shrink-0 ml-3">
                <Badge color={s.source === "LIVE" ? "blue" : "purple"}>{s.source}</Badge>
                <span className="text-lg font-semibold text-[var(--color-gold)] w-8 text-right tabular-nums">{s.metric?.overallScore ?? "—"}</span>
                <ArrowRight size={14} className="text-[var(--color-secondary)]" />
              </div>
            </Link>
          ))}
        </div>
      </Card>
    </div>
  );
}
