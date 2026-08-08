import { cn } from "@/lib/utils";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.futurecitizen.co.uk";

type LogoSize = "sm" | "md";

type StudyGuideLogoProps = {
  size?: LogoSize;
  className?: string;
  asLink?: boolean;
};

const SIZE_STYLES: Record<LogoSize, { label: string }> = {
  sm: { label: "text-sm" },
  md: { label: "text-base" },
};

export function StudyGuideLogo({
  size = "md",
  className,
  asLink = true,
}: StudyGuideLogoProps) {
  const { label } = SIZE_STYLES[size];

  const content = (
    <span
      className={cn(
        label,
        // Inherits Nextra's system font stack rather than naming a family.
        // Space Grotesk was this zone's only webfont — 22KB fetched on every
        // page for these four words.
        // Inline rather than a flex row so the gap between the two words is a
        // real space character: a flex container discards whitespace between
        // its items, which would leave the document text closed up as one word
        // while the site declares itself "Future Citizen".
        "inline-block whitespace-nowrap tracking-tight",
      )}
    >
      {/*
        The document text here is exactly "Future Citizen". The brackets are
        pseudo-element content from globals.css, so they render for readers
        without becoming characters a crawler extracts — see the
        .wordmark-brackets comment there for what happened when they were text.
      */}
      <span className="font-semibold text-[#4288c9]">Future</span>{" "}
      <span className="wordmark-brackets inline-block">
        <span className="font-medium mx-0.5 text-slate-800 dark:text-slate-100">Citizen</span>
      </span>
    </span>
  );

  const wrapperClassName = cn("inline-flex items-center", className);

  return asLink ? (
    <a href={SITE_URL} aria-label="Future Citizen home" className={wrapperClassName}>
      {content}
    </a>
  ) : (
    <span aria-label="Future Citizen" className={wrapperClassName}>
      {content}
    </span>
  );
}
