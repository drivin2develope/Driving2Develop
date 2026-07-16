"use client";

import * as RTooltip from "@radix-ui/react-tooltip";

export function Tooltip({ content, children, side = "top" }: { content: React.ReactNode; children: React.ReactNode; side?: "top" | "bottom" | "left" | "right" }) {
  return (
    <RTooltip.Provider delayDuration={200}>
      <RTooltip.Root>
        <RTooltip.Trigger asChild>{children}</RTooltip.Trigger>
        <RTooltip.Portal>
          <RTooltip.Content
            side={side}
            sideOffset={6}
            className="z-50 max-w-[240px] rounded-lg border border-[var(--color-border)] bg-[var(--color-elevated2)] px-2.5 py-1.5 text-xs text-[var(--color-primary)] shadow-pop animate-fade-in"
          >
            {content}
            <RTooltip.Arrow className="fill-[var(--color-elevated2)]" />
          </RTooltip.Content>
        </RTooltip.Portal>
      </RTooltip.Root>
    </RTooltip.Provider>
  );
}
