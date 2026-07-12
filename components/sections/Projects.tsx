import type { ReactNode } from "react";
import { Window } from "@/components/os/Window";
import { Reveal } from "@/components/ui/Reveal";
import { projects, type ProjectLink } from "@/lib/content";

/**
 * Projects — the three real projects as OS windows: argus-v as a
 * "flagship.exe" man-page panel, Voice of Monetary Policy as a faux
 * research.ipynb notebook, OpenWell as a systemd daemon.service panel.
 * All copy is sourced from lib/content.ts — nothing invented beyond
 * decorative CLI/pseudocode framing (no fabricated metrics).
 */

const SPRING = "cubic-bezier(0.34,1.56,0.64,1)";

function TechTags({ tech }: { tech: readonly string[] }) {
  return (
    <ul className="mt-[1.2em] flex flex-wrap gap-2" aria-label="Technologies used">
      {tech.map((tag) => (
        <li
          key={tag}
          className="rounded-[4px] border border-border px-2 py-1 font-mono text-[10.5px] uppercase tracking-[0.05em] text-muted"
        >
          {tag}
        </li>
      ))}
    </ul>
  );
}

function WinLink({
  href,
  external,
  children,
}: {
  href: string;
  external?: boolean;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="mt-[1.2em] inline-flex items-center gap-1.5 border-b border-transparent font-mono text-[12.5px] text-amber transition-colors hover:border-amber focus-visible:border-amber"
    >
      {children}
    </a>
  );
}

function caseStudyLink(links: readonly ProjectLink[] | undefined): ProjectLink | undefined {
  return links?.find((l) => !l.external);
}

