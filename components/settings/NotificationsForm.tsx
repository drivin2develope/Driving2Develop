"use client";
import { useEffect, useState } from "react";
import { Card, CardHeader, useToast } from "@/components/ui";

const TOGGLES = [
  { key: "weeklyDigest", label: "Weekly progress digest", body: "A summary of your scores and streak every Monday." },
  { key: "assignmentAlerts", label: "New assignment alerts", body: "Get notified when your manager assigns a new drill." },
  { key: "scoreDrops", label: "Score drop alerts", body: "Heads up if your overall score trends down week over week." },
  { key: "achievements", label: "Achievement unlocks", body: "Celebrate when you earn a new badge." },
];

export function NotificationsForm() {
  const { toast } = useToast();
  const [toggles, setToggles] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const s = localStorage.getItem("driving2develop_notification_prefs");
      setToggles(s ? JSON.parse(s) : { weeklyDigest: true, assignmentAlerts: true, scoreDrops: false, achievements: true });
    } catch { setToggles({ weeklyDigest: true, assignmentAlerts: true, scoreDrops: false, achievements: true }); }
  }, []);

  function toggle(key: string) {
    setToggles((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      try { localStorage.setItem("driving2develop_notification_prefs", JSON.stringify(next)); } catch {}
      toast({ kind: "success", title: "Preference saved" });
      return next;
    });
  }

  return (
    <Card>
      <CardHeader title="Notifications" subtitle="Saved locally to this browser." />
      <div className="space-y-5">
        {TOGGLES.map((t) => (
          <div key={t.key} className="flex items-center justify-between gap-4">
            <div><p className="text-sm font-medium">{t.label}</p><p className="text-xs text-[var(--color-secondary)] mt-0.5">{t.body}</p></div>
            <button role="switch" aria-checked={!!toggles[t.key]} aria-label={t.label} onClick={() => toggle(t.key)}
              className={`w-11 h-6 rounded-full relative shrink-0 transition-colors ${toggles[t.key] ? "bg-[var(--color-gold)]" : "bg-white/10"}`}>
              <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${toggles[t.key] ? "left-[22px]" : "left-0.5"}`} />
            </button>
          </div>
        ))}
      </div>
    </Card>
  );
}
