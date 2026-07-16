"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type ThemePreference = "light" | "dark" | "system";

const STORAGE_KEY = "d2d-theme";

const ThemeContext = createContext<{
  preference: ThemePreference;
  setPreference: (p: ThemePreference) => void;
} | null>(null);

function resolve(preference: ThemePreference): "light" | "dark" {
  if (preference === "system") {
    return typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  return preference;
}

function apply(preference: ThemePreference) {
  document.documentElement.setAttribute("data-theme", resolve(preference));
}

/**
 * Inline, pre-hydration script: reads the stored preference (or system
 * default) and stamps data-theme before first paint, so there's no
 * light-flash-then-dark flicker on load. Safe to render server-side since
 * it never reads app state - only localStorage and matchMedia.
 */
export function ThemeInitScript() {
  // Light is the default for the whole app (Section 4) - "system" is only
  // used once a user explicitly opts into it from Settings > Appearance.
  const script = `(function(){try{var p=localStorage.getItem('${STORAGE_KEY}')||'light';var d=p==='dark'||(p==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.setAttribute('data-theme',d?'dark':'light');}catch(e){}})();`;
  // eslint-disable-next-line react/no-danger
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [preference, setPreferenceState] = useState<ThemePreference>("light");

  useEffect(() => {
    const stored = (localStorage.getItem(STORAGE_KEY) as ThemePreference | null) ?? "light";
    setPreferenceState(stored);
    apply(stored);

    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      const current = (localStorage.getItem(STORAGE_KEY) as ThemePreference | null) ?? "system";
      if (current === "system") apply("system");
    };
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  const setPreference = useCallback((p: ThemePreference) => {
    localStorage.setItem(STORAGE_KEY, p);
    setPreferenceState(p);
    apply(p);
  }, []);

  const value = useMemo(() => ({ preference, setPreference }), [preference, setPreference]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
