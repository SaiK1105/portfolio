import { Reveal } from "@/components/ui/Reveal";

type Step = {
  label: string;
  detail: string;
  tag?: string;
  /** Marks a stage that runs concurrently with its siblings (ASR / vision branch). */
  parallel?: boolean;
};

/**
 * Metro-line flow diagram: a solid --green accent spine down the left
 * with a node dot per stage. Each stage is a full-width row — stage
 * number, title, one-line description, right-aligned mono tech tag.
 * Stages flagged `parallel` branch off onto a secondary, dashed hairline
 * under an amber "runs in parallel" label — not an image, pure markup.
 * Designed to sit flush inside a Window (components/os/Window) body.
 */
export function FlowDiagram({ steps }: { steps: readonly Step[] }) {
  return (
    <div className="relative w-full px-5 pb-5 pt-4 sm:px-6">
      <span
        aria-hidden="true"
        className="absolute left-[3px] top-4 bottom-4 w-px bg-green/40"
      />
      <ol>
        {steps.map((step, i) => {
          const startsParallel = step.parallel && !steps[i - 1]?.parallel;
          return (
            <li key={step.label}>
              {startsParallel && (
                <p className="ml-8 pt-5 font-mono text-[10.5px] uppercase tracking-[0.2em] text-amber sm:ml-10">
                  runs in parallel
                </p>
              )}
              <Reveal delay={i}>
                <div
                  className={
                    "group relative flex flex-col gap-1 border-b border-border py-4 pl-8 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6" +
                    (step.parallel
                      ? " ml-8 border-l border-dashed border-border pl-6 sm:ml-10 sm:pl-8"
                      : "")
                  }
                >
                  <span
                    aria-hidden="true"
                    className={
                      "absolute left-0 top-5 h-2 w-2 -translate-x-1/2 rounded-full" +
                      (step.parallel ? " bg-green/60" : " bg-green")
                    }
                  />
                  <div className="flex items-baseline gap-4 sm:gap-6">
                    <span className="shrink-0 font-mono text-xs text-muted">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p>
                      <span className="font-semibold text-text">{step.label}</span>
                      <span className="block font-mono text-[12.5px] text-muted sm:ml-2 sm:inline">
                        {step.detail}
                      </span>
                    </p>
                  </div>
                  {step.tag && (
                    <span className="shrink-0 self-start rounded border border-border px-2 py-0.5 font-mono text-[10.5px] uppercase tracking-[0.05em] text-muted sm:self-auto">
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
