import { FadeUp, RevealLine, ScaleReveal } from "./Reveal";
import { skills } from "@/data/skills";

const facts = [
  { label: "Gevestigd", value: "Nederland" },
  { label: "Huidige rol", value: "UP International" },
  { label: "Focus", value: "Grafisch ontwerp & concept" },
  { label: "Tools", value: "Illustrator, Photoshop, InDesign, AI" },
];

export default function AboutPreview() {
  return (
    <section id="about" className="py-28 md:py-40">
      <div className="px-6 md:px-10">
        <span className="mb-8 block font-mono text-xs uppercase tracking-[0.14em] text-muted md:mb-12">
          (Over mij)
        </span>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-8">
          <h2 className="font-display col-span-9 text-3xl font-medium uppercase leading-[1.05] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            <RevealLine>Mijn naam is Daan Taheij</RevealLine>
            <RevealLine delay={0.06}>en ik ben</RevealLine>
            <RevealLine delay={0.12}>
              <span className="text-accent">grafisch vormgever</span>
            </RevealLine>
          </h2>

          <div className="col-span-3 flex flex-col justify-end">
            <FadeUp delay={0.2}>
              <dl className="space-y-5 border-t border-ink/12 pt-6 font-mono text-xs uppercase tracking-[0.1em] md:pt-8">
                {facts.map((f) => (
                  <div key={f.label} className="flex flex-col gap-1">
                    <dt className="text-muted">{f.label}</dt>
                    <dd>{f.value}</dd>
                  </div>
                ))}
              </dl>
            </FadeUp>
          </div>
        </div>

        <FadeUp delay={0.24} className="mt-14 md:mt-20">
          <p className="max-w-2xl font-mono text-sm uppercase leading-relaxed tracking-[0.06em] text-muted md:text-base">
            Mijn basis ligt in Illustrator, Photoshop en InDesign, met een
            focus op grafisch ontwerp en creatieve conceptontwikkeling.
            Daarnaast volg ik graag nieuwe technologie zoals AI, en wat die
            binnen het ontwerpproces kan betekenen.
          </p>
        </FadeUp>
      </div>

      <div className="mt-20 border-t border-ink/12 px-6 md:mt-28 md:px-10">
        {skills.map((skill, i) => (
          <ScaleReveal key={skill.label} delay={i * 0.07}>
            <div className="group flex items-baseline gap-4 border-b border-ink/12 py-5 md:gap-8 md:py-7">
              <span className="font-mono text-xs text-muted md:text-sm">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="font-display font-semibold uppercase leading-none tracking-tight text-ink/90 transition-colors duration-300 group-hover:text-accent text-[11vw] sm:text-[7vw] md:text-[4.4vw]">
                {skill.label}
              </span>
            </div>
          </ScaleReveal>
        ))}
      </div>
    </section>
  );
}
