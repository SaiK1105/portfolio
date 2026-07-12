"use client";

import { useEffect, useState } from "react";

/**
 * Primary nav. Downstream section agents must land these anchors:
 * id="home" (hero), id="projects", id="skills", id="contact".
 */
const NAV_LINKS = [
  { label: "Portfolio", href: "#home" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
] as const;

/** localStorage key — also read by the no-flash theme-init script in layout.tsx. */
const THEME_KEY = "sk_os_theme";

function pad(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

function formatClock(date: Date): string {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

/**
 * MenuBar — fixed (sticky) top bar: prompt-glyph logo + primary nav on
 * the left, agent-online status + live clock + theme toggle on the
 * right. The clock renders a static placeholder until mounted so the
 * server and first client paint match exactly (real time is only knowable
 * client-side). The theme toggle flips `data-theme` on <html> and
 * persists the choice; layout.tsx applies the saved value synchronously
 * before hydration so there's no flash on reload.
 */
export function MenuBar() {
  const [time, setTime] = useState<string | null>(null);
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    setTime(formatClock(new Date()));
    const id = window.setInterval(() => setTime(formatClock(new Date())), 1000);

    const current = document.documentElement.getAttribute("data-theme");
    setTheme(current === "light" ? "light" : "dark");

    return () => window.clearInterval(id);
  }, []);

  function toggleTheme() {
    const next = theme === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      /* private browsing / storage disabled — theme just won't persist */
    }
    setTheme(next);
  }

  return (
    <header className="menubar">
      <div className="menubar-left">
        <span className="menubar-glyph" aria-hidden="true">
          &gt;_
        </span>
        <nav className="menubar-nav" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
      </div>
      <div className="menubar-right">
        <span className="agent-status">
          <span className="pulse-dot" aria-hidden="true" />
          Agent Online
        </span>
        <span className="menubar-clock" suppressHydrationWarning>
          {time ?? "00:00:00"}
        </span>
        <button
          type="button"
          className="theme-toggle"
          aria-label="Toggle light and dark theme"
          aria-pressed={theme === "light"}
          onClick={toggleTheme}
        >
          <span className="theme-toggle-knob" aria-hidden="true">
            {theme === "light" ? "☀" : "☾"}
          </span>
        </button>
      </div>
    </header>
  );
}
