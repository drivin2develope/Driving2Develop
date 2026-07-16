"use client";
import { Card, CardHeader } from "@/components/ui";
import { useTheme, type ThemePreference } from "@/components/ThemeProvider";
import { Sun, Moon, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";

const OPTIONS: { value: ThemePreference; label: string; icon: typeof Sun }[] = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
];

export function AppearanceForm() {
  const { preference, setPreference } = useTheme();

  return (
    <Card>
      <CardHeader
        title="Appearance"
        subtitle="Light is the default. Practice sessions always use a focused, dimmer screen regardless of this setting."
      />
      <div role="radiogroup" aria-label="Theme" className="grid grid-cols-3 gap-2">
        {OPTIONS.map((opt) => {
          const Icon = opt.icon;
          const active = preference === opt.value;
          return (
            <button
              key={opt.value}
              role="radio"
              aria-checked={active}
              onClick={() => setPreference(opt.value)}
              className={cn(
                "flex flex-col items-center gap-2 rounded-lg border py-4 text-sm transition-colors",
                active
                  ? "border-[var(--color-gold)] text-[var(--color-gold-text)] bg-[rgba(227,179,65,0.08)] font-medium"
                  : "border-[var(--color-border)] text-[var(--color-secondary)] hover:bg-[var(--color-border)]"
              )}
            >
              <Icon size={18} />
              {opt.label}
            </button>
          );
        })}
      </div>
    </Card>
  );
}
