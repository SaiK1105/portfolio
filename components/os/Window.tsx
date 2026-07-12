import type { ReactNode } from "react";

type WindowProps = {
  /** Centered mono title bar text, e.g. "argus-v — flagship.exe". */
  title: string;
  /** Render the three decorative traffic-light dots. Defaults to true. */
  dots?: boolean;
  className?: string;
  children: ReactNode;
  id?: string;
  "aria-label"?: string;
};

/**
 * Window — the reusable window-chrome primitive. Every surface on the
 * OS (hero terminal, project windows, htop skills panel, cal.sh
 * heatmap, education log, contact mailto sheet, …) renders inside one
 * of these. Flat panel, 1px hairline border, a title bar with
 * decorative dots + centered mono title, and a body.
 *
 * Server component — no client JS required for static chrome.
 *
 * The body carries no padding of its own so callers can opt into the
 * standard padded-prose recipe with the `.window-pad` utility class, or
 * lay out flush-edge dividers (htop rows, log lines, notebook cells,
 * mailto rows, heatmap grid, …) that need to run edge-to-edge inside
 * the window border.
 */
export function Window({
  title,
  dots = true,
  className,
  children,
  id,
  "aria-label": ariaLabel,
}: WindowProps) {
  const classes = ["window", className].filter(Boolean).join(" ");

  return (
    <div id={id} aria-label={ariaLabel} className={classes}>
      <div className="window-titlebar">
        {dots ? (
          <span className="window-dots" aria-hidden="true">
            <span className="window-dot window-dot--amber" />
            <span className="window-dot window-dot--green" />
            <span className="window-dot window-dot--red" />
          </span>
        ) : (
          <span className="window-dots-spacer" aria-hidden="true" />
        )}
        <span className="window-title">{title}</span>
        <span className="window-titlebar-spacer" aria-hidden="true" />
      </div>
      <div className="window-body">{children}</div>
    </div>
  );
}
