"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Menu, X, Sun, Moon } from "lucide-react";
import { PLATFORM_HUB } from "@/lib/v4/site-map";
import { V4Badge } from "./ui/V4Badge";

const TOP_LINKS = ["Solutions", "Industries", "Resources", "Pricing"];
const MEGA_MENU_ITEM_LIMIT = 5;

export function V4Nav({ theme, onToggleTheme }: { theme: "dark" | "light"; onToggleTheme: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const platformBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setMenuOpen(false);
        platformBtnRef.current?.focus();
      }
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

  // Move focus into the menu on open so keyboard users land on its content
  // immediately, rather than tabbing past it to the next top-level link.
  useEffect(() => {
    if (menuOpen) {
      menuRef.current?.querySelector<HTMLAnchorElement>("a")?.focus();
    }
  }, [menuOpen]);

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
                ref={platformBtnRef}
                onClick={() => setMenuOpen((v) => !v)}
                aria-expanded={menuOpen}
                aria-haspopup="true"
                className="px-3.5 py-2 text-sm rounded-md transition-colors"
                style={{ color: menuOpen ? "var(--v4-text)" : "var(--v4-text-secondary)" }}
              >
                Platform
              </button>
              {TOP_LINKS.map((label) => (
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

        {/* Mega menu - generated from lib/v4/site-map.ts so nav status badges
            can never drift from the real backing implementation. */}
        <AnimatePresence>
        {menuOpen && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            role="menu"
            className="hidden lg:block border-t max-h-[calc(100vh-72px)] overflow-y-auto"
            style={{ background: "var(--v4-bg-raised)", borderColor: "var(--v4-border)" }}
          >
            <div className="max-w-[1600px] mx-auto grid grid-cols-4 gap-x-10 gap-y-10 px-10 py-10">
              {PLATFORM_HUB.categories.map((col) => {
                const shown = col.items.slice(0, MEGA_MENU_ITEM_LIMIT);
                const hidden = col.items.length - shown.length;
                return (
                  <div key={col.heading}>
                    <p className="v4-eyebrow mb-4">{col.heading}</p>
                    <ul className="space-y-3.5">
                      {shown.map((item) => {
                        const Wrapper = item.href ? "a" : "div";
                        return (
                          <li key={item.slug}>
                            <Wrapper
                              {...(item.href ? { href: item.href } : {})}
                              className={item.href ? "block group cursor-pointer -mx-2 px-2 py-1 rounded-md transition-colors hover:bg-[var(--v4-bg-raised-2)]" : "block -mx-2 px-2 py-1"}
                            >
                              <span className="flex items-center justify-between gap-2">
                                <span className="text-sm font-medium">{item.label}</span>
                                <V4Badge status={item.status} />
                              </span>
                              <span className="block text-xs mt-1" style={{ color: "var(--v4-text-secondary)" }}>
                                {item.blurb}
                              </span>
                            </Wrapper>
                          </li>
                        );
                      })}
                      {hidden > 0 && (
                        <li>
                          <a href="/v4-preview/platform" className="text-xs pt-1 block hover:underline" style={{ color: "var(--v4-text-tertiary)" }}>
                            +{hidden} more in Platform Overview
                          </a>
                        </li>
                      )}
                    </ul>
                  </div>
                );
              })}
              <div
                className="rounded-lg border p-5 flex flex-col justify-between"
                style={{ borderColor: "var(--v4-border-strong)", background: "var(--v4-bg-raised-2)" }}
              >
                <div>
                  <p className="v4-eyebrow mb-2">Featured</p>
                  <p className="text-sm font-medium mb-1.5">See the full engine</p>
                  <p className="text-xs" style={{ color: "var(--v4-text-secondary)" }}>
                    One connected system from rehearsal to organizational intelligence - {PLATFORM_HUB.categories.reduce((n, c) => n + c.items.length, 0)}{" "}
                    capabilities mapped, today and on the roadmap.
                  </p>
                </div>
                <a href="/v4-preview/platform" className="text-xs font-semibold mt-4 inline-flex items-center gap-1" style={{ color: "var(--v4-gold-b)" }}>
                  View platform overview <ArrowUpRight size={12} />
                </a>
              </div>
            </div>
          </motion.div>
        )}
        </AnimatePresence>

        {/* Mobile drawer */}
        {mobileOpen && (
          <div className="lg:hidden border-t px-6 py-5 space-y-4 max-h-[calc(100vh-72px)] overflow-y-auto" style={{ borderColor: "var(--v4-border)", background: "var(--v4-bg-raised)" }}>
            {["Platform", ...TOP_LINKS].map((label) => (
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
