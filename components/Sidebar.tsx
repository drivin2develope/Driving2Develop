"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, LogOut } from "lucide-react";
import { Logo } from "@/components/Logo";
import { SearchTrigger } from "@/components/ui";
import { Avatar } from "@/components/ui";
import { DropdownMenu, DropdownTrigger, DropdownContent, DropdownItem, DropdownSeparator, DropdownLabel } from "@/components/ui";
import { navGroupsFor } from "@/lib/nav";
import { cn } from "@/lib/utils";

export function Sidebar({ user }: { user: { name: string; email: string; role: "REP" | "MANAGER" } }) {
  const pathname = usePathname();
  const router = useRouter();
  const groups = navGroupsFor(user.role);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(href + "/");
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <aside className="hidden md:flex md:flex-col w-[248px] shrink-0 h-screen sticky top-0 border-r border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="flex items-center h-16 px-5 shrink-0">
        <Logo />
      </div>
      <div className="px-3 pb-2">
        <SearchTrigger role={user.role} />
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-4" aria-label="Sidebar">
        {groups.map((group) => {
          const isCollapsed = collapsed[group.heading];
          return (
            <div key={group.heading}>
              <button
                onClick={() => setCollapsed((c) => ({ ...c, [group.heading]: !c[group.heading] }))}
                className="flex w-full items-center justify-between px-3 py-1 text-2xs font-semibold uppercase tracking-widest text-[var(--color-disabled)] hover:text-[var(--color-secondary)]"
                aria-expanded={!isCollapsed}
              >
                {group.heading}
                <ChevronDown size={13} className={cn("transition-transform", isCollapsed && "-rotate-90")} />
              </button>
              {!isCollapsed && (
                <div className="mt-1 space-y-0.5">
                  {group.items.map((item) => {
                    const active = isActive(item.href);
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors border-l-2",
                          active
                            ? "bg-[rgba(227,179,65,0.1)] text-[var(--color-gold)] border-[var(--color-gold)] font-medium"
                            : "text-[var(--color-secondary)] border-transparent hover:bg-white/5 hover:text-[var(--color-primary)]"
                        )}
                      >
                        <Icon size={17} strokeWidth={active ? 2.25 : 1.75} />
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
      <div className="border-t border-[var(--color-border)] p-3">
        <DropdownMenu>
          <DropdownTrigger asChild>
            <button className="flex w-full items-center gap-3 rounded-lg px-2 py-2 hover:bg-white/5 transition-colors text-left">
              <Avatar name={user.name} size={32} />
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium truncate">{user.name}</span>
                <span className="block text-xs text-[var(--color-secondary)] truncate">{user.role === "MANAGER" ? "Manager" : "Rep"}</span>
              </span>
              <ChevronDown size={15} className="text-[var(--color-secondary)]" />
            </button>
          </DropdownTrigger>
          <DropdownContent align="start" className="w-[220px]">
            <DropdownLabel>{user.email}</DropdownLabel>
            <DropdownItem onSelect={() => router.push("/settings/profile")}>Profile settings</DropdownItem>
            <DropdownItem onSelect={() => router.push("/notifications")}>Notifications</DropdownItem>
            <DropdownSeparator />
            <DropdownItem onSelect={logout} className="text-[var(--color-red)] data-[highlighted]:text-[var(--color-red)]">
              <LogOut size={15} /> Log out
            </DropdownItem>
          </DropdownContent>
        </DropdownMenu>
      </div>
    </aside>
  );
}
