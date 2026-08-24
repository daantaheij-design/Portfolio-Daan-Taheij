import Hero from "@/components/Hero";
import SelectedWork from "@/components/SelectedWork";
import AboutPreview from "@/components/AboutPreview";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <main>
      <Hero />
      <SelectedWork />
      <AboutPreview />
      <Contact />
    </main>
  );
}
