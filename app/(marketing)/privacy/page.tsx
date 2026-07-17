import { LegalPage } from "@/components/marketing/LegalPage";
export const metadata = { title: "Privacy Policy" };
export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="July 2026"
      sections={[
        { heading: "Overview", body: ["This policy explains what Driven2Develop collects, why, and the choices you have. This is a demonstration product; adapt this policy to your jurisdiction and counsel before production use."] },
        { heading: "What we collect", body: ["Account details you provide (name, email, role, industry, experience and goal).", "Practice data you generate: session transcripts from live roleplays, derived metrics, and scores.", "Optional uploaded recordings, which are processed for acoustic metrics and only transcribed if your operator has configured a transcription key."] },
        { heading: "How we use it", body: ["To produce your scorecards, coaching tips and progress trends.", "To let your manager (if you belong to a team) view your scores and assign drills.", "We do not sell your data."] },
        { heading: "Voice & recordings", body: ["Live roleplay transcription happens in your browser via the Web Speech API. Uploaded audio is analyzed for pacing, pauses and energy; a transcript is only generated when an operator-provided key is present, and the UI states this explicitly."] },
        { heading: "Retention & control", body: ["When self-hosted, you control your database and retention. You can request deletion of your account and associated sessions."] },
        { heading: "Contact", body: ["Questions about privacy? Reach us via the contact page."] },
      ]}
    />
  );
}
