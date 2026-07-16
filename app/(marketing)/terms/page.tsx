import { LegalPage } from "@/components/marketing/LegalPage";
export const metadata = { title: "Terms of Service" };
export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      updated="July 2026"
      sections={[
        { heading: "Acceptance", body: ["By creating an account or using Driving2Develop you agree to these terms. This is a demonstration product; replace with counsel-reviewed terms before production use."] },
        { heading: "Your account", body: ["You are responsible for activity under your account and for keeping your credentials secure. You must be authorized to use any recording you upload for training."] },
        { heading: "Acceptable use", body: ["Don't upload content you don't have the right to use, attempt to reverse the security of the service, or use it to harass others."] },
        { heading: "Service availability", body: ["Live roleplay depends on browser speech-recognition support (Chrome/Edge). Features are provided as-is for this build without uptime guarantees."] },
        { heading: "Limitation of liability", body: ["To the maximum extent permitted by law, the service is provided without warranties and we are not liable for indirect or consequential damages."] },
        { heading: "Changes", body: ["We may update these terms; continued use after an update constitutes acceptance."] },
      ]}
    />
  );
}
