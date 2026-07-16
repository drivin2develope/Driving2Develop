"use client";

import { forwardRef } from "react";
import Link from "next/link";
import { Slot } from "@radix-ui/react-slot";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "destructive" | "outline";
type Size = "sm" | "md" | "lg" | "icon";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-[var(--color-gold)] text-[var(--color-gold-ink)] font-semibold hover:brightness-[1.08] active:brightness-95 shadow-[0_1px_0_rgba(255,255,255,0.15)_inset]",
  secondary:
    "bg-[var(--color-elevated)] text-[var(--color-primary)] border border-[var(--color-border)] hover:bg-[var(--color-elevated2)] hover:border-[var(--color-border-strong)]",
  outline:
    "bg-transparent text-[var(--color-primary)] border border-[var(--color-border-strong)] hover:bg-[var(--color-border)]",
  ghost: "bg-transparent text-[var(--color-secondary)] hover:bg-[var(--color-border)] hover:text-[var(--color-primary)]",
  destructive: "bg-[var(--color-red)] text-white font-semibold hover:brightness-105 active:brightness-95",
};

const SIZES: Record<Size, string> = {
  sm: "h-8 px-3 text-xs rounded-lg gap-1.5",
  md: "h-10 px-4 text-sm rounded-lg gap-2",
  lg: "h-12 px-6 text-sm rounded-lg gap-2",
  icon: "h-9 w-9 rounded-lg justify-center",
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = "primary", size = "md", loading = false, asChild = false, children, disabled, ...props },
  ref
) {
  const Comp: any = asChild ? Slot : "button";
  const base =
    "inline-flex items-center justify-center font-medium transition-[filter,background,transform,border-color] duration-150 active:scale-[0.98] disabled:opacity-45 disabled:pointer-events-none select-none";
  return (
    <Comp
      ref={ref}
      className={cn(base, VARIANTS[variant], SIZES[size], className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading && <Loader2 size={16} className="animate-spin" aria-hidden="true" />}
      {children}
    </Comp>
  );
});

/** Button styled as a next/link. */
export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: {
  href: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
} & Omit<React.ComponentProps<typeof Link>, "href">) {
  const base =
    "inline-flex items-center justify-center font-medium transition-[filter,background,transform,border-color] duration-150 active:scale-[0.98] select-none";
  return (
    <Link href={href} className={cn(base, VARIANTS[variant], SIZES[size], className)} {...props}>
      {children}
    </Link>
  );
}
