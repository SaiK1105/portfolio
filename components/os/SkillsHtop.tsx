import { Window } from "@/components/os/Window";
import { skills } from "@/lib/content";

/**
 * SkillsHtop — skills.groups (lib/content.ts) rendered as an htop-style
 * process list. HONESTY: no fabricated percentages. Each row's load bar
 * is a fixed-width decorative fill (identical for every row) that only
 * communicates "active process" — never a precision skill metric. Color
 * alternates green/amber per group purely for visual rhythm, matching
 * the htop motif from the approved mockup.
 */
const BAR_WIDTH = "76%";

export function SkillsHtop() {
  return (
    <Window id="skills" title="skills — htop" aria-label="Skills">
      <div className="grid grid-cols-[2.4fr_1fr] px-[22px] pt-1 font-mono text-[10px] uppercase tracking-[0.1em] text-muted">
        <span>Process</span>
        <span>Load</span>
      </div>

      <div className="mt-2 divide-y divide-border">
        {skills.groups.map((group, i) => {
          const barClass = i % 2 === 0 ? "bg-green" : "bg-amber";
          return (
            <div key={group.title} className="px-[22px] py-[10px]">
              <p className="mb-1.5 max-w-[68ch] text-[12.5px] leading-[1.5] text-text">
                <span className="text-text">{group.title}</span>
                <span className="text-muted"> · {group.items.join(" / ")}</span>
              </p>
              <div className="h-[7px] w-full overflow-hidden rounded-[4px] bg-[color-mix(in_srgb,var(--bg)_60%,var(--panel)_40%)]">
                <div
                  className={`h-full rounded-[4px] ${barClass}`}
                  style={{ width: BAR_WIDTH }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Window>
  );
}
