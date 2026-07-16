import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { PageHeader, Card, Badge, Avatar, Table, THead, TH, TBody, TR, TD } from "@/components/ui";
import { UserRowActions } from "@/components/admin/UserRowActions";
import { formatDateTime } from "@/lib/utils";

export const metadata = { title: "Users & Access" };

export default async function AdminUsersPage() {
  const admin = await getCurrentUser();
  if (!admin) redirect("/login");
  if (admin.role !== "ADMIN") redirect("/dashboard");

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, email: true, role: true, status: true, createdAt: true },
  });

  const pendingCount = users.filter((u) => u.status === "PENDING").length;

  return (
    <div>
      <PageHeader
        eyebrow="Admin"
        title="Users & Access"
        subtitle={
          pendingCount > 0
            ? `${pendingCount} account${pendingCount === 1 ? "" : "s"} waiting on your approval.`
            : "Grant, revoke, approve, and suspend access for every account."
        }
      />
      <div className="px-5 md:px-8 pb-10">
        <Card className="p-0 overflow-hidden">
          <Table>
            <THead>
              <TR>
                <TH>User</TH>
                <TH>Status</TH>
                <TH>Joined</TH>
                <TH className="text-right">Role &amp; access</TH>
              </TR>
            </THead>
            <TBody>
              {users.map((u) => (
                <TR key={u.id}>
                  <TD>
                    <div className="flex items-center gap-3">
                      <Avatar name={u.name} size={30} />
                      <div>
                        <p className="font-medium">{u.name}</p>
                        <p className="text-xs text-[var(--color-secondary)]">{u.email}</p>
                      </div>
                    </div>
                  </TD>
                  <TD>
                    <Badge color={u.status === "ACTIVE" ? "green" : u.status === "PENDING" ? "orange" : "red"}>
                      {u.status.toLowerCase()}
                    </Badge>
                  </TD>
                  <TD className="text-xs text-[var(--color-secondary)]">{formatDateTime(u.createdAt)}</TD>
                  <TD>
                    <UserRowActions
                      userId={u.id}
                      role={u.role as "REP" | "MANAGER" | "ADMIN"}
                      status={u.status as "PENDING" | "ACTIVE" | "SUSPENDED"}
                      isSelf={u.id === admin.id}
                    />
                  </TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </Card>
      </div>
    </div>
  );
}
