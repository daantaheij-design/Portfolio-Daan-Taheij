import { FadeUp, RevealLine } from "./Reveal";

const facts = [
  { label: "Based", value: "Netherlands" },
  { label: "Focus", value: "Brand, Editorial, Digital" },
  { label: "Tools", value: "Figma, After Effects, InDesign" },
  { label: "Status", value: "Open for select projects" },
];

export default function AboutPreview() {
  return (
    <section id="about" className="px-6 py-28 md:px-10 md:py-40">
      <span className="mb-8 block font-mono text-xs uppercase tracking-[0.14em] text-muted md:mb-12">
        (About)
      </span>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-8">
        <h2 className="font-display col-span-9 text-3xl font-medium uppercase leading-[1.05] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
          <RevealLine>{"I'm Daan — a graphic and"}</RevealLine>
          <RevealLine delay={0.06}>creative designer working</RevealLine>
          <RevealLine delay={0.12}>
            at the edge of <span className="text-muted">brand,</span>
          </RevealLine>
          <RevealLine delay={0.18}>editorial and digital design.</RevealLine>
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
    </section>
  );
}
