import { projects } from "@/data/projects";
import ProjectRow from "./ProjectRow";
import { RevealLine } from "./Reveal";

export default function SelectedWork() {
  return (
    <section id="work" className="px-6 pt-24 md:px-10 md:pt-32">
      <div className="flex items-end justify-between border-b border-ink/12 pb-6 md:pb-8">
        <h2 className="font-display overflow-hidden text-4xl font-semibold uppercase leading-none tracking-tight sm:text-6xl md:text-7xl">
          <RevealLine>Selected Work</RevealLine>
        </h2>
        <span className="hidden font-mono text-xs uppercase tracking-[0.14em] text-muted sm:block">
          (Index — 03)
        </span>
      </div>

      <div>
        {projects.map((project, i) => (
          <ProjectRow key={project.slug} project={project} index={i} />
        ))}
      </div>
    </section>
  );
}
