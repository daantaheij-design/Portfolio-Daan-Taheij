"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/lib/useReducedMotion";
import HorizontalMarquee from "./HorizontalMarquee";

const HERO_PHOTO_URL = "/images/hero/daan-pf.webp";
// Paper color the photo fades out to (matches --color-paper in globals.css).
const HERO_PHOTO_FADE_RGB = "244, 241, 234";
// Single anchor letter in TAHEIJ (0-based: T=0, A=1, H=2, E=3, I=4, J=5).
// "A" has the widest, most solid cap of the six at this bold display weight
// — "H"/"E" are similar width but read as noticeably busier once half-hidden
// by the paper wash, "T"/"I"/"J" are mostly a narrow stem with wide empty
// margins either side that can't hold a full head width-wise.
const HERO_PHOTO_ANCHOR_INDEX = 1;
// Subtle scroll-linked zoom on the portrait itself (independent of, and on
// top of, the existing whole-word scale-up below).
const HERO_PHOTO_ZOOM_MAX = 1.05;

type MaskState = {
  chars: HTMLElement[];
  rects: DOMRect[];
  minX: number;
  minY: number;
  boxWidth: number;
  boxHeight: number;
  baseSize: number;
  photoLeftBase: number;
  photoTopBase: number;
  driftRange: number;
  gradientLayer: string;
};

let measureCanvas: HTMLCanvasElement | null = null;

/**
 * Real rendered glyph ink metrics (cap-height etc.), found via canvas
 * measureText against the *uppercase* letter — the DOM text is lowercase
 * ("Taheij"), `uppercase` is applied purely visually via CSS, and canvas
 * measureText doesn't know about that text-transform. Measuring the
 * lowercase glyph gives a shorter, differently-positioned ink band than
 * what's actually painted on screen, which silently reintroduces cropping.
 */
