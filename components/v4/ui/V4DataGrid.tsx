import { V4Card } from "./V4Card";
import { V4Reveal } from "./V4Reveal";

export interface DataInput {
  label: string;
  detail: string;
}

/** Shared "what it's built on" data-source grid, used identically across every deep capability page. */
export function V4DataGrid({ items }: { items: DataInput[] }) {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {items.map((d, i) => (
        <V4Reveal key={d.label} index={i}>
          <V4Card className="p-6 h-full transition-colors hover:border-[var(--v4-gold-b)]">
            <p className="text-sm font-medium">{d.label}</p>
            <p className="text-sm mt-2" style={{ color: "var(--v4-text-secondary)" }}>
              {d.detail}
            </p>
          </V4Card>
        </V4Reveal>
      ))}
    </div>
  );
}
