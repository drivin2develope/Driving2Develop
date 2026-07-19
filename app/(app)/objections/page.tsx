import Link from "next/link";
import { prisma } from "@/lib/db";
import { PageHeader, Card, Badge, Stagger, StaggerItem } from "@/components/ui";
import { ShieldQuestion, ArrowRight } from "lucide-react";

export const metadata = { title: "Objection Library" };
const DIFF: Record<string, "green" | "orange" | "red"> = { EASY: "green", REALISTIC: "orange", HARD: "red" };

export default async function ObjectionsPage() {
  const objections = await prisma.objection.findMany({ orderBy: { order: "asc" } });
  const categories = Array.from(new Set(objections.map((o) => o.category)));

  return (
    <div>
      <PageHeader eyebrow="Playbook" title="Objection library" subtitle="Common door-to-door objections and the recommended way to handle each." />
      <div className="px-5 md:px-8 pb-10 space-y-8">
        {categories.map((cat) => (
          <div key={cat}>
            <h2 className="text-sm font-medium text-[var(--color-secondary)] mb-3">{cat}</h2>
            <Stagger className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {objections.filter((o) => o.category === cat).map((o) => (
                <StaggerItem key={o.id}>
                  <Link href={`/objections/${o.slug}`} className="block h-full">
                    <Card className="h-full flex flex-col hover:border-[var(--color-border-strong)] transition-colors">
                      <div className="flex items-start justify-between gap-2">
                        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[rgba(227,179,65,0.1)] text-[var(--color-gold)] shrink-0"><ShieldQuestion size={17} /></span>
                        <Badge color={DIFF[o.difficulty]}>{o.difficulty}</Badge>
                      </div>
                      <h3 className="font-medium text-sm mt-3">{o.title}</h3>
                      <p className="text-xs text-[var(--color-secondary)] mt-1.5 line-clamp-2 flex-1">{o.summary}</p>
                      <span className="text-xs text-[var(--color-gold)] mt-3 inline-flex items-center gap-1">See the play <ArrowRight size={13} /></span>
                    </Card>
                  </Link>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        ))}
      </div>
    </div>
  );
}
