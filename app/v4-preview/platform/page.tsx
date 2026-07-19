"use client";

import { ArrowUpRight } from "lucide-react";
import "../../v4-preview.css";
import { V4Nav } from "@/components/v4/V4Nav";
import { V4FinalCTA } from "@/components/v4/V4FinalCTA";
import { SectionHeading } from "@/components/v4/ui/SectionHeading";
import { V4Badge } from "@/components/v4/ui/V4Badge";
import { V4StatCard } from "@/components/v4/ui/V4Card";
import { V4Reveal } from "@/components/v4/ui/V4Reveal";
import { PLATFORM_HUB, STATUS_LABEL, countByStatus } from "@/lib/v4/site-map";
import { useV4Theme } from "@/components/v4/useV4Theme";

export default function PlatformOverviewPage() {
  const { theme, toggleTheme } = useV4Theme();
  const counts = countByStatus();
  const total = counts.available + counts.beta + counts.planned + counts.research;

  return (
    <div className="v4-scope font-sans" data-v4-theme={theme} style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
      <V4Nav theme={theme} onToggleTheme={toggleTheme} />
      <main id="main-content">
        <section className="relative overflow-hidden" style={{ background: "var(--v4-bg)" }}>
          <div className="absolute inset-0 v4-grid-bg opacity-[0.25]" aria-hidden="true" />
          <div className="relative max-w-[1600px] mx-auto px-6 md:px-10 pt-20 pb-16 md:pt-28">
            <SectionHeading
              eyebrow="Platform"
              size="h1"
              title="One connected system, from first rehearsal to organizational intelligence."
              subtitle="Every capability below is mapped against what's actually built. Nothing here is fabricated to look further along than it is — a capability is labeled Available now only once it's backed by real, working code."
            />
            <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl">
              {[
                { label: STATUS_LABEL.available, value: counts.available },
                { label: STATUS_LABEL.beta, value: counts.beta },
                { label: STATUS_LABEL.planned, value: counts.planned },
                { label: STATUS_LABEL.research, value: counts.research },
              ].map((s, i) => (
                <V4Reveal key={s.label} index={i}>
                  <V4StatCard label={s.label} value={s.value} />
                </V4Reveal>
              ))}
            </div>
            <p className="mt-4 text-xs" style={{ color: "var(--v4-text-tertiary)" }}>
              {total} capabilities mapped across the platform.
            </p>
          </div>
        </section>

        {PLATFORM_HUB.categories.map((cat) => (
          <section key={cat.heading} className="border-t" style={{ borderColor: "var(--v4-border)" }}>
            <div className="max-w-[1600px] mx-auto px-6 md:px-10 py-16 md:py-20">
              <h2 className="text-xl font-semibold tracking-tight mb-6">{cat.heading}</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {cat.items.map((item, i) => {
                  const Wrapper = item.href ? "a" : "div";
                  return (
                    <V4Reveal key={item.slug} index={i % 6}>
                      <Wrapper
                        {...(item.href ? { href: item.href } : {})}
                        className={`v4-diagram-node p-5 h-full flex flex-col justify-between transition-all ${item.href ? "hover:border-[var(--v4-gold-b)] hover:-translate-y-0.5" : ""}`}
                        style={{ borderStyle: "solid" }}
                      >
                        <div>
                          <div className="flex items-start justify-between gap-3">
                            <p className="text-sm font-medium">{item.label}</p>
                            <V4Badge status={item.status} />
                          </div>
                          <p className="text-xs mt-2" style={{ color: "var(--v4-text-secondary)" }}>
                            {item.blurb}
                          </p>
                        </div>
                        {item.href && (
                          <span
                            className="text-xs font-semibold mt-4 inline-flex items-center gap-1"
                            style={{ color: "var(--v4-gold-b)" }}
                          >
                            View capability <ArrowUpRight size={12} />
                          </span>
                        )}
                      </Wrapper>
                    </V4Reveal>
                  );
                })}
              </div>
            </div>
          </section>
        ))}

        <V4FinalCTA />
      </main>
    </div>
  );
}
