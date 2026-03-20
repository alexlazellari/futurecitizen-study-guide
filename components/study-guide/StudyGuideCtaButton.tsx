const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.futurecitizen.co.uk";

export function StudyGuideCtaButton() {
  return (
    <a
      href={`${SITE_URL}/practice`}
      className="group inline-flex h-9 items-center gap-2 rounded-xl bg-slate-900 px-3 text-sm font-semibold text-white shadow-[0_10px_22px_-16px_rgba(15,23,42,0.45)] transition hover:bg-slate-800"
    >
      <span>Start practice</span>
    </a>
  );
}
