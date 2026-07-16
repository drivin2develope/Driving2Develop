"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, LogOut } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Logo } from "@/components/Logo";
import { navGroupsFor } from "@/lib/nav";
import { cn } from "@/lib/utils";

export function MobileTopBar({ role }: { role: "REP" | "MANAGER" }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const groups = navGroupsFor(role);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <div className="md:hidden sticky top-0 z-40 flex items-center justify-between h-14 px-4 border-b border-[var(--color-border)] bg-[var(--nav-blur-bg)] backdrop-blur">
      <Logo />
      <button onClick={() => setOpen(true)} aria-label="Open menu" className="p-1 text-[var(--color-primary)]">
        <Menu size={22} />
      </button>
      <AnimatePresence>
        {open && (
          <>
            <motion.div className="fixed inset-0 z-50 bg-black/60" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} />
            <motion.nav
              className="fixed right-0 top-0 z-50 h-full w-[280px] bg-[var(--color-surface)] border-l border-[var(--color-border)] overflow-y-auto"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              aria-label="Mobile navigation"
            >
              <div className="flex items-center justify-between h-14 px-4 border-b border-[var(--color-border)]">
                <Logo />
                <button onClick={() => setOpen(false)} aria-label="Close menu" className="p-1"><X size={20} /></button>
              </div>
              <div className="p-3 space-y-4">
                {groups.map((g) => (
                  <div key={g.heading}>
                    <p className="px-3 py-1 text-2xs font-semibold uppercase tracking-widest text-[var(--color-disabled)]">{g.heading}</p>
                    <div className="mt-1 space-y-0.5">
                      {g.items.map((item) => {
                        const active = pathname === item.href || pathname.startsWith(item.href + "/");
                        const Icon = item.icon;
                        return (
                          <Link key={item.href} href={item.href} onClick={() => setOpen(false)}
                            className={cn("flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm", active ? "bg-[rgba(227,179,65,0.1)] text-[var(--color-gold-text)] font-medium" : "text-[var(--color-secondary)]")}>
                            <Icon size={17} /> {item.label}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}
                <button onClick={logout} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[var(--color-red)] w-full">
                  <LogOut size={16} /> Log out
                </button>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
