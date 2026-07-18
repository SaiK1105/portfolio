"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

type PetProps = {
  /** "perched" rides the terminal's titlebar edge; "docked" is the standalone reopen-button glyph. */
  variant: "perched" | "docked";
  busy: boolean;
};

/**
 * Pet — the harness drone. The body is the dense dashed-ASCII artwork
 * itself (public/pet.png, 463x260 RGBA, pupils inpainted out of the gold
 * visor) — three generations of hand-drawn/procedural pets lost to this
 * art's texture, so the art IS the asset. The eyes are live overlays
 * positioned at the extraction pipeline's detected pupil coordinates:
 * they track the cursor, blink, and glow while the agent thinks.
 *
 * Tracking/blink are direct DOM writes (rAF-throttled), never React
 * state. SSR-safe: static markup, listeners wired in effects.
 */

// Pupil geometry measured on the trimmed artwork (% of image box).
const EYES = [
  { cx: 39.1, cy: 57.1 },
  { cx: 52.44, cy: 57.08 },
] as const;
// Native pupil diameter is ~2.9% of width; drawn slightly larger for
// expressiveness at 110-150px display sizes.
const EYE_DIAMETER_PCT = 4.4;

export function Pet({ variant, busy }: PetProps) {
  const boxRef = useRef<HTMLSpanElement>(null);
  const eyeL = useRef<HTMLSpanElement>(null);
  const eyeR = useRef<HTMLSpanElement>(null);
  const reducedMotion = useReducedMotion();

  // Last-applied translate so a mid-track blink composes with it.
  const translateRef = useRef("translate(0px,0px)");
  const mouseRef = useRef({ x: 0, y: 0 });
  const rafPending = useRef(false);

  useEffect(() => {
    if (reducedMotion) return; // fully static under reduced motion

    function track() {
      rafPending.current = false;
      const box = boxRef.current;
      if (!box) return;
      const rect = box.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = clamp((mouseRef.current.x - cx) / 50, -2.5, 2.5);
      const dy = clamp((mouseRef.current.y - cy) / 50, -2.5, 2.5);
      translateRef.current = `translate(${dx}px,${dy}px)`;
      if (eyeL.current) eyeL.current.style.transform = translateRef.current;
      if (eyeR.current) eyeR.current.style.transform = translateRef.current;
    }

    function onMouseMove(e: MouseEvent) {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      if (rafPending.current) return;
      rafPending.current = true;
      requestAnimationFrame(track);
    }

    window.addEventListener("mousemove", onMouseMove, { passive: true });

    let blinkTimer: ReturnType<typeof setTimeout>;
    let openTimer: ReturnType<typeof setTimeout>;
    function blink() {
      const closed = `${translateRef.current} scaleY(0.12)`;
      if (eyeL.current) eyeL.current.style.transform = closed;
      if (eyeR.current) eyeR.current.style.transform = closed;
      openTimer = setTimeout(() => {
        if (eyeL.current) eyeL.current.style.transform = translateRef.current;
        if (eyeR.current) eyeR.current.style.transform = translateRef.current;
      }, 120);
      blinkTimer = setTimeout(blink, 3000 + Math.random() * 3000);
    }
    blinkTimer = setTimeout(blink, 3000 + Math.random() * 3000);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      clearTimeout(blinkTimer);
      clearTimeout(openTimer);
    };
  }, [reducedMotion]);

  // Image is 463x260 (1.78:1) — wider than tall, rotors included.
  // Exactly ONE position class per variant: absolute IS the pupil
  // positioning context when perched; docked needs relative for it.
  // (Never prepend another position utility — Tailwind's cascade order,
  // not class order, decides the winner.)
  const wrapperClass =
    variant === "perched"
      ? "pointer-events-none absolute -top-[72px] right-3 z-10 w-[150px] select-none"
      : "relative block w-[108px] select-none";

  return (
    // pet-bob sits on the wrapper so the pupils bob WITH the artwork —
    // on the img alone, the eyes would stay still while the face moves.
    <span ref={boxRef} className={`pet-bob ${wrapperClass}${busy ? " pet-busy" : ""}`}>
      {/* eslint-disable-next-line @next/next/no-img-element -- static export; plain img avoids the next/image loader for a 34KB local asset */}
      <img
        src="/pet.png"
        alt=""
        aria-hidden="true"
        width={463}
        height={260}
        draggable={false}
        className="h-auto w-full"
      />
      {EYES.map(({ cx, cy }, i) => (
        <span
          key={cx}
          aria-hidden="true"
          className="pointer-events-none absolute"
          style={{
            left: `${cx}%`,
            top: `${cy}%`,
            width: `${EYE_DIAMETER_PCT}%`,
            aspectRatio: "1",
            marginLeft: `-${EYE_DIAMETER_PCT / 2}%`,
            transform: "translateY(-50%)",
          }}
        >
          <span ref={i === 0 ? eyeL : eyeR} className="pet-eye block h-full w-full" />
        </span>
      ))}
    </span>
  );
}
