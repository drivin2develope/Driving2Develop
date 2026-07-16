export function PageHeader({
  title,
  subtitle,
  action,
  eyebrow,
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
  eyebrow?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 px-5 md:px-8 pt-6 md:pt-8 pb-5">
      <div className="min-w-0">
        {eyebrow && (
          <p className="text-2xs font-semibold uppercase tracking-widest text-[var(--color-gold-text)] mb-1.5">{eyebrow}</p>
        )}
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-[var(--color-primary)]">{title}</h1>
        {subtitle && <p className="text-sm text-[var(--color-secondary)] mt-1.5 max-w-2xl">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
