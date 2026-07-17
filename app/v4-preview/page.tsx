"use client";

import { Mic, Users, ShieldCheck, ArrowRight } from "lucide-react";
import "../v4-preview.css";
import { V4Nav } from "@/components/v4/V4Nav";
import { V4Hero } from "@/components/v4/V4Hero";
import { V4CapabilityStrip } from "@/components/v4/V4CapabilityStrip";
import { V4PlatformSection } from "@/components/v4/V4PlatformSection";
import { V4ManagerDashboard } from "@/components/v4/V4ManagerDashboard";
import { V4FinalCTA } from "@/components/v4/V4FinalCTA";
import { useV4Theme } from "@/components/v4/useV4Theme";

const AUDIENCES = [
  { icon: Mic, title: "For reps", body: "Build muscle memory on your intro, objection handling, and close before it counts.", href: "/for-reps" },
  { icon: Users, title: "For managers", body: "See who needs attention, assign targeted drills, and aggregate team weaknesses.", href: "/for-managers" },
  { icon: ShieldCheck, title: "For organizations", body: "Scale onboarding without burning your best closer's time on 1:1 ride-alongs.", href: "/for-companies" },
];

/**
 * V4 platform homepage - isolated route, isolated stylesheet, zero effect on
 * the live V3 app. Builds on the Phase 3 prototype with a capability-breadth
 * strip and audience cross-links, so the homepage itself signals platform
 * scope rather than a single feature.
 */
export default function V4PreviewPage() {
  const { theme, toggleTheme } = useV4Theme();

  return (
    <div className="v4-scope font-sans" data-v4-theme={theme} style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
      <V4Nav theme={theme} onToggleTheme={toggleTheme} />
      <main>
        <V4Hero />
        <V4CapabilityStrip />
        <V4PlatformSection />
        <V4ManagerDashboard />

        <section className="border-t" style={{ borderColor: "var(--v4-border)" }}>
          <div className="max-w-[1600px] mx-auto px-6 md:px-10 py-16 md:py-20">
            <p className="v4-eyebrow mb-3">Built for the whole organization</p>
            <h2 className="text-2xl md:text-[1.75rem] font-semibold tracking-tight mb-10 max-w-lg">
              Every role sees a different layer of the same system.
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {AUDIENCES.map((a) => (
                <div key={a.title} className="v4-diagram-node p-6 flex flex-col">
                  <a.icon size={20} style={{ color: "var(--v4-gold-b)" }} />
                  <h3 className="font-medium mt-4">{a.title}</h3>
                  <p className="text-sm mt-1.5 flex-1" style={{ color: "var(--v4-text-secondary)" }}>
                    {a.body}
                  </p>
                  <a href={a.href} className="text-sm mt-4 inline-flex items-center gap-1" style={{ color: "var(--v4-gold-b)" }}>
                    Learn more <ArrowRight size={14} />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        <V4FinalCTA />
      </main>
    </div>
  );
}
