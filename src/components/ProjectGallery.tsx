"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  type PanInfo,
  type Variants,
} from "motion/react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import type { Project } from "@/data/projects";

const EASE = [0.16, 1, 0.3, 1] as const;
const SLIDE_PERCENT = 8;
const SWIPE_OFFSET_THRESHOLD = 50;
const SWIPE_VELOCITY_THRESHOLD = 400;
// Generic, data-driven zoom applied to whichever image is currently open —
// not tied to any project, category or filename.
const ZOOM_SCALE = 2;

function galleryImages(project: Project): string[] {
  if (project.images && project.images.length > 0) return project.images;
  if (project.coverImage) return [project.coverImage];
  return [];
}

/** Where a point (in page coordinates) falls within an element, as a 0-100 %. */
function pointToOriginPercent(point: { x: number; y: number }, rect: DOMRect) {
  if (rect.width <= 0 || rect.height <= 0) return { x: 50, y: 50 };
  const x = ((point.x - rect.left) / rect.width) * 100;
  const y = ((point.y - rect.top) / rect.height) * 100;
  return { x: Math.min(100, Math.max(0, x)), y: Math.min(100, Math.max(0, y)) };
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
  const [zoomed, setZoomed] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState({ x: 50, y: 50 });
  const [panConstraints, setPanConstraints] = useState({
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  });
  const containerRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const naturalSizeRef = useRef<{ w: number; h: number } | null>(null);
  const panX = useMotionValue(0);
  const panY = useMotionValue(0);

  const images = project ? galleryImages(project) : [];
  const total = images.length;
  const isOpen = !!project && total > 0;

  const resetZoom = useCallback(() => {
    setZoomed(false);
    panX.set(0);
    panY.set(0);
  }, [panX, panY]);

  // Reset the current image whenever a different project opens. Adjusting
  // state during render (rather than in an effect) avoids an extra
  // cascading render — this is the pattern React recommends for resetting
  // state in response to a prop change.
  const [trackedSlug, setTrackedSlug] = useState(project?.slug);
  if (project?.slug !== trackedSlug) {
    setTrackedSlug(project?.slug);
    setIndex(0);
    setDirection(1);
    resetZoom();
  }

  const go = useCallback(
    (dir: 1 | -1) => {
      if (total < 2) return;
      // Zoom is per-image state, never carried across navigation.
      resetZoom();
      setDirection(dir);
      setIndex((i) => (i + dir + total) % total);
    },
    [total, resetZoom]
  );

  const toggleZoom = useCallback(
    (point: { x: number; y: number } | null) => {
      setZoomed((wasZoomed) => {
        if (!wasZoomed && point) {
          const rect = imgRef.current?.getBoundingClientRect();
          if (rect) setZoomOrigin(pointToOriginPercent(point, rect));
        }
        panX.set(0);
        panY.set(0);
        return !wasZoomed;
      });
    },
    [panX, panY]
  );

  // Bounds for panning a zoomed image, derived from its real "contain"
  // fitted size against the stage — generic for any image's own aspect
  // ratio, not a fixed/assumed shape. Only measured (via the DOM refs,
  // which requires an effect) while actually zoomed; the unzoomed case is
  // derived inline at the point of use instead of mirrored into state here.
  useEffect(() => {
    if (!zoomed) return;
    const stage = stageRef.current?.getBoundingClientRect();
    const nat = naturalSizeRef.current;
    if (!stage || !nat || nat.w <= 0 || nat.h <= 0) return;

    const fitScale = Math.min(stage.width / nat.w, stage.height / nat.h);
    const scaledW = nat.w * fitScale * ZOOM_SCALE;
    const scaledH = nat.h * fitScale * ZOOM_SCALE;
    const maxX = Math.max(0, (scaledW - stage.width) / 2);
    const maxY = Math.max(0, (scaledH - stage.height) / 2);
    setPanConstraints({ left: -maxX, right: maxX, top: -maxY, bottom: maxY });
  }, [zoomed, index]);

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

  const handleSlideDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (zoomed || total < 2) return;
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

  const handleImageTap = (
    _event: PointerEvent,
    info: { point: { x: number; y: number } }
  ) => {
    toggleZoom(info.point);
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

  const zoomTransition = { duration: reduced ? 0.15 : 0.35, ease: EASE };

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

            <div
              ref={stageRef}
              className="relative h-[70vh] w-full max-w-4xl md:h-[78vh]"
            >
              <AnimatePresence initial={false} custom={direction}>
                <motion.div
                  key={index}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={transition}
                  drag={!zoomed && total > 1 ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onDragEnd={handleSlideDragEnd}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <motion.img
                    ref={imgRef}
                    src={images[index]}
                    alt={`${project.name} — beeld ${index + 1}`}
                    draggable={false}
                    onLoad={(e) => {
                      naturalSizeRef.current = {
                        w: e.currentTarget.naturalWidth,
                        h: e.currentTarget.naturalHeight,
                      };
                    }}
                    onTap={handleImageTap}
                    drag={zoomed}
                    dragConstraints={panConstraints}
                    dragElastic={0.05}
                    animate={{ scale: zoomed ? ZOOM_SCALE : 1 }}
                    transition={zoomTransition}
                    style={{
                      x: panX,
                      y: panY,
                      transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%`,
                      cursor: zoomed ? "zoom-out" : "zoom-in",
                      touchAction: "none",
                    }}
                    className="max-h-full max-w-full select-none object-contain"
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
