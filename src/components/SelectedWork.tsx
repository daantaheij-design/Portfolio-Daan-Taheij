"use client";

import { useCallback, useState } from "react";
import { projects, type Project } from "@/data/projects";
import ProjectRow from "./ProjectRow";
import ProjectGallery from "./ProjectGallery";

export default function SelectedWork() {
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  const openGallery = useCallback((project: Project) => {
    setActiveProject(project);
  }, []);

  const closeGallery = useCallback(() => {
    setActiveProject(null);
  }, []);

  return (
    <section id="work" className="px-6 pt-24 md:px-10 md:pt-32">
      <div className="flex items-end justify-end border-b border-ink/12 pb-6 md:pb-8">
        <span className="hidden font-mono text-xs uppercase tracking-[0.14em] text-muted sm:block">
          (Index — {String(projects.length).padStart(2, "0")})
        </span>
      </div>

      <div>
        {projects.map((project, i) => (
          <ProjectRow
            key={project.slug}
            project={project}
            index={i}
            total={projects.length}
            onOpenGallery={openGallery}
          />
        ))}
      </div>

      <ProjectGallery project={activeProject} onClose={closeGallery} />
    </section>
  );
}
