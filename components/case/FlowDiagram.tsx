import { Reveal } from "@/components/ui/Reveal";

type Step = {
  label: string;
  detail: string;
  tag?: string;
  /** Marks a stage that runs concurrently with its siblings (ASR / vision branch). */
  parallel?: boolean;
};

/**
 * Metro-line flow diagram: a vertical accent spine down the left with a
 * node dot per stage. Each stage is a full-width row — stage number,
 * title, one-line description, right-aligned tech tag. Stages flagged
 * `parallel` branch off onto a secondary, thinner dashed line under a
 * "runs in parallel" label — not an image, pure markup.
 */
export function FlowDiagram({ steps }: { steps: readonly Step[] }) {
  return (
    <div className="relative mt-10 w-full">
      <span
        aria-hidden="true"
        className="absolute left-[3px] top-3 bottom-3 w-px bg-gradient-to-b from-accent-1/50 to-accent-2/50"
      />
      <ol>
        {steps.map((step, i) => {
          const startsParallel = step.parallel && !steps[i - 1]?.parallel;
          return (
            <li key={step.label}>
              {startsParallel && (
                <p className="ml-8 pt-6 font-mono text-[11px] uppercase tracking-[0.2em] text-accent-3/80 sm:ml-10">
                  runs in parallel
                </p>
              )}
              <Reveal delay={i}>
                <div
                  className={
                    "group relative flex flex-col gap-1 border-b border-white/5 py-5 pl-8 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6" +
                    (step.parallel
                      ? " ml-8 border-l border-dashed border-accent/25 pl-6 sm:ml-10 sm:pl-8"
                      : "")
                  }
                >
                  <span
                    aria-hidden="true"
                    className={
                      "absolute left-0 top-6 h-2 w-2 -translate-x-1/2 rounded-full" +
                      (step.parallel ? " bg-accent-2/60" : " bg-accent-2")
                    }
                  />
                  <div className="flex items-baseline gap-4 sm:gap-6">
                    <span className="shrink-0 font-mono text-xs text-accent-1/70">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p>
                      <span className="font-semibold text-foreground">{step.label}</span>
                      <span className="block text-sm text-muted sm:ml-2 sm:inline">
                        {step.detail}
                      </span>
                    </p>
                  </div>
                  {step.tag && (
                    <span className="shrink-0 font-mono text-xs text-muted sm:text-right">
                      {step.tag}
                    </span>
                  )}
                </div>
              </Reveal>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
