"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { GitBranch, GitCommit, Layers, Clock, RotateCcw, Smartphone, Tablet, Monitor, Sparkles } from "lucide-react";
import "../v4-preview.css";
import { CATEGORIES, RECOVERY_LABEL, type MuseumCategory, type MuseumVersion } from "@/lib/museum/registry";

type ViewMode = "category" | "chronological";
type GroupFilter = "All" | MuseumCategory["group"];

const GROUPS: GroupFilter[] = ["All", "Public Site", "Application", "Visual Systems"];

function VersionCard({ category, version }: { category: MuseumCategory; version: MuseumVersion }) {
  const recoverable = version.componentKey !== null;
  return (
    <div
      className="v4-diagram-node p-5 flex flex-col h-full"
      style={{ opacity: recoverable ? 1 : 0.65, borderStyle: recoverable ? "solid" : "dashed" }}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <span
          className="v4-pill"
          style={{ color: recoverable ? "var(--v4-green)" : "var(--v4-text-tertiary)" }}
        >
          {RECOVERY_LABEL[version.recoveryType]}
        </span>
        {version.hasAnimation && <Sparkles size={14} style={{ color: "var(--v4-gold-b)" }} aria-label="Has animation" />}
      </div>
      <p className="text-sm font-medium">{version.label}</p>
      <p className="text-xs mt-1.5 flex-1" style={{ color: "var(--v4-text-secondary)" }}>
        {version.description}
      </p>
      <div className="mt-3 pt-3 border-t space-y-1" style={{ borderColor: "var(--v4-border)" }}>
        <div className="flex items-center gap-1.5 text-[11px]" style={{ color: "var(--v4-text-tertiary)" }}>
          <GitBranch size={11} /> {version.branch}
        </div>
        <div className="flex items-center gap-1.5 text-[11px]" style={{ color: "var(--v4-text-tertiary)" }}>
          <GitCommit size={11} /> {version.commit} — {version.commitMessage}
        </div>
        {version.knownIssues.length > 0 && (
          <ul className="text-[11px] mt-1.5 space-y-0.5" style={{ color: "var(--v4-red)" }}>
            {version.knownIssues.map((issue, i) => (
              <li key={i}>⚠ {issue}</li>
            ))}
          </ul>
        )}
      </div>
      {recoverable ? (
        <Link
          href={`/design-museum/preview/${category.slug}/${version.id}`}
          className="mt-4 text-xs font-semibold inline-flex items-center gap-1 justify-center rounded-md py-2 border transition-colors hover:border-[var(--v4-gold-b)]"
          style={{ borderColor: "var(--v4-border-strong)", color: "var(--v4-gold-b)" }}
        >
          Open full preview
        </Link>
      ) : (
        <span className="mt-4 text-xs text-center py-2" style={{ color: "var(--v4-text-tertiary)" }}>
          No implementation to preview
        </span>
      )}
    </div>
  );
}

