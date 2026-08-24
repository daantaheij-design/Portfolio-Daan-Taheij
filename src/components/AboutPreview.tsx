import { FadeUp, RevealLine } from "./Reveal";
import { skills } from "@/data/skills";
import HorizontalMarquee from "./HorizontalMarquee";

const facts = [
  { label: "Gevestigd", value: "Nederland" },
  { label: "Huidige rol", value: "UP International" },
  { label: "Software", value: "Illustrator, Photoshop, InDesign" },
  { label: "Verkent", value: "AI in creatieve workflows" },
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
            <RevealLine>Ik ben Daan Taheij, grafisch</RevealLine>
            <RevealLine delay={0.06}>vormgever bij UP International.</RevealLine>
            <RevealLine delay={0.12}>
              Ik werk graag op het <span className="text-muted">snijvlak</span>
            </RevealLine>
            <RevealLine delay={0.18}>
              van vormgeving, technologie en nieuwe ideeën.
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
            Van Illustrator en Photoshop tot InDesign — en steeds vaker AI,
            om het creatieve proces te versnellen, ideeën sneller te
            ontwikkelen en nieuwe ontwerpmogelijkheden te verkennen.
          </p>
        </FadeUp>
      </div>

      <FadeUp delay={0.1} y={40} className="mt-20 border-t border-ink/12 md:mt-28">
        {skills.map((skill, i) => (
          <div
            key={skill.label}
            className="group border-b border-ink/12 py-3 md:py-5"
          >
            <HorizontalMarquee
              text={skill.label}
              reverse={i % 2 === 1}
              repeat={8}
              textClassName="font-display font-semibold uppercase leading-none tracking-tight text-ink/90 text-[15vw] sm:text-[10vw] md:text-[7.5vw] transition-colors duration-300 group-hover:text-ink/40"
            />
          </div>
        ))}
      </FadeUp>
    </section>
  );
}
