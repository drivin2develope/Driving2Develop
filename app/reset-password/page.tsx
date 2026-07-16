"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AuthShell } from "@/components/AuthShell";
import { TextField, Button, useToast } from "@/components/ui";

export default function ResetPasswordPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [pw, setPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (pw.length < 6) return setError("Use at least 6 characters.");
    if (pw !== confirm) return setError("Passwords don't match.");
    setError(null);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({ kind: "success", title: "Password updated", description: "You can now sign in." });
      router.push("/login");
    }, 700);
  }

  return (
    <AuthShell title="Set a new password" subtitle="Choose a strong password you don't use elsewhere.">
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <TextField label="New password" type="password" required value={pw} onChange={(e) => setPw(e.target.value)} placeholder="At least 6 characters" autoComplete="new-password" />
        <TextField label="Confirm password" type="password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Re-enter password" error={error} autoComplete="new-password" />
        <Button type="submit" loading={loading} className="w-full">{loading ? "Updating…" : "Update password"}</Button>
      </form>
    </AuthShell>
  );
}
