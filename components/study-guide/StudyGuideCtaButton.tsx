const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.futurecitizen.co.uk";

// Brand blue and the hover treatment match the shadcn button in the app and
// marketing zones (bg-primary / hover:bg-primary/90), so the CTA reads as the
// same button across all three. Thinner than it was: h-8 rather than h-9,
// font-medium rather than semibold (also what the other zones use), and the
// plain `shadow` in place of a heavy slate-tinted one, which looked like grey
// sludge under a blue button.
export function StudyGuideCtaButton() {
  return (
    <a
      href={`${SITE_URL}/practice`}
      className="group inline-flex h-8 items-center gap-2 rounded-xl bg-primary px-3 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
    >
      <span>Start practice</span>
    </a>
  );
}
