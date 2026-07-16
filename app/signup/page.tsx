"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthShell } from "@/components/AuthShell";
import { TextField, Button, useToast } from "@/components/ui";

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }
      toast({ kind: "success", title: "Account created", description: "Let's set up your training." });
      router.push("/onboarding/role");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title="Start training free"
      subtitle="No credit card. Set up your mic and go."
      footer={<>Already have an account? <Link href="/login" className="text-[var(--color-gold)] font-medium">Sign in</Link></>}
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <TextField label="Full name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Jordan Casey" autoComplete="name" />
        <TextField label="Email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" autoComplete="email" />
        <TextField label="Password" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" autoComplete="new-password" hint="Use 6 or more characters." />
        {error && <p className="text-sm text-[var(--color-red)]" role="alert">{error}</p>}
        <Button type="submit" loading={loading} className="w-full">{loading ? "Creating account…" : "Create account"}</Button>
      </form>
    </AuthShell>
  );
}
