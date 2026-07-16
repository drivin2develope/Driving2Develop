"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { AuthShell } from "@/components/AuthShell";
import { TextField, Button } from "@/components/ui";
import { MailCheck } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) return setError("Enter a valid email.");
    setError(null);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 600);
  }

  return (
    <AuthShell
      title={sent ? "Check your inbox" : "Reset your password"}
      subtitle={sent ? undefined : "We'll send you a link to set a new password."}
      footer={<><Link href="/login" className="text-[var(--color-gold)] font-medium">Back to sign in</Link></>}
    >
      {sent ? (
        <div className="text-center py-2">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[rgba(52,211,153,0.12)] text-[var(--color-green)]">
            <MailCheck size={22} />
          </div>
          <p className="text-sm text-[var(--color-secondary)]">
            If an account exists for <span className="text-[var(--color-primary)]">{email}</span>, a reset link is on its way.
          </p>
          <Link href="/reset-password" className="text-xs text-[var(--color-disabled)] mt-4 inline-block">(Demo: open the reset screen)</Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <TextField label="Email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" error={error} autoComplete="email" />
          <Button type="submit" loading={loading} className="w-full">{loading ? "Sending…" : "Send reset link"}</Button>
        </form>
      )}
    </AuthShell>
  );
}
