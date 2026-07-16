import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { PageHeader, EmptyState, ButtonLink } from "@/components/ui";
import { CoachChat, type Suggestion } from "@/components/CoachChat";
import { buildSkillTree } from "@/lib/derive";
import { TIP_DICTIONARY } from "@/lib/analysis";
import { MessageSquare } from "lucide-react";

export const metadata = { title: "AI Coach" };

export default async function CoachPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  const sessions = await prisma.practiceSession.findMany({ where: { userId: user.id }, include: { metric: true }, orderBy: { createdAt: "desc" } });

  if (sessions.length === 0) {
    return (
      <div>
        <PageHeader eyebrow="Coaching" title="Your AI Coach" />
        <div className="px-5 md:px-8">
          <EmptyState icon={<MessageSquare size={22} />} title="No sessions to coach yet"
            description="Run a practice session and your coach will build advice from your real lowest metrics."
            action={<ButtonLink href="/practice">Start practicing</ButtonLink>} />
        </div>
      </div>
    );
  }

  const branches = buildSkillTree(sessions as any);
  const nodes = branches.flatMap((b) => b.nodes).sort((a, b) => a.value - b.value);
  const weakest = nodes.slice(0, 3);
  const best = nodes[nodes.length - 1];
  const TIP_KEY: Record<string, string> = { clarity: "clarity", pacing: "pacing", vocal: "monotoneScore", adherence: "keywordAdherence", closing: "closingStrength", objection: "objectionHandled", confidence: "confidence" };

  const suggestions: Suggestion[] = [
    { id: "weakest", label: "What should I work on first?", answer: [`Your lowest area right now is ${weakest[0].label} at ${weakest[0].value}/100.`, TIP_DICTIONARY[TIP_KEY[weakest[0].key]] ?? weakest[0].blurb, "Pick a scenario that stresses this and run it twice back-to-back."] },
    { id: "second", label: `Help with ${weakest[1].label.toLowerCase()}`, answer: [`${weakest[1].label} is sitting at ${weakest[1].value}/100.`, TIP_DICTIONARY[TIP_KEY[weakest[1].key]] ?? weakest[1].blurb] },
    { id: "third", label: `Help with ${weakest[2].label.toLowerCase()}`, answer: [`${weakest[2].label} is at ${weakest[2].value}/100.`, TIP_DICTIONARY[TIP_KEY[weakest[2].key]] ?? weakest[2].blurb] },
    { id: "strength", label: "What am I doing well?", answer: [`Your strongest area is ${best.label} at ${best.value}/100 — lean on it.`, "Use that strength to buy room to work on the weaker parts of the pitch."] },
    { id: "drill", label: "Give me a drill for today", answer: [`Run a Realistic-difficulty scenario and focus only on ${weakest[0].label.toLowerCase()}.`, "One variable at a time builds the habit faster."] },
    { id: "objection", label: "How do I handle a hard objection?", answer: ["Acknowledge first, always: \"Totally fair\" or \"I hear you\" before anything else.", "Then reframe with a bridge word — 'here's the thing…' — and end on a question, not a statement."] },
  ];

  return (
    <div>
      <PageHeader eyebrow="Coaching" title="Your AI Coach" subtitle="Rule-based coaching built from your real lowest metrics — tap a question to dig in." />
      <div className="px-5 md:px-8 pb-10">
        <CoachChat persona="coach" intro={`Hey ${user.name.split(" ")[0]} — I looked at your last ${sessions.length} sessions. Your biggest opportunity is ${weakest[0].label.toLowerCase()} (${weakest[0].value}/100). Want to dig in?`} suggestions={suggestions} />
      </div>
    </div>
  );
}
