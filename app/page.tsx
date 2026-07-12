import { Hero } from "@/components/sections/Hero";
import { Projects } from "@/components/sections/Projects";
import { Contact } from "@/components/sections/Contact";
import { SkillsHtop } from "@/components/os/SkillsHtop";
import { EduLog } from "@/components/os/EduLog";
import { Heatmap } from "@/components/ui/Heatmap";
import { Reveal } from "@/components/ui/Reveal";

/** Mono, uppercase, muted section label — "/PROJECTS", "/SYSTEM", "/WHOAMI". */
function GroupLabel({ children }: { children: string }) {
  return (
    <Reveal>
      <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">{children}</p>
    </Reveal>
  );
}

/**
 * Home — MenuBar/BootSequence/Dock/StatusBar are mounted once in
 * layout.tsx, not here. This composes Hero plus three labeled OS
 * "workspace" groups: /PROJECTS, /SYSTEM (skills + contributions),
 * /WHOAMI (education + contact). Anchor ids landed: home, projects,
 * skills, github, education, contact — matching MenuBar nav and the Dock.
 */
export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <Hero />

      <section
        id="projects"
        aria-label="Projects"
        className="mx-auto w-full max-w-6xl px-6 py-16 sm:px-8 sm:py-20"
      >
        <GroupLabel>/PROJECTS</GroupLabel>
        <div className="mt-6">
          <Projects />
        </div>
      </section>

      <section
        aria-label="Skills and GitHub activity"
        className="mx-auto w-full max-w-6xl px-6 py-16 sm:px-8 sm:py-20"
      >
        <GroupLabel>/SYSTEM</GroupLabel>
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Reveal delay={0}>
            <SkillsHtop />
          </Reveal>
          <Reveal delay={1}>
            <Heatmap />
          </Reveal>
        </div>
      </section>

      <section
        aria-label="Education and contact"
        className="mx-auto w-full max-w-6xl px-6 py-16 sm:px-8 sm:py-20"
      >
        <GroupLabel>/WHOAMI</GroupLabel>
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Reveal delay={0}>
            <EduLog />
          </Reveal>
          <Reveal delay={1}>
            <Contact />
          </Reveal>
        </div>
      </section>
    </main>
  );
}
