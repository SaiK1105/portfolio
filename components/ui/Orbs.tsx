/**
 * Ambient background orbs — two blurred gradient blobs (violet + cyan)
 * that slowly drift behind all page content. Pure CSS, server component,
 * no JS/motion library needed. Respects prefers-reduced-motion (static
 * via the global reduced-motion block in globals.css).
 */
export function Orbs() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="orb orb-violet" />
      <div className="orb orb-cyan" />
      <div className="orb orb-pink" />
    </div>
  );
}
