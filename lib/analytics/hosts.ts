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
 *
 * An allowlist rather than blocking vercel.app, and the same list as
 * futurecitizen-app's lib/analytics/hosts.ts, so every tag on the site agrees
 * on what the site is. Recheck GA's hostName before adding a domain.
 */
const ANALYTICS_HOSTS = new Set(["www.futurecitizen.co.uk", "futurecitizen.co.uk"]);

export function isAnalyticsHost(hostname: string): boolean {
  return ANALYTICS_HOSTS.has(hostname.toLowerCase());
}
