"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/lib/useReducedMotion";

export default function ZoomStatement({
  lines,
}: {
  lines: string[];
}) {
  const root = useRef<HTMLDivElement>(null);
  const word = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    if (reduced || !root.current || !word.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        word.current,
        { scale: 0.65, opacity: 0.2 },
        {
          scale: 1.12,
          opacity: 1,
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
    <section
      ref={root}
      className="invert-section relative flex min-h-[70vh] items-center justify-center overflow-hidden px-6 py-24 md:px-10"
    >
      <div
        ref={word}
        className="font-display max-w-5xl text-center font-semibold uppercase leading-[0.98] tracking-tight text-[11vw] will-change-transform sm:text-[8vw] md:text-[6.2vw]"
      >
        {lines.map((line, i) => (
          <span key={i} className="block">
            {line.split(".").map((part, j, arr) =>
              j < arr.length - 1 ? (
                <span key={j}>
                  {part}
                  <span className="text-accent">.</span>
                </span>
              ) : (
                <span key={j}>{part}</span>
              )
            )}
          </span>
        ))}
      </div>
    </section>
  );
}
