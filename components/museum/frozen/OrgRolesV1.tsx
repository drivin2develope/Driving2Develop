"use client";

/**
 * FROZEN HISTORICAL SNAPSHOT - Organization Roles section V1
 * Exact recovery of the "Built for the whole organization" section as it
 * existed in commit 8eb300f (extracted from app/v4-preview/page.tsx) -
 * static cards, before V4Reveal stagger animation and hover-lift were
 * added in a602a21.
 */
import { Mic, Users, ShieldCheck, ArrowRight } from "lucide-react";

const AUDIENCES = [
  { icon: Mic, title: "For reps", body: "Build muscle memory on your intro, objection handling, and close before it counts.", href: "/for-reps" },
  { icon: Users, title: "For managers", body: "See who needs attention, assign targeted drills, and aggregate team weaknesses.", href: "/for-managers" },
  { icon: ShieldCheck, title: "For organizations", body: "Scale onboarding without burning your best closer's time on 1:1 ride-alongs.", href: "/for-companies" },
];

export function OrgRolesV1() {
  return (
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
              <a
                href={a.href}
                aria-label={`Learn more: ${a.title}`}
                className="text-sm mt-4 inline-flex items-center gap-1"
                style={{ color: "var(--v4-gold-b)" }}
              >
                Learn more <ArrowRight size={14} />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
