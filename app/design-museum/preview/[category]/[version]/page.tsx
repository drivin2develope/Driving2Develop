"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Monitor, Tablet, Smartphone, GitBranch, GitCommit, Info } from "lucide-react";
import "../../../../v4-preview.css";
import { findCategory, findVersion, RECOVERY_LABEL } from "@/lib/museum/registry";

const WIDTHS = { desktop: 1600, tablet: 834, mobile: 390 } as const;
type DeviceKey = keyof typeof WIDTHS;

export default function MuseumFullPreview({ params }: { params: { category: string; version: string } }) {
  const [device, setDevice] = useState<DeviceKey>("desktop");
  const [showMeta, setShowMeta] = useState(true);
  const category = findCategory(params.category);
  const version = findVersion(params.category, params.version);

  if (!category || !version) {
    return (
      <div className="v4-scope min-h-screen flex items-center justify-center" data-v4-theme="dark">
        <p style={{ color: "var(--v4-text-secondary)" }}>Not found.</p>
      </div>
    );
  }

  const otherVersions = category.versions.filter((v) => v.id !== version.id && v.componentKey);

  return (
    <div className="v4-scope font-sans min-h-screen flex flex-col" data-v4-theme="dark" style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
      <header className="border-b" style={{ borderColor: "var(--v4-border)" }}>
        <div className="px-4 md:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4 min-w-0">
            <Link href="/design-museum" className="text-sm inline-flex items-center gap-1.5 shrink-0" style={{ color: "var(--v4-text-secondary)" }}>
              <ArrowLeft size={14} /> Museum
            </Link>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{version.label}</p>
              <p className="text-xs truncate" style={{ color: "var(--v4-text-tertiary)" }}>
                {category.title}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1 rounded-md border p-1" style={{ borderColor: "var(--v4-border-strong)" }}>
              {(["desktop", "tablet", "mobile"] as DeviceKey[]).map((d) => {
                const Icon = d === "desktop" ? Monitor : d === "tablet" ? Tablet : Smartphone;
                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDevice(d)}
                    aria-pressed={device === d}
                    aria-label={`Preview at ${d} width`}
                    className="w-8 h-8 flex items-center justify-center rounded"
                    style={{ background: device === d ? "var(--v4-bg-raised-2)" : "transparent", color: device === d ? "var(--v4-gold-b)" : "var(--v4-text-secondary)" }}
                  >
                    <Icon size={14} />
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              onClick={() => setShowMeta((s) => !s)}
              aria-pressed={showMeta}
              className="text-xs px-3 py-1.5 rounded-md border flex items-center gap-1.5"
              style={{ borderColor: "var(--v4-border-strong)", color: "var(--v4-text-secondary)" }}
            >
              <Info size={13} /> Metadata
            </button>
            {otherVersions.length > 0 && (
              <Link href={`/design-museum/compare/${category.slug}`} className="text-xs font-semibold" style={{ color: "var(--v4-gold-b)" }}>
                Compare →
              </Link>
            )}
          </div>
        </div>

        {showMeta && (
          <div className="px-4 md:px-6 pb-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="flex items-center gap-1.5" style={{ color: "var(--v4-text-secondary)" }}>
              <GitBranch size={12} /> {version.branch}
            </div>
            <div className="flex items-center gap-1.5" style={{ color: "var(--v4-text-secondary)" }}>
              <GitCommit size={12} /> {version.commit}
            </div>
            <div style={{ color: "var(--v4-green)" }}>{RECOVERY_LABEL[version.recoveryType]}</div>
            <div style={{ color: "var(--v4-text-secondary)" }}>
              {version.deviceSupport === "responsive" ? "Responsive" : "Desktop-only"} · {version.hasAnimation ? "Animated" : "Static"}
            </div>
          </div>
        )}
      </header>

      <div className="flex-1 flex items-start justify-center py-8 px-4" style={{ background: "var(--v4-bg-inset)" }}>
        <div
          className="rounded-lg border overflow-hidden shadow-2xl transition-[width] duration-300"
          style={{ width: "100%", maxWidth: WIDTHS[device], borderColor: "var(--v4-border-strong)" }}
        >
          <iframe
            key={version.id}
            src={`/design-museum/render/${category.slug}/${version.id}`}
            title={version.label}
            className="w-full"
            style={{ height: "80vh", background: "var(--v4-bg)" }}
          />
        </div>
      </div>
    </div>
  );
}
