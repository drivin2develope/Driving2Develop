import { cn } from "@/lib/utils";
import { Card } from "./card";

type Accent = "gold" | "green" | "red" | "blue" | "purple" | "orange";
const ACCENT: Record<Accent, string> = {
  gold: "text-[var(--color-gold)]",
  green: "text-[var(--color-green)]",
  red: "text-[var(--color-red)]",
  blue: "text-[var(--color-blue)]",
  purple: "text-[var(--color-purple)]",
  orange: "text-[var(--color-orange)]",
};

export function StatCard({
  label,
  value,
  suffix,
  accent = "gold",
  icon,
  hint,
  className,
}: {
  label: string;
  value: string | number;
  suffix?: string;
  accent?: Accent;
  icon?: React.ReactNode;
  hint?: React.ReactNode;
  className?: string;
}) {
  return (
    <Card className={cn("flex flex-col justify-between min-h-[112px]", className)}>
      <div className="flex items-center justify-between">
        <span className="text-2xs uppercase tracking-wide text-[var(--color-secondary)]">{label}</span>
        {icon && <span className="text-[var(--color-secondary)]">{icon}</span>}
      </div>
      <div className="mt-2 flex items-end gap-1.5">
        <span className={cn("text-3xl md:text-4xl font-semibold tracking-tight tabular-nums", ACCENT[accent])}>{value}</span>
        {suffix && <span className="text-sm text-[var(--color-secondary)] mb-1">{suffix}</span>}
      </div>
      {hint && <p className="text-xs text-[var(--color-secondary)] mt-1.5">{hint}</p>}
    </Card>
  );
}
