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
    <section id="contact" className="mx-auto max-w-6xl px-6 py-32 sm:px-8 sm:py-40">
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
        <ul className="mt-16 space-y-6">
          <li>
            <a
              href={`mailto:${site.email}`}
              className="text-xl text-foreground underline decoration-accent/40 underline-offset-4 transition-colors ease-[var(--ease-signature)] hover:decoration-accent"
            >
              {site.email}
            </a>
          </li>
          <li>
            <a
              href={site.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xl text-foreground underline decoration-accent/40 underline-offset-4 transition-colors ease-[var(--ease-signature)] hover:decoration-accent"
            >
              {site.github.replace(/^https?:\/\//, "")}
            </a>
          </li>
          <li className="font-mono text-sm text-muted">
            {site.location} ·{" "}
            <a
              href="tel:+917337354430"
              className="underline-offset-4 transition-colors ease-[var(--ease-signature)] hover:text-foreground hover:underline hover:decoration-accent/40"
            >
              {site.phone}
            </a>
          </li>
        </ul>
      </Reveal>
    </section>
  );
}
