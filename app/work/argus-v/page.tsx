import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Window } from "@/components/os/Window";
import { Reveal } from "@/components/ui/Reveal";
import { FlowDiagram } from "@/components/case/FlowDiagram";
import { site } from "@/lib/site";
import {
  caseMeta,
  hero,
  problem,
  system,
  thesis,
  lessons,
  footer as caseFooter,
} from "@/lib/case-argus";

/**
 * /work/argus-v — case study for A.R.G.U.S-V, reskinned into the
 * PID 1 — Agent OS look. Every section lives inside window chrome
 * (components/os/Window); MenuBar/BootSequence/Dock/StatusBar are
 * already mounted globally by app/layout.tsx. All copy comes from
 * lib/case-argus.ts — content unchanged, only the surface reskinned.
 */
const SECTION = "mx-auto max-w-6xl px-6 pb-14 sm:px-8 sm:pb-16";

const caseStudyJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareSourceCode",
  name: hero.title,
  description: caseMeta.description,
  author: {
    "@type": "Person",
    name: "S Sai Kumar",
    url: "https://saik.co.in",
  },
  keywords: hero.chips.join(", "),
  url: `${site.url}/work/argus-v/`,
  datePublished: "2026",
};

export const metadata: Metadata = {
  title: caseMeta.title,
  description: caseMeta.description,
  alternates: { canonical: "/work/argus-v/" },
  openGraph: {
    type: "article",
    url: `${site.url}/work/argus-v/`,
    title: caseMeta.title,
    description: caseMeta.description,
    siteName: site.shortName,
  },
  twitter: {
    card: "summary_large_image",
    title: caseMeta.title,
    description: caseMeta.description,
  },
};

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

