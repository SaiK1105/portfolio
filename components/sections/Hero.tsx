"use client";

import type { CSSProperties } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { hero } from "@/lib/content";
import { TerminalCard } from "@/components/ui/TerminalCard";

/**
 * Wordmark font-size token, scoped to the hero stage. The terminal's
 * overlap offset below is derived from the same `--wm` value (`* 0.26`)
 * so the "slice" lands in the same spot on the wordmark at every
 * viewport width, exactly like the os.html mockup's `--wm`-relative
 * terminal offset.
 */
const WORDMARK_STYLE = { "--wm": "clamp(3.6rem, 11vw, 11rem)" } as CSSProperties;

export function Hero() {
  const prefersReducedMotion = useReducedMotion();
  const words = hero.wordmark.split(" ");
  // Strip the {accent} braces and trailing period from the real tagline
  // copy in lib/content.ts to get the mono "// comment" line — the
  // wording itself always stays in sync with lib/content.ts.
  const taglineComment = hero.tagline.replace(/[{}]/g, "").replace(/\.\s*$/, "");

  return (
    <section
      id="home"
      aria-label="Introduction"
      className="relative overflow-x-hidden px-6 pb-16 pt-8 sm:px-8 sm:pb-20 lg:px-[6vw] lg:pt-10"
    >
      {/* The single real heading on the page — the giant wordmark below is
          a decorative graphic, not text content. */}
      <h1 className="visually-hidden">S Sai Kumar</h1>

      <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted">
        {hero.kicker}
      </p>
      <p className="mt-2 max-w-2xl font-mono text-xs text-muted sm:text-sm">
        <span className="opacity-70">// {taglineComment}</span>
      </p>

      {/* Hero stage: wordmark + peeking windows + terminal. On desktop the
          terminal is pulled up over the wordmark with a negative margin
          (still in normal flow, so whatever comes after it — the CTAs —
          always clears its real rendered height, no matter how long the
          conversation grows). On mobile everything just stacks. */}
      <div
        style={WORDMARK_STYLE}
        className="relative mt-8 flex flex-col gap-10 lg:mt-10 lg:block"
      >
        {/* Wordmark — decorative, sliced by the terminal window below. */}
        <div
          aria-hidden="true"
          className="pointer-events-none relative z-[1] select-none font-display text-[length:var(--wm)] font-bold uppercase leading-[0.94] tracking-[-0.01em] text-text"
        >
          {words.map((word) => (
            <span key={word} className="block">
              {word}
            </span>
          ))}
        </div>

        {/* Terminal — the hero's crown jewel, floating over the wordmark.
            (Decorative "peek" windows were removed: at desktop widths they
            collided with the wordmark and read as clutter. The sliced
            wordmark + terminal is a cleaner, more confident composition.) */}
        <div className="relative z-[5] lg:-mt-[calc(var(--wm)*0.26)] lg:ml-[clamp(0px,4vw,90px)]">
          <p className="mb-2 font-mono text-xs text-green lg:hidden">
            <span aria-hidden="true">&#9656; </span>ask the agent anything
          </p>
          <TerminalCard className="w-full lg:w-[min(640px,90vw)]" />
        </div>
      </div>

      {/* CTAs — real links from lib/content.ts, styled as OS command pills. */}
      <div className="relative z-[6] mt-10 flex flex-wrap gap-3 lg:mt-10">
        {hero.ctas.map((cta) => {
          const isExternal = !cta.href.startsWith("#");
          return (
            <a
              key={cta.label}
              href={cta.href}
              className="os-btn"
              {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              <span aria-hidden="true" className="text-muted">
                $
              </span>
              {cta.label}
            </a>
          );
        })}
      </div>

      {/* Scroll hint */}
      <motion.div
        aria-hidden="true"
        className="relative z-[6] mt-12 flex justify-center lg:mt-16"
        animate={prefersReducedMotion ? undefined : { y: [0, 6, 0] }}
        transition={
          prefersReducedMotion
            ? undefined
            : // Symmetric bounce loops read wrong with the signature ease-out;
              // infinite up/down loops are the documented exception and use
              // "easeInOut" to stay balanced in both directions.
              { duration: 2.4, repeat: Infinity, ease: "easeInOut" }
        }
      >
        <span className="flex flex-col items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-muted">
          scroll
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-muted">
            <path
              d="M2 4l4 4 4-4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </motion.div>
    </section>
  );
}
