import { cn } from "@/lib/utils";

export function Card({
  className,
  children,
  as: Tag = "div",
  ...rest
}: {
  className?: string;
  children: React.ReactNode;
  as?: any;
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <Tag className={cn("card p-5 shadow-card", className)} {...rest}>
      {children}
    </Tag>
  );
}

export function CardHeader({
  title,
  subtitle,
  action,
  className,
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-start justify-between gap-3 mb-4", className)}>
      <div>
        <h3 className="font-medium text-sm text-[var(--color-primary)]">{title}</h3>
        {subtitle && <p className="text-xs text-[var(--color-secondary)] mt-1">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
