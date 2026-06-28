"use client";

import { useEffect } from "react";

/**
 * Highlights the deep-linked paragraph/heading and KEEPS it highlighted until
 * the reader reloads or jumps to a different anchor. Clicking does NOT clear it.
 *
 * We drive it from JS rather than CSS `:target` because a `:target` style would
 * apply at page load before Next scrolls to the anchor. The element can render
 * a beat after mount (especially in dev), so we poll for it briefly.
 */
export function TargetHighlighter() {
  useEffect(() => {
    let cancelled = false;
    let current: HTMLElement | null = null;

    const clear = () => {
      if (current) {
        current.classList.remove("sg-flash");
        current = null;
      }
    };

    const targetId = () => {
      const hash = window.location.hash;
      if (hash.length < 2) return null;
      try {
        return decodeURIComponent(hash.slice(1));
      } catch {
        return hash.slice(1);
      }
    };

    const highlight = (attempt = 0) => {
      if (cancelled) return;
      const id = targetId();
      if (!id) return;

      const el = document.getElementById(id);
      if (!el) {
        if (attempt < 20) window.setTimeout(() => highlight(attempt + 1), 100);
        return;
      }

      clear(); // drop any previous highlight before marking the new target
      el.scrollIntoView({ block: "start" });
      el.classList.add("sg-flash");
      current = el;
    };

    highlight();

    // Re-highlight if the reader jumps to a different anchor; otherwise it just
    // stays until reload.
    const onHashChange = () => highlight();
    window.addEventListener("hashchange", onHashChange);

    return () => {
      cancelled = true;
      window.removeEventListener("hashchange", onHashChange);
    };
  }, []);

  return null;
}
