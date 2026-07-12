import { Window } from "@/components/os/Window";
import contributions from "@/lib/data/contributions.json";
import { site } from "@/lib/site";

/** Tailwind background/border class per contribution intensity level (0-4). */
const LEVEL_CLASS: Record<number, string> = {
  0: "border border-border bg-transparent",
  1: "bg-hm-1",
  2: "bg-hm-2",
  3: "bg-hm-3",
  4: "bg-hm-4",
};

const WEEKS_TO_SHOW = 52;
const DAYS_PER_WEEK = 7;
const CELL_PX = 10;
const CELL_GAP_PX = 3;

/**
 * Heatmap — reskinned as a "contributions — cal.sh" Window. Data is
 * imported at build time from lib/data/contributions.json (real total:
 * 27, honestly framed — no fabricated bigger number or streak). The
 * source data starts on a Sunday, so chunking it into groups of 7 from
 * the front yields calendar-aligned weeks; taking the last 52 of those
 * chunks keeps every column's rows mapped to the same weekday without
 * any extra alignment math. Guarded by site.showGithubGraph.
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
  const total = contributions.total.lastYear;

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
    <Window id="github" title="contributions — cal.sh" aria-label="GitHub contributions">
      <div className="px-[22px] pt-[18px]">
        <p className="font-mono text-[12.5px] text-muted">$ ./cal.sh --last 12mo</p>
        <p className="mt-1 font-mono text-[12.5px] text-green">
          &gt; {total} commits in the last 12mo · private work not shown
        </p>
      </div>

      <div className="overflow-x-auto px-[22px] pb-1 pt-4">
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
            aria-label={`GitHub contribution graph: ${total} commits in the last 12 months`}
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
      </div>
      <p className="px-[22px] pb-1 font-mono text-[10.5px] text-muted sm:hidden" aria-hidden="true">
        scroll →
      </p>

      <div className="flex items-center gap-1.5 px-[22px] pb-5 pt-3 font-mono text-[10.5px] text-muted">
        <span>less</span>
        <span className="size-[9px] rounded-[2px] bg-hm-1" aria-hidden="true" />
        <span className="size-[9px] rounded-[2px] bg-hm-2" aria-hidden="true" />
        <span className="size-[9px] rounded-[2px] bg-hm-3" aria-hidden="true" />
        <span className="size-[9px] rounded-[2px] bg-hm-4" aria-hidden="true" />
        <span>more</span>
      </div>
    </Window>
  );
}
