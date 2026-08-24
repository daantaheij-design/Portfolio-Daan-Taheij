"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";

const CROP = "absolute h-3 w-3 border-ink/40";

export default function PlaceholderVisual({
  index,
  total,
  tone = "paper",
  label,
}: {
  index: string;
  total: number;
  tone?: "paper" | "ink";
  label: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const smx = useSpring(mx, { stiffness: 120, damping: 20, mass: 0.5 });
  const smy = useSpring(my, { stiffness: 120, damping: 20, mass: 0.5 });

  const translateX = useTransform(smx, [0, 1], [-14, 14]);
  const translateY = useTransform(smy, [0, 1], [-14, 14]);
  const rotate = useTransform(smx, [0, 1], [-1.4, 1.4]);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width);
    my.set((e.clientY - rect.top) / rect.height);
  };

  const handleLeave = () => {
    mx.set(0.5);
    my.set(0.5);
  };

  const isInk = tone === "ink";

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      data-cursor="view"
      data-cursor-label="Bekijk"
      className={`group relative aspect-[4/5] w-full overflow-hidden sm:aspect-[16/10] ${
        isInk ? "bg-ink" : "bg-paper-dim"
      }`}
    >
      <div
        className={`noise-layer absolute inset-0 ${
          isInk ? "opacity-[0.05] invert" : "opacity-[0.06]"
        }`}
      />

      <motion.div
        style={{ x: translateX, y: translateY, rotate }}
        className="pointer-events-none absolute inset-[-8%] flex items-center justify-center transition-[scale] duration-500 ease-out group-hover:scale-[1.03]"
      >
        <span
          className={`font-display select-none text-[26vw] font-semibold leading-none sm:text-[13vw] ${
            isInk ? "text-paper/[0.07]" : "text-ink/[0.07]"
          }`}
        >
          {index}
        </span>
      </motion.div>

      <div
        className={`absolute inset-6 flex items-end justify-between font-mono text-[10px] uppercase tracking-[0.14em] sm:inset-8 ${
          isInk ? "text-paper/50" : "text-ink/45"
        }`}
      >
        <span>{label}</span>
        <span>
          {index} / {String(total).padStart(2, "0")}
        </span>
      </div>

      <span
        className={`${CROP} left-4 top-4 border-l border-t sm:left-6 sm:top-6 ${
          isInk ? "border-paper/40" : ""
        }`}
      />
      <span
        className={`${CROP} right-4 top-4 border-r border-t sm:right-6 sm:top-6 ${
          isInk ? "border-paper/40" : ""
        }`}
      />
      <span
        className={`${CROP} bottom-4 left-4 border-b border-l sm:bottom-6 sm:left-6 ${
          isInk ? "border-paper/40" : ""
        }`}
      />
      <span
        className={`${CROP} bottom-4 right-4 border-b border-r sm:bottom-6 sm:right-6 ${
          isInk ? "border-paper/40" : ""
        }`}
      />

      <div
        className={`absolute inset-0 origin-bottom scale-y-0 transition-transform duration-700 ease-out group-hover:scale-y-100 ${
          isInk ? "bg-paper/[0.04]" : "bg-ink/[0.04]"
        }`}
      />
    </div>
  );
}
