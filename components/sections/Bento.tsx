import { education, projects } from "@/lib/content";
import { ClockCell } from "@/components/ui/ClockCell";
import { Heatmap } from "@/components/ui/Heatmap";
import { ManifestoReveal } from "@/components/ui/ManifestoReveal";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SkillsMarquee } from "@/components/ui/SkillsMarquee";

/** Mono kicker-style label, reused as the visible heading for each cell. */
function CellLabel({ children }: { children: string }) {
  return (
    <p className="font-mono text-xs uppercase tracking-[0.25em] text-muted">
      {children}
    </p>
  );
}

/**
 * Bento — the dashboard. Replaces the old stacked About/Skills/Github/
 * Education sections with a single dense bento grid. Span map (lg, 12
 * cols; mobile is grid-cols-2 with every cell at col-span-2 = full
 * width so nothing overflows or leaves a hole):
 *
 *   row 1  [ manifesto 7 (row-span 2) ][ stat 2 ][ stat 3 ]
 *   row 2  [ manifesto (cont.)        ][ stat 2 ][ clock 3 ]
 *   row 3  [ skills 7                 ][ education 5       ]
 *   row 4  [ heatmap 12                                    ]
 *
 * This relies on plain CSS grid auto-placement: cells are listed in
 * source order with only col/row-span utilities (no manual grid-column
 * placement), and the auto-placement algorithm skips cells already
 * occupied by the manifesto's row-span, so the map above falls out
 * automatically with zero gaps.
 */
export function Bento() {
  const projectsShipped = projects.items.length;
  const gradYear = education.items[0]?.period.match(/\d{4}/)?.[0] ?? education.items[0]?.period;

  return (
    <section
      id="about"
      className="mx-auto max-w-6xl scroll-mt-24 px-6 py-24 sm:px-8 sm:py-28"
    >
      <SectionHeading kicker="01 — the dashboard" title="Systems that {reason and act}." />

      <div className="mt-14 grid grid-cols-2 auto-rows-auto gap-4 lg:grid-cols-12">
        {/* Manifesto */}
        <Reveal
          delay={0}
          className="card-surface col-span-2 rounded-2xl p-6 lg:col-span-7 lg:row-span-2 lg:flex lg:flex-col lg:justify-center"
        >
          <h3 className="sr-only">Manifesto</h3>
          <ManifestoReveal />
        </Reveal>

        {/* Stat: DGX H200 */}
        <Reveal
          delay={1}
          className="card-surface col-span-2 flex flex-col justify-between gap-4 rounded-2xl p-6 lg:col-span-2"
          aria-label="8 times H200 GPUs orchestrated"
        >
          <span className="grad-text text-4xl font-extrabold">8&times; H200</span>
          <span className="font-mono text-xs text-muted">GPUs orchestrated</span>
        </Reveal>

        {/* Stat: projects shipped */}
        <Reveal
          delay={2}
          className="card-surface col-span-2 flex flex-col justify-between gap-4 rounded-2xl p-6 lg:col-span-3"
          aria-label={`${projectsShipped} projects shipped`}
        >
          <span className="grad-text text-4xl font-extrabold">{projectsShipped}</span>
          <span className="font-mono text-xs text-muted">projects shipped</span>
        </Reveal>

        {/* Stat: graduation year */}
        <Reveal
          delay={3}
          className="card-surface col-span-2 flex flex-col justify-between gap-4 rounded-2xl p-6 lg:col-span-2"
          aria-label={`${gradYear}, B.Tech at SASTRA`}
        >
          <span className="grad-text text-4xl font-extrabold">{gradYear}</span>
          <span className="font-mono text-xs text-muted">B.Tech, SASTRA</span>
        </Reveal>

        {/* Clock */}
        <Reveal
          delay={4}
          className="card-surface col-span-2 rounded-2xl p-6 lg:col-span-3"
        >
          <ClockCell />
        </Reveal>

        {/* Skills */}
        <Reveal
          delay={5}
          id="skills"
          className="card-surface col-span-2 scroll-mt-24 rounded-2xl p-6 lg:col-span-7"
        >
          <h3>
            <CellLabel>skills</CellLabel>
          </h3>
          <div className="mt-6">
            <SkillsMarquee />
          </div>
        </Reveal>

        {/* Education */}
        <Reveal
          delay={6}
          className="card-surface col-span-2 rounded-2xl p-6 lg:col-span-5"
        >
          <h3>
            <CellLabel>education</CellLabel>
          </h3>
          <div className="mt-5 flex flex-col gap-3">
            {education.items.map((item) => (
              <div key={item.school} className="flex items-center gap-2.5 text-sm">
                <span
                  aria-hidden="true"
                  className={`size-1.5 shrink-0 rounded-full ${
                    item.status === "present" ? "bg-status-present" : "bg-accent-1/40"
                  }`}
                />
                <span className="text-foreground">{item.school}</span>
                <span className="text-muted">&middot; {item.period}</span>
              </div>
            ))}
          </div>
          <div className="mt-5 flex flex-wrap gap-2" aria-label="Certifications">
            {education.certifications.map((cert) => (
              <span
                key={cert}
                className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-[11px] text-muted"
              >
                {cert}
              </span>
            ))}
          </div>
        </Reveal>

        {/* GitHub heatmap */}
        <Reveal
          delay={7}
          id="github"
          className="card-surface col-span-2 scroll-mt-24 rounded-2xl p-6 lg:col-span-12"
        >
          <h3>
            <CellLabel>github</CellLabel>
          </h3>
          <div className="mt-6">
            <Heatmap />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
