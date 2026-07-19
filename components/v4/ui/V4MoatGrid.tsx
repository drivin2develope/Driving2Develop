import type { LucideIcon } from "lucide-react";
import { V4Reveal } from "./V4Reveal";

export interface MoatItem {
  icon: LucideIcon;
  title: string;
  body: string;
}

/** Shared "why it's hard to copy" grid, used identically across every deep capability page. */
export function V4MoatGrid({ items }: { items: MoatItem[] }) {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      {items.map((m, i) => (
        <V4Reveal key={m.title} index={i}>
          <m.icon size={20} style={{ color: "var(--v4-gold-b)" }} />
          <h3 className="font-medium mt-4">{m.title}</h3>
          <p className="text-sm mt-1.5" style={{ color: "var(--v4-text-secondary)" }}>
            {m.body}
          </p>
        </V4Reveal>
      ))}
    </div>
  );
}
