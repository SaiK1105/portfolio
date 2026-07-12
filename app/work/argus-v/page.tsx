import type { Metadata } from "next";
import { renderAccent } from "@/components/ui/Accent";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TraceDivider } from "@/components/ui/TraceDivider";
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
 * /work/argus-v — case study for A.R.G.U.S-V.
 * Server-rendered, static. No IslandNav (home-only) — a slim top bar
 * links back instead. All copy lives in lib/case-argus.ts.
 *
 * Single grid: every section is max-w-6xl mx-auto px-6 sm:px-8,
 * py-20 sm:py-24, left-aligned — no centered narrow columns.
 */
const SECTION = "mx-auto max-w-6xl px-6 py-20 sm:px-8 sm:py-24";

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

export default function ArgusVCaseStudy() {
  return (
    <>
      <div className="mx-auto max-w-6xl px-6 pt-8 sm:px-8">
        <a
          href="/"
          className="font-mono text-sm text-muted transition-colors duration-300 ease-[var(--ease-signature)] hover:text-accent"
        >
          ← saik.co.in
        </a>
      </div>

      {/* NOT flex: flex children with mx-auto don't stretch, so each
          section would shrink to fit-content and self-center. */}
      <main className="flex-1">
        {/* ── Hero ─────────────────────────────────────────── */}
        <section className="mx-auto max-w-6xl px-6 pb-20 pt-12 sm:px-8 sm:pb-24 sm:pt-16">
          <Reveal>
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-muted">
              {hero.kicker}
            </p>
            <h1 className="mt-3 text-5xl font-bold leading-[0.95] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              {hero.title}
            </h1>
            <p className="grad-text mt-6 max-w-2xl text-2xl font-semibold sm:text-3xl">
              {hero.subtitle}
            </p>
          </Reveal>

          <Reveal delay={1}>
            <ul className="mt-8 flex flex-wrap gap-2" aria-label="Technologies used">
              {hero.chips.map((chip) => (
                <li
                  key={chip}
                  className="rounded-full border border-white/8 px-3 py-1 font-mono text-[11px] text-muted/80"
                >
                  {chip}
                </li>
              ))}
            </ul>
            <p className="mt-4 font-mono text-xs text-muted/60">{hero.meta}</p>
          </Reveal>
        </section>

        <TraceDivider />

        {/* ── 01 — The problem ────────────────────────────── */}
        <section className={SECTION}>
          <SectionHeading kicker={problem.kicker} title={problem.title} />
          <Reveal delay={1}>
            <p className="mt-8 max-w-2xl leading-relaxed text-muted">{problem.paragraph}</p>
          </Reveal>
        </section>

        <TraceDivider />

        {/* ── 02 — The system ─────────────────────────────── */}
        <section className={SECTION}>
          <SectionHeading kicker={system.kicker} title={system.title} />
          <Reveal delay={1}>
            <p className="mt-5 max-w-2xl leading-relaxed text-muted">{system.intro}</p>
          </Reveal>

          <FlowDiagram steps={system.steps} />

          <Reveal delay={2}>
            <p className="mt-8 max-w-xl font-mono text-xs text-muted">{system.note}</p>
          </Reveal>
        </section>

        <TraceDivider />

        {/* ── 03 — What made it fast ──────────────────────── */}
        <section className={SECTION}>
          <SectionHeading kicker={thesis.kicker} title={thesis.title} />

          <Reveal delay={1}>
            <p className="grad-text mt-8 max-w-3xl text-2xl font-semibold leading-snug sm:text-3xl">
              &ldquo;{thesis.quote}&rdquo;
            </p>
          </Reveal>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {thesis.stats.map((stat, i) => (
              <Reveal key={stat.label} delay={i}>
                <div className="card-surface p-6">
                  <p className="grad-text text-5xl font-extrabold tracking-tight sm:text-6xl">
                    {stat.value}
                  </p>
                  <p className="mt-2 font-mono text-xs text-muted">{stat.label}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {thesis.findings.map((finding, i) => (
              <Reveal key={finding.number} delay={i}>
                <article className="border-t border-white/10 pt-6">
                  <p className="font-mono text-xs text-accent/60">{finding.number}</p>
                  <h3 className="mt-2 text-lg font-bold tracking-tight text-foreground">
                    {finding.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {renderAccent(finding.body)}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        <TraceDivider />

        {/* ── 04 — Hard-won lessons ───────────────────────── */}
        <section className={SECTION}>
          <SectionHeading kicker={lessons.kicker} title={lessons.title} />

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {lessons.items.map((item, i) => (
              <Reveal key={item.problem} delay={i}>
                <div className="card-surface h-full rounded-2xl p-6">
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent-2">
                    {item.problem}
                  </p>
                  <p className="mt-3 leading-relaxed text-muted">
                    <span className="text-accent-1">→</span> {item.fix}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <TraceDivider />

        {/* ── Footer finale ────────────────────────────────── */}
        <section className={SECTION}>
          <Reveal>
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-muted">
              {caseFooter.kicker}
            </p>
            <a
              href={`mailto:${caseFooter.email}`}
              className="mt-4 inline-block text-2xl text-foreground underline decoration-accent/40 underline-offset-8 transition-colors duration-300 ease-[var(--ease-signature)] hover:decoration-accent sm:text-3xl"
            >
              {caseFooter.email}
            </a>
            <a
              href={caseFooter.backHref}
              className="mt-8 block font-mono text-sm text-accent transition-colors duration-300 ease-[var(--ease-signature)] hover:text-foreground"
            >
              {caseFooter.backLabel}
            </a>
          </Reveal>
        </section>
      </main>
    </>
  );
}
