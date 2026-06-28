"use client";

import { useEffect } from "react";

/**
 * Flashes the deep-linked paragraph/heading when you arrive at it.
 *
 * A CSS `:target` animation fires at page load — before Next.js scrolls to the
 * anchor — so the flash finishes off-screen and is never seen. Instead we drive
 * it from JS: find the target, scroll it into view (scroll-margin clears the
 * navbar), then add `.sg-flash` so the highlight plays while it's visible.
 *
 * The element can render a beat after mount (especially in dev), so we poll for
 * it briefly before giving up.
 */
export function TargetHighlighter() {
  useEffect(() => {
    let cancelled = false;

    const targetId = () => {
      const hash = window.location.hash;
      if (hash.length < 2) return null;
      try {
        return decodeURIComponent(hash.slice(1));
      } catch {
        return hash.slice(1);
      }
    };

    const flash = (attempt = 0) => {
      if (cancelled) return;
      const id = targetId();
      if (!id) return;

      const el = document.getElementById(id);
      if (!el) {
        // Element not rendered yet — retry for ~2s, then give up.
        if (attempt < 20) window.setTimeout(() => flash(attempt + 1), 100);
        return;
      }

      el.scrollIntoView({ block: "start" });
      el.classList.remove("sg-flash");
      // Force reflow so re-adding the class restarts the animation.
      void el.offsetWidth;
      el.classList.add("sg-flash");
      window.setTimeout(() => {
        if (!cancelled) el.classList.remove("sg-flash");
      }, 2700);
    };

    flash();
    const onHashChange = () => flash();
    window.addEventListener("hashchange", onHashChange);
    return () => {
      cancelled = true;
      window.removeEventListener("hashchange", onHashChange);
    };
  }, []);

  return null;
}
