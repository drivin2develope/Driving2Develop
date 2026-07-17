import type { AnchorHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";

interface V4ButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: Variant;
  children: ReactNode;
}

/**
 * Gold-fill is reserved for `variant="primary"` only, and should appear at
 * most once or twice per page (per the V4 design mandate: gold is an accent,
 * never a background system).
 */
export function V4Button({ variant = "secondary", children, className = "", ...rest }: V4ButtonProps) {
  const base = "inline-flex items-center gap-2 rounded-md px-6 py-3.5 text-sm font-semibold transition-transform";
  if (variant === "primary") {
    return (
      <a className={`${base} v4-gold-fill hover:scale-[1.02] ${className}`} {...rest}>
        {children}
      </a>
    );
  }
  if (variant === "ghost") {
    return (
      <a className={`${base} ${className}`} style={{ color: "var(--v4-gold-b)" }} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <a
      className={`${base} border ${className}`}
      style={{ borderColor: "var(--v4-border-strong)", color: "var(--v4-text)" }}
      {...rest}
    >
      {children}
    </a>
  );
}
