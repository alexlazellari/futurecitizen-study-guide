"use client";

import { useEffect } from "react";

/**
 * Flashes the deep-linked paragraph/heading when you arrive at it.
 *
 * A CSS `:target` animation fires at page load — before Next.js scrolls to the
 * anchor — so the flash finishes off-screen and is never seen. Instead we drive
 * it from JS: just after mount (and on every hash change) we find the target,
 * scroll it into view ourselves (scroll-margin clears the navbar), then add the
 * `.sg-flash` class so the highlight plays while the passage is actually visible.
 */
export function TargetHighlighter() {
  useEffect(() => {
    const flash = () => {
      const hash = window.location.hash;
      if (hash.length < 2) return;

      let id = hash.slice(1);
      try {
        id = decodeURIComponent(id);
      } catch {
        // fall back to the raw id
      }

      const el = document.getElementById(id);
      if (!el) return;

      el.scrollIntoView({ block: "start" });
      el.classList.remove("sg-flash");
      // Force reflow so re-adding the class restarts the animation.
      void el.offsetWidth;
      el.classList.add("sg-flash");
      window.setTimeout(() => el.classList.remove("sg-flash"), 2700);
    };

    // Let the browser/Next finish the initial scroll-to-anchor first.
    const initial = window.setTimeout(flash, 250);
    window.addEventListener("hashchange", flash);
    return () => {
      window.clearTimeout(initial);
      window.removeEventListener("hashchange", flash);
    };
  }, []);

  return null;
}
