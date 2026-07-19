"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  Copy,
  Trash2,
  Plus,
  Save,
  Undo2,
  Redo2,
  RotateCcw,
  Monitor,
  Tablet,
  Smartphone,
  Download,
  Share2,
  FolderOpen,
} from "lucide-react";
import "../v4-preview.css";
import { CATEGORIES, findCategory, findVersion } from "@/lib/museum/registry";
import { componentMap } from "@/components/museum/MuseumRenderer";
import { MuseumErrorBoundary } from "@/components/museum/MuseumErrorBoundary";
import {
  type CompositionItem,
  type SavedComposition,
  newItem,
  loadSavedCompositions,
  saveComposition,
  deleteComposition,
  encodeComposition,
  decodeComposition,
} from "@/lib/museum/composerStorage";

const WIDTHS = { desktop: 1600, tablet: 834, mobile: 390 } as const;
type DeviceKey = keyof typeof WIDTHS;

function defaultComposition(): CompositionItem[] {
  return CATEGORIES.filter((c) => c.versions.some((v) => v.componentKey)).map((c) => {
    const recoverable = c.versions.filter((v) => v.componentKey);
    const current = recoverable[recoverable.length - 1];
    return newItem(c.slug, current.id);
  });
}

export default function DesignComposerPage() {
  const [history, setHistory] = useState<CompositionItem[][]>([defaultComposition()]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [device, setDevice] = useState<DeviceKey>("desktop");
  const [name, setName] = useState("My composition");
  const [saved, setSaved] = useState<SavedComposition[]>([]);
  const [showLoad, setShowLoad] = useState(false);
  const [addingFor, setAddingFor] = useState<string | null>(null);
  const shareInputRef = useRef<HTMLInputElement>(null);

  const items = history[historyIndex];

  useEffect(() => {
    setSaved(loadSavedCompositions());
    const params = new URLSearchParams(window.location.search);
    const encoded = params.get("c");
    if (encoded) {
      const decoded = decodeComposition(encoded);
      if (decoded) setHistory([decoded]);
    }
  }, []);

  function commit(next: CompositionItem[]) {
    const trimmed = history.slice(0, historyIndex + 1);
    setHistory([...trimmed, next]);
    setHistoryIndex(trimmed.length);
  }

  function move(id: string, dir: -1 | 1) {
    const idx = items.findIndex((i) => i.id === id);
    const target = idx + dir;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[idx], next[target]] = [next[target], next[idx]];
    commit(next);
  }

  function remove(id: string) {
    commit(items.filter((i) => i.id !== id));
  }

  function duplicate(id: string) {
    const idx = items.findIndex((i) => i.id === id);
    const item = items[idx];
    if (!item) return;
    const next = [...items];
    next.splice(idx + 1, 0, newItem(item.categorySlug, item.versionId));
    commit(next);
  }

  function replaceVersion(id: string, versionId: string) {
    commit(items.map((i) => (i.id === id ? { ...i, versionId } : i)));
  }

  function addSection(categorySlug: string, versionId: string) {
    commit([...items, newItem(categorySlug, versionId)]);
    setAddingFor(null);
  }

  function undo() {
    if (historyIndex > 0) setHistoryIndex(historyIndex - 1);
  }
  function redo() {
    if (historyIndex < history.length - 1) setHistoryIndex(historyIndex + 1);
  }
  function reset() {
    commit(defaultComposition());
  }

  function handleSave() {
    saveComposition({ name, items, savedAt: new Date().toISOString() });
    setSaved(loadSavedCompositions());
  }
  function handleLoad(comp: SavedComposition) {
    setHistory([comp.items]);
    setHistoryIndex(0);
    setName(comp.name);
    setShowLoad(false);
  }
  function handleDelete(compName: string) {
    deleteComposition(compName);
    setSaved(loadSavedCompositions());
  }
  function handleDuplicateComposition() {
    const dupName = `${name} (copy)`;
    saveComposition({ name: dupName, items, savedAt: new Date().toISOString() });
    setSaved(loadSavedCompositions());
    setName(dupName);
  }

  function handleExport() {
    const spec = items.map((i) => {
      const cat = findCategory(i.categorySlug);
      const v = findVersion(i.categorySlug, i.versionId);
      return { category: cat?.title, categorySlug: i.categorySlug, version: v?.label, versionId: i.versionId, commit: v?.commit };
    });
    const blob = new Blob([JSON.stringify(spec, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${name.replace(/\s+/g, "-").toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleShare() {
    const encoded = encodeComposition(items);
    const url = `${window.location.origin}/design-composer?c=${encoded}`;
    if (shareInputRef.current) {
      shareInputRef.current.value = url;
      shareInputRef.current.select();
      document.execCommand("copy");
    }
  }

  const availableCategories = useMemo(() => CATEGORIES.filter((c) => c.versions.some((v) => v.componentKey)), []);

  return (
    <div className="v4-scope font-sans min-h-screen" data-v4-theme="dark" style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
      <header className="border-b sticky top-0 z-30 backdrop-blur-md" style={{ borderColor: "var(--v4-border)", background: "color-mix(in srgb, var(--v4-bg) 92%, transparent)" }}>
        <div className="max-w-[1800px] mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <Link href="/design-museum" className="text-sm inline-flex items-center gap-1.5" style={{ color: "var(--v4-text-secondary)" }}>
              <ArrowLeft size={14} /> Museum
            </Link>
            <h1 className="text-lg font-semibold tracking-tight">Design Composer</h1>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button type="button" onClick={undo} disabled={historyIndex === 0} className="w-8 h-8 flex items-center justify-center rounded-md border disabled:opacity-30" style={{ borderColor: "var(--v4-border-strong)", color: "var(--v4-text-secondary)" }} aria-label="Undo">
              <Undo2 size={14} />
            </button>
            <button type="button" onClick={redo} disabled={historyIndex === history.length - 1} className="w-8 h-8 flex items-center justify-center rounded-md border disabled:opacity-30" style={{ borderColor: "var(--v4-border-strong)", color: "var(--v4-text-secondary)" }} aria-label="Redo">
              <Redo2 size={14} />
            </button>
            <button type="button" onClick={reset} className="text-xs px-3 py-2 rounded-md border flex items-center gap-1.5" style={{ borderColor: "var(--v4-border-strong)", color: "var(--v4-text-secondary)" }}>
              <RotateCcw size={13} /> Reset
            </button>
            <div className="flex items-center gap-1 rounded-md border p-1" style={{ borderColor: "var(--v4-border-strong)" }}>
              {(["desktop", "tablet", "mobile"] as DeviceKey[]).map((d) => {
                const Icon = d === "desktop" ? Monitor : d === "tablet" ? Tablet : Smartphone;
                return (
                  <button key={d} type="button" onClick={() => setDevice(d)} aria-pressed={device === d} aria-label={`Preview at ${d} width`} className="w-8 h-8 flex items-center justify-center rounded" style={{ background: device === d ? "var(--v4-bg-raised-2)" : "transparent", color: device === d ? "var(--v4-gold-b)" : "var(--v4-text-secondary)" }}>
                    <Icon size={14} />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-[1800px] mx-auto px-6 py-8 grid lg:grid-cols-[380px_1fr] gap-8 items-start">
        {/* Control panel */}
        <div className="space-y-6">
          <div className="v4-diagram-node p-4">
            <label className="text-xs uppercase tracking-wide" style={{ color: "var(--v4-text-tertiary)" }}>
              Composition name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1.5 w-full text-sm rounded-md border px-3 py-2"
              style={{ background: "var(--v4-bg-raised)", borderColor: "var(--v4-border-strong)", color: "var(--v4-text)" }}
            />
            <div className="grid grid-cols-2 gap-2 mt-3">
              <button type="button" onClick={handleSave} className="text-xs px-3 py-2 rounded-md v4-gold-fill font-semibold flex items-center justify-center gap-1.5">
                <Save size={13} /> Save
              </button>
              <button type="button" onClick={() => setShowLoad((s) => !s)} className="text-xs px-3 py-2 rounded-md border flex items-center justify-center gap-1.5" style={{ borderColor: "var(--v4-border-strong)", color: "var(--v4-text-secondary)" }}>
                <FolderOpen size={13} /> Load
              </button>
              <button type="button" onClick={handleDuplicateComposition} className="text-xs px-3 py-2 rounded-md border flex items-center justify-center gap-1.5" style={{ borderColor: "var(--v4-border-strong)", color: "var(--v4-text-secondary)" }}>
                <Copy size={13} /> Duplicate
              </button>
              <button type="button" onClick={handleExport} className="text-xs px-3 py-2 rounded-md border flex items-center justify-center gap-1.5" style={{ borderColor: "var(--v4-border-strong)", color: "var(--v4-text-secondary)" }}>
                <Download size={13} /> Export
              </button>
            </div>
            <button type="button" onClick={handleShare} className="mt-2 w-full text-xs px-3 py-2 rounded-md border flex items-center justify-center gap-1.5" style={{ borderColor: "var(--v4-border-strong)", color: "var(--v4-gold-b)" }}>
              <Share2 size={13} /> Copy shareable link
            </button>
            <input ref={shareInputRef} readOnly className="sr-only" aria-hidden="true" tabIndex={-1} />

            {showLoad && (
              <div className="mt-3 pt-3 border-t space-y-1.5" style={{ borderColor: "var(--v4-border)" }}>
                {saved.length === 0 ? (
                  <p className="text-xs" style={{ color: "var(--v4-text-tertiary)" }}>
                    No saved compositions yet.
                  </p>
                ) : (
                  saved.map((c) => (
                    <div key={c.name} className="flex items-center justify-between gap-2 text-xs">
                      <button type="button" onClick={() => handleLoad(c)} className="truncate text-left flex-1 hover:underline" style={{ color: "var(--v4-text)" }}>
                        {c.name}
                      </button>
                      <button type="button" onClick={() => handleDelete(c.name)} aria-label={`Delete ${c.name}`} style={{ color: "var(--v4-red)" }}>
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          <div>
            <p className="text-sm font-medium mb-3">Sections ({items.length})</p>
            <div className="space-y-2">
              {items.map((item, idx) => {
                const cat = findCategory(item.categorySlug);
                const version = findVersion(item.categorySlug, item.versionId);
                if (!cat || !version) return null;
                const options = cat.versions.filter((v) => v.componentKey);
                return (
                  <div key={item.id} className="v4-diagram-node p-3">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <p className="text-xs font-medium">{cat.title}</p>
                      <div className="flex items-center gap-1">
                        <button type="button" onClick={() => move(item.id, -1)} disabled={idx === 0} aria-label={`Move ${cat.title} up`} className="w-6 h-6 flex items-center justify-center rounded disabled:opacity-25" style={{ color: "var(--v4-text-secondary)" }}>
                          <ArrowUp size={12} />
                        </button>
                        <button type="button" onClick={() => move(item.id, 1)} disabled={idx === items.length - 1} aria-label={`Move ${cat.title} down`} className="w-6 h-6 flex items-center justify-center rounded disabled:opacity-25" style={{ color: "var(--v4-text-secondary)" }}>
                          <ArrowDown size={12} />
                        </button>
                        <button type="button" onClick={() => duplicate(item.id)} aria-label={`Duplicate ${cat.title}`} className="w-6 h-6 flex items-center justify-center rounded" style={{ color: "var(--v4-text-secondary)" }}>
                          <Copy size={12} />
                        </button>
                        <button type="button" onClick={() => remove(item.id)} aria-label={`Remove ${cat.title}`} className="w-6 h-6 flex items-center justify-center rounded" style={{ color: "var(--v4-red)" }}>
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                    <select
                      value={item.versionId}
                      onChange={(e) => replaceVersion(item.id, e.target.value)}
                      className="w-full text-xs rounded-md border px-2 py-1.5"
                      style={{ background: "var(--v4-bg-raised)", borderColor: "var(--v4-border)", color: "var(--v4-text)" }}
                    >
                      {options.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.label}
                        </option>
                      ))}
                    </select>
                  </div>
                );
              })}
            </div>

            <div className="mt-3">
              {addingFor ? (
                <div className="v4-diagram-node p-3">
                  <p className="text-xs font-medium mb-2">Add which section?</p>
                  <select
                    onChange={(e) => {
                      const [slug, versionId] = e.target.value.split("::");
                      if (slug && versionId) addSection(slug, versionId);
                    }}
                    defaultValue=""
                    className="w-full text-xs rounded-md border px-2 py-1.5"
                    style={{ background: "var(--v4-bg-raised)", borderColor: "var(--v4-border)", color: "var(--v4-text)" }}
                  >
                    <option value="" disabled>
                      Choose a category + version
                    </option>
                    {availableCategories.map((c) => (
                      <optgroup key={c.slug} label={c.title}>
                        {c.versions.filter((v) => v.componentKey).map((v) => (
                          <option key={v.id} value={`${c.slug}::${v.id}`}>
                            {v.label}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                  <button type="button" onClick={() => setAddingFor(null)} className="text-xs mt-2" style={{ color: "var(--v4-text-tertiary)" }}>
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setAddingFor("open")}
                  className="w-full text-xs px-3 py-2.5 rounded-md border border-dashed flex items-center justify-center gap-1.5 transition-colors hover:border-[var(--v4-gold-b)]"
                  style={{ borderColor: "var(--v4-border-strong)", color: "var(--v4-gold-b)" }}
                >
                  <Plus size={13} /> Add section
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Live composition preview - real components, one normalized theme (v4-preview.css tokens) */}
        <div className="rounded-lg border overflow-hidden" style={{ borderColor: "var(--v4-border-strong)", background: "var(--v4-bg-inset)" }}>
          <div className="p-4 flex justify-center">
            <div
              className="v4-scope font-sans rounded-md overflow-hidden transition-[width] duration-300"
              data-v4-theme="dark"
              style={{ width: "100%", maxWidth: WIDTHS[device], fontFamily: "var(--font-inter), system-ui, sans-serif" }}
            >
              {items.map((item) => {
                const version = findVersion(item.categorySlug, item.versionId);
                const render = version?.componentKey ? componentMap[version.componentKey] : null;
                if (!render) return null;
                return (
                  <MuseumErrorBoundary key={item.id} label={version?.label}>
                    {render()}
                  </MuseumErrorBoundary>
                );
              })}
              {items.length === 0 && (
                <div className="p-24 text-center text-sm" style={{ color: "var(--v4-text-tertiary)" }}>
                  No sections in this composition yet — add one from the panel on the left.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
