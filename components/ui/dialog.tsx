"use client";

import * as RDialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export const Dialog = RDialog.Root;
export const DialogTrigger = RDialog.Trigger;
export const DialogClose = RDialog.Close;

export function DialogContent({
  children,
  title,
  description,
  className,
  open,
}: {
  children: React.ReactNode;
  title: string;
  description?: string;
  className?: string;
  open?: boolean;
}) {
  const reduce = useReducedMotion();
  return (
    <AnimatePresence>
      {open && (
        <RDialog.Portal forceMount>
          <RDialog.Overlay asChild forceMount>
            <motion.div
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
          </RDialog.Overlay>
          <RDialog.Content asChild forceMount aria-describedby={description ? undefined : undefined}>
            <motion.div
              className={cn(
                "fixed left-1/2 top-1/2 z-50 w-[92vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-elevated)] p-6 shadow-pop",
                className
              )}
              initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 8 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <RDialog.Title className="text-base font-semibold">{title}</RDialog.Title>
                  {description && (
                    <RDialog.Description className="text-sm text-[var(--color-secondary)] mt-1">
                      {description}
                    </RDialog.Description>
                  )}
                </div>
                <RDialog.Close
                  className="text-[var(--color-secondary)] hover:text-[var(--color-primary)] rounded-md p-1 -m-1"
                  aria-label="Close dialog"
                >
                  <X size={18} />
                </RDialog.Close>
              </div>
              {children}
            </motion.div>
          </RDialog.Content>
        </RDialog.Portal>
      )}
    </AnimatePresence>
  );
}
