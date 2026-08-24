"use client";

import { motion } from "motion/react";
import { RevealLine } from "./Reveal";
import { scrollToHash } from "@/lib/scroll";

export default function Contact() {
  return (
    <section
      id="contact"
      className="invert-section relative flex min-h-svh flex-col justify-between px-6 pb-8 pt-24 md:px-10 md:pb-10 md:pt-28"
    >
      <span className="font-mono text-xs uppercase tracking-[0.14em] text-paper/55">
        (Contact)
      </span>

      <div className="flex flex-1 flex-col justify-center">
        <h2 className="font-display font-semibold uppercase leading-[0.9] tracking-[-0.02em] text-[13vw] sm:text-[10vw] md:text-[8.5vw]">
          <RevealLine>Let&apos;s make</RevealLine>
          <RevealLine delay={0.08}>something good.</RevealLine>
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
        <span>© {new Date().getFullYear()} Daan Taheij — All rights reserved</span>
        <div className="flex gap-6">
          <a href="#" data-cursor="link" className="hover:text-paper">
            Instagram
          </a>
          <a href="#" data-cursor="link" className="hover:text-paper">
            LinkedIn
          </a>
          <a href="#" data-cursor="link" className="hover:text-paper">
            Behance
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
          Back to top ↑
        </a>
      </div>
    </section>
  );
}
