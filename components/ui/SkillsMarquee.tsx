import type { CSSProperties } from "react";
import { skills } from "@/lib/content";

/**
 * SkillsMarquee — two full-width auto-scrolling marquee rows, extracted
 * from the former standalone Skills section so it can live inside a bento
 * cell. Row 1 combines Languages + Web & Tools, row 2 is AI & ML, both
 * sourced from lib/content.ts skills.groups. Content is duplicated so the
 * translateX loop is seamless; under prefers-reduced-motion the rows
 * collapse to a static wrapped grid (duplicate copy hidden, animation off,
 * mask removed) via the `motion-reduce:` variant — no JS required either
 * way, so this stays a server component.
 */

type Group = (typeof skills.groups)[number];

function findGroup(title: string): Group {
  const group = skills.groups.find((g) => g.title === title);
  if (!group) throw new Error(`Skills group "${title}" not found in content.ts`);
  return group;
}

const languages = findGroup("Languages");
const webTools = findGroup("Web & Tools");
const aiMl = findGroup("AI & ML");

type RowNode = { key: string; kind: "label" | "chip"; text: string };

function buildRow(groups: Group[]): RowNode[] {
  const nodes: RowNode[] = [];
  for (const group of groups) {
    nodes.push({ key: `label-${group.title}`, kind: "label", text: group.title });
    for (const item of group.items) {
      nodes.push({ key: `${group.title}-${item}`, kind: "chip", text: item });
    }
  }
  return nodes;
}

const row1 = buildRow([languages, webTools]);
const row2 = buildRow([aiMl]);

function ChipList({ nodes, copy }: { nodes: RowNode[]; copy: "a" | "b" }) {
  return (
    <>
      {nodes.map((node) =>
        node.kind === "label" ? (
          <span
            key={`${copy}-${node.key}`}
            className="grad shrink-0 rounded-full px-3 py-1 font-mono text-sm font-semibold text-background"
          >
            {node.text}
          </span>
        ) : (
          <span
            key={`${copy}-${node.key}`}
            className="shrink-0 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-foreground/90 transition-colors duration-300 ease-[var(--ease-signature)] hover:border-accent-2/50"
          >
            {node.text}
          </span>
        ),
      )}
    </>
  );
}

function MarqueeRow({
  nodes,
  animationName,
  durationSeconds,
  ariaLabel,
}: {
  nodes: RowNode[];
  animationName: "marquee-left" | "marquee-right";
  durationSeconds: number;
  ariaLabel: string;
}) {
  return (
    <div
      className="relative overflow-hidden py-1 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)] motion-reduce:overflow-visible motion-reduce:[mask-image:none] motion-reduce:[-webkit-mask-image:none]"
      aria-label={ariaLabel}
    >
      <div
        className="flex w-max flex-nowrap items-center gap-3 [animation:var(--marquee-anim)_linear_infinite] hover:[animation-play-state:paused] motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:[animation:none]"
        style={
          {
            "--marquee-anim": `${animationName} ${durationSeconds}s`,
          } as CSSProperties
        }
      >
        <div className="flex shrink-0 flex-nowrap items-center gap-3 motion-reduce:w-full motion-reduce:flex-wrap">
          <ChipList nodes={nodes} copy="a" />
        </div>
        <div
          aria-hidden="true"
          className="flex shrink-0 flex-nowrap items-center gap-3 motion-reduce:hidden"
        >
          <ChipList nodes={nodes} copy="b" />
        </div>
      </div>
    </div>
  );
}

export function SkillsMarquee() {
  return (
    <>
      <style>{`
        @keyframes marquee-left {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes marquee-right {
          from { transform: translateX(-50%); }
          to { transform: translateX(0); }
        }
      `}</style>

      <div className="flex flex-col gap-5">
        <MarqueeRow
          nodes={row1}
          animationName="marquee-left"
          durationSeconds={45}
          ariaLabel="Languages and Web & Tools skills"
        />
        <MarqueeRow
          nodes={row2}
          animationName="marquee-right"
          durationSeconds={55}
          ariaLabel="AI & ML skills"
        />
      </div>
    </>
  );
}
