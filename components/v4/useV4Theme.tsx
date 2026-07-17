"use client";

import { useEffect, useState } from "react";

const BODY_BG: Record<"dark" | "light", string> = {
  dark: "#0a0b0d",
  light: "#f4f2ec",
};

/**
 * Shared theme state for every /v4-preview page. Also syncs <body>'s
 * background while the route is mounted, since only each page's wrapper div
 * is scoped to the V4 tokens (not <body> itself) - without this, the shared
 * V3 body background shows through on rubber-band/overscroll.
 */
export function useV4Theme() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const prev = document.body.style.background;
    document.body.style.background = BODY_BG[theme];
    return () => {
      document.body.style.background = prev;
    };
  }, [theme]);

  return { theme, toggleTheme: () => setTheme((t) => (t === "dark" ? "light" : "dark")) };
}
