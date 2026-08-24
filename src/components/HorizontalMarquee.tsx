"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/lib/useReducedMotion";

export default function HorizontalMarquee({
  text,
  className = "",
  textClassName = "",
  reverse = false,
  repeat = 6,
}: {
  text: string;
  className?: string;
  textClassName?: string;
  reverse?: boolean;
  repeat?: number;
}) {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    if (reduced || !root.current || !track.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        track.current,
        { xPercent: reverse ? -32 : -4 },
        {
          xPercent: reverse ? -4 : -32,
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
  }, [reduced, reverse]);

  const items = Array.from({ length: repeat });

  return (
    <div ref={root} className={`overflow-hidden ${className}`}>
      <div
        ref={track}
        className="flex w-max whitespace-nowrap will-change-transform"
      >
        {items.map((_, i) => (
          <span key={i} className={`inline-block pr-[0.5em] ${textClassName}`}>
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}
