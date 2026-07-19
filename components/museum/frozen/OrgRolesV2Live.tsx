"use client";

/**
 * Museum render target for "Org Roles V2 - current". Not a historical
 * snapshot - this reproduces the CURRENT section exactly as it renders in
 * app/v4-preview/page.tsx (which doesn't expose it as an importable
 * component), so the museum can show it in isolation for comparison
 * against OrgRolesV1. Keep in sync with app/v4-preview/page.tsx's
 * AUDIENCES section if that section changes.
 */
import { Mic, Users, ShieldCheck, ArrowRight } from "lucide-react";
import { V4Reveal } from "@/components/v4/ui/V4Reveal";

const AUDIENCES = [
  { icon: Mic, title: "For reps", body: "Build muscle memory on your intro, objection handling, and close before it counts.", href: "/for-reps" },
  { icon: Users, title: "For managers", body: "See who needs attention, assign targeted drills, and aggregate team weaknesses.", href: "/for-managers" },
  { icon: ShieldCheck, title: "For organizations", body: "Scale onboarding without burning your best closer's time on 1:1 ride-alongs.", href: "/for-companies" },
];

export function OrgRolesV2Live() {
  return (
    <section className="border-t" style={{ borderColor: "var(--v4-border)" }}>
      <div className="max-w-[1600px] mx-auto px-6 md:px-10 py-16 md:py-20">
        <p className="v4-eyebrow mb-3">Built for the whole organization</p>
        <h2 className="text-2xl md:text-[1.75rem] font-semibold tracking-tight mb-10 max-w-lg">
          Every role sees a different layer of the same system.
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {AUDIENCES.map((a, i) => (
            <V4Reveal key={a.title} index={i}>
              <div className="v4-diagram-node p-6 h-full flex flex-col transition-colors hover:border-[var(--v4-gold-b)]">
                <a.icon size={20} style={{ color: "var(--v4-gold-b)" }} />
                <h3 className="font-medium mt-4">{a.title}</h3>
                <p className="text-sm mt-1.5 flex-1" style={{ color: "var(--v4-text-secondary)" }}>
                  {a.body}
                </p>
                <a
                  href={a.href}
                  aria-label={`Learn more: ${a.title}`}
                  className="text-sm mt-4 inline-flex items-center gap-1"
                  style={{ color: "var(--v4-gold-b)" }}
                >
                  Learn more <ArrowRight size={14} />
                </a>
              </div>
            </V4Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
