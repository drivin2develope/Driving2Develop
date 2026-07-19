"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Mic, Trophy, MessageSquare, History } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/practice", label: "Practice", icon: Mic },
  { href: "/history", label: "History", icon: History },
  { href: "/leaderboard", label: "Ranks", icon: Trophy },
  { href: "/coach", label: "Coach", icon: MessageSquare },
];

export function MobileTabBar() {
  const pathname = usePathname();
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[rgba(20,20,22,0.92)] backdrop-blur border-t border-[var(--color-border)] flex justify-around px-1 py-1.5 pb-[calc(0.375rem+env(safe-area-inset-bottom))]" aria-label="Bottom tabs">
      {TABS.map((tab) => {
        const active = pathname === tab.href || pathname.startsWith(tab.href + "/");
        const Icon = tab.icon;
        return (
          <Link key={tab.href} href={tab.href} aria-current={active ? "page" : undefined}
            className={cn("flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg text-2xs min-w-[56px]", active ? "text-[var(--color-gold)]" : "text-[var(--color-secondary)]")}>
            <Icon size={20} strokeWidth={active ? 2.25 : 1.75} />
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
