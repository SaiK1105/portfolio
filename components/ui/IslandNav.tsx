"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ISLAND_SPRING } from "@/lib/motion";

/** Anchor links shown in the expanded island. Mobile shows a subset. */
const LINKS = [
  { label: "Work", href: "#projects" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills", desktopOnly: true },
  { label: "Contact", href: "#contact" },
] as const;

/**
 * Fixed top-center "dynamic island" nav. Collapses to a monogram pill
 * after the page has scrolled past the hero, expands on hover/focus or
 * whenever the user is back near the top. Mobile keeps it expanded
 * (smaller) since there's no room for a hover affordance.
 */
export function IslandNav() {
  const [nearTop, setNearTop] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const onScroll = () => setNearTop(window.scrollY < 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 639px)");
    const onChange = () => setIsMobile(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  const expanded = isMobile || nearTop || isHovering;
  const links = isMobile
    ? LINKS.filter((link) => !("desktopOnly" in link && link.desktopOnly))
    : LINKS;

  return (
    <div className="fixed inset-x-0 top-5 z-50 flex justify-center px-4">
      <motion.nav
        aria-label="Main"
        layout
        onHoverStart={() => setIsHovering(true)}
        onHoverEnd={() => setIsHovering(false)}
        onFocus={() => setIsHovering(true)}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) {
            setIsHovering(false);
          }
        }}
        transition={ISLAND_SPRING}
        className="flex items-center gap-1 rounded-full border border-white/10 bg-black/85 px-2 py-2 shadow-[inset_0_1px_0_rgb(255_255_255_/_0.08),0_8px_30px_rgb(0_0_0_/_0.6)] backdrop-blur-xl sm:gap-2 sm:px-2.5"
      >
        <a
          href="#hero"
          aria-label="Back to top"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-mono text-xs tracking-wide text-foreground transition-colors hover:bg-white/5 sm:h-9 sm:w-9"
        >
          SK
        </a>
        <motion.ul
          layout
          className="flex items-center overflow-hidden"
          animate={{
            width: expanded ? "auto" : 0,
            opacity: expanded ? 1 : 0,
            marginLeft: expanded ? 4 : 0,
          }}
          transition={ISLAND_SPRING}
          aria-hidden={!expanded}
        >
          {links.map((link) => (
            <li key={link.href} className="shrink-0">
              <a
                href={link.href}
                tabIndex={expanded ? 0 : -1}
                className="block whitespace-nowrap rounded-full px-3 py-1.5 font-sans text-sm text-muted transition-colors hover:text-foreground sm:px-3.5"
              >
                {link.label}
              </a>
            </li>
          ))}
        </motion.ul>
      </motion.nav>
    </div>
  );
}
