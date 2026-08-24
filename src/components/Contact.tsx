"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "motion/react";
import { RevealLine } from "./Reveal";
import { scrollToHash } from "@/lib/scroll";
import { useReducedMotion } from "@/lib/useReducedMotion";

export default function Contact() {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    if (reduced) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".contact-heading",
        { scale: 0.8, autoAlpha: 0.25 },
        {
          scale: 1,
          autoAlpha: 1,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top 95%",
            end: "top 35%",
            scrub: 0.6,
          },
        }
      );

      gsap.fromTo(
        ".contact-rule",
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top 85%",
            end: "top 45%",
            scrub: 0.6,
          },
        }
      );
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      id="contact"
      ref={root}
      className="invert-section relative flex min-h-svh flex-col justify-between px-6 pb-8 pt-24 md:px-10 md:pb-10 md:pt-28"
    >
      <span className="font-mono text-xs uppercase tracking-[0.14em] text-paper/55">
        (Contact)
      </span>

      <div className="flex flex-1 flex-col justify-center">
        <div className="contact-rule mb-8 h-px w-full origin-left bg-paper/15 md:mb-12" />

        <h2 className="contact-heading font-display font-semibold uppercase leading-[0.9] tracking-[-0.02em] text-[16vw] will-change-transform sm:text-[12vw] md:text-[9.5vw]">
          <RevealLine>Samen</RevealLine>
          <RevealLine delay={0.08}>iets maken?</RevealLine>
        </h2>

        <motion.a
          href="mailto:daantaheij@gmail.com"
          data-cursor="link"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.35, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="group mt-10 inline-flex w-fit items-center gap-3 font-mono text-sm uppercase tracking-[0.12em] text-paper sm:text-base md:mt-14"
        >
          <span className="relative overflow-hidden">
            daantaheij@gmail.com
            <span className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-100 bg-paper transition-transform duration-500 ease-out group-hover:scale-x-0" />
          </span>
          <span className="transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </motion.a>
      </div>

      <div className="flex flex-col gap-6 border-t border-paper/15 pt-6 font-mono text-[11px] uppercase tracking-[0.12em] text-paper/50 sm:flex-row sm:items-center sm:justify-between md:pt-8">
        <span>© {new Date().getFullYear()} Daan Taheij — Alle rechten voorbehouden</span>
        <div className="flex gap-6">
          <a
            href="https://www.linkedin.com/in/daan-taheij-2512b3179/"
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="link"
            className="hover:text-paper"
          >
            LinkedIn
          </a>
        </div>
        <a
          href="#top"
          data-cursor="link"
          onClick={(e) => {
            e.preventDefault();
            scrollToHash("#top");
          }}
          className="hover:text-paper"
        >
          Naar boven ↑
        </a>
      </div>
    </section>
  );
}
