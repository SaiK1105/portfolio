import { renderAccent } from "@/components/ui/Accent";
import { Reveal } from "@/components/ui/Reveal";
import { contact } from "@/lib/content";
import { site } from "@/lib/site";

/**
 * Closing section: oversized two-tone statement, short blurb, and
 * plain-text contact rows (email, GitHub, location + phone).
 */
export function Contact() {
  return (
    <section id="contact" className="mx-auto max-w-6xl px-6 py-28 sm:px-8 sm:py-36">
      <Reveal>
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-muted">
          {contact.heading}
        </p>
        <h2 className="mt-6 text-5xl font-bold leading-[0.95] tracking-tight text-foreground sm:text-7xl text-balance">
          {renderAccent(contact.headline)}
        </h2>
      </Reveal>

      <Reveal delay={1}>
        <p className="mt-8 max-w-md text-muted">{contact.blurb}</p>
      </Reveal>

      <Reveal delay={2}>
        <a
          href={`mailto:${site.email}`}
          className="mt-16 inline-block text-2xl font-bold text-foreground underline decoration-accent/40 underline-offset-8 transition-colors ease-[var(--ease-signature)] hover:decoration-accent sm:text-4xl"
        >
          {site.email}
        </a>

        <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-sm text-muted">
          <a
            href={site.github}
            target="_blank"
            rel="noopener noreferrer"
            className="underline-offset-4 transition-colors ease-[var(--ease-signature)] hover:text-foreground hover:underline hover:decoration-accent/40"
          >
            github ↗
          </a>
          <span aria-hidden="true">·</span>
          <a
            href={site.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="underline-offset-4 transition-colors ease-[var(--ease-signature)] hover:text-foreground hover:underline hover:decoration-accent/40"
          >
            linkedin ↗
          </a>
          <span aria-hidden="true">·</span>
          <a
            href="tel:+917337354430"
            className="underline-offset-4 transition-colors ease-[var(--ease-signature)] hover:text-foreground hover:underline hover:decoration-accent/40"
          >
            {site.phone}
          </a>
        </div>
      </Reveal>
    </section>
  );
}
