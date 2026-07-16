import { cn } from "@/lib/utils";

export function Table({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className="w-full overflow-x-auto">
      <table className={cn("w-full text-sm", className)}>{children}</table>
    </div>
  );
}
export function THead({ children }: { children: React.ReactNode }) {
  return <thead className="text-2xs uppercase tracking-wide text-[var(--color-secondary)]">{children}</thead>;
}
export function TH({ className, children }: { className?: string; children?: React.ReactNode }) {
  return <th className={cn("text-left font-medium px-4 py-2.5", className)}>{children}</th>;
}
export function TBody({ children }: { children: React.ReactNode }) {
  return <tbody className="divide-y divide-[var(--color-border)]">{children}</tbody>;
}
export function TR({ className, children }: { className?: string; children: React.ReactNode }) {
  return <tr className={cn("hover:bg-white/[0.02]", className)}>{children}</tr>;
}
export function TD({ className, children, colSpan }: { className?: string; children?: React.ReactNode; colSpan?: number }) {
  return (
    <td colSpan={colSpan} className={cn("px-4 py-3 align-middle", className)}>
      {children}
    </td>
  );
}
