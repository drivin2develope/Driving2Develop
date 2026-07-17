import { ShieldCheck, Lock, Server, Eye, KeyRound, FileText } from "lucide-react";
import { PageHero, Section, FeatureGrid } from "@/components/marketing/sections";

export const metadata = { title: "Security & Trust" };

export default function SecurityPage() {
  return (
    <>
      <PageHero eyebrow="Trust center" title="Your reps' voices stay your reps'." subtitle="How Driven2Develop handles data, access and privacy — in plain language." />
      <Section className="pb-16">
        <FeatureGrid items={[
          { icon: Lock, title: "Encrypted in transit", body: "All traffic is served over HTTPS/TLS. Session tokens are signed JWTs stored in httpOnly, sameSite cookies." },
          { icon: KeyRound, title: "Hashed credentials", body: "Passwords are hashed with bcrypt. We never store or log plaintext passwords." },
          { icon: Eye, title: "Opt-in transcription", body: "Uploaded recordings are only sent for transcription if your operator explicitly configures a key. Otherwise they never leave acoustic analysis." },
          { icon: Server, title: "Your database", body: "Self-host on your own Postgres. You own the data and the retention policy." },
          { icon: ShieldCheck, title: "Role-based access", body: "Managers can only see the reps on their own team; reps only see their own sessions. Enforced server-side." },
          { icon: FileText, title: "Consent on upload", body: "Every upload requires an explicit authorization checkbox before a file is processed." },
        ]} />
      </Section>
    </>
  );
}
