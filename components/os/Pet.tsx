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
 * Pet — the chibi ASCII knight (see PET.png: helmet, plume, glowing
 * amber visor eyes, scarf). Eye tracking + blink are direct DOM writes
 * on every mousemove/timer tick, never React state — that traffic is
 * too high-frequency to put on the render path. SSR-safe: the <pre>
 * below is static markup, all motion is wired up in effects post-mount.
 */
export function Pet({ variant, busy }: PetProps) {
  const preRef = useRef<HTMLPreElement>(null);
  const eyeL = useRef<HTMLSpanElement>(null);
  const eyeR = useRef<HTMLSpanElement>(null);
  const reducedMotion = useReducedMotion();

  // Last-applied eye translate, so a mid-track blink composes with it
  // instead of clobbering the tracked position.
  const translateRef = useRef("translate(0px,0px)");
  const mouseRef = useRef({ x: 0, y: 0 });
  const rafPending = useRef(false);

  useEffect(() => {
    if (reducedMotion) return; // fully static under reduced motion — no listeners/timers at all

    function track() {
      rafPending.current = false;
      const pre = preRef.current;
      if (!pre) return;
      const rect = pre.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = clamp((mouseRef.current.x - cx) / 60, -2, 2);
      const dy = clamp((mouseRef.current.y - cy) / 60, -2, 2);
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

    // Self-rescheduling blink loop, composed on top of whatever the
    // tracker last wrote rather than fighting it.
    let blinkTimer: ReturnType<typeof setTimeout>;
    let openTimer: ReturnType<typeof setTimeout>;
    function blink() {
      const closed = `${translateRef.current} scaleY(0.15)`;
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

  const eyeClass = `pet-eye${busy ? " pet-eye--busy" : ""}`;
  const wrapperClass =
    variant === "perched"
      ? "pointer-events-none absolute -top-[52px] right-4 z-10 select-none"
      : "block select-none";

  return (
    <span className={wrapperClass}>
      <pre ref={preRef} aria-hidden="true" className="font-mono text-[9px] leading-[9px] text-muted">
{`   .--.
  /,--,\\
 |======|
 |`}<span className={eyeClass} ref={eyeL}>o</span>{`    `}<span className={eyeClass} ref={eyeR}>o</span>{`|
  \\____/
  /|""|\\`}
      </pre>
    </span>
  );
}
