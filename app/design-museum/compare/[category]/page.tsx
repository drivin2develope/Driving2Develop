"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Link2, Unlink } from "lucide-react";
import "../../../v4-preview.css";
import { findCategory } from "@/lib/museum/registry";

export default function ComparePage({ params }: { params: { category: string } }) {
  const category = findCategory(params.category);
  const recoverable = category?.versions.filter((v) => v.componentKey) ?? [];
  const [leftId, setLeftId] = useState(recoverable[0]?.id ?? "");
  const [rightId, setRightId] = useState(recoverable[1]?.id ?? recoverable[0]?.id ?? "");
  const [synced, setSynced] = useState(true);
  const leftFrame = useRef<HTMLIFrameElement>(null);
  const rightFrame = useRef<HTMLIFrameElement>(null);
  const syncedRef = useRef(synced);
  syncedRef.current = synced;

  // Relays postMessage scroll reports from each render-route iframe
  // (see useSyncedScroll in the render route) to the other frame, so
  // both historical versions scroll together in sync mode.
  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (e.data?.type !== "museum-scroll" || !syncedRef.current) return;
      const source = e.source;
      const target = source === leftFrame.current?.contentWindow ? rightFrame.current : source === rightFrame.current?.contentWindow ? leftFrame.current : null;
      target?.contentWindow?.postMessage({ type: "museum-scroll-to", y: e.data.y }, "*");
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  if (!category || recoverable.length < 1) {
    return (
      <div className="v4-scope min-h-screen flex items-center justify-center" data-v4-theme="dark">
        <p style={{ color: "var(--v4-text-secondary)" }}>Not enough recovered versions to compare.</p>
      </div>
    );
  }

  return (
    <div className="v4-scope font-sans min-h-screen flex flex-col" data-v4-theme="dark" style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
      <header className="border-b" style={{ borderColor: "var(--v4-border)" }}>
        <div className="px-4 md:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <Link href="/design-museum" className="text-sm inline-flex items-center gap-1.5" style={{ color: "var(--v4-text-secondary)" }}>
              <ArrowLeft size={14} /> Museum
            </Link>
            <p className="text-sm font-medium">{category.title} — Compare</p>
          </div>
          <button
            type="button"
            onClick={() => setSynced((s) => !s)}
            aria-pressed={synced}
            className="text-xs px-3 py-1.5 rounded-md border flex items-center gap-1.5"
            style={{ borderColor: synced ? "var(--v4-gold-b)" : "var(--v4-border-strong)", color: synced ? "var(--v4-gold-b)" : "var(--v4-text-secondary)" }}
          >
            {synced ? <Link2 size={13} /> : <Unlink size={13} />} {synced ? "Synced scroll" : "Independent scroll"}
          </button>
        </div>
      </header>

      <div className="grid md:grid-cols-2 flex-1">
        {[
          { id: leftId, set: setLeftId, ref: leftFrame },
          { id: rightId, set: setRightId, ref: rightFrame },
        ].map((side, i) => {
          const v = recoverable.find((r) => r.id === side.id);
          return (
            <div key={i} className="flex flex-col border-r last:border-r-0" style={{ borderColor: "var(--v4-border)" }}>
              <div className="p-3 border-b" style={{ borderColor: "var(--v4-border)" }}>
                <select
                  value={side.id}
                  onChange={(e) => side.set(e.target.value)}
                  className="text-sm rounded-md border px-3 py-2 w-full"
                  style={{ background: "var(--v4-bg-raised)", borderColor: "var(--v4-border-strong)", color: "var(--v4-text)" }}
                >
                  {recoverable.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.label}
                    </option>
                  ))}
                </select>
                {v && (
                  <p className="text-xs mt-2" style={{ color: "var(--v4-text-tertiary)" }}>
                    {v.commit} · {v.hasAnimation ? "Animated" : "Static"}
                  </p>
                )}
              </div>
              <iframe
                ref={side.ref}
                src={v ? `/design-museum/render/${category.slug}/${v.id}` : undefined}
                title={v?.label ?? "empty"}
                className="w-full flex-1"
                style={{ minHeight: "70vh", background: "var(--v4-bg)" }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
