"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { isAnalyticsHost } from "@/lib/analytics/hosts";
import { applyInternalFlag, isInternalBrowser } from "@/lib/analytics/internal";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

// The Firebase uid futurecitizen-app last signed in on this browser. That app
// writes it on sign-in and removes it on sign-out; this one has no accounts,
// so it only ever reads it. Shared through the www origin's localStorage, so
// the name is the contract between the two.
const STORAGE_KEY_ANALYTICS_USER = "lifeuk:analyticsUser";

// Values here are inlined into a script tag, so a "</script>" in one must
// not be able to close it.
const toScript = (value: unknown) => JSON.stringify(value).replace(/</g, "\\u003c");

/**
 * The snippet below defines window.gtag before the first page view is sent
 * (see the page-view effect), so the queue here is only a fallback. If that
 * order ever changed, the first page view of every visit would otherwise be
 * dropped without an error; queued, it still reaches gtag.js, though ahead of
 * the snippet's user_id and config. It must be the `arguments` object, not an
 * array of them: gtag.js only reads an Arguments object in dataLayer as a
 * command, which is why its own shim pushes `arguments`. Same as
 * futurecitizen-app's send() in lib/analytics/track.ts.
 */
function send(..._args: unknown[]): void {
  window.dataLayer = window.dataLayer ?? [];
  if (window.gtag) {
    window.gtag(..._args);
    return;
  }
  // eslint-disable-next-line prefer-rest-params
  window.dataLayer.push(arguments);
}

/**
 * A page_view event, as futurecitizen-app sends them. Until 1 November 2026
 * this re-issued `config` on every route change instead, which is the
 * Universal Analytics pattern rather than what GA4 documents for single-page
 * apps, and would now have to repeat traffic_type on every call to be sure it
 * was kept. traffic_type is added here too because the config only picks up a
 * mark made mid-visit from the next full page load.
 *
 * page_path is read from the address bar, /study-guide included, like
 * page_location. usePathname() leaves the basePath off, so this home page
 * used to report "/", which is the marketing home's path.
 */
function trackPageView() {
  send("event", "page_view", {
    page_path: window.location.pathname + window.location.search,
    page_location: window.location.href,
    page_title: document.title,
    ...(isInternalBrowser() ? { traffic_type: "internal" } : {}),
  });
}

export function GoogleAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.toString();

  // Decided on the client, once, because both answers live there: whether
  // this is the real site (lib/analytics/hosts.ts) and whether this browser is
  // marked as our own testing. Null until then, so neither the tag nor a page
  // view goes out before both are known, and the server render matches.
  const [load, setLoad] = useState<{ internal: boolean } | null>(null);

  useEffect(() => {
    if (!measurementId || !isAnalyticsHost(window.location.hostname)) return;
    // Before reading it, so the visit that sets ?internal=1 is marked too.
    applyInternalFlag(new URLSearchParams(window.location.search));
    setLoad({ internal: isInternalBrowser() });
  }, []);

  // Fires once `load` is set, which is what sends the first page view: the
  // snippet below suppresses the automatic one so that navigations and the
  // initial load are reported the same way. The snippet has already run by
  // then, because next/script runs an inline afterInteractive script in its
  // own effect, and React runs a child's effects before its parent's.
  useEffect(() => {
    if (!load || !pathname) return;
    applyInternalFlag(searchParams);
    trackPageView();
    // searchParams changes whenever search does; search is the stable key.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [load, pathname, search]);

  if (!load) {
    return null;
  }

  // traffic_type goes on the config, not only on our page views. GA's
  // automatic events (session_start, user_engagement, scroll) never pass
  // through trackPageView, so tagging those alone would leave our visits in
  // every report even with the Internal Traffic filter Active. Clearing the
  // mark mid-visit takes effect from the next full page load.
  const config = {
    send_page_view: false,
    ...(load.internal ? { traffic_type: "internal" } : {}),
  };
  // user_id makes a signed-in reader's study-guide pages theirs rather than
  // an anonymous twin's, the same account futurecitizen-app's own tag
  // reports. Two things about how, both as on that app's pages:
  //
  // - Through `set`, before `config`, NOT on the config: gtag reads a config
  //   parameter ahead of a `set` one, so an id on the config could never be
  //   replaced or cleared without a reload. Nothing on these pages replaces
  //   it today; this keeps that possible, as it is in the app.
  // - Read by the snippet itself, when it runs, rather than read by React and
  //   inlined: the stored value never becomes part of the page, and it is
  //   read at the last moment before the tag's first hit.
  //
  // It is read once per full page load, and nothing here follows it after
  // that. A sign-in or sign-out in an app tab therefore reaches an open
  // study-guide tab only when that tab reloads: until then, on a shared
  // device, it keeps reporting the previous account. The marketing app's tag
  // reads it the same way. Likewise, if the app's session has lapsed without
  // a sign-out, these pages keep reporting that id until the reader next
  // opens an app page, which notices and forgets it. In its own function: the
  // snippet runs as a top-level classic script, so a bare `var uid` would
  // become window.uid for any other script to trip over.
  const userSet =
    `(function () { try { var uid = localStorage.getItem(${toScript(STORAGE_KEY_ANALYTICS_USER)});` +
    ` if (uid) gtag('set', { user_id: uid }); } catch (e) {} })();`;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          ${userSet}
          gtag('config', '${measurementId}', ${toScript(config)});
        `}
      </Script>
    </>
  );
}
