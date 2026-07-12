"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { EASE } from "@/lib/motion";

/** viewBox is fixed; horizontal segments stretch to fill, verticals stay put. */
const VB_WIDTH = 1200;
const VB_HEIGHT = 48;
const TRACE_PATH = "M0 24 H280 V10 H520 V34 H760 V24 H1200";
const NODES: readonly [number, number][] = [
  [280, 24],
  [280, 10],
  [520, 10],
  [520, 34],
  [760, 34],
  [760, 24],
];

/** Fraction of the path length the traveling pulse dash occupies. */
const PULSE_LENGTH = 0.08;
const PULSE_DURATION = 1.8;

/**
 * TraceDivider — a thin, full-width decorative section break evoking a
 * PCB circuit trace: a static hairline with right-angle jogs and node
 * dots at the joints, plus a single accent pulse that travels along the
 * path once when it scrolls into view. Purely decorative.
 */
export function TraceDivider() {
  const ref = useRef<SVGSVGElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const prefersReducedMotion = useReducedMotion();
  const showPulse = isInView && !prefersReducedMotion;

  return (
    <div className="mx-auto max-w-6xl px-6 sm:px-8">
      <svg
        ref={ref}
        aria-hidden="true"
        focusable="false"
        viewBox={`0 0 ${VB_WIDTH} ${VB_HEIGHT}`}
        preserveAspectRatio="none"
        className="block h-12 w-full"
      >
        <defs>
          <linearGradient id="trace-pulse-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--accent-1)" />
            <stop offset="100%" stopColor="var(--accent-2)" />
          </linearGradient>
        </defs>

        <path
          d={TRACE_PATH}
          fill="none"
          strokeWidth={1}
          vectorEffect="non-scaling-stroke"
          className="stroke-white/12"
        />

        {NODES.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={2} className="fill-accent-2/60" />
        ))}

        {!prefersReducedMotion && (
          <motion.path
            d={TRACE_PATH}
            fill="none"
            strokeWidth={1.5}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            stroke="url(#trace-pulse-gradient)"
            pathLength={PULSE_LENGTH}
            initial={{ pathOffset: -PULSE_LENGTH, opacity: 0 }}
            animate={
              showPulse
                ? { pathOffset: 1, opacity: [0, 1, 1, 0] }
                : { pathOffset: -PULSE_LENGTH, opacity: 0 }
            }
            transition={{ duration: PULSE_DURATION, ease: EASE }}
          />
        )}
      </svg>
    </div>
  );
}
