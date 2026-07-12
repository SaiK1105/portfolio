"use client";

import { useEffect, useState, type MouseEvent } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { hero } from "@/lib/content";
import { renderAccent } from "@/components/ui/Accent";
import { TerminalCard } from "@/components/ui/TerminalCard";
import { fadeUp, ISLAND_SPRING } from "@/lib/motion";

/** Letters stagger in after the kicker; copy below follows. */
const KICKER_INDEX = 0;
const LETTER_BASE_INDEX = 1;

/** Magnetic CTA tuning — cursor must be within this radius (px) to pull. */
const MAGNETIC_RADIUS = 80;
const MAGNETIC_STRENGTH = 6;

/** True only for pointers that can actually hover (excludes touch). */
function useHoverCapable() {
  const [hoverCapable, setHoverCapable] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover)");
    setHoverCapable(mq.matches);
    const handleChange = (e: MediaQueryListEvent) => setHoverCapable(e.matches);
    mq.addEventListener("change", handleChange);
    return () => mq.removeEventListener("change", handleChange);
  }, []);

  return hoverCapable;
}

/** A CTA pill that subtly leans toward the cursor when it's nearby. */
function MagneticCta({
  cta,
  index,
  isExternalDoc,
  className,
}: {
  cta: { label: string; href: string };
  index: number;
  isExternalDoc: boolean;
  className: string;
}) {
  const prefersReducedMotion = useReducedMotion();
  const hoverCapable = useHoverCapable();
  const magneticEnabled = hoverCapable && !prefersReducedMotion;

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const springX = useSpring(mx, ISLAND_SPRING);
  const springY = useSpring(my, ISLAND_SPRING);
  const translate = useMotionTemplate`${springX}px ${springY}px`;

  function handleMouseMove(e: MouseEvent<HTMLAnchorElement>) {
    if (!magneticEnabled) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    const distance = Math.hypot(dx, dy);
    if (distance > MAGNETIC_RADIUS) {
      mx.set(0);
      my.set(0);
      return;
    }
    const pull = (1 - distance / MAGNETIC_RADIUS) * MAGNETIC_STRENGTH;
    mx.set((dx / MAGNETIC_RADIUS) * pull);
    my.set((dy / MAGNETIC_RADIUS) * pull);
  }

  function handleMouseLeave() {
    mx.set(0);
    my.set(0);
  }

  return (
    <motion.a
      href={cta.href}
      variants={fadeUp}
      custom={index}
      whileTap={{ scale: 0.97 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={magneticEnabled ? { translate } : undefined}
      {...(isExternalDoc ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={className}
    >
      {cta.label}
    </motion.a>
  );
}

export function Hero() {
  const prefersReducedMotion = useReducedMotion();

  const words = hero.wordmark.split(" ");
  const letterCount = words.join("").length;
  const taglineIndex = LETTER_BASE_INDEX + letterCount + 1;
  const terminalIndex = taglineIndex + hero.ctas.length + 2;

  let letterIndex = 0;

  return (
    <motion.header
      id="hero"
      // All child motion.* elements below inherit this hidden/visible
      // state via variant propagation (they only set `variants`, no own
      // initial/animate). Framer Motion's WAAPI-driven fadeUp transition
      // isn't reachable by the CSS reduced-motion block, so gate the
      // whole entrance stagger here: reduced motion skips straight to
      // "visible" with no hidden->visible transition to play.
      initial={prefersReducedMotion ? "visible" : "hidden"}
      animate="visible"
      className="relative flex min-h-[92svh] flex-col justify-center overflow-hidden px-6 sm:px-8"
    >
      <div
        aria-hidden="true"
        className="hero-glow pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[80vh] w-[120vw] -translate-x-1/2 -translate-y-1/2 rounded-full"
      />

      <div className="mx-auto grid w-full max-w-6xl gap-10 py-20 lg:grid-cols-12 lg:items-center lg:gap-10 lg:py-0">
        {/* Left: identity + copy */}
        <div className="flex flex-col lg:col-span-7">
          {/* Kicker */}
          <motion.p
            variants={fadeUp}
            custom={KICKER_INDEX}
            className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 font-mono text-xs uppercase tracking-[0.25em] text-muted sm:text-sm"
          >
            <span
              aria-hidden="true"
              className="size-1.5 shrink-0 rounded-full bg-[var(--accent-2)] animate-pulse"
            />
            {hero.kicker}
          </motion.p>

          {/* Wordmark */}
          <h1 className="font-display mt-6 text-6xl font-extrabold tracking-[-0.03em] leading-[0.9] text-foreground sm:text-7xl lg:text-8xl">
            <span className="sr-only">S Sai Kumar</span>
            <span aria-hidden="true">
              {words.map((word, wordIndex) => {
                const isGradient = wordIndex > 0;
                return (
                  <span
                    key={word}
                    className={`block ${isGradient ? "grad-text grad-text-pan" : ""}`}
                  >
                    {word.split("").map((letter, i) => {
                      const index = LETTER_BASE_INDEX + letterIndex;
                      letterIndex += 1;
                      return (
                        <motion.span
                          key={`${word}-${i}`}
                          variants={fadeUp}
                          custom={index}
                          className="inline-block"
                        >
                          {letter}
                        </motion.span>
                      );
                    })}
                  </span>
                );
              })}
            </span>
          </h1>

          {/* Tagline */}
          <motion.p
            variants={fadeUp}
            custom={taglineIndex}
            className="mt-8 max-w-xl text-lg text-muted text-balance sm:text-xl"
          >
            {renderAccent(hero.tagline)}
          </motion.p>

          {/* CTAs */}
          <div className="mt-10 flex flex-wrap items-center gap-4">
            {hero.ctas.map((cta, i) => {
              const isPrimary = i === 0;
              const isExternalDoc = !cta.href.startsWith("#");
              return (
                <MagneticCta
                  key={cta.label}
                  cta={cta}
                  index={taglineIndex + 1 + i}
                  isExternalDoc={isExternalDoc}
                  className={
                    isPrimary
                      ? "glow-pulse grad rounded-full px-7 py-3 text-sm font-semibold text-background transition-transform duration-300 ease-[var(--ease-signature)] hover:scale-[1.03]"
                      : "rounded-full border border-white/10 bg-white/5 px-7 py-3 text-sm font-semibold text-foreground transition-colors duration-300 ease-[var(--ease-signature)] hover:border-white/25 hover:bg-white/10"
                  }
                />
              );
            })}
          </div>

          {/* Metadata line */}
          <motion.p
            variants={fadeUp}
            custom={taglineIndex + hero.ctas.length + 1}
            className="mt-10 font-mono text-xs uppercase tracking-[0.2em] text-muted"
          >
            based in india · open to internships 2026 · s.sai08019@gmail.com
          </motion.p>
        </div>

        {/* Right: the live terminal — hero's co-star */}
        <motion.div
          variants={fadeUp}
          custom={terminalIndex}
          className="flex flex-col lg:col-span-5"
        >
          <p className="mb-3 font-mono text-xs text-accent-2">
            <span aria-hidden="true">&#9656; </span>ask the agent anything
          </p>
          <TerminalCard className="min-h-[340px] lg:min-h-[420px]" />
        </motion.div>
      </div>

      {/* Scroll hint */}
      <motion.div
        variants={fadeUp}
        custom={terminalIndex + 1}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        aria-hidden="true"
      >
        <motion.span
          className="flex flex-col items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-muted"
          animate={prefersReducedMotion ? undefined : { y: [0, 6, 0] }}
          transition={
            prefersReducedMotion
              ? undefined
              : // Symmetric bounce loops read wrong with the signature ease-out
                // (EASE); infinite up/down loops are the documented exception —
                // they use "easeInOut" to stay balanced in both directions.
                { duration: 2.4, repeat: Infinity, ease: "easeInOut" }
          }
        >
          scroll
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            className="text-muted"
          >
            <path
              d="M2 4l4 4 4-4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.span>
      </motion.div>
    </motion.header>
  );
}
