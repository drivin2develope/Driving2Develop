"use client";

import * as RDropdown from "@radix-ui/react-dropdown-menu";
import { cn } from "@/lib/utils";

export const DropdownMenu = RDropdown.Root;
export const DropdownTrigger = RDropdown.Trigger;

export function DropdownContent({ className, children, align = "end" }: { className?: string; children: React.ReactNode; align?: "start" | "center" | "end" }) {
  return (
    <RDropdown.Portal>
      <RDropdown.Content
        align={align}
        sideOffset={6}
        className={cn(
          "z-50 min-w-[190px] rounded-xl border border-[var(--color-border)] bg-[var(--color-elevated)] p-1.5 shadow-pop animate-fade-in",
          className
        )}
      >
        {children}
      </RDropdown.Content>
    </RDropdown.Portal>
  );
}

export function DropdownItem({ className, children, ...props }: React.ComponentProps<typeof RDropdown.Item>) {
  return (
    <RDropdown.Item
      className={cn(
        "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-[var(--color-secondary)] outline-none cursor-pointer data-[highlighted]:bg-white/5 data-[highlighted]:text-[var(--color-primary)]",
        className
      )}
      {...props}
    >
      {children}
    </RDropdown.Item>
  );
}

export function DropdownLabel({ children }: { children: React.ReactNode }) {
  return <RDropdown.Label className="px-2.5 py-1.5 text-2xs uppercase tracking-wide text-[var(--color-disabled)]">{children}</RDropdown.Label>;
}

export function DropdownSeparator() {
  return <RDropdown.Separator className="my-1 h-px bg-[var(--color-border)]" />;
}
