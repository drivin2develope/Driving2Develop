import { PageHeader } from "@/components/ui";
import { SettingsNav } from "@/components/settings/SettingsNav";

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <PageHeader eyebrow="Account" title="Settings" subtitle="Manage your profile, microphone, notifications and privacy." />
      <SettingsNav />
      <div className="px-5 md:px-8 py-6 max-w-2xl">{children}</div>
    </div>
  );
}
