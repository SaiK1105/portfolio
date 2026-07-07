import type { ReactNode } from "react";

/**
 * Renders copy where {braced} fragments become serif-italic accent text.
 * "Let's build {something together}." → sans + <em class="accent-serif">
 */
export function renderAccent(text: string): ReactNode[] {
  return text.split(/(\{[^}]+\})/).map((part, i) =>
    part.startsWith("{") ? (
      <em key={i} className="accent-serif text-accent">
        {part.slice(1, -1)}
      </em>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}
