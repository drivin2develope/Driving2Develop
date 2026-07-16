"use client";

import { useState, FormEvent } from "react";
import { TextField, Field, Textarea, Select, Button, useToast } from "@/components/ui";

export function ContactForm() {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({});

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const message = String(data.get("message") || "").trim();
    const next: typeof errors = {};
    if (!name) next.name = "Please enter your name.";
    if (!email.includes("@")) next.email = "Enter a valid email.";
    if (message.length < 10) next.message = "Tell us a little more (10+ characters).";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSubmitting(true);
    // Demo build: no external mail provider — simulate a send.
    setTimeout(() => {
      setSubmitting(false);
      (e.target as HTMLFormElement).reset();
      toast({ kind: "success", title: "Message sent", description: "Thanks — we'll get back to you within one business day." });
    }, 700);
  }

  return (
    <form onSubmit={handleSubmit} className="card p-6 space-y-4" noValidate>
      <TextField label="Name" name="name" placeholder="Jordan Casey" error={errors.name} />
      <TextField label="Work email" name="email" type="email" placeholder="you@company.com" error={errors.email} />
      <Field label="I'm a…">
        <Select name="role" defaultValue="rep">
          <option value="rep">Rep</option>
          <option value="manager">Manager</option>
          <option value="company">Company / buyer</option>
        </Select>
      </Field>
      <Field label="Message" error={errors.message}>
        <Textarea name="message" placeholder="How can we help?" error={!!errors.message} />
      </Field>
      <Button type="submit" loading={submitting} className="w-full">
        {submitting ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}