export default function DesignMuseumPage() {
  const [view, setView] = useState<ViewMode>("category");
  const [group, setGroup] = useState<GroupFilter>("All");

  const filteredCategories = useMemo(
    () => CATEGORIES.filter((c) => group === "All" || c.group === group),
    [group]
  );

  const chronological = useMemo(() => {
    return filteredCategories
      .flatMap((c) => c.versions.map((v) => ({ category: c, version: v })))
      .sort((a, b) => {
        if (a.version.branch !== b.version.branch) return 0;
        return a.version.sequence - b.version.sequence || a.category.slug.localeCompare(b.category.slug);
      });
  }, [filteredCategories]);

  const totalVersions = filteredCategories.reduce((n, c) => n + c.versions.length, 0);
  const recoverableCount = filteredCategories.reduce((n, c) => n + c.versions.filter((v) => v.componentKey !== null).length, 0);

  return (
    <div className="v4-scope font-sans min-h-screen" data-v4-theme="dark" style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
      <header className="border-b sticky top-0 z-30 backdrop-blur-md" style={{ borderColor: "var(--v4-border)", background: "color-mix(in srgb, var(--v4-bg) 88%, transparent)" }}>
        <div className="max-w-[1600px] mx-auto px-6 md:px-10 py-5 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="v4-eyebrow mb-1">Internal · Not part of the public site</p>
            <h1 className="text-xl font-semibold tracking-tight">Driven2Develop Design Museum</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/design-composer" className="text-sm font-semibold" style={{ color: "var(--v4-gold-b)" }}>
              Open Composer →
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-[1600px] mx-auto px-6 md:px-10 py-10">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setView("category")}
              aria-pressed={view === "category"}
              className="text-xs font-medium px-3 py-1.5 rounded-md border flex items-center gap-1.5"
              style={{ borderColor: view === "category" ? "var(--v4-gold-b)" : "var(--v4-border-strong)", color: view === "category" ? "var(--v4-gold-b)" : "var(--v4-text-secondary)" }}
            >
              <Layers size={13} /> Category view
            </button>
            <button
              type="button"
              onClick={() => setView("chronological")}
              aria-pressed={view === "chronological"}
              className="text-xs font-medium px-3 py-1.5 rounded-md border flex items-center gap-1.5"
              style={{ borderColor: view === "chronological" ? "var(--v4-gold-b)" : "var(--v4-border-strong)", color: view === "chronological" ? "var(--v4-gold-b)" : "var(--v4-text-secondary)" }}
            >
              <Clock size={13} /> Chronological view
            </button>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {GROUPS.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setGroup(g)}
                aria-pressed={group === g}
                className="text-xs px-3 py-1.5 rounded-full border transition-colors"
                style={{ borderColor: group === g ? "var(--v4-gold-b)" : "var(--v4-border-strong)", color: group === g ? "var(--v4-gold-b)" : "var(--v4-text-secondary)" }}
              >
                {g}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setGroup("All")}
              className="text-xs px-2.5 py-1.5 rounded-full flex items-center gap-1"
              style={{ color: "var(--v4-text-tertiary)" }}
            >
              <RotateCcw size={11} /> Reset
            </button>
          </div>
        </div>

        <p className="text-xs mb-10" style={{ color: "var(--v4-text-tertiary)" }}>
          {totalVersions} recovered version{totalVersions === 1 ? "" : "s"} across {filteredCategories.length} categories — {recoverableCount} with a full interactive preview.
          Every entry below is evidence-based: sourced from real git history (branch + commit shown on each card), not fabricated.
        </p>

        {view === "category" ? (
          <div className="space-y-16">
            {filteredCategories.map((cat) => (
              <section key={cat.slug}>
                <div className="flex items-baseline justify-between gap-4 mb-5 flex-wrap">
                  <div>
                    <p className="v4-eyebrow mb-1.5">{cat.group}</p>
                    <h2 className="text-xl font-semibold tracking-tight">{cat.title}</h2>
                    <p className="text-sm mt-1" style={{ color: "var(--v4-text-secondary)" }}>
                      {cat.description}
                    </p>
                  </div>
                  {cat.versions.filter((v) => v.componentKey).length >= 2 && (
                    <Link
                      href={`/design-museum/compare/${cat.slug}`}
                      className="text-xs font-semibold inline-flex items-center gap-1"
                      style={{ color: "var(--v4-gold-b)" }}
                    >
                      Compare versions →
                    </Link>
                  )}
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {cat.versions.map((v) => (
                    <VersionCard key={v.id} category={cat} version={v} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div className="space-y-4 max-w-3xl">
            {chronological.map(({ category, version }, i) => (
              <div key={version.id} className="flex gap-4">
                <div className="flex flex-col items-center pt-1.5">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: version.componentKey ? "var(--v4-gold-b)" : "var(--v4-text-tertiary)" }} />
                  {i < chronological.length - 1 && <span className="w-px flex-1 mt-1" style={{ background: "var(--v4-border)" }} />}
                </div>
                <div className="pb-8 flex-1">
                  <p className="text-xs" style={{ color: "var(--v4-text-tertiary)" }}>
                    {category.title}
                  </p>
                  <p className="text-sm font-medium mt-0.5">{version.label}</p>
                  <p className="text-xs mt-1" style={{ color: "var(--v4-text-secondary)" }}>
                    {version.commit} — {version.commitMessage}
                  </p>
                  {version.componentKey && (
                    <Link
                      href={`/design-museum/preview/${category.slug}/${version.id}`}
                      className="text-xs font-semibold mt-2 inline-block"
                      style={{ color: "var(--v4-gold-b)" }}
                    >
                      Open full preview →
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <footer className="border-t py-8" style={{ borderColor: "var(--v4-border)" }}>
        <div className="max-w-[1600px] mx-auto px-6 md:px-10 flex items-center gap-4 text-xs" style={{ color: "var(--v4-text-tertiary)" }}>
          <Monitor size={13} /> <Tablet size={13} /> <Smartphone size={13} />
          <span>Every preview supports desktop, tablet, and mobile widths — open a version to switch.</span>
        </div>
      </footer>
    </div>
  );
}
