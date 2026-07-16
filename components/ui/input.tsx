"use client";

import { forwardRef, useId } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function Label({ className, children, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label className={cn("block text-xs font-medium text-[var(--color-secondary)] mb-1.5", className)} {...props}>
      {children}
    </label>
  );
}

export function Field({
  label,
  error,
  hint,
  htmlFor,
  children,
  className,
}: {
  label?: string;
  error?: string | null;
  hint?: string;
  htmlFor?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      {label && <Label htmlFor={htmlFor}>{label}</Label>}
      {children}
      {error ? (
        <p className="text-xs text-[var(--color-red)]" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="text-xs text-[var(--color-disabled)]">{hint}</p>
      ) : null}
    </div>
  );
}

export const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement> & { error?: boolean }>(
  function Input({ className, error, ...props }, ref) {
    return <input ref={ref} className={cn("input-field", className)} aria-invalid={error || undefined} {...props} />;
  }
);

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: boolean }
>(function Textarea({ className, error, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      className={cn("input-field min-h-[92px] resize-y", className)}
      aria-invalid={error || undefined}
      {...props}
    />
  );
});

export const Select = forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement> & { error?: boolean }
>(function Select({ className, error, children, ...props }, ref) {
  return (
    <div className="relative">
      <select
        ref={ref}
        className={cn("input-field appearance-none pr-9 cursor-pointer", className)}
        aria-invalid={error || undefined}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        size={15}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-secondary)] pointer-events-none"
        aria-hidden="true"
      />
    </div>
  );
});

/** Convenience labeled text input with a generated id. */
export function TextField({
  label,
  error,
  hint,
  ...props
}: { label: string; error?: string | null; hint?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  const id = useId();
  return (
    <Field label={label} error={error} hint={hint} htmlFor={id}>
      <Input id={id} error={!!error} {...props} />
    </Field>
  );
}
