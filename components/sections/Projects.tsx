import { projects } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

/**
 * Projects — editorial numbered cards, stacked vertically.
 * Copy sourced entirely from lib/content.ts (projects.*).
 */
export function Projects() {
  return (
    <section id="projects" className="mx-auto max-w-6xl px-6 py-24 sm:px-8 sm:py-32">
      <SectionHeading kicker="03 - Projects" title="Built with {care}." />
      <Reveal delay={1}>
        <p className="mt-5 text-muted">{projects.sub}</p>
      </Reveal>

      <div className="mt-14 space-y-6">
        {projects.items.map((project, i) => (
          <Reveal key={project.number} delay={i}>
            <article
              className="card-surface rounded-[2rem] p-8 transition-[border-color,transform] duration-500 ease-[var(--ease-signature)] hover:-translate-y-0.5 hover:border-accent/20 sm:p-10"
            >
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

              <h3 className="mt-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {project.name}
              </h3>
              <p className="accent-serif mt-2 text-xl text-accent">{project.title}</p>

              <p className="mt-5 max-w-2xl leading-relaxed text-muted">
                {project.description}
              </p>

              <ul className="mt-6 space-y-2">
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
                    className="rounded-full border border-white/8 px-2.5 py-1 font-mono text-xs text-muted"
                  >
                    {tech}
                  </li>
                ))}
              </ul>

              <p className="mt-8 font-mono text-xs text-muted">
                Code available on request
              </p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
