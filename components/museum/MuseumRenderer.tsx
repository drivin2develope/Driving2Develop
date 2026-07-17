"use client";

import { useState } from "react";
import type { ComponentType, ReactNode } from "react";

// Frozen historical snapshots
import { NavV1 } from "./frozen/NavV1";
import { NavV2 } from "./frozen/NavV2";
import { HeroV1 } from "./frozen/HeroV1";
import { OrgRolesV1 } from "./frozen/OrgRolesV1";
import { OrgRolesV2Live } from "./frozen/OrgRolesV2Live";
import { ConversationIntelligenceV1 } from "./frozen/ConversationIntelligenceV1";
import { FinalCTAV1 } from "./frozen/FinalCTAV1";

// Live current components
import { V4Nav } from "@/components/v4/V4Nav";
import { V4Hero } from "@/components/v4/V4Hero";
import { V4CapabilityStrip } from "@/components/v4/V4CapabilityStrip";
import { V4PlatformSection } from "@/components/v4/V4PlatformSection";
import { V4SignalStrip } from "@/components/v4/V4SignalStrip";
import { V4ManagerDashboard } from "@/components/v4/V4ManagerDashboard";
import { V4IntelligenceMap } from "@/components/v4/V4IntelligenceMap";
import { V4PerformanceGraph } from "@/components/v4/V4PerformanceGraph";
import { V4LoopSection } from "@/components/v4/V4LoopSection";
import { V4TransformationSequence } from "@/components/v4/V4TransformationSequence";
import { V4ConversationReplay } from "@/components/v4/V4ConversationReplay";
import { V4FinalCTA } from "@/components/v4/V4FinalCTA";

function NavWithPlaceholder({ NavComponent }: { NavComponent: ComponentType<{ theme: "dark" | "light"; onToggleTheme: () => void }> }) {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  return (
    <>
      <NavComponent theme={theme} onToggleTheme={() => setTheme((t) => (t === "dark" ? "light" : "dark"))} />
      <div className="max-w-[1600px] mx-auto px-6 md:px-10 py-24 text-center">
        <p className="v4-eyebrow mb-3">Museum preview</p>
        <p className="text-sm" style={{ color: "var(--v4-text-secondary)" }}>
          Click &ldquo;Platform&rdquo; above to open the mega menu, or the hamburger icon at narrow widths.
        </p>
      </div>
    </>
  );
}

/** Maps a registry componentKey to its renderable implementation. */
export const componentMap: Record<string, () => ReactNode> = {
  "nav-v1": () => <NavWithPlaceholder NavComponent={NavV1} />,
  "nav-v2": () => <NavWithPlaceholder NavComponent={NavV2} />,
  "live-nav": () => <NavWithPlaceholder NavComponent={V4Nav} />,
  "hero-v1": () => <HeroV1 />,
  "live-hero": () => <V4Hero />,
  "live-platform-strip": () => <V4CapabilityStrip />,
  "orgroles-v1": () => <OrgRolesV1 />,
  "live-orgroles": () => <OrgRolesV2Live />,
  "ci-v1": () => <ConversationIntelligenceV1 />,
  "live-ci": () => <V4PlatformSection />,
  "live-ci-page": () => (
    <>
      <V4SignalStrip />
      <V4PlatformSection />
    </>
  ),
  "live-manager-dashboard": () => <V4ManagerDashboard />,
  "live-intelligence-map": () => <V4IntelligenceMap />,
  "live-performance-graph": () => <V4PerformanceGraph />,
  "live-loop": () => <V4LoopSection />,
  "live-transformation": () => <V4TransformationSequence />,
  "live-replay": () => <V4ConversationReplay />,
  "cta-v1": () => <FinalCTAV1 />,
  "live-final-cta": () => <V4FinalCTA />,
};
