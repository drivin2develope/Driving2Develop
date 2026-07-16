import { prisma } from "@/lib/db";
import { PageHeader, Card, CardHeader, Badge, EmptyState } from "@/components/ui";
import { BookMarked } from "lucide-react";

export const metadata = { title: "Playbook" };

export default async function PlaybookPage() {
  const entries = await prisma.playbookEntry.findMany({ orderBy: { order: "asc" } });
  const sections = Array.from(new Set(entries.map((e) => e.section)));

  return (
    <div>
      <PageHeader eyebrow="Manager" title="Company playbook" subtitle="Approved scripts, talk tracks and compliance rules your team practices against." />
      <div className="px-5 md:px-8 pb-10 space-y-8">
        {entries.length === 0 ? (
          <EmptyState icon={<BookMarked size={22} />} title="Playbook is empty" description="Seeded playbook content will appear here." />
        ) : sections.map((section) => (
          <div key={section}>
            <h2 className="text-sm font-medium text-[var(--color-secondary)] mb-3">{section}</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {entries.filter((e) => e.section === section).map((e) => {
                const tags: string[] = JSON.parse(e.tags);
                return (
                  <Card key={e.id} className="flex flex-col">
                    <CardHeader title={e.title} />
                    <p className="text-sm text-[var(--color-secondary)] leading-relaxed flex-1">{e.body}</p>
                    <div className="flex flex-wrap gap-1.5 mt-4">
                      {tags.map((t) => <Badge key={t} color={t.includes("compliance") || t.includes("required") ? "red" : "default"}>{t}</Badge>)}
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
