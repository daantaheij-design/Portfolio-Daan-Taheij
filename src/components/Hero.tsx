"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/lib/useReducedMotion";
import HorizontalMarquee from "./HorizontalMarquee";

const HERO_PHOTO_URL = "/images/hero/daan-pf.webp";
// Vertical anchor (0-1) into the combined DAAN+TAHEIJ box used to crop the
// (square) portrait — keeps the face roughly centred across both lines.
const HERO_PHOTO_MASK_Y = 0.32;
// Paper color the photo fades out to (matches --color-paper in globals.css).
const HERO_PHOTO_FADE_RGB = "244, 241, 234";

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

  useLayoutEffect(() => {
    const applyPhotoMask = () => {
      const nameEl = root.current?.querySelector<HTMLElement>(".hero-name");
      const chars = nameEl
        ? Array.from(nameEl.querySelectorAll<HTMLElement>(".hero-char"))
        : [];
      if (!nameEl || chars.length === 0) return;

      // Treat DAAN + TAHEIJ as one shared coordinate space so the photo
      // reads as a single continuous image flowing from one word into
      // the other, instead of two separately-cropped words. Each line
      // wrapper has `will-change: transform`, which gives it its own
      // containing block — offsetTop/offsetLeft on the chars inside would
      // resolve per-line instead of against a shared ancestor, so we use
      // getBoundingClientRect() (always viewport-relative) instead.
      const rects = chars.map((el) => el.getBoundingClientRect());
      const minX = Math.min(...rects.map((r) => r.left));
      const maxX = Math.max(...rects.map((r) => r.right));
      const minY = Math.min(...rects.map((r) => r.top));
      const maxY = Math.max(...rects.map((r) => r.bottom));
      const boxWidth = maxX - minX;
      const boxHeight = maxY - minY;
      if (boxWidth <= 0 || boxHeight <= 0) return;

      // Source photo is square — scale it to "cover" the combined box.
      const photoSize = Math.max(boxWidth, boxHeight);
      const biasX = (photoSize - boxWidth) / 2;
      const biasY = (photoSize - boxHeight) * HERO_PHOTO_MASK_Y;

      // Vertical wash that keeps the photo strongest through DAAN and
      // fades it smoothly (no hard seam) into solid, readable paper-white
      // by the end of TAHEIJ.
      const fade = [
        `rgba(${HERO_PHOTO_FADE_RGB}, 0) 0%`,
        `rgba(${HERO_PHOTO_FADE_RGB}, 0) 50%`,
        `rgba(${HERO_PHOTO_FADE_RGB}, 0.85) 100%`,
      ].join(", ");

      chars.forEach((el, i) => {
        const localX = rects[i].left - minX;
        const localY = rects[i].top - minY;

        el.style.backgroundImage = [
          `linear-gradient(to bottom, ${fade})`,
          `url(${HERO_PHOTO_URL})`,
        ].join(", ");
        el.style.backgroundSize = [
          `${boxWidth}px ${boxHeight}px`,
          `${photoSize}px ${photoSize}px`,
        ].join(", ");
        el.style.backgroundPosition = [
          `${-localX}px ${-localY}px`,
          `${-(biasX + localX)}px ${-(biasY + localY)}px`,
        ].join(", ");
        el.classList.add("text-image-mask");
      });
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
          ".hero-sub-fade",
          { autoAlpha: 0, y: -30, ease: "none", duration: 0.6 },
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

          <div className="hero-fade hero-sub-fade mt-6 max-w-xl font-mono text-xs uppercase leading-relaxed tracking-[0.14em] text-paper/70 sm:text-sm md:mt-8">
            Grafisch vormgever bij UP International — ik ontwikkel merken,
            redactionele systemen en digitale vormgeving, van concept tot
            in detail uitgewerkt.
          </div>
        </div>

        <div className="hero-fade hero-ticker -mx-6 border-y border-paper/15 py-3 md:-mx-10">
          <HorizontalMarquee
            text="Grafisch Vormgever bij UP International ✦"
            reverse
            textClassName="font-mono text-xs uppercase tracking-[0.14em] text-paper/60 sm:text-sm"
          />
        </div>

        <div className="flex items-end justify-between pt-6">
          <div className="hero-fade flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.14em] text-paper/55">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-paper/60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-paper" />
            </span>
            Open voor freelance &amp; samenwerkingen — 2026
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
