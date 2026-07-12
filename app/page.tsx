import { IslandNav } from "@/components/ui/IslandNav";
import { TraceDivider } from "@/components/ui/TraceDivider";
import { Hero } from "@/components/sections/Hero";
import { Bento } from "@/components/sections/Bento";
import { Projects } from "@/components/sections/Projects";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <IslandNav />
      <main className="flex flex-1 flex-col">
        <Hero />
        <Bento />
        <TraceDivider />
        <Projects />
        <TraceDivider />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
