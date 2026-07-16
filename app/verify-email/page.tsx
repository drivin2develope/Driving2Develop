"use client";

import { useState } from "react";
import Link from "next/link";
import { AuthShell } from "@/components/AuthShell";
import { Button, useToast } from "@/components/ui";
import { MailCheck } from "lucide-react";

export default function VerifyEmailPage() {
  const { toast } = useToast();
  const [resending, setResending] = useState(false);

  function resend() {
    setResending(true);
    setTimeout(() => {
      setResending(false);
      toast({ kind: "success", title: "Verification email sent" });
    }, 600);
  }

  return (
    <AuthShell title="Verify your email" footer={<><Link href="/login" className="text-[var(--color-gold-text)] font-medium">Back to sign in</Link></>}>
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[rgba(227,179,65,0.12)] text-[var(--color-gold-text)]">
          <MailCheck size={22} />
        </div>
        <p className="text-sm text-[var(--color-secondary)]">
          We sent a verification link to your inbox. Click it to activate your account and unlock live practice.
        </p>
        <div className="mt-6 space-y-3">
          <Button variant="secondary" className="w-full" loading={resending} onClick={resend}>
            {resending ? "Sending…" : "Resend email"}
          </Button>
          <Link href="/onboarding/role">
            <Button className="w-full">I&apos;ve verified — continue</Button>
          </Link>
        </div>
      </div>
    </AuthShell>
  );
}
