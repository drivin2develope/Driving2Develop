import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/ui";
import { PracticeRecorderLoader } from "@/components/PracticeRecorderLoader";
import { parseScenario } from "@/lib/scenario-types";

export const metadata = { title: "Live Practice" };

export default async function PracticeSessionPage({ searchParams }: { searchParams: { scenarioId?: string } }) {
  if (!searchParams.scenarioId) redirect("/practice");
  const scenario = await prisma.scenario.findUnique({ where: { id: searchParams.scenarioId } });
  if (!scenario || scenario.isLocked) redirect("/practice");
  return (
    <div>
      <PageHeader eyebrow="Live roleplay" title={scenario.title} subtitle={`${scenario.difficulty} · ${scenario.personality} homeowner`} />
      <PracticeRecorderLoader scenario={parseScenario(scenario)} />
    </div>
  );
}
