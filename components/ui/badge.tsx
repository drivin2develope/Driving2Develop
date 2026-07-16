import { cn } from "@/lib/utils";

export type BadgeColor = "default" | "green" | "red" | "orange" | "blue" | "purple" | "gold";

const COLORS: Record<BadgeColor, string> = {
  default: "bg-white/5 text-[var(--color-secondary)] ring-1 ring-inset ring-white/10",
  green: "bg-[rgba(52,211,153,0.12)] text-[var(--color-green)] ring-1 ring-inset ring-[rgba(52,211,153,0.2)]",
  red: "bg-[rgba(248,113,113,0.12)] text-[var(--color-red)] ring-1 ring-inset ring-[rgba(248,113,113,0.2)]",
  orange: "bg-[rgba(251,146,60,0.12)] text-[var(--color-orange)] ring-1 ring-inset ring-[rgba(251,146,60,0.2)]",
  blue: "bg-[rgba(96,165,250,0.12)] text-[var(--color-blue)] ring-1 ring-inset ring-[rgba(96,165,250,0.2)]",
  purple: "bg-[rgba(167,139,250,0.12)] text-[var(--color-purple)] ring-1 ring-inset ring-[rgba(167,139,250,0.2)]",
  gold: "bg-[rgba(227,179,65,0.12)] text-[var(--color-gold)] ring-1 ring-inset ring-[rgba(227,179,65,0.24)]",
};

export function Badge({
  children,
  color = "default",
  className,
}: {
  children: React.ReactNode;
  color?: BadgeColor;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium whitespace-nowrap",
        COLORS[color],
        className
      )}
    >
      {children}
    </span>
  );
}
