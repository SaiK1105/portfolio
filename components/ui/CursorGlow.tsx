"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";

/** Diameter of the ambient cursor glow, in px. */
const GLOW_SIZE = 600;

/** Gentle lag — soft enough to read as "following", not instant. */
const SPRING = { stiffness: 200, damping: 32, mass: 0.6 } as const;

/**
 * Fixed, pointer-events-none radial glow that trails the cursor with a
 * spring lag, plus a document-level delegated listener that drives the
 * cursor-follow "shine" on any `.card-surface` element (see the
 * `.card-surface::before` recipe in globals.css).
 *
 * Both effects are driven entirely through framer-motion motion values /
 * direct DOM style writes — no React state updates on mousemove, so this
 * never re-renders the component (or the tree) per pointer move.
 *
 * Renders nothing for touch devices (no real hover) or when the user has
 * requested reduced motion.
 */
export function CursorGlow() {
  const prefersReducedMotion = useReducedMotion();
  const [canHover, setCanHover] = useState(false);

  const mouseX = useMotionValue(-GLOW_SIZE);
  const mouseY = useMotionValue(-GLOW_SIZE);
  const springX = useSpring(mouseX, SPRING);
  const springY = useSpring(mouseY, SPRING);

  // Detect "real" hover capability (desktop pointer). Re-checked on change
  // in case of e.g. a tablet with a mouse plugged/unplugged.
  useEffect(() => {
    const hoverQuery = window.matchMedia("(hover: hover)");
    setCanHover(hoverQuery.matches);
    const onChange = (e: MediaQueryListEvent) => setCanHover(e.matches);
    hoverQuery.addEventListener("change", onChange);
    return () => hoverQuery.removeEventListener("change", onChange);
  }, []);

  const active = canHover && !prefersReducedMotion;

  // Keep latest pointer position + hit target in refs so the rAF-throttled
  // card-shine write always uses the freshest data without re-subscribing
  // the listener or triggering re-renders.
  const latest = useRef({ x: 0, y: 0, target: null as HTMLElement | null });
  const rafId = useRef(0);

  useEffect(() => {
    if (!active) return;

    const updateCardShine = () => {
      rafId.current = 0;
      const card = latest.current.target?.closest<HTMLElement>(".card-surface");
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const mx = ((latest.current.x - rect.left) / rect.width) * 100;
      const my = ((latest.current.y - rect.top) / rect.height) * 100;
      card.style.setProperty("--mx", `${mx}%`);
      card.style.setProperty("--my", `${my}%`);
    };

    const onMouseMove = (e: MouseEvent) => {
      // Glow follow: cheap motion-value writes, no re-render, no throttle
      // needed — framer-motion's spring smooths this on its own RAF loop.
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      // Card shine: delegated + rAF-throttled DOM writes.
      latest.current.x = e.clientX;
      latest.current.y = e.clientY;
      latest.current.target = e.target as HTMLElement;
      if (!rafId.current) {
        rafId.current = requestAnimationFrame(updateCardShine);
      }
    };

    document.addEventListener("mousemove", onMouseMove, { passive: true });
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [active, mouseX, mouseY]);

  if (!active) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-40 h-0 w-0"
      style={{ x: springX, y: springY }}
    >
      <div
        className="absolute rounded-full"
        style={{
          width: GLOW_SIZE,
          height: GLOW_SIZE,
          left: -GLOW_SIZE / 2,
          top: -GLOW_SIZE / 2,
          background: `radial-gradient(circle,
            color-mix(in srgb, var(--accent-1) 8%, transparent) 0%,
            color-mix(in srgb, var(--accent-2) 6%, transparent) 45%,
            transparent 70%)`,
          filter: "blur(48px)",
        }}
      />
    </motion.div>
  );
}
