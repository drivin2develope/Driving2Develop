import { ArrowUpRight } from "lucide-react";
import { V4Button } from "./V4Button";

/**
 * Early-access capture for planned/research capability pages. Routes to the
 * real /contact page rather than a fabricated signup flow with no backend -
 * no fake "request received" state for something that isn't wired up yet.
 */
export function V4Waitlist({ capability }: { capability: string }) {
  return (
    <div
      className="rounded-xl border p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-5"
      style={{ borderColor: "var(--v4-border-strong)", background: "var(--v4-bg-raised)" }}
    >
      <div>
        <p className="text-sm font-medium">Interested in {capability}?</p>
        <p className="text-xs mt-1" style={{ color: "var(--v4-text-secondary)" }}>
          Tell us what you&apos;d need it to do - it shapes what gets built next.
        </p>
      </div>
      <V4Button variant="secondary" href={`/contact?interest=${encodeURIComponent(capability)}`}>
        Request Early Access <ArrowUpRight size={15} />
      </V4Button>
    </div>
  );
}
