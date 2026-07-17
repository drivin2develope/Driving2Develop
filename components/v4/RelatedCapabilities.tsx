import { ArrowUpRight } from "lucide-react";
import { allCapabilities } from "@/lib/v4/site-map";
import { V4Badge } from "./ui/V4Badge";
import { V4Reveal } from "./ui/V4Reveal";

/**
 * Looks capabilities up by slug against the canonical site-map rather than
 * taking labels/status as props, so a cross-link can never drift out of
 * sync with the capability's real status once its page ships.
 */
export function RelatedCapabilities({ slugs }: { slugs: string[] }) {
  const all = allCapabilities();
  const items = slugs.map((slug) => all.find((c) => c.slug === slug)).filter((c): c is NonNullable<typeof c> => !!c);

  if (items.length === 0) return null;

  return (
    <div className="grid sm:grid-cols-3 gap-4">
      {items.map((item, i) => {
        const Wrapper = item.href ? "a" : "div";
        return (
          <V4Reveal key={item.slug} index={i}>
            <Wrapper
              {...(item.href ? { href: item.href } : {})}
              className={`v4-diagram-node p-4 h-full block transition-colors ${item.href ? "hover:border-[var(--v4-gold-b)]" : ""}`}
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-medium">{item.label}</p>
                <V4Badge status={item.status} />
              </div>
              <p className="text-xs mt-1.5" style={{ color: "var(--v4-text-secondary)" }}>
                {item.blurb}
              </p>
              {item.href && (
                <span className="text-xs font-semibold mt-3 inline-flex items-center gap-1" style={{ color: "var(--v4-gold-b)" }}>
                  View <ArrowUpRight size={11} />
                </span>
              )}
            </Wrapper>
          </V4Reveal>
        );
      })}
    </div>
  );
}
