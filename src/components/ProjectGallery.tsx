"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, type PanInfo, type Variants } from "motion/react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import type { Project } from "@/data/projects";

const EASE = [0.16, 1, 0.3, 1] as const;
const SLIDE_PERCENT = 8;
const SWIPE_OFFSET_THRESHOLD = 50;
const SWIPE_VELOCITY_THRESHOLD = 400;

function galleryImages(project: Project): string[] {
  if (project.images && project.images.length > 0) return project.images;
  if (project.coverImage) return [project.coverImage];
  return [];
}

export default function ProjectGallery({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const images = project ? galleryImages(project) : [];
  const total = images.length;
  const isOpen = !!project && total > 0;

  // Reset the current image whenever a different project opens. Adjusting
  // state during render (rather than in an effect) avoids an extra
  // cascading render — this is the pattern React recommends for resetting
  // state in response to a prop change.
  const [trackedSlug, setTrackedSlug] = useState(project?.slug);
  if (project?.slug !== trackedSlug) {
    setTrackedSlug(project?.slug);
    setIndex(0);
    setDirection(1);
  }

  const go = useCallback(
    (dir: 1 | -1) => {
      setDirection(dir);
      setIndex((i) => {
        if (total < 2) return i;
        return (i + dir + total) % total;
      });
    },
    [total]
  );

  // Scroll lock, keyboard navigation and focus trap while open.
  useEffect(() => {
    if (!isOpen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.__lenis?.stop();

    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        go(1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        go(-1);
      } else if (e.key === "Tab") {
        const focusable = containerRef.current?.querySelectorAll<HTMLElement>(
          'button, [href], [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable || focusable.length === 0) return;
        const list = Array.from(focusable);
        const first = list[0];
        const last = list[list.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
      window.__lenis?.start();
      previouslyFocused?.focus();
    };
  }, [isOpen, onClose, go]);

  const handleDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (total < 2) return;
    if (
      info.offset.x < -SWIPE_OFFSET_THRESHOLD ||
      info.velocity.x < -SWIPE_VELOCITY_THRESHOLD
    ) {
      go(1);
    } else if (
      info.offset.x > SWIPE_OFFSET_THRESHOLD ||
      info.velocity.x > SWIPE_VELOCITY_THRESHOLD
    ) {
      go(-1);
    }
  };

  const variants: Variants = reduced
    ? {
        enter: { opacity: 0 },
        center: { opacity: 1 },
        exit: { opacity: 0 },
      }
    : {
        enter: (dir: number) => ({
          x: `${dir * SLIDE_PERCENT}%`,
          opacity: 0,
          scale: 0.98,
        }),
        center: { x: "0%", opacity: 1, scale: 1 },
        exit: (dir: number) => ({
          x: `${-dir * SLIDE_PERCENT}%`,
          opacity: 0,
          scale: 0.98,
        }),
      };

  const transition = reduced
    ? { duration: 0.18, ease: "linear" as const }
    : { duration: 0.45, ease: EASE };

  return (
    <AnimatePresence>
      {isOpen && project && (
        <motion.div
          ref={containerRef}
          role="dialog"
          aria-modal="true"
          aria-label={`Beeldgalerij — ${project.name}`}
          className="gallery-overlay fixed inset-0 z-[1000] flex flex-col bg-ink"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: EASE }}
        >
          <div className="flex items-center justify-between px-6 pt-6 md:px-10 md:pt-8">
            <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-paper/55 md:text-xs">
              {project.name}
            </div>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Sluiten"
              className="font-mono text-[11px] uppercase tracking-[0.14em] text-paper/70 transition-colors hover:text-paper md:text-xs"
            >
              Sluiten ✕
            </button>
          </div>

          <div className="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-6 md:px-16 md:py-10">
            {total > 1 && (
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Vorige beeld"
                className="absolute left-2 top-1/2 z-10 -translate-y-1/2 p-3 font-mono text-2xl text-paper/60 transition-colors hover:text-paper md:left-6 md:text-3xl"
              >
                ←
              </button>
            )}

            <div className="relative h-[70vh] w-full max-w-4xl md:h-[78vh]">
              <AnimatePresence initial={false} custom={direction}>
                <motion.div
                  key={index}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={transition}
                  drag={total > 1 ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onDragEnd={handleDragEnd}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={images[index]}
                    alt={`${project.name} — beeld ${index + 1}`}
                    className="max-h-full max-w-full select-none object-contain"
                    draggable={false}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {total > 1 && (
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Volgende beeld"
                className="absolute right-2 top-1/2 z-10 -translate-y-1/2 p-3 font-mono text-2xl text-paper/60 transition-colors hover:text-paper md:right-6 md:text-3xl"
              >
                →
              </button>
            )}
          </div>

          {total > 1 && (
            <div className="flex items-center justify-center pb-6 md:pb-8">
              <span className="font-feature-tnum font-mono text-[11px] uppercase tracking-[0.14em] text-paper/50 md:text-xs">
                {index + 1} / {String(total).padStart(2, "0")}
              </span>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
