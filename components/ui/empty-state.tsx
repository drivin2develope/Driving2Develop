import { cn } from "@/lib/utils";
import { Card } from "./card";

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <Card className={cn("flex flex-col items-center text-center py-14 px-6", className)}>
      {icon && (
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[rgba(227,179,65,0.1)] text-[var(--color-gold)]">
          {icon}
        </div>
      )}
      <h3 className="font-medium text-base text-[var(--color-primary)]">{title}</h3>
      <p className="text-sm text-[var(--color-secondary)] mt-1.5 max-w-sm">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </Card>
  );
}
