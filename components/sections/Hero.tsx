"use client";

import type { CSSProperties } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { hero } from "@/lib/content";
import { TerminalHost } from "@/components/os/TerminalHost";

/**
 * Wordmark font-size token, scoped to the hero stage. Sized so
 * SAI / KUMAR fill the left column of the split hero without ever
 * colliding with the terminal on the right.
 */
const WORDMARK_STYLE = { "--wm": "clamp(3.6rem, 9vw, 9.5rem)" } as CSSProperties;

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
      className="relative flex flex-col justify-center overflow-x-hidden px-6 pb-16 pt-8 sm:px-8 sm:pb-20 lg:min-h-[calc(100svh-36px)] lg:px-[6vw] lg:pb-8 lg:pt-6"
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

      {/* Hero stage — clean split: the full name on the left, the live
          terminal on the right. No overlap: the name is never covered.
          On mobile everything stacks (name, then terminal). */}
      <div
        style={WORDMARK_STYLE}
        className="mt-8 flex flex-col gap-10 lg:mt-10 lg:grid lg:grid-cols-12 lg:items-center lg:gap-8"
      >
        {/* Wordmark — decorative; the real h1 is visually-hidden above. */}
        <div
          aria-hidden="true"
          className="pointer-events-none select-none font-display text-[length:var(--wm)] font-bold uppercase leading-[0.94] tracking-[-0.01em] text-text lg:col-span-7"
        >
          {words.map((word) => (
            <span key={word} className="block">
              {word}
            </span>
          ))}
        </div>

        {/* Terminal — the hero's crown jewel, on the right. */}
        <div className="lg:col-span-5">
          <TerminalHost />
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
