/**
 * Marks this browser's analytics as our own testing.
 *
 * Visiting any study-guide page with `?internal=1` sets this; `?internal=0`
 * clears it. The key is futurecitizen-app's, deliberately: all three apps are
 * served from www.futurecitizen.co.uk, one origin with one localStorage, so a
 * browser marked on any of their pages is marked on every one that reads it.
 * The name is the contract between them; rename it here and the study guide
 * silently stops seeing the mark the others set.
 *
 * Marked, the tag's config carries `traffic_type: "internal"`, GA4's own
 * parameter for this (GoogleAnalytics.tsx), so GA's automatic events
 * (session_start, user_engagement, scroll) are tagged as well as our page
 * views. It does nothing by itself: GA drops those events only once a data
 * filter for internal traffic is set to Active in Admin → Data collection and
 * modification → Data filters.
 */
const STORAGE_KEY_INTERNAL = "lifeuk:internal";

export function isInternalBrowser(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY_INTERNAL) === "1";
  } catch {
    return false;
  }
}

/** Applies `?internal=1` / `?internal=0` from the current URL's query. */
export function applyInternalFlag(search: URLSearchParams): void {
  const value = search.get("internal");
  try {
    if (value === "1") localStorage.setItem(STORAGE_KEY_INTERNAL, "1");
    else if (value === "0") localStorage.removeItem(STORAGE_KEY_INTERNAL);
  } catch {
    // Storage refused; this browser simply isn't marked.
  }
}
