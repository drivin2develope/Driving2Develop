"use client";

import { useEffect } from "react";
import "../../../../v4-preview.css";
import { findVersion } from "@/lib/museum/registry";
import { componentMap } from "@/components/museum/MuseumRenderer";
import { MuseumErrorBoundary } from "@/components/museum/MuseumErrorBoundary";

/**
 * Reports this frame's scroll position to the parent window (the compare
 * page) via postMessage, and applies incoming scroll-to commands from the
 * parent, so compare mode's synced-scroll can drive both frames together.
 * No-ops harmlessly when not embedded in an iframe.
 */
function useSyncedScroll() {
  useEffect(() => {
    if (window === window.parent) return;
    let applyingRemote = false;
    let ticking = false;

    function onScroll() {
      if (applyingRemote || ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        window.parent.postMessage({ type: "museum-scroll", y: window.scrollY }, "*");
        ticking = false;
      });
    }
    function onMessage(e: MessageEvent) {
      if (e.data?.type === "museum-scroll-to") {
        applyingRemote = true;
        window.scrollTo(0, e.data.y);
        requestAnimationFrame(() => {
          applyingRemote = false;
        });
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("message", onMessage);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("message", onMessage);
    };
  }, []);
}

/**
 * Isolated full-page render target for a single museum version - meant to
 * be embedded in an iframe from /design-museum, so each historical
 * version gets its own document/CSS context and can never leak style or
 * behavior into another version.
 */
export default function MuseumRenderPage({ params }: { params: { category: string; version: string } }) {
  useSyncedScroll();
  const version = findVersion(params.category, params.version);
  const render = version?.componentKey ? componentMap[version.componentKey] : null;

  if (!version || !render) {
    return (
      <div className="v4-scope min-h-screen flex items-center justify-center p-10 text-center" data-v4-theme="dark">
        <p className="text-sm" style={{ color: "var(--v4-text-secondary)" }}>
          {version ? "This version has no renderable implementation (unrecoverable)." : "Version not found."}
        </p>
      </div>
    );
  }

  return (
    <div className="v4-scope font-sans min-h-screen" data-v4-theme="dark" style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
      <MuseumErrorBoundary label={version.label}>{render()}</MuseumErrorBoundary>
    </div>
  );
}
