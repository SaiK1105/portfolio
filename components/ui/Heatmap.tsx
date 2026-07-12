import contributions from "@/lib/data/contributions.json";
import { site } from "@/lib/site";

/** Tailwind background class per contribution intensity level (0-4). */
const LEVEL_CLASS: Record<number, string> = {
  0: "bg-white/[0.06]",
  1: "bg-accent-1/25",
  2: "bg-accent-1/60",
  3: "bg-accent-2/70",
  4: "bg-accent-2",
};

const WEEKS_TO_SHOW = 52;
const DAYS_PER_WEEK = 7;
const CELL_PX = 12; // size-3
const CELL_GAP_PX = 3;

/**
 * Heatmap — GitHub contribution grid for the last 52 weeks, extracted from
 * the former standalone Github section so it can live inside a bento cell.
 * Data is imported at build time from lib/data/contributions.json so the
 * grid is fully present in the prerendered HTML (no client fetch/JS needed
 * to see it). The source data starts on a Sunday, so chunking it into
 * groups of 7 from the front yields calendar-aligned weeks; taking the
 * last 52 of those chunks keeps every column's rows mapped to the same
 * weekday without any extra alignment math. Guarded by site.showGithubGraph.
 */
export function Heatmap() {
  if (!site.showGithubGraph) return null;

  const days = contributions.contributions;
  const weeks: (typeof days)[] = [];
  for (let i = 0; i < days.length; i += DAYS_PER_WEEK) {
    weeks.push(days.slice(i, i + DAYS_PER_WEEK));
  }
  const shownWeeks = weeks.slice(-WEEKS_TO_SHOW);
  const cells = shownWeeks.flat();

  // Month labels: one per week-column where the month differs from the
  // previous column's month (i.e. that week is the month's first week).
  const monthLabels: { weekIndex: number; label: string }[] = [];
  let prevMonth = -1;
  shownWeeks.forEach((week, i) => {
    const firstDay = new Date(`${week[0].date}T00:00:00Z`);
    const month = firstDay.getUTCMonth();
    if (month !== prevMonth) {
      monthLabels.push({
        weekIndex: i,
        label: firstDay.toLocaleString("en-US", { month: "short", timeZone: "UTC" }),
      });
      prevMonth = month;
    }
  });

  const gridTemplateColumns = `repeat(${shownWeeks.length}, ${CELL_PX}px)`;

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
        <div className="flex items-baseline gap-3">
          <span className="grad-text text-5xl font-extrabold leading-none">
            {contributions.total.lastYear}
          </span>
          <span className="font-mono text-xs text-muted">
            contributions &middot; last year
          </span>
        </div>
        <a
          href={site.github}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-sm text-foreground transition-colors duration-300 ease-[var(--ease-signature)] hover:text-accent"
        >
          @{site.githubUser} <span aria-hidden="true">&rarr;</span>
        </a>
      </div>

      <div className="mt-8 overflow-x-auto">
        <div className="w-max">
          <div
            className="grid"
            style={{ gridTemplateColumns, columnGap: `${CELL_GAP_PX}px` }}
            aria-hidden="true"
          >
            {shownWeeks.map((_, i) => {
              const label = monthLabels.find((m) => m.weekIndex === i)?.label;
              return (
                <div key={i} className="relative h-4">
                  {label ? (
                    <span className="absolute left-0 top-0 whitespace-nowrap font-mono text-[10px] text-muted">
                      {label}
                    </span>
                  ) : null}
                </div>
              );
            })}
          </div>

          <div
            className="mt-1 grid grid-flow-col grid-rows-7"
            style={{ gridTemplateColumns, gap: `${CELL_GAP_PX}px` }}
            role="img"
            aria-label={`GitHub contribution graph: ${contributions.total.lastYear} contributions in the last year`}
          >
            {cells.map((day) => (
              <div
                key={day.date}
                title={`${day.count} contribution${day.count === 1 ? "" : "s"} on ${day.date}`}
                className={`size-3 rounded-[3px] ${LEVEL_CLASS[day.level] ?? LEVEL_CLASS[0]}`}
              />
            ))}
          </div>
        </div>
      </div>
      <p className="mt-2 font-mono text-xs text-muted sm:hidden" aria-hidden="true">
        scroll &rarr;
      </p>
    </>
  );
}
