import type { Metadata } from "next";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { site } from "@/lib/site";
import { caseMeta as argusMeta, hero as argusHero } from "@/lib/case-argus";
import { caseMeta as vompMeta, hero as vompHero } from "@/lib/case-vomp";

/**
 * /work — index of case studies.
 * Server-rendered, static. No IslandNav (home-only) — a slim top bar
 * links back instead, matching /work/argus-v and /work/vomp.
 */

export const metadata: Metadata = {
  title: "Work — S Sai Kumar",
  description: "Case studies — A.R.G.U.S-V and Voice of Monetary Policy.",
  alternates: { canonical: "/work/" },
  openGraph: {
    type: "website",
    url: `${site.url}/work/`,
    title: "Work — S Sai Kumar",
    description: "Case studies — A.R.G.U.S-V and Voice of Monetary Policy.",
    siteName: site.shortName,
  },
  twitter: {
    card: "summary_large_image",
    title: "Work — S Sai Kumar",
    description: "Case studies — A.R.G.U.S-V and Voice of Monetary Policy.",
  },
};

const cases = [
  {
    href: "/work/argus-v/",
    title: argusHero.title,
    oneLiner:
      "A video intelligence system that answers questions about videos while they're still processing.",
    meta: argusMeta.title.split(" — ")[0],
  },
  {
    href: "/work/vomp/",
    title: vompHero.title,
    oneLiner:
      "Classifying the Fed's hawkish/dovish stance from vocal tone and text, fused and tested against real market moves.",
    meta: vompMeta.title.split(" — ")[0],
  },
] as const;

export default function WorkIndex() {
  return (
    <>
      <div className="mx-auto max-w-6xl px-6 pt-8 sm:px-8">
        <a
          href="/"
          className="font-mono text-sm text-muted transition-colors duration-300 ease-[var(--ease-signature)] hover:text-accent"
        >
          ← saik.co.in
        </a>
      </div>

      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-6 pb-16 pt-12 sm:px-8 sm:pb-20 sm:pt-16">
          <SectionHeading kicker="Case studies" title="Selected {work}, in depth." />
          <Reveal delay={1}>
            <p className="mt-5 max-w-xl leading-relaxed text-muted">
              Two projects, written up in full — the problem, the system, the results, and
              what went wrong along the way.
            </p>
          </Reveal>
        </section>

        <section className="mx-auto max-w-6xl px-6 pb-20 sm:px-8 sm:pb-28">
          <div className="grid gap-6 sm:grid-cols-2">
            {cases.map((item, i) => (
              <Reveal key={item.href} delay={i}>
                <a
                  href={item.href}
                  className="card-surface group block h-full rounded-[2rem] p-8 transition-[border-color,transform] duration-500 ease-[var(--ease-signature)] hover:-translate-y-0.5 hover:border-accent/20 sm:p-10"
                >
                  <p className="font-mono text-xs uppercase tracking-[0.25em] text-muted">
                    {item.meta}
                  </p>
                  <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                    {item.title}
                  </h2>
                  <p className="mt-4 leading-relaxed text-muted">{item.oneLiner}</p>
                  <p className="mt-8 font-mono text-sm text-accent transition-colors duration-300 ease-[var(--ease-signature)] group-hover:text-foreground">
                    Read the case study →
                  </p>
                </a>
              </Reveal>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
