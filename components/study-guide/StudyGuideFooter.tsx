import { StudyGuideLogo } from "@/components/study-guide/StudyGuideLogo";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.futurecitizen.co.uk";

export function StudyGuideFooter() {
  const year = new Date().getFullYear();

  return (
    <div className="w-full">
      <div className="grid gap-10 md:grid-cols-[minmax(0,1.2fr)_minmax(0,2fr)]">
        <div>
          <StudyGuideLogo size="sm" />
          <p className="mt-3 max-w-sm text-base text-slate-600 dark:text-slate-200">
            Clear study notes, fast practice, and mock tests designed for the
            Life in the UK exam.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <div className="text-sm font-semibold tracking-wide text-slate-900 dark:text-slate-100">
              Study
            </div>
            <ul className="mt-3 space-y-2 text-base">
              <li>
                <a
                  className="text-slate-600 hover:underline dark:text-slate-200"
                  href={`${SITE_URL}/study-guide`}
                >
                  Study guide
                </a>
              </li>
              <li>
                <a
                  className="text-slate-600 hover:underline dark:text-slate-200"
                  href={`${SITE_URL}/practice`}
                >
                  Practice
                </a>
              </li>
              <li>
                <a
                  className="text-slate-600 hover:underline dark:text-slate-200"
                  href={`${SITE_URL}/mocks`}
                >
                  Mock test
                </a>
              </li>
              <li>
                <a
                  className="text-slate-600 hover:underline dark:text-slate-200"
                  href={`${SITE_URL}/mistakes`}
                >
                  Mistakes
                </a>
              </li>
            </ul>
          </div>

          <div>
            <div className="text-sm font-semibold tracking-wide text-slate-900 dark:text-slate-100">
              Support
            </div>
            <ul className="mt-3 space-y-2 text-base">
              <li>
                <a
                  className="text-slate-600 hover:underline dark:text-slate-200"
                  href={`${SITE_URL}/#faq`}
                >
                  FAQ
                </a>
              </li>
              <li>
                <a
                  className="text-slate-600 hover:underline dark:text-slate-200"
                  href={`${SITE_URL}/contact`}
                >
                  Contact
                </a>
              </li>
              <li>
                <a
                  className="text-slate-600 hover:underline dark:text-slate-200"
                  href={`${SITE_URL}/about`}
                >
                  About
                </a>
              </li>
            </ul>
          </div>

          <div>
            <div className="text-sm font-semibold tracking-wide text-slate-900 dark:text-slate-100">
              Legal
            </div>
            <ul className="mt-3 space-y-2 text-base">
              <li>
                <a
                  className="text-slate-600 hover:underline dark:text-slate-200"
                  href={`${SITE_URL}/terms`}
                >
                  Terms
                </a>
              </li>
              <li>
                <a
                  className="text-slate-600 hover:underline dark:text-slate-200"
                  href={`${SITE_URL}/privacy`}
                >
                  Privacy
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-3 border-t border-slate-200/70 pt-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between dark:border-neutral-800 dark:text-gray-400">
        <div>© {year} FutureCitizen</div>
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          <a
            className="text-slate-600 hover:underline dark:text-slate-200"
            href="mailto:hello@futurecitizen.co.uk"
          >
            hello@futurecitizen.co.uk
          </a>
        </div>
      </div>
    </div>
  );
}
