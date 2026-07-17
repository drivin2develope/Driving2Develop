import Link from "next/link";
import { cn } from "@/lib/utils";

export function LogoMark({ size = 28, className }: { size?: number; className?: string }) {
  return (
    <span
      className={cn("relative inline-flex items-center justify-center rounded-lg bg-[var(--color-gold)] font-bold text-[var(--color-gold-ink)] shadow-gold", className)}
      style={{ width: size, height: size, fontSize: size * 0.5 }}
      aria-hidden="true"
    >
      D
    </span>
  );
}

export function Logo({ href = "/", className, wordmark = true }: { href?: string; className?: string; wordmark?: boolean }) {
  return (
    <Link href={href} className={cn("flex items-center gap-2.5 group", className)} aria-label="Driving2Develop home">
      <LogoMark />
      {wordmark && (
        <span className="font-semibold tracking-tight text-[15px] text-[var(--color-primary)]">
          Driving2Develop
        </span>
      )}
    </Link>
  );
}
