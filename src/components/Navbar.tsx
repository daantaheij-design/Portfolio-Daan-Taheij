"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { scrollToHash } from "@/lib/scroll";

const links = [
  { label: "Werk", href: "#work" },
  { label: "Over mij", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
  }, [open]);

  const handleNav = (href: string) => {
    setOpen(false);
    scrollToHash(href);
  };

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 mix-invert">
        <div className="flex items-center justify-between px-6 py-5 text-paper md:px-10 md:py-7">
          <a
            href="#top"
            data-cursor="link"
            onClick={(e) => {
              e.preventDefault();
              handleNav("#top");
            }}
            className="font-display text-sm font-semibold uppercase tracking-[0.04em]"
          >
            Daan&nbsp;Taheij
          </a>

          <nav className="hidden items-center gap-10 md:flex">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                data-cursor="link"
                onClick={(e) => {
                  e.preventDefault();
                  handleNav(l.href);
                }}
                className="font-mono text-xs uppercase tracking-[0.12em]"
              >
                {l.label}
              </a>
            ))}
            <a
              href="mailto:daantaheij@gmail.com"
              data-cursor="link"
              className="font-mono text-xs uppercase tracking-[0.12em] underline underline-offset-4"
            >
              Zeg Hallo
            </a>
          </nav>

          <button
            type="button"
            data-cursor="link"
            onClick={() => setOpen((v) => !v)}
            className="relative z-50 flex h-8 w-9 flex-col items-end justify-center gap-[7px] md:hidden"
            aria-label="Menu openen of sluiten"
          >
            <span
              className={`h-px w-full bg-paper transition-transform duration-300 ${
                open ? "translate-y-[4px] rotate-45" : ""
              }`}
            />
            <span
              className={`h-px w-2/3 bg-paper transition-all duration-300 ${
                open ? "w-full -translate-y-[3px] -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-40 flex flex-col justify-center gap-2 bg-ink px-6 md:hidden"
          >
            {links.map((l, i) => (
              <motion.a
                key={l.href}
                href={l.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNav(l.href);
                }}
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.15 + i * 0.06, duration: 0.5 }}
                className="font-display text-5xl font-semibold uppercase text-paper"
              >
                {l.label}
              </motion.a>
            ))}
            <motion.a
              href="mailto:daantaheij@gmail.com"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.15 + links.length * 0.06, duration: 0.5 }}
              className="mt-6 font-mono text-sm uppercase tracking-[0.12em] text-muted"
            >
              daantaheij@gmail.com
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
