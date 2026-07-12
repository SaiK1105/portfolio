import { IslandNav } from "@/components/ui/IslandNav";
import { TraceDivider } from "@/components/ui/TraceDivider";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Skills } from "@/components/sections/Skills";
import { Projects } from "@/components/sections/Projects";
import { Github } from "@/components/sections/Github";
import { Education } from "@/components/sections/Education";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <IslandNav />
      <main className="flex flex-1 flex-col">
        <Hero />
        <div className="band bg-surface-1 border-y border-white/5">
          <About />
          <Skills />
        </div>
        <TraceDivider />
        <Projects />
        <TraceDivider />
        <div className="band bg-surface-1 border-y border-white/5">
          <Github />
          <Education />
        </div>
        <Contact />
      </main>
      <Footer />
    </>
  );
}
