"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { fadeUp, VIEWPORT_ONCE } from "@/lib/motion";

type RevealProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
  /** Anchor id, so callers can make a Reveal a scroll target directly. */
  id?: string;
  "aria-label"?: string;
};

/**
 * Viewport-triggered fade-up wrapper. `delay` is a stagger index, not
 * seconds. `id`/`aria-label` pass through to the underlying element, so
 * callers can anchor or label a Reveal directly without an extra wrapper.
 */
export function Reveal({
  children,
  delay = 0,
  className,
  id,
  "aria-label": ariaLabel,
}: RevealProps) {
  return (
    <motion.div
      id={id}
      aria-label={ariaLabel}
      className={className}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT_ONCE}
      custom={delay}
    >
      {children}
    </motion.div>
  );
}
