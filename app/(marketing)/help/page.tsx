import Link from "next/link";
import { Mic, Upload, BarChart3, Users, Settings, ShieldQuestion, ArrowRight } from "lucide-react";
import { PageHero, Section } from "@/components/marketing/sections";
import { FadeIn } from "@/components/ui";

export const metadata = { title: "Help Center" };

const TOPICS = [
  { icon: Mic, title: "Getting started", body: "Set up your mic, run your first roleplay, and read your scorecard." },
  { icon: Upload, title: "Uploads", body: "What's analyzed from a recording and when a transcript is available." },
  { icon: BarChart3, title: "Understanding scores", body: "What each metric measures and how the overall score is weighted." },
  { icon: Users, title: "For managers", body: "Build your team, assign drills, and read the analytics." },
  { icon: Settings, title: "Account & settings", body: "Profile, microphone selection, notifications and privacy." },
  { icon: ShieldQuestion, title: "Troubleshooting", body: "Mic permissions, unsupported browsers, and common fixes." },
];

export default function HelpPage() {
  return (
    <>
      <PageHero eyebrow="Help center" title="How can we help?" subtitle="Guides for reps and managers. Can't find it? Reach out from the contact page." secondaryCta={{ href: "/contact", label: "Contact support" }} />
      <Section className="pb-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TOPICS.map((t) => (
            <FadeIn key={t.title} className="card p-6 flex flex-col">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[rgba(227,179,65,0.1)] text-[var(--color-gold)]"><t.icon size={20} /></div>
              <h3 className="font-medium mt-4">{t.title}</h3>
              <p className="text-sm text-[var(--color-secondary)] mt-1.5 flex-1">{t.body}</p>
              <Link href="/contact" className="text-sm text-[var(--color-gold)] mt-4 inline-flex items-center gap-1">Read more <ArrowRight size={14} /></Link>
            </FadeIn>
          ))}
        </div>
      </Section>
    </>
  );
}
