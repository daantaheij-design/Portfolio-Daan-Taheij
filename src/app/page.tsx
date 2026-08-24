import Hero from "@/components/Hero";
import SelectedWork from "@/components/SelectedWork";
import ZoomStatement from "@/components/ZoomStatement";
import AboutPreview from "@/components/AboutPreview";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <main>
      <Hero />
      <SelectedWork />
      <ZoomStatement
        lines={["Vormgeving,", "versterkt door technologie."]}
      />
      <AboutPreview />
      <Contact />
    </main>
  );
}
