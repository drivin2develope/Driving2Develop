import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { PageHeader, Card, EmptyState } from "@/components/ui";
import { CreateAssignmentForm } from "@/components/CreateAssignmentForm";
import { ArrowLeft } from "lucide-react";

export const metadata = { title: "New assignment" };

export default async function NewAssignmentPage({ searchParams }: { searchParams: { repId?: string } }) {
  const user = await getCurrentUser();
  if (!user) return null;
  const [reps, scenarios] = await Promise.all([
    prisma.user.findMany({ where: { managerId: user.id }, select: { id: true, name: true } }),
    prisma.scenario.findMany({ where: { isLocked: false }, select: { id: true, title: true } }),
  ]);

  return (
    <div>
      <PageHeader eyebrow="Manager" title="New assignment" subtitle="Assign a targeted drill to a rep." />
      <div className="px-5 md:px-8 pb-10 max-w-xl space-y-4">
        <Link href="/manager/assignments" className="inline-flex items-center gap-1.5 text-sm text-[var(--color-secondary)] hover:text-[var(--color-primary)]"><ArrowLeft size={15} /> All assignments</Link>
        {reps.length === 0 ? (
          <EmptyState title="No reps to assign to" description="Reps who choose you as their manager will appear here." />
        ) : (
          <Card><CreateAssignmentForm reps={reps} scenarios={scenarios} initialRepId={searchParams.repId} /></Card>
        )}
      </div>
    </div>
  );
}
