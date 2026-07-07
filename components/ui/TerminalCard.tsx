"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { about } from "@/lib/content";
import { VIEWPORT_ONCE } from "@/lib/motion";

const CHAR_DELAY_MS = 30;
const LINE_PAUSE_MS = 700;

/** Blinking block cursor — hard on/off, no fade, like a real terminal caret. */
function Cursor() {
  return (
    <motion.span
      aria-hidden="true"
      className="ml-0.5 inline-block h-[1em] w-[0.5em] translate-y-[0.15em] bg-accent align-middle"
      animate={{ opacity: [1, 1, 0, 0] }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear", times: [0, 0.5, 0.5, 1] }}
    />
  );
}

/**
 * TerminalCard — the site's signature element. A minimal terminal window
 * that types out `about.terminalLines` one character at a time once it
 * scrolls into view; each finished line stays put while the next begins.
 * Respects prefers-reduced-motion by rendering every line instantly.
 */
export function TerminalCard() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: VIEWPORT_ONCE.once, margin: VIEWPORT_ONCE.margin });
  const prefersReducedMotion = useReducedMotion();

  const lines = about.terminalLines;
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  const skipTyping = Boolean(prefersReducedMotion);

  useEffect(() => {
    if (!isInView || skipTyping) return;
    if (lineIndex >= lines.length) return;

    const currentLine = lines[lineIndex];

    if (charIndex < currentLine.length) {
      const t = setTimeout(() => setCharIndex((c) => c + 1), CHAR_DELAY_MS);
      return () => clearTimeout(t);
    }

    const t = setTimeout(() => {
      setLineIndex((l) => l + 1);
      setCharIndex(0);
    }, LINE_PAUSE_MS);
    return () => clearTimeout(t);
  }, [isInView, skipTyping, lineIndex, charIndex, lines]);

  return (
    <div ref={ref} className="card-surface overflow-hidden rounded-2xl">
      {/* Header row */}
      <div className="flex items-center gap-2 border-b border-white/6 px-5 py-3">
        <span className="flex gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        </span>
        <span className="ml-2 font-mono text-xs text-muted">sai@agent — zsh</span>
      </div>

      {/* Body */}
      <div className="px-5 py-6 font-mono text-sm leading-relaxed">
        {/* Accessible full-text fallback; visual typing below is decorative. */}
        <p className="sr-only">{lines.join(". ")}</p>

        <div aria-hidden="true">
          {lines.map((line, i) => {
            const isLast = i === lines.length - 1;
            const colorClass = isLast ? "text-status-present" : "text-accent/90";

            if (skipTyping || i < lineIndex) {
              return (
                <div key={line} className={colorClass}>
                  {line}
                </div>
              );
            }

            if (i === lineIndex) {
              return (
                <div key={line} className={colorClass}>
                  {line.slice(0, charIndex)}
                  <Cursor />
                </div>
              );
            }

            return null;
          })}
        </div>
      </div>
    </div>
  );
}
