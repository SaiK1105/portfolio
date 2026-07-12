import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Window } from "@/components/os/Window";
import { Reveal } from "@/components/ui/Reveal";
import { site } from "@/lib/site";
import { hero as argusHero } from "@/lib/case-argus";
import { hero as vompHero } from "@/lib/case-vomp";

/**
 * /work — index of case studies, reskinned into the PID 1 — Agent OS
 * look. MenuBar/BootSequence/Dock/StatusBar are already mounted
 * globally by app/layout.tsx; this page just supplies the slim back
 * link + the two case-study windows.
 */

export const metadata: Metadata = {
  title: "Work — S Sai Kumar",
  description: "Case studies — A.R.G.U.S-V and Voice of Monetary Policy.",
  alternates: { canonical: "/work/" },
  openGraph: {
    type: "website",
    url: `${site.url}/work/`,
    title: "Work — S Sai Kumar",
    description: "Case studies — A.R.G.U.S-V and Voice of Monetary Policy.",
    siteName: site.shortName,
  },
  twitter: {
    card: "summary_large_image",
    title: "Work — S Sai Kumar",
    description: "Case studies — A.R.G.U.S-V and Voice of Monetary Policy.",
  },
};

const cases = [
  {
    href: "/work/argus-v/",
    slug: "argus-v",
    title: argusHero.title,
    oneLiner:
      "A video intelligence system that answers questions about videos while they're still processing.",
    meta: "01 — flagship system",
  },
  {
    href: "/work/vomp/",
    slug: "vomp",
    title: vompHero.title,
    oneLiner:
      "Classifying the Fed's hawkish/dovish stance from vocal tone and text, fused and tested against real market moves.",
    meta: "02 — applied research",
  },
] as const;

/** Renders {braced} fragments as the OS's primary terminal accent (green). */
function renderAccent(text: string): ReactNode[] {
  return text.split(/(\{[^}]+\})/).map((part, i) =>
    part.startsWith("{") ? (
      <span key={i} className="text-green">
        {part.slice(1, -1)}
      </span>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

export default function WorkIndex() {
  return (
    <>
      <div className="mx-auto max-w-6xl px-6 pt-6 sm:px-8">
        <a
          href="/"
          className="font-mono text-xs uppercase tracking-[0.14em] text-muted transition-colors duration-150 ease-[var(--ease-signature)] hover:text-amber"
        >
          ← saikumar-os
        </a>
      </div>

      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-6 pb-12 pt-8 sm:px-8 sm:pb-16 sm:pt-10">
          <Reveal>
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-amber">/work</p>
            <h1 className="font-display mt-3 text-4xl font-bold leading-[0.95] tracking-tight text-text sm:text-5xl lg:text-6xl">
              {renderAccent("Selected {work}, in depth.")}
            </h1>
            <p className="mt-5 max-w-xl leading-relaxed text-muted">
              Two projects, written up in full — the problem, the system, the results, and what
              went wrong along the way.
            </p>
          </Reveal>
        </section>

        <section className="mx-auto max-w-6xl px-6 pb-24 sm:px-8 sm:pb-28">
          <div className="grid gap-6 sm:grid-cols-2">
            {cases.map((item, i) => (
              <Reveal key={item.href} delay={i}>
                <a
                  href={item.href}
                  className="group block h-full transition-transform duration-300 ease-[var(--ease-signature)] hover:-translate-y-1"
                >
                  <Window
                    title={`${item.slug} — case_study.md`}
                    className="h-full"
                    aria-label={item.title}
                  >
                    <div className="window-pad flex h-full flex-col">
                      <p className="font-mono text-xs uppercase tracking-[0.25em] text-muted">
                        {item.meta}
                      </p>
                      <h2 className="font-display mt-3 text-2xl font-bold tracking-tight text-text sm:text-3xl">
                        {item.title}
                      </h2>
                      <p className="mt-4 flex-1 leading-relaxed text-muted">{item.oneLiner}</p>
                      <p className="mt-8 font-mono text-sm text-amber transition-colors duration-150 ease-[var(--ease-signature)] group-hover:text-green">
                        Read the case study →
                      </p>
                    </div>
                  </Window>
                </a>
              </Reveal>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
