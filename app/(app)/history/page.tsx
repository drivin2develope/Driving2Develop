import { getCurrentUser } from "@/lib/auth";
import { PageHeader } from "@/components/ui";
import { HistoryTable } from "@/components/HistoryTable";
import { prisma } from "@/lib/db";
export const metadata = { title: "History" };
export default async function HistoryPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  const sessions = await prisma.practiceSession.findMany({ where: { userId: user.id }, include: { metric: true, scenario: true }, orderBy: { createdAt: "desc" } });
  return (
    <div>
      <PageHeader eyebrow="History" title="Session history" subtitle="Every session you've practiced or uploaded." />
      <HistoryTable sessions={JSON.parse(JSON.stringify(sessions))} />
    </div>
  );
}