function getInkMetrics(el: HTMLElement, text: string) {
  if (!measureCanvas) measureCanvas = document.createElement("canvas");
  const ctx = measureCanvas.getContext("2d");
  if (!ctx) return null;

  const cs = getComputedStyle(el);
  ctx.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
  const m = ctx.measureText(text);

  if (
    typeof m.actualBoundingBoxAscent !== "number" ||
    typeof m.fontBoundingBoxAscent !== "number" ||
    Number.isNaN(m.actualBoundingBoxAscent)
  ) {
    return null;
  }

  return {
    ascent: m.actualBoundingBoxAscent,
    descent: m.actualBoundingBoxDescent,
    fontAscent: m.fontBoundingBoxAscent,
    fontDescent: m.fontBoundingBoxDescent,
  };
}

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
  const maskStateRef = useRef<MaskState | null>(null);
  const progressRef = useRef(0);

  useLayoutEffect(() => {
    if (reduced) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "expo.out" },
        delay: 0.15,
      });

      tl.set(".hero-char", { yPercent: 130, rotateZ: 8, opacity: 0 })
        .set(".hero-fade", { autoAlpha: 0, y: 16 })
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
        .to(".hero-badge", { autoAlpha: 1, scale: 1, duration: 0.6 }, "-=0.5");
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  // Paints the mask at a given scroll progress (0 = rest, 1 = fully scrolled
  // through the hero). Reads cached measurements from maskStateRef so it can
  // be called every scrub tick without re-measuring the DOM.
  const renderMask = (progress: number) => {
    const state = maskStateRef.current;
    if (!state) return;
    progressRef.current = progress;

    const {
      chars,
      rects,
      minX,
      minY,
      boxWidth,
      boxHeight,
      baseSize,
      photoLeftBase,
      photoTopBase,
      driftRange,
      gradientLayer,
    } = state;

    const zoom = 1 + (HERO_PHOTO_ZOOM_MAX - 1) * progress;
    const size = baseSize * zoom;
    const sizeDelta = (size - baseSize) / 2;
    const drift = -driftRange * progress;

    const photoLeft = photoLeftBase - sizeDelta;
    const photoTop = photoTopBase - sizeDelta + drift;

    chars.forEach((el, i) => {
      const localX = rects[i].left - minX;
      const localY = rects[i].top - minY;

      el.style.backgroundImage = [gradientLayer, `url(${HERO_PHOTO_URL})`].join(", ");
      el.style.backgroundSize = [
        `${boxWidth}px ${boxHeight}px`,
        `${size}px ${size}px`,
      ].join(", ");
      el.style.backgroundPosition = [
        `${-localX}px ${-localY}px`,
        `${photoLeft - localX}px ${photoTop - localY}px`,
      ].join(", ");
      el.classList.add("text-image-mask");
    });
  };

  useLayoutEffect(() => {
    const applyPhotoMask = () => {
      const wrap = root.current?.querySelector<HTMLElement>(".hero-name-taheij");
      const chars = wrap
        ? Array.from(wrap.querySelectorAll<HTMLElement>(".hero-char"))
        : [];
      // DAAN is intentionally left untouched (no mask) — only TAHEIJ's
      // characters get styled below.
      if (!wrap || chars.length < 3) return;

      // Line wrapper has `will-change: transform`, which gives it its own
      // containing block — offsetTop/offsetLeft on the chars inside would
      // resolve per-element instead of against a shared ancestor, so we
      // use getBoundingClientRect() (always viewport-relative) instead.
      const rects = chars.map((el) => el.getBoundingClientRect());
      const minX = Math.min(...rects.map((r) => r.left));
      const maxX = Math.max(...rects.map((r) => r.right));
      const minY = Math.min(...rects.map((r) => r.top));
      const maxY = Math.max(...rects.map((r) => r.bottom));
      const boxWidth = maxX - minX;
      const boxHeight = maxY - minY;
      if (boxWidth <= 0 || boxHeight <= 0) return;

      const anchor = Math.min(HERO_PHOTO_ANCHOR_INDEX, chars.length - 1);
      const anchorEl = chars[anchor];
      const anchorRect = rects[anchor];
      const anchorWidth = anchorRect.right - anchorRect.left;
      const anchorCenterX = (anchorRect.left + anchorRect.right) / 2 - minX;

      // The CSS line box (boxHeight) includes leading above/below the
      // glyph's actual ink — sizing the portrait off boxHeight alone pushes
      // its top/bottom past the visible glyph shape, which reads as a
      // cropped head (hair/chin clipped away). Real canvas glyph metrics
      // give us the true ink band to fit the full, undistorted photo inside.
      const metrics = getInkMetrics(
        anchorEl,
        (anchorEl.textContent || "A").toUpperCase()
      );
      let inkTop: number;
      let inkHeight: number;
      if (metrics) {
        const extraLeading = boxHeight - (metrics.fontAscent + metrics.fontDescent);
        const baselineFromTop = extraLeading / 2 + metrics.fontAscent;
        inkTop = baselineFromTop - metrics.ascent;
        inkHeight = metrics.ascent + metrics.descent;
      } else {
        // Fallback for browsers without actualBoundingBox* support.
        inkTop = boxHeight * 0.14;
        inkHeight = boxHeight * 0.72;
      }

      // On narrow viewports the glyph (and so the ink band) is much smaller
      // in absolute pixels, so we scale the portrait up a little there to
      // keep the face legible — still comfortably contained by one letter.
      const mobileBoost =
        window.innerWidth < 640 ? 1.22 : window.innerWidth < 1024 ? 1.1 : 1;
      const baseSize =
        Math.min(inkHeight * 0.96, anchorWidth * 0.88) * mobileBoost;
      const photoLeftBase = anchorCenterX - baseSize / 2;
      // "A"'s enclosed counter (the hollow triangle above its crossbar) sits
      // in the upper portion of the cap-height. Centering the portrait in
      // the full ink band puts that hollow over the hair/brow area rather
      // than the eyes, nose or mouth — the least disruptive place for a
      // single uppercase glyph's negative space to interrupt a face.
      const photoTopBase = inkTop + inkHeight / 2 - baseSize / 2;
      // Keep the scroll-linked drift safely inside the ink band's own
      // headroom (leaving margin for the zoom's own small inward shift too).
      const topHeadroom = photoTopBase - inkTop;
      const bottomHeadroom = inkTop + inkHeight - (photoTopBase + baseSize);
      const driftRange = Math.max(0, Math.min(topHeadroom, bottomHeadroom)) * 0.6;

      // Radial paper-wash: stays fully clear over the photo itself, then
      // fades to solid, readable paper-white in both directions so the far
      // letters read as plain typography. The inner radius sits at/just
      // inside the photo's own half-width — any gap between where the photo
      // stops and the wash starts opacifying leaves a "dead zone" where
      // neither layer paints anything, showing raw background through the
      // clipped text.
      const innerR = baseSize * 0.48;
      const outerR = baseSize * 1.05;
      const fade = [
        `rgba(${HERO_PHOTO_FADE_RGB}, 0) 0%`,
        `rgba(${HERO_PHOTO_FADE_RGB}, 0) ${((innerR / outerR) * 100).toFixed(1)}%`,
        `rgba(${HERO_PHOTO_FADE_RGB}, 0.96) 100%`,
      ].join(", ");
      const gradientLayer = `radial-gradient(ellipse ${outerR}px ${outerR * 2.5}px at ${anchorCenterX}px ${inkTop + inkHeight / 2}px, ${fade})`;

      maskStateRef.current = {
        chars,
        rects,
        minX,
        minY,
        boxWidth,
        boxHeight,
        baseSize,
        photoLeftBase,
        photoTopBase,
        driftRange,
        gradientLayer,
      };
      renderMask(progressRef.current);
    };

    applyPhotoMask();
    window.addEventListener("resize", applyPhotoMask);
    document.fonts?.ready.then(applyPhotoMask).catch(() => {});

    return () => window.removeEventListener("resize", applyPhotoMask);
  }, []);

  useLayoutEffect(() => {
    if (reduced) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const maskProgress = { v: 0 };

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
        .to(
          maskProgress,
          { v: 1, ease: "none", duration: 1, onUpdate: () => renderMask(maskProgress.v) },
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
