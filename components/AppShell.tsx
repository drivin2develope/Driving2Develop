import { Sidebar } from "@/components/Sidebar";
import { MobileTopBar } from "@/components/MobileNav";
import { MobileTabBar } from "@/components/MobileTabBar";
import { PageTransition } from "@/components/ui";

export function AppShell({
  user,
  children,
}: {
  user: { name: string; email: string; role: "REP" | "MANAGER" | "ADMIN" };
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[var(--color-base)]">
      <Sidebar user={user} />
      <div className="flex-1 min-w-0 flex flex-col">
        <MobileTopBar role={user.role} />
        <main id="main-content" className="flex-1 min-w-0 pb-24 md:pb-10">
          <PageTransition>{children}</PageTransition>
        </main>
      </div>
      <MobileTabBar />
    </div>
  );
}
