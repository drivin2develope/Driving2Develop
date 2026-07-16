"use client";

import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Bot, User, Info } from "lucide-react";

export type Suggestion = { id: string; label: string; answer: string[] };
type Msg = { role: "coach" | "user"; text: string[] };

export function CoachChat({ intro, suggestions, persona = "coach" }: { intro: string; suggestions: Suggestion[]; persona?: "coach" | "copilot" }) {
  const [messages, setMessages] = useState<Msg[]>([{ role: "coach", text: [intro] }]);
  const [asked, setAsked] = useState<Set<string>>(new Set());
  const reduce = useReducedMotion();
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "end" });
  }, [messages, reduce]);

  function ask(s: Suggestion) {
    setMessages((m) => [...m, { role: "user", text: [s.label] }, { role: "coach", text: s.answer }]);
    setAsked((a) => new Set(a).add(s.id));
  }

  const remaining = suggestions.filter((s) => !asked.has(s.id));

  return (
    <div className="max-w-3xl">
      <div className="card p-5 space-y-4 min-h-[320px]">
        <AnimatePresence initial={false}>
          {messages.map((m, i) => (
            <motion.div key={i} layout
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
              <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${m.role === "coach" ? "bg-[rgba(227,179,65,0.12)] text-[var(--color-gold-text)]" : "bg-[var(--color-border)] text-[var(--color-secondary)]"}`}>
                {m.role === "coach" ? <Bot size={16} /> : <User size={16} />}
              </span>
              <div className={`rounded-xl px-4 py-3 text-sm max-w-[80%] ${m.role === "coach" ? "bg-[var(--color-surface)] border border-[var(--color-border)]" : "bg-[rgba(227,179,65,0.1)] text-[var(--color-primary)]"}`}>
                {m.text.map((line, j) => <p key={j} className={j > 0 ? "mt-2" : ""}>{line}</p>)}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={endRef} />
      </div>

      <div className="mt-4">
        <p className="text-2xs uppercase tracking-widest text-[var(--color-disabled)] mb-2">
          {remaining.length > 0 ? "Ask about" : "That's everything I've got for now"}
        </p>
        <div className="flex flex-wrap gap-2">
          {remaining.map((s) => (
            <button key={s.id} onClick={() => ask(s)}
              className="text-sm px-3.5 py-2 rounded-full border border-[var(--color-border-strong)] text-[var(--color-secondary)] hover:bg-[var(--color-border)] hover:text-[var(--color-primary)] transition-colors">
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-5 flex items-start gap-2 text-xs text-[var(--color-disabled)]">
        <Info size={13} className="mt-0.5 shrink-0" />
        {persona === "coach"
          ? "This is a rule-based coach — responses are pre-written and selected from your real lowest metrics, not an open-ended AI chatbot."
          : "This is a rule-based copilot — answers are pre-written and driven by your real team data, not an open-ended AI chatbot."}
      </p>
    </div>
  );
}
