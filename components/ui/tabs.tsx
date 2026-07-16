"use client";

import * as RTabs from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";

export const Tabs = RTabs.Root;

export function TabsList({ className, ...props }: React.ComponentProps<typeof RTabs.List>) {
  return (
    <RTabs.List
      className={cn(
        "inline-flex items-center gap-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-1",
        className
      )}
      {...props}
    />
  );
}

export function TabsTrigger({ className, ...props }: React.ComponentProps<typeof RTabs.Trigger>) {
  return (
    <RTabs.Trigger
      className={cn(
        "px-3.5 py-1.5 rounded-lg text-sm text-[var(--color-secondary)] transition-colors data-[state=active]:bg-[var(--color-elevated2)] data-[state=active]:text-[var(--color-primary)] hover:text-[var(--color-primary)]",
        className
      )}
      {...props}
    />
  );
}

export const TabsContent = RTabs.Content;
