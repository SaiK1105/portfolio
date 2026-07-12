import type { Metadata } from "next";
import { education, projects, skills } from "@/lib/content";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: "/resume/" },
  title: "Resume - S Sai Kumar",
  robots: { index: false },
};

/**
 * Print-ready A4-style resume at /resume.
 * Intentionally breaks from the dark site theme: white paper, near-black
 * ink, system fonts. All styling is scoped to this page. Content comes
 * exclusively from lib/content.ts and lib/site.ts.
 */

const headingClass =
  "font-[Georgia,'Times_New_Roman',serif] uppercase tracking-wide text-[11px] font-bold border-b border-neutral-300 pb-1 mb-2";

export default function ResumePage() {
  return (
    <div className="bg-white text-neutral-900 min-h-screen font-[system-ui,sans-serif]">
      <style>{`
        @media print {
          @page { margin: 12mm; }
          html, body { background: #ffffff !important; }
          a { color: inherit !important; text-decoration: none !important; }
        }
      `}</style>

      <main className="max-w-[52rem] mx-auto p-10 text-[13px] leading-relaxed">
        {/* ── Header ─────────────────────────────────────────── */}
        <header className="text-center mb-6">
          <h1 className="font-[Georgia,'Times_New_Roman',serif] text-[26px] font-bold tracking-[0.08em] leading-tight">
            {site.name.toUpperCase()}
          </h1>
          <p className="mt-1 text-[12px] text-neutral-700">
            <a
              href={`mailto:${site.email}`}
              className="underline decoration-neutral-300 underline-offset-2 hover:decoration-neutral-500"
            >
              {site.email}
            </a>
            <span aria-hidden="true"> | </span>
            <a
              href={`tel:${site.phone.replace(/\s+/g, "")}`}
              className="underline decoration-neutral-300 underline-offset-2 hover:decoration-neutral-500"
            >
              {site.phone}
            </a>
            <span aria-hidden="true"> | </span>
            <a
              href={site.github}
              className="underline decoration-neutral-300 underline-offset-2 hover:decoration-neutral-500"
            >
              github.com/{site.githubUser}
            </a>
            <span aria-hidden="true"> | </span>
            <a
              href={site.linkedin}
              className="underline decoration-neutral-300 underline-offset-2 hover:decoration-neutral-500"
            >
              linkedin.com/in/saik7337
            </a>
            <span aria-hidden="true"> | </span>
            {site.location}
          </p>
        </header>

        {/* ── Professional summary ───────────────────────────── */}
        <section aria-labelledby="resume-summary" className="mb-5">
          <h2 id="resume-summary" className={headingClass}>
            Professional Summary
          </h2>
          <p>{site.description}</p>
        </section>

        {/* ── Education ──────────────────────────────────────── */}
        <section aria-labelledby="resume-education" className="mb-5">
          <h2 id="resume-education" className={headingClass}>
            Education
          </h2>
          <ul className="space-y-2">
            {education.items.map((item) => (
              <li key={item.school}>
                <div className="flex items-baseline justify-between gap-4">
                  <span className="font-semibold">{item.degree}</span>
                  <span className="shrink-0 text-neutral-600">{item.period}</span>
                </div>
                <div className="text-neutral-700">
                  {item.school}, {item.place}
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* ── Technical skills ───────────────────────────────── */}
        <section aria-labelledby="resume-skills" className="mb-5">
          <h2 id="resume-skills" className={headingClass}>
            Technical Skills
          </h2>
          <ul className="space-y-1">
            {skills.groups.map((group) => (
              <li key={group.title}>
                <span className="font-semibold">{group.title}:</span>{" "}
                {group.items.join(", ")}
              </li>
            ))}
          </ul>
        </section>

        {/* ── Projects ───────────────────────────────────────── */}
        <section aria-labelledby="resume-projects" className="mb-5">
          <h2 id="resume-projects" className={headingClass}>
            Projects
          </h2>
          <div className="space-y-4">
            {projects.items.map((project) => (
              <article key={project.name}>
                <h3 className="text-[13px] font-semibold">
                  {project.name}
                  <span className="font-normal text-neutral-700">
                    {" "}
                    — {project.title}
                  </span>
                </h3>
                <ul className="mt-1 list-disc pl-5 space-y-0.5">
                  {project.highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
                <p className="mt-1 text-neutral-700">
                  <span className="font-semibold text-neutral-900">
                    Technologies:
                  </span>{" "}
                  {project.tech.join(", ")}
                </p>
                {"links" in project &&
                  project.links?.find((link) => link.label === "Live demo") && (
                    <p className="mt-1 text-neutral-700">
                      <span className="font-semibold text-neutral-900">Live:</span>{" "}
                      {project.links
                        .find((link) => link.label === "Live demo")!
                        .href.replace(/^https?:\/\//, "")}
                    </p>
                  )}
              </article>
            ))}
          </div>
        </section>

        {/* ── Certifications ─────────────────────────────────── */}
        <section aria-labelledby="resume-certifications">
          <h2 id="resume-certifications" className={headingClass}>
            Certifications
          </h2>
          <ul className="list-disc pl-5 space-y-0.5">
            {education.certifications.map((cert) => (
              <li key={cert}>{cert}</li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
