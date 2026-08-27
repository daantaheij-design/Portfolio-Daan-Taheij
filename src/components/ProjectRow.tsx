"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, useMotionValue, useSpring } from "motion/react";
import PlaceholderVisual from "./PlaceholderVisual";
import { RevealLine } from "./Reveal";
import { useReducedMotion } from "@/lib/useReducedMotion";
import type { Project } from "@/data/projects";

export default function ProjectRow({
  project,
  index,
  total,
  onOpenGallery,
}: {
  project: Project;
  index: number;
  total: number;
  onOpenGallery: (project: Project) => void;
}) {
  const root = useRef<HTMLDivElement>(null);
  const magnetic = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  // Purely cosmetic alternation (image indent + placeholder tone) so the
  // list doesn't feel repetitive — the project header itself always sits
  // at the top of the section, consistently, for every project.
  const offset = index % 2 === 1;
  const tone = index % 2 === 1 ? "ink" : "paper";

  const hasGallery = Boolean(
    (project.images && project.images.length > 0) || project.coverImage
  );

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 200, damping: 20, mass: 0.4 });
  const smy = useSpring(my, { stiffness: 200, damping: 20, mass: 0.4 });

  const handleMagneticMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = magnetic.current?.getBoundingClientRect();
    if (!rect) return;
    const relX = (e.clientX - (rect.left + rect.width / 2)) / rect.width;
    const relY = (e.clientY - (rect.top + rect.height / 2)) / rect.height;
    mx.set(relX * 24);
    my.set(relY * 16);
  };

  const handleMagneticLeave = () => {
    mx.set(0);
    my.set(0);
  };

  useLayoutEffect(() => {
    if (reduced) return;

    const ctx = gsap.context(() => {
      gsap.registerPlugin(ScrollTrigger);

      gsap.fromTo(
        ".project-visual-inner",
        { scale: 1 },
        {
          scale: 1.1,
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

      gsap.fromTo(
        ".proj-number",
        { y: 90 },
        {
          y: -90,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.6,
          },
        }
      );
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <div
      ref={root}
      className="relative border-t border-ink/12 py-10 first:border-t-0 md:py-16"
    >
      <motion.div
        ref={magnetic}
        onMouseMove={handleMagneticMove}
        onMouseLeave={handleMagneticLeave}
        style={{ x: smx, y: smy }}
        className="relative mb-6 flex items-baseline justify-between gap-4 md:mb-10"
      >
        <div className="relative flex items-baseline gap-4 md:gap-6">
          <span
            aria-hidden
            className="proj-number pointer-events-none absolute -left-2 -top-6 select-none font-display text-[20vw] font-semibold leading-none text-ink/[0.05] will-change-transform sm:text-[12vw] md:-top-10"
          >
            {project.number}
          </span>
          <span className="relative font-mono text-xs text-muted md:text-sm">
            {project.number}
          </span>
          <div className="relative">
            <h3 className="font-display overflow-hidden text-3xl font-semibold uppercase leading-[0.95] tracking-tight sm:text-5xl md:text-7xl">
              <RevealLine>{project.name}</RevealLine>
            </h3>
          </div>
        </div>
        <span className="relative hidden shrink-0 font-mono text-xs text-muted md:block">
          {project.year}
        </span>
      </motion.div>

      <div className={`relative ${offset ? "md:ml-[12%]" : "md:mr-[12%]"}`}>
        <div className="relative overflow-hidden">
          <div className="project-visual-inner">
            <PlaceholderVisual
              index={project.number}
              total={total}
              tone={tone}
              label={project.category}
              image={project.coverImage}
              interactive={hasGallery}
              onOpen={hasGallery ? () => onOpenGallery(project) : undefined}
            />
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.12em] text-muted md:mt-6">
        <span className="text-accent">{project.category}</span>
        <span className="md:hidden">{project.year}</span>
      </div>
    </div>
  );
}
