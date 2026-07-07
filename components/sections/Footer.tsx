import { site } from "@/lib/site";

/** Minimal site footer: copyright and colophon line. */
export function Footer() {
  return (
    <footer className="border-t border-white/5 py-8">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-6 sm:px-8">
        <p className="font-mono text-xs text-muted">
          © 2026 {site.name}
        </p>
        <p className="font-mono text-xs text-muted">
          Built with Next.js — designed with intent
        </p>
      </div>
    </footer>
  );
}
