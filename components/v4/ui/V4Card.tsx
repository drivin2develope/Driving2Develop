import type { HTMLAttributes } from "react";

export function V4Card({ className = "", style, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-xl border ${className}`}
      style={{ borderColor: "var(--v4-border-strong)", background: "var(--v4-bg-raised)", ...style }}
      {...rest}
    />
  );
}

export function V4StatCard({ label, value, suffix = "" }: { label: string; value: string | number; suffix?: string }) {
  return (
    <V4Card className="p-5">
      <p className="text-xs uppercase tracking-wide" style={{ color: "var(--v4-text-tertiary)" }}>
        {label}
      </p>
      <p className="text-2xl font-semibold tabular-nums mt-1.5">
        {value}
        {suffix}
      </p>
    </V4Card>
  );
}
