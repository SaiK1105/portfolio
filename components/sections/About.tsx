"use client";

import { motion, type Variants } from "framer-motion";
import { about } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TerminalCard } from "@/components/ui/TerminalCard";
import { DURATION, EASE, staggerChildren, VIEWPORT_ONCE } from "@/lib/motion";

/** Per-word fade, driven by the shared staggerChildren container above it. */
const word: Variants = {
  hidden: { opacity: 0.25 },
  visible: { opacity: 1, transition: { duration: DURATION.fast, ease: EASE } },
};

/**
 * About — manifesto (word-level scroll reveal) beside the signature
 * terminal card. Two columns on desktop, stacked on mobile.
 */
export function About() {
  const words = about.manifesto.split(" ");

  return (
    <section id="about" className="mx-auto max-w-6xl px-6 py-24 sm:px-8 sm:py-32">
      <SectionHeading kicker="01 - About" title="Systems that {reason and act}." />

      <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-start lg:gap-16">
        <motion.p
          className="flex flex-wrap gap-x-[0.3em] gap-y-1 text-2xl font-light leading-snug text-foreground sm:text-3xl"
          variants={staggerChildren}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_ONCE}
        >
          {words.map((w, i) => (
            <motion.span key={`${w}-${i}`} variants={word}>
              {w}
            </motion.span>
          ))}
        </motion.p>

        <Reveal delay={1}>
          <TerminalCard />
        </Reveal>
      </div>
    </section>
  );
}
