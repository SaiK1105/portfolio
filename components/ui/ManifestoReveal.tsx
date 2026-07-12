"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { about } from "@/lib/content";
import { DURATION, EASE, staggerChildren, VIEWPORT_ONCE } from "@/lib/motion";

/** Per-word fade, driven by the shared staggerChildren container above it. */
const word: Variants = {
  hidden: { opacity: 0.25 },
  visible: { opacity: 1, transition: { duration: DURATION.fast, ease: EASE } },
};

/**
 * ManifestoReveal — word-level scroll reveal for the about.manifesto copy,
 * extracted from the former standalone About section so it can sit inside
 * the bento grid's manifesto cell.
 *
 * Same reduced-motion caveat as Reveal: this is a WAAPI-driven
 * whileInView animation, invisible to the global CSS reduced-motion
 * block, so it's guarded explicitly — reduced motion mounts every word
 * straight into "visible".
 */
export function ManifestoReveal() {
  const prefersReducedMotion = useReducedMotion();
  const words = about.manifesto.split(" ");

  return (
    <motion.p
      className="flex flex-wrap gap-x-[0.3em] gap-y-1 text-2xl font-light leading-snug text-foreground sm:text-3xl"
      variants={staggerChildren}
      initial={prefersReducedMotion ? "visible" : "hidden"}
      whileInView="visible"
      viewport={VIEWPORT_ONCE}
    >
      {words.map((w, i) => (
        <motion.span key={`${w}-${i}`} variants={word}>
          {w}
        </motion.span>
      ))}
    </motion.p>
  );
}
