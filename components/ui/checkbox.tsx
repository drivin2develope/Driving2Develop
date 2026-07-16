"use client";

import * as RCheckbox from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import { useId } from "react";
import { cn } from "@/lib/utils";

export function Checkbox({
  label,
  description,
  className,
  ...props
}: {
  label?: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
} & React.ComponentProps<typeof RCheckbox.Root>) {
  const id = useId();
  return (
    <div className={cn("flex items-start gap-3", className)}>
      <RCheckbox.Root
        id={id}
        className="mt-0.5 h-[18px] w-[18px] shrink-0 rounded-[5px] border border-[var(--color-border-strong)] bg-[var(--color-surface)] data-[state=checked]:bg-[var(--color-gold)] data-[state=checked]:border-[var(--color-gold)] transition-colors"
        {...props}
      >
        <RCheckbox.Indicator className="flex items-center justify-center text-[var(--color-gold-ink)]">
          <Check size={13} strokeWidth={3} />
        </RCheckbox.Indicator>
      </RCheckbox.Root>
      {(label || description) && (
        <label htmlFor={id} className="text-sm cursor-pointer select-none">
          {label && <span className="text-[var(--color-primary)]">{label}</span>}
          {description && <span className="block text-xs text-[var(--color-secondary)] mt-0.5">{description}</span>}
        </label>
      )}
    </div>
  );
}
