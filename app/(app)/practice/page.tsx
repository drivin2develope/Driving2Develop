import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/ui";
import { ScenarioPicker } from "@/components/ScenarioPicker";
import { parseScenario } from "@/lib/scenario-types";

export const metadata = { title: "Practice" };

export default async function PracticePage() {
  const scenarios = await prisma.scenario.findMany({ where: { isLocked: false }, orderBy: { createdAt: "asc" } });
  return (
    <div>
      <PageHeader eyebrow="Practice" title="Choose your roleplay" subtitle="Pick a homeowner personality and difficulty to start a live, scored roleplay." />
      <ScenarioPicker scenarios={scenarios.map(parseScenario)} />
    </div>
  );
}
