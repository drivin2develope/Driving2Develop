import { getCurrentUser } from "@/lib/auth";
import { ProfileForm } from "@/components/settings/ProfileForm";
export const metadata = { title: "Profile settings" };
export default async function ProfileSettingsPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  return <ProfileForm user={{ name: user.name, email: user.email, industry: user.industry }} />;
}
