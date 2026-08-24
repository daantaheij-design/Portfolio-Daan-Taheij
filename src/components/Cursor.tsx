"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

type CursorVariant = "default" | "link" | "view" | "drag";

const QUERY = "(hover: hover) and (pointer: fine)";

function subscribeFinePointer(callback: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getFinePointerSnapshot() {
  return window.matchMedia(QUERY).matches;
}

function useFinePointer() {
  return useSyncExternalStore(
    subscribeFinePointer,
    getFinePointerSnapshot,
    () => false
  );
}

export default function Cursor() {
  const enabled = useFinePointer();
  const [variant, setVariant] = useState<CursorVariant>("default");
  const [label, setLabel] = useState<string>("");

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { stiffness: 500, damping: 40, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 500, damping: 40, mass: 0.4 });

  useEffect(() => {
    if (!enabled) return;

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };

    const over = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest<HTMLElement>(
        "[data-cursor]"
      );
      if (target) {
        const v = (target.dataset.cursor as CursorVariant) || "link";
        setVariant(v);
        setLabel(target.dataset.cursorLabel || "");
      } else {
        setVariant("default");
        setLabel("");
      }
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  const sizes: Record<CursorVariant, number> = {
    default: 10,
    link: 56,
    view: 96,
    drag: 96,
  };
  const size = sizes[variant];

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[999] flex items-center justify-center rounded-full mix-invert bg-paper"
      style={{
        x: springX,
        y: springY,
        translateX: "-50%",
        translateY: "-50%",
      }}
      animate={{ width: size, height: size }}
      transition={{ type: "spring", stiffness: 400, damping: 32 }}
    >
      {label && (
        <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink">
          {label}
        </span>
      )}
    </motion.div>
  );
}
