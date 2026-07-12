import type { ReactElement } from "react";
import { projects } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

/**
 * Projects — editorial numbered cards, stacked vertically.
 * Copy sourced entirely from lib/content.ts (projects.*). Each card gets
 * an abstract, decorative SVG motif in the header area for visual
 * identity — purely presentational (aria-hidden), no content.ts changes.
 */

/** ARGUS-V (01): filmstrip — three offset rounded rectangles + sprocket dots. */
function ArgusMotif() {
  return (
    <svg viewBox="0 0 140 80" fill="none" className="h-full w-full">
      <rect x="10" y="24" width="92" height="46" rx="6" stroke="currentColor" strokeWidth="1.5" />
      <rect x="20" y="15" width="92" height="46" rx="6" stroke="currentColor" strokeWidth="1.5" />
      <rect x="30" y="6" width="92" height="46" rx="6" stroke="currentColor" strokeWidth="1.5" />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <circle key={i} cx={44 + i * 14} cy={16} r="1.6" fill="currentColor" />
      ))}
    </svg>
  );
}

/** Voice of Monetary Policy (02): audio waveform — 14 bars of varying height. */
function VompMotif() {
  const heights = [18, 34, 22, 46, 30, 58, 26, 42, 20, 50, 28, 38, 16, 44];
  return (
    <svg viewBox="0 0 140 80" fill="none" className="h-full w-full">
      {heights.map((h, i) => (
        <rect
          key={i}
          x={i * 9.5 + 4}
          y={(80 - h) / 2}
          width="4"
          height={h}
          rx="2"
          fill="currentColor"
        />
      ))}
    </svg>
  );
}

/** OpenWell (03): a single heartbeat / ECG polyline. */
function OpenWellMotif() {
  return (
    <svg viewBox="0 0 140 80" fill="none" className="h-full w-full">
      <polyline
        points="0,40 26,40 34,18 42,62 50,8 58,52 66,40 140,40"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const MOTIFS: Record<string, () => ReactElement> = {
  "01": ArgusMotif,
  "02": VompMotif,
  "03": OpenWellMotif,
};

export function Projects() {
  return (
    <section id="projects" className="mx-auto max-w-6xl px-6 py-24 sm:px-8 sm:py-28">
      <SectionHeading kicker="03 - Projects" title="Built with {care}." />
      <Reveal delay={1}>
        <p className="mt-5 text-muted">{projects.sub}</p>
      </Reveal>

      <div className="mt-14 space-y-6">
        {projects.items.map((project, i) => {
          const Motif = MOTIFS[project.number];
          return (
            <Reveal key={project.number} delay={i}>
              <article className="card-surface relative rounded-[2rem] p-8 transition-[border-color,transform] duration-500 ease-[var(--ease-signature)] hover:-translate-y-0.5 hover:border-accent/20 sm:p-10">
                {Motif ? (
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute right-8 top-8 hidden h-20 w-[140px] text-accent opacity-[0.16] sm:block"
                  >
                    <Motif />
                  </div>
                ) : null}

                <div className="flex items-start justify-between gap-6">
                  <span
                    aria-hidden="true"
                    className="text-6xl font-extrabold leading-none text-accent/15 sm:text-7xl"
                  >
                    {project.number}
                  </span>
                  <span className="rounded-full border border-accent/20 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.2em] text-accent/80">
                    {project.kicker}
                  </span>
                </div>

                <h3 className="mt-6 text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
                  {project.name}
                </h3>
                <p className="accent-serif mt-2 text-xl text-accent">{project.title}</p>

                <p className="mt-5 max-w-2xl leading-relaxed text-muted">
                  {project.description}
                </p>

                <ul className="mt-6 space-y-2.5">
                  {project.highlights.map((highlight) => (
                    <li key={highlight} className="flex gap-3 text-muted">
                      <span aria-hidden="true" className="select-none text-accent/60">
                        —
                      </span>
                      <span className="leading-relaxed">{highlight}</span>
                    </li>
                  ))}
                </ul>

                <ul className="mt-7 flex flex-wrap gap-2" aria-label="Technologies used">
                  {project.tech.map((tech) => (
                    <li
                      key={tech}
                      className="rounded-full border border-white/6 px-2.5 py-1 font-mono text-[11px] text-muted/80"
                    >
                      {tech}
                    </li>
                  ))}
                </ul>

                {"links" in project && project.links && project.links.length > 0 ? (
                  <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 font-mono text-base">
                    {project.links.map((link) =>
                      link.external ? (
                        <li key={link.href}>
                          <a
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-accent underline decoration-accent/40 underline-offset-4 transition-colors ease-[var(--ease-signature)] hover:decoration-accent"
                          >
                            {link.label} ↗
                          </a>
                        </li>
                      ) : (
                        <li key={link.href}>
                          <a
                            href={link.href}
                            className="text-accent underline decoration-accent/40 underline-offset-4 transition-colors ease-[var(--ease-signature)] hover:decoration-accent"
                          >
                            {link.label}
                          </a>
                        </li>
                      ),
                    )}
                  </ul>
                ) : (
                  <p className="mt-8 font-mono text-xs text-muted">
                    Code available on request
                  </p>
                )}
              </article>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
