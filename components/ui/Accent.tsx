import type { ReactNode } from "react";

/**
 * Renders copy where {braced} fragments become gradient accent text.
 * "Let's build {something together}." → sans + <span class="grad-text">
 */
export function renderAccent(text: string): ReactNode[] {
  return text.split(/(\{[^}]+\})/).map((part, i) =>
    part.startsWith("{") ? (
      <span key={i} className="grad-text font-semibold">
        {part.slice(1, -1)}
      </span>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}
