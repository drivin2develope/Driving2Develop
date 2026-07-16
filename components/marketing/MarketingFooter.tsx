import Link from "next/link";
import { Logo } from "@/components/Logo";

const COLUMNS: { heading: string; links: { href: string; label: string }[] }[] = [
  {
    heading: "Product",
    links: [
      { href: "/product", label: "Overview" },
      { href: "/how-it-works", label: "How it works" },
      { href: "/pricing", label: "Pricing" },
      { href: "/for-reps", label: "For reps" },
      { href: "/for-managers", label: "For managers" },
      { href: "/for-companies", label: "For companies" },
    ],
  },
  {
    heading: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/customers", label: "Customers" },
      { href: "/contact", label: "Contact" },
      { href: "/help", label: "Help center" },
    ],
  },
  {
    heading: "Trust",
    links: [
      { href: "/security", label: "Security" },
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
    ],
  },
];

export function MarketingFooter() {
  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="max-w-6xl mx-auto px-5 md:px-8 py-14 grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div>
          <Logo />
          <p className="text-sm text-[var(--color-secondary)] mt-4 max-w-xs">
            Practice the conversation before the door opens. Real scorecards, real coaching, no paid AI required.
          </p>
        </div>
        {COLUMNS.map((col) => (
          <div key={col.heading}>
            <h3 className="text-2xs font-semibold uppercase tracking-widest text-[var(--color-disabled)] mb-3">{col.heading}</h3>
            <ul className="space-y-2.5">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-[var(--color-secondary)] hover:text-[var(--color-primary)] transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-[var(--color-border)]">
        <div className="max-w-6xl mx-auto px-5 md:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[var(--color-secondary)]">
          <span>© {new Date().getFullYear()} Driven2Develop. All rights reserved.</span>
          <span>Built for door-to-door teams.</span>
        </div>
      </div>
    </footer>
  );
}
