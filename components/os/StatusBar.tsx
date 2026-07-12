"use client";

import { useEffect, useState } from "react";
import { site } from "@/lib/site";

function pad(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

function formatUptime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

/**
 * StatusBar — bottom status line, replaces the old Footer. Renders a
 * static "00:00:00" placeholder until mounted (hydration-safe), then
 * ticks a simple session-uptime counter client-side.
 */
export function StatusBar() {
  const [uptime, setUptime] = useState<string | null>(null);

  useEffect(() => {
    const start = Date.now();
    setUptime(formatUptime(0));
    const id = window.setInterval(() => {
      setUptime(formatUptime(Date.now() - start));
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  const domain = site.url.replace(/^https?:\/\//, "");

  return (
    <footer className="statusbar">
      <span>saikumar-os v2.0</span>
      <span className="statusbar-dot" aria-hidden="true">
        ·
      </span>
      <span>
        uptime <span suppressHydrationWarning>{uptime ?? "00:00:00"}</span>
      </span>
      <span className="statusbar-dot" aria-hidden="true">
        ·
      </span>
      <span>
        build 2026.07 · {domain}
      </span>
    </footer>
  );
}
