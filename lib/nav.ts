import {
  LayoutDashboard,
  Mic,
  Upload,
  History,
  BookOpen,
  Trophy,
  Sparkles,
  MessageSquare,
  ShieldQuestion,
  Bell,
  Award,
  Users,
  ClipboardList,
  BarChart3,
  BookMarked,
  Bot,
  Flag,
  Settings,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

export type NavItem = { href: string; label: string; icon: LucideIcon };
export type NavGroup = { heading: string; items: NavItem[]; managerOnly?: boolean };

export const REP_GROUPS: NavGroup[] = [
  {
    heading: "Train",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/practice", label: "Practice", icon: Mic },
      { href: "/upload", label: "Upload", icon: Upload },
      { href: "/scenarios", label: "Scenarios", icon: BookOpen },
    ],
  },
  {
    heading: "Improve",
    items: [
      { href: "/history", label: "History", icon: History },
      { href: "/skills", label: "Skills", icon: Sparkles },
      { href: "/achievements", label: "Achievements", icon: Award },
      { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
    ],
  },
  {
    heading: "Coaching",
    items: [
      { href: "/coach", label: "AI Coach", icon: MessageSquare },
      { href: "/objections", label: "Objection Library", icon: ShieldQuestion },
      { href: "/notifications", label: "Notifications", icon: Bell },
    ],
  },
];

export const MANAGER_GROUP: NavGroup = {
  heading: "Manage",
  managerOnly: true,
  items: [
    { href: "/manager", label: "Overview", icon: LayoutDashboard },
    { href: "/manager/team", label: "Team", icon: Users },
    { href: "/manager/assignments", label: "Assignments", icon: ClipboardList },
    { href: "/manager/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/manager/compliance", label: "Compliance", icon: Flag },
    { href: "/manager/playbook", label: "Playbook", icon: BookMarked },
    { href: "/manager/copilot", label: "Copilot", icon: Bot },
  ],
};

export const SETTINGS_GROUP: NavGroup = {
  heading: "Account",
  items: [
    { href: "/settings/profile", label: "Profile", icon: Settings },
    { href: "/settings/microphone", label: "Microphone", icon: Mic },
    { href: "/settings/notifications", label: "Notifications", icon: Bell },
    { href: "/settings/privacy", label: "Privacy", icon: ShieldQuestion },
  ],
};

export const ADMIN_GROUP: NavGroup = {
  heading: "Admin",
  items: [{ href: "/admin/users", label: "Users & Access", icon: ShieldCheck }],
};

export function navGroupsFor(role: "REP" | "MANAGER" | "ADMIN"): NavGroup[] {
  if (role === "ADMIN") return [ADMIN_GROUP, SETTINGS_GROUP];
  const groups = [...REP_GROUPS];
  if (role === "MANAGER") groups.push(MANAGER_GROUP);
  groups.push(SETTINGS_GROUP);
  return groups;
}
