import { renderAccent } from "./Accent";
import { Reveal } from "./Reveal";

/**
 * Standard section header: uppercase tracked kicker + large two-tone title.
 * Title supports {braced} serif-italic accent fragments.
 */
export function SectionHeading({
  kicker,
  title,
}: {
  kicker: string;
  title: string;
}) {
  return (
    <Reveal>
      <p className="font-mono text-xs uppercase tracking-[0.25em] text-muted">
        {kicker}
      </p>
      <h2 className="mt-3 text-4xl font-bold leading-[0.95] tracking-tight text-foreground sm:text-5xl lg:text-6xl text-balance">
        {renderAccent(title)}
      </h2>
    </Reveal>
  );
}
