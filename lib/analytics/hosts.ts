/**
 * Where the study guide's GA tag runs: the real site only.
 *
 * Readers reach these pages at www.futurecitizen.co.uk/study-guide, through
 * the marketing app's rewrite, so www is the hostname their browser reports.
 * Vercel also serves this project on its own address
 * (lifeintheuk-study-guide.vercel.app) and on every preview deployment, and
 * anything that loads the tag reports into the one production property all
 * three apps share. The GA audit of 1 November 2026 found bots coming in on
 * vercel.app addresses, each counted as a visitor. Preview deployments and
 * localhost stay out for the same reason: nobody there is a reader.
 * middleware.ts already keeps these addresses out of search results; this
 * keeps them out of GA.
 *
 * An allowlist rather than blocking vercel.app, and the same list as
 * futurecitizen-app's and the marketing app's lib/analytics/hosts.ts, so
 * every tag on the site agrees on what the site is. futurecitizen.co.uk
 * without www never renders a page here (the marketing app redirects it to
 * www), but is listed so the lists stay identical. GA can no longer show
 * readers on any host left off this list, since the tag never loads there,
 * so before adding a domain look for real visits in Vercel's request logs
 * rather than in GA's hostName.
 */
const ANALYTICS_HOSTS = new Set(["www.futurecitizen.co.uk", "futurecitizen.co.uk"]);

export function isAnalyticsHost(hostname: string): boolean {
  return ANALYTICS_HOSTS.has(hostname.toLowerCase());
}
