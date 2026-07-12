"use client";

import { useEffect, useState } from "react";

/** Formats a Date as HH:MM:SS in the Asia/Kolkata timezone. */
function formatIST(date: Date): string {
  return date.toLocaleTimeString("en-GB", {
    timeZone: "Asia/Kolkata",
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

/**
 * ClockCell — live IST clock for the bento grid. Renders a placeholder
 * until mounted so server and first client render match exactly (the
 * actual time can only be known client-side without risking a hydration
 * mismatch against the server-rendered markup).
 */
export function ClockCell() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    setTime(formatIST(new Date()));
    const id = setInterval(() => setTime(formatIST(new Date())), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex h-full flex-col justify-between gap-6">
      <h3 className="sr-only">Local time</h3>
      <p
        className="font-mono text-2xl font-semibold tabular-nums text-foreground"
        aria-live="off"
      >
        {time ?? "--:--:--"}
      </p>
      <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-muted">
        <span
          aria-hidden="true"
          className="size-1.5 shrink-0 rounded-full bg-[var(--accent-2)] animate-pulse"
        />
        based in india &middot; IST
      </div>
    </div>
  );
}
