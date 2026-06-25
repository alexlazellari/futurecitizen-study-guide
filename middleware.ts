import { NextResponse, type NextRequest } from "next/server";

// The only host these pages should be indexed under. Everything else — the
// raw *.vercel.app production domain and preview deployments — must be told
// noindex so it never competes with the canonical pages on the real domain.
const CANONICAL_HOST = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.futurecitizen.co.uk"
)
  .replace(/^https?:\/\//, "")
  .replace(/\/+$/, "");

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // When this app is served through the marketing-zone proxy
  // (www.futurecitizen.co.uk/study-guide/*), Next.js forwards the visitor's
  // original host in x-forwarded-host. A direct hit on the *.vercel.app
  // deployment domain carries the vercel.app host instead.
  const effectiveHost =
    request.headers.get("x-forwarded-host") ??
    request.headers.get("host") ??
    "";

  // Fail safe: only add noindex when we positively recognise a non-canonical
  // host. If the host is empty/unknown we leave the page indexable rather than
  // risk deindexing the real site.
  const isVercelDomain = effectiveHost.endsWith(".vercel.app");
  const isCanonical = effectiveHost === CANONICAL_HOST;

  if (isVercelDomain && !isCanonical) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }

  return response;
}

export const config = {
  // Run on page requests; skip Next.js internals and static assets.
  // The bare "/" entry is required because Next.js prepends basePath
  // ("/study-guide") to matchers, and the catch-all below would otherwise
  // miss the basePath root itself (the study-guide home page).
  matcher: ["/", "/((?!_next/static|_next/image|favicon.ico).*)"],
};