export function Projects() {
  const [argus, vomp, openwell] = projects.items;
  const argusLink = caseStudyLink(argus.links);
  const vompLink = caseStudyLink(vomp.links);
  const f1Badge = vomp.highlights.join(" ").match(/F1\s?[\d.]+/i)?.[0] ?? "F1";

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* argus-v — flagship.exe */}
      <Reveal className="lg:col-span-2" delay={0}>
        <Window id="argus-v" title="argus-v — flagship.exe" aria-label={argus.name}>
          <div className="window-pad">
            <h3 className="mt-0 font-mono text-[11px] uppercase tracking-[0.12em] text-amber">
              Name
            </h3>
            <p className="mt-[0.4em] max-w-[68ch] text-[13.5px] leading-[1.6] text-text">
              {argus.name} — {argus.title}
            </p>

            <h3 className="mt-[1.1em] font-mono text-[11px] uppercase tracking-[0.12em] text-amber">
              Synopsis
            </h3>
            <p className="mt-[0.4em] max-w-[68ch] overflow-x-auto rounded-[4px] border border-border bg-[color-mix(in_srgb,var(--bg)_60%,var(--panel)_40%)] px-3 py-[10px] font-mono text-[12.5px] text-green">
              argus-v --stream &lt;source&gt; --query &quot;&lt;question&gt;&quot;
            </p>

            <h3 className="mt-[1.1em] font-mono text-[11px] uppercase tracking-[0.12em] text-amber">
              Description
            </h3>
            <p className="mt-[0.4em] max-w-[68ch] text-[13.5px] leading-[1.6] text-text">
              {argus.description}
            </p>

            <h3 className="mt-[1.1em] font-mono text-[11px] uppercase tracking-[0.12em] text-amber">
              Results
            </h3>
            <ul className="mt-1 flex flex-col gap-1.5">
              {argus.highlights.map((line) => (
                <li
                  key={line}
                  className="flex max-w-[68ch] gap-2 text-[13.5px] leading-[1.6] text-text"
                >
                  <span aria-hidden="true" className="shrink-0 text-muted">
                    —
                  </span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>

            <TechTags tech={argus.tech} />
            {argusLink ? <WinLink href={argusLink.href}>Read full case study →</WinLink> : null}
          </div>
        </Window>
      </Reveal>

      {/* monetary-policy — research.ipynb */}
      <Reveal delay={1}>
        <Window
          id="monetary-policy"
          title="monetary-policy — research.ipynb"
          aria-label={vomp.name}
        >
          <div className="divide-y divide-border">
            <div className="px-[22px] pt-3">
              <p className="flex gap-2.5 font-mono text-[10.5px] text-muted">
                <span>In [1]</span>
                <span>markdown</span>
              </p>
              <div className="pb-[18px] pt-2">
                <h4 className="font-display text-[20px] font-bold text-text">{vomp.name}</h4>
                <p className="mt-1.5 max-w-[68ch] text-[13.5px] leading-[1.6] text-muted">
                  {vomp.title}
                </p>
              </div>
            </div>

            <div className="px-[22px] pt-2">
              <p className="flex gap-2.5 font-mono text-[10.5px] text-muted">
                <span>In [2]</span>
                <span>code</span>
              </p>
              <pre className="overflow-x-auto whitespace-pre-wrap py-[18px] font-mono text-[12.5px] leading-[1.6] text-green">
{`fusion = concat(
  bert_sentiment(fomc_transcripts),   # hawkish / dovish signal
  prosody_features(fomc_audio),       # pitch, tempo, stress
)
bootstrap_ols(fusion, market_reaction, n_boot=2000, ci="BCa")`}
              </pre>
            </div>

            <div className="px-[22px] pb-[18px] pt-2">
              <p className="flex gap-2.5 font-mono text-[10.5px] text-muted">
                <span>Out [2]</span>
                <span>result</span>
              </p>
              <span className="mt-2 inline-block rounded-[4px] border border-green bg-[color-mix(in_srgb,var(--green)_15%,transparent)] px-[9px] py-[3px] font-mono text-xs text-green">
                {f1Badge}
              </span>
              <p className="mt-2 max-w-[68ch] text-[13.5px] leading-[1.6] text-text">
                {vomp.description}
              </p>
              {vompLink ? <WinLink href={vompLink.href}>Read full case study →</WinLink> : null}
            </div>
          </div>
        </Window>
      </Reveal>

      {/* openwell — daemon.service */}
      <Reveal delay={2}>
        <Window id="openwell" title="openwell — daemon.service" aria-label={openwell.name}>
          <div className="window-pad">
            <p className="flex items-center gap-2 text-[13.5px] text-text">
              <span aria-hidden="true" className="text-green">
                ●
              </span>
              openwell.service — {openwell.title}
            </p>
            <div className="mt-[10px] mb-3 flex flex-col gap-1 font-mono text-xs text-muted">
              <span>Loaded: loaded (/etc/systemd/system/openwell.service; enabled)</span>
              <span className="flex items-center gap-2">
                Active:
                <span className="inline-flex items-center gap-[5px] rounded-full border border-green px-2 py-0.5 text-[11.5px] text-green">
                  <span aria-hidden="true" className="size-[6px] rounded-full bg-green" />
                  active (running)
                </span>
              </span>
              <span>Docs: openwell.vercel.app</span>
            </div>
            <p className="max-w-[68ch] text-[13.5px] leading-[1.6] text-text">
              {openwell.description}
            </p>
            <div className="mt-[1.2em] flex flex-wrap items-center gap-4">
              {openwell.links?.map((link) =>
                link.label.toLowerCase().includes("demo") ? (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ transitionTimingFunction: SPRING }}
                    className="inline-flex items-center gap-2 rounded-[4px] bg-green px-4 py-[10px] font-mono text-[12.5px] font-semibold text-[#06110B] transition-transform duration-150 hover:-translate-y-0.5"
                  >
                    Launch live demo →
                  </a>
                ) : (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border-b border-transparent font-mono text-[12.5px] text-amber transition-colors hover:border-amber"
                  >
                    {link.label} →
                  </a>
                ),
              )}
            </div>
          </div>
        </Window>
      </Reveal>
    </div>
  );
}
