"use client";
import { useState, FormEvent } from "react";
import { Card, TextField, Field, Input, Select, Button, Avatar, useToast } from "@/components/ui";

export function ProfileForm({ user }: { user: { name: string; email: string; industry: string | null } }) {
  const { toast } = useToast();
  const [name, setName] = useState(user.name);
  const [industry, setIndustry] = useState(user.industry ?? "solar");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/settings", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, industry }) });
      if (res.ok) toast({ kind: "success", title: "Profile saved" });
      else toast({ kind: "error", title: "Couldn't save", description: "Please try again." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card>
      <div className="flex items-center gap-4 mb-6">
        <Avatar name={name || user.name} size={52} />
        <div><p className="font-medium">{name || user.name}</p><p className="text-sm text-[var(--color-secondary)]">{user.email}</p></div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <Field label="Email" hint="Email can't be changed in this build.">
          <Input value={user.email} disabled className="opacity-60 cursor-not-allowed" />
        </Field>
        <Field label="Industry">
          <Select value={industry} onChange={(e) => setIndustry(e.target.value)}>
            <option value="solar">Solar</option>
          </Select>
        </Field>
        <Button type="submit" loading={saving}>{saving ? "Saving…" : "Save changes"}</Button>
      </form>
    </Card>
  );
}
