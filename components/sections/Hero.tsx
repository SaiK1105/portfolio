"use client";

import { motion, useReducedMotion } from "framer-motion";
import { hero } from "@/lib/content";
import { renderAccent } from "@/components/ui/Accent";
import { fadeUp } from "@/lib/motion";

/** Letters stagger in after the kicker; copy below follows. */
const KICKER_INDEX = 0;
const LETTER_BASE_INDEX = 1;

export function Hero() {
  const prefersReducedMotion = useReducedMotion();

  const words = hero.wordmark.split(" ");
  const letterCount = words.join("").length;
  const taglineIndex = LETTER_BASE_INDEX + letterCount + 1;

  let letterIndex = 0;

  return (
    <motion.header
      id="hero"
      initial="hidden"
      animate="visible"
      className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 sm:px-8"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center text-center">
        {/* Kicker */}
        <motion.p
          variants={fadeUp}
          custom={KICKER_INDEX}
          className="font-mono text-xs uppercase tracking-[0.25em] text-muted sm:text-sm"
        >
          {hero.kicker}
        </motion.p>

        {/* Wordmark */}
        <h1 className="mt-6 font-sans text-[17vw] font-extrabold uppercase leading-[0.85] tracking-[-0.06em] text-foreground sm:text-[15vw]">
          <span className="sr-only">S Sai Kumar</span>
          <span aria-hidden="true">
            {words.map((word) => (
              <span key={word} className="block">
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
            ))}
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
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          {hero.ctas.map((cta, i) => {
            const isPrimary = i === 0;
            const isExternalDoc = !cta.href.startsWith("#");
            return (
              <motion.a
                key={cta.label}
                href={cta.href}
                variants={fadeUp}
                custom={taglineIndex + 1 + i}
                whileTap={{ scale: 0.97 }}
                {...(isExternalDoc
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className={
                  isPrimary
                    ? "rounded-full bg-accent px-7 py-3 text-sm font-semibold text-background transition-colors duration-300 hover:bg-accent/85"
                    : "rounded-full border border-accent/30 px-7 py-3 text-sm font-semibold text-foreground transition-colors duration-300 hover:border-accent/60"
                }
              >
                {cta.label}
              </motion.a>
            );
          })}
        </div>
      </div>

      {/* Scroll hint */}
      <motion.div
        variants={fadeUp}
        custom={taglineIndex + hero.ctas.length + 2}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        aria-hidden="true"
      >
        <motion.span
          className="flex flex-col items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-muted"
          animate={prefersReducedMotion ? undefined : { y: [0, 6, 0] }}
          transition={
            prefersReducedMotion
              ? undefined
              : { duration: 2.4, repeat: Infinity, ease: "easeInOut" }
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
