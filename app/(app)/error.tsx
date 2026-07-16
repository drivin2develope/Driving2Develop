"use client";
import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Card, Button, ButtonLink } from "@/components/ui";

export default function AppError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return (
    <div className="flex items-center justify-center min-h-[60vh] px-5">
      <Card className="max-w-sm text-center py-10">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[rgba(248,113,113,0.12)] text-[var(--color-red)]"><AlertTriangle size={24} /></div>
        <h2 className="font-medium">Something went wrong</h2>
        <p className="text-sm text-[var(--color-secondary)] mt-2">This page hit an unexpected error. Try again, or head back to your dashboard.</p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Button onClick={reset}>Try again</Button>
          <ButtonLink href="/dashboard" variant="secondary">Dashboard</ButtonLink>
        </div>
      </Card>
    </div>
  );
}
