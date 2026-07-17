"use client";

import { useEffect, useState } from "react";
import "../v4-preview.css";
import { V4Nav } from "@/components/v4/V4Nav";
import { V4Hero } from "@/components/v4/V4Hero";
import { V4PlatformSection } from "@/components/v4/V4PlatformSection";
import { V4ManagerDashboard } from "@/components/v4/V4ManagerDashboard";
import { V4FinalCTA } from "@/components/v4/V4FinalCTA";

const BODY_BG: Record<"dark" | "light", string> = {
  dark: "#0a0b0d",
  light: "#f4f2ec",
};

/**
 * V4 Phase 3 design prototype - NOT part of the public site. Isolated route,
 * isolated stylesheet (app/v4-preview.css), zero effect on the live V3 app.
 * Proves the "Graphite Precision" visual system on 5 representative screens
 * before it propagates to the other ~40 routes the V4 master prompt specifies.
 */
export default function V4PreviewPage() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  // The shared V3 body background (app/globals.css) shows through on
  // rubber-band/overscroll above this route's own content, since only this
  // page's wrapper div is scoped to the V4 tokens, not <body> itself. Rather
  // than touching the shared stylesheet, set body's background just while
  // this route is mounted, and restore it on unmount.
  useEffect(() => {
    const prev = document.body.style.background;
    document.body.style.background = BODY_BG[theme];
    return () => {
      document.body.style.background = prev;
    };
  }, [theme]);

  return (
    <div className="v4-scope font-sans" data-v4-theme={theme} style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
      <V4Nav theme={theme} onToggleTheme={() => setTheme((t) => (t === "dark" ? "light" : "dark"))} />
      <main>
        <V4Hero />
        <V4PlatformSection />
        <V4ManagerDashboard />
        <V4FinalCTA />
      </main>
    </div>
  );
}
