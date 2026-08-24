"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

export default function Hero() {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "expo.out" },
        delay: 0.2,
      });

      tl.set(".hero-nameline", { yPercent: 110 })
        .set(".hero-fade", { autoAlpha: 0, y: 16 })
        .set(".hero-badge", { autoAlpha: 0, scale: 0.9 })
        .to(".hero-nameline", {
          yPercent: 0,
          duration: 1.1,
          stagger: 0.1,
        })
        .to(
          ".hero-fade",
          { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.08 },
          "-=0.55"
        )
        .to(
          ".hero-badge",
          { autoAlpha: 1, scale: 1, duration: 0.6 },
          "-=0.5"
        );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="top"
      ref={root}
      className="invert-section relative flex min-h-svh flex-col justify-between overflow-hidden px-6 pb-8 pt-28 md:px-10 md:pb-10 md:pt-32"
    >
      <div className="hero-fade flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.14em] text-paper/55">
        <span>Graphic &amp; Creative Designer</span>
        <span className="hidden sm:inline">Based in the Netherlands</span>
      </div>

      <div className="flex flex-1 flex-col justify-center">
        <h1 className="font-display font-semibold uppercase leading-[0.86] tracking-[-0.02em] text-[19vw] sm:text-[16vw] md:text-[15vw] lg:text-[13.5vw]">
          <span className="block overflow-hidden">
            <span className="hero-nameline block">Daan</span>
          </span>
          <span className="block overflow-hidden">
            <span className="hero-nameline block">Taheij</span>
          </span>
        </h1>

        <div className="hero-fade mt-6 max-w-xl font-mono text-xs uppercase leading-relaxed tracking-[0.14em] text-paper/70 sm:text-sm md:mt-8">
          Graphic Designer / Creative Designer — crafting identities,
          editorial systems and digital experiences with a bias for detail.
        </div>
      </div>

      <div className="flex items-end justify-between">
        <div className="hero-fade flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.14em] text-paper/55">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-paper/60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-paper" />
          </span>
          Available for select work — 2026
        </div>

        <div className="hero-badge relative hidden h-24 w-24 shrink-0 items-center justify-center sm:flex md:h-28 md:w-28">
          <div className="animate-spin-slow absolute inset-0">
            <svg viewBox="0 0 100 100" className="h-full w-full">
              <defs>
                <path
                  id="circlePath"
                  d="M 50, 50 m -38, 0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0"
                />
              </defs>
              <text className="fill-paper/70">
                <textPath
                  href="#circlePath"
                  className="font-mono text-[8.5px] uppercase tracking-[0.2em]"
                >
                  Scroll to explore — selected work —
                </textPath>
              </text>
            </svg>
          </div>
          <span className="font-mono text-[10px] text-paper/70">↓</span>
        </div>
      </div>
    </section>
  );
}
