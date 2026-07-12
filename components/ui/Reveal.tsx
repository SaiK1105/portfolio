"use client";

import { motion, useReducedMotion } from "framer-motion";
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
 *
 * Framer Motion drives opacity/transform via the Web Animations API, not
 * CSS `transition`/`animation` properties, so the global
 * `prefers-reduced-motion` block in globals.css (which only zeroes CSS
 * animation/transition durations) can't reach it. Guard explicitly here:
 * when reduced motion is requested, mount straight into the "visible"
 * variant so there's no hidden->visible transition to play at all.
 */
export function Reveal({
  children,
  delay = 0,
  className,
  id,
  "aria-label": ariaLabel,
}: RevealProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      id={id}
      aria-label={ariaLabel}
      className={className}
      variants={fadeUp}
      initial={prefersReducedMotion ? "visible" : "hidden"}
      whileInView="visible"
      viewport={VIEWPORT_ONCE}
      custom={delay}
    >
      {children}
    </motion.div>
  );
}
