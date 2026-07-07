import contributions from "@/lib/data/contributions.json";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { site } from "@/lib/site";

/** Tailwind background class per contribution intensity level (0-4). */
const LEVEL_CLASS: Record<number, string> = {
  0: "bg-white/[0.04]",
  1: "bg-accent/20",
  2: "bg-accent/40",
  3: "bg-accent/70",
  4: "bg-accent",
};

const WEEKS_TO_SHOW = 52;
const DAYS_PER_WEEK = 7;

/**
 * GitHub — static contribution heatmap for the last 52 weeks.
 * Data is imported at build time from lib/data/contributions.json so the
 * grid is fully present in the prerendered HTML (no client fetch/JS needed
 * to see it). The source data starts on a Sunday, so chunking it into
 * groups of 7 from the front yields calendar-aligned weeks; taking the
 * last 52 of those chunks keeps every column's rows mapped to the same
 * weekday without any extra alignment math.
 */
export function Github() {
  if (!site.showGithubGraph) return null;

  const days = contributions.contributions;
  const weeks: (typeof days)[] = [];
  for (let i = 0; i < days.length; i += DAYS_PER_WEEK) {
    weeks.push(days.slice(i, i + DAYS_PER_WEEK));
  }
  const cells = weeks.slice(-WEEKS_TO_SHOW).flat();

  return (
    <section id="github" className="mx-auto max-w-6xl px-6 py-24 sm:px-8 sm:py-32">
      <SectionHeading kicker="04 - GitHub" title="Public {activity}." />

      <Reveal delay={1} className="mt-14">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
          <p className="font-mono text-sm text-muted">
            {contributions.total.lastYear} contributions in the last year
          </p>
          <a
            href={site.github}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-sm text-foreground transition-colors duration-300 [transition-timing-function:var(--ease-signature)] hover:text-accent"
          >
            @{site.githubUser} <span aria-hidden="true">&rarr;</span>
          </a>
        </div>

        <div className="mt-6 overflow-x-auto">
          <div
            className="grid w-max grid-flow-col grid-rows-7 gap-1"
            role="img"
            aria-label={`GitHub contribution graph: ${contributions.total.lastYear} contributions in the last year`}
          >
            {cells.map((day) => (
              <div
                key={day.date}
                title={`${day.count} contribution${day.count === 1 ? "" : "s"} on ${day.date}`}
                className={`size-[10px] rounded-[2px] ${LEVEL_CLASS[day.level] ?? LEVEL_CLASS[0]}`}
              />
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
