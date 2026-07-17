"use client";

import type { ReactNode } from "react";
import "../../app/v4-preview.css";
import { V4Nav } from "./V4Nav";
import { V4FinalCTA } from "./V4FinalCTA";
import { SectionHeading } from "./ui/SectionHeading";
import { V4Badge } from "./ui/V4Badge";
import { V4FlowDiagram, type FlowNode } from "./ui/V4FlowDiagram";
import { V4DataGrid, type DataInput } from "./ui/V4DataGrid";
import { V4MoatGrid, type MoatItem } from "./ui/V4MoatGrid";
import { RelatedCapabilities } from "./RelatedCapabilities";
import { useV4Theme } from "./useV4Theme";
import type { CapabilityStatus } from "@/lib/v4/site-map";

export interface V4CapabilityPageProps {
  eyebrow: string;
  status?: CapabilityStatus;
  title: ReactNode;
  subtitle: ReactNode;
  /** Optional content in the hero's right-hand column (e.g. a stat/gauge card). */
  heroSide?: ReactNode;
  /** Optional demo rendered inline inside the hero's own padded container (e.g. a contained card + caption). */
  heroInline?: ReactNode;
  /** Optional full-width interactive demo, rendered as its own section right after the hero. */
  heroWide?: ReactNode;
  /** Renders the soft gold glow behind the hero copy. */
  heroGlow?: boolean;
  /** Tailwind bottom-padding class for the hero container. Defaults to "pb-16". */
  heroPaddingBottom?: string;
  flowTitle: string;
  flow: FlowNode[];
  dataTitle: string;
  dataInputs: DataInput[];
  moatTitle: string;
  moat: MoatItem[];
  relatedSlugs: string[];
}

/**
 * Shared structure behind every deep capability page - hero, how-it-works,
 * data-inputs, moat, related capabilities, CTA. Extracted after the same
 * five sections were hand-authored three times (Roleplay, Conversation
 * Intelligence, Manager Dashboard); every new capability page is now a data
 * definition passed to this component, not re-typed markup.
 */
export function V4CapabilityPage({
  eyebrow,
  status = "available",
  title,
  subtitle,
  heroSide,
  heroInline,
  heroWide,
  heroGlow,
  heroPaddingBottom = "pb-16",
  flowTitle,
  flow,
  dataTitle,
  dataInputs,
  moatTitle,
  moat,
  relatedSlugs,
}: V4CapabilityPageProps) {
  const { theme, toggleTheme } = useV4Theme();

  return (
    <div className="v4-scope font-sans" data-v4-theme={theme} style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
      <V4Nav theme={theme} onToggleTheme={toggleTheme} />
      <main id="main-content">
        <section className="relative overflow-hidden" style={{ background: "var(--v4-bg)" }}>
          <div className="absolute inset-0 v4-grid-bg opacity-[0.35]" aria-hidden="true" />
          {heroGlow && (
            <div
              className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full blur-[120px] opacity-20"
              style={{ background: "var(--v4-gold-b)" }}
              aria-hidden="true"
            />
          )}
          <div className={`relative max-w-[1600px] mx-auto px-6 md:px-10 pt-20 md:pt-28 ${heroPaddingBottom}`}>
            <div className={heroSide ? "grid lg:grid-cols-[minmax(0,640px)_260px] gap-10 items-center" : ""}>
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <span className="v4-eyebrow">{eyebrow}</span>
                  <V4Badge status={status} />
                </div>
                <h1 className="text-[2.6rem] leading-[1.05] md:text-[3.2rem] md:leading-[1.03] font-semibold tracking-tight max-w-3xl">
                  {title}
                </h1>
                <p className="mt-6 text-base md:text-lg max-w-xl" style={{ color: "var(--v4-text-secondary)" }}>
                  {subtitle}
                </p>
              </div>
              {heroSide}
            </div>
            {heroInline}
          </div>
        </section>

        {heroWide}

        <section className="py-20 md:py-28 border-t" style={{ borderColor: "var(--v4-border)" }}>
          <div className="max-w-[1600px] mx-auto px-6 md:px-10">
            <SectionHeading eyebrow="How it works" title={flowTitle} />
            <div className="mt-12">
              <V4FlowDiagram nodes={flow} />
            </div>
          </div>
        </section>

        <section className="py-20 md:py-28 border-t" style={{ borderColor: "var(--v4-border)" }}>
          <div className="max-w-[1600px] mx-auto px-6 md:px-10">
            <SectionHeading eyebrow="What it's built on" title={dataTitle} />
            <div className="mt-12">
              <V4DataGrid items={dataInputs} />
            </div>
          </div>
        </section>

        <section className="py-20 md:py-28 border-t" style={{ borderColor: "var(--v4-border)" }}>
          <div className="max-w-[1600px] mx-auto px-6 md:px-10">
            <SectionHeading eyebrow="Why it's hard to copy" title={moatTitle} />
            <div className="mt-12">
              <V4MoatGrid items={moat} />
            </div>
          </div>
        </section>

        <section className="py-20 md:py-28 border-t" style={{ borderColor: "var(--v4-border)" }}>
          <div className="max-w-[1600px] mx-auto px-6 md:px-10">
            <SectionHeading eyebrow="Related capabilities" title="Part of one connected system." />
            <div className="mt-10">
              <RelatedCapabilities slugs={relatedSlugs} />
            </div>
          </div>
        </section>

        <V4FinalCTA />
      </main>
    </div>
  );
}
