"use client";

import {
  Mic,
  Gauge,
  MessageSquareText,
  Users2,
  Trophy,
  ShieldCheck,
  ClipboardList,
  Map,
  ArrowUpRight,
  type LucideIcon,
} from "lucide-react";
import { V4Badge } from "./ui/V4Badge";
import { V4Reveal } from "./ui/V4Reveal";
import { allCapabilities, type CapabilityStatus } from "@/lib/v4/site-map";

const FEATURED: { slug: string; label: string; status: CapabilityStatus; icon: LucideIcon }[] = [
  { slug: "roleplay", label: "AI Roleplay Simulator", status: "available", icon: Mic },
  { slug: "voice-analysis", label: "Voice & Speech Analysis", status: "available", icon: Gauge },
  { slug: "objection-intelligence", label: "Objection Intelligence", status: "available", icon: MessageSquareText },
  { slug: "manager-dashboard", label: "Manager Dashboard", status: "available", icon: Users2 },
  { slug: "compliance", label: "Compliance Monitoring", status: "available", icon: ClipboardList },
  { slug: "leaderboard", label: "Leaderboard & Gamification", status: "available", icon: Trophy },
  { slug: "security", label: "Security & Compliance", status: "beta", icon: ShieldCheck },
  { slug: "territory-intelligence", label: "Territory Intelligence", status: "research", icon: Map },
];

export function V4CapabilityStrip() {
  const all = allCapabilities();

  return (
    <section className="border-t" style={{ borderColor: "var(--v4-border)" }}>
      <div className="max-w-[1600px] mx-auto px-6 md:px-10 py-16 md:py-20">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
          <div>
            <p className="v4-eyebrow mb-3">The platform</p>
            <h2 className="text-2xl md:text-[1.75rem] font-semibold tracking-tight max-w-lg">
              A growing system, not a single feature.
            </h2>
          </div>
          <a href="/v4-preview/platform" className="text-sm font-semibold inline-flex items-center gap-1.5" style={{ color: "var(--v4-gold-b)" }}>
            View full platform map <ArrowUpRight size={14} />
          </a>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURED.map(({ slug, label, status, icon: Icon }, i) => {
            const href = all.find((c) => c.slug === slug)?.href;
            const Wrapper = href ? "a" : "div";
            return (
              <V4Reveal key={slug} index={i % 4}>
                <Wrapper
                  {...(href ? { href } : {})}
                  className={`v4-diagram-node p-5 h-full block transition-all ${href ? "hover:border-[var(--v4-gold-b)] hover:-translate-y-0.5" : ""}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <Icon size={18} style={{ color: "var(--v4-gold-b)" }} />
                    <V4Badge status={status} />
                  </div>
                  <p className="text-sm font-medium mt-3.5">{label}</p>
                </Wrapper>
              </V4Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
