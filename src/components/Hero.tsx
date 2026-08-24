"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/lib/useReducedMotion";
import HorizontalMarquee from "./HorizontalMarquee";

const HERO_PHOTO_URL = "/images/hero/daan-pf.webp";

function Chars({ text }: { text: string }) {
  return (
    <>
      {text.split("").map((ch, i) => (
        <span key={i} className="hero-char inline-block will-change-transform">
          {ch}
        </span>
      ))}
    </>
  );
}

export default function Hero() {
  const wrapper = useRef<HTMLDivElement>(null);
  const root = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    if (reduced) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "expo.out" },
        delay: 0.15,
      });

      tl.set(".hero-char", { yPercent: 130, rotateZ: 8, opacity: 0 })
        .set(".hero-fade", { autoAlpha: 0, y: 16 })
        .set(".hero-portrait", { autoAlpha: 0, y: 24, scale: 0.96 })
        .set(".hero-badge", { autoAlpha: 0, scale: 0.9 })
        .to(".hero-char", {
          yPercent: 0,
          rotateZ: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.025,
        })
        .to(
          ".hero-fade",
          { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.08 },
          "-=0.6"
        )
        .to(
          ".hero-portrait",
          { autoAlpha: 1, y: 0, scale: 1, duration: 0.9 },
          "-=0.7"
        )
        .to(".hero-badge", { autoAlpha: 1, scale: 1, duration: 0.6 }, "-=0.5");
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  useLayoutEffect(() => {
    if (reduced) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapper.current,
          start: "top top",
          end: "+=100%",
          scrub: 0.8,
        },
      });

      tl.to(
        ".hero-name-daan",
        { scale: 1.3, xPercent: -3, ease: "none", duration: 1 },
        0
      )
        .to(
          ".hero-name-taheij",
          { scale: 1.5, xPercent: 5, ease: "none", duration: 1 },
          0
        )
        // The portrait drifts and turns at its own, slightly different
        // pace from the typography — connected to the same scroll, never
        // identical to it, so name and photo read as two related but
        // distinct layers rather than one locked unit.
        .to(
          ".hero-portrait",
          { y: -46, rotate: 2, scale: 1.05, ease: "none", duration: 1 },
          0
        )
        .to(
          ".hero-ticker",
          { autoAlpha: 0, ease: "none", duration: 0.5 },
          0.3
        );
    }, wrapper);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <div
      ref={wrapper}
      className="relative"
      style={{ height: reduced ? "auto" : "200vh" }}
    >
      <section
        id="top"
        ref={root}
        className={`invert-section flex min-h-svh flex-col justify-between overflow-hidden px-6 pb-8 pt-28 md:px-10 md:pb-10 md:pt-32 ${
          reduced ? "relative" : "sticky top-0"
        }`}
      >
        <div className="hero-fade flex flex-wrap items-center justify-between gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-[0.14em] text-paper/55">
          <span>Grafisch Vormgever</span>
          <span>UP International</span>
        </div>

        {/* Editorial portrait — a separate floating element, not part of
            the typography. Sized/positioned per breakpoint so the full
            head always stays clear of both the type and the viewport
            edge; only allowed to bleed off-canvas on its outer (shoulder)
            side, never across the face. */}
        <div
          aria-hidden
          className="hero-fade hero-portrait pointer-events-none absolute bottom-[16%] right-2 w-[38vw] max-w-[190px] will-change-transform sm:bottom-[15%] sm:right-4 sm:w-[30vw] sm:max-w-[240px] md:bottom-auto md:right-[6%] md:top-1/2 md:w-[21vw] md:max-w-[300px] md:-translate-y-[42%] lg:right-[9%] lg:w-[17vw] lg:max-w-[320px]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={HERO_PHOTO_URL}
            alt=""
            draggable={false}
            className="h-auto w-full select-none"
            style={{ filter: "grayscale(1) contrast(1.3) brightness(0.96)" }}
          />
        </div>

        <div className="flex flex-1 flex-col justify-center">
          <h1 className="hero-name font-display font-semibold uppercase leading-[0.86] tracking-[-0.02em] text-[19vw] sm:text-[16vw] md:text-[15vw] lg:text-[13.5vw]">
            <span className="hero-name-daan block origin-left will-change-transform">
              <Chars text="Daan" />
            </span>
            <span className="hero-name-taheij block origin-left will-change-transform">
              <Chars text="Taheij" />
            </span>
          </h1>
        </div>

        <div className="hero-fade hero-ticker -mx-6 border-y border-paper/15 py-3 md:-mx-10">
          <HorizontalMarquee
            text="Grafisch Vormgever bij UP International ✦"
            reverse
            textClassName="font-mono text-xs uppercase tracking-[0.14em] text-paper/60 sm:text-sm"
          />
        </div>

        <div className="flex items-end justify-end pt-6">
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
                    Scroll — geselecteerd werk —
                  </textPath>
                </text>
              </svg>
            </div>
            <span className="font-mono text-[10px] text-paper/70">↓</span>
          </div>
        </div>
      </section>
    </div>
  );
}
