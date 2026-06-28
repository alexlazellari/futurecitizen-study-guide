"use client";

import { useEffect } from "react";

/**
 * Highlights the deep-linked paragraph/heading and KEEPS it highlighted — like
 * the browser's native text-fragment highlight (#:~:text=) — until the reader
 * clicks or navigates to a different anchor/page.
 *
 * We drive it from JS rather than CSS `:target` because a `:target` style would
 * apply at page load before Next scrolls, and we also want the "clear on next
 * interaction" behavior. The element can render a beat after mount (especially
 * in dev), so we poll for it briefly.
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

    const onHashChange = () => highlight();
    const onClick = () => clear();
    window.addEventListener("hashchange", onHashChange);
    // Clear on the next click anywhere (matches the native text-fragment
    // highlight). Arm it after a beat so the click/navigation that brought the
    // reader here doesn't instantly clear the highlight.
    const armClick = window.setTimeout(
      () => document.addEventListener("click", onClick),
      500,
    );

    return () => {
      cancelled = true;
      window.clearTimeout(armClick);
      window.removeEventListener("hashchange", onHashChange);
      document.removeEventListener("click", onClick);
    };
  }, []);

  return null;
}
