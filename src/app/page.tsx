import { Cursor } from "@/components/Cursor";
import { Footer } from "@/components/Footer";
import { IntroLoader } from "@/components/IntroLoader";
import { Navbar } from "@/components/Navbar";
import { InteractivePlayground } from "@/components/playground/InteractivePlayground";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Credentials } from "@/components/sections/Credentials";
import { Experience } from "@/components/sections/Experience";
import { ClientWork } from "@/components/sections/ClientWork";
import { Hero } from "@/components/sections/Hero";
import { Projects } from "@/components/sections/Projects";
import { Skills } from "@/components/sections/Skills";

export default function Home() {
  return (
    <>
      <IntroLoader />
      <Cursor />
      <Navbar />
      <main id="main">
        <Hero />
        <About />
        <Projects />
        <Experience />
        <ClientWork />
        <Skills />
        <Credentials />
        <InteractivePlayground />
        <Contact />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
