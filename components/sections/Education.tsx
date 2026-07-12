import { education } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

/**
 * Education — vertical dashed timeline with a status dot per entry
 * (pulsing for the current degree, solid for completed ones), followed
 * by a row of certification chips.
 */
export function Education() {
  return (
    <section id="education" className="mx-auto max-w-6xl px-6 py-24 sm:px-8 sm:py-28">
      <SectionHeading kicker="05 - Education" title="The {foundation}." />

      <div className="mt-14 max-w-2xl border-l border-dashed border-white/10" role="list">
        {education.items.map((item, i) => (
          <Reveal
            key={item.degree}
            delay={i}
            className="relative pb-10 pl-8 last:pb-0"
          >
            <div role="listitem">
              <span
                aria-hidden="true"
                className="absolute -left-[5px] top-1.5 flex size-2.5"
              >
                {item.status === "present" && (
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-status-present opacity-40" />
                )}
                <span
                  className={`relative inline-flex size-2.5 rounded-full ${
                    item.status === "present" ? "bg-status-present" : "bg-status-past"
                  }`}
                />
              </span>

              <p className="font-bold text-foreground">{item.degree}</p>
              <p className="mt-1 text-muted">
                {item.school} &middot; {item.place}
              </p>
              <p className="mt-1 font-mono text-xs text-muted">{item.period}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={education.items.length} className="mt-4">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-muted">
          Certifications
        </p>
        <ul className="mt-4 flex flex-wrap gap-2" aria-label="Certifications">
          {education.certifications.map((cert) => (
            <li
              key={cert}
              className="rounded-full border border-white/8 px-3 py-1 text-sm text-foreground/90"
            >
              {cert}
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
