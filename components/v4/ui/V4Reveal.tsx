"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Single scroll-reveal primitive used everywhere instead of one-off
 * whileInView blocks per page, so motion timing stays consistent system-wide.
 * `index` staggers a group (e.g. flow diagram nodes, capability cards)
 * without each caller re-deriving its own delay math.
 */
export function V4Reveal({
  children,
  index = 0,
  className,
  style,
  y = 16,
}: {
  children: ReactNode;
  index?: number;
  className?: string;
  style?: React.CSSProperties;
  y?: number;
}) {
  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
