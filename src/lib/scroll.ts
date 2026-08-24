import type Lenis from "lenis";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

export function scrollToHash(hash: string) {
  if (hash === "#top") {
    if (window.__lenis) {
      window.__lenis.scrollTo(0, { duration: 1.4 });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    return;
  }

  const el = document.querySelector<HTMLElement>(hash);
  if (!el) return;

  if (window.__lenis) {
    window.__lenis.scrollTo(el, { duration: 1.4, offset: -20 });
  } else {
    el.scrollIntoView({ behavior: "smooth" });
  }
}