export default function ArgusVCaseStudy() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(caseStudyJsonLd) }}
      />

      <div className="mx-auto max-w-6xl px-6 pt-6 sm:px-8">
        <a
          href="/"
          className="font-mono text-xs uppercase tracking-[0.14em] text-muted transition-colors duration-150 ease-[var(--ease-signature)] hover:text-amber"
        >
          ← saikumar-os
        </a>
      </div>

      <main className="flex-1">
        {/* ── Hero ─────────────────────────────────────────── */}
        <section className="mx-auto max-w-6xl px-6 pb-14 pt-8 sm:px-8 sm:pb-16 sm:pt-10">
          <Reveal>
            <Window title="argus-v — case_study.md" aria-label="Case study overview">
              <div className="window-pad">
                <p className="font-mono text-xs uppercase tracking-[0.25em] text-amber">
                  {hero.kicker}
                </p>
                <h1 className="font-display mt-3 text-4xl font-bold leading-[0.95] tracking-tight text-text sm:text-5xl lg:text-6xl">
                  {hero.title}
                </h1>
                <p className="mt-5 max-w-2xl font-mono text-base leading-relaxed text-muted sm:text-lg">
                  {hero.subtitle}
                </p>

                <ul className="mt-7 flex flex-wrap gap-2" aria-label="Technologies used">
                  {hero.chips.map((chip) => (
                    <li
                      key={chip}
                      className="rounded border border-border px-2 py-1 font-mono text-[10.5px] uppercase tracking-[0.05em] text-muted"
                    >
                      {chip}
                    </li>
                  ))}
                </ul>
                <p className="mt-4 font-mono text-xs text-muted/70">{hero.meta}</p>
              </div>
            </Window>
          </Reveal>
        </section>

        {/* ── 01 — The problem ────────────────────────────── */}
        <section className={SECTION}>
          <Reveal>
            <Window title="01_problem.log" aria-label={problem.title}>
              <div className="window-pad">
                <p className="font-mono text-xs uppercase tracking-[0.25em] text-amber">
                  {problem.kicker}
                </p>
                <h2 className="font-display mt-3 text-2xl font-bold leading-snug tracking-tight text-text sm:text-3xl">
                  {renderAccent(problem.title)}
                </h2>
                <p className="mt-5 max-w-2xl leading-relaxed text-muted">{problem.paragraph}</p>
              </div>
            </Window>
          </Reveal>
        </section>

        {/* ── 02 — The system ─────────────────────────────── */}
        <section className={SECTION}>
          <Reveal>
            <Window title="02_system.exe" aria-label={system.title}>
              <div className="window-pad pb-4">
                <p className="font-mono text-xs uppercase tracking-[0.25em] text-amber">
                  {system.kicker}
                </p>
                <h2 className="font-display mt-3 text-2xl font-bold leading-snug tracking-tight text-text sm:text-3xl">
                  {renderAccent(system.title)}
                </h2>
                <p className="mt-4 max-w-2xl leading-relaxed text-muted">{system.intro}</p>
              </div>

              <FlowDiagram steps={system.steps} />

              <div className="border-t border-border px-5 py-4 sm:px-6">
                <p className="font-mono text-xs text-muted">
                  <span className="text-green">$</span> note — {system.note}
                </p>
              </div>
            </Window>
          </Reveal>
        </section>

        {/* ── 03 — What made it fast ──────────────────────── */}
        <section className={SECTION}>
          <Reveal>
            <Window title="03_results.stat" aria-label={thesis.title}>
              <div className="window-pad pb-5">
                <p className="font-mono text-xs uppercase tracking-[0.25em] text-amber">
                  {thesis.kicker}
                </p>
                <h2 className="font-display mt-3 text-2xl font-bold leading-snug tracking-tight text-text sm:text-3xl">
                  {renderAccent(thesis.title)}
                </h2>
                <p className="mt-5 max-w-3xl rounded border border-border bg-bg px-4 py-3 font-mono text-sm leading-relaxed text-green">
                  &ldquo;{thesis.quote}&rdquo;
                </p>
              </div>

              <div className="grid divide-y divide-border border-t border-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                {thesis.stats.map((stat) => (
                  <div key={stat.label} className="px-5 py-5 sm:px-6">
                    <p className="font-display text-3xl font-bold tracking-tight text-green sm:text-4xl">
                      {stat.value}
                    </p>
                    <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.1em] text-muted">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-border">
                {thesis.findings.map((finding) => (
                  <div
                    key={finding.number}
                    className="flex flex-col gap-1 border-t border-border px-5 py-4 first:border-t-0 sm:flex-row sm:gap-4 sm:px-6"
                  >
                    <span className="shrink-0 font-mono text-xs text-amber">
                      [{finding.number}]
                    </span>
                    <div>
                      <p className="font-semibold text-text">{finding.title}</p>
                      <p className="mt-1 font-mono text-[12.5px] leading-relaxed text-muted">
                        {finding.body}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Window>
          </Reveal>
        </section>

        {/* ── 04 — Hard-won lessons ───────────────────────── */}
        <section className={SECTION}>
          <Reveal>
            <Window title="04_lessons.diff" aria-label={lessons.title}>
              <div className="window-pad pb-4">
                <p className="font-mono text-xs uppercase tracking-[0.25em] text-amber">
                  {lessons.kicker}
                </p>
                <h2 className="font-display mt-3 text-2xl font-bold leading-snug tracking-tight text-text sm:text-3xl">
                  {renderAccent(lessons.title)}
                </h2>
              </div>

              <div className="border-t border-border">
                {lessons.items.map((item) => (
                  <div key={item.problem} className="border-t border-border px-5 py-4 first:border-t-0 sm:px-6">
                    <p className="font-mono text-[12.5px] leading-relaxed text-red">
                      − {item.problem}
                    </p>
                    <p className="mt-1 font-mono text-[12.5px] leading-relaxed text-green">
                      + {item.fix}
                    </p>
                  </div>
                ))}
              </div>
            </Window>
          </Reveal>
        </section>

        {/* ── Footer finale ────────────────────────────────── */}
        <section className="mx-auto max-w-6xl px-6 pb-24 sm:px-8 sm:pb-28">
          <Reveal>
            <Window title="contact — mailto.sh" aria-label="Contact">
              <div className="window-pad pb-3">
                <p className="font-mono text-xs uppercase tracking-[0.25em] text-muted">
                  {caseFooter.kicker}
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-5 py-4 sm:px-6">
                <span className="font-mono text-sm text-muted">$ echo $EMAIL →</span>
                <a
                  href={`mailto:${caseFooter.email}`}
                  className="font-mono text-sm text-text underline decoration-border underline-offset-4 transition-colors duration-150 ease-[var(--ease-signature)] hover:text-amber hover:decoration-amber"
                >
                  {caseFooter.email}
                </a>
              </div>
            </Window>
            <a href={caseFooter.backHref} className="os-btn mt-8 inline-flex">
              {caseFooter.backLabel}
            </a>
          </Reveal>
        </section>
      </main>
    </>
  );
}
