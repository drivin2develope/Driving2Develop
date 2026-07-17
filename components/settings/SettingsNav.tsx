"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/settings/profile", label: "Profile" },
  { href: "/settings/appearance", label: "Appearance" },
  { href: "/settings/microphone", label: "Microphone" },
  { href: "/settings/notifications", label: "Notifications" },
  { href: "/settings/privacy", label: "Privacy" },
];

export function SettingsNav() {
  const pathname = usePathname();
  return (
    <nav className="flex gap-1 overflow-x-auto border-b border-[var(--color-border)] px-5 md:px-8" aria-label="Settings sections">
      {TABS.map((t) => {
        const active = pathname === t.href;
        return (
          <Link key={t.href} href={t.href} aria-current={active ? "page" : undefined}
            className={cn("px-3.5 py-3 text-sm border-b-2 -mb-px whitespace-nowrap transition-colors",
              active ? "border-[var(--color-gold)] text-[var(--color-primary)] font-medium" : "border-transparent text-[var(--color-secondary)] hover:text-[var(--color-primary)]")}>
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
