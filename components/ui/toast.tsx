"use client";

import * as RToast from "@radix-ui/react-toast";
import { createContext, useCallback, useContext, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CheckCircle2, AlertTriangle, Info, X } from "lucide-react";

type ToastKind = "success" | "error" | "info";
type ToastItem = { id: number; title: string; description?: string; kind: ToastKind };

type ToastContextValue = {
  toast: (t: { title: string; description?: string; kind?: ToastKind }) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within <ToastProvider>");
  return ctx;
}

const ICON: Record<ToastKind, React.ReactNode> = {
  success: <CheckCircle2 size={18} className="text-[var(--color-green)]" />,
  error: <AlertTriangle size={18} className="text-[var(--color-red)]" />,
  info: <Info size={18} className="text-[var(--color-blue)]" />,
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const reduce = useReducedMotion();

  const toast = useCallback((t: { title: string; description?: string; kind?: ToastKind }) => {
    setItems((prev) => [...prev, { id: Date.now() + Math.random(), title: t.title, description: t.description, kind: t.kind ?? "info" }]);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      <RToast.Provider swipeDirection="right" duration={4000}>
        {children}
        <AnimatePresence>
          {items.map((item) => (
            <RToast.Root
              key={item.id}
              asChild
              forceMount
              onOpenChange={(open) => {
                if (!open) setItems((prev) => prev.filter((x) => x.id !== item.id));
              }}
            >
              <motion.li
                layout
                initial={reduce ? { opacity: 0 } : { opacity: 0, x: 40, scale: 0.96 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, x: 40, scale: 0.96 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-start gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-elevated2)] p-3.5 shadow-pop"
              >
                <span className="mt-0.5 shrink-0">{ICON[item.kind]}</span>
                <div className="min-w-0 flex-1">
                  <RToast.Title className="text-sm font-medium text-[var(--color-primary)]">{item.title}</RToast.Title>
                  {item.description && (
                    <RToast.Description className="text-xs text-[var(--color-secondary)] mt-0.5">
                      {item.description}
                    </RToast.Description>
                  )}
                </div>
                <RToast.Close className="text-[var(--color-secondary)] hover:text-[var(--color-primary)]" aria-label="Dismiss">
                  <X size={15} />
                </RToast.Close>
              </motion.li>
            </RToast.Root>
          ))}
        </AnimatePresence>
        <RToast.Viewport className="fixed bottom-0 right-0 z-[60] m-4 flex w-[calc(100vw-2rem)] max-w-sm list-none flex-col gap-2.5 outline-none" />
      </RToast.Provider>
    </ToastContext.Provider>
  );
}
