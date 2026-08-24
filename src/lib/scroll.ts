import type Lenis from "lenis";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

export function scrollToHash(hash: string) {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const behavior: ScrollBehavior = reduced ? "auto" : "smooth";

  if (hash === "#top") {
    if (window.__lenis) {
      window.__lenis.scrollTo(0, { duration: reduced ? 0 : 1.4 });
    } else {
      window.scrollTo({ top: 0, behavior });
    }
    return;
  }

  const el = document.querySelector<HTMLElement>(hash);
  if (!el) return;

  if (window.__lenis) {
    window.__lenis.scrollTo(el, { duration: reduced ? 0 : 1.4, offset: -20 });
  } else {
    el.scrollIntoView({ behavior });
  }
}
