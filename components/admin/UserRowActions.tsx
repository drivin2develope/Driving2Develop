"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast, Select } from "@/components/ui";

type Role = "REP" | "MANAGER" | "ADMIN";
type Status = "PENDING" | "ACTIVE" | "SUSPENDED";

export function UserRowActions({
  userId,
  role,
  status,
  isSelf,
}: {
  userId: string;
  role: Role;
  status: Status;
  isSelf: boolean;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  async function update(body: { role?: Role; status?: Status }) {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        toast({ kind: "error", title: "Couldn't update user", description: data.error });
        return;
      }
      toast({ kind: "success", title: "User updated" });
      router.refresh();
    } catch {
      toast({ kind: "error", title: "Network error" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-2 justify-end">
      <Select
        aria-label="Role"
        value={role}
        disabled={loading || isSelf}
        onChange={(e) => update({ role: e.target.value as Role })}
        className="w-[110px] text-xs py-1.5"
      >
        <option value="REP">Rep</option>
        <option value="MANAGER">Manager</option>
        <option value="ADMIN">Admin</option>
      </Select>

      {status === "PENDING" && (
        <button
          onClick={() => update({ status: "ACTIVE" })}
          disabled={loading}
          className="text-xs px-2.5 py-1.5 rounded-md bg-[rgba(52,211,153,0.14)] text-[var(--color-green)] font-medium disabled:opacity-50 whitespace-nowrap"
        >
          Approve
        </button>
      )}
      {status === "ACTIVE" && !isSelf && (
        <button
          onClick={() => update({ status: "SUSPENDED" })}
          disabled={loading}
          className="text-xs px-2.5 py-1.5 rounded-md bg-[rgba(248,113,113,0.14)] text-[var(--color-red)] font-medium disabled:opacity-50 whitespace-nowrap"
        >
          Suspend
        </button>
      )}
      {status === "SUSPENDED" && (
        <button
          onClick={() => update({ status: "ACTIVE" })}
          disabled={loading}
          className="text-xs px-2.5 py-1.5 rounded-md bg-[rgba(52,211,153,0.14)] text-[var(--color-green)] font-medium disabled:opacity-50 whitespace-nowrap"
        >
          Reactivate
        </button>
      )}
    </div>
  );
}
