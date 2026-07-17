"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, FileText, Mic, ShieldCheck } from "lucide-react";

const FACTS = [
  { icon: FileText, label: "Every score traces to a real transcript excerpt — never an opaque number." },
  { icon: Mic, label: "Acoustic and transcript analysis, computed from what was actually said." },
  { icon: ShieldCheck, label: "Organization data stays isolated — no cross-company exposure." },
];

export function V4FinalCTA() {
  return (
    <section className="relative overflow-hidden border-t" style={{ borderColor: "var(--v4-border)", background: "var(--v4-bg-inset)" }}>
      <div className="absolute inset-0 v4-grid-bg opacity-[0.25]" aria-hidden="true" />
      <div className="relative max-w-[1600px] mx-auto px-6 md:px-10 py-24 md:py-32 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-3xl md:text-[3rem] leading-[1.05] font-semibold tracking-tight max-w-3xl mx-auto"
        >
          Build the training system your team can <span className="v4-gold-text">actually measure</span>.
        </motion.h2>
        <p className="mt-6 text-base md:text-lg max-w-xl mx-auto" style={{ color: "var(--v4-text-secondary)" }}>
          Start with one team. Scale to the organization once the evidence speaks for itself.
        </p>
        <div className="mt-10">
          <a
            href="#"
            className="v4-gold-fill inline-flex items-center gap-2 rounded-md px-8 py-4 text-sm font-semibold transition-transform hover:scale-[1.02]"
          >
            Request Pilot <ArrowUpRight size={15} />
          </a>
        </div>

        <div
          className="mt-16 pt-10 border-t grid sm:grid-cols-3 gap-8 max-w-4xl mx-auto text-left"
          style={{ borderColor: "var(--v4-border)" }}
        >
          {FACTS.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.label} className="flex gap-3">
                <Icon size={18} className="shrink-0 mt-0.5" style={{ color: "var(--v4-gold-b)" }} />
                <p className="text-sm" style={{ color: "var(--v4-text-secondary)" }}>
                  {f.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
