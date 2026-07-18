"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion, type Variants } from "framer-motion";
import { EASE, ISLAND_SPRING } from "@/lib/motion";
import { TerminalCard } from "@/components/ui/TerminalCard";
import { Pet } from "@/components/os/Pet";

// No overflow on the frame itself: the perched pet sticks out above the
// window's top edge, and overflow-y on the frame clips it away. Height
// guarding lives on the inner scroll wrapper around TerminalCard instead.
const FLOATING_FRAME_CLASS =
  "fixed bottom-4 left-4 z-[300] w-[400px] max-w-[calc(100vw-24px)] max-[560px]:inset-x-3 max-[560px]:w-auto max-[560px]:bottom-[80px]";

const frameVariants: Variants = {
  open: { opacity: 1, scale: 1, y: 0, visibility: "visible" },
  closed: { opacity: 0, scale: 0.7, y: 24, transitionEnd: { visibility: "hidden" } },
};

/**
 * TerminalHost — replaces the hero terminal slot and owns the pet +
 * terminal's three-mode lifecycle as the visitor scrolls:
 *   hero     — in-flow, sitting in the hero grid column
 *   floating — scrolled past hero, visitor reopened it: fixed overlay
 *   docked   — scrolled past hero, closed: just the pet button remains
 * `mode` is derived, never stored, so scroll position + the open
 * toggle are the only state and nothing can desync from it.
 */
export function TerminalHost() {
  const slotRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const petButtonRef = useRef<HTMLButtonElement>(null);
  // Last measured height of the slot while it was genuinely in hero
  // mode — used to freeze `pinnedHeight` below, and doubling as the
  // "have we ever really seen hero" guard (see the pin effect).
  const heroHeightRef = useRef<number | undefined>(undefined);

  const heroInView = useInView(slotRef, { once: false, amount: 0.1 });
  const reduced = Boolean(useReducedMotion());

  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [pinnedHeight, setPinnedHeight] = useState<number | undefined>(undefined);

  const mode = heroInView ? "hero" : open ? "floating" : "docked";

  // Track the slot's real in-flow height while it's still in hero mode —
  // once the frame goes position:fixed it contributes ~0 height to the
  // slot, so this is the only point we can measure the real number from.
  useEffect(() => {
    if (heroInView && slotRef.current) {
      heroHeightRef.current = slotRef.current.offsetHeight;
    }
  }, [heroInView]);

  useEffect(() => {
    if (heroInView) {
      setOpen(false); // scroll-back resets; next scroll-down docks, not floats
      return;
    }
    // First real transition away from hero: freeze the last known hero
    // height as a permanent minHeight — a stable IntersectionObserver
    // boundary (no flapping) and no grid collapse once the frame goes
    // fixed/hidden. heroHeightRef being unset here also guards
    // useInView's known first-frame-false at mount (it defaults false
    // until the observer's first callback), which would otherwise pin a
    // bogus collapsed height before hero has ever actually been measured.
    if (pinnedHeight === undefined && heroHeightRef.current !== undefined) {
      setPinnedHeight(heroHeightRef.current);
    }
  }, [heroInView, pinnedHeight]);

  useEffect(() => {
    if (mode !== "floating") return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== "Escape") return;
      dock();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  function reopen() {
    setOpen(true);
    requestAnimationFrame(() => {
      frameRef.current?.querySelector("input")?.focus();
    });
  }

  function dock() {
    setOpen(false);
    requestAnimationFrame(() => petButtonRef.current?.focus());
  }

  return (
    <>
      <div ref={slotRef} style={pinnedHeight !== undefined ? { minHeight: pinnedHeight } : undefined}>
        <p className="mb-2 font-mono text-xs text-green">
          <span aria-hidden="true">&#9656; </span>ask the agent anything
        </p>

        {/* Relies on position:fixed escaping to the viewport in floating
            mode — never add transform/filter/will-change to Hero's
            section or any ancestor of this grid, or that escape breaks. */}
        <motion.div
          ref={frameRef}
          variants={frameVariants}
          initial={false}
          animate={mode === "docked" ? "closed" : "open"}
          transition={reduced ? { duration: 0 } : { duration: 0.35, ease: EASE }}
          style={{ transformOrigin: "bottom left" }}
          className={mode === "hero" ? "relative mt-1" : FLOATING_FRAME_CLASS}
        >
          <Pet variant="perched" busy={busy} />
          {mode === "floating" && (
            <button
              type="button"
              onClick={dock}
              aria-label="minimize terminal"
              className="absolute right-2 top-2 z-20 font-mono"
            >
              &#8211;
            </button>
          )}
          {/* Short-viewport guard (landscape phones): scroll the window, not
              the frame, so the pet above the top edge never gets clipped. */}
          <div className="max-h-[calc(100svh-120px)] overflow-y-auto">
            <TerminalCard onBusyChange={setBusy} className="flex w-full flex-col lg:min-h-[400px]" />
          </div>
        </motion.div>
      </div>

      {mode === "docked" && (
        <motion.button
          ref={petButtonRef}
          onClick={reopen}
          aria-label="reopen terminal"
          className="fixed bottom-4 left-4 z-[300] cursor-pointer max-[560px]:bottom-[80px] max-[560px]:left-3"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          // Delay absorbs useInView's first-frame false so a top-of-page
          // load never flashes the pet in before hero is confirmed.
          transition={reduced ? { duration: 0 } : { ...ISLAND_SPRING, delay: 0.1 }}
        >
          <Pet variant="docked" busy={busy} />
        </motion.button>
      )}
    </>
  );
}
