"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import PlaceholderVisual from "./PlaceholderVisual";
import { RevealLine } from "./Reveal";
import type { Project } from "@/data/projects";

export default function ProjectRow({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const root = useRef<HTMLDivElement>(null);
  const offset = index % 2 === 1;

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.registerPlugin(ScrollTrigger);

      gsap.fromTo(
        ".project-visual-inner",
        { scale: 1.22 },
        {
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top bottom",
            end: "top 20%",
            scrub: 0.6,
          },
        }
      );

      gsap.fromTo(
        root.current,
        { y: 60 },
        {
          y: 0,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top bottom",
            end: "top 55%",
            scrub: 0.6,
          },
        }
      );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={root}
      className="border-t border-ink/12 py-10 first:border-t-0 md:py-16"
    >
      <div className="mb-6 flex items-baseline justify-between gap-4 md:mb-10">
        <div className="flex items-baseline gap-4 md:gap-6">
          <span className="font-mono text-xs text-muted md:text-sm">
            {project.number}
          </span>
          <h3 className="font-display overflow-hidden text-3xl font-semibold uppercase leading-[0.95] tracking-tight sm:text-5xl md:text-7xl">
            <RevealLine>{project.name}</RevealLine>
          </h3>
        </div>
        <span className="hidden shrink-0 font-mono text-xs text-muted md:block">
          {project.year}
        </span>
      </div>

      <div
        className={`${offset ? "md:ml-[12%]" : "md:mr-[12%]"} overflow-hidden`}
      >
        <div className="project-visual-inner">
          <PlaceholderVisual
            index={project.number}
            tone={index === 1 ? "ink" : "paper"}
            label={project.category}
          />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.12em] text-muted md:mt-6">
        <span>{project.category}</span>
        <span className="md:hidden">{project.year}</span>
      </div>
    </div>
  );
}
