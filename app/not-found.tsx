import type { Metadata } from "next";
import { Window } from "@/components/os/Window";

export const metadata: Metadata = {
  title: "404 — kernel panic — S Sai Kumar",
  robots: { index: false },
};

/**
 * Custom 404 — an OS-flavored "kernel panic" terminal window, replacing
 * Next's default error page. MenuBar/BootSequence/Dock/StatusBar are
 * already mounted globally by app/layout.tsx, so this page only needs
 * its own <main> content. Rendered for any unmatched route
 * (out/404.html, per next.config.ts `output: "export"`).
 */
export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-24 sm:px-8">
      <div className="w-full max-w-xl">
        <Window title="kernel — panic.log" aria-label="404 — page not found">
          <div className="window-pad">
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-red">
              fatal — route unresolved
            </p>
            <h1 className="font-display mt-3 text-4xl font-bold leading-[0.95] tracking-tight text-text sm:text-5xl">
              kernel panic
            </h1>
            <p className="mt-4 max-w-md font-mono text-sm leading-relaxed text-muted">
              agentd could not resolve this route in any known workflow.
            </p>

            <div className="mt-6 rounded border border-border bg-bg px-4 py-3 font-mono text-[12.5px] leading-relaxed">
              <p>
                <span className="text-red">[FATAL]</span>{" "}
                <span className="text-muted">segmentation fault — route not found</span>
              </p>
              <p className="mt-1 text-muted">agentd: no handler registered for this path</p>
              <p className="mt-2">
                <span className="text-green">$</span>{" "}
                <span className="text-text">cd / &amp;&amp; ls</span>
              </p>
            </div>

            <a href="/" className="os-btn mt-8 inline-flex">
              ← back to saikumar-os
            </a>
          </div>
        </Window>
      </div>
    </main>
  );
}
