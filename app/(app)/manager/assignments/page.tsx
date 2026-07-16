import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { PageHeader, Card, Badge, EmptyState, ButtonLink, Avatar } from "@/components/ui";
import { formatDate, relativeTime } from "@/lib/utils";
import { ClipboardList } from "lucide-react";

export const metadata = { title: "Assignments" };

export default async function AssignmentsPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  const assignments = await prisma.assignment.findMany({ where: { managerId: user.id }, include: { rep: true, scenario: true }, orderBy: { createdAt: "desc" } });
  const pending = assignments.filter((a) => a.status === "PENDING");
  const done = assignments.filter((a) => a.status === "DONE");

  return (
    <div>
      <PageHeader eyebrow="Manager" title="Assignments" subtitle={`${pending.length} pending · ${done.length} completed`}
        action={<ButtonLink href="/manager/assignments/new"><ClipboardList size={16} /> New assignment</ButtonLink>} />
      <div className="px-5 md:px-8 pb-10 space-y-6">
        {assignments.length === 0 ? (
          <EmptyState icon={<ClipboardList size={22} />} title="No assignments yet" description="Assign a targeted drill to a rep with a note and a due date."
            action={<ButtonLink href="/manager/assignments/new">Create assignment</ButtonLink>} />
        ) : (
          [{ label: "Pending", rows: pending }, { label: "Completed", rows: done }].filter((g) => g.rows.length).map((group) => (
            <div key={group.label}>
              <h2 className="text-sm font-medium text-[var(--color-secondary)] mb-3">{group.label}</h2>
              <div className="space-y-3">
                {group.rows.map((a) => (
                  <Card key={a.id} className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 min-w-0">
                      <Avatar name={a.rep.name} size={36} />
                      <div className="min-w-0">
                        <p className="text-sm font-medium">{a.rep.name}</p>
                        <p className="text-sm text-[var(--color-secondary)] mt-0.5">{a.note}</p>
                        <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-[var(--color-secondary)]">
                          {a.scenario && <Badge>{a.scenario.title}</Badge>}
                          {a.dueDate && <span>Due {formatDate(a.dueDate)}</span>}
                          <span>· created {relativeTime(a.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                    <Badge color={a.status === "DONE" ? "green" : "gold"}>{a.status}</Badge>
                  </Card>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
