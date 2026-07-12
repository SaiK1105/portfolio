"use client";

import { useEffect, useRef, useState } from "react";

/** sessionStorage key — one boot per browser session. */
const BOOT_STORAGE_KEY = "sk_os_booted";

const BOOT_LINES = [
  "saikumar-os v2.0 booting…",
  "loading kernel modules ........... [OK]",
  "mounting /projects ................ [OK]",
  "mounting /skills ................... [OK]",
  "starting agent.service ............. [OK]",
  "starting displaymanager ............ [OK]",
];

const START_DELAY_MS = 80;
const LINE_DELAY_MS = 160;
const HOLD_MS = 500;
const FADE_MS = 200;

type Phase = "hidden" | "booting" | "skippable" | "leaving";

/** Splits a boot line on "[OK]" and wraps it in the green `.ok` span. */
function renderLine(line: string | undefined, key: number) {
  // A transient/undefined entry must never crash the whole page tree
  // (React would swap the entire route for its error boundary).
  if (typeof line !== "string") return null;
  const okIndex = line.indexOf("[OK]");
  if (okIndex === -1) {
    return <div key={key}>{line}</div>;
  }
  return (
    <div key={key}>
      {line.slice(0, okIndex)}
      <span className="ok">[OK]</span>
      {line.slice(okIndex + 4)}
    </div>
  );
}

/**
 * BootSequence — a brief (~1.6s) BIOS/systemd-style boot overlay shown
 * once per browser session, skippable via click, any key, or the Skip
 * button. Entirely bypassed under prefers-reduced-motion or on repeat
 * visits within the same session: this component either renders the
 * full overlay or renders nothing at all — never a half-animated
 * compromise, and never a hydration mismatch (server and first client
 * paint both render nothing; the decision to boot happens in an effect).
 */
export function BootSequence() {
  const [phase, setPhase] = useState<Phase>("hidden");
  const [lines, setLines] = useState<string[]>([]);
  const finishRef = useRef<() => void>(() => {});
  const skipButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let reduceMotion = false;
    let alreadyBooted = false;
    try {
      reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch {
      reduceMotion = false;
    }
    try {
      alreadyBooted = sessionStorage.getItem(BOOT_STORAGE_KEY) === "1";
    } catch {
      alreadyBooted = false;
    }

    if (reduceMotion || alreadyBooted) {
      try {
        sessionStorage.setItem(BOOT_STORAGE_KEY, "1");
      } catch {
        /* ignore */
      }
      document.documentElement.removeAttribute("data-booting");
      return;
    }

    const timers: number[] = [];
    let finished = false;

    const finish = () => {
      if (finished) return;
      finished = true;
      timers.forEach((t) => window.clearTimeout(t));
      try {
        sessionStorage.setItem(BOOT_STORAGE_KEY, "1");
      } catch {
        /* ignore */
      }
      window.removeEventListener("keydown", finish);
      window.removeEventListener("pointerdown", finish);
      setPhase("leaving");
      window.setTimeout(() => setPhase("hidden"), FADE_MS);
    };
    finishRef.current = finish;

    window.addEventListener("keydown", finish);
    window.addEventListener("pointerdown", finish);

    setPhase("booting");
    // The full-screen overlay is mounted now — drop the pre-paint CSS
    // cover (html[data-booting]) that hid the page until this moment.
    document.documentElement.removeAttribute("data-booting");
    // Reset on (re)mount — dev StrictMode re-runs effects and would
    // otherwise append a duplicate set of boot lines.
    setLines([]);

    let i = 0;
    const typeLine = () => {
      if (finished) return;
      if (i >= BOOT_LINES.length) {
        setPhase("skippable");
        timers.push(window.setTimeout(finish, HOLD_MS));
        return;
      }
      setLines((prev) => [...prev, BOOT_LINES[i]]);
      i += 1;
      timers.push(window.setTimeout(typeLine, LINE_DELAY_MS));
    };
    timers.push(window.setTimeout(typeLine, START_DELAY_MS));

    return () => {
      finished = true;
      timers.forEach((t) => window.clearTimeout(t));
      window.removeEventListener("keydown", finish);
      window.removeEventListener("pointerdown", finish);
    };
  }, []);

  // Move focus to the Skip button as soon as the overlay appears, so
  // keyboard/screen-reader users land on a real actionable control
  // instead of being stuck behind a full-screen overlay.
  useEffect(() => {
    if (phase === "booting") {
      skipButtonRef.current?.focus();
    }
  }, [phase]);

  if (phase === "hidden") return null;

  return (
    <div className={`boot-screen${phase === "leaving" ? " boot-screen--leaving" : ""}`}>
      <pre className="boot-log" aria-hidden="true">
        {lines.map((line, i) => renderLine(line, i))}
      </pre>
      <p className="boot-hint" hidden={phase !== "skippable"}>
        Press any key to continue_
      </p>
      <button
        ref={skipButtonRef}
        type="button"
        className="os-btn boot-skip"
        aria-label="Skip boot animation"
        onClick={() => finishRef.current()}
      >
        Skip
      </button>
    </div>
  );
}
