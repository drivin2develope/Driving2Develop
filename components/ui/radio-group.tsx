"use client";

import * as RRadio from "@radix-ui/react-radio-group";
import { useId } from "react";
import { cn } from "@/lib/utils";

export function RadioGroup({ className, ...props }: React.ComponentProps<typeof RRadio.Root>) {
  return <RRadio.Root className={cn("grid gap-2.5", className)} {...props} />;
}

export function RadioCard({
  value,
  title,
  description,
  icon,
}: {
  value: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
}) {
  const id = useId();
  return (
    <label
      htmlFor={id}
      className="group flex items-start gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3.5 cursor-pointer transition-colors hover:border-[var(--color-border-strong)] has-[button[data-state=checked]]:border-[var(--color-gold)] has-[button[data-state=checked]]:bg-[rgba(227,179,65,0.06)]"
    >
      <RRadio.Item
        id={id}
        value={value}
        className="mt-0.5 h-[18px] w-[18px] shrink-0 rounded-full border border-[var(--color-border-strong)] bg-[var(--color-base)] data-[state=checked]:border-[var(--color-gold)]"
      >
        <RRadio.Indicator className="flex h-full w-full items-center justify-center after:block after:h-2 after:w-2 after:rounded-full after:bg-[var(--color-gold)]" />
      </RRadio.Item>
      {icon && <span className="text-[var(--color-gold)] mt-0.5">{icon}</span>}
      <span className="min-w-0">
        <span className="text-sm font-medium text-[var(--color-primary)]">{title}</span>
        {description && <span className="block text-xs text-[var(--color-secondary)] mt-0.5">{description}</span>}
      </span>
    </label>
  );
}
