import { Logo } from "@/components/Logo";
import Link from "next/link";

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--color-base)] flex flex-col items-center justify-center px-5 py-10 relative">
      <div className="absolute inset-x-0 top-0 h-72 hero-glow pointer-events-none" aria-hidden="true" />
      <main id="main-content" className="w-full max-w-sm relative">
        <div className="flex justify-center mb-8">
          <Logo />
        </div>
        <div className="card p-6 shadow-pop">
          <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
          {subtitle && <p className="text-sm text-[var(--color-secondary)] mt-1">{subtitle}</p>}
          <div className="mt-6">{children}</div>
        </div>
        {footer && <div className="mt-5 text-center text-sm text-[var(--color-secondary)]">{footer}</div>}
      </main>
    </div>
  );
}

export { Link };
