"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Logo } from "@/components/Logo";
import { ButtonLink } from "@/components/ui";

const LINKS = [
  { href: "/product", label: "Product" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/pricing", label: "Pricing" },
  { href: "/customers", label: "Customers" },
  { href: "/help", label: "Help" },
];

export function MarketingNav() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-[var(--nav-blur-bg)] border-b border-[var(--color-border)]">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-5 md:px-8 h-16">
        <Logo />
        <nav className="hidden md:flex items-center gap-7 text-sm text-[var(--color-secondary)]" aria-label="Primary">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-[var(--color-primary)] transition-colors">
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="hidden md:flex items-center gap-3">
          <Link href="/login" className="text-sm text-[var(--color-secondary)] hover:text-[var(--color-primary)] px-2">
            Sign in
          </Link>
          <ButtonLink href="/signup" size="sm">
            Start Training
          </ButtonLink>
        </div>
        <button
          className="md:hidden text-[var(--color-primary)] p-1"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            className="md:hidden border-t border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
          >
            <nav className="px-5 py-4 flex flex-col gap-1" aria-label="Mobile">
              {LINKS.map((l) => (
                <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="py-2.5 text-sm text-[var(--color-secondary)]">
                  {l.label}
                </Link>
              ))}
              <div className="flex gap-3 mt-3">
                <ButtonLink href="/login" variant="secondary" size="sm" className="flex-1">Sign in</ButtonLink>
                <ButtonLink href="/signup" size="sm" className="flex-1">Start Training</ButtonLink>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
