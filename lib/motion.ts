import type { Variants } from "framer-motion";

/** The single signature easing used across the entire site. */
export const EASE = [0.16, 1, 0.3, 1] as const;

export const DURATION = { fast: 0.4, base: 0.7 } as const;

/** Viewport settings for scroll-triggered entrances: fire once, slightly early. */
export const VIEWPORT_ONCE = { once: true, margin: "-80px" } as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.base, ease: EASE, delay: i * 0.07 },
  }),
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: (i: number = 0) => ({
    opacity: 1,
    transition: { duration: DURATION.base, ease: EASE, delay: i * 0.07 },
  }),
};

export const staggerChildren: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

/** Spring for the island nav morph. */
export const ISLAND_SPRING = { type: "spring", stiffness: 500, damping: 30 } as const;
