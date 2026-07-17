"use client";

import { Suspense, useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthShell } from "@/components/AuthShell";
import { TextField, Button, useToast } from "@/components/ui";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Something went wrong."); return; }
      toast({ kind: "success", title: "Welcome back" });
      router.push(params.get("next") || "/dashboard");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <TextField label="Email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" autoComplete="email" />
      <div>
        <TextField label="Password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" autoComplete="current-password" />
        <div className="text-right mt-1.5"><Link href="/forgot-password" className="text-xs text-[var(--color-secondary)] hover:text-[var(--color-gold-text)]">Forgot password?</Link></div>
      </div>
      {error && <p className="text-sm text-[var(--color-red)]" role="alert">{error}</p>}
      <Button type="submit" loading={loading} className="w-full">{loading ? "Signing in…" : "Sign in"}</Button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <AuthShell title="Welcome back" subtitle="Sign in to keep drilling."
      footer={<>Don&apos;t have an account? <Link href="/signup" className="text-[var(--color-gold-text)] font-medium">Start training</Link></>}>
      <Suspense fallback={<div className="h-52" />}>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}
