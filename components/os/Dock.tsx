"use client";

import { site } from "@/lib/site";

type DockItem = {
  id: string;
  label: string;
  glyph: string;
  href: string;
  running?: boolean;
};

/**
 * Real anchor targets. Downstream section agents must land: id="home"
 * (hero/terminal), id="projects", id="skills", id="github"
 * (contributions/cal.sh panel), id="contact".
 */
const DOCK_ITEMS: DockItem[] = [
  { id: "terminal", label: "Terminal", glyph: ">_", href: "/#home", running: true },
  { id: "projects", label: "Projects", glyph: "PR", href: "/#projects" },
  { id: "skills", label: "Skills", glyph: "SK", href: "/#skills" },
  { id: "github", label: "GitHub", glyph: "GH", href: "/#github" },
  { id: "contact", label: "Contact", glyph: "@", href: "/#contact" },
  { id: "mail", label: "Email", glyph: "✉", href: `mailto:${site.email}` },
];

/**
 * Dock — floating bottom-center app dock. Every icon is a real anchor
 * link (or mailto) to a section of the page, not a fake OS chrome
 * prop. Hover/focus lifts with the shared spring easing (killed under
 * prefers-reduced-motion by the global motion block in globals.css).
 * The Terminal icon carries a running-dot to read as "the live agent
 * you're already looking at."
 */
export function Dock() {
  return (
    <nav className="dock-wrap" aria-label="Application dock">
      <div className="dock">
        {DOCK_ITEMS.map((item) => (
          <a
            key={item.id}
            href={item.href}
            aria-label={item.label}
            className={`dock-icon${item.running ? " dock-icon--terminal" : ""}`}
          >
            <span className="dock-glyph" aria-hidden="true">
              {item.glyph}
            </span>
            {item.running ? <span className="dock-running-dot" aria-hidden="true" /> : null}
            <span className="dock-label" aria-hidden="true">
              {item.label}
            </span>
          </a>
        ))}
      </div>
    </nav>
  );
}
