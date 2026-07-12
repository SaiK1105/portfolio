import { Window } from "@/components/os/Window";
import { education } from "@/lib/content";

type LogEntry = {
  tag: string;
  level: "info" | "warn";
  message: string;
};

/** Pulls the first 4-digit year out of a period string ("Expected 2027" → "2027"). */
function yearOf(period: string): string {
  return period.match(/\d{4}/)?.[0] ?? period;
}

/**
 * EduLog — education (lib/content.ts) rendered as a syslog-style
 * education.log. Only real facts: degree/school/place/period straight
 * from content.ts, ordered chronologically. Bracketed tags use the
 * actual year from each entry's `period` string — never a fabricated
 * precise date. The in-progress degree gets a WARN line (truthfully:
 * "expected", not yet conferred); everything completed is INFO.
 */
function buildLog(): LogEntry[] {
  const chronological = [...education.items].reverse();

  const items: LogEntry[] = chronological.map((item) => ({
    tag: yearOf(item.period),
    level: item.status === "present" ? "warn" : "info",
    message:
      item.status === "present"
        ? `${item.degree} → ${item.school}, ${item.place} — ${item.period.toLowerCase()}, pending final semester`
        : `${item.degree} → ${item.school}, ${item.place}`,
  }));

  const certs: LogEntry[] = education.certifications.map((cert) => ({
    tag: "CERT",
    level: "info",
    message: cert,
  }));

  return [...items, ...certs];
}

export function EduLog() {
  const log = buildLog();

  return (
    <Window id="education" title="whoami — education.log" aria-label="Education">
      <div className="divide-y divide-border">
        {log.map((entry, i) => (
          <p
            key={`${entry.tag}-${i}`}
            className="flex flex-wrap gap-2.5 px-[22px] py-[7px] text-[12.5px]"
          >
            <span className="shrink-0 text-muted">[{entry.tag}]</span>
            <span
              className={`shrink-0 font-semibold ${entry.level === "warn" ? "text-amber" : "text-green"}`}
            >
              {entry.level.toUpperCase()}
            </span>
            <span className="text-text">{entry.message}</span>
          </p>
        ))}
      </div>
    </Window>
  );
}
