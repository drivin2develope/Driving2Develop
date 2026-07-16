import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { ProcessingComplete } from "@/components/ProcessingComplete";

export const metadata = { title: "Processing upload" };

export default async function ProcessingPage({ params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const session = await prisma.practiceSession.findUnique({ where: { id: params.id }, include: { metric: true } });
  if (!session || session.userId !== user.id) redirect("/upload");
  const ready = !!session.metric;
  const transcriptUnavailable = session.source === "UPLOAD" && !session.transcript;
  return <ProcessingComplete id={session.id} ready={ready} score={session.metric?.overallScore ?? null} transcriptUnavailable={transcriptUnavailable} />;
}
