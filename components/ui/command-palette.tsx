"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import * as RDialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Search, CornerDownLeft } from "lucide-react";
import { navGroupsFor } from "@/lib/nav";
import { cn } from "@/lib/utils";

export function SearchTrigger({ role }: { role: "REP" | "MANAGER" }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex w-full items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-base)] px-3 py-2 text-sm text-[var(--color-secondary)] hover:border-[var(--color-border-strong)] transition-colors"
        aria-label="Search and jump to a page"
      >
        <Search size={15} />
        <span className="flex-1 text-left">Search…</span>
        <kbd className="rounded border border-[var(--color-border)] px-1.5 py-0.5 text-2xs text-[var(--color-disabled)]">⌘K</kbd>
      </button>
      <CommandPalette role={role} open={open} onOpenChange={setOpen} />
    </>
  );
}

function CommandPalette({ role, open, onOpenChange }: { role: "REP" | "MANAGER"; open: boolean; onOpenChange: (o: boolean) => void }) {
  const router = useRouter();
  const reduce = useReducedMotion();
  const [query, setQuery] = useState("");

  const all = useMemo(() => {
    const groups = navGroupsFor(role);
    return groups.flatMap((g) => g.items.map((it) => ({ ...it, group: g.heading })));
  }, [role]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return all;
    return all.filter((r) => r.label.toLowerCase().includes(q) || r.group.toLowerCase().includes(q));
  }, [all, query]);

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  function go(href: string) {
    onOpenChange(false);
    router.push(href);
  }

  return (
    <RDialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <RDialog.Portal forceMount>
            <RDialog.Overlay asChild forceMount>
              <motion.div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} />
            </RDialog.Overlay>
            <RDialog.Content asChild forceMount>
              <motion.div
                className="fixed left-1/2 top-[18%] z-50 w-[92vw] max-w-lg -translate-x-1/2 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-elevated)] shadow-pop"
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.98 }}
                transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              >
                <RDialog.Title className="sr-only">Search pages</RDialog.Title>
                <div className="flex items-center gap-2.5 border-b border-[var(--color-border)] px-4">
                  <Search size={16} className="text-[var(--color-secondary)]" />
                  <input
                    autoFocus
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Jump to a page…"
                    className="flex-1 bg-transparent py-3.5 text-sm outline-none placeholder:text-[var(--color-disabled)]"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && results[0]) go(results[0].href);
                    }}
                  />
                </div>
                <ul className="max-h-[320px] overflow-y-auto p-2">
                  {results.length === 0 && <li className="px-3 py-6 text-center text-sm text-[var(--color-secondary)]">No matches.</li>}
                  {results.map((r) => {
                    const Icon = r.icon;
                    return (
                      <li key={r.href}>
                        <button
                          onClick={() => go(r.href)}
                          className={cn(
                            "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[var(--color-secondary)] hover:bg-white/5 hover:text-[var(--color-primary)]"
                          )}
                        >
                          <Icon size={16} />
                          <span className="flex-1 text-left text-[var(--color-primary)]">{r.label}</span>
                          <span className="text-2xs text-[var(--color-disabled)]">{r.group}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
                <div className="flex items-center gap-2 border-t border-[var(--color-border)] px-4 py-2 text-2xs text-[var(--color-disabled)]">
                  <CornerDownLeft size={12} /> to open · Esc to close
                </div>
              </motion.div>
            </RDialog.Content>
          </RDialog.Portal>
        )}
      </AnimatePresence>
    </RDialog.Root>
  );
}
