import { skills } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

/**
 * Skills — three group cards (Languages / AI & ML / Web & Tools),
 * each rendering its items as a flowing list of text chips.
 * Server component; entrance animation delegated to <Reveal>.
 */
export function Skills() {
  return (
    <section id="skills" className="mx-auto max-w-6xl px-6 py-24 sm:px-8 sm:py-32">
      <SectionHeading kicker="02 - Skills" title="What I {work with}." />

      <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-3">
        {skills.groups.map((group, i) => (
          <Reveal key={group.title} delay={i} className="h-full">
            <div className="card-surface h-full rounded-2xl p-6">
              <h3 className="font-mono text-xs uppercase tracking-widest text-muted">
                {group.title}
              </h3>
              <ul className="mt-5 flex flex-wrap gap-2" aria-label={group.title}>
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-full border border-white/8 px-3 py-1 text-sm text-foreground/90 transition-colors duration-300 ease-[var(--ease-signature)] hover:border-accent/40"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
