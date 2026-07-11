import type { Metadata } from "next";
import { IslandNav } from "@/components/ui/IslandNav";
import { Footer } from "@/components/sections/Footer";

export const metadata: Metadata = {
  title: "Not found",
  robots: { index: false },
};

/**
 * Custom 404 — matches the dark editorial token system instead of Next's
 * default error page. Rendered for any unmatched route (out/404.html).
 */
export default function NotFound() {
  return (
    <>
      <IslandNav />
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-32 text-center sm:px-8">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-muted">
          04 - Not found
        </p>
        <h1 className="mt-3 text-5xl font-bold leading-[0.95] tracking-tight text-foreground sm:text-6xl">
          Page not <span className="accent-serif text-accent">found</span>.
        </h1>
        <p className="mt-5 max-w-md font-mono text-sm text-muted">
          agent could not resolve this route. traceback: page not found in
          any known workflow.
        </p>
        <a
          href="/"
          className="mt-10 rounded-full bg-accent px-7 py-3 text-sm font-semibold text-background transition-colors duration-300 ease-[var(--ease-signature)] hover:bg-accent/85"
        >
          Back to home
        </a>
      </main>
      <Footer />
    </>
  );
}
