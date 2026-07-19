"use client";

/**
 * FROZEN HISTORICAL SNAPSHOT - Navigation V1
 * Exact recovery from commit 568518a (components/v4/V4Nav.tsx) - the
 * original Phase 3 mega menu with a hand-written 3-column PLATFORM_COLUMNS
 * list, before it was rebuilt to read from lib/v4/site-map.ts in 3537a8c.
 */
import { useEffect, useRef, useState } from "react";
import {
  MessageSquareText,
  Gauge,
  GraduationCap,
  Users2,
  Map,
  ShieldCheck,
  ArrowUpRight,
  Menu,
  X,
  Sun,
  Moon,
} from "lucide-react";

const PLATFORM_COLUMNS = [
  {
    heading: "Simulation",
    items: [
      { label: "Roleplay Engine", desc: "Adaptive difficulty, personality, and objection targeting.", icon: MessageSquareText },
      { label: "Conversation Intelligence", desc: "Transcript, acoustic, and semantic analysis in one layer.", icon: Gauge },
    ],
  },
  {
    heading: "Coaching",
    items: [
      { label: "Scoring & Evidence", desc: "Every finding traces to an exact transcript moment.", icon: ShieldCheck },
      { label: "Certification Paths", desc: "Structured progression from rookie to certified rep.", icon: GraduationCap },
    ],
  },
  {
    heading: "For Teams",
    items: [
      { label: "Manager Dashboard", desc: "Needs-attention queue, skill maps, assignment workflows.", icon: Users2 },
      { label: "Territory Intelligence", desc: "Roadmap: cross-team and geographic benchmarking.", icon: Map },
    ],
  },
];

export function NavV1({ theme, onToggleTheme }: { theme: "dark" | "light"; onToggleTheme: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    function onClick(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setMenuOpen(false);
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, []);

  return (
    <div ref={navRef} className="sticky top-0 z-40">
      <header
        className="border-b backdrop-blur-md"
        style={{ background: "color-mix(in srgb, var(--v4-bg) 88%, transparent)", borderColor: "var(--v4-border)" }}
      >
        <div className="max-w-[1600px] mx-auto flex items-center justify-between h-[72px] px-6 md:px-10">
          <div className="flex items-center gap-10">
            <a href="#" className="flex items-center gap-2.5" aria-label="Driven2Develop home">
              <span
                className="w-7 h-7 rounded-[7px] border flex items-end justify-center gap-[2.5px] p-[6px]"
                style={{ borderColor: "var(--v4-border-strong)" }}
                aria-hidden="true"
              >
                <span className="w-[2.5px] rounded-full v4-gold-fill" style={{ height: "35%" }} />
                <span className="w-[2.5px] rounded-full v4-gold-fill" style={{ height: "100%" }} />
                <span className="w-[2.5px] rounded-full v4-gold-fill" style={{ height: "60%" }} />
              </span>
              <span className="text-[15px] font-semibold tracking-tight hidden sm:inline">Driven2Develop</span>
            </a>

            <nav className="hidden lg:flex items-center gap-1" aria-label="Primary">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                aria-expanded={menuOpen}
                aria-haspopup="true"
                className="px-3.5 py-2 text-sm rounded-md transition-colors"
                style={{ color: menuOpen ? "var(--v4-text)" : "var(--v4-text-secondary)" }}
              >
                Platform
              </button>
              {["Solutions", "Industries", "Resources", "Pricing"].map((label) => (
                <a
                  key={label}
                  href="#"
                  className="px-3.5 py-2 text-sm rounded-md transition-colors hover:opacity-100"
                  style={{ color: "var(--v4-text-secondary)" }}
                >
                  {label}
                </a>
              ))}
            </nav>
          </div>

          <div className="hidden lg:flex items-center gap-4">
            <button
              onClick={onToggleTheme}
              aria-label="Toggle theme"
              className="w-8 h-8 flex items-center justify-center rounded-md border"
              style={{ borderColor: "var(--v4-border)", color: "var(--v4-text-secondary)" }}
            >
              {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
            </button>
            <a href="#" className="text-sm" style={{ color: "var(--v4-text-secondary)" }}>
              Sign In
            </a>
            <a
              href="#"
              className="v4-gold-fill inline-flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-semibold"
            >
              Request Pilot <ArrowUpRight size={14} />
            </a>
          </div>

          <button
            className="lg:hidden w-9 h-9 flex items-center justify-center"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Menu"
            style={{ color: "var(--v4-text)" }}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {menuOpen && (
          <div
            role="menu"
            className="hidden lg:block border-t"
            style={{ background: "var(--v4-bg-raised)", borderColor: "var(--v4-border)" }}
          >
            <div className="max-w-[1600px] mx-auto grid grid-cols-4 gap-10 px-10 py-10">
              {PLATFORM_COLUMNS.map((col) => (
                <div key={col.heading}>
                  <p className="v4-eyebrow mb-4">{col.heading}</p>
                  <ul className="space-y-4">
                    {col.items.map((item) => {
                      const Icon = item.icon;
                      return (
                        <li key={item.label}>
                          <a href="#" className="flex gap-3 group">
                            <Icon size={17} className="mt-0.5 shrink-0" style={{ color: "var(--v4-gold-b)" }} />
                            <span>
                              <span className="block text-sm font-medium">{item.label}</span>
                              <span className="block text-xs mt-0.5" style={{ color: "var(--v4-text-secondary)" }}>
                                {item.desc}
                              </span>
                            </span>
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
              <div
                className="rounded-lg border p-5 flex flex-col justify-between"
                style={{ borderColor: "var(--v4-border-strong)", background: "var(--v4-bg-raised-2)" }}
              >
                <div>
                  <p className="v4-eyebrow mb-2">Featured</p>
                  <p className="text-sm font-medium mb-1.5">See the full engine</p>
                  <p className="text-xs" style={{ color: "var(--v4-text-secondary)" }}>
                    One connected system from rehearsal to organizational intelligence.
                  </p>
                </div>
                <a href="#" className="text-xs font-semibold mt-4 inline-flex items-center gap-1" style={{ color: "var(--v4-gold-b)" }}>
                  View platform overview <ArrowUpRight size={12} />
                </a>
              </div>
            </div>
          </div>
        )}

        {mobileOpen && (
          <div className="lg:hidden border-t px-6 py-5 space-y-4" style={{ borderColor: "var(--v4-border)", background: "var(--v4-bg-raised)" }}>
            {["Platform", "Solutions", "Industries", "Resources", "Pricing"].map((label) => (
              <a key={label} href="#" className="block text-sm font-medium">
                {label}
              </a>
            ))}
            <div className="flex items-center gap-3 pt-2">
              <a href="#" className="text-sm" style={{ color: "var(--v4-text-secondary)" }}>
                Sign In
              </a>
              <a href="#" className="v4-gold-fill inline-flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-semibold">
                Request Pilot <ArrowUpRight size={14} />
              </a>
            </div>
          </div>
        )}
      </header>
    </div>
  );
}
